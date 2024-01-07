
<template>
  <div class="flex flex-col gap-5 lg:flex-row items-center justify-between mb-3 ">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-gray-700">Дані для звіту</h1>
      <span class="text-sm font-medium text-gray-500">
        Оберіть необхідні дані для формування звіту
        </span>
    </div>

    <TheDownloadBD @tableData="$emit('tableData', $event)" @loading="$emit('loading', $event)"/>
  </div>
</template>


<script setup>
import TheDownloadBD from '@/components/home/TheDownloadBD.vue'

defineEmits(['tableData', 'loading']);

</script>

<script>
export default {
  name: 'TheLabelHome',
}
</script>

