//@ts-nocheck
//font modules are somehow not found by ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import '@fontsource/poppins';
import '@fontsource-variable/quicksand';
import '@fontsource-variable/montserrat';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
