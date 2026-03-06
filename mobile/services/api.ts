import axios from 'axios';

// 1. Definimos la IP (Asegúrate de que sea la de tu PC actual)
const IP_PC = '10.171.241.150'; 

// 2. CREAMOS Y EXPORTAMOS la instancia 'api' 
// Esto es lo que le faltaba a tu código o lo que causaba el error 2304
export const api = axios.create({
  baseURL: `http://${IP_PC}:3000/api`, 
  timeout: 10000,
});




// 3. Función para obtener productos
export const fetchProducts = async () => {
  try {
    // Usamos el nuevo endpoint específico para mobile que diseñamos
    const { data } = await api.get('/mobile/products');
    
    // Retornamos la data (asumiendo que el controlador devuelve el array directo)
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error("Error en fetchProducts:", error);
    throw error;
  }
};