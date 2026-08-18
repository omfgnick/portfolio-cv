import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from '@/pages/Home'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@/styles/fonts.css'
import '@/styles/tokens.css'
import '@/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  </React.StrictMode>,
)
