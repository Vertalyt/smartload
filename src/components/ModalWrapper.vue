
<template>
  <div class="modalWrapper min-w-fit min-h-screen h-max z-30 bg-stone-600/90 p-5"
    @click.stop="isClose"
    @keyup.esc="isClose"
  >
  <div class="flex justify-end cursor-pointer mb-4"
  @click.stop="isClose"
  >
    <CloseSVG class="w-8 h-8 text-gray-400 hover:text-gray-300" />
    
  </div>
    <div>
      <slot />
    </div>
  </div>
</template>


<script setup>
import CloseSVG from '@/assets/img/svg/CloseSVG.vue'
const emit = defineEmits({
  close: null
});



const isClose = () => {
  emit('close')
}


</script>

<script>
export default {
  name: 'ModalWrapper',
}
</script>


<style>
.modalWrapper {
  position: sticky;
  right: 0;
  top: 0;
  height: max-content;
}
</style>