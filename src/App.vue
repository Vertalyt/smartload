<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed,  onMounted } from 'vue'
import MainLayout from './layout/MainLayout.vue'
import AuthLayout from './layout/AuthLayout.vue'
import { useAuthStore } from "@/stores/auth.js";
import TheMessage from '@/components/TheMessage.vue';

const layout = {
  MainLayout,
  AuthLayout
}

const route = useRoute()
const router = useRouter()
const metaLayout = computed(() => route.meta.layout)
const authStore = computed(() => useAuthStore() )

onMounted( async() => {
      const isAuth = await authStore.value.authenticateUser();
        if(!isAuth) {
          router.push('/auth?message=auth_store')
        }
} )

</script>

<template>
<TheMessage />
 <component :is="layout[metaLayout]" v-if="metaLayout" />
</template>
