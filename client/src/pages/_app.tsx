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
import { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import gsap from 'gsap'

const App = ({ Component, pageProps }: AppProps) => {
  const { snackbar } = useAppContext() as IAppContext
  const router = useRouter()
  const { asPath } = router
  const [route, setRoute] = useState(router.asPath)

  const onEnter = (enter: gsap.TweenTarget) => {
    const style = { opacity: 0 }
    gsap.set(enter, style)
  }

  const onEntered = (entered: gsap.TweenTarget) => {
    const style = { opacity: 1, duration: 0.1 }
    gsap.to(entered, style)
  }

  const onExit = (exit: gsap.TweenTarget) => {
    const style = { opacity: 0, duration: 0.07 }
    gsap.to(exit, style)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', () => setRoute(router.asPath))
    return () => router.events.off('routeChangeStart', () => setRoute(router.asPath))
  }, [router])

  return (
    <ThemeProvider theme={LightTheme}>
      {asPath !== '/' && <Navbar />}
      {asPath !== '/' && <Breadcrumb />}
      <GlobalStyle />
      <Transition
        in={router.asPath !== route}
        onEnter={(enter: gsap.TweenTarget) => onEnter(enter)}
        onEntered={(entered: gsap.TweenTarget) => onEntered(entered)}
        onExit={(exit: gsap.TweenTarget) => onExit(exit)}
        timeout={300}
        appear>
        <Component {...pageProps} />
      </Transition>
      {snackbar.msg && <Snackbar snackbar={snackbar} />}
      <Footer />
    </ThemeProvider>
  )
}

export default withContext(App)
