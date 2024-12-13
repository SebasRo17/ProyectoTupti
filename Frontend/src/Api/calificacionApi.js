const API_URL = 'http://localhost:3000/api';

export const createCalificacion = async (datos) => {
    try {
        const response = await fetch(`${API_URL}/calificaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al enviar la reseña');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getCalificaciones = async (idProducto) => {
    try {
        const response = await fetch(`${API_URL}/calificaciones/${idProducto}`);
        if (!response.ok) {
            throw new Error('Error al obtener las reseñas');
        }
        const data = await response.json();
        console.log('Datos recibidos de la API:', data); // Debug
        return data;
    } catch (error) {
        console.error('Error en getCalificaciones:', error);
        throw error;
    }
};
