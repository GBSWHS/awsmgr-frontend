import { type FC, useCallback, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import Button from './Button'
import { type ModalAction, type ModalState } from '../utils/interfaces'

interface Props {
  display: boolean
  booleanAction: React.Dispatch<React.SetStateAction<boolean>>
  instance: ModalState
  instanceAction: React.Dispatch<ModalAction>
  uuid: string
}

const UpdateModal: FC<Props> = (props) => {
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => { updateState({}) }, [])
  const [price, setPrice] = useState(0)
  const [isIpChange, setChange] = useState(false)

  async function getPrice (type: string, storage: number): Promise<void> {
    forceUpdate()
    await axios.get(`/api/instances/price?instanceType=${type ?? 't3a.micro'}`)
      .then((res) => {
        setPrice(((res.data.body.pricePerHour * 24) * 30) + ((Number.isNaN(storage) ? 0 : storage) * 0.1))
      })
      .catch((err) => { console.error(err) })
  }

  useEffect(() => {
    void getPrice(props.instance.type, props.instance.storage)
  }, [price])

  function portEnter (e: any): void {
    if (e.keyCode === 13) {
      const exists = props.instance.ports.some(item => item.value === props.instance.port)
      if (!exists) {
        props.instanceAction({ type: 'setPort', port: '' })
        props.instanceAction({ type: 'addPort', port: props.instance.port })
      }
    }
  }

  async function update (): Promise<void> {
    forceUpdate()
    await axios(`/api/instances/${props.uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        category: props.instance.category,
        name: props.instance.name,
        description: props.instance.description,
        owner: props.instance.owner,
        type: props.instance.type,
        storageSize: props.instance.storage,
        ports: props.instance.ports.map(item => item.value).sort().join(','),
        memo: props.instance.memo
      }
    }).then(() => {
      alert('인스턴스가 성공적으로 수정되었습니다.')
      window.location.reload()
    }).catch((err) => { console.error(err) })
  }

  return (
    <Body style={{ display: props.display ? 'block' : 'none' }}>
      <Main>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '28px', fontWeight: 600, marginBottom: '20px' }}>인스턴스 수정</p>
          <svg style={{ cursor: 'pointer' }} onClick={() => { setChange(false); props.instanceAction({ type: 'shutdown' }); props.booleanAction(false) }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>
        </div>

        <Form>
          <input className="input" value={props.instance.category} onChange={(e) => { props.instanceAction({ type: 'setCategory', category: e.target.value }) }} placeholder="분류 | (예: 캡스톤)"></input>
          <input className="input" disabled value={props.instance.name} onChange={(e) => { props.instanceAction({ type: 'setName', name: e.target.value }) }} placeholder="이름 | (예: capstone-2023-1-4)"></input>
          <input className="input" value={props.instance.description} onChange={(e) => { props.instanceAction({ type: 'setDescription', description: e.target.value }) }} placeholder="목적 | (예: 2023년 1학기 캡스톤 #4)"></input>
          <input className="input" value={props.instance.owner} onChange={(e) => { props.instanceAction({ type: 'setOwner', owner: e.target.value }) }} placeholder="관리자 | (예: 박민혁)"></input>
          <input className="input" value={props.instance.type} onChange={(e) => { setChange(true); props.instanceAction({ type: 'setType', instance: e.target.value }); void getPrice(e.target.value, props.instance.storage) }} list="typeList" placeholder="인스턴스 타입 | t3a.micro"></input>
          <datalist id="typeList" defaultValue={'t3a.micro'}>
            <option value={'t3a.micro'}>t3a.micro</option>
            <option value={'t3a.nano'}>t3a.nano</option>
            <option value={'t3a.small'}>t3a.small</option>
            <option value={'t2.nano'}>t2.nano</option>
          </datalist>
          <label><input className="input ssd" value={props.instance.storage} onChange={(e) => { setChange(true); props.instanceAction({ type: 'setStorage', storage: parseInt(e.target.value) }); void getPrice(props.instance.type, parseInt(e.target.value)) }} type="number" placeholder="저장공간 용량: (예: 8)"></input>GB</label>
          <CreatableSelect
            value={props.instance.ports.map((value) => { return { label: value, value } })}
            className="createSelect"
            components={{ DropdownIndicator: null }}
            inputValue={props.instance.port}
            defaultInputValue={'80'}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(portValue) => { props.instanceAction({ type: 'setPorts', ports: portValue as any }) }}
            onInputChange={(e) => { props.instanceAction({ type: 'setPort', port: e.toString() }) }}
            onKeyDown={portEnter}
            placeholder="포트"
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
          <textarea value={props.instance.memo} onChange={(e) => { props.instanceAction({ type: 'setMemo', memo: e.target.value }) }}></textarea>
          <Bottom>
            <h1>예상 금액: {price}$/월</h1>
            <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { void update() }}>{isIpChange ? '수정 후 재시작' : '수정'}</Button>
          </Bottom>
        </Form>
      </Main>
    </Body >
  )
}

export default UpdateModal

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
  
  input.input:disabled:hover {
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
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
