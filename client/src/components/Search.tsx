import { api } from '@/api'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { ISearchResult, ISearchResults } from '@/types/@types.search'
import { useOutsideAlerter } from '@/utils/utils.hooks'
import { serverErrorMessage } from '@/utils/utils.errors.server'
import { useUser } from '@auth0/nextjs-auth0/client'
import axios from 'axios'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BiSearch } from 'react-icons/bi'

const Search = () => {
  const { user } = useUser()
  const { currentCookbook, setSnackbar } = useAppContext() as AppContextType
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<ISearchResults | null>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const resultsRef = useRef(null)
  useOutsideAlerter(resultsRef, () => setSearchResults(null))

  const searchRecipes = useCallback(async () => {
    const query = `${
      currentCookbook ? `cookbook_guid=${currentCookbook.guid}` : `user_guid=${user?.sub}`
    }&search_val=${searchVal}`
    try {
      const res = await axios.get(`${api}/search/recipes?${query}`)
      setSearchResults(res.data)
    } catch (e) {
      serverErrorMessage(e, setSnackbar)
    }
  }, [searchVal, currentCookbook, setSnackbar, user?.sub])

  useEffect(() => {
    searchVal ? searchRecipes() : setSearchResults(null)
  }, [searchVal, searchRecipes])

  return (
    <Style searchExpanded={searchExpanded}>
      <div id='search-ctr'>
        <BiSearch onClick={() => setSearchExpanded(true)} id='search-icon' />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder={currentCookbook ? 'Search this cookbook...' : 'Search all recipes...'}
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
                  href={`/recipe/${r.guid}`}
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
                  href={`/search/recipes/${t.name.substring(1)}`}
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
  searchExpanded: boolean
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
        width: ${props => (props.searchExpanded ? '100%' : '40px')};
        visibility: ${props => (props.searchExpanded ? 'visibile' : 'hidden')};
      }
    }
  }
`

export default Search
