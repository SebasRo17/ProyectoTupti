import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Pages/Registro/Registro.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* BrowserRouter envuelve todo para manejar las rutas */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
