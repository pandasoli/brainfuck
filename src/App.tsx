import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import From from './pages/from'
import To from './pages/to'
import ASCII from './pages/ascii'
import Interpreters from './pages/interpreters'


const App = () =>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={ <Home/> }/>
      <Route path='/from' element={ <From/> }/>
      <Route path='/to' element={ <To/> }/>
      <Route path='/ascii' element={ <ASCII/> }/>
      <Route path='/interpreters' element={ <Interpreters/> }/>
    </Routes>
  </BrowserRouter>


export default App