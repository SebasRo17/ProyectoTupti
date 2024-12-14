// src/components/AuthGuard/AuthGuard.jsx
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AuthGuard = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default AuthGuard;