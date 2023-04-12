import { AppProvider } from '@/context/app.context'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'

const App = ({ Component, pageProps }: AppProps) => (
  <AppProvider>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  </AppProvider>
)

export default App
