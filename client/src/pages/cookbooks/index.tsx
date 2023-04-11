import useAppContext from '@/context/app.context'
import { useEffect } from 'react'
import styled from 'styled-components'
import { AppContextType } from '@/types/@types.context'
import Link from 'next/link'

const CookbooksPage: React.FC = () => {
  const { getCookbooks, cookbooks, user, cookbooksLoading, cookbooksError } =
    useAppContext() as AppContextType

  useEffect(() => {
    getCookbooks(user.guid)
  }, [getCookbooks, user.guid])

  if (cookbooksLoading) {
    return <p>...loading</p>
  }
  if (cookbooksError) {
    return <p>error</p>
  }
  return (
    <Styles>
      {cookbooks.map(cb => (
        <Link href={`/cookbooks/${cb.guid}`} key={cb.guid}>{cb.cookbook_name}</Link>
      ))}
    </Styles>
  )
}

const Styles = styled.main``

export default CookbooksPage
