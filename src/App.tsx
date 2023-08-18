import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Instances from './pages/Instances'
import Header from './components/Header'
import Invites from './pages/Invites'
import Search from './pages/Search'
import PathProcesor from './components/PathProcessor'
import { type FC } from 'react'

const App: FC = () =>
  <BrowserRouter>
    <Header />
    <PathProcesor />

    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/instances' element={<Instances />}></Route>
      <Route path="/instances/search/:search" element={<Search />}></Route>
      <Route path='/invites/:uuid' element={<Invites />}></Route>
    </Routes>
  </BrowserRouter>

export default App
