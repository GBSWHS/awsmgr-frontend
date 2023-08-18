import axios from "axios";
import { useEffect, useReducer, useState } from "react"
import { styled } from "styled-components"
import CreateModal from "../components/createModal";
import Button from "../components/Button";
import updateModalReducer from "../modules/ModalReducer";
import UpdateModal from "../components/updateModal";
import { Body, Title, Top } from "../styles/globals";
import { useLocation } from "react-router-dom";

export default function Instances() {
  const location = useLocation()
  const serachParams = new URLSearchParams(location.search);
  const page = serachParams.get('page') || "0";
  const [max, setMax] = useState(0);
  const [uuid, setUuid] = useState('');
  const [instances, setInstances] = useState([]);
  const [createModalStatus, setCreateModal] = useState(false);
  const [updateModalStatus, setUpdateModal] = useState(false);
  const [event, dispatch] = useReducer(updateModalReducer, {
    category: '',
    name: '',
    description: '',
    owner: '',
    type: 't3a.micro',
    storage: 8,
    port: '',
    ports: [],
    memo: '',
  })

  useEffect(() => {
    axios(`/api/instances?take=10&skip=${parseInt(String(serachParams.get('page') ? page : "0")) * 10}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => {
      setInstances(res.data.body.instances);
      setMax(res.data.body.pageCount)
    }).catch((err) => console.error(err))
  }, [serachParams.get('page')])

  async function deleteInstance(uuid: string) {
    if (confirm("정말 삭제 하시겠습니까?")) {
      await axios(`/api/instances/${uuid}`, {
        method: 'DELETE',
      }).then(() => alert("인스턴스가 삭제되었습니다."))
        .catch(() => alert("인스턴스를 삭제하는 도중 에러가 발생했습니다."))
    }
    else return
  }

  async function restartInstance(uuid: string) {
    if (confirm("정말 재시작 하시겠습니까?")) {
      await axios(`/api/instances/${uuid}/restart`, {
        method: 'POST',
      }).then(() => alert("인스턴스가 재시작 되었습니다."))
        .catch(() => alert("인스턴스를 재시작하는 도중 에러가 발생했습니다."))
    }
    else return
  }

  async function resetInstance(uuid: string) {
    if (confirm("정말 초기화 하시겠습니까?")) {
      await axios(`/api/instances/${uuid}/reset`, {
        method: 'POST',
      }).then(() => alert("인스턴스가 초기화 되었습니다."))
        .catch(() => alert("인스턴스를 초기화하는 도중 에러가 발생했습니다."))
    }
    else return
  }

  async function downloadKeypair(uuid: string, name: string) {
    await axios(`/api/instances/${uuid}/keypair`, {
      method: 'GET',
    }).then((res) => {
      const blob = new Blob([res.data.body], { type: 'text/plain' });
      const downloadLink = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = `${name ? name : uuid}.ppk`;
      a.click();

      URL.revokeObjectURL(downloadLink);
    })
      .catch((err) => console.error(err))
  }

  async function updateForm(uuid: string) {
    await axios(`/api/instances/${uuid}`, {
      method: 'GET'
    }).then((res) => {
      setUuid(uuid);
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

  async function inviteInstance(uuid: string) {
    await axios('/api/invites', {
      method: 'POST',
      data: {
        instanceUUID: uuid
      }
    }).then((res) => {
      const $textarea = document.createElement("textarea");

      // body 요소에 존재해야 복사가 진행됨
      document.body.appendChild($textarea);

      // 복사할 특정 텍스트를 임시의 textarea에 넣어주고 모두 셀렉션 상태
      $textarea.value = `${window.location.origin}/invites/${res.data.body.uuid}`;
      $textarea.select();

      // 복사 후 textarea 지우기
      document.execCommand('copy');
      document.body.removeChild($textarea);

      alert("초대링크를 복사했습니다.")
    })
  }

  return (
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div>
          <a href={parseInt(page) + 1 > 1 ? `/instances?page=${parseInt(page) - 1}` : window.location.href}>
            <svg className={parseInt(page) + 1 > 1 ? "enabled" : "disabled"} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.2071 19.7071C16.5976 19.3166 16.5976 18.6834 16.2071 18.2929L9.91421 12L16.2071 5.70711C16.5976 5.31658 16.5976 4.68342 16.2071 4.29289C15.8166 3.90237 15.1834 3.90237 14.7929 4.29289L7.79289 11.2929C7.40237 11.6834 7.40237 12.3166 7.79289 12.7071L14.7929 19.7071C15.1834 20.0976 15.8166 20.0976 16.2071 19.7071Z"></path></svg>
          </a>
          <a>{serachParams.get('page') ? parseInt(page) + 1 : 1}</a>
          <a href={parseInt(page) + 1 >= max ? window.location.href : `/instances?page=${parseInt(page) + 1}`}>
            <svg className={parseInt(page) + 1 >= max ? "disabled" : "enabled"} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.79289 19.7071C7.40237 19.3166 7.40237 18.6834 7.79289 18.2929L14.0858 12L7.79289 5.70711C7.40237 5.31658 7.40237 4.68342 7.79289 4.29289C8.18342 3.90237 8.81658 3.90237 9.20711 4.29289L16.2071 11.2929C16.5976 11.6834 16.5976 12.3166 16.2071 12.7071L9.20711 19.7071C8.81658 20.0976 8.18342 20.0976 7.79289 19.7071Z"></path></svg>
          </a>
          <Button style={{ backgroundColor: "#ff9900" }} onClick={() => setCreateModal(true)}>인스턴스 생성</Button>
        </div>

      </Top>

      <TableMain>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>&nbsp;</th>
              <th style={{ width: '150px' }}>목적</th>
              <th style={{ width: '600px' }}>Action</th>
              <th style={{ width: '150px' }}>관리자</th>
              <th style={{ width: '300px' }}>인스턴스 이름</th>
              <th style={{ width: '150px' }}>키페어</th>
              <th style={{ width: '150px' }}>Public IP</th>
              <th style={{ width: '150px' }}>인스턴스 타입</th>
              <th style={{ width: '150px' }}>OS</th>
              <th style={{ width: '150px' }}>저장공간</th>
              <th style={{ width: '300px' }}>포트</th>
              <th style={{ width: '100px' }}>요금</th>
              <th style={{ width: '600px' }}>메모</th>
            </tr>
          </thead>

          <tbody>
            {instances.length !== 0 ?
              instances.map((value: any, index: number) => (
                <tr key={index}>
                  <td width={100}>{value.category}</td>
                  <td width={150}>{value.description}</td>
                  <td width={600}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
                      <Button style={{ backgroundColor: "#3c8700", color: "#fff" }} onClick={() => inviteInstance(value.uuid)}>
                        초대링크 복사
                      </Button>

                      <Button style={{ backgroundColor: "#007dbc", color: "#fff" }} onClick={() => restartInstance(value.uuid)}>
                        재시작
                      </Button>

                      <Button style={{ backgroundColor: "#df3312", color: "#fff" }} onClick={() => resetInstance(value.uuid)}>
                        초기화
                      </Button>

                      <Button style={{ backgroundColor: "#df3312", color: "#fff" }} onClick={() => deleteInstance(value.uuid)}>
                        삭제
                      </Button>

                      <Button style={{ backgroundColor: "#ff9900" }} onClick={() => updateForm(value.uuid)}>
                        수정
                      </Button>
                    </div>
                  </td>
                  <td width={150}>{value.owner}</td>
                  <td width={300}>{value.name}</td>
                  <td width={150}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
                      <Button style={{ backgroundColor: "#3c8700", color: 'white' }} onClick={() => downloadKeypair(value.uuid, value.name)}>
                        다운로드
                      </Button>
                    </div>
                  </td>
                  <td width={150}>{value.publicIP}</td>
                  <td width={150}>{value.type}</td>
                  <td width={150}>UBUNTU OS</td>
                  <td width={150}>SSD {value.storageSize}GB</td>
                  <td width={300}>{value.ports}</td>
                  <td width={100}>${((value.pricePerHour * 24) * 30) + (value.storageSize ? value.storageSize * 0.1 : 0 * 0.1)}/월</td>
                  <td width={600}>{value.memo}</td>
                </tr>
              ))
              :
              <tr>
                <td color="black" colSpan={13}>No instances to display</td>
              </tr>
            }
          </tbody>
        </table>
      </TableMain>
      <UpdateModal display={updateModalStatus} booleanAction={setUpdateModal} instance={event} instanceAction={dispatch} uuid={uuid}></UpdateModal>
      <CreateModal display={createModalStatus} action={setCreateModal}></CreateModal>
    </Body >
  )
}

const TableMain = styled.div`
  width: 100%;
  height: calc(100% - 45px);
  border: 1px solid black;
  overflow: auto;
  scroll-snap-type: both mandatory;

  table {
    width: 2850px;
    border: .4px solid black;
    scroll-snap-type: both mandatory;
  }

  tbody {
    position: relative;
  }

  th, tr, td {
    border: 1px solid black;
  }

  th {
    padding: .25rem 0;
  }

  td {
    padding: .5rem 0;
  }

  th, tr {
    text-align: center;
    font-size: 16px;
    overflow: auto;
    width: auto;
  }
`
