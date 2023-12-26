<template>
  <div class="flex w-full flex-col">
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
              @submit="fullFilter = true"
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

      <div
        class="animate__animated flex flex-col rounded-b-xl border border-t-0 border-blue-400 py-5 transition delay-500 ease-out"
        :class="{
          hidden: isOpenCollapsible,
          animate__fadeIn: !isOpenCollapsible,
          animate__fadeOut: isOpenCollapsible,
        }"
      >
        <div class="align-center mb-5 flex flex-wrap justify-center gap-5">
          <FilterBTN
            v-for="(fil, idx) in nameFilterCol"
            :key="idx"
            :nameItem="fil"
            :count="findCount(fil)"
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
import { ref, computed, watch } from "vue";
import FilterBTN from "@/components/FilterBTN.vue";
import { decrement } from "@/functions";
import SubmitButton from "@/components/SubmitButton.vue";

const props = defineProps({
  nameFilterCol: {
    required: true,
    type: Array,
  },
});

const fullFilter = ref(null);

// выпадающий список
const isOpenCollapsible = ref(false);
const isShow = computed(() =>
  isOpenCollapsible.value ? "Развернуть" : "Свернуть",
);

// счетчик активных фильтров
const count = ref(0);
const countFilters = ref([]);
const ollActively = ref(null);

const isActiveBtnFilter = ({ activeBtn, name }) => {
  const existingFilter = countFilters.value.find(
    (btn) => btn.nameFilter === name,
  );

  if (activeBtn && !existingFilter) {
    count.value++;
    countFilters.value.push({ nameFilter: name, count: count.value });
  } else {
    if (existingFilter) {
      const searchFilters = countFilters.value.filter(
        (btn) => btn !== existingFilter,
      );
      count.value--;
      countFilters.value = decrement({
        arrayFilter: searchFilters,
        count: existingFilter.count,
      });
    }
  }
};
const findCount = (name) => {
  return countFilters.value.find((btn) => btn.nameFilter === name)?.count;
};

watch(fullFilter, (val) => {
  if (!val) {
    countFilters.value.length = 0;
    count.value = 0;
    ollActively.value = false;
  }
  if (val === true) {
    countFilters.value.length = 0;
    for (let i = 0; i < props.nameFilterCol.length; i++) {
      countFilters.value.push({
        nameFilter: props.nameFilterCol[i],
        count: i + 1,
      });
    }
    ollActively.value = true;
  }
});

const onSubmit = () => {
  console.log("onSubmit");
};
</script>

<script>
export default {
  name: "TheCollapsibleFilter",
};
</script>
