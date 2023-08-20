import { StatusIndicator, Table } from '@cloudscape-design/components'
import { useReducer, type FC, useState } from 'react'
import { type InstancesType } from '../../utils/interfaces'
import Button from '@cloudscape-design/components/button'
import updateModalReducer from '../../modules/ModalReducer'
import axios from 'axios'
import UpdateModal from '../UpdateModal'
import showStatus from '../../utils/showStatus'

interface Props {
  instances: InstancesType[]
  isLoading: boolean
}

const InstanceTable: FC<Props> = ({ instances, isLoading }) => {
  const [uuid, setUuid] = useState('')
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

  async function deleteInstance (uuid: string): Promise<void> {
    if (confirm('정말 삭제 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}`, {
        method: 'DELETE'
      }).then(() => { alert('인스턴스가 삭제되었습니다.') })
        .catch(() => { alert('인스턴스를 삭제하는 도중 에러가 발생했습니다.') })
      window.location.reload()
    }
  }

  async function restartInstance (uuid: string): Promise<void> {
    if (confirm('정말 재시작 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}/restart`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 재시작 되었습니다.') })
        .catch(() => { alert('인스턴스를 재시작하는 도중 에러가 발생했습니다.') })
      window.location.reload()
    }
  }

  async function resetInstance (uuid: string): Promise<void> {
    if (confirm('정말 초기화 하시겠습니까?')) {
      await axios(`/api/instances/${uuid}/reset`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 초기화 되었습니다.') })
        .catch(() => { alert('인스턴스를 초기화하는 도중 에러가 발생했습니다.') })
      window.location.reload()
    }
  }

  async function downloadKeypair (uuid: string, name: string): Promise<void> {
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

  async function updateForm (uuid: string): Promise<void> {
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

  async function inviteInstance (uuid: string): Promise<void> {
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
    <>
      <Table
        variant="full-page"
        columnDisplay={[
          { id: '카테고리', visible: true },
          { id: '목적', visible: true },
          { id: '명령', visible: true },
          { id: '상태', visible: true },
          { id: '관리자', visible: true },
          { id: '인스턴스 명', visible: true },
          { id: '키페어', visible: true },
          { id: '공인 IP', visible: true },
          { id: '인스턴스 타입', visible: true },
          { id: '운영체제', visible: true },
          { id: '저장공간 용량', visible: true },
          { id: '포트', visible: true },
          { id: '인스턴스 요금', visible: true },
          { id: '메모', visible: true }
        ]}

        columnDefinitions={[
          {
            id: '카테고리',
            header: '카테고리',
            cell: (item: InstancesType) => item.category,
            width: '100px',
            isRowHeader: true
          },
          {
            id: '목적',
            header: '목적',
            cell: (item: InstancesType) => item.description,
            width: '150px'
          },
          {
            id: '명령',
            header: '-',
            cell: (item: InstancesType) => (
              <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', lineBreak: 'auto' }}>
                <Button className='greenButton ButtonList' variant="primary" onClick={() => { void inviteInstance(item.id) }}>
                  초대링크 복사
                </Button>

                <Button className='blueButton ButtonList' variant="primary" onClick={() => { void restartInstance(item.id) }}>
                  재시작
                </Button>

                <Button className='redButton ButtonList' variant="primary" onClick={() => { void resetInstance(item.id) }}>
                  초기화
                </Button>

                <Button className='redButton ButtonList' variant="primary" onClick={() => { void deleteInstance(item.id) }}>
                  삭제
                </Button>

                <Button className='orangeButton ButtonList' variant="primary" onClick={() => { void updateForm(item.id) }}>
                  수정
                </Button>
              </div>
            ),
            width: '550px'
          },
          {
            id: '상태',
            header: '상태',
            cell: (item: InstancesType) => (
              <StatusIndicator type={showStatus(item.state).value}>
                {showStatus(item.state).label}
              </StatusIndicator>
            )
          },
          {
            id: '관리자',
            header: '관리자',
            cell: (item: InstancesType) => item.owner,
            width: '150px'
          },
          {
            id: '인스턴스 명',
            header: '인스턴스 명',
            cell: (item: InstancesType) => item.name,
            width: '300px'
          },
          {
            id: '키페어',
            header: '키페어 설치',
            cell: (item: InstancesType) => (
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
                <Button className='greenButton' variant="primary" onClick={() => { void downloadKeypair(item.id, item.name) }}>다운로드</Button>
              </div>
            ),
            width: '150px'
          },
          {
            id: '공인 IP',
            header: '공인 IP',
            cell: (item: InstancesType) => item.publicIP,
            width: '150px'
          },
          {
            id: '인스턴스 타입',
            header: '인스턴스 타입',
            cell: (item: InstancesType) => item.type,
            width: '150px'
          },
          {
            id: '운영체제',
            header: '운영체제 표시',
            cell: () => 'UBUNTU OS',
            width: '150px'
          },
          {
            id: '저장공간 용량',
            header: '저장공간 용량',
            cell: (item: InstancesType) => item.storageSize.toString() + ' GB',
            width: '150px'
          },
          {
            id: '포트',
            header: '열려있는 포트',
            cell: (item: InstancesType) => item.ports,
            width: '300px'
          },
          {
            id: '인스턴스 요금',
            header: '인스턴스 요금',
            cell: (item: InstancesType) => (item.pricePerHour + (item.storageSize * 0.1)).toString() + '$',
            width: '200px'
          },
          {
            id: '메모',
            header: '메모',
            cell: (item: InstancesType) => item.memo,
            width: '600px'
          }
        ]}

        items={instances}
        loading={isLoading}

        loadingText="인스턴스를 불러오는 중..."
      />

      <UpdateModal display={updateModalStatus} booleanAction={setUpdateModal} instance={event} instanceAction={dispatch} uuid={uuid}></UpdateModal>
    </>
  )
}

export default InstanceTable
