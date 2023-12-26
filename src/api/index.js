// import { useRouter } from 'vue-router'
import axios from 'axios';
import instance from '@/api/interceptors' 


// авторизация
export async function getAuth(params) {
  const url = import.meta.env.VITE_URL_BACK_AUTH;
  try {
    const response = await instance.post(url, params);
    return response.data;
  } 
  catch (error) {
    if(error?.response?.status === 401) {
      console.log('message', error.message);
    } else {
        throw error;
    }
  }
}

// проверка авторизации, не просрочен ли токен
export async function isAuthStatus(token) {
  const url = import.meta.env.VITE_URL_VERIFICATION_TOKEN;
  if (token && url) {
    try {
      const response = await axios.post(url, {clientToken: token}, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
        if(error?.response?.status === 401) {
          console.log('message', error.message);
        } else {
            throw error;
        }
    }
  }
}


// запрос таблицы
export async function requestTable({nameBD, nameTableBD}) {
  const url = `${import.meta.env.VITE_URL_BACK_SQL}?nameBD=${nameBD}&nameTableBD=${nameTableBD}`;
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    if(error?.response?.status === 401) {
      console.log('message', error.message);
    } else {
        throw error;
    }
  }
}

// запрос названия таблиц в БД
export async function requestDatabaseTables(nameTableBD) {
  const url = import.meta.env.VITE_URL_TablesName;
  try {
    const response = await instance.get(url, { params: nameTableBD });
    return response.data;
  } catch (error) {
    if(error?.response?.status === 401) {
      console.log('message', error.message);
    } else {
        throw error;
    }
  }
}

// правка таблицы
export async function editTable({ nameBD, nameTableBD, date }) {
  const url = import.meta.env.VITE_URL_TablesEdit;
  try {
    const result = await instance.post(url, { nameBD, nameTableBD, date }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    if(error?.response?.status === 401) {
      console.log('message', error.message);
    } else {
        throw error;
    }
  }
}


