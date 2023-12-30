<template>
  <ModalWrapper v-if="editLineDate" class="h-[96%]">
    <TheTableLineEdit
      :date="editLineDate"
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
const tableData = ({ tablesData, nameBD, nameTableBD }) => {
  namesBD.value = nameBD;
  namesTableBD.value = nameTableBD;

  generationLineFilters.value.length = 0;
  updateCollapsible.value++;

  // получаю имена столбцов без столбца ID
  generationLineFilters.value = colName(tablesData);

  // отправляю в компонент фильтров список
  dataTable.value = tablesData;
};

// флаг обновления пагинатора
const updateCollapsible = ref(1);

// сортирую по данным из фильтра
const sortsTable = (sort) => {
  sortsDataTable.value = null;
  sortsDataTable.value = sortAndFilter({ sort, dataTable: dataTable.value });
};

const editLineDate = ref();

const editLineID = (ID) => {
  editLineDate.value = dataTable.value.filter((line) => line.ID === ID);
};

const storeRequests = useRequests();
const isUpdateTable = async (edit) => {
  // отправить в SQL правку. после правлю текущие массивы
  try {
   const result = await storeRequests.requestEditTable({
      nameBD: namesBD.value,
      nameTableBD: namesTableBD.value,
      date: edit,
      type: 'edit'
    });
    if(result) {
    // Обновление данных только при успешной отправке запроса
    sortsDataTable.value = updateDataById({
      arrUpdate: sortsDataTable.value,
      editArr: edit,
    });
    dataTable.value = updateDataById({
      arrUpdate: dataTable.value,
      editArr: edit,
    });

    editLineDate.value = null;
    }

    tableFocus();
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
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
