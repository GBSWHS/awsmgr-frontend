import { Body, Title, Top } from "../styles/globals"
import Button from "../components/Button"
import { useParams } from "react-router-dom"
import { useEffect, useReducer } from "react";
import axios from "axios";
import invitesReducer from "../modules/InvitesReducer";

export default function Invites() {
  const [event, dispatch] = useReducer(invitesReducer, {
    category: '',
    name: '',
    description: '',
    owner: '',
    type: 't3a.micro',
    storage: 0,
    ports: '',
    memo: '',
    ip: '',
  })
  const { uuid } = useParams<{ uuid: string }>();

  useEffect(() => {
    axios(`/api/invites/${uuid}`, {
      method: 'GET'
    }).then((res) => {
      dispatch({ type: 'setCategory', category: res.data.body.category })
      dispatch({ type: 'setDescription', description: res.data.body.description })
      dispatch({ type: 'setStorage', storage: res.data.body.storageSize })
      dispatch({ type: 'setOwner', owner: res.data.body.owner })
      dispatch({ type: 'setName', name: res.data.body.name })
      dispatch({ type: 'setMemo', memo: res.data.body.memo })
      dispatch({ type: 'setPorts', ports: res.data.body.ports })
      dispatch({ type: 'setIp', ip: res.data.body.publicIP })
    }).catch(() => {
      alert("인스턴스를 불러오는 중에 에러가 발생했습니다.\n");
      setTimeout(() => {
        window.location.href = "https://google.co.kr"
      }, 2500)
    })
  }, [uuid])

  return (
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div>
          <Button style={{ backgroundColor: "#007dbc", color: "#fff" }} onClick={() => { }}>서버 재시작</Button>
          <Button style={{ backgroundColor: "#df3312", color: "#fff" }} onClick={() => { }}>초기화</Button>
        </div>
      </Top>

    </Body>
  )
}