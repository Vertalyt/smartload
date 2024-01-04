
<template>
        <div class="gap-3">
            <button
        class="rounded-full bg-gray-400 p-1 hover:bg-gray-500"
        @click="edit"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
            </button>
        </div>
</template>


<script setup>
import PensilSVG from '@/assets/img/svg/PensilSVG.vue';

const emit = defineEmits({
  edit: null
});

const edit = () => {
  emit('edit')
} 
</script>

<script>
export default {
  name: 'Permissions_BD_Table',
}
</script>

