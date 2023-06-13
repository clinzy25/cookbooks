import { IBreadcrumb } from '@/types/@types.breadcrumb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import styled from 'styled-components'

const Breadcrumb: FC = () => {
  const { query, pathname } = useRouter()
  const [breadcrumb, setBreadcrumb] = useState<IBreadcrumb[]>([])

  const handleBreadcrumb = () => {
    const cookbook_name = decodeURIComponent(query.cookbook_name as string)
    const recipe_name = decodeURIComponent(query.recipe_name as string)
    const search_val = decodeURIComponent(query.value as string)
    const splitPath = window.location.pathname.split('/').filter(v => v)
    const pathsToQueryMap: { [key: string]: string } = {
      cookbooks: cookbook_name,
      recipe: recipe_name,
      search: search_val,
    }
    const home = {
      display: 'Your Cookbooks',
      href: '/cookbooks',
    }
    const newBreadcrumb = [home]

    if (pathname !== home.href) {
      for (let i = 0; i < splitPath.length; i++) {
        const path = splitPath[i]
        const guid = splitPath[i + 1]
        if (pathsToQueryMap[path]) {
          const params = window.location.href.split('?')[1]
          const _breadcrumb = {
            display: pathsToQueryMap[path],
            href: `/${path}/${guid ? guid : ''}?${params}`,
          }
          newBreadcrumb.push(_breadcrumb)
        }
      }
    }
    setBreadcrumb(newBreadcrumb)
  }

  useEffect(() => {
    handleBreadcrumb()
  }, [pathname, query]) // eslint-disable-line

  return (
    <Style id='breadcrumb-wrapper'>
      {breadcrumb.map((bc, i) => (
        <div key={bc.display}>
          <Link className='breadcrumb' href={i === breadcrumb.length - 1 ? '#' : bc.href}>
            {i > 0 && <BiChevronRight className='icon' />}
            {bc.display}
          </Link>
        </div>
      ))}
    </Style>
  )
}

const Style = styled.nav`
  margin: 20px 0 0 60px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  div {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .breadcrumb {
    letter-spacing: 0.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.secondaryTextColor};
    white-space: nowrap;
    animation: breadcrumbIn 0.1s ease-out;
    @keyframes breadcrumbIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    .icon {
      vertical-align: middle;
      font-size: 1.1rem;
      margin-bottom: 3px;
    }
    &:hover {
      text-decoration: underline;
      color: #858585;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    margin: 10px 0 0 15px;
    font-size: 0.9rem;
  }
`

export default Breadcrumb
