import useAppContext from '@/context/app.context'
import { useEffect } from 'react'
import styled from 'styled-components'
import { AppContextType } from '@/types/@types.context'

const CookbooksPage: React.FC = () => {
  const { getCookbooks, cookbooks, user, cookbooksLoading, cookbooksError } =
    useAppContext() as AppContextType

    useEffect(() => {
    getCookbooks(user.id)
  }, [getCookbooks, user.id])

  if (cookbooksLoading) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return <Styles>{cookbooks.map((cb) => <p key={cb.id}>{cb.cookbook_name}</p>)}</Styles>
}

const Styles = styled.main``

export default CookbooksPage
