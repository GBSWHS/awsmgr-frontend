import axios from 'axios'
import { type FC } from 'react'
import useSWR from 'swr'
import { useLocation, useNavigate } from 'react-router-dom'

const PathProcesor: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  async function fetcher (path: string): Promise<void> {
    const res = await axios(path, { method: 'GET' })
      .catch(() => ({ status: 400 }))

    if (res.status !== 200) {
      if (location.pathname !== '/login')
        navigate('/login')

      return
    }

    if (location.pathname === '/login' || location.pathname === '/')
      navigate('/instances?page=0')
  }

  useSWR('/api/auth/status', fetcher)

  return <></>
}

export default PathProcesor
