<template>
  <div class="relative flex lg:hidden ">
    <ButtonMobile @open="isShow = !isShow" />
    <div 
    v-if="isShow"
    class="absolute right-0 top-10 z-20 flex max-w-max px-4">
      <div
        class="max-w-md flex-auto overflow-hidden rounded-xl bg-white p-3 text-sm leading-6 shadow-lg ring-1"
      >
        <div
          v-for="link in menuDate"
          :key="link.name"
          class="group relative flex items-center justify-center gap-x-6 rounded-lg px-1 py-2 hover:bg-gray-50"
          @click="isShow = false"
        >
          <RouterLink
            class="w-full rounded-lg bg-blue-500 px-5 py-2 text-lg hover:bg-blue-600 text-gray-100 font-bold"
            :to="link.link"
            >{{ link.name }}</RouterLink
          >
        </div>

        <div class="group relative flex items-center justify-center gap-x-6 rounded-lg px-1 py-2 hover:bg-gray-50">
        <SubmitButton
            nameBtn="Вихід"
            color="red"
            @submit="isLogaut"
            class="mr-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MENUDATE } from "@/constants";
import ButtonMobile from '@/components/ButtonMobile.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from 'vue-router'

const menuDate = [...MENUDATE, { name: 'Авторизація', link: '/auth' }  ]

const isShow = ref(false)



const isAuth = useAuthStore()
const router = useRouter()

const isLogaut = () => {
  isAuth.logout()
  router.push('/auth')
};

</script>

<script>
export default {
  name: "MobileMenu",
};
</script>

