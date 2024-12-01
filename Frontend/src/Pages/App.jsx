import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TuptiPage from './pantallaPrincipal/pantallaPrincipal.jsx';
import Registro from './Registro/Registro.jsx';
import Login from './Login/Login.jsx';
import Categoria from './Categoria/Categoria.jsx';
import OlvidoContrasena from './olvidoContrasena/olvidoContrasena.jsx';  // Cambiado a PascalCase
import PantallaAdmin from './pantallaAdmin/pantallaAdmin.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />
        <Route path="/admin" element={<PantallaAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
