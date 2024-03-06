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
    <EditLineTableArea 
      :modelValue="v.val"
      :col="v"
      @update:modelValue="updateModelValue($event, v)"
    />
    
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
import EditLineTableArea from "./EditLineTableArea.vue";



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


const updateModelValue = (newValue, item) => {
  item.val = newValue;
}



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
