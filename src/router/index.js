import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/TheHome.vue'),
      meta: {
        layout: 'MainLayout',
        auth: true,
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/TheLogin.vue'),
      meta: {
        layout: 'AuthLayout',
        auth: false,
      }
    },
  ]
})

export default router
