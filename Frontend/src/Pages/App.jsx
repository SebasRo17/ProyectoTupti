import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TuptiPage from './pantallaPrincipal/pantallaPrincipal.jsx';
import Registro from './Registro/Registro.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TuptiPage />} />
        <Route path="/Registro/Registro.jsx" element={<Registro />} />
      </Routes>
    </div>
  );
}

export default App;
