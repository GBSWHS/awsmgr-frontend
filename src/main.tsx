import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.scss'

ReactDOM
  .createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<StrictMode><App /></StrictMode>)
