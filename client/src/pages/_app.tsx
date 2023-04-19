import useAppContext from '@/context/app.context'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import Snackbar from '@/components/Snackbar'
import { AppContextType } from '@/types/@types.context'
import withContext from '@/context/WithContext'
import styled from 'styled-components'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as AppContextType
  const router = useRouter()
  const { asPath } = router

  return (
    <>
      {asPath !== '/' && <Navbar />}
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
    </>
  )
}

const PageWrapper = styled.div`
  padding: 30px 60px;
  height: 100%;
`

export default withContext(App)
