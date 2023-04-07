import styled from 'styled-components'

const LandingPage = () => (
  <Styles>
    <header>
      <h1>Cookbooks</h1>
      <p>Create a shared cookbook.</p>
    </header>
    <div id='btn-ctr'>
      <button>Login</button>
      <button>Signup</button>
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
