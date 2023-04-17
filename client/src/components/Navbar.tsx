import { api, fetcher } from '@/api'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

type Props = {
  tags: string[]
}

const Navbar = (props: Props) => {
  const {
    query: { id },
    pathname,
  } = useRouter()
  const [tags, setTags] = useState(props.tags)
  const { data, error } = useSWR(`${api}/tags?cookbook_guid=${id}`, fetcher)

  useEffect(() => {
    data && setTags(data)
  }, [data])

  if (!data && !tags) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>error</p>
  }
  return (
    <Style>
      <p>Cookbooks App</p>
      <input placeholder='Search all recipes...' type="text" />
      {pathname.includes('cookbooks') && (
        <div id='tag-list'>
          {!data && !tags
            ? 'loading tags...'
            : error
            ? 'tags error'
            : tags?.map(t => (
                <span className='tag' key={t}>
                  #{t}
                </span>
              ))}
        </div>
      )}
      <a href='/api/auth/logout'>
        <button>Logout</button>
      </a>
    </Style>
  )
}

export async function getServerSideProps(context: {
  params: { id: string }
}): Promise<{ props: Props }> {
  const id = context.params.id
  const tags = await fetcher(`${api}/tags?cookbook_guid=${id}`)
  return { props: { tags } }
}

const Style = styled.div`
  display: flex;
  justify-content: space-between;
  height: 75px;
  .tag {
    border: 1px solid gray;
    margin: 0 5px;
  }
`

export default Navbar
