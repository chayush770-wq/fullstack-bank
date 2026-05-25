/* ===== REACT IMPORTS ===== */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


/* ===== GLOBAL STYLES ===== */

import './styles/global.css'


/* ===== ROOT COMPONENT ===== */

import App from './App.jsx'


/* ===== APPLICATION RENDER ===== */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)