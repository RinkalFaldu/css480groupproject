// This is prototype V1.1 for Team 1: Team Leviathan
// Members: Jac Chambers, Rinkal Faldu, Trey Hansen, Mike Zhang

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
