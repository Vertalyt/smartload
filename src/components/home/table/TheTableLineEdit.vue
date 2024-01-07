<template>
  <div
    class="min-w-86 relative z-50 mx-auto flex flex-wrap justify-center gap-3 rounded-md border-4 border-green-600 bg-gray-200 p-5"
    @click.stop
  >

 
  <button
        class="absolute right-0 m-1 -mt-1 mr-5 rounded-full border-1 border-gray-600 p-1 bg-gray-500 hover:bg-gray-600"
        data-target="dropdown1"
        @click.stop="IsClose"
      >
        <XMark class="h-5 w-5 text-gray-100" />
  </button>


    <div
      v-for="(value, key) in fullDate"
      :key="key"
      class="flex min-h-max grow flex-col mt-10 flex-wrap items-center gap-3 rounded-md bg-blue-200 text-xl"
    >
      <span class="p-2">{{ key }}</span>
      <textarea
        :readonly="isID(key)"
        :disabled="isID(key)"
        class="flex w-full h-20 items-center rounded-b-md border border-gray-300 pl-5"
        :placeholder="value"
        draggable="false"
        v-model="fullDate[key]"
      >
        >
      </textarea>
    </div>
    <SubmitButton
      nameBtn="Редактировать"
      @submit="onSubmit"
      class="w-full"
      color="green"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SubmitButton from "@/components/SubmitButton.vue";
import XMark from "@/assets/img/svg/XMark.vue";


const emit = defineEmits({
  update: Object,
  close: null
});
const props = defineProps({
  date: {
    required: true,
    type: Array,
  },
});

const fullDate = ref(props.date[0]);

const isID = (key) => (key === "id" ? true : false);

const onSubmit = () => {
  emit('update', fullDate.value)
};

const IsClose = () => {
  emit('close')
}

</script>

<script>
export default {
  name: "TheTableLineEdit",
};
</script>
