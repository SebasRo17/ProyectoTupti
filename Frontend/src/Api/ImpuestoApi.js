import axios from 'axios';
import { API_URL } from '../config/config';

export const getAllImpuestos = async () => {
    try {
        const response = await axios.get(`${API_URL}/impuestos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching impuestos:', error);
        throw error;
    }
};