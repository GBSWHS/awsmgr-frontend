import { BrowserRouter } from 'react-router-dom'
import TopNav from './components/TopNav'
import { type FC } from 'react'
import { Toaster } from 'react-hot-toast'
import Routers from './components/Routers'

const App: FC = () =>
  <BrowserRouter>
    <TopNav />
    <Routers />

    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
  </BrowserRouter>

export default App
