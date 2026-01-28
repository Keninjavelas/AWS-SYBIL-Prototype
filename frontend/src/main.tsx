import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TerminalProvider } from './context/TerminalContext'; // <--- IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TerminalProvider>  {/* <--- WRAP APP HERE */}
      <App />
    </TerminalProvider> {/* <--- CLOSE WRAPPER */}
  </React.StrictMode>,
)