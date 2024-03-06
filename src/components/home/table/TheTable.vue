<template>
  <div>
    <div
      class="relative mb-3 flex flex-col flex-wrap justify-between gap-3 lg:flex-row"
    >


      <div class="flex items-center gap-5">

        <TheTooltip 
    content="Завантажити"
    :isSHow="isSHowLoading"
    >
    <LoadTableDataVue 
    @mouseover="isSHowLoading = true"
    @mouseleave="isSHowLoading = false"
    @load="downloadTable" />
  </TheTooltip>


        <TurnOnEditElements
          :resetValue="resetValue"
          @column="$emit('column', $event)"
          @turn="isTurnElActive"
        />
      </div>

      <ThePaginate
        v-if="countElements > isSelected"
        :elements="countElements"
        :pagesShown="pagesShown"
        :perPage="isSelected"
        @lines="isCurrentPage"
        :page="currentPage"
      />

      <TheSearchTable
        @search="isSearch"
        @resets="isResets"
        :reset="resetGlobalSearch"
      />

      <RecordsPerPageSelector
        :model-value="isSelected"
        :options="PAGINATE_COAST_VARIABLE"
        @update:model-value="changeSelectCoast"
      />
    </div>

    <div 
    v-if="variableNames"
    class="relative h-full overflow-x-auto" ref="table">
      <table
        id="table"
        ref="table"
        class="relative w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400"
      >
        <thead
          class="top-0 bg-blue-400 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <TableLineNameCols 
          :line="variableNames"
          :isTurnEl="isTurnEl"
          @delColumn="$emit('delColumn', $event, isTurnEl = 'empty')"
          @searchId="searchById"
          :resetSearch="resetIdSearch"
           /> 
        </thead>

        <tbody>
          <tr
            v-for="line in resultArrDate"
            :key="line.id"
            class="border-b bg-blue-200 dark:border-gray-700 dark:bg-gray-800"
          >
            <TableLine
              :line="line"
              :isTurnEl="isTurnEl"
              @edit="$emit('edit', $event, isTurnEl = 'empty')"
              @del="$emit('del', $event, isTurnEl = 'empty')"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <SubmitButton
      nameBtn="Додати лінію"
      color="gray"
      @submit="$emit('add', variableNames)"
      class="mt-2"
    />

    <div class="mt-4">
      <ThePaginate
        v-if="countElements > isSelected"
        :elements="countElements"
        :pagesShown="pagesShown"
        :perPage="isSelected"
        @lines="isCurrentPage"
        :page="currentPage"
      />
    </div>
  </div>


</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import TableLine from "@/components/home/table/TableLine.vue";
import ThePaginate from "@/components/home/ThePaginate.vue";
import RecordsPerPageSelector from "@/components/RecordsPerPageSelector.vue";
import TheSearchTable from "@/components/home/table/TheSearchTable.vue";
import { useResultArray } from "@/composables/PaginationsSorts";
import { PAGINATE_COAST_VARIABLE } from "@/constants";
import { tableFocus, sortSearch, loadCSV, loadXLS } from "@/functions";
import SubmitButton from "@/components/SubmitButton.vue";
import TurnOnEditElements from "@/components/home/table/TurnOnEditElements.vue";
import LoadTableDataVue from "./LoadTableData.vue";
import TableLineNameCols from '@/components/home/table/TableLineNameCols.vue'
import TheTooltip from "@/components/TheTooltip.vue";


defineEmits({
  edit: String,
  add: Object,
  del: String,
  column: Object,
  delColumn:String,
});
const props = defineProps({
  dataTable: {
    required: true,
    type: Array,
  },
  namesTableBD: {
    required: true,
    type: String,
  },
  namesBD: {
    required: true,
    type: String,
  },
  nameCols: {
    required: true,
    type: Array,
  },
});

const dateComputed = computed(() => props.dataTable);
// первая строка для имен переменных

// сами названия переменных
const variableNameCols = computed(() => props.nameCols);
const variableNames = ref()
function addId(val) {
  const isIdf = val.find(c => c.name_ua_cols === 'id' || c.key_Cols === 'id')
  if(isIdf) {
    return val
  } else {
    val.unshift({
      name_ua_cols: 'id',
    } );
    return val;
  }
}

watch(variableNameCols, val => {
  variableNames.value = addId(val)
}, { immediate: true })


// устанавливаю фокус на таблицу
onMounted(() => {
  tableFocus("#sendRef");
});

const filterSearch = ref();
// пагинация
const countElements = ref(dateComputed.value.length);
const isSelected = ref(10);
const currentPage = ref(1);

const start = ref(0);
const end = ref(isSelected.value);

watch([currentPage, isSelected], (val) => {
  start.value = val[0] === 1 ? 0 : (val[0] - 1) * val[1];
  end.value = val[0] === 1 ? val[1] : (val[0] - 1) * val[1] + val[1];
});

const resultArrDate = useResultArray({
  dataTable: dateComputed,
  start,
  end,
  filterSearch,
});

const isCurrentPage = (num) => {
  currentPage.value = num;
  tableFocus("#sendRef");
};

// размер пагинатора
const pageWidth = document.documentElement.scrollWidth;
const pagesShown = ref(2);
if (pageWidth && pageWidth < 1025) {
  pagesShown.value = 1;
}

const changeSelectCoast = (coast) => {
  currentPage.value = 1;
  isSelected.value = Number(coast);
  tableFocus("#sendRef");
};

const saveFilterSearch = ref(null);

// фильтр
const isSearch = (search) => {
  resetGlobalSearch.value = false
  if (saveFilterSearch.value === null) {
    currentPage.value = 1;
  }
  saveFilterSearch.value = search;
  filterSearch.value = sortSearch({ search, arr: dateComputed.value });
  tableFocus("#sendRef");
  resetIdSearch.value = true
};

// сброс фильтра поиска по айди
const resetIdSearch = ref(false)

//поиск по айди
const searchById = (val) => {
  resetIdSearch.value = false;

  if(val === '') {
    filterSearch.value = null
  } else {
    filterSearch.value = dateComputed.value.filter(l => Number(l.id) === Number(val))
    resetGlobalSearch.value = true
  }

}

// сброс фильтра глобального поиска поиска
const resetGlobalSearch = ref(false);

watch(  dateComputed,
  (val) => {
    if (saveFilterSearch.value) {
      const sort = sortSearch({ search: saveFilterSearch.value, arr: val });

      // если после правок, массив пустой, возвращаю базовый, чищу массивы фильтра
      if (sort.length === 0) {
        filterSearch.value = null;
        resetGlobalSearch.value = true;
        saveFilterSearch.value = null;
      } else {
        filterSearch.value = sort;
      }
    }

    countElements.value = dateComputed.value.length;
  },
  { deep: true },
);

watch(  filterSearch,
  (val) => {
    if (val) {
      countElements.value = filterSearch.value.length;
      resultArrDate.value = val.slice(start.value, end.value);
      // подсчитываю нет ли пустой последней страницы после редактирования
      const endPage = countElements.value / isSelected.value;
      if (currentPage.value > Math.ceil(endPage)) {
        currentPage.value = Math.ceil(endPage);
      }
    } else {
      countElements.value = dateComputed.value.length;
      resultArrDate.value = dateComputed.value.slice(start.value, end.value);
    }
  },
  { deep: true },
);

const isResets = () => {
  currentPage.value = 1;
  countElements.value = dateComputed.value.length;
  filterSearch.value = null;
};

const isTurnEl = ref('empty');

const isTurnElActive = (val) => {
  isTurnEl.value = val;
  tableFocus("#sendRef");
};

const resetValue = ref(false)
watch(isTurnEl, val => {
  if(val === 'empty') {
    resetValue.value = true
  } else {
    resetValue.value = false
  }
})

const table = ref();
let styleFileName
if(import.meta.env.VITE_STYLE_FILE_NAME) {
  styleFileName = `http://10.100.6.3/assets/${import.meta.env.VITE_STYLE_FILE_NAME}`
} else {'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
  styleFileName
}


function nameTables(date, names) {
  return date.map(item => {
  return Object.keys(item).reduce((acc, key) => {
    const find = names.find(v => v.key_Cols === key);
    if (find) {
      acc[find.name_ua_cols] = item[key];
    } else {
      acc[key] = item[key];
    }
    return acc;
  }, {});
});
}


const isSHowLoading = ref(false)
const downloadTable = async (val) => {

  const nameKeys = nameTables(dateComputed.value, variableNames.value)

  if (val === "csv") {
    loadCSV({
      data: nameKeys,
      nameBook: props.namesBD,
      nameList: props.namesTableBD,
    });
  } else if (val === "xls") {
    await loadXLS({
      data: nameKeys,
      nameBook: props.namesBD,
      nameList: props.namesTableBD,
    });
  } else if (val === "pdf") {
    // Создаем новое окно
    const printWindow = window.open("", "_blank");
    const url = 'http://10.100.6.3/assets/index-672de43e.css' || 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
   
   
    printWindow.document.write(`
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${url}" onload="window.print()">
    </head>
    <body>
      ${table.value.outerHTML}
    </body>
  </html>
`)
  }
};




</script>

<script>
export default {
  name: "TheTable",
};
</script>
