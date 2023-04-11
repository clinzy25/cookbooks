import useAppContext from '@/context/app.context'
import { useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { ICookbook } from '@/types/@types.cookbooks'
import { fetcher, api } from '../../api'
import { AppContextType } from '@/types/@types.context'

interface Props {
  cookbooks: ICookbook[]
}

const CookbooksPage: React.FC<Props> = (props: Props) => {
  const { setCookbooks, cookbooks, user } = useAppContext() as AppContextType
  const { data, error } = useSWR(`${api}/cookbooks?id=${user.id}`, fetcher)

  useEffect(() => {
    setCookbooks(props.cookbooks)
  }, [data, props, setCookbooks])

  if (!cookbooks && !data) {
    return <p>...loading</p>
  }
  if (error) {
    return <p>error</p>
  }
  return <Styles>{cookbooks[0]?.cookbook_name}</Styles>
}

export async function getStaticProps() {
  const cookbooks = await fetcher(`${api}/cookbooks?id=1`)
  return { props: { cookbooks } }
}

const Styles = styled.main``

export default CookbooksPage
