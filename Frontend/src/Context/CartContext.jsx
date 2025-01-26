// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCarritoByUsuario } from '../Api/carritoApi';
import jwtDecode from 'jwt-decode';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const userId = payload?.IdUsuario;
        setIdUsuario(userId);
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  }, []);

  const updateCartCount = async () => {
    if (idUsuario) {
      try {
        const carritoData = await getCarritoByUsuario(idUsuario);
        setCartCount(carritoData.detalles.length);
      } catch (error) {
        console.error('Error fetching cart', error);
        setCartCount(0);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, setIdUsuario }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};