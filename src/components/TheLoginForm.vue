<template>
  <div
    class="flex flex-col justify-center z-10 mx-auto mt-10 w-full max-w-md rounded-xl bg-white/70 p-10 shadow-xl backdrop-blur-xl"
  >
    <form action="#" class="space-y-6" @submit.prevent="onSubmit">
      <div>
        <label
          for="name"
          class="flex flex-col text-sm font-medium text-gray-700"
          >Логін</label
        >
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
            class="w-full rounded-md border-gray-300 pl-10 text-sm focus:border-green-500 focus:ring-green-500"
            :class="{ 'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500': nError }"
            placeholder="John Doe"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationSVG v-if="nError" class="h-5 w-5 text-red-500" />
          </div>
        </div>
        <p class="mt-2 text-sm text-red-600" v-if="nError">
          {{ nError }}
        </p>
      </div>

      <div>
        <label
          for="password"
          class="flex flex-col text-sm font-medium text-gray-700"
          >Пароль</label
        >

        <div class="relative mt-1 rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <PasswordSVG
              class="h-5 w-5 text-gray-400"
              :class="{ 'text-red-400': pError }"
            />
          </div>
          <input
            v-model="password"
            @blur="pBlur"
            type="password"
            id="password"
            name="password"
            class="w-full rounded-md border-gray-300 pl-10 text-sm focus:border-green-500 focus:ring-green-500"
            :class="{ 'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500': pError }"
            placeholder="Minimum 8 characters"
          />
        </div>
        <p class="mt-2 text-sm text-red-600" v-if="pError">
          {{ pError }}
        </p>
      </div>

      <div class="flex justify-center">
        <SubmitButton nameBtn="Submit" color="green" class="w-full" />
      </div>
    </form>
    <TheLoader v-if="isLoading" class="mt-4"/>
  </div>
</template>

<script setup>
import UserFormSVG from "@/assets/img/svg/UserFormSVG.vue";
import PasswordSVG from "@/assets/img/svg/PasswordSVG.vue";
import ExclamationSVG from "@/assets/img/svg/ExclamationSVG.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth.js";
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TheLoader from "@/components/TheLoader.vue";

const authStore = computed(() => useAuthStore());

const isLoading = ref(false)
const PASSWORD_LENGHT = 6;
const router = useRouter()

const { handleSubmit} = useForm();

const {
  value: name,
  errorMessage: nError,
  handleBlur: nBlur,
} = useField("name", yup.string().trim().required("Введіть email"));

const {
  value: password,
  errorMessage: pError,
  handleBlur: pBlur,
} = useField(
  "password",
  yup
    .string()
    .trim()
    .required("Введіть пароль")
    .min(
      PASSWORD_LENGHT,
      `Пароль не може бути меншим ніж за ${PASSWORD_LENGHT} символів`,
    ),
);

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  isLoading.value = true
  try {
   const status = await authStore.value.login(values)
   resetForm();
   if(status) {
    isLoading.value = false
    router.push('./')
   }
  } catch (error) {/* empty */}
});
</script>

<script>
export default {
  name: "TheLoginForm",
};
</script>@/stores/auth@/stores@/stores/auth