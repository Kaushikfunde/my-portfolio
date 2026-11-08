import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds ship prerendered HTML for crawlers and first paint.
// Dev keeps an empty #root and mounts normally.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
