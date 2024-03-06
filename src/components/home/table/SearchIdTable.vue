<template>
  <div>
    <input 
      class="border rounded-lg w-16 h-6 ml-2 bg-gray-200"
      type="text"
      placeholder="ID"
      v-model.lazy ="inputValue"
    >
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  reset: {
    required: true,
    type: Boolean,
  },
});

const emit = defineEmits({
  'search-id': [Number, String]
})

const inputValue = ref('');

// сброс фильтра
const isReset = computed(() => props.reset)

watch(isReset, val => {
  if (val === true) {
    inputValue.value = ''
  }
})

watch(inputValue, (newValue, oldValue) => {
   // разрешаю только цифри
  const sanitizedValue = newValue.replace(/\D/g, '');
// если сработало правило
  if (sanitizedValue !== '') {
    inputValue.value = sanitizedValue;
    emit('search-id', inputValue.value)
     // если было старое значение, а новое пустое (очистили значения) эмит наверх что убрать
  } else if (/\d/.test(oldValue) && !isReset.value) {
    emit('search-id', '')
  }
});


</script>



<script>
export default {
  name: 'SearchIdTable',
}
</script>

