
<template>
  <div class="flex items-center justify-center relative">
    <button
    class="rounded-full bg-gray-500 p-1 mr-2 hover:bg-gray-400"
    @click="isLoad = !isLoad"
      >
      <DownloadSVG  
      class="w-5 h-5 text-gray-800"/>
    </button>

    <div 
    v-if="isLoad"
    class=" flex items-center gap-3 py-1 px-3 border border-gray-400 rounded-xl">
      <button 
      v-for="t in typeLoad"
      :key="t.type"
      @click="loadType(t.type)"
      class="w-7 h-7 bg-gray-500 border border-gray-600 hover:bg-gray-400 rounded-full font-bold text-sm">{{ t.type }}</button>
  </div>



  </div>
</template>


<script setup>
import { ref } from 'vue';
import DownloadSVG from '@/assets/img/svg/DownloadSVG.vue';

const emit = defineEmits({
  load: String
})


const typeLoad = [
  { type: 'csv' },
  { type: 'xls' },
  { type: 'pdf' },
]

const isLoad = ref(false)

const loadType = (val) => {
  emit('load', val)
  isLoad.value = false
}

</script>

<script>
export default {
  name: 'LoadTableData',
}
</script>

