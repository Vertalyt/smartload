<template>
  <ModalWrapper
    v-if="editLineDate"
    @close="editLineDate = null"
    class="h-[96%]"
  >
    <TheTableLineEdit
      :date="editLineDate"
      :nameBTN="nameBTN"
      @update="isUpdateTable"
    />
  </ModalWrapper>

  <TheLabelLoadingDate
    v-if="Number(active_status) === 1"
    @tableData="tableData"
    @loading="handleLoadingEvent"
    @forbidden="forbidden"
  />

  <TheLoader v-if="isLoading" />

  <TheCollapsibleFilter
    :key="updateCollapsible"
    v-if="generationLineFilters.length"
    :nameFilterCol="generationLineFilters"
    :isDelColumn="delColumnFlag"
    @resetFlagDel="delColumnFlag = false"
    @sorts="sortsTable"
  />

  <span
    v-if="generationLineFilters.length === 0 && Number(active_status) !== 0"
    class="text-md flex items-center justify-center lg:text-2xl"
    >Виберіть базу даних та фільтри для завантаження.</span
  >

  <span
    v-if="Number(active_status) === 0"
    class="text-md flex items-center justify-center lg:text-2xl"
    >Ваш користувач не активний. Звернітся до адміністратора.</span
  >

  <TheTable
    v-if="sortsDataTable && colsLineName.length"
    :dataTable="sortsDataTable"
    :namesTableBD="namesTableBD"
    :namesBD="namesBD"
    :nameCols="colsLineName"
    @edit="editLineID"
    @add="addLineTable"
    @del="delLineTable"
    @column="addCol"
    @delColumn="delColumn"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import TheCollapsibleFilter from "@/components/home/TheCollapsibleFilter.vue";
import TheTable from "@/components/home/table/TheTable.vue";
import {
  sortAndFilter,
  colName,
  updateDataById,
  tableFocus,
  translateCols,
  excludeKeyFromArray,
} from "@/functions";
import TheLoader from "@/components/TheLoader.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import TheTableLineEdit from "@/components/home/table/TheTableLineEdit.vue";
import TheLabelLoadingDate from "@/components/home/TheLabelLoadingDate.vue";
import { useRequests } from "@/stores/requests";
import { useAuthStore } from "@/stores/auth";
import { ADD, EDIT, bDLists, TABLES_USERS_BD } from "@/constants";
import {  editLine, requestEdit} from '@/tableFunction'



const storeRequests = useRequests();
const authStore = useAuthStore();

const active_status = ref()

onMounted(async () => {
  isLoading.value = true
  active_status.value = await authStore.getProperty('active_status')
  isLoading.value = false
} )


// запускаю анимацию загрузки
const isLoading = ref(false);
const handleLoadingEvent = (newValue) => {
  isLoading.value = newValue;
};

const dataTable = ref(null);
const sortsDataTable = ref();

const namesBD = ref();
const namesTableBD = ref();
const nameBTN = ref(EDIT);

// массив названий отфильтрованных столбцов для таблицы
const generationLineFilters = ref([]);

// массив названий всех столбцов для таблицы
const colsLineName = ref([]);

// ключ/значения перевода каждого столбца таблицы
const colsNamesTranslation = ref();

const tableData = ({ colsNameAndDate, tablesData, nameBD, nameTableBD }) => {
  namesBD.value = nameBD;
  namesTableBD.value = nameTableBD;

  generationLineFilters.value.length = 0;
  updateCollapsible.value++;

  colsNamesTranslation.value = colsNameAndDate;


  if (colsNamesTranslation.value) {
    generationLineFilters.value = colsNamesTranslation.value.map((c) => {
      return {
        key_Cols: c.key_Cols,
        name_ua_cols: c.name_ua_cols,
      };
    });
  } else {
    generationLineFilters.value = colName(tablesData);
  }
  // отправляю в компонент фильтров список
  dataTable.value = tablesData;
};

// флаг обновления пагинатора
const updateCollapsible = ref(1);

// сортирую по данным из фильтра
const sortsSave = ref();
const sortsTable = (sort) => {
  sortsSave.value = sort;
  isLoading.value = true;
  sortsDataTable.value = null;
  sortsDataTable.value = sortAndFilter({
    sort,
    dataTable: dataTable.value,
    keyCols: colsNamesTranslation.value,
  });

  colsLineName.value = colsNamesTranslation.value
    .filter((n) => sort.some((f) => f.nameFilter === n.key_Cols))
    .map((c) => {
      return {
        name_ua_cols: c.name_ua_cols,
        key_Cols: c.key_Cols,
      };
    })
    .filter(Boolean);
    


    colsLineName.value = colsLineName.value.sort((a, b) => {
    const countA = sort.find(item => item.nameFilter === a.key_Cols).count;
    const countB = sort.find(item => item.nameFilter === b.key_Cols).count;
    return countA - countB;
});

  isLoading.value = false;
  tableFocus("#sendRef");
};

const forbidden = () => {
  sortsDataTable.value = null;
  generationLineFilters.value = [];
  updateCollapsible.value++;
};

const editLineDate = ref();

const editLineID = (id) => {
    // Создание нового массива editLineDate.value
  editLineDate.value = editLine({
    id, 
    dataTable:dataTable.value, 
    colsLineName:colsLineName.value
  })
  nameBTN.value = EDIT; // Assuming 'EDIT' is a string constant
};

async function updateLine(edit) {
  // Обновление данных только при успешной отправке запроса
  sortsDataTable.value = updateDataById({
    arrUpdate: sortsDataTable.value,
    editArr: edit,
  });
  dataTable.value = updateDataById({
    arrUpdate: dataTable.value,
    editArr: edit,
  });
}

const isUpdateTable = async (edit) => {
  const newEdit = translateCols(edit);

  // отправить в SQL правку. после правлю текущие массивы
  try {
    const result = requestEdit({edit, nameTableBD:namesTableBD.value, EDIT, nameBTN:nameBTN.value})

    if (result && nameBTN.value === EDIT) {
      updateLine(newEdit);
    }

    // добавляю в запись массива высчитав вручную айди.
    if (result && nameBTN.value === ADD) {
      const lastID = String(
        Number(dataTable.value[dataTable.value.length - 1].id) + 1,
      );
      let recordLine = { id: lastID, ...newEdit };
      dataTable.value.push(recordLine);
      if (sortsDataTable.value.length) {
        sortsDataTable.value.push(recordLine);
      }
    }

    editLineDate.value = null;
    tableFocus("#sendRef");
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
  }
};

const addLineTable = () => {
  const noId = colsLineName.value
    .filter((c) => c.name_ua_cols !== "id")
    .map((c) => {
      return {
        ...c,
        val: "",
      };
    });

  nameBTN.value = ADD;
  editLineDate.value = noId;
};

const delLineTable = async (id) => {
  const result = await storeRequests.requestDelRecordTable({
    nameBD: namesBD.value,
    nameTableBD: namesTableBD.value,
    IDs: [id],
  });
  if (result) {
    dataTable.value = dataTable.value.filter((l) => l.id !== id);
    sortsDataTable.value = sortsDataTable.value.filter((l) => l.id !== id);
  }
};

const addCol = async (val) => {
  isLoading.value = true;

  const valuesString = Object.values(val).join(", ");
  const keysString = Object.keys(val).join(", ");

  // Добавление столбца в таблицу
  const addColumnSuccess = await storeRequests.requestAddTableCol({
    nameTableBD: namesTableBD.value,
    columnName: keysString,
    columnType: "VARCHAR(255)",
  });

  if (addColumnSuccess) {
    // Подготовка данных для добавления столбца в таблицу переводов
    const date = [
      {
        bd_name: namesBD.value,
        table_name: namesTableBD.value,
        key_Cols: keysString,
        name_ua_cols: valuesString,
      },
    ];

    try {
      const [editTableResult, editAccessResult] = await Promise.all([
        // Добавление столбца в таблицу переводов
        storeRequests.requestEditTable({
          nameTableBD: bDLists.table_name,
          date,
          type: "add",
        }),
        // добавляю в разрешенные столбцы текущему пользователю
        storeRequests.requestEditTable({
          nameTableBD: TABLES_USERS_BD.c_access,
          date: [
            {
              user_id: authStore.getProperty("id"),
              bd_name: namesBD.value,
              table_name: namesTableBD.value,
              cols_name: keysString,
            },
          ],
          type: "add",
        }),
      ]);

      // Проверка успешности операций добавления столбца в таблицы
      if (editTableResult && editAccessResult) {
        // Обновление таблицы разрешений и фильтрация названий столбцов
        authStore.addCols_Access({
          bd_name: namesBD.value,
          table_name: namesTableBD.value,
          cols_name: keysString,
        });


        // Имена всех столбцов для фильтра
        generationLineFilters.value = [...generationLineFilters.value, {
          key_Cols: keysString,
          name_ua_cols: valuesString,
        }]

          // Имена столбцов отфильтрованных по разрешению для таблицы
          //сортирую по выбранным столбцам в сортировке TheCollapsibleFilter
        colsLineName.value.push({
          name_ua_cols: valuesString,
          key_Cols: keysString
        })

        colsNamesTranslation.value = [...colsNamesTranslation.value, {
          key_Cols: keysString,
          name_ua_cols: valuesString,
        }]


        dataTable.value = dataTable.value.map((l) => ({
          ...l,
          [keysString]: "",
        }));

        sortsDataTable.value = sortAndFilter({
          sort: sortsSave.value,
          dataTable: dataTable.value,
          keyCols: generationLineFilters.value,
        });

        sortsDataTable.value = sortsDataTable.value.map((l) => ({
          ...l,
          [keysString]: "",
        }));

      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  isLoading.value = false;
};

const delColumnFlag = ref(false)
const delColumn = async (val) => {
  // удаляю столбец в таблице
  const delColumn = await storeRequests.requestDelColumnTable({
    nameTableBD: namesTableBD.value,
    columnName: val,
  });

  if (delColumn) {
    const [editTableResult, editAccessResult] = await Promise.all([
      // Удаляю запись с переводов
      storeRequests.requestDelRecordForSearch({
        nameTableBD: bDLists.table_name,
        criteria: {
          bd_name: namesBD.value,
          table_name: namesTableBD.value,
          key_cols: val,
        },
      }),
      // Удаляю запись разрешений на столбец у всех пользователей
      storeRequests.requestDelRecordForSearch({
        nameTableBD: TABLES_USERS_BD.c_access,
        criteria: {
          bd_name: namesBD.value,
          table_name: namesTableBD.value,
          cols_name: val,
        },
      }),
    ]);

    if (editTableResult && editAccessResult) {

      // чищу сортировочный массив от этой записи
      sortsSave.value = sortsSave.value.filter(k => k.nameFilter !== val)

      // Обновление данных в таблице и сортировочных данных

        sortsDataTable.value = sortAndFilter({
          sort: sortsSave.value,
          dataTable: sortsDataTable.value,
          keyCols: colsNamesTranslation.value,
        });
        

        // удаляю этот столбец с массивов таблицы
      dataTable.value = excludeKeyFromArray(dataTable.value, val);
      sortsDataTable.value = excludeKeyFromArray(sortsDataTable.value, val);

      // удаляю название столбца с массива оглавления таблицы
      colsLineName.value = colsLineName.value.filter((n) => n.key_Cols !== val);

      // изменяю массив перечня фильтра
      generationLineFilters.value = generationLineFilters.value.filter(
        (n) => n.key_Cols !== val,
      );

      // флаг что понизить счетчик в TheCollapsibleFilter
      delColumnFlag.value = true
    }
  }
};
</script>

<script>
export default {
  name: "TheHome",
};
</script>

<style>
.table-fade-enter-active,
.table-fade-leave-active {
  transition: opacity 1.5s;
}

.table-fade-enter,
.table-fade-leave-to {
  opacity: 0;
}
</style>
