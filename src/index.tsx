import { createRoot } from 'react-dom/client'

import App from './App'

import Header from './components/Header/'
import Footer from './components/Footer/'

import Container, { Contents } from './styles/index.styles'
import { GlobalStyle } from './styles/globals'

import 'bootstrap/dist/css/bootstrap.min.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <Container>
    { window.location.pathname !== '/' && <Header/> }

    <Contents>
      <App/>
    </Contents>

    <Footer/>
    <GlobalStyle/>
  </Container>
)
