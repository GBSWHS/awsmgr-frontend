interface Option {
  label: string
  value: string
}

export interface ModalState {
  category: string
  name: string
  description: string
  owner: string
  type: string | 't3a.micro' | 't3a.nano' | 't3a.small' | 't2.nano'
  storage: number
  port: string
  ports: Option[]
  memo: string
}

export type ModalAction =
  | { type: 'setCategory', category: string }
  | { type: 'setName', name: string }
  | { type: 'setDescription', description: string }
  | { type: 'setOwner', owner: string }
  | { type: 'setType', instance: string | 't3a.micro' | 't3a.nano' | 't3a.small' | 't2.nano' }
  | { type: 'setStorage', storage: number }
  | { type: 'setPort', port: string }
  | { type: 'setPorts', ports: Option[] }
  | { type: 'addPort', port: string }
  | { type: 'delPort', port: string }
  | { type: 'setMemo', memo: string }
  | { type: 'shutdown' }

export interface InvitesState {
  category: string
  name: string
  description: string
  owner: string
  type: string | 't3a.micro' | 't3a.nano' | 't3a.small' | 't2.nano'
  storage: number
  ports: string
  memo: string
  ip: string
}

export type InvitesAction =
  | { type: 'setCategory', category: string }
  | { type: 'setName', name: string }
  | { type: 'setDescription', description: string }
  | { type: 'setOwner', owner: string }
  | { type: 'setType', instance: string | 't3a.micro' | 't3a.nano' | 't3a.small' | 't2.nano' }
  | { type: 'setStorage', storage: number }
  | { type: 'setPorts', ports: string }
  | { type: 'setMemo', memo: string }
  | { type: 'setIp', ip: string }

export interface InstancesType {
  uuid: string,
  category: string,
  name: string,
  description: string,
  owner: string,
  type: string | 't3a.micro' | 't3a.nano' | 't3a.small' | 't2.nano',
  storageSize: number,
  ports: string,
  memo: string,
  keypairId: string,
  publicIP: string,
  pricePerHour: number,
  state: number
}