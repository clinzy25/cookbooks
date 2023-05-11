import { IBreadcrumb } from '@/types/@types.breadcrumb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

const Breadcrumb: FC = () => {
  const { query, pathname } = useRouter()
  const [breadcrumb, setBreadcrumb] = useState<IBreadcrumb[]>([])

  const handleBreadcrumb = () => {
    const cookbook_name = decodeURIComponent(query.cookbook_name as string)
    const recipe_name = decodeURIComponent(query.recipe_name as string)
    const search_val = decodeURIComponent(query.value as string)
    const splitPath = window.location.pathname.split('/').filter(v => v)
    const paths: { [key: string]: string } = {
      cookbooks: cookbook_name,
      recipe: recipe_name,
      search: search_val,
    }
    const home = {
      display: 'Your Cookbooks',
      href: '/cookbooks',
    }
    const breadcrumb = [home]

    if (pathname !== '/cookbooks') {
      for (let i = 0; i < splitPath.length; i++) {
        const path = splitPath[i]
        const guid = splitPath[i + 1]
        if (paths[path]) {
          const params = window.location.href.split('?')[1]
          const bc = guid
            ? {
                display: paths[path],
                href: `/${path}/${guid}?${params}`,
              }
            : {
                display: paths[path],
                href: `/${path}?${params}`,
              }
          breadcrumb.push(bc)
        }
      }
    }
    setBreadcrumb(breadcrumb)
  }

  useEffect(() => {
    handleBreadcrumb()
  }, [pathname, query]) // eslint-disable-line

  return (
    <Style>
      {breadcrumb.map((bc, i) => (
        <>
          {i > 0 && ' > '}
          <Link
            className='breadcrumb'
            key={i === breadcrumb.length ? '#' : bc.display}
            href={bc.href}>
            {bc.display}
          </Link>
        </>
      ))}
    </Style>
  )
}

const Style = styled.nav`
  margin: 20px 0 0 60px;
  .breadcrumb {
    letter-spacing: 0.5px;
    font-weight: 600;
    color: #585858;
    &:hover {
      text-decoration: underline;
      color: #858585;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    margin: 10px 0 0 15px;
  }
`

export default Breadcrumb
