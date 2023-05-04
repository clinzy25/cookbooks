import useAppContext from '@/context/app.context'
import styled from 'styled-components'
import { IAppContext } from '@/types/@types.context'
import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'
import { IoMdAddCircle } from 'react-icons/io'
import { AddBtnMixin } from '@/styles/mixins'

const CookbooksPage: React.FC = () => {
  const { cookbooks, cookbooksError } = useAppContext() as IAppContext
  const [modalOpen, setModalOpen] = useState(false)

  if (!cookbooks) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles id='cookbook-page-wrapper'>
      {modalOpen && <AddCookbookModal setModalOpen={setModalOpen} />}
      <h1>Your Cookbooks</h1>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <Link key={cb.guid} className='cookbook-tile' href={`/cookbooks/${cb.guid}`}>
            {cb.cookbook_name}
          </Link>
        ))}
      </div>
      <IoMdAddCircle id='add-cookbook-btn' onClick={() => setModalOpen(true)} />
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

const Styles = styled.main`
  height: 100%;
  #cookbooks-ctr {

    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
  }
  .cookbook-tile {
    height: 50%;
    border: 1px solid gray;
  }
  #add-cookbook-btn {
    ${AddBtnMixin}
  }
`

export default CookbooksPage
