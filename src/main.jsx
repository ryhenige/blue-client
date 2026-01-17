import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import GlobalStyle from 'constants/styles/global'


createRoot(document.getElementById('root')).render(
  <>
    <GlobalStyle />
    <StrictMode>
      <App />
    </StrictMode>
  </>
)
