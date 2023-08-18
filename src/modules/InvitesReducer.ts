import { type InvitesAction, type InvitesState } from '../utils/interfaces'

export default function invitesReducer (state: InvitesState, action: InvitesAction): any {
  switch (action.type) {
    case 'setCategory':
      return { ...state, category: action.category }
    case 'setName':
      return { ...state, name: action.name }
    case 'setDescription':
      return { ...state, description: action.description }
    case 'setOwner':
      return { ...state, owner: action.owner }
    case 'setType':
      return { ...state, type: action.instance }
    case 'setStorage':
      return { ...state, storage: action.storage }
    case 'setIp':
      return { ...state, ip: action.ip }
    case 'setPorts':
      return { ...state, ports: action.ports }
    case 'setMemo':
      return { ...state, memo: action.memo }
    default:
      return state
  }
}
