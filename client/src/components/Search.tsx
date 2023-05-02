import { api, fetcher } from '@/api'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { ISearchResult, ISearchResults } from '@/types/@types.search'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BiSearch } from 'react-icons/bi'
import { useRouter } from 'next/router'

const Search: FC = () => {
  const {
    query: { cookbook },
  } = useRouter()
  const { user } = useUser()
  const { handleServerError } = useAppContext() as IAppContext
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<ISearchResults | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)

  const resultsRef = useRef(null)
  useOutsideAlerter(resultsRef, () => setSearchResults(null))

  const searchRecipes = useCallback(async () => {
    const query = `${
      cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`
    }&search_val=${searchVal}`
    try {
      const res = await fetcher(`${api}/search/recipes?${query}`)
      setSearchResults(res.data)
    } catch (e) {
      handleServerError(e)
    }
  }, [searchVal, cookbook, user?.sub, handleServerError])

  useEffect(() => {
    searchVal ? searchRecipes() : setSearchResults(null)
  }, [searchVal, searchRecipes])

  return (
    <Style showSearchBar={showSearchBar}>
      <div id='search-ctr'>
        <BiSearch onClick={() => setShowSearchBar(true)} id='search-icon' />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder={cookbook ? 'Search this cookbook...' : 'Search all recipes...'}
          type='text'
        />
      </div>
      {searchResults && (
        <div ref={resultsRef} className='results-ctr'>
          {searchResults?.recipes.map((r: ISearchResult, i) => (
            <>
              {i === 0 && <h3>Recipes</h3>}
              <p>
                <Link
                  onClick={() => setSearchResults(null)}
                  href={`/cookbooks/${r.cookbook_guid}/recipe/${r.guid}`}
                  key={r.guid}>
                  {r.name}
                </Link>
              </p>
            </>
          ))}
          {searchResults?.tags.map((t: ISearchResult, i) => (
            <>
              {i === 0 && <h3>Tags</h3>}
              <p>
                <Link
                  onClick={() => setSearchResults(null)}
                  href={`/search/${t.name.substring(1)}`}
                  key={t.guid}>
                  {t.name}
                </Link>
              </p>
            </>
          ))}
        </div>
      )}
    </Style>
  )
}

type StyleProps = {
  showSearchBar: boolean
}

const Style = styled.div<StyleProps>`
  display: flex;
  align-items: center;
  height: 100%;
  #search-ctr {
    position: relative;
    height: 100%;
    input {
      height: 100%;
      border-radius: 25px;
      border: 1px solid gray;
      padding: 0 15px;
      font-size: 1rem;
    }
    #search-icon {
      position: absolute;
      right: 0;
      font-size: 2.5rem;
      border-radius: 25px;
      border: 1px solid gray;
      padding: 5px;
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .results-ctr {
    position: absolute;
    background-color: white;
    border: 1px solid gray;
    z-index: 3;
  }
  @media screen and (max-width: 800px) {
    #search-ctr {
      width: 100%;
      input {
        width: ${props => (props.showSearchBar ? '100%' : '40px')};
        visibility: ${props => (props.showSearchBar ? 'visibile' : 'hidden')};
      }
    }
  }
`

export default Search
