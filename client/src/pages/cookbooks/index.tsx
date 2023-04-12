import useAppContext from '@/context/app.context'
import styled from 'styled-components'
import { AppContextType } from '@/types/@types.context'
import Link from 'next/link'

const CookbooksPage: React.FC = () => {
  const {
    cookbooks,
    cookbooksError,
  } = useAppContext() as AppContextType

  if (!cookbooks) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles>
      <h1>Your Cookbooks</h1>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <Link
            key={cb.guid}
            className='cookbook-tile'
            href={`/cookbooks/${cb.guid}`}>
            {cb.cookbook_name}
          </Link>
        ))}
      </div>
    </Styles>
  )
}

const Styles = styled.main`
  #cookbooks-ctr {
    display: grid;
    gap: 20px;
    grid-template-rows: repeat(1fr);
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  .cookbook-tile {
    height: 200px;
    width: 200px;
    border: 1px solid gray;
  }
`

export default CookbooksPage
