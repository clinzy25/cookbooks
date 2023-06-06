import { ModalBtnMixin } from '@/styles/mixins'
import Link from 'next/link'
import styled from 'styled-components'
import Head from 'next/head'

const LandingPage: React.FC = () => (
  <Styles className='page-wrapper'>
    <Head>
      <title>Cookbooks</title>
    </Head>
    <header>
      <h1>Cookbooks</h1>
    </header>
    <p>Create a collaborative cookbook with your friends and family.</p>
    <div id='btn-ctr'>
      <Link href='/api/auth/login'>
        <button>Login / Signup</button>
      </Link>
    </div>
  </Styles>
)

const Styles = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  header {
    h1 {
      font: 3.5rem Montserrat, sans-serif;
    }
  }
  #btn-ctr {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    ${ModalBtnMixin}
  }
`

export default LandingPage
