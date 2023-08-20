import axios from 'axios'
import { type FC, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import CreateModal from '../components/CreateModal'
import Button from '../components/Button'
import { Body, Title, Top } from '../styles/globals'
import { Link, useLocation } from 'react-router-dom'
import Container from '../components/Container'
import InstanceTable from '../components/InstanceTable'

const Instances: FC = () => {
  const location = useLocation()
  const serachParams = new URLSearchParams(location.search)
  const page = serachParams.get('page') ?? '0'
  const [prices, setPrices] = useState(0)
  const [max, setMax] = useState(0)
  const [instances, setInstances] = useState([])
  const [createModalStatus, setCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    axios(`/api/instances?take=10&skip=${parseInt(String(serachParams.get('page') !== null ? page : '0')) * 10}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setInstances(res.data.body.instances)
      setMax(res.data.body.pageCount)
      setIsLoading(false)
    }).catch((err) => { console.error(err) })
  }, [serachParams.get('page')])

  useEffect(() => {
    void axios('/api/prices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setPrices(Math.floor((res.data.body.pricePerHour * 24) * 30) + ((Number.isNaN(res.data.body.storageSize) ? 0 : res.data.body.storageSize) * 0.1))
    })
  }, [])

  return (
    <Container>
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div>
          <p>
            총 {prices}$/월
          </p>
          <Link to={parseInt(page) + 1 > 1 ? `/instances?page=${parseInt(page) - 1}` : window.location.href}>
            <svg className={parseInt(page) + 1 > 1 ? 'enabled' : 'disabled'} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fillRule="evenodd" clipRule="evenodd" d="M16.2071 19.7071C16.5976 19.3166 16.5976 18.6834 16.2071 18.2929L9.91421 12L16.2071 5.70711C16.5976 5.31658 16.5976 4.68342 16.2071 4.29289C15.8166 3.90237 15.1834 3.90237 14.7929 4.29289L7.79289 11.2929C7.40237 11.6834 7.40237 12.3166 7.79289 12.7071L14.7929 19.7071C15.1834 20.0976 15.8166 20.0976 16.2071 19.7071Z"></path></svg>
          </Link>
          <a>{serachParams.get('page') !== null ? parseInt(page) + 1 : 1}</a>
          <Link to={parseInt(page) + 1 >= max ? window.location.href : `/instances?page=${parseInt(page) + 1}`}>
            <svg className={parseInt(page) + 1 >= max ? 'disabled' : 'enabled'} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fillRule="evenodd" clipRule="evenodd" d="M7.79289 19.7071C7.40237 19.3166 7.40237 18.6834 7.79289 18.2929L14.0858 12L7.79289 5.70711C7.40237 5.31658 7.40237 4.68342 7.79289 4.29289C8.18342 3.90237 8.81658 3.90237 9.20711 4.29289L16.2071 11.2929C16.5976 11.6834 16.5976 12.3166 16.2071 12.7071L9.20711 19.7071C8.81658 20.0976 8.18342 20.0976 7.79289 19.7071Z"></path></svg>
          </Link>
          <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { setCreateModal(true) }}>인스턴스 생성</Button>
        </div>

      </Top>

      <TableMain>
        <InstanceTable instances={instances} isLoading={isLoading} />
      </TableMain>

      <CreateModal display={createModalStatus} action={setCreateModal}></CreateModal>
    </Body >
    </Container>
  )
}

const TableMain = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 45px);
  overflow: auto; /* Apply overflow to enable scrolling */
  scroll-snap-type: both mandatory;

  table {
    width: 2850px !important;
    scroll-snap-type: both mandatory !important;
    font-size: 16px;
  }
`

export default Instances
