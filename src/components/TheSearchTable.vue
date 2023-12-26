<template>
  <div>
    <input
      v-model="modalSearch"
      class="rounded-md border border-blue-500 mr-5 px-4 py-2 mb-2 shadow-inner focus:border-blue-600 focus:outline-none"
      placeholder="Поиск, от 3 символов."
      @input="isSearch"
    />
    <SubmitButton nameBtn="Сбросить" @submit="onSubmit" color="red"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SubmitButton from './SubmitButton.vue';

const emit = defineEmits({
  search: String,
  resets: null
});
defineProps({});

const modalSearch = ref()
const isSearch = () => {
  if(modalSearch.value.length > 2 ) {
    emit('search', modalSearch.value)
  }
}

const onSubmit = () => {
  emit('resets'),
  modalSearch.value = ''
}

</script>

<script>
export default {
  name: "TheSearchTable",
};
</script>
