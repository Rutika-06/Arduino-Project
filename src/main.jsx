import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // Global resets and CSS variables (design tokens)

/*
 * WHY ReactDOM.createRoot?
 * This is React 18's new "concurrent mode" API. It enables features like
 * automatic batching and Suspense. Always use createRoot for new projects.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
