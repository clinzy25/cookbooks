import useAppContext from '@/context/app.context'
import styled from 'styled-components'
import { AppContextType } from '@/types/@types.context'
import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AiFillPlusCircle } from 'react-icons/ai'
import { useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'

const CookbooksPage: React.FC = () => {
  const { cookbooks, cookbooksError } = useAppContext() as AppContextType

  const [modalOpen, setModalOpen] = useState(false)

  if (!cookbooks) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles>
      {modalOpen && <AddCookbookModal setModalOpen={setModalOpen} />}
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
      <AiFillPlusCircle
        onClick={() => setModalOpen(true)}
        id='add-cookbook-icon'
      />
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

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
  #add-cookbook-icon {
    position: absolute;
    right: 50px;
    bottom: 50px;
    font-size: 3.5rem;
    cursor: pointer;
  }
`

export default CookbooksPage
