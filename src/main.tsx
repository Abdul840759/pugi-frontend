import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Fire-and-forget: wake up the Render backend immediately on load,
// so it's hopefully already warm by the time the user submits a form.
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
fetch(`${apiUrl}/health`).catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
