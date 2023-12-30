<template>
  <form
    action="#"
    class="wrap flex flex-col sm:flex-row flex-wrap items-center justify-evenly lg:justify-center gap-2 sm:gap-5 py-3 max-w-[1400px]"
    @submit.prevent="addUser"
  >

    <TheFormElement title="Логін" >
    <div class="relative mt-1 rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
        <UserFormSVG
          class="h-5 w-5 text-gray-400"
          :class="{ 'text-red-400': nError }"
        />
      </div>
      <input
        v-model="name"
        @blur="nBlur"
        type="text"
        id="name"
        name="name"
        required
        class="h-14 w-40 rounded-md border-gray-300 pl-10 text-sm focus:border-green-500 focus:ring-green-500"
        :class="{
          'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500':
            nError,
        }"
        placeholder="John Doe"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <ExclamationSVG v-if="nError" class="h-5 w-5 text-red-500" />
      </div>
    </div>
    <p class="mt-2 text-sm text-red-600" v-if="nError">
      {{ nError }}
    </p>
    </TheFormElement>

    <TheFormElement title="Емаіл"  >
    <div class="relative mt-1 rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
        <EmailSVG
          class="h-5 w-5 text-gray-400"
          :class="{ 'text-red-400': eError }"
        />
      </div>
      <input
        v-model="email"
        @blur="eBlur"
        type="text"
        id="email"
        name="email"
        required
        class="h-14 w-48 rounded-md border-gray-300 pl-10 text-sm focus:border-green-500 focus:ring-green-500"
        :class="{
          'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500':
            eError,
        }"
        placeholder="test@gmail.com"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <ExclamationSVG v-if="eError" class="h-5 w-5 text-red-500" />
      </div>
    </div>
    <p class="mt-2 text-sm text-red-600" v-if="eError">
      {{ eError }}
    </p>
    </TheFormElement>

    <TheFormElement title="Статус"  >
    <div class="relative rounded-md shadow-sm">
      <div>
        <input
          type="radio"
          id="active"
          v-model="radio"
          name="radio"
          value="1"
        />
        <label for="active">{{ statusUsers[0] }}</label>
      </div>

      <div>
        <input
          type="radio"
          id="disabled"
          v-model="radio"
          name="radio"
          value="0"
        />
        <label for="disabled">{{ statusUsers[1] }}</label>
      </div>
    </div>
    </TheFormElement>

    <TheFormElement title="Група">

      <RecordsPerPageSelector
        class="mx-0"
        :options="variable"
        :modelValue="groupUser"
        @update:model-value="changeGroup"
        key="group"
      />

    </TheFormElement>

    
    <!-- <div class="mb-4 flex items-end justify-center lg:h-20"> -->
      <TheFormElement>
        <SubmitButton nameBtn="Submit" color="green" class="flex items-center" />
      </TheFormElement>

    <!-- </div> -->
  </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import SubmitButton from "@/components/SubmitButton.vue";
import UserFormSVG from "@/assets/img/svg/UserFormSVG.vue";
import EmailSVG from "@/assets/img/svg/EmailSVG.vue";
import ExclamationSVG from "@/assets/img/svg/ExclamationSVG.vue";
import RecordsPerPageSelector from "@/components/RecordsPerPageSelector.vue";
import { ref } from "vue";
import { statusUsers } from "@/constants";
import { searchIdGroups } from "@/functions";
import TheFormElement from "@/components/home/table/TheFormElement.vue";




const emit = defineEmits({
  add: Object,
});
const props = defineProps({
  variable: {
    required: true,
    type: Array,
  },
  usersGroups: {
    required: true,
    type: Array,
  },
});

const {
  value: name,
  errorMessage: nError,
  handleBlur: nBlur,
} = useField("name", yup.string().trim());

const {
  value: email,
  errorMessage: eError,
  handleBlur: eBlur,
} = useField("email", yup.string().email().trim());

const radio = ref("0");

const { handleSubmit } = useForm();

function resetForm() {
  radio.value = "disabled";
  groupUser.value = "Reader";
  name.value = "";
  email.value = "";
}

const addUser = handleSubmit(() => {
  const values = {
    username: name.value,
    email: email.value,
    group_id: searchIdGroups(props.usersGroups, groupUser.value),
    active_status: radio.value,
  };

  emit("add", values);

  resetForm();
});

const groupUser = ref("Reader");
const changeGroup = (val) => {
  groupUser.value = val;
};
</script>

<script>
export default {
  name: "TheAddForm",
};
</script>
