import axios from 'axios'
import { FC } from 'react'
import useSWR from 'swr'
import { useLocation, useNavigate } from 'react-router-dom'

const PathProcesor: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  async function fetcher(path: string) {
    await axios(path, {
      method: "GET"
    }).then((res) => {
      if (res.status === 200) {
        if (location.pathname === "/login" || location.pathname === "/") {
          navigate("/instances?page=0")
        }
      }
    }).catch((err) => {
      if (err.status !== 200) {
        if (location.pathname !== "/login") {
          navigate("/login")
        }
      } else {
        return err.data
      }
    })
  }

  useSWR('/api/auth/status', fetcher)

  return <></>
}

export default PathProcesor
