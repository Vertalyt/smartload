import axios from 'axios';
import instance from '@/api/interceptors' 


function errorLog(error) {
  if(error?.response?.status === 401) {
    console.log('message', error.message);
  } else {
    console.log(error);
      throw error;
  }
}

// авторизация
export async function getAuth(params) {
  const url = import.meta.env.VITE_URL_BACK_AUTH;
  try {
    const response = await instance.post(url, params);
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error.response
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
      errorLog(error)
    }
  }
}


// запрос таблицы
export async function requestTable(nameTableBD) {

  const url = `${import.meta.env.VITE_URL_BACK_SQL}?nameTableBD=${nameTableBD}`;

  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}


// запрос названия таблиц в БД
export async function requestDatabaseTables() {
  const url = `${import.meta.env.VITE_URL_TablesName}`;

  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}

// правка таблицы date должен быть массивом при добавлении записей
export async function editTable({ nameTableBD, date, type, searchUsername }) {
  const urlVariable =  { 
     edit : import.meta.env.VITE_URL_Edit_record,
     add : import.meta.env.VITE_URL_Tables_ADD_Record,
    };
  const url = urlVariable[type]
  try {
    const result = await instance.post(url, { nameTableBD, date, searchUsername }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    errorLog(error)
  }
}

// удаление записи по айди
export async function delRecordTable({ nameTableBD, IDs }) {

  const url = import.meta.env.VITE_URL_Tables_Del_Record


  try {
    const result = await instance.post(url, { nameTableBD, IDs }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    errorLog(error)
  }
}

// удаление записи столбца
export async function delColumnTable({ nameTableBD, columnName }) {

  const url = import.meta.env.VITE_URL_Tables_Del_Column
  try {
    const result = await instance.post(url, { nameTableBD, columnName }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    errorLog(error)
  }
}

// удаление записи по поиску
export async function delRecordForSearch({ nameTableBD, criteria }) {

  const url = import.meta.env.VITE_URL_Tables_Del_Record_Search


  try {
    const result = await instance.post(url, { nameTableBD, criteria }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    errorLog(error)
  }
}

// запрос таблицы c фильтром
export async function requestTableInfo({nameTableBD, filterColumn, filterValue}) {

  const url = `${import.meta.env.VITE_URL_Tables_add_filter}?nameTableBD=${nameTableBD}&filterColumn=${filterColumn}&filterValue=${filterValue}`;

  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}


// запрос столбцов таблицы
export async function requestColsTableInfo({nameBD, nameTableBD}) {

  const url = `${import.meta.env.VITE_URL_Cols_Table}?nameBD=${nameBD}&nameTableBD=${nameTableBD}`;
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}

// запрос таблицы по конкретным столбцам
export async function requestColsTableFilterInfo({nameTableBD, columns}) {
  const url = `${import.meta.env.VITE_URL_TablesFilterCols}?&nameTableBD=${nameTableBD}&${columns.map(column => `columns[]=${column}`).join('&')}`;

  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}

// добавление колонки
export async function addColumnTable({ nameTableBD, columnName, columnType }) {

  const url = import.meta.env.VITE_URL_Tables_Add_Col

  try {
    const result = await instance.post(url, { nameTableBD, columnName, columnType }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result;
  } catch (error) {
    errorLog(error)
  }
}

// запрашиваю пользователей
export async function namesUsers() {
  const url = import.meta.env.VITE_URL_Name_Lists
  try {
    const result = await instance.post(url);
    return result.data;
  } catch (error) {
    errorLog(error)
  }
}


// запрос имен столбцов конкретной таблицы
export async function namesTableCol({nameBD, nameTableBD}) {

  const url = `${import.meta.env.VITE_URL_Name_Cols_Table}?bd_name=${nameBD}&table_name=${nameTableBD}`;
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    errorLog(error)
  }
}