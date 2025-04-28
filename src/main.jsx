import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './util/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
    <Toaster
      position='top-right'
    
      
    />
    <App />
    </AuthProvider>
  </>,
)
