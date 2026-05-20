import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/index.css';
import App from '@/app/App.tsx';
import { AuthProvider } from '@/context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
