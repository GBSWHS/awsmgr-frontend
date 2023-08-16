import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Instances from "./pages/Instances";
import Header from "./components/Header";
import axios from "axios";
import useSWR from 'swr'
import Invites from "./pages/invites";

async function fetcher(path: string) {
  await axios(path, {
    method: "GET"
  }).then((res) => {
    if (res.status === 200) {
      if (window.location.pathname === "/login" || window.location.pathname === "/") {
        window.location.href = "/instances"
      }
    }
  }).catch((err) => {
    if (err.status !== 200) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    } else {
      return err.data
    }
  })
}

export default function App() {
  const { data, isLoading, error } = useSWR('/api/auth/status', fetcher)

  if (window.location.pathname !== "/login" && (isLoading || error))
    return (
      <>
        <Header />
        <div style={{ width: '100%', height: '100%', padding: '20px' }}>
          <h1>Loading...</h1>
        </div>
      </>
    )
  else {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          {error ?
            <>
              <Route path='/login' element={<Login />} />
            </>
            :
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/instances' element={<Instances />}></Route>
              <Route path='/invites/:uuid' element={<Invites />}></Route>
            </>
          }
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    );
  }
}
