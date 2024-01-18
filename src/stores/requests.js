import { defineStore } from "pinia";
import { requestDatabaseTables, requestTable, editTable, delRecordTable, requestTableInfo, 
  requestColsTableInfo, requestColsTableFilterInfo, addColumnTable, namesUsers, namesTableCol } from "@/api";
import { useMessage } from '@/stores/message'
import { useAuthStore } from "@/stores/auth";
import { USERS_BD, TABLES_USERS_BD } from "@/constants";
// import { users } from '@/api/users'

export const useRequests = defineStore("requests", {
  state: () => ({
    users: null,
  }),
  getters: {
    getUsersList(state) {
      return state.users;
    },
    isUsersList(state) {
      return !!state.users;
    },
  },
  actions: {
    // запрос названия таблиц в БД
    async requestDatabaseTablesData(nameTableBD) {

      try {
        const data = await requestDatabaseTables(nameTableBD);
        if(data) {
          return data
        }
      } catch (e) {
        if(e.response.status === 401) {
          console.log(e);
        } else {
            throw e;
        }
      }
    },
    // запрос таблицы c фильтром
    async requestTableData({nameBD, nameTableBD}) {
        try {
          const data = await requestTable({nameBD, nameTableBD});
          if(data) {
            return data
          }
        } catch (e) {
          if(e.response.status === 401) {
            return
          } else {
              throw e;
          }
        }
    },
    // правка таблицы
    async requestEditTable({ nameBD, nameTableBD, date, type }) {

      const storeMessage = useMessage()
      try {
        const result = await editTable({ nameBD, nameTableBD, date, type });
        storeMessage.setMessage({
          value: 'Успішно',
          type: 'primary'
        })
        return result;
      } catch (error) {
        storeMessage.setMessage({
          value: 'Помилка при відправці даних',
          type: 'danger'
        })
        // Обработка ошибки
        if(error.response.status === 401) {
          return
        } else {
          console.error("Ошибка при отправке данных:", error);
          throw error;
        }
      }
    },
    // удаление записи
    async requestDelRecordTable({ nameBD, nameTableBD, IDs }) {
      const storeMessage = useMessage()
      try {
        const result = await delRecordTable({ nameBD, nameTableBD, IDs });
        // Обработка результата, если необходимо
        storeMessage.setMessage({
          value: 'Успішно',
          type: 'primary'
        })
        return result;
      } catch (error) {
        storeMessage.setMessage({
          value: 'Помилка при відправці даних',
          type: 'danger'
        })
        // Обработка ошибки
        if(error.response.status === 401) {
          return
        } else {
          console.error("Ошибка при отправке данных:", error);
          throw error;
        }
      }
    },

    // запрос разрешения и инфо пользователя
    async requestUserDataFilter({filterValue}) {
      
      try {
        // получаю с БД айди пользоватоля по логину
        const userInfo = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.info, filterColumn: "username", filterValue});
        if(userInfo) {
          // запрашиваю разрешенные БД 
          const userBD = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.db_access, filterColumn: "user_id", filterValue:userInfo[0].id });
          const BD_name = [];
          userBD.forEach(g => {
            BD_name.push(g.bd_name)
         })
        
         // запрашиваю разрешенные таблицы из БД
        const t_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.t_access, filterColumn: "user_id", filterValue:userInfo[0].id });
        const c_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.c_access, filterColumn: "user_id", filterValue:userInfo[0].id });
       
         // заполняю все эти данные в информацию о пользователе
         const authStore = useAuthStore();
          authStore.userInfo({
            id: Number(userInfo[0].id),
            group_id: userInfo[0].group_id,
            BD_access: BD_name,
            table_access: t_access,
            cols_access: c_access
          })
        }
      } catch (e) {
        if(e.response.status === 401) {
          return
        } else {
            throw e;
        }
      }
    },
    // запрос разрешений пользователя
    async requestUserData(id) {
    try {
       // запрашиваю разрешенные БД
        const userBD = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.db_access, filterColumn: "user_id", filterValue:id });
         // запрашиваю разрешенные таблицы из БД
         const t_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.t_access, filterColumn: "user_id", filterValue:id });

         //запрашиваю разрешения колонок

         const c_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.c_access, filterColumn: "user_id", filterValue:id });
         return {userBD, t_access, c_access}

    } catch (e) {
      if(e.response.status === 401) {
        return
      } else {
          throw e;
      }
    }
    },
    // 
    async requestColsUser(nameBD, nameTableBD) {
      try {
        return await requestColsTableInfo({nameBD, nameTableBD });
      } catch (e) {
        if(e.response.status === 401) {
          return
        } else {
            throw e;
        }
      }
      },
      async requestTableFilterCols({nameBD, nameTableBD, columns}) {
    try {
      return await requestColsTableFilterInfo({nameBD, nameTableBD, columns });
    } catch (e) {
      if(e.response.status === 401) {
        return
      } else {
          throw e;
      }
    }
    },
    async requestAddTableCol({nameBD, nameTableBD, columnName, columnType }) {
      const storeMessage = useMessage()
      try {
        await addColumnTable({nameBD, nameTableBD, columnName, columnType });
        storeMessage.setMessage({
          value: 'Успішно, роздайте дозволи на перегляд',
          type: 'primary'
        })
      } catch (e) {
        if(e.response.status === 401) {
          return
        } else {
            throw e;
        }
      }
  },
  async requestsNameUsers() {
    try {
      const result = await namesUsers();
      this.users = result.oll_users
      return result.oll_users
      // const result = users
      // this.users = result
      // return result
    } catch (e) {
      if(e.response.status === 401) {
        return
      } else {
          throw e;
      }
    }
  },
async requestNamesTableCol({nameBD, nameTableBD}) {
  try {
   return await namesTableCol({nameBD, nameTableBD});

  } catch (e) {
    if(e.response.status === 401) {
      return
    } else {
        throw e;
    }
  }
},
  
}
})