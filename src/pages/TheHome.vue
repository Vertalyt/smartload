<template>
  <ModalWrapper v-if="editLineDate" @close="editLineDate = null" class="h-[96%]">
    <TheTableLineEdit
      :date="editLineDate"
      :nameBTN="nameBTN"
      @update="isUpdateTable"
      @close="editLineDate = null"
    />
  </ModalWrapper>

  <TheLabelHome @tableData="tableData" @loading="handleLoadingEvent" />

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
    v-if="sortsDataTable"
    :dataTable="sortsDataTable"
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
} from "@/functions";
import TheLoader from "@/components/TheLoader.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import TheTableLineEdit from "@/components/home/table/TheTableLineEdit.vue";
import TheLabelHome from "@/components/home/TheLabelHome.vue";
import { useRequests } from "@/stores/requests";
import { ADD, EDIT } from '@/constants'

const storeRequests = useRequests();



// запускаю анимацию загрузки
const isLoading = ref(false);
const handleLoadingEvent = (newValue) => {

  isLoading.value = newValue;
};

const generationLineFilters = ref([]);
const dataTable = ref(null);
const sortsDataTable = ref();

const namesBD = ref();
const namesTableBD = ref();
const nameBTN = ref(EDIT)
const tableData = ({ tablesData, nameBD, nameTableBD }) => {

  namesBD.value = nameBD;
  namesTableBD.value = nameTableBD;

  generationLineFilters.value.length = 0;
  updateCollapsible.value++;

  // получаю имена столбцов без столбца id
  generationLineFilters.value = colName(tablesData);

  // отправляю в компонент фильтров список
  dataTable.value = tablesData;
};

// флаг обновления пагинатора
const updateCollapsible = ref(1);

// сортирую по данным из фильтра
const sortsTable = (sort) => {
  isLoading.value = true;
  sortsDataTable.value = null;
  sortsDataTable.value = sortAndFilter({ sort, dataTable: dataTable.value });
  isLoading.value = false;
};

const editLineDate = ref();

const editLineID = (id) => {
  editLineDate.value = dataTable.value.filter((line) => line.id === id);
  nameBTN.value = EDIT
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
  // отправить в SQL правку. после правлю текущие массивы
  try {

    const result = await storeRequests.requestEditTable({
      nameBD: namesBD.value,
      nameTableBD: namesTableBD.value,
      date: nameBTN.value === EDIT ? edit : [edit],
      type: nameBTN.value === EDIT ? 'edit' : 'add'
    });

    if(result && nameBTN.value === EDIT) {
      updateLine(edit)
    }

      // добавляю в запись массива вісчитав вручную айди.
    if(result && nameBTN.value === ADD) {
      const lastID = String(Number(dataTable.value[dataTable.value.length -1].id) + 1)
      let recordLine = { id: lastID, ...edit };
      dataTable.value.push(recordLine)
      if(sortsDataTable.value.length) {
        sortsDataTable.value.push(recordLine)
      }
    }

    editLineDate.value = null;
    tableFocus();
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

const addCol = (val) => {
  storeRequests.requestAddTableCol(
    {nameBD: namesBD.value, nameTableBD: namesTableBD.value, columnName: String(val), columnType: 'VARCHAR(255)' }
  );
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
