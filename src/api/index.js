
import axios from 'axios';

  export async function getAuth() {
    const url = import.meta.env.VITE_URL_BACK_AUTH;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw error;
    }
}


export async function getSQL() {
    const url = import.meta.env.VITE_URL_BACK_SQL;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw error;
    }
}