import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TuptiPage from './pantallaPrincipal/pantallaPrincipal.jsx';
import Registro from './Registro/Registro.jsx';
import Login from './Login/Login.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/Registro/Registro.jsx" element={<Registro />} />
        <Route path="/Login/Login.jsx" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
