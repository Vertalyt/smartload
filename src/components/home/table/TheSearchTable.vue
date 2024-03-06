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
import { ref, computed, watch } from 'vue';
import SubmitButton from '@/components/SubmitButton.vue';

const emit = defineEmits({
  search: String,
  resets: null
});
const props = defineProps({
  reset: {
    required: true,
    type: Boolean,
  },
});

const modalSearch = ref()

// сброс фильтра
const isReset = computed( () => props.reset )
watch(isReset, val => {
  if(val === true) {
    modalSearch.value = null
  }
})

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
