
<template>
        <div class="z-10 flex w-full items-center justify-between rounded-xl">
          
          <div class="flex items-center">
            <TheLogo />
            
            <TheMenu />
          </div>

          <SubmitButton
            nameBtn="Вихід"
            color="blue"
            @submit="isLogaut"
            class="mr-2 hidden sm:flex"
          />
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
  // console.log('isLogaut');
  isAuth.logout()
  router.push('/auth')
};

</script>

<script>
export default {
  name: 'TheMenu',
}
</script>

