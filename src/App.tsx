import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import { type FC } from 'react'
import { Toaster } from 'react-hot-toast'
import Routers from './components/Routers'

const App: FC = () =>
  <BrowserRouter>
    <Header />
    <Routers/>

    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
  </BrowserRouter>

export default App
