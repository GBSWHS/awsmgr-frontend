import { BrowserRouter } from 'react-router-dom'
import TopNav from './components/TopNav'
import { type FC } from 'react'
import { Toaster } from 'react-hot-toast'
import Routers from './components/Routers'
import SocketWatcher from './components/SocketWatcher'
import { APIRefreshProvider } from './components/RefreshNotifier'

const App: FC = () =>
  <BrowserRouter>
    <TopNav />

    <APIRefreshProvider>
      <Routers />
      <SocketWatcher />
    </APIRefreshProvider>

    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
  </BrowserRouter>

export default App
