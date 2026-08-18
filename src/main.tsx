import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from '@/pages/Home'
import '@/styles/fonts.css'
import '@/styles/tokens.css'
import '@/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
)
