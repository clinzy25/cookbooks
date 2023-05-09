import useAppContext from '@/context/app.context'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import Snackbar from '@/components/Snackbar'
import { IAppContext } from '@/types/@types.context'
import withContext from '@/context/WithContext'
import styled, { ThemeProvider } from 'styled-components'
import GlobalStyle from '@/styles/globals'
import { BREAKPOINT_MOBILE, NAVBAR_HEIGHT } from '@/utils/utils.constants'
import { LightTheme } from '@/styles/theme'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as IAppContext
  const router = useRouter()
  const { asPath } = router

  return (
    <ThemeProvider theme={LightTheme}>
      {asPath !== '/' && <Navbar />}
      <PageWrapper BREAKPOINT_MOBILE={BREAKPOINT_MOBILE} navbarHeight={NAVBAR_HEIGHT}>
        <GlobalStyle />
        <Component {...pageProps} />
      </PageWrapper>
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
    </ThemeProvider>
  )
}

type StyleProps = {
  navbarHeight: number
  BREAKPOINT_MOBILE: number
}

const PageWrapper = styled.div<StyleProps>`
  display: flex;
  padding: 20px 60px;
  height: 100%;
  & > * {
    width: 100%;
  }
  @media screen and (max-width: ${props => props.BREAKPOINT_MOBILE}px) {
    padding: 20px 15px 30px 15px;
  }
`

export default withContext(App)
