
<template>
  <div class="flex flex-col justify-center w-full sm:flex-row sm:gap-3 sm:w-2/5 md:w-max items-center">
    <label v-if="title" :for="title" class="text-xl font-medium text-gray-800">{{ title }}</label>
    <slot />
  </div>
</template>


<script setup>
defineProps({
  title : {
    required: false,
    type: String
  }
})
</script>

<script>
export default {
  name: 'TheFormElement',
}
</script>

