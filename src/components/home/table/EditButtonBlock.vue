
<template>
  <div class="fixed z-10 left-20">
    <button
        v-if="nameLine === 'id' && isTurnEl === 'isDel'"
        class="rounded-full bg-red-800 p-1 mr-2 hover:bg-red-900"
        @click="$emit('del', lineId)"
      >
      <DelRecordSVG  class="w-5 h-5 text-slate-100"/>
    </button>

      <button
        v-if="nameLine === 'id' && isTurnEl === 'isEdit'"
        class="rounded-full bg-gray-500 p-1 mr-2 hover:bg-gray-400"
        @click="$emit('edit', lineId)"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
    </button>
  </div>
</template>


<script setup>
import PensilSVG from '@/assets/img/svg/PensilSVG.vue';
import DelRecordSVG from '@/assets/img/svg/DelRecordSVG.vue';

defineEmits({
  edit: String,
  del: String
});
defineProps({
  nameLine : {
    required: true,
    type: String
  },
  lineId : {
    required: true,
    type: String
  },
  isTurnEl:{
    required: false,
    type: String
  },
})



</script>

<script>
export default {
  name: 'EditButtonBlock',
}
</script>

