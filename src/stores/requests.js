import { defineStore } from "pinia";
import { requestDatabaseTables, requestTable, editTable, delRecordTable, requestTableInfo } from "@/api";
import { useMessage } from '@/stores/message'
import { useAuthStore } from "@/stores/auth";
import { USERS_BD, TABLES_USERS_BD } from "@/constants";


export const useRequests = defineStore("requests", {
  state: () => ({
    user: [],
  }),
  getters: {

  },
  actions: {
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
    async requestDelRecordTable({ nameBD, nameTableBD, ID }) {
      const storeMessage = useMessage()
      try {
        const result = await delRecordTable({ nameBD, nameTableBD, ID });
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
    async requestUserDataFilter({filterValue}) {
      
      try {
        // получаю с БД айди пользоватоля
        const userInfo = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.info, filterColumn: "username", filterValue});
        if(userInfo) {
          // запрашиваю разрешенные БД 
          const userBD = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.db_access, filterColumn: "user_id", filterValue:userInfo[0].ID });
          const BD_name = [];
          userBD.forEach(g => {
            BD_name.push(g.bd_name)
         })
        
         // запрашиваю разрешенные таблицы из БД
        const t_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.t_access, filterColumn: "user_id", filterValue:userInfo[0].ID });
         
         // заполняю все эти данные в информацию о пользователе
         const authStore = useAuthStore();
          authStore.userInfo({
            id: Number(userInfo[0].ID),
            email: userInfo[0].email,
            group_id: userInfo[0].group_id,
            BD_access: BD_name,
            table_access: t_access
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
  async requestUserData(id) {
    try {
       // запрашиваю разрешенные БД
        const userBD = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.db_access, filterColumn: "user_id", filterValue:id });
         // запрашиваю разрешенные таблицы из БД
         const t_access = await requestTableInfo({nameBD:USERS_BD, nameTableBD:TABLES_USERS_BD.t_access, filterColumn: "user_id", filterValue:id });
         return {userBD, t_access}

    } catch (e) {
      if(e.response.status === 401) {
        return
      } else {
          throw e;
      }
    }
},
  },
});


