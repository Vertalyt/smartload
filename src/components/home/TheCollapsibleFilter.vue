<template>
  <div class="flex w-full flex-col mb-5">
    <div>
      <h2>
        <div
          class="flex w-full justify-between gap-3 rounded-t-xl border border-blue-400 bg-blue-200 p-4 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 rtl:text-right"
        >
          <button
            @click="isOpenCollapsible = !isOpenCollapsible"
            type="button"
            class="flex grow items-center justify-center gap-3 rounded-xl border border-blue-400 bg-blue-200 p-4 hover:bg-blue-300 focus:ring-1 focus:ring-blue-200 rtl:text-right"
          >
            <span class="text-xl font-bold text-gray-700">{{ isShow }}</span>
          </button>
          <div 
          v-if="isShow === 'Свернуть'"
          class="hidden gap-3 md:flex">
            <SubmitButton
              nameBtn="Додати всі"
              color="blue"
              @submit="ollFilter"
              class="mr-2"
            />

            <SubmitButton
              nameBtn="Зняти всі"
              color="red"
              @submit="fullFilter = false"
              class="mr-2"
            />
          </div>
        </div>
      </h2>
      <span v-if="countFilters.length === 0" class="flex items-center justify-center m-2 font-medium text-gray-600">Оберіть необхідні колонки таблиці.</span>
      <div
        class="animate__animated flex flex-col rounded-b-xl border border-t-0 border-blue-400 py-5 transition delay-500 ease-out"
        :class="{
          hidden: isOpenCollapsible,
          animate__fadeIn: !isOpenCollapsible,
          animate__fadeOut: isOpenCollapsible,
        }"
      >
        <div 
        v-if="nameFilter"
        class="align-center mb-5 flex flex-wrap justify-center gap-5">
          <FilterBTN
            v-for="fil in nameFilter"
            :key="fil.key_Cols"
            :nameItem="fil"
            :count="findCount(fil.key_Cols)"
            :ollActively="ollActively"
            @active="isActiveBtnFilter"
          />
        </div>

        <div class="mx-auto w-48">
          <SubmitButton
            nameBtn="Отправить"
            @submit="onSubmit"
            class="w-full"
            color="green"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import FilterBTN from "@/components/FilterBTN.vue";
import { decrement } from "@/functions";
import SubmitButton from "@/components/SubmitButton.vue";
import { useMessage } from '@/stores/message'

const props = defineProps({
  nameFilterCol: {
    required: true,
    type: Array,
  },
});

const emit = defineEmits({
  sorts: Array
})

const nameFilter = computed(() => props.nameFilterCol )
const storeMessage = useMessage()
// выпадающий список
const isOpenCollapsible = ref(false);
const isShow = computed(() =>
  isOpenCollapsible.value ? "Развернуть" : "Свернуть",
);

// счетчик активных фильтров
const count = ref(0);

// список фильтров
const countFilters = ref([]);

// сбрасываю флаги перед обновлением.
const ollFilter = () => {
  fullFilter.value = false
  ollActively.value = false
  nextTick( () => {
    ollActively.value = true
  } )
  
  nextTick( () => {
    fullFilter.value = true
  } )
}

// флаг для обозначения выделены/сняты все фильтры (кружочки очереди)
const ollActively = ref(false);

const isActiveBtnFilter = ({ activeBtn, name }) => {
  // ищу по списку фильтров, есть ли такая уже запись
  const existingFilter = countFilters.value.find(
    (btn) => btn.nameFilter === name,
  );

  // если записи нет и в эмите пришло что кнопка активна (activeBtn = true) то добавляю запись
  if (activeBtn && !existingFilter) {
    count.value++;
    countFilters.value.push({ nameFilter: name, count: count.value });
  } else {
    // если запись есть и кнопка не активна (activeBtn = false), избавляюсь от записи
    if (existingFilter) {
      const searchFilters = countFilters.value.filter(
        (btn) => btn !== existingFilter,
      );
      count.value--;
      fullFilter.value = null
      // после избавления от фильтра, у всех остальных понижаю значения count очередности выведения на сайте
      countFilters.value = decrement({
        arrayFilter: searchFilters,
        count: existingFilter.count,
      });
    }
  }
};



// ищу по названию фильтра его очередность для вывода в кнопку очереди. 
const findCount = (name) => {
      return countFilters.value.find((btn) => btn.nameFilter === name)?.count;
};


const fullFilter = ref(false);

// наблюдаю за переменой выбора/снятия всех фильтров поиска


watch(fullFilter, (val) => {
  if(val === null) {
    return
  }
    count.value = 0;
    countFilters.value.length = 0;
  if (val === false) {
    ollActively.value = false;
  }
  if (val === true) {
    // прохожусь по всему списку фильтров и добавляю в массив очередностей
    for (let i = 0; i < nameFilter.value.length; i++) {
      countFilters.value.push({
        nameFilter: nameFilter.value[i].key_Cols,
        count: i + 1,
      });
      count.value++
    }

    ollActively.value = true;

  }
}, { immediate: true });

const onSubmit = () => {
  if(countFilters.value.length > 1) {
    const sortsArray = countFilters.value
   const newSortsArray = sortsArray.find(line => line.nameFilter === 'id')
   if(!newSortsArray) {
    sortsArray.unshift({ 
    "nameFilter": "id",
    "count": 0 })
   }
   emit("sorts", sortsArray)
  } else {
    storeMessage.setMessage({
      value: 'Виберіть хоча б один фільтр',
      type: 'warning'
    })

  }

};
</script>

<script>
export default {
  name: "TheCollapsibleFilter",
};
</script>
