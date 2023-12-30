<template>
  <div class="mb-5 flex flex-col items-center gap-3 rounded bg-gray-400/60 shadow-lg">
    <div class="mx-auto mt-4 text-xl font-bold">Додати користувача</div>

      <TheAddForm 
      :variable="variable"
      :usersGroups="usersGroups"
      @add="($event) => $emit('add', $event)"
      />
  </div>
</template>

<script setup>
import TheAddForm from '@/components/users/TheAddForm.vue'

defineEmits({
  add: Object
});
defineProps({
  variable: {
    required: true,
    type: Array,
  },
  usersGroups: {
    required: true,
    type: Array
   },
});


</script>

<script>
export default {
  name: "TheAddUser",
};
</script>
