import useAppContext from '@/context/app.context'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import Snackbar from '@/components/Snackbar'
import { AppContextType } from '@/types/@types.context'
import withContext from '@/context/WithContext'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as AppContextType
  const router = useRouter()
  const { asPath } = router

  return (
    <>
      {asPath !== '/' && <Navbar />}
      <Component {...pageProps} />
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
    </>
  )
}

export default withContext(App)
