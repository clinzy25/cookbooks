import { api, fetcher } from '@/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

const Navbar = () => {
  const {
    query: { id },
    pathname,
  } = useRouter()
  const [tags, setTags] = useState([])
  const { data, error } = useSWR(`${api}/tags?cookbook_guid=${id}`, fetcher)

  useEffect(() => {
    data && setTags(data)
  }, [data])

  return (
    <Style>
      <div>
        <Link href='/cookbooks'>Cookbooks App</Link>
        <input id='search-field' placeholder='Search all recipes...' type='text' />
      </div>
      {pathname === '/cookbooks/[id]' && (
        <Link href={`/search/cookbooks/${id}`} id='tag-list'>
          {error
            ? 'Error loading tags'
            : tags?.map(t => (
                <span className='tag' key={t}>
                  #{t}
                </span>
              ))}
        </Link>
      )}
      <a href='/api/auth/logout'>
        <button>Logout</button>
      </a>
    </Style>
  )
}

const Style = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 65px;
  border-bottom: 1px solid gray;
  padding: 15px;
  #search-field {
    height: 40px;
    margin-left: 15px;
  }
  .tag {
    border: 1px solid gray;
    margin: 0 5px;
    border-radius: 25px;
    padding: 0 7px;
  }
  button {
    padding: 10px 20px;
    width: min-content;
    white-space: nowrap;
    border: 1px solid gray;
    border-radius: 10px;
  }
`

export default Navbar
