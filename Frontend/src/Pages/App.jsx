import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TuptiPage from './pantallaPrincipal/pantallaPrincipal.jsx';
import Registro from './Registro/Registro.jsx';
import Login from './Login/Login.jsx';
import Categoria from './Categoria/Categoria.jsx';
import OlvidoContrasena from './olvidoContrasena/olvidoContrasena.jsx';
import PantallaAdmin from './pantallaAdmin/pantallaAdmin.jsx';
import RecuperarContrasena from './recuperarContrasena/recuperarContrasena';
import CarritoCompras from '../Components/CarritoCompras/CarritoCompras.jsx';
import ProductosAdmin from './productosAdmin/productosAdmin.jsx'; // Asegúrate de importar el componente
import AuthGuard from '../Components/AuthGuard/AuthGuard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Categoria/:id" element={<Categoria />} />
        <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />
        <Route path="/admin" 
          element={
            <AuthGuard>
              <PantallaAdmin />
            </AuthGuard>
          } 
        />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/carrito-compras" 
          element={
            <AuthGuard>
              <CarritoCompras />
            </AuthGuard>
          } 
        />
        <Route path="/ProductosAdmin" 
          element={
            <AuthGuard>
              <ProductosAdmin />
            </AuthGuard>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
