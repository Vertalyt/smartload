
<template>
        <div class="relative z-10 flex w-full items-center justify-between rounded-xl">
          
          <div class="flex items-center">
            <TheLogo />
            
            <TheMenu class="hidden lg:flex"/>
          </div>


          <div class="hidden lg:flex gap-5">
            <SubmitButton
            nameBtn="Авторизація"
            color="green"
            @submit="$router.push('/auth')"
            class="mr-2 hidden sm:flex"
          />
          <SubmitButton
            nameBtn="Вихід"
            color="green"
            @submit="isLogaut"
            class="mr-2 hidden sm:flex"
          />
          </div>


        </div>
</template>


<script setup>
import SubmitButton from "@/components/SubmitButton.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from 'vue-router'
import TheLogo from '@/components/TheLogo.vue'
import TheMenu from '@/components/TheMenu.vue'



const isAuth = useAuthStore()
const router = useRouter()

const isLogaut = () => {
  isAuth.logout()
  router.push('/auth')
};

</script>

<script>
export default {
  name: 'TheMenu',
}
</script>

