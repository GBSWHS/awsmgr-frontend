import axios from 'axios'
import { type FC } from 'react'
import useSWR from 'swr'
import Login from '../../pages/Login'
import Instances from '../../pages/Instances'
import Invites from '../../pages/Invites'
import Search from '../../pages/Search'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const Routers: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  async function fetcher (path: string): Promise<void> {
    const res = await axios(path, { method: 'GET' })
      .catch(() => ({ status: 400 }))

    if (res.status !== 200) {
      if (location.pathname !== '/login' || location.pathname.startsWith('/invites'))
        navigate('/login')

      return
    }

    if (location.pathname === '/login' || location.pathname === '/')
      navigate('/instances?page=0')
  }

  useSWR('/api/auth/status', fetcher)

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path='/login' element={<Login />} />
        <Route path='/instances' element={<Instances />}></Route>
        <Route path="/instances/search/:search" element={<Search />}></Route>
        <Route path='/invites/:uuid' element={<Invites />}></Route>
        <Route path="*" element={<Navigate to="/instances" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default Routers
