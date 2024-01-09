
<template>
  <div class="modalWrapper min-w-fit min-h-screen h-max z-30 bg-stone-600/90 p-5"
    @click.stop="isClose"
    @keyup.esc="isClose"
  >
    <div>
      <slot />
    </div>
  </div>
</template>


<script setup>
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