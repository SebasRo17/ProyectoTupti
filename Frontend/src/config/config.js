const getDevelopmentBaseUrl = () => 'http://localhost:3000';
const getProductionBaseUrl = () => 'https://proyectotupti.onrender.com';

export const API_URL = import.meta.env.MODE === 'development' 
  ? getDevelopmentBaseUrl()
  : getProductionBaseUrl();

export const API_BASE = `${API_URL}/api`;