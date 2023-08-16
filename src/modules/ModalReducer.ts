import { ModalAction, ModalState } from "../utils/interfaces";

export default function ModalReducer(state: ModalState, action: ModalAction) {
  switch (action.type) {
    case 'shutdown':
      return {
        category: '',
        name: '',
        description: '',
        owner: '',
        type: 't3a.micro',
        storage: 8,
        port: '',
        ports: [],
        memo: '',
      }
    case 'setCategory':
      return { ...state, category: action.category };
    case 'setName':
      return { ...state, name: action.name };
    case 'setDescription':
      return { ...state, description: action.description };
    case 'setOwner':
      return { ...state, owner: action.owner };
    case 'setType':
      return { ...state, type: action.instance };
    case 'setStorage':
      return { ...state, storage: action.storage };
    case 'setPort':
      if (action.port.length > 5) return state
      return { ...state, port: action.port };
    case 'setPorts':
      return { ...state, ports: action.ports }
    case 'addPort':
      return { ...state, ports: [...state.ports, { label: action.port, value: action.port }], port: '' };
    case 'delPort':
      return { ...state, ports: state.ports.filter(port => port.value !== action.port) };
    case 'setMemo':
      return { ...state, memo: action.memo };
    default:
      return state;
  }

}