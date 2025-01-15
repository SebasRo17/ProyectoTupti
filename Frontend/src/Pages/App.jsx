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
import NuevoDescuento from '../Components/nuevoDescuento/nuevoDescuento.jsx';
import Direccion from './Direccion/direccion.jsx';
import MetodoPago from './MetodoPago/MetodoPago.jsx';
import DireccionesGuardadas from '../Components/Direcciones/direcciones.jsx';
import PDFModelo from '../Components/PDFModelo/pdf.jsx'; // Importa el componente PDFModelo
import Configuraciones from '../Components/ConfiguracionesUsuario/configuraciones.jsx';
import Facturas from '../Components/Facturas/facturas.jsx';
import PedidosAdmin from './pedidosAdmin/pedidosAdmin.jsx';
import DescuentosAdmin from './descuentosAdmin/descuentosAdmin.jsx';
import UsuariosAdmin from './usuariosAdmin/usuariosAdmin.jsx';
import DetallePedido from './detallePedido/detallePedido.jsx';
import ResetPassword from './resetPass/reset.jsx';

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
        <Route path="/Configuraciones" element={<Configuraciones />} />
        <Route path="/Facturas" element={<Facturas />} />
        
        <Route path="/admin" 
          element={
            <AuthGuard>
              <PantallaAdmin />
            </AuthGuard>
          } 
        />
        <Route path="/NuevoDescuento" 
          element={
            <AuthGuard>
              <NuevoDescuento />
            </AuthGuard>
          } 
        />
        <Route path="/PedidosAdmin" 
          element={
            <AuthGuard>
              <PedidosAdmin />
            </AuthGuard>
          } 
        />
            <Route path="/DetallePedido/:id" element={<DetallePedido />} />
            <Route path="/pedidosAdmin" element={<PedidosAdmin />} />
        <Route path="/UsuariosAdmin" 
          element={
            <AuthGuard>
              <UsuariosAdmin />
            </AuthGuard>
          } 
        />
        <Route path="/DescuentosAdmin" 
          element={
            <AuthGuard>
              <DescuentosAdmin />
            </AuthGuard>
          } 
        />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/recuperar-contrasena/:token" element={<ResetPassword />} />
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
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
