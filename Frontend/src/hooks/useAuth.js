// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export const useAuth = () => {
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login', { state: { from: window.location.pathname }});
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return false;
      }
      return true;
    } catch (error) {
      navigate('/login');
      return false;
    }
  };

  return { checkAuth };
};