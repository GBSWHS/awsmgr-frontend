import type React from 'react'
import { type FC, useCallback, useEffect, useReducer, useState } from 'react'
import { styled } from 'styled-components'
import createModalReducer from '../modules/ModalReducer'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import Button from './Button'
import Modal from './Modal'
import { useRefreshNotifier } from './RefreshNotifier'

interface Props {
  display: boolean
  action: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateModal: FC<Props> = ({ display, action }) => {
  const { refresh } = useRefreshNotifier()
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => { updateState({}) }, [])
  const [price, setPrice] = useState(0)
  const [storage, setStorage] = useState(8)
  const [event, dispatch] = useReducer(createModalReducer, {
    category: '',
    name: '',
    description: '',
    owner: '',
    type: 't3a.micro',
    storage: 8,
    port: '',
    ports: [
      { label: '22', value: '22' },
      { label: '80', value: '80' },
      { label: '443', value: '443' },
      { label: '3306', value: '3306' }
    ],
    memo: ''
  })

  async function getPrice (type: string): Promise<void> {
    forceUpdate()
    await axios.get(`/api/prices/${type ?? 't3a.micro'}`)
      .then((res) => {
        setPrice(res.data.body.pricePerHour * 24 * 30)
      })
      .catch((err) => { console.error(err) })
  }

  useEffect(() => {
    void getPrice(event.type)
  }, [])

  function portEnter (e: any): void {
    if (e.keyCode === 13 || e.keyCode === 32) {
      const exists = event.ports.some((item: any) => item.value === event.port.replace(/\D/g, '')) as boolean
      if (!exists) {
        dispatch({ type: 'setPort', port: '' })
        dispatch({
          type: 'addPort', port: event.port.replace(/\D/g, '')
        })
      }
    }
  }

  async function create (): Promise<void> {
    forceUpdate()
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
    })

    refresh()
    action(false)
  }

  return (
    <Modal title="인스턴스 생성" display={display} action={action}>
      <Form>
        <input className="input" onChange={(e) => { dispatch({ type: 'setCategory', category: e.target.value }) }} placeholder="분류 | (예: 캡스톤)"></input>
        <input className="input" onChange={(e) => { dispatch({ type: 'setName', name: e.target.value }) }} placeholder="이름 | (예: capstone-2023-1-4)"></input>
        <input className="input" onChange={(e) => { dispatch({ type: 'setDescription', description: e.target.value }) }} placeholder="목적 | (예: 2023년 1학기 캡스톤 #4)"></input>
        <input className="input" onChange={(e) => { dispatch({ type: 'setOwner', owner: e.target.value }) }} placeholder="관리자 | (예: 박민혁)"></input>
        <input className="input" onChange={(e) => { dispatch({ type: 'setType', instance: e.target.value }); void getPrice(e.target.value) }} list="typeList" placeholder="인스턴스 타입 | t3a.micro"></input>
        <datalist id="typeList" defaultValue={'t3a.micro'}>
          <option value={'t3a.micro'}>t3a.micro</option>
          <option value={'t3a.nano'}>t3a.nano</option>
          <option value={'t3a.small'}>t3a.small</option>
          <option value={'t2.nano'}>t2.nano</option>
        </datalist>
        <div>
          저장공간
          <label><input min={8} className="input ssd" value={event.storage} onChange={(e) => { dispatch({ type: 'setStorage', storage: parseInt(e.target.value) }); setStorage(parseInt(e.target.value)) }} type="number" placeholder="저장공간 용량: (예: 8)"></input>GB</label>
        </div>
        <div>
        열린 포트
          <label>
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
                  outline: '1px solid hsl(0, 0%, 80%)',
                  boxShadow: 'none',
                  border: 'none',
                  height: '100%',
                  '&:focus': {
                    outline: '2px solid #ff9900'
                  }
                }),
                container: (base) => ({
                  ...base,
                  flexGrow: 1,
                  width: 'unset'
                })
              }}
            />
          </label>
          <p>포트를 입력하고 엔터를 눌러주세요.</p>
        </div>

        <div>
          기타메모
          <textarea onChange={(e) => { dispatch({ type: 'setMemo', memo: e.target.value }) }} value={event.memo}></textarea>
        </div>
        <Bottom>
          <h1 style={{ marginRight: '10px' }}>예상 금액: {(price + storage * 0.1).toFixed(2)}$/월</h1>
          <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { void create() }}>생성</Button>
        </Bottom>
      </Form>
    </Modal>
  )
}
export default CreateModal

const Form = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  input.input {
    border: none;
    outline: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    padding-left: 10px;
    padding-right: 5px;
    flex-grow: 1;
  }

  input.input:focus, textarea:focus {
    outline: 2px solid #ff9900;
  }

  .createSelect {
    font-size: 16px;
    height: 50px;
    outline: none;
  }

  input.input, textarea {
    min-height: 50px;
    resize: none;
    padding-top: 0;
    padding-bottom: 0;
    flex-shink: 1;
  }

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    word-break: keep-all;
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

  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;

    p {
      font-size: 12px;
    }
  }
`

const Bottom = styled.div`
  display: flex;
  float: right;
  align-items: center;
  align-self: flex-end;
`
