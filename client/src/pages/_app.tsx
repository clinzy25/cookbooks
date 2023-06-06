import useAppContext from '@/context/app.context'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar/Navbar'
import { useRouter } from 'next/router'
import Snackbar from '@/components/Snackbar'
import { IAppContext } from '@/types/@types.context'
import withContext from '@/context/WithContext'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '@/styles/globals'
import { LightTheme } from '@/styles/theme'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer/Footer'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as IAppContext
  const router = useRouter()
  const { asPath } = router

  return (
    <ThemeProvider theme={LightTheme}>
      {asPath !== '/' && <Navbar />}
      {asPath !== '/' && <Breadcrumb />}
      <GlobalStyle />
      <Component {...pageProps} />
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
      <Footer/>
    </ThemeProvider>
  )
}

export default withContext(App)
