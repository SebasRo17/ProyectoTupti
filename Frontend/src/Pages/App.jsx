import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TuptiPage from './pantallaPrincipal/pantallaPrincipal.jsx';
import Registro from './Registro/Registro.jsx';
import Login from './Login/Login.jsx';
import Categoria from './Categoria/Categoria.jsx';
import olvidoContrasena from './olvidoContrasena/olvidoContrasena.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Categoria" element={<Categoria />} />
        <Route path="/olvidoContrasena" element={<olvidoContrasena />} />
      </Routes>
    </div>
  );
}

export default App;
