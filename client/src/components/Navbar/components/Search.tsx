import { api, fetcher } from '@/api'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import { ISearchResult, ISearchResults } from '@/types/@types.search'
import { useOutsideAlerter, useWindowSize } from '@/utils/utils.hooks'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BiSearch } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { Globals } from '../../../styles/theme'

const Search: FC = () => {
  const {
    query: { cookbook, cookbook_name },
  } = useRouter()
  const { user } = useUser()
  const { handleServerError } = useAppContext() as IAppContext
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<ISearchResults | null>(null)
  const [loading, setLoading] = useState(true)

  const resultsRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useOutsideAlerter(resultsRef, () => setSearchResults(null))
  const { width } = useWindowSize()

  const searchRecipes = useCallback(async () => {
    const query = `${cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`}`
    try {
      setLoading(true)
      const res = await fetcher(`${api}/search/recipes?${query}&search_val=${searchVal}`)
      setSearchResults(res)
    } catch (e) {
      handleServerError(e)
    }
    setLoading(false)
  }, [searchVal, cookbook, user?.sub, handleServerError])

  const handleRecipeHref = (recipe: ISearchResult) => {
    const recipe_name = encodeURIComponent(recipe.name)
    const recipe_guid = encodeURIComponent(recipe.guid)
    const c_name = encodeURIComponent(cookbook_name?.toString() as string)
    const owner = user?.sub === recipe.creator_user_guid ? 1 : 0
    if (cookbook) {
      return `/cookbooks/${cookbook}/recipe/${recipe_guid}?cookbook_name=${c_name}&recipe_name=${recipe_name}&owner=${owner}`
    }
    return `/recipe/${recipe_guid}?recipe_name=${recipe_name}&owner=${owner}`
  }

  const handleTagHref = (tag: ISearchResult) => {
    const value = encodeURIComponent(tag.name.substring(1))
    const c_name = encodeURIComponent(cookbook_name?.toString() as string)
    if (cookbook) {
      return `/cookbooks/${cookbook}/search?cookbook_name=${c_name}&value=${value}`
    }
    return `/search?value=${value}`
  }

  const showNoResultsMsg = () =>
    searchResults?.tags.length === 0 &&
    searchResults?.recipes.length === 0 &&
    searchVal &&
    !loading

  useEffect(() => {
    searchVal ? searchRecipes() : setSearchResults(null)
  }, [searchVal])

  return (
    <Style width={width} searchResults={searchResults}>
      <div className='search-ctr'>
        <div>
          <input
            type='text'
            placeholder={cookbook ? 'Search this cookbook...' : 'Search all recipes...'}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onBlur={() => setTimeout(() => setSearchResults(null), 200)}
            onFocus={() => searchVal && searchRecipes()}
            ref={inputRef}
          />
          <div id='btn-ctr'>
            <BiSearch
              onClick={() =>
                !(document.activeElement === inputRef.current) && inputRef.current?.focus()
              }
              id='search-btn'
            />
          </div>
        </div>
        {searchResults?.recipes.map((r: ISearchResult, i) => (
          <>
            {i === 0 && <h2>Recipes</h2>}
            <Link
              title={r.name}
              className='search-result'
              onClick={() => setSearchVal('')}
              href={handleRecipeHref(r)}
              key={r.guid}>
              {r.name}
            </Link>
          </>
        ))}
        {searchResults?.tags.map((t: ISearchResult, i) => (
          <>
            {i === 0 && <h2>Tags</h2>}
            <Link
              className='search-result'
              onClick={() => setSearchVal('')}
              href={handleTagHref(t)}
              key={t.guid}>
              {t.name}
            </Link>
          </>
        ))}
        {showNoResultsMsg() && <h2>No Results :(</h2>}
      </div>
    </Style>
  )
}

const handleSearchBarWidth = (props: StyleProps) => {
  return `calc(${
    props.width && props.width > Number(props.theme.breakpointMobile) ? '375' : props.width
  }px - 120px)`
}

type StyleProps = {
  searchResults: ISearchResults | null
  width: number | undefined
  theme: typeof Globals
}

const Style = styled.div<StyleProps>`
  display: flex;
  height: 100%;
  align-items: ${props => (props.searchResults ? 'flex-start' : 'center')};
  .search-ctr {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.buttonBackground};
    border: 1px solid ${({ theme }) => theme.softBorder};
    border-radius: ${props => (props.searchResults ? '10px' : '50px')};
    z-index: 5;
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
        line-height: 36px;
        font-size: 16px;
        &:focus,
        &:not(:placeholder-shown) {
          width: ${props => handleSearchBarWidth(props)};
          padding: 0 6px;
        }
      }
      #btn-ctr {
        width: 36px;
        #search-btn {
          height: 100%;
          font-size: 1.4rem;
          border-radius: 25px;
          transition: all 0.3s ease-out;
          cursor: pointer;
        }
      }
    }
    h2 {
      padding: 5px;
      font: 1.4rem Montserrat, sans-serif;
    }
    .search-result {
      max-width: calc(${props => handleSearchBarWidth(props)} + 37px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 4px;
      border-radius: 10px;
      color: ${({ theme }) => theme.secondaryTextColor};
      &:hover {
        background-color: ${({ theme }) => theme.buttonBackgroundHover};
      }
    }
    &:hover > div > input {
      width: ${props => handleSearchBarWidth(props)};
      padding: 0 6px;
    }
  }
`

export default Search
