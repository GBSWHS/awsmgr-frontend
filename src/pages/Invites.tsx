import { Body, Title, Top } from '../styles/globals'
import Button from '../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import React, { type FC, useEffect, useReducer } from 'react'
import axios from 'axios'
import invitesReducer from '../modules/InvitesReducer'
import { styled } from 'styled-components'
import { Box, Container, Header, Link, SpaceBetween } from '@cloudscape-design/components'
import ButtonCloudScape from '@cloudscape-design/components/button'

const Invites: FC = () => {
  const [event, dispatch] = useReducer(invitesReducer, {
    category: '',
    name: '',
    description: '',
    owner: '',
    type: 't3a.micro',
    storage: 0,
    ports: '',
    memo: '',
    ip: ''
  })
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()

  if (uuid === undefined) {
    navigate('/login')
    return <></>
  }

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
      dispatch({ type: 'setType', instance: res.data.body.type })
    }).catch(() => {
      alert('인스턴스를 불러오는 중에 에러가 발생했습니다.\n')
      setTimeout(() => {
        window.location.href = 'https://google.co.kr'
      }, 2500)
    })
  }, [uuid])

  async function restartInstance (): Promise<void> {
    if (confirm('정말 재시작 하시겠습니까?')) {
      await axios(`/api/invites/${uuid ?? ''}/restart`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 재시작 되었습니다.') })
        .catch(() => { alert('인스턴스를 재시작하는 도중 에러가 발생했습니다.') })
    }
  }

  async function resetInstance (): Promise<void> {
    if (confirm('정말 초기화 하시겠습니까?')) {
      await axios(`/api/invites/${uuid ?? ''}/reset`, {
        method: 'POST'
      }).then(() => { alert('인스턴스가 초기화 되었습니다.') })
        .catch(() => { alert('인스턴스를 초기화하는 도중 에러가 발생했습니다.') })
    }
  }

  async function downloadKeypair (): Promise<void> {
    await axios(`/api/invites/${uuid ?? ''}/keypair`, {
      method: 'GET'
    }).then((res) => {
      const blob = new Blob([res.data.body], { type: 'text/plain' })
      const downloadLink = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadLink
      a.download = `${event.name as string}.ppk`
      a.click()

      URL.revokeObjectURL(downloadLink)
    })
      .catch((err) => { console.error(err) })
  }

  return (
    <Body>
      <Top>
        <Title>인스턴스</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button style={{ backgroundColor: '#3c8700', color: 'white' }} onClick={() => { void downloadKeypair() }}>키 페어 설치</Button>
          <Button style={{ backgroundColor: '#007dbc', color: '#fff' }} onClick={() => { void restartInstance() }}>서버 재시작</Button>
          <Button style={{ backgroundColor: '#df3312', color: '#fff' }} onClick={() => { void resetInstance() }}>초기화</Button>
        </div>
      </Top>
      <Main>
        <Left>
          <Container
            media={{
              content: (
                <img
                  src="/assets/icon/ec2-1.png"
                  alt="placeholder"
                />
              ),
              position: 'side',
              width: '33%'
            }}
          >
            <SpaceBetween direction="vertical" size="s">
              <SpaceBetween direction="vertical" size="xxs">
                <Box variant="h2">
                  <Link fontSize="heading-m" href="https://aws.gbsw.hs.kr">
                    GBSW AWS 메뉴얼
                  </Link>
                </Box>
                <Box variant="small">경북소프트웨어고등학교</Box>
              </SpaceBetween>
              <Box variant="p">

              </Box>
              <SpaceBetween direction="vertical" size="xxs">
                <Box fontWeight="bold">혹시 메뉴얼이 필요하신가요?</Box>
              </SpaceBetween>
              <ButtonCloudScape href="https://aws.gbsw.hs.kr" variant='primary' fullWidth>이동</ButtonCloudScape>
            </SpaceBetween>
          </Container>
        </Left>
        <Right>
          <Container
            footer={
              <React.Fragment>
                {event.ip}
                <br />
                {event.ports}
              </React.Fragment>
            }
            header={
              <Header
                variant="h2"
                description={`${event.type as string} SSD ${event.storage as string}GB, ${event.owner as string}`}
              >
                {event.name}
              </Header>
            }
          >
            인스턴스 수정 관련은 관리자 문의
          </Container>
        </Right>
      </Main>
    </Body>
  )
}

export default Invites

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
    font-size: 22px;
    max-width: 700px;
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
    max-width: 500px;
  }
`
