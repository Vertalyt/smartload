import {  translateCols} from "@/functions";  
import { useRequests } from "@/stores/requests";
  
  export function editLine({id, dataTable, colsLineName}) {
        // Фильтрация данных по id
        const filteredData = dataTable.filter((line) => line.id === id);
  
        // Создание нового массива editLineDate.value
        const editLine = [];
        for (const [key, value] of Object.entries(filteredData[0])) {
          const uaName = colsLineName.find((n) => n.key_Cols === key);
          editLine.push({
            val: value,
            name_ua_cols: uaName?.name_ua_cols || key,
            key_Cols: key,
          });
        }
      return editLine
  }

  export async function requestEdit({edit, nameTableBD, EDIT, nameBTN}) {
    const newEdit = translateCols(edit);
    const storeRequests = useRequests();
    // отправить в SQL правку. после правлю текущие массивы
    try {
      return await storeRequests.requestEditTable({
        nameTableBD,
        date: nameBTN === EDIT ? newEdit : [newEdit],
        type: nameBTN === EDIT ? "edit" : "add",
      });
  
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

