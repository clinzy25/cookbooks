import styled from 'styled-components'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'
import { IoMdAddCircle } from 'react-icons/io'
import { AddBtnMixin } from '@/styles/mixins'
import CookbookCard from './components/CookbookCard'
import { useUser } from '@auth0/nextjs-auth0/client'
import useSWR from 'swr'
import { api, fetcher } from '@/api'
import { ICookbookRes } from '@/types/@types.cookbooks'

const CookbooksPage: React.FC = () => {
  const { user, error: userError, isLoading } = useUser()

  const [modalOpen, setModalOpen] = useState(false)
  const [cookbooks, setCookbooks] = useState<ICookbookRes[]>([])

  const {
    data: cookbooksData,
    error: cookbooksError,
    mutate: revalidateCookbooks,
  } = useSWR(!isLoading && !userError && `${api}/cookbooks?user_guid=${user?.sub}`, fetcher)

  useEffect(() => {
    cookbooksData && setCookbooks(cookbooksData)
  }, [cookbooksData])

  if (!cookbooks) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles id='cookbook-page-wrapper'>
      {modalOpen && (
        <AddCookbookModal
          revalidateCookbooks={revalidateCookbooks}
          setModalOpen={setModalOpen}
        />
      )}
      <header>
        <h1>Your Cookbooks</h1>
      </header>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <CookbookCard
            key={cb.guid}
            cookbook={cb}
          />
        ))}
      </div>
      <IoMdAddCircle id='add-cookbook-btn' onClick={() => setModalOpen(true)} />
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

const Styles = styled.main`
  display: flex;
  flex-direction: column;
  header {
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
