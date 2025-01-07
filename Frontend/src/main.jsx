import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './Pages/App.jsx'; // Asegúrate de importar el archivo correcto (App.jsx)
import { BrowserRouter } from 'react-router-dom'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}> {/* BrowserRouter envuelve todo para manejar las rutas */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
