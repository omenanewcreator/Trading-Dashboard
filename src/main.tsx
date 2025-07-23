import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeSampleData } from './utils/initializeData';

console.log('🚀 Starting Trading Wallet App - ' + new Date().toLocaleTimeString());
console.log('🔄 Starting app, checking and initializing sample data if missing...');
initializeSampleData();
console.log('✅ Initialization complete.');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);