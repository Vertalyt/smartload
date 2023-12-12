<template>
  <div class="flex flex-col justify-center p-6 pb-12">
    <div class="mx-auto max-w-md">
      <UserSVG class="mx-auto h-12 text-green-600" />
      <h2 class="text-center mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
    </div>

    <TheLoginForm class="w-full" />
  </div>
</template>

<script setup>
import UserSVG from "@/assets/img/svg/UserSVG.vue";
import TheLoginForm from "@/components/TheLoginForm.vue";

defineEmits({});
defineProps({});
</script>

<script>
export default {
  name: "TheLogin",
};
</script>
