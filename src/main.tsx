import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Treat benign, sandbox-specific Vite HMR WebSocket connection failure messages gracefully
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const errorStr = reason ? (reason.message || String(reason)) : '';
    if (errorStr && (
      errorStr.includes('WebSocket') || 
      errorStr.includes('websocket') ||
      errorStr.includes('connection failed') ||
      errorStr.includes('closed without opened')
    )) {
      event.preventDefault(); // Suppresses the runtime error overlay popup
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorStr = event.message || '';
    if (errorStr && (
      errorStr.includes('WebSocket') || 
      errorStr.includes('websocket') ||
      errorStr.includes('closed without opened')
    )) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
