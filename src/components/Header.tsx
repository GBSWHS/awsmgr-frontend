import { useState, type FC, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

const Header: FC = () => {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

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

  return (
    <>
      <Body>
        <Nav>
          <div>
            <LogoBody>
              <Link to="/instances">
                <svg xmlns="http://www.w3.org/2000/svg" version="2.0" focusable="false" aria-hidden="true" className="globalNav-0216 globalNav-0213" data-testid="awsc-logo" viewBox="0 0 29 17">
                  <path style={{ fill: '#FFF', fillRule: 'nonzero' }} className="globalNav-0214" d="M8.38 6.17a2.6 2.6 0 00.11.83c.08.232.18.456.3.67a.4.4 0 01.07.21.36.36 0 01-.18.28l-.59.39a.43.43 0 01-.24.08.38.38 0 01-.28-.13 2.38 2.38 0 01-.34-.43c-.09-.16-.18-.34-.28-.55a3.44 3.44 0 01-2.74 1.29 2.54 2.54 0 01-1.86-.67 2.36 2.36 0 01-.68-1.79 2.43 2.43 0 01.84-1.92 3.43 3.43 0 012.29-.72 6.75 6.75 0 011 .07c.35.05.7.12 1.07.2V3.3a2.06 2.06 0 00-.44-1.49 2.12 2.12 0 00-1.52-.43 4.4 4.4 0 00-1 .12 6.85 6.85 0 00-1 .32l-.33.12h-.14c-.14 0-.2-.1-.2-.29v-.46A.62.62 0 012.3.87a.78.78 0 01.27-.2A6 6 0 013.74.25 5.7 5.7 0 015.19.07a3.37 3.37 0 012.44.76 3 3 0 01.77 2.29l-.02 3.05zM4.6 7.59a3 3 0 001-.17 2 2 0 00.88-.6 1.36 1.36 0 00.32-.59 3.18 3.18 0 00.09-.81V5A7.52 7.52 0 006 4.87h-.88a2.13 2.13 0 00-1.38.37 1.3 1.3 0 00-.46 1.08 1.3 1.3 0 00.34 1c.278.216.63.313.98.27zm7.49 1a.56.56 0 01-.36-.09.73.73 0 01-.2-.37L9.35.93a1.39 1.39 0 01-.08-.38c0-.15.07-.23.22-.23h.92a.56.56 0 01.36.09.74.74 0 01.19.37L12.53 7 14 .79a.61.61 0 01.18-.37.59.59 0 01.37-.09h.75a.62.62 0 01.38.09.74.74 0 01.18.37L17.31 7 18.92.76a.74.74 0 01.19-.37.56.56 0 01.36-.09h.87a.21.21 0 01.23.23 1 1 0 010 .15s0 .13-.06.23l-2.26 7.2a.74.74 0 01-.19.37.6.6 0 01-.36.09h-.8a.53.53 0 01-.37-.1.64.64 0 01-.18-.37l-1.45-6-1.44 6a.64.64 0 01-.18.37.55.55 0 01-.37.1l-.82.02zm12 .24a6.29 6.29 0 01-1.44-.16 4.21 4.21 0 01-1.07-.37.69.69 0 01-.29-.26.66.66 0 01-.06-.27V7.3c0-.19.07-.29.21-.29a.57.57 0 01.18 0l.23.1c.32.143.656.25 1 .32.365.08.737.12 1.11.12a2.47 2.47 0 001.36-.31 1 1 0 00.48-.88.88.88 0 00-.25-.65 2.29 2.29 0 00-.94-.49l-1.35-.43a2.83 2.83 0 01-1.49-.94 2.24 2.24 0 01-.47-1.36 2 2 0 01.25-1c.167-.3.395-.563.67-.77a3 3 0 011-.48A4.1 4.1 0 0124.4.08a4.4 4.4 0 01.62 0l.61.1.53.15.39.16c.105.062.2.14.28.23a.57.57 0 01.08.31v.44c0 .2-.07.3-.21.3a.92.92 0 01-.36-.12 4.35 4.35 0 00-1.8-.36 2.51 2.51 0 00-1.24.26.92.92 0 00-.44.84c0 .249.1.488.28.66.295.236.635.41 1 .51l1.32.42a2.88 2.88 0 011.44.9 2.1 2.1 0 01.43 1.31 2.38 2.38 0 01-.24 1.08 2.34 2.34 0 01-.68.82 3 3 0 01-1 .53 4.59 4.59 0 01-1.35.22l.03-.01z"></path>
                  <path style={{ fill: '#F8991D', fillRule: 'evenodd' }} d="M25.82 13.43a20.07 20.07 0 01-11.35 3.47A20.54 20.54 0 01.61 11.62c-.29-.26 0-.62.32-.42a27.81 27.81 0 0013.86 3.68 27.54 27.54 0 0010.58-2.16c.52-.22.96.34.45.71z"></path>
                  <path style={{ fill: '#F8991D', fillRule: 'evenodd' }} d="M27.1 12c-.4-.51-2.6-.24-3.59-.12-.3 0-.34-.23-.07-.42 1.75-1.23 4.63-.88 5-.46.37.42-.09 3.3-1.74 4.68-.25.21-.49.09-.38-.18.34-.95 1.17-3.02.78-3.5z"></path>
                </svg>
              </Link>
            </LogoBody>
            {location.pathname.includes('/instances')
              ? <SearchBody>
                <div>
                  <InputBody>
                    <label htmlFor="search">
                      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="false" className="globalNav-search-0311 globalNav-search-0314" viewBox="0 0 16 16" role="img" aria-label="검색">
                        <circle cx="7" cy="7" r="5" className="globalNav-search-0310"></circle>
                        <line x1="15" y1="15" x2="10.5" y2="10.5" className="globalNav-search-0310"></line>
                      </svg>
                    </label>
                    <div>
                      <form onSubmit={onSearch}>
                        <input type="text" autoComplete="off" spellCheck="false" aria-haspopup="dialog" id="search" placeholder="검색" role="combobox" onChange={(e) => { setSearch(e.target.value) }} />
                      </form>
                    </div>
                  </InputBody>
                </div>
              </SearchBody>
              : <></>
            }
          </div>
        </Nav>
      </Body>
    </>
  )
}

export default Header

const Body = styled.header`
  display: block;
  border-bottom: 1px solid #545B64;
  height: 40px;
`

const Nav = styled.nav`
  background-color: #232f3e;
  height: 100%;

  > div {
    display: flex;
    height: 100%;
  }
`

const LogoBody = styled.div`
  display: flex;

  > a {
    position: relative;
    padding-left: 16px;
    padding-right: 16px;

    color: #FFFFFF;
    display: inline-flex;
    min-width: 30px;
    min-height: 30px;
    align-items: center;
    flex-shrink: 0;
    justify-content: center;

    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    border-color: transparent;
    border-style: solid;
    border-width: 1px;
    text-decoration: none;

    background-color: transparent;
    > svg {
      width: 33px;
      height: 19px;
      flex-shrink: 0;
      pointer-events: none;
    }

    > svg * {
      cursor: inherit;
    }

    > svg:not {
      overflow-clip-margin: content-box;
      overflow: hidden;
    }
  }
`

const SearchBody = styled.div`
  display: flex !important;
  flex-grow: 1 !important;

  > div {
    flex: 1 !important;
    display: flex;
    justify-content: unset !important;
  }

`

const InputBody = styled.div`
  width: 100% !important;
  margin: 0 !important;
  display: flex !important;
  max-width: 540px !important;
  align-items: center !important;

  position: relative !important;
  flex-grow: 1 !important;
  isolation: isolate !important;
  flex-shrink: 1 !important;

  > label > svg {
    top: 50% !important;
    left: 0px !important;
    color: rgb(213, 219, 219) !important;
    width: 15px !important;
    height: 15px !important;
    display: flex !important;
    z-index: 1 !important;
    position: absolute !important;
    transform: translateY(-50%) !important;
    margin-left: 11px !important;
    flex-shrink: 0 !important;
    pointer-events: none !important;
    transform: translateY(-50%);

    > circle, line {
      fill: none !important;
      stroke: currentColor !important;
      stroke-width: 2 !important;
      stroke-linejoin: round !important;
      stroke-miterlimit: 10 !important;

      color: inherit !important;
      pointer-events: inherit !important;
    }
  }
  
  > div {
    width: 100% !important;
    display: block !important;
    position: relative !important;

    input#search {
      color: rgb(255, 255, 255) !important;
      width: 100% !important;
      height: 30px !important;
      border: 1px solid rgb(135, 149, 150) !important;
      position: relative !important;
      font-size: 14px !important;
      box-sizing: border-box !important;
      font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif !important;
      border-radius: 2px !important;
      background-color: transparent !important;
      appearance: textfield !important;
      
      padding-left: 35px !important;
      padding-right: 83px !important;
    }
  }
`
