import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import { AuthProvider } from './context/authcontext'
import { TaskProvider } from './context/taskcontext'
import { HistoryProvider } from './context/historycontext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>,
)
