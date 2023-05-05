import useAppContext from '@/context/app.context'
import styled from 'styled-components'
import { IAppContext } from '@/types/@types.context'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useState } from 'react'
import AddCookbookModal from './components/AddCookbookModal'
import { IoMdAddCircle } from 'react-icons/io'
import { AddBtnMixin } from '@/styles/mixins'
import CookbookCard from './components/CookbookCard'
import { BREAKPOINT_MOBILE } from '@/utils/utils.constants'

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
    <Styles BREAKPOINT_MOBILE={BREAKPOINT_MOBILE} id='cookbook-page-wrapper'>
      {modalOpen && <AddCookbookModal setModalOpen={setModalOpen} />}
      <header>
        <h1>Your Cookbooks</h1>
      </header>
      <div id='cookbooks-ctr'>
        {cookbooks.map(cb => (
          <CookbookCard key={cb.guid} cookbook={cb} />
        ))}
      </div>
      <IoMdAddCircle id='add-cookbook-btn' onClick={() => setModalOpen(true)} />
    </Styles>
  )
}

export const getServerSideProps = withPageAuthRequired()

type StyleProps = {
  BREAKPOINT_MOBILE: number
}

const Styles = styled.main<StyleProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  header {
    margin-bottom: 15px;
  }
  #cookbooks-ctr {
    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(calc(50% - 20px), 1fr));
  }
  #add-cookbook-btn {
    ${AddBtnMixin}
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    #cookbooks-ctr {
      grid-template-columns: 1fr;
    }
  }
`

export default CookbooksPage
