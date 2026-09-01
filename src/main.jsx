import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Entrance choreography plays once per session (benji.org pattern):
// mark revisits before first paint so the animation doesn't replay.
try {
  if (sessionStorage.getItem('visited')) {
    document.documentElement.classList.add('revisit')
  } else {
    sessionStorage.setItem('visited', '1')
  }
} catch { /* storage unavailable: entrance simply replays */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
