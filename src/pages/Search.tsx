import axios from 'axios'
import { type FC, useEffect, useReducer, useState } from 'react'
import { styled } from 'styled-components'
import CreateModal from '../components/CreateModal'
import Button from '../components/Button'
import ButtonScape from '@cloudscape-design/components/button'
import updateModalReducer from '../modules/ModalReducer'
import UpdateModal from '../components/UpdateModal'
import { Body, Title, Top } from '../styles/globals'
import { useLocation, useParams } from 'react-router-dom'
import { Alert, StatusIndicator, Table } from '@cloudscape-design/components'
import { InstancesType } from '../utils/interfaces'
import showStatus from '../utils/showStatus'
import { toast } from 'react-hot-toast'
import { io } from 'socket.io-client'

const Search: FC = () => {
  const { search } = useParams<{ search: string }>()
  const location = useLocation()
  const serachParams = new URLSearchParams(location.search)
  const page = serachParams.get('page') ?? '0'
  const [max, setMax] = useState(0)
  const [uuid, setUuid] = useState('')
  const [instances, setInstances] = useState([])
  const [createModalStatus, setCreateModal] = useState(false)
  const [updateModalStatus, setUpdateModal] = useState(false)
  const [event, dispatch] = useReducer(updateModalReducer, {
    category: '',
    name: '',
    description: '',
    owner: '',
    type: 't3a.micro',
    storage: 8,
    port: '',
    ports: [],
    memo: ''
  })

  useEffect(() => {
    axios(`/api/instances/search?take=10&skip=${parseInt(String(serachParams.get('page') !== null ? String(serachParams.get('page')) : '0')) * 10}&query=${search ?? ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setInstances(res.data.body.instances)
      setMax(res.data.body.pageCount)
    }).catch((err) => { console.error(err) })
  }, [serachParams.get('page')])

  async function deleteInstance(uuid: string): Promise<void> {
    if (confirm('정말 삭제 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}`, {
        method: 'DELETE'
      }).then(() => { alert('인스턴스가 삭제되었습니다.') })
        .catch(() => { alert('인스턴스를 삭제하는 도중 에러가 발생했습니다.') })
    }
  }

  async function restartInstance(uuid: string): Promise<void> {
    if (confirm('정말 재시작 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}/restart`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 재시작 되었습니다.') })
        .catch(() => { alert('인스턴스를 재시작하는 도중 에러가 발생했습니다.') })
    }
  }

  async function resetInstance(uuid: string): Promise<void> {
    if (confirm('정말 초기화 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}/reset`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 초기화 되었습니다.') })
        .catch(() => { alert('인스턴스를 초기화하는 도중 에러가 발생했습니다.') })
    }
  }

  async function downloadKeypair(uuid: string, name: string): Promise<void> {
    await axios(`/api/instances/${uuid}/keypair`, {
      method: 'GET'
    }).then((res) => {
      const blob = new Blob([res.data.body], { type: 'text/plain' })
      const downloadLink = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadLink
      a.download = `${name}.ppk`
      a.click()

      URL.revokeObjectURL(downloadLink)
    })
      .catch((err) => { console.error(err) })
  }

  async function updateForm(uuid: string): Promise<void> {
    await axios(`/api/instances/${uuid}`, {
      method: 'GET'
    }).then((res) => {
      setUuid(uuid)
      dispatch({ type: 'setCategory', category: res.data.body.category })
      dispatch({ type: 'setDescription', description: res.data.body.description })
      dispatch({ type: 'setStorage', storage: res.data.body.storageSize })
      dispatch({ type: 'setOwner', owner: res.data.body.owner })
      dispatch({ type: 'setName', name: res.data.body.name })
      dispatch({ type: 'setMemo', memo: res.data.body.memo })
      dispatch({ type: 'setPorts', ports: res.data.body.ports.split(',') })
      setUpdateModal(true)
    }).catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    const socket = io('/api/notice')

    socket.on('message', (data) => {
      toast(() => (
        <Alert type={data.type.toLowerCase()}>
          {data.message}
        </Alert>
      ));
    })
  }, [])

  async function inviteInstance(uuid: string): Promise<void> {
    await axios('/api/invites', {
      method: 'POST',
      data: {
        instanceID: uuid
      }
    }).then((res) => {
      const $textarea = document.createElement('textarea')
      // body 요소에 존재해야 복사가 진행됨
      document.body.appendChild($textarea)

      // 복사할 특정 텍스트를 임시의 textarea에 넣어주고 모두 셀렉션 상태
      $textarea.value = `${window.location.origin}/invites/${res.data.body.id as string}`
      $textarea.select()

      // 복사 후 textarea 지우기
      document.execCommand('copy')
      document.body.removeChild($textarea)

      alert('초대링크를 복사했습니다.')
    })
  }

  return (
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div>
          <a href={parseInt(page) + 1 > 1 ? `/instances?page=${parseInt(page) - 1}` : window.location.href}>
            <svg className={parseInt(page) + 1 > 1 ? 'enabled' : 'disabled'} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fillRule="evenodd" clipRule="evenodd" d="M16.2071 19.7071C16.5976 19.3166 16.5976 18.6834 16.2071 18.2929L9.91421 12L16.2071 5.70711C16.5976 5.31658 16.5976 4.68342 16.2071 4.29289C15.8166 3.90237 15.1834 3.90237 14.7929 4.29289L7.79289 11.2929C7.40237 11.6834 7.40237 12.3166 7.79289 12.7071L14.7929 19.7071C15.1834 20.0976 15.8166 20.0976 16.2071 19.7071Z"></path></svg>
          </a>
          <a>{serachParams.get('page') !== null ? parseInt(page) + 1 : 1}</a>
          <a href={parseInt(page) + 1 >= max ? window.location.href : `/instances?page=${parseInt(page) + 1}`}>
            <svg className={parseInt(page) + 1 >= max ? 'disabled' : 'enabled'} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fillRule="evenodd" clipRule="evenodd" d="M7.79289 19.7071C7.40237 19.3166 7.40237 18.6834 7.79289 18.2929L14.0858 12L7.79289 5.70711C7.40237 5.31658 7.40237 4.68342 7.79289 4.29289C8.18342 3.90237 8.81658 3.90237 9.20711 4.29289L16.2071 11.2929C16.5976 11.6834 16.5976 12.3166 16.2071 12.7071L9.20711 19.7071C8.81658 20.0976 8.18342 20.0976 7.79289 19.7071Z"></path></svg>
          </a>
          <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { setCreateModal(true) }}>인스턴스 생성</Button>
        </div>

      </Top>

      <TableMain>
        <Table
          columnDisplay={[
            { id: "카테고리", visible: true },
            { id: "목적", visible: true },
            { id: "명령", visible: true },
            { id: "상태", visible: true },
            { id: "관리자", visible: true },
            { id: "인스턴스 명", visible: true },
            { id: "키페어", visible: true },
            { id: "공인 IP", visible: true },
            { id: "인스턴스 타입", visible: true },
            { id: "운영체제", visible: true },
            { id: "저장공간 용량", visible: true },
            { id: "포트", visible: true },
            { id: "인스턴스 요금", visible: true },
            { id: "메모", visible: true }
          ]}

          columnDefinitions={[
            {
              id: "카테고리",
              header: "카테고리",
              cell: (item: InstancesType) => item.category,
              width: '100px',
              isRowHeader: true
            },
            {
              id: "목적",
              header: "목적",
              cell: (item: InstancesType) => item.description,
              width: '150px'
            },
            {
              id: "명령",
              header: "명령 표시",
              cell: (item: InstancesType) => (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: '8px', lineBreak: 'auto' }}>
                  <ButtonScape className='greenButton ButtonList' variant="primary" onClick={() => { void inviteInstance(item.id) }}>
                    초대링크 복사
                  </ButtonScape>

                  <ButtonScape className='blueButton ButtonList' variant="primary" onClick={() => { void restartInstance(item.id) }}>
                    재시작
                  </ButtonScape>

                  <ButtonScape className='redButton ButtonList' variant="primary" onClick={() => { void resetInstance(item.id) }}>
                    초기화
                  </ButtonScape>

                  <ButtonScape className='redButton ButtonList' variant="primary" onClick={() => { void deleteInstance(item.id) }}>
                    삭제
                  </ButtonScape>

                  <ButtonScape className='orangeButton ButtonList' variant="primary" onClick={() => { void updateForm(item.id) }}>
                    수정
                  </ButtonScape>
                </div>
              ),
              width: '600px'
            },
            {
              id: "상태",
              header: "스테이터스 표시",
              cell: (item: InstancesType) => (
                <StatusIndicator type={showStatus(item.state).value}>
                  {showStatus(item.state).label}
                </StatusIndicator>
              )
            },
            {
              id: "관리자",
              header: "관리자",
              cell: (item: InstancesType) => item.owner,
              width: '150px'
            },
            {
              id: "인스턴스 명",
              header: "인스턴스 명",
              cell: (item: InstancesType) => item.name,
              width: '300px'
            },
            {
              id: "키페어",
              header: "키페어 설치",
              cell: (item: InstancesType) => (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
                  <ButtonScape className='greenButton' variant="primary" onClick={() => void downloadKeypair(item.id, item.name)}>다운로드</ButtonScape>
                </div>
              ),
              width: '150px'
            },
            {
              id: "공인 IP",
              header: "공인 IP",
              cell: (item: InstancesType) => item.publicIP,
              width: '150px'
            },
            {
              id: "인스턴스 타입",
              header: "인스턴스 타입",
              cell: (item: InstancesType) => item.type,
              width: '150px'
            },
            {
              id: "운영체제",
              header: "운영체제 표시",
              cell: () => "UBUNTU OS",
              width: '150px'
            },
            {
              id: "저장공간 용량",
              header: "저장공간 용량",
              cell: (item: InstancesType) => item.storageSize + " GB",
              width: '150px'
            },
            {
              id: "포트",
              header: "포트 표시",
              cell: (item: InstancesType) => item.ports,
              width: '300px'
            },
            {
              id: "인스턴스 요금",
              header: "인스턴스 요금 표시",
              cell: (item: InstancesType) => Number(item.pricePerHour) + (item.storageSize * 0.1) + "$",
              width: '100px'
            },
            {
              id: "메모",
              header: "메모 표시",
              cell: (item: InstancesType) => item.memo,
              width: '600px'
            }
          ]}

          items={instances}

          loadingText="Loading resources"
        />
      </TableMain>
      <UpdateModal display={updateModalStatus} booleanAction={setUpdateModal} instance={event} instanceAction={dispatch} uuid={uuid}></UpdateModal>
      <CreateModal display={createModalStatus} action={setCreateModal}></CreateModal>
    </Body>
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
`;

export default Search