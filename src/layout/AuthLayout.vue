<template>
  <div class="relative min-h-screen min-w-[280px] bg-gray-200">


    <div class="flex items-center justify-between p-6">

      <a href="#" class="flex items-center gap-2">
        <TheShieldSVG class="h-10 text-green-600" />
        <span class="text-xl font-black">Security</span>
      </a>
      
        <SubmitButton @submit="onSubmit" color="green" nameBtn="Головна" />
    </div>

    <RouterView />

    <TheWaveSVG class="absolute bottom-0" />
  </div>
</template>

<script setup>
import TheWaveSVG from "@/assets/img/svg/TheWaveSVG.vue";
import TheShieldSVG from "@/assets/img/svg/TheShieldSVG.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/stores/auth.js";


defineEmits({});
defineProps({});

const isStoreAuth = useAuthStore()
const router = useRouter()
const onSubmit = () => {
 const isAuth = isStoreAuth.isAuthenticated
  if(isAuth) {
    router.push('/')
  } else {
    console.log('Необходима Авторизація');
  }

}

</script>

<script>
export default {
  name: "AuthLayout",
};
</script>
