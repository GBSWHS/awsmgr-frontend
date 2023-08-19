import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GlobalStyles } from './styles/globals'
import { Toaster } from 'react-hot-toast'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
  </React.StrictMode>
)
