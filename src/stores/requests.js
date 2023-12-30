import { defineStore } from "pinia";
import { requestDatabaseTables, requestTable, editTable, delRecordTable } from "@/api";
import { useMessage } from '@/stores/message'

const storeMessage = useMessage()
export const useRequests = defineStore("requests", {
  state: () => ({
    user: [],
  }),
  getters: {
    getToken(state) {
      return state.user;
    },
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
  },
});


