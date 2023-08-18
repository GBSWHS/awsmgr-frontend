import React, { type FC, useCallback, useEffect, useReducer, useState } from 'react'
import { styled } from 'styled-components'
import createModalReducer from '../modules/ModalReducer'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import Button from './Button'
import { Alert } from '@cloudscape-design/components'

interface Props {
  display: boolean
  action: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateModal: FC<Props> = (props) => {
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => { updateState({}) }, [])
  const [status, setStatus] = useState("normal");
  const [price, setPrice] = useState(0)
  const [event, dispatch] = useReducer(createModalReducer, {
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

  async function getPrice(type: string, storage: number): Promise<void> {
    forceUpdate()
    await axios.get(`/api/instances/price?instanceType=${type ?? 't3a.micro'}`)
      .then((res) => {
        setPrice(((res.data.body.pricePerHour * 24) * 30) + ((Number.isNaN(storage) ? 0 : storage) * 0.1))
      })
      .catch((err) => { console.error(err) })
  }

  useEffect(() => {
    void getPrice(event.type, event.storage)
  }, [])

  function portEnter(e: any): void {
    if (e.keyCode === 13) {
      const exists = event.ports.some((item: any) => item.value === event.port) as boolean
      if (!exists) {
        dispatch({ type: 'setPort', port: '' })
        dispatch({ type: 'addPort', port: event.port })
      }
    }
  }

  async function create(): Promise<void> {
    forceUpdate()
    setStatus("loading");
    await axios('/api/instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        category: event.category,
        name: event.name,
        description: event.description,
        owner: event.owner,
        type: event.type,
        storageSize: event.storage,
        ports: event.ports.map((item: any) => item.value).sort().join(','),
        memo: event.memo
      }
    }).then(() => {
      setStatus("success");
      setTimeout(() => {
        window.location.reload()
      }, 800)
    }).catch((err) => { setStatus("error") })
  }

  return (
    <Body style={{ display: props.display ? 'block' : 'none' }}>
      <Main>
        {status === "normal" ?
          <></>
          :
          status === "success" ?
            <Alert
              dismissible
              statusIconAriaLabel="Success"
              type="success"
              header={
                <React.Fragment>
                  인스턴스 생성 완료
                </React.Fragment>
              }
            >
              잠시 후 새로고침 됩니다.
            </Alert>
            :
            status === "error" ?
              <Alert
                statusIconAriaLabel="Error"
                type="error"
                header={
                  <React.Fragment>
                    인스턴스 생성 중 에러 발생!
                  </React.Fragment>
                }
              >
                잠시 후 다시시도 해주세요!
              </Alert>
              :
              <Alert
                statusIconAriaLabel="Warning"
                type="warning"
                header={
                  <React.Fragment>
                    인스턴스 생성중 ...
                  </React.Fragment>
                }
              >
                새로고침을 하거나 창을 닫지 마세요.
              </Alert>
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <p style={{ fontSize: '28px', fontWeight: 600, marginBottom: '20px' }}>인스턴스 생성</p>
          <svg style={{ cursor: 'pointer' }} onClick={() => { props.action(false) }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>
        </div>

        <Form>
          <input className="input" onChange={(e) => { dispatch({ type: 'setCategory', category: e.target.value }) }} placeholder="분류 | (예: 캡스톤)"></input>
          <input className="input" onChange={(e) => { dispatch({ type: 'setName', name: e.target.value }) }} placeholder="이름 | (예: capstone-2023-1-4)"></input>
          <input className="input" onChange={(e) => { dispatch({ type: 'setDescription', description: e.target.value }) }} placeholder="목적 | (예: 2023년 1학기 캡스톤 #4)"></input>
          <input className="input" onChange={(e) => { dispatch({ type: 'setOwner', owner: e.target.value }) }} placeholder="관리자 | (예: 박민혁)"></input>
          <input className="input" onChange={(e) => { dispatch({ type: 'setType', instance: e.target.value }); void getPrice(e.target.value, event.storage) }} list="typeList" placeholder="인스턴스 타입 | t3a.micro"></input>
          <datalist id="typeList" defaultValue={'t3a.micro'}>
            <option value={'t3a.micro'}>t3a.micro</option>
            <option value={'t3a.nano'}>t3a.nano</option>
            <option value={'t3a.small'}>t3a.small</option>
            <option value={'t2.nano'}>t2.nano</option>
          </datalist>
          <label><input className="input ssd" value={event.storage} onChange={(e) => { dispatch({ type: 'setStorage', storage: parseInt(e.target.value) }); void getPrice(event.type, parseInt(e.target.value)) }} type="number" placeholder="저장공간 용량: (예: 8)"></input>GB</label>
          <CreatableSelect
            className="createSelect"
            components={{ DropdownIndicator: null }}
            inputValue={event.port}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(portValue) => { dispatch({ type: 'setPorts', ports: portValue as any }) }}
            onInputChange={(e) => { dispatch({ type: 'setPort', port: e.toString() }) }}
            onKeyDown={portEnter}
            placeholder="포트"
            value={event.ports}
            styles={{
              control: (base) => ({
                ...base,
                border: '1px solid hsl(0, 0%, 80%)',
                boxShadow: 'none',
                '&:hover': {
                  border: '2px solid #ff9900'
                }
              })
            }}
          />
          기타메모
          <textarea onChange={(e) => { dispatch({ type: 'setMemo', memo: e.target.value }) }} value={event.memo}></textarea>
          <Bottom>
            <h1>예상 금액: {price}$/월</h1>
            <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { void create() }}>생성</Button>
          </Bottom>
        </Form>
      </Main>
    </Body>
  )
}

export default CreateModal

const Body = styled.div`
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`

const Form = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  input.input {
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    padding-left: 10px;
    padding-right: 5px;
    outline: none;
  }

  input.input:hover, input.input:focus, textarea:hover, textarea:focus {
    border: 2px solid #ff9900;
    outline: none;
  }

  .createSelect {
    width: 100%;
    font-size: 16px;
    height: 50px;
    outline: none;
  }

  input.input, textarea {
    width: 100%;
    min-height: 50px;
    resize: none;
    padding-top: 0;
    padding-bottom: 0;
  }

  label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  textarea {
    padding: 4px;
    outline: none;
    border-radius: 4px;
    border: 1px solid hsl(0, 0%, 80%);
  }

  input.ssd {
    text-align: right;
  }
`

const Main = styled.div`
  z-index: 99;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 100%;
  padding: 20px;
  max-width: 500px;
`

const Bottom = styled.div`
  display: flex;
  float: right;
  align-items: center;
  align-self: flex-end;
`
