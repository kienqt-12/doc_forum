import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import theme from './theme.js'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CSSVarsProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CSSVarsProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </CSSVarsProvider>
  </StrictMode>,
)
