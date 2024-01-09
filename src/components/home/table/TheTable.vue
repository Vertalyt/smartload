<template>
  <div>
    <div
      class="relative mb-3 flex flex-col flex-wrap justify-between gap-3 lg:flex-row"
    >
      <TurnOnEditElements 
      @column="$emit('column', $event)"
      @turn="isTurnElActive"

      />
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
        :reset="resetSearch"
      />

      <RecordsPerPageSelector
        :model-value="isSelected"
        :options="PAGINATE_COAST_VARIABLE"
        @update:model-value="changeSelectCoast"
      />
    </div>

    <div class="relative h-full overflow-x-auto" ref="table">


      <table
        class="relative w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400"
      >
        <thead
          class="top-0 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <TableLine :line="variableNames" :thead="true"> </TableLine>
        </thead>

        <tbody>
          <tr
            v-for="line in resultArrDate"
            :key="line.id"
            class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <TableLine
              :line="line"
              :isTurnEl="isTurnEl"
              @edit="$emit('edit', $event)"
              @del="$emit('del', $event)"
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
import { tableFocus, sortSearch } from "@/functions";
import SubmitButton from "@/components/SubmitButton.vue";
import TurnOnEditElements from '@/components/home/table/TurnOnEditElements.vue'


defineEmits({
  edit: String,
  add: Object,
  del: String,
  column: String,
});
const props = defineProps({
  dataTable: {
    required: true,
    type: Array,
  },
});

const dateComputed = computed(() => props.dataTable);
// первая строка для имен переменных

// сами названия переменных
const variableNames = ref(sortNameColumn(Object.keys(dateComputed.value[0])));

function sortNameColumn(arr) {
  return arr.reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {})
}


// устанавливаю фокус на таблицу
onMounted(() => {
  tableFocus();
});

const filterSearch = ref();
// пагинация
const countElements = ref(dateComputed.value.length - 1);
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
  tableFocus();
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
  tableFocus();
};

const saveFilterSearch = ref(null);

// фильтр
const isSearch = (search) => {
  if (saveFilterSearch.value === null) {
    currentPage.value = 1;
  }
  saveFilterSearch.value = search;
  filterSearch.value = sortSearch({ search, arr: dateComputed.value });
  tableFocus();
};

// сброс фильтра поиска
const resetSearch = ref(false);

watch(
  dateComputed,
  (val) => {
    if (saveFilterSearch.value) {
      const sort = sortSearch({ search: saveFilterSearch.value, arr: val });

      // если после правок, массив пустой, возвращаю базовый, чищу массивы фильтра
      if (sort.length === 0) {
        filterSearch.value = null;
        resetSearch.value = true;
        saveFilterSearch.value = null;
      } else {
        filterSearch.value = sort;
      }
    }
    variableNames.value = sortNameColumn(Object.keys(val[0]));
  },
  { deep: true },
);

watch(
  filterSearch,
  (val) => {
    if (val) {
      countElements.value = filterSearch.value.length - 1;
      resultArrDate.value = val.slice(start.value, end.value);
      // подсчитываю нет ли пустой последней страницы после редактирования
      const endPage = countElements.value / isSelected.value;
      if (currentPage.value > Math.ceil(endPage)) {
        currentPage.value = Math.ceil(endPage);
      }
    } else {
      countElements.value = dateComputed.value.length - 1;
      resultArrDate.value = dateComputed.value.slice(start.value, end.value);
    }
  },
  { deep: true },
);

const isResets = () => {
  currentPage.value = 1;
  countElements.value = dateComputed.value.length - 1;
  filterSearch.value = null;
};


const isTurnEl = ref('')

const isTurnElActive = (val) => {
  isTurnEl.value = val
  tableFocus();
}

</script>

<script>
export default {
  name: "TheTable",
};
</script>
