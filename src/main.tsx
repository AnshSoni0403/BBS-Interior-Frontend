import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LoaderProvider, SmoothScroll } from './lib/motion'
import App from './App'
import './styles/global.css'
import './styles/components.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SmoothScroll>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </SmoothScroll>
    </BrowserRouter>
  </StrictMode>,
)
