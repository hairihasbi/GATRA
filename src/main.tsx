import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CollabProvider } from './components/CollaborationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CollabProvider>
      <App />
    </CollabProvider>
  </StrictMode>,
);
