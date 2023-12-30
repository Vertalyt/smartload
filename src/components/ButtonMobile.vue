
<template>
    <button
      type="button"
      class="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
      @click="$emit('open')"
    >
      <span>Menu</span>
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
</template>


<script setup>
defineEmits({
  open: null
});

</script>

<script>
export default {
  name: 'ButtonMobile',
}
</script>

