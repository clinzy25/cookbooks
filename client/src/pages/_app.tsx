import { AppProvider } from '@/context/app.context'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const { asPath } = router

  return (
    <UserProvider>
      <AppProvider>
        {asPath !== '/' && <Navbar />}
        <Component {...pageProps} />
      </AppProvider>
    </UserProvider>
  )
}

export default App
