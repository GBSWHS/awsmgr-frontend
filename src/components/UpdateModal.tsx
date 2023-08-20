import type React from 'react'
import { type FC, useCallback, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import Button from './Button'
import { type ModalAction, type ModalState } from '../utils/interfaces'
import Modal from './Modal'
import { useRefreshNotifier } from './RefreshNotifier'

interface Props {
  display: boolean
  booleanAction: React.Dispatch<React.SetStateAction<boolean>>
  instance: ModalState
  instanceAction: React.Dispatch<ModalAction>
  uuid: string
}

const UpdateModal: FC<Props> = ({ display, booleanAction, instance, instanceAction, uuid }) => {
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => { updateState({}) }, [])
  const { refresh } = useRefreshNotifier()
  const [price, setPrice] = useState(0)
  const [storage, setStorage] = useState(0)
  const [isIpChange, setChange] = useState(false)

  async function getPrice (type: string): Promise<void> {
    forceUpdate()
    await axios.get(`/api/prices/${type ?? 't3a.micro'}`)
      .then((res) => {
        setPrice(res.data.body.pricePerHour * 24 * 30)
      })
      .catch((err) => { console.error(err) })
  }

  useEffect(() => {
    void getPrice(instance.type)
  }, [price])

  function portEnter (e: any): void {
    if (e.keyCode === 13 || e.keyCode === 32) {
      const exists = instance.ports.some((item: any) => item.value === instance.port.replace(/\D/g, ''))
      if (!exists) {
        instanceAction({ type: 'setPort', port: '' })
        instanceAction({
          type: 'addPort', port: instance.port.replace(/\D/g, '')
        })
      }
    }
  }

  async function update (): Promise<void> {
    forceUpdate()
    await axios(`/api/instances/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        category: instance.category,
        name: instance.name,
        description: instance.description,
        owner: instance.owner,
        type: instance.type,
        storageSize: instance.storage,
        ports: instance.ports.sort((a, b) => (a.value > b.value ? -1 : 1)).join(','),
        memo: instance.memo
      }
    })

    refresh()
    booleanAction(false)
  }

  return (
    <Modal action={booleanAction} display={display} title={`인스턴스 수정: ${instance.name}`}>
        <Form>
          <input className="input" value={instance.category} onChange={(e) => { instanceAction({ type: 'setCategory', category: e.target.value }) }} placeholder="분류 | (예: 캡스톤)"></input>
          <input className="input" disabled value={instance.name} onChange={(e) => { instanceAction({ type: 'setName', name: e.target.value }) }} placeholder="이름 | (예: capstone-2023-1-4)"></input>
          <input className="input" value={instance.description} onChange={(e) => { instanceAction({ type: 'setDescription', description: e.target.value }) }} placeholder="목적 | (예: 2023년 1학기 캡스톤 #4)"></input>
          <input className="input" value={instance.owner} onChange={(e) => { instanceAction({ type: 'setOwner', owner: e.target.value }) }} placeholder="관리자 | (예: 박민혁)"></input>
          <input className="input" value={instance.type} onChange={(e) => { setChange(true); instanceAction({ type: 'setType', instance: e.target.value }); void getPrice(e.target.value) }} list="typeList" placeholder="인스턴스 타입 | t3a.micro"></input>
          <datalist id="typeList" defaultValue={'t3a.micro'}>
            <option value={'t3a.micro'}>t3a.micro</option>
            <option value={'t3a.nano'}>t3a.nano</option>
            <option value={'t3a.small'}>t3a.small</option>
            <option value={'t2.nano'}>t2.nano</option>
          </datalist>
          <div>
            저장공간
            <label><input min={8} className="input ssd" value={instance.storage} onChange={(e) => { setChange(true); instanceAction({ type: 'setStorage', storage: parseInt(e.target.value) }); setStorage(parseInt(e.target.value)) }} type="number" placeholder="저장공간 용량: (예: 8)"></input>GB</label>
          </div>
          <div>
            열린 포트
            <CreatableSelect
              value={instance.ports.map((value) => { return { label: value, value } })}
              className="createSelect"
              components={{ DropdownIndicator: null }}
              inputValue={instance.port}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={(portValue) => { instanceAction({ type: 'setPorts', ports: portValue as any }) }}
              onInputChange={(e) => { instanceAction({ type: 'setPort', port: e.toString() }) }}
              onKeyDown={portEnter}
              placeholder="포트"
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

            <p>포트를 입력하고 엔터를 눌러주세요.</p>
          </div>
          <div>
            기타메모
            <textarea value={instance.memo} onChange={(e) => { instanceAction({ type: 'setMemo', memo: e.target.value }) }}></textarea>
          </div>
          <Bottom>
            <h1 style={{ marginRight: '10px' }}>예상 금액: {(price + storage * 0.1).toFixed(2)}$/월</h1>
            <Button style={{ backgroundColor: '#ff9900' }} onClick={() => { void update() }}>{isIpChange ? '수정 후 재시작' : '수정'}</Button>
          </Bottom>
        </Form>
    </Modal>
  )
}
export default UpdateModal

const Form = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  input.input {
    border: none;
    border-radius: 4px;
    padding-left: 10px;
    padding-right: 5px;
    outline: 1px solid hsl(0, 0%, 80%);
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
