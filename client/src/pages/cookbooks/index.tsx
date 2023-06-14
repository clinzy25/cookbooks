import styled from 'styled-components'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'
import { IoMdAddCircle } from 'react-icons/io'
import { AddBtnMixin, PageHeaderMixin } from '@/styles/mixins'
import CookbookCard from './components/CookbookCard'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'
import WelcomeModal from './components/WelcomeModal'
import { useUser } from '@auth0/nextjs-auth0/client'
import Loader from '@/components/Loader'
import Error from '@/components/Error'
import Head from 'next/head'
import { BiBookAdd } from 'react-icons/bi'

const CookbooksPage: React.FC = () => {
  const { cookbooks, cookbooksError } = useAppContext() as IAppContext
  const [addCookbookModal, setAddcookbookModal] = useState(false)
  const [welcomeModal, setWelcomeModal] = useState(false)
  const { isLoading } = useUser()

  useEffect(() => {
    !cookbooks.length && !isLoading && setWelcomeModal(true)
  }, [cookbooks]) // eslint-disable-line

  if (!cookbooks) {
    return <Loader size={50} fillSpace />
  }
  if (cookbooksError) {
    return <Error fillSpace />
  }
  return (
    <Styles className='page-wrapper' id='cookbook-page-wrapper'>
      <Head>
        <title>Your Cookbooks</title>
      </Head>
      <AddCookbookModal modalOpen={addCookbookModal} setModalOpen={setAddcookbookModal} />
      <WelcomeModal modalOpen={welcomeModal} setModalOpen={setWelcomeModal} />
      <header>
        <h1>Your Cookbooks </h1> <hr />
      </header>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <CookbookCard key={cb.guid} cookbook={cb} />
        ))}
      </div>
      <div className='icon-ctr'>
        <BiBookAdd
          id='add-cookbook-btn'
          className='add-btn'
          title='New Cookbook'
          onClick={() => setAddcookbookModal(true)}
        />
      </div>
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

const Styles = styled.main`
  display: flex;
  flex-direction: column;
  ${PageHeaderMixin}
  #cookbooks-ctr {
    display: grid;
    height: 100%;
    gap: 12px;
    grid-auto-rows: 37vh;
    grid-template-columns: 1fr 1fr;
  }
  .icon-ctr {
    ${AddBtnMixin}
    position: fixed;
    right: 35px;
    bottom: 35px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    #cookbooks-ctr {
      grid-template-columns: 1fr;
    }
  }
`

export default CookbooksPage
