import styled from 'styled-components'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'
import { IoMdAddCircle } from 'react-icons/io'
import { AddBtnMixin } from '@/styles/mixins'
import CookbookCard from './components/CookbookCard'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import WelcomeModal from './components/WelcomeModal'
import { useUser } from '@auth0/nextjs-auth0/client'

const CookbooksPage: React.FC = () => {
  const { cookbooks, cookbooksError } = useAppContext() as IAppContext
  const [addCookbookModal, setAddcookbookModal] = useState(false)
  const [welcomeModal, setWelcomeModal] = useState(true)
  const { isLoading } = useUser()

  useEffect(() => {
    !cookbooks.length && !isLoading && setWelcomeModal(true)
  }, [cookbooks]) // eslint-disable-line

  if (!cookbooks) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles id='cookbook-page-wrapper'>
      {addCookbookModal && <AddCookbookModal setModalOpen={setAddcookbookModal} />}
      {welcomeModal && <WelcomeModal setModalOpen={setWelcomeModal} />}
      <header>
        <h1>Your Cookbooks</h1>
      </header>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <CookbookCard key={cb.guid} cookbook={cb} />
        ))}
      </div>
      <IoMdAddCircle id='add-cookbook-btn' onClick={() => setAddcookbookModal(true)} />
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

const Styles = styled.main`
  display: flex;
  flex-direction: column;
  header {
    font-family: ${({ theme }) => theme.headerFont};
    margin-bottom: 15px;
  }
  #cookbooks-ctr {
    display: grid;
    height: 100%;
    gap: 10px;
    grid-auto-rows: 40vh;
    grid-template-columns: 1fr 1fr;
  }
  #add-cookbook-btn {
    ${AddBtnMixin}
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    #cookbooks-ctr {
      grid-template-columns: 1fr;
    }
  }
`

export default CookbooksPage
