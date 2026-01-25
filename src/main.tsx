import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './App.css';
import { RecipesProvider } from './context/RecipesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecipesProvider>
      <App />
    </RecipesProvider>
  </StrictMode>,
)
