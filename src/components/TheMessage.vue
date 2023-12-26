<template>
    <ModalWrapper 
    v-if="message"
    @close="close">
      <div
      class="modal min-w-86 relative z-50 flex h-48 w-2/3 justify-center gap-3 rounded-md border-4 p-4"
      :class="colorType"
      @click.stop
    >
      <button
        class="absolute right-0 mr-3 rounded-full border p-1"
        :class="colorType"
        data-target="dropdown1"
        @click.stop="close"
      >
        <XMark class="h-3 w-3 text-green-700" />
      </button>
      <p class="text-2xl">{{ message.value }}</p>
    </div>
    </ModalWrapper>
</template>

<script setup>
import { computed } from "vue";
import { useMessage } from "@/stores/message";
import XMark from "@/assets/img/svg/XMark.vue";
import ModalWrapper from "./ModalWrapper.vue";

const storeMessage = useMessage();

const TITLE_Class = {
  primary: "border-green-600 bg-gray-200 ",
  danger: "border-red-500 bg-red-50 ",
  warning: "border-red-300 bg-red-50 ",
};

const message = computed(() => storeMessage.getMessage);
const colorType = computed(() =>
  message.value ? TITLE_Class[message.value.type] : "border-green-600",
);

const close = () => {
  storeMessage.clearMessage();
};
</script>

<script>
export default {
  name: "TheMessage",
};
</script>

<style scoped>
.modal {
  max-height: 70%;
  margin: auto;
}

.modalWrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
}
</style>
