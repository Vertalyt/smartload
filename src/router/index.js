import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth.js";
import { computed } from 'vue';

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
      path: '/auth',
      name: 'Auth',
      component: () => import('../pages/TheLogin.vue'),
      meta: {
        layout: 'AuthLayout',
        auth: false,
      }
    },
    {
      path: '/group-permissions',
      name: 'TheGroupPermissions',
      component: () => import('../pages/TheGroupPermissions.vue'),
      meta: {
        layout: 'MainLayout',
        auth: true,
      }
    },
    {
      path: '/users-permissions',
      name: 'TheUsersPermissions',
      component: () => import('../pages/TheUsersPermissions.vue'),
      meta: {
        layout: 'MainLayout',
        auth: true,
      }
    },

    
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

const authStore = computed( () => useAuthStore() ) 


router.beforeEach( (to, _, next) => {
  const requiredAuth = to.meta.auth

  if(requiredAuth && authStore.value.isAuthenticated) {
    next()
  } 
  else if(requiredAuth && !authStore.value.isAuthenticated) {
    next('/auth?message=auth_route')
  }
  else {
    next()
  }
})

export default router




