<script setup>
import { useRoute } from 'vue-router'
import { computed,  onMounted, ref } from 'vue'
import MainLayout from './layout/MainLayout.vue'
import AuthLayout from './layout/AuthLayout.vue'
// import { getAuth } from './api'
const layout = {
  MainLayout,
  AuthLayout
}

const route = useRoute()
const metaLayout = computed(() => route.meta.layout)

</script>

<template>
 <component :is="layout[metaLayout]" v-if="metaLayout" />
</template>
