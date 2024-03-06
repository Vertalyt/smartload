<template>
  <div
  class="flex min-h-max grow flex-col mt-10 flex-wrap items-center gap-3 rounded-md bg-blue-200 text-xl"
  >
    <span class="p-2">{{ col.name_ua_cols }}</span>
      <textarea
        :readonly="isID(col.key_Cols)"
        :disabled="isID(col.key_Cols)"
        class="flex w-full h-20 items-center rounded-b-md border border-gray-300 pl-5"
        :placeholder="col.val"
        draggable="false"
        :value="modelValue"
        @input="updateModelValue($event.target.value)"
      >
        >
      </textarea>
  </div>
</template>


<script setup>
const emits = defineEmits(['update:modelValue']); 
defineProps({
  col: {
    type: Object,
    required: true
  }, 
  modelValue: {
    type: String,
    required: true  
  }
})

const isID = (key) => (key === "id" ? true : false);
const updateModelValue = (newValue) => {
  emits('update:modelValue', newValue);
};

</script>

<script>
export default {
  name: 'EditLineTableArea',
}
</script>