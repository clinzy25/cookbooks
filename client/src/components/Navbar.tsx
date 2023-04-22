import useAppContext from '@/context/app.context'
import { AppContextType } from '@/types/@types.context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Search from './Search'
import Image from 'next/image'

const Navbar = () => {
  const { pathname } = useRouter()
  const { tags, tagsError, navbarHeight } = useAppContext() as AppContextType

  const showTagsInRoutes = ['/search/recipes/[id]', '/cookbooks/[id]', '/cookbooks']

  return (
    <Style navbarHeight={navbarHeight}>
      <div id='input-ctr'>
        <Link href='/cookbooks'>
          <Image
            src='/../public/assets/avatar-placeholder.png'
            width={49}
            height={49}
            alt='Home'
          />
        </Link>
        <Search />
      </div>
      {showTagsInRoutes.includes(pathname) && (
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

type StyleProps = {
  navbarHeight: number
}

const Style = styled.div<StyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => `${props.navbarHeight}px`};
  border-bottom: 1px solid gray;
  padding: 12px;
  box-shadow: 3px 3px 5px #e3e3e3;
  #input-ctr {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    height: 100%;
  }
  #tag-list {
    display: flex;
    align-items: center;
    overflow-y: hidden;
    white-space: nowrap;
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
    margin-left: 10px;
  }
  @media screen and (max-width: 800px) {
    #tag-list {
      width: 100%;
    }
  }
`

export default Navbar
