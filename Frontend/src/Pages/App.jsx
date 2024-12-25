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
import NuevoProducto from './nuevoProductoAdmin/nuevoProductoAdmin.jsx';
import Direccion from './Direccion/direccion.jsx';
import MetodoPago from './MetodoPago/MetodoPago.jsx';
import DireccionesGuardadas from '../Components/Direcciones/direcciones.jsx';
import PDFModelo from '../Components/PDFModelo/pdf.jsx'; // Importa el componente PDFModelo
import Usuario from '../Components/Usuario/usuario.jsx';

function App() {
  return (
    <div>
       
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Categoria/:id" element={<Categoria />} />
        <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />
        <Route path="/Direccion" element={<Direccion />} />
        <Route path="/DireccionesGuardadas" element={<DireccionesGuardadas />} />
        <Route path="/Usuario" element={<Usuario />} />
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
         <Route path="/NuevoProducto" 
          element={
            <AuthGuard>
              <NuevoProducto />
            </AuthGuard>
          } 
        />
                 <Route path="/MetodoPago" 
          element={
            <AuthGuard>
              <MetodoPago />
            </AuthGuard>
          } 
        />
        <Route path="/pdf/:id" element={<PDFModelo />} /> {/* Nueva ruta para el PDF con ID */}
      </Routes>
    </div>
  );
}

export default App;
