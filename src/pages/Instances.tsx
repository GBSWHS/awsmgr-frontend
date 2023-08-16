import axios from "axios";
import { useEffect, useReducer, useState } from "react"
import { styled } from "styled-components"
import CreateModal from "../components/createModal";
import Button from "../components/Button";
import updateModalReducer from "../modules/ModalReducer";
import UpdateModal from "../components/updateModal";
import { Body, Title, Top } from "../styles/globals";

export default function Instances() {
  const [page, setPage] = useState(0);
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
    axios(`/api/instances?take=10&skip=${page}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => {
      setInstances(res.data.body.instances);
    }).catch((err) => console.error(err))
  }, [page])

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
          <Button style={{ backgroundColor: "#ff9900" }} onClick={() => setCreateModal(true)}>인스턴스 생성</Button>
        </div>

      </Top>

      <TableMain>
        <table>
          <tbody>
            <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
            <th>목적</th>
            <th>Action</th>
            <th>관리자</th>
            <th>인스턴스 이름</th>
            <th>키페어</th>
            <th>Public IP</th>
            <th>인스턴스 타입</th>
            <th>OS</th>
            <th>저장공간</th>
            <th>포트</th>
            <th>요금</th>
            <th>메모</th>

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
              <></>
            }
          </tbody>
        </table>
      </TableMain>
      <UpdateModal display={updateModalStatus} booleanAction={setUpdateModal} instance={event} instanceAction={dispatch} uuid={uuid}></UpdateModal>
      <CreateModal display={createModalStatus} action={setCreateModal}></CreateModal>
    </Body>
  )
}

const TableMain = styled.div`
  width: 100%;
  height: 100%;
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

  padding-bottom: 50px;
`