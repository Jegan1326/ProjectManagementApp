import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/User.css' // Import global styles if needed, or just App

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
