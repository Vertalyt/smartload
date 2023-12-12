<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import MainLayout from './layout/MainLayout.vue'
import AuthLayout from './layout/AuthLayout.vue'

const layout = {
  MainLayout,
  AuthLayout
}

const route = useRoute()
const metaLayout = computed(() => route.meta.layout)

// import { onMounted, ref } from 'vue';
// import { getAuth, getSQL } from './api'
// const auth = ref()
// onMounted(async ()=> {
//   auth.value = await getSQL()
//   console.log('auth', auth.value);
// })
</script>

<template>
 <component :is="layout[metaLayout]" v-if="metaLayout" />
</template>
