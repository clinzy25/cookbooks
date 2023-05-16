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
import { DropdownAnimationMixin } from '@/styles/mixins'

const Search: FC = () => {
  const {
    query: { cookbook, cookbook_name },
  } = useRouter()
  const { user } = useUser()
  const { handleServerError } = useAppContext() as IAppContext
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<ISearchResults | null>(null)

  const resultsRef = useRef(null)
  useOutsideAlerter(resultsRef, () => setSearchResults(null))
  const size = useWindowSize()

  const searchRecipes = useCallback(async () => {
    const query = `${cookbook ? `cookbook_guid=${cookbook}` : `user_guid=${user?.sub}`}`
    try {
      const res = await fetcher(`${api}/search/recipes?${query}&search_val=${searchVal}`)
      setSearchResults(res)
    } catch (e) {
      handleServerError(e)
    }
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

  useEffect(() => {
    searchVal ? searchRecipes() : setSearchResults(null)
  }, [searchVal]) // eslint-disable-line

  return (
    <Style width={size.width} searchResults={searchResults}>
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
              href={handleRecipeHref(r)}
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
              href={handleTagHref(t)}
              key={t.guid}>
              {t.name}
            </Link>
          </>
        ))}
      </div>
    </Style>
  )
}

type StyleProps = {
  searchResults: ISearchResults | null
  width: number | undefined
}

const Style = styled.div<StyleProps>`
  display: flex;
  height: 100%;
  align-items: flex-start;
  .search-ctr {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.buttonBackground};
    border: 1px solid ${({ theme }) => theme.softBorder};
    border-radius: ${props => (props.searchResults ? '10px' : '25px')};
    z-index: 5;
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
        line-height: 36px;
        &:focus,
        &:not(:placeholder-shown) {
          width: 240px;
          padding: 0 6px;
        }
      }
      #btn-ctr {
        width: 36px;
        #search-btn {
          height: 100%;
          font-size: 1.5rem;
          border-radius: 25px;
          transition: all 0.3s ease-out;
          cursor: pointer;
        }
      }
    }
    h3,
    .search-result {
      ${DropdownAnimationMixin}
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
      border-radius: 10px;
      &:hover {
        background-color: ${({ theme }) => theme.buttonBackgroundHover};
      }
    }
    &:hover > div > input {
      width: calc(
        ${props =>
            props.width && props.width > props.theme.breakpointMobile
              ? '375'
              : props.width}px - 135px
      );
      padding: 0 6px;
    }
    &:active > div > input {
      width: calc(
        ${props =>
            props.width && props.width > props.theme.breakpointMobile
              ? '375'
              : props.width}px - 135px
      );
      padding: 0 6px;
    }
  }
`

export default Search