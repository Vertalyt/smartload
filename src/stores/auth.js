import { defineStore } from "pinia";
import { getAuth, isAuthStatus } from "@/api";
import { TOKEN_KEY } from '@/constants'
import { useMessage } from "@/stores/message";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null,
    id: null,
    email: null,
    group_id: null,
    BD_access: null,
    table_access: null
  }),
  getters: {
    isAuthenticated(getters) {
      return !!getters.token;
    },
    getProperty: (state) => (param) => {
      return state[param];
    },
  },
  actions: {
    async login({ name, password}) {
      try {
        const data = await getAuth({ad_user:name, ad_password: password});
        if(data) {
            localStorage.setItem(TOKEN_KEY, data.token)
            this.token = data.token;
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
            this.token = token;
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
      this.token = null;
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    userInfo({id, email,group_id, BD_access, table_access }) {
      this.id = id;
      this.email = email;
      this.group_id = group_id;
      this.BD_access = BD_access,
      this.table_access = table_access
    }
    

  },
});
