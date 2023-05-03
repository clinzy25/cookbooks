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

  const resultsRef = useRef(null)
  useOutsideAlerter(resultsRef, () => setSearchResults(null))

  const searchRecipes = useCallback(async () => {
    const query = `${
      cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`
    }&search_val=${searchVal}`
    try {
      const res = await fetcher(`${api}/search/recipes?${query}`)
      setSearchResults(res)
    } catch (e) {
      handleServerError(e)
    }
  }, [searchVal, cookbook, user?.sub, handleServerError])

  useEffect(() => {
    searchVal ? searchRecipes() : setSearchResults(null)
  }, [searchVal]) // eslint-disable-line

  return (
    <Style>
      <div className='search-ctr'>
        <div>
          <input
            type='text'
            placeholder={cookbook ? 'Search this cookbook...' : 'Search all recipes...'}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onBlur={() => setTimeout(() => setSearchResults(null), 200)}
            onFocus={() => searchVal && searchRecipes()}
          />
          <div id='btn-ctr'>
            <BiSearch id='search-btn' />
          </div>
        </div>
        {searchResults?.recipes.map((r: ISearchResult, i) => (
          <>
            {i === 0 && <h3>Recipes</h3>}
            <Link
              title={r.name}
              className='search-result'
              onClick={() => setSearchVal('')}
              href={`/cookbooks/${r.cookbook_guid}/recipe/${r.guid}`}
              key={r.guid}>
              {r.name}
            </Link>
          </>
        ))}
        {searchResults?.tags.map((t: ISearchResult, i) => (
          <>
            {i === 0 && <h3>Tags</h3>}
            <Link
              className='search-result'
              onClick={() => setSearchVal('')}
              href={
                cookbook
                  ? `/cookbooks/${cookbook}/search/${t.name.substring(1)}`
                  : `search/${t.name.substring(1)}`
              }
              key={t.guid}>
              {t.name}
            </Link>
          </>
        ))}
      </div>
    </Style>
  )
}

const Style = styled.div`
  display: flex;
  align-items: flex-start;
  height: 100%;
  .search-ctr {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    border: 1px solid ${({ theme }) => theme.softBorder};
    border-radius: 25px;
    z-index: 3;
    transition: all 0.3s ease-out;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      input {
        outline: none;
        border: none;
        background: none;
        width: 0;
        padding: 0;
        transition: all 0.3s ease-out;
        line-height: 40px;
        &:focus,
        &:not(:placeholder-shown) {
          width: 240px;
          padding: 0 6px;
        }
      }
      #btn-ctr {
        width: 40px;
        #search-btn {
          height: 100%;
          font-size: 1.5rem;
          border-radius: 25px;
          transition: all 0.3s ease-out;
          cursor: pointer;
        }
      }
    }
    &:hover > div > input {
      width: 240px;
      padding: 0 6px;
    }
    &:active > div > input {
      width: 240px;
      padding: 0 6px;
    }
    h3 {
      padding: 5px;
      border-bottom: 1px solid ${({ theme }) => theme.softBorder};
    }
    .search-result {
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px;
      &:hover {
        background-color: #cecece;
      }
    }
  }
`

export default Search
