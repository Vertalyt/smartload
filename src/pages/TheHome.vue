<template>
  <ModalWrapper v-if="editLineDate" @close="editLineDate = null" class="h-[96%]">
    <TheTableLineEdit
      :date="editLineDate"
      :nameBTN="nameBTN"
      @update="isUpdateTable"
      @close="editLineDate = null"
    />
  </ModalWrapper>

  <TheLabelHome @tableData="tableData" @loading="handleLoadingEvent" @forbidden="forbidden"/>

  <TheLoader v-if="isLoading" />

  <TheCollapsibleFilter
    :key="updateCollapsible"
    v-if="generationLineFilters.length"
    :nameFilterCol="generationLineFilters"
    @sorts="sortsTable"
  />

  <span
    v-if="generationLineFilters.length === 0"
    class="flex items-center justify-center text-md lg:text-2xl"
    >Виберіть базу даних та фільтри для завантаження.</span
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
  />
</template>

<script setup>
import { ref } from "vue";
import TheCollapsibleFilter from "@/components/home/TheCollapsibleFilter.vue";
import TheTable from "@/components/home/table/TheTable.vue";
import {
  sortAndFilter,
  colName,
  updateDataById,
  tableFocus,
  translateCols
} from "@/functions";
import TheLoader from "@/components/TheLoader.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import TheTableLineEdit from "@/components/home/table/TheTableLineEdit.vue";
import TheLabelHome from "@/components/home/TheLabelHome.vue";
import { useRequests } from "@/stores/requests";
import { ADD, EDIT, bDLists } from '@/constants'

const storeRequests = useRequests();



// запускаю анимацию загрузки
const isLoading = ref(false);
const handleLoadingEvent = (newValue) => {

  isLoading.value = newValue;
};


const dataTable = ref(null);
const sortsDataTable = ref();

const namesBD = ref();
const namesTableBD = ref();
const nameBTN = ref(EDIT)

// массив названий столбцов для фильтра
const generationLineFilters = ref([]);

// массив названий столбцов для таблицы
const colsLineName = ref([]);

// ключ/значения перевода каждого столбца таблицы
const colsNamesTranslation = ref()

const tableData = ({ colsName, tablesData, nameBD, nameTableBD }) => {

  namesBD.value = nameBD;
  namesTableBD.value = nameTableBD;


  generationLineFilters.value.length = 0;
  updateCollapsible.value++;


  colsNamesTranslation.value = colsName
      // получаю имена столбцов без столбца id
  if(colsNamesTranslation.value) {
    generationLineFilters.value = colsNamesTranslation.value.map(c => c.name_ua_cols)
  } else {
    generationLineFilters.value = colName(tablesData);
  }


  // отправляю в компонент фильтров список
  dataTable.value = tablesData;
};

// флаг обновления пагинатора
const updateCollapsible = ref(1);

// сортирую по данным из фильтра
const sortsTable = (sort) => {
  isLoading.value = true;
  sortsDataTable.value = null;
  sortsDataTable.value = sortAndFilter({ sort, dataTable: dataTable.value, keyCols: colsNamesTranslation.value });


  colsLineName.value = colsNamesTranslation.value.map(c => c.name_ua_cols)

  isLoading.value = false;
};

const forbidden = () => {
  sortsDataTable.value = null;
  generationLineFilters.value = [];
  updateCollapsible.value++;
}

const editLineDate = ref();


const editLineID = (id) => {
  const date = dataTable.value.filter((line) => line.id === id);
  editLineDate.value = translateCols({date, colsName:colsNamesTranslation.value, translation: true});
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
  const newEdit = translateCols({date:[edit], colsName:colsNamesTranslation.value, translation: false})
  // отправить в SQL правку. после правлю текущие массивы
  try {
    const result = await storeRequests.requestEditTable({
      nameBD: namesBD.value,
      nameTableBD: namesTableBD.value,
      date: nameBTN.value === EDIT ? newEdit[0] : newEdit,
      type: nameBTN.value === EDIT ? 'edit' : 'add'
    });

    if(result && nameBTN.value === EDIT) {
      updateLine(newEdit[0])
    }

      // добавляю в запись массива вісчитав вручную айди.
    if(result && nameBTN.value === ADD) {
      const lastID = String(Number(dataTable.value[dataTable.value.length -1].id) + 1)
      let recordLine = { id: lastID, ...newEdit[0] };
      dataTable.value.push(recordLine)
      if(sortsDataTable.value.length) {
        sortsDataTable.value.push(recordLine)
      }
    }

    editLineDate.value = null;
    tableFocus("#sendRef");
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
  }
};

const addLineTable = (val) => {

  const notId = { ...val };
  delete notId.id;
  for (const key in notId) {
  notId[key] = '';
}
nameBTN.value = ADD
editLineDate.value = [notId]
}

const delLineTable = async(id) => {
  const result = await storeRequests.requestDelRecordTable({
    nameBD: namesBD.value,
    nameTableBD: namesTableBD.value,
    IDs : [id]
  })
  if(result) {
    dataTable.value = dataTable.value.filter(l => l.id !== id)
    sortsDataTable.value = sortsDataTable.value.filter(l => l.id !== id)
  }
}

const addCol = async (val) => {

  const valuesString = Object.values(val).join(', ');
  const keysString = Object.keys(val).join(', ');

  storeRequests.requestAddTableCol(
    {nameBD: namesBD.value, nameTableBD: namesTableBD.value, columnName: valuesString, columnType: 'VARCHAR(255)' }
  );

    // Данные для добавления отправляем только массивом!
  const date = [{
    BD_name: namesBD.value,
    table_name: namesTableBD.value,
    key_Cols: keysString,
    name_ua_cols: valuesString,
  }]
 const result = await storeRequests.requestEditTable({nameBD: bDLists.bdName, nameTableBD: bDLists.table_name, date, type: 'add' })
  if(result) {
    // логика добавления прав и отрисовки текущему порльзователю
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
