import { useState, type FC, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import { useCookie } from 'react-use'
import { motion } from 'framer-motion'

const TopNav: FC = () => {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [,, removeCookie] = useCookie('SESSION_TOKEN')
  const isSearchablePage = location.pathname.includes('/instances')

  if (location.pathname === '/login')
    return <></>

  const onSearch = (e: FormEvent): void => {
    e.preventDefault()

    if (search.length < 1) {
      navigate('/instances/')
      return
    }

    navigate(`/instances/search/${search}?page=0`)
  }

  const onLogout = (): void => {
    removeCookie()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ bounce: 0, duration: 0.1 }}
      className={style.topNav}>
      <div>
        <Link to="/instances">
          <img
            src="/assets/images/logos/vector.svg"
            alt="AWS Logo" className={style.logo} />
        </Link>

        {isSearchablePage && (
          <form className={style.searchForm} onSubmit={onSearch}>
            <label>
              <img
                src="/assets/icon/search.svg"
                alt="Search" className={style.searchIcon} />

              <input
                type="text"
                autoComplete="off"
                spellCheck="false"
                placeholder="인스턴스 검색"
                onChange={(e) => { setSearch(e.target.value) }} />
            </label>
          </form>
        )}

      </div>

      <div>
        <button className={style.logout} onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </motion.nav>
  )
}

export default TopNav
