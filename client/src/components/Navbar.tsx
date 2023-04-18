import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const Navbar = () => {
  const { pathname } = useRouter()
  const { tags, tagsError } = useAppContext() as AppContextType

  return (
    <Style>
      <div id='input-ctr'>
        <Link href='/cookbooks'>Cookbooks App</Link>
        <input id='search-field' placeholder='Search all recipes...' type='text' />
      </div>
      {pathname === '/cookbooks/[id]' && (
        <div id='tag-list'>
          {tagsError
            ? 'Error loading tags'
            : tags?.map(t => (
                <Link href={`/search/recipes/${t}`} className='tag' key={t}>
                  #{t}
                </Link>
              ))}
        </div>
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
  #input-ctr {
    display: flex;
    flex-wrap: nowrap;
    #search-field {
      height: 40px;
      margin-left: 15px;
    }
  }
  #tag-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow-y: hidden;
    white-space: nowrap;
    margin: 0 50px;
    height: 40px;
    scrollbar-width: thin;
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
