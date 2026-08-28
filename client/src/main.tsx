// /// <reference types="vite/client" />
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import { LanguageProvider } from './context/LanguageContext';
// import { AppProvider } from './context/AppContext';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <LanguageProvider>
//       <AppProvider>
//         <App />
//       </AppProvider>
//     </LanguageProvider>
//   </StrictMode>,
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext'; 
import App from './App';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AppProvider>
          <App />
        </AppProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);