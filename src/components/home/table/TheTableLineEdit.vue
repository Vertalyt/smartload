<template>
  <div
    class="min-w-86 relative z-50 mx-auto flex flex-wrap justify-center gap-3 rounded-md border-4 border-green-600 bg-gray-200 p-5"
    @click.stop
  >

    <div
      v-for="v in date"
      :key="v.key_Cols"
      class="flex min-h-max grow flex-col mt-10 flex-wrap items-center gap-3 rounded-md bg-blue-200 text-xl"
    >
      <span class="p-2">{{ v.name_ua_cols }}</span>
      <textarea
        :readonly="isID(v.key_Cols)"
        :disabled="isID(v.key_Cols)"
        class="flex w-full h-20 items-center rounded-b-md border border-gray-300 pl-5"
        :placeholder="v.val"
        draggable="false"
        v-model="v.val"
      >
        >
      </textarea>
    </div>
    <SubmitButton
      :nameBtn="nameBTN"
      @submit="onSubmit"
      id="submitEditForm"
      class="w-full"
      color="green"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import SubmitButton from "@/components/SubmitButton.vue";

const emit = defineEmits({
  update: Object,
  close: null
});
const props = defineProps({
  date: {
    required: true,
    type: Array,
  },
  nameBTN: {
    required: true,
    type: String,
  },
});

const isID = (key) => (key === "id" ? true : false);

const onSubmit = () => {

  emit('update', props.date)
};

// устанавливаю фокус на таблицу
onMounted( () => {
  const btnSend = document.querySelector('#submitEditForm');
  if(btnSend) {
  btnSend.focus()
  }
})


</script>

<script>
export default {
  name: "TheTableLineEdit",
};
</script>
