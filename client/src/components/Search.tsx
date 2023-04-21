import { api } from '@/api'
import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import { ISearchResult, ISearchResults } from '@/types/@types.search'
import { serverErrorMessage } from '@/utils/utils.server.errors'
import { useUser } from '@auth0/nextjs-auth0/client'
import axios from 'axios'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

const Search = () => {
  const { user } = useUser()
  const { currentCookbook, setSnackbar } = useAppContext() as AppContextType
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<ISearchResults | null>(null)

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
    <Style>
      <input
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        placeholder='Search all recipes...'
        type='text'
      />
      <div className='results-ctr'>
        {searchResults?.recipes.length &&
          searchResults.recipes.map((r: ISearchResult, i) => (
            <>
              {i === 0 && <h3>Recipes</h3>}
              <p>
                <Link href={`/recipe/${r.guid}`} key={r.guid}>
                  {r.name}
                </Link>
              </p>
            </>
          ))}
        {searchResults?.tags.length &&
          searchResults.tags.map((t: ISearchResult, i) => (
            <>
              {i === 0 && <h3>Tags</h3>}
              <p>
                <Link href={`/search/recipes/${t.name.substring(1)}`} key={t.guid}>
                  {t.name}
                </Link>
              </p>
            </>
          ))}
      </div>
    </Style>
  )
}

const Style = styled.div`
  input {
    height: 40px;
    margin-left: 15px;
  }
  .results-ctr {
    position: absolute;
    background-color: white;
    border: 1px solid gray;
    z-index: 3;
  }
`

export default Search
