<template>
  <div class="mb-3 flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-gray-700">Дані для звіту</h1>
      <span class="text-sm font-medium text-gray-500"
        >Оберіть необхідні дані для формування звіту</span
      >
    </div>
    <div class="hidden md:flex gap-3 ">
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
    <TheCollapsibleFilter v-if="generationLineFilters" :nameFilterCol="generationLineFilters" :fullFilter="fullFilter" class="mb-5"/>

    <TheTableLoad />

</template>

<script setup>
import { ref } from 'vue'
import SubmitButton from "@/components/SubmitButton.vue";
import TheCollapsibleFilter from '../components/TheCollapsibleFilter.vue'
import TheTableLoad from '@/components/TheTableLoad.vue'

defineEmits({});
defineProps({});

const generationLineFilters = [
  "Номер замовлення",
  "Імя мерчанта",
  "Товари",
  "Телефон",
  "Емаил",
  "Юр. особа",
  "Назва банку",
];

const fullFilter = ref(null)



</script>

<script>
export default {
  name: "TheHome",
};
</script>
