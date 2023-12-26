import axios from "axios";
import { useAuthStore } from '@/stores/auth'
import router from '@/router';

const instance = axios.create();

instance.interceptors.request.use(async function (config) {
        const authStore = useAuthStore()
         const result = await authStore.authenticateUser();
         if(!result) {
          router.push('/auth?message=auth')
         }
        return config;
  });

  export default instance




