import Link from 'next/link'
import styled from 'styled-components'

const LandingPage: React.FC = () => (
  <Styles>
    <header>
      <h1>Cookbooks</h1>
      <p>Create a shared cookbook with your friends and family.</p>
    </header>
    <div id='btn-ctr'>
      <Link href='/cookbooks'>
        <button>Login</button>
        <button>Signup</button>
      </Link>
    </div>
  </Styles>
)

const Styles = styled.main`
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-family: 'Nunito Sans', sans-serif;
    h1,
    p {
      margin-top: auto;
    }
  }
  #btn-ctr {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    button {
      padding: 10px 20px;
      margin: 10px;
    }
  }
`

export default LandingPage
