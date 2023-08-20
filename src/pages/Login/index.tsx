import { type FormEvent, useState, type FC } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import Container from '../../components/Container'

const Login: FC = () => {
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  async function onSubmit (e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    await axios('/api/auth/login', {
      method: 'POST',
      data: {
        password
      }
    }).then(() => { navigate('/instances?page=0') })
      .catch(() => { alert('비밀번호가 일치하지 않습니다.') })
  }

  return (
    <Container>
      <div className={style.content}>
        <img src="/assets/images/logos/black.png" alt="AWS Logo" className={style.logo} />
        <form className={style.form} onSubmit={(e) => { void onSubmit(e) }}>
          <div className={style.header}>
            <h1>로그인</h1>
            <p>awsmgr is not associated with Amazon Web Service.</p>
          </div>

          <div className={style.fields}>
            <label className={style.formItem}>
              <p>사용자 이름 (고정)</p>
              <input type="text" placeholder="admin" value={'admin'} disabled style={{ color: 'gray' }} />
            </label>

            <label className={style.formItem}>
              <label>비밀번호</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            </label>

            <button className={style.submitBtn}>로그인</button>
          </div>
        </form>

        <div className={style.footer}>
          <small>계속 진행하면 <a href="https://aws.amazon.com/agreement/" target="_blank" rel="noreferrer">AWS 이용계약</a> 또는 AWS 서비스에 대한 기타 계약 및 <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noreferrer">개인정보 처리방침</a>에 동의하게 됩니다. 이 사이트는 필수 쿠키를 사용합니다. 자세한 내용은 <a href="https://aws.amazon.com/legal/cookies" target="_blank" rel="noreferrer">쿠키 고지</a>를 참조하세요.</small>
        </div>
      </div>
    </Container>
  )
}

export default Login
