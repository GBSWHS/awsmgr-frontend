import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Instances from './pages/Instances'
import Header from './components/Header'
import Invites from './pages/Invites'
import Search from './pages/Search'
import PathProcesor from './components/PathProcessor'
import { type FC } from 'react'
import { GlobalStyles } from './styles/globals'
import { Toaster } from 'react-hot-toast'

const App: FC = () =>
  <BrowserRouter>
    <Header />
    <GlobalStyles />
    <PathProcesor />

    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/instances' element={<Instances />}></Route>
      <Route path="/instances/search/:search" element={<Search />}></Route>
      <Route path='/invites/:uuid' element={<Invites />}></Route>
    </Routes>

    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
  </BrowserRouter>

export default App
