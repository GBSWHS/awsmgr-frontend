import axios from 'axios'
import { type FC, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Container from '../components/Container'
import TableControl from '../components/TableControl'
import InstanceTable from '../components/InstanceTable'
import { useRefreshNotifier } from '../components/RefreshNotifier'

const Search: FC = () => {
  const { search } = useParams<{ search: string }>()
  const location = useLocation()
  const serachParams = new URLSearchParams(location.search)
  const page = serachParams.get('page') ?? '0'
  const [prices, setPrices] = useState(0)
  const [max, setMax] = useState(0)
  const [instances, setInstances] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const { refreshToken } = useRefreshNotifier()

  const fetchData = async (): Promise<void> => {
    setIsLoading(true)
    console.log(search)

    const res = await axios(`/api/instances/search?take=20&skip=${parseInt(page) * 10}&query=${search ?? ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const res2 = await axios('/api/prices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setInstances(res.data.body.instances)
    setMax(res.data.body.pageCount)
    setPrices(res2.data.body.pricePerHour * 24 * 30 + res2.data.body.storageSize * 0.1)

    setIsLoading(false)
  }

  useEffect(() => {
    void fetchData()
  }, [serachParams.get('page')])

  useEffect(() => {
    void fetchData()
  }, [refreshToken])

  useEffect(() => {
    void fetchData()
  }, [search])

  return (
  <Container>
    <TableControl prices={prices} max={max} title={`"${search ?? ''}" 검색 결과`} />
    <InstanceTable instances={instances} isLoading={isLoading} />
  </Container>
  )
}

export default Search
