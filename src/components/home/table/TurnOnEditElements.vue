
<template>
  <div class="flex items-center justify-center relative">
    <button
        class="rounded-full bg-gray-500 p-1 mr-2 hover:bg-gray-400"
        @click="isState('isEdit')"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
    </button>

    <button
    class="rounded-full bg-red-700 p-1 mr-2 hover:bg-red-800"
    @click="isState('isDel')"
      >
      <DelRecordSVG  
      class="w-5 h-5 text-gray-800"/>
    </button>

    <TheAddCol @column="$emit('column', $event)"
      />
   
  </div>
</template>


<script setup>
import { ref } from 'vue'
import PensilSVG from '@/assets/img/svg/PensilSVG.vue';
import DelRecordSVG from '@/assets/img/svg/DelRecordSVG.vue';
import TheAddCol from "./TheAddCol.vue";

const emit = defineEmits({
  column: String,
  turn: String,
});



const stateTurn = ref()
const isState = (val) => {
  if(stateTurn.value === val) {
    stateTurn.value = 'empty'
  } else {
    stateTurn.value = val
  }
  emit('turn', stateTurn.value)
}

</script>

<script>
export default {
  name: 'TurnOnEditElements',
}
</script>

