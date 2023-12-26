
<template>
    <div class="relative overflow-x-auto">

      <div class="flex flex-wrap flex-col lg:flex-row justify-between mb-3 gap-3 relative">
        <ThePaginate 
        :elements="countElements" 
        :pagesShown="pagesShown"
        :reset="currentPage === 1"
        @lines="isCurrentPage" />

        <TheSearchTable @search="isSearch" @resets="isResets"/>

        <SelectGen 
        :model-value="isSelected"
        :options="paginateCoastVariable"
        @update:model-value="changeSelectCoast"
         />
      </div>

    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <TableLine :cols="variableNames" :thead="true" />
        </thead>
        <tbody>
            <tr 
            v-for="line in resultArrDate"
            :key="line.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <TableLine :cols="line" />
            </tr>
        </tbody>
    </table>

</div>
</template>


<script setup>
import { ref, watch, computed } from 'vue'
import TableLine from '@/components/TableLine.vue'
import ThePaginate from '@/components/ThePaginate.vue'
import SelectGen from '@/components/SelectGen.vue'
import TheSearchTable from '@/components/TheSearchTable.vue'
import { useResultArray } from '@/composables/PaginationsSorts'
import { paginateCoastVariable } from '@/constans'


defineEmits({});
const props = defineProps({
    dataTable: {
        required: true,
        type: Array
    }
})

// первая трока для имен переменных
const oneLine = props.dataTable[0]
// сами названия переменных
const variableNames = ref(Object.keys(oneLine))

const filterSearch = ref()
// пагинация
const countElements = ref(props.dataTable.length - 1)
const isSelected = ref(10)
const currentPage = ref(1)

const start = computed( () => currentPage.value === 1 ?  0 : (currentPage.value - 1) * isSelected.value)
const end = computed( () => currentPage.value === 1 ? isSelected.value : (currentPage.value - 1) * isSelected.value + isSelected.value)

const resultArrDate = useResultArray({ dataTable: props.dataTable, start, end, filterSearch})
const isCurrentPage = (num) => {
  currentPage.value = num
}


// размер пагинатора
const pageWidth = document.documentElement.scrollWidth
const pagesShown = ref(2)
if(pageWidth && pageWidth < 1025) {
  pagesShown.value = 1
}

const changeSelectCoast = (coast) => {
  currentPage.value = 1
  isSelected.value = Number(coast)
}


// фильтр
const isSearch = (search) => {
  filterSearch.value = props.dataTable.filter(line => {
    const lineAsString = JSON.stringify(line).toLowerCase();
    return lineAsString.includes(search.toLowerCase());
  });
}

watch(filterSearch, val => {
  countElements.value = filterSearch.value.length -1
  resultArrDate.value = val.slice(start.value, end.value)
  currentPage.value = 1
})

const isResets = () => {
  resultArrDate.value = props.dataTable
  countElements.value = props.dataTable.length - 1
}
//
</script>

<script>
export default {
  name: 'TheTableLoad',
}
</script>

