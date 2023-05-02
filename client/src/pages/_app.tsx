import useAppContext from '@/context/app.context'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import Snackbar from '@/components/Snackbar'
import { IAppContext } from '@/types/@types.context'
import withContext from '@/context/WithContext'
import styled from 'styled-components'
import GlobalStyle from '@/styles/globals'
import { NAVBAR_HEIGHT } from '@/utils/utils.constants'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as IAppContext
  const router = useRouter()
  const { asPath } = router

  return (
    <>
      {asPath !== '/' && <Navbar />}
      <PageWrapper navbarHeight={NAVBAR_HEIGHT}>
        <GlobalStyle />
        <Component {...pageProps} />
      </PageWrapper>
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
    </>
  )
}

type StyleProps = {
  navbarHeight: number
}

const PageWrapper = styled.div<StyleProps>`
  padding: 30px 60px;
  height: ${props => `calc(100vh - ${props.navbarHeight}px)`};
`

export default withContext(App)
