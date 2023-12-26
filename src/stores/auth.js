import { defineStore } from "pinia";
import { getAuth, isAuthStatus } from "@/api";
import { TOKEN_KEY } from '@/constants'
import { useMessage } from "@/stores/message";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: false,
    token: localStorage.getItem(TOKEN_KEY) || null,
    email: null,
    user: null
  }),
  getters: {
    getToken(state) {
      return state.token;
    },
    isAuthenticated(getters) {
      return !!getters.token;
    },
  },
  actions: {
    async login({ name, password}) {
      try {
        const data = await getAuth({ad_user:name, ad_password: password});
        if(data) {
            localStorage.setItem(TOKEN_KEY, data.token)
            this.auth = true;
            this.token = data.token;
            this.email = data.email;
            this.user = data.user;
            const storeMessage = useMessage()
            storeMessage.setMessage({
              value: 'Авторизовано успішно.',
              type: 'primary'
            })
          return true
        } else {
          return false
        }
      } catch (e) {
        const storeMessage = useMessage()
        console.log(e);
        storeMessage.setMessage({
          value: e,
          type: 'warning'
      })
        throw new Error(e);
      }
    },
    async authenticateUser() {

      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const verifyToken = await isAuthStatus(token);
          if (verifyToken && verifyToken.data) {
            this.auth = true;
            this.token = token;
            this.email = verifyToken.data.email;
            this.user = verifyToken.data.login;
            return verifyToken;
          }
        } catch (error) {
          if(error.response.status === 401) {
            console.log('message', error.message);
            return undefined
          } else {
              throw error;
          }
        }
      }
      this.handleAuthError();
      return false;
    },
    logout() {
      console.log('isLogout');
      this.handleAuthError()
    },
    handleAuthError() {
      this.auth = false;
      this.token = null;
      this.email = null;
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
    }
    
  },
});


