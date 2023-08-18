import { styled } from "styled-components"
import { FormEvent, useState } from "react"
import axios from "axios";

export default function Login() {
  const [fetched, setFetched] = useState(false);
  const [password, setPassword] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFetched(true);

    await axios(`/api/auth/login`, {
      method: 'POST',
      data: {
        password
      }
    }).then(() => window.location.href = "/instances?page=0")
      .catch(() => alert("비밀번호가 일치하지 않습니다."))

    setFetched(false);
  }

  return (
    <Body>
      <div className={`background ${fetched ? "fetched" : "unfetched"}`}>
      </div>
      <Container>
        <div className="logo"></div>
        <div className="contents">
          <Form onSubmit={onSubmit}>
            <Header>
              <h2>
                로그인<br />
                <small>AWSMGR is not associated with Amazon Web Service.</small>
              </h2>
            </Header>
            <Content>
              <Field>
                <label>사용자 이름</label>
                <input type="text" placeholder="admin" value={"admin"} disabled style={{ color: 'gray' }} />
              </Field>
              <Field>
                <label>비밀번호</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Button type="submit">로그인</Button>
            </Content>
          </Form>
          <Footer>
            <small>계속 진행하면 <a href="https://aws.amazon.com/agreement/" target="_blank">AWS 이용계약</a> 또는 AWS 서비스에 대한 기타 계약 및 <a href="https://aws.amazon.com/privacy/" target="_blank">개인정보 처리방침</a>에 동의하게 됩니다. 이 사이트는 필수 쿠키를 사용합니다. 자세한 내용은 <a href="https://aws.amazon.com/legal/cookies" target="_blank">쿠키 고지</a>를 참조하세요.</small>
          </Footer>
        </div>
      </Container>
    </Body>
  )
}

const Body = styled.div`
  position: relative;
  z-index: 1;

  font-size: 1.4rem;
  color: #16191f;
  font-weight: 400;
  font-family: "Amazon Ember","Helvetica Neue",Roboto,Arial,sans-serif;

  > div.background {
    transition: all 0.3s;
    background-image: url(/src/assets/images/signin-background.png);
    background-repeat: no-repeat;
    background-position: bottom;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    min-width: 100vw;
    min-height: 100vh;
  }

  > div.fetched {
    filter: blur(3px);
    -webkit-filter: blur(3px);
  }

  > div.unfetched {
    filter: blur(0px);
    -webkit-filter: blur(0px);
  }
`

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 410px;
  width: 100%;

  > div.logo {
    padding-top: 140px;
    background-repeat: no-repeat !important;
    background-image: url(data:image/png;base64,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) !important;
    -webkit-background-size: 87px 52px !important;
    -moz-background-size: 87px 52px !important;
    -o-background-size: 87px 52px !important;
    background-size: 87px 52px !important;
    background-position: center !important;
  }

  > div.contents {
    margin: 0 1rem;
    color: #687078;
  }
`

const Form = styled.form`
  display: block;
  margin-top: 0em;

  box-shadow: 0 1px 1px 0 rgba(0,28,36,0.3), 1px 1px 1px 0 rgba(0,28,36,0.15), -1px 1px 1px 0 rgba(0,28,36,0.15);
  border-top: 1px solid #eaeded;
  background-color: #fff;

  > div.header {
    margin-bottom: 1rem;
  }
`

const Header = styled.div`
  font-size: 1.8rem;
  line-height: 2rem;
  color: #16191f;
  background-color: #fafafa;
  border-bottom: 1px solid #eaeded;
  padding: .7rem 1rem;
  font-weight: 700;

  > h2 {
    padding: 0 !important;
    margin: 0 !important;
    font-weight: 700;

    font-size: 1.1rem;
    line-height: 1.2rem;
    padding: 0.5rem 0;

    text-decoration: none;
    margin: 0;

    small {
      font-weight: 500;
      line-height: 0;
      font-size: 2px;
    }
  }
`

const Content = styled.div`
  padding: 6px 20px 20px 20px;
  width: 100%;
  height: auto;
`

const Button = styled.button`
  width: 100%;
  text-align: center !important;
  border: 1px solid #ff9900;
  background-color: #ff9900;
  position: relative;
  text-decoration: none;
  font-size: 14px;
  line-height: 1rem;
  padding: 2px;
  border-radius: 2px;
  font-weight: bold;
  letter-spacing: .25px;
  display: inline-block;
  cursor: pointer;
  margin-top: 25px;

  &:hover {
    background-color: #ec7211;
    border-color: #ec7211;
    text-decoration: none;
  }

  &:active {
    background: #eb5f07;
    border-color: #eb5f07;
  }
`

const Field = styled.div`
  box-sizing: border-box;
  height: auto;


  > label {
    font-size: 15px;
    line-height: 1rem;
    display: inline-block;
    color: #16191f;
  }

  > input {
    padding: 0.55rem .5rem;
    color: #16191f;
    width: 100%;
    background-color: #ffffff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #aab7b8;
    font-size: 14px;
    line-height: 2rem;
    height: 1.3rem;
    outline: none;
    font-weight: 400;
    outline: none;
    letter-spacing: 0px;
  }

  > input[type="password"] {
    letter-spacing: 5px;
  }

  > input:focus {
    outline: 1px solid #0073bb;
  }
`

const Footer = styled.div`
  display: block;
  font-size: 11.5px;
  margin-top: 20px;

  a {
    color: #0073bb;
    text-decoration: none;
    font-weight: 700;
    line-height: .75rem;
  }

  a:hover {
    font-weight: 900;
  }
` 