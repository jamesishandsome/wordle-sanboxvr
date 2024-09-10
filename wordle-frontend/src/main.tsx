import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import { Router } from './routes'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NextUIProvider>
            <Router />
        </NextUIProvider>
    </StrictMode>
)
