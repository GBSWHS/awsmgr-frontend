import { Body, Title, Top } from "../styles/globals"
import Button from "../components/Button"
import { useParams } from "react-router-dom"
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import invitesReducer from "../modules/InvitesReducer";
import { styled } from "styled-components";

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
  const [hover, setHover] = useState('mouse-normal')

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

  async function restartInstance() {
    if (confirm("정말 재시작 하시겠습니까?")) {
      await axios(`/api/invites/${uuid}/restart`, {
        method: 'POST',
      }).then(() => alert("인스턴스가 재시작 되었습니다."))
        .catch(() => alert("인스턴스를 재시작하는 도중 에러가 발생했습니다."))
    }
    else return
  }

  async function resetInstance() {
    if (confirm("정말 초기화 하시겠습니까?")) {
      await axios(`/api/invites/${uuid}/reset`, {
        method: 'POST',
      }).then(() => alert("인스턴스가 초기화 되었습니다."))
        .catch(() => alert("인스턴스를 초기화하는 도중 에러가 발생했습니다."))
    }
    else return
  }

  async function downloadKeypair() {
    await axios(`/api/invites/${uuid}/keypair`, {
      method: 'GET',
    }).then((res) => {
      const blob = new Blob([res.data.body], { type: 'text/plain' });
      const downloadLink = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = `${event.name ? event.name : uuid}.ppk`;
      a.click();

      URL.revokeObjectURL(downloadLink);
    })
      .catch((err) => console.error(err))
  }

  return (
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div>
          <Button style={{ backgroundColor: "#3c8700", color: 'white' }} onClick={downloadKeypair}>키 페어 설치</Button>
          <Button style={{ backgroundColor: "#007dbc", color: "#fff" }} onClick={restartInstance}>서버 재시작</Button>
          <Button style={{ backgroundColor: "#df3312", color: "#fff" }} onClick={resetInstance}>초기화</Button>
        </div>
      </Top>
      <Main>
        <Left>
          <div onClick={() => window.location.href = "https://aws.gbsw.hs.kr"}>
            <Image
              className={hover}
              onMouseEnter={() => setHover('mouse-on')}
              onMouseLeave={() => setHover('mouse-out')} />
            <br /><br />
            <h2>GBSW AWS 메뉴얼</h2>
          </div>
        </Left>
        <Right>
          <div>
            {event.name}<br /><br />
            server: {event.type}, SSD 주{event.storage}GB<br /><br />
            Public Internet Protocol: {event.ip}<br /><br />
            owner: {event.owner}<br /><br />
            port: {event.ports}<br /><br />
            * 추가는 관리자 문의
          </div>
        </Right>
      </Main>
    </Body>
  )
}

const Main = styled.div`
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  flex-wrap: nowrap;

  @media(max-width: 780px) {
    flex-wrap: wrap;
  }
`

const Left = styled.div`
  position: relative;
  width: 100%;

  & > div {
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  & > div:hover {
    transition: .3s all;
    top: 48%;
  }
`

const Right = styled.div`
  position: relative;
  width: 100%;

  & > div {
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 22px;
  }
`

const Image = styled.div`
  transition: 0.3s all;
  width: 250px;
  height: 250px;
  cursor: pointer;

  &.mouse-on, &.mouse-normal {
    background-image: url(/src/assets/icon/ec2-2.png);
  }

  &.mouse-out {
    background-image: url(/src/assets/icon/ec2-1.png);
  }

  &.mouse-on, &.mouse-normal, &.mouse-out {
    background-size: cover;
    background-repeat: no-repeat;
  }

  @media(max-width: 780px) {
    &.mouse-on, &.mouse-normal, &.mouse-out {
      background-image: url(/src/assets/icon/ec2-2.png);
    }
  
    &.mouse-on, &.mouse-normal, &.mouse-out {
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
`