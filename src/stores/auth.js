import { defineStore } from "pinia";
import { getAuth, isAuthStatus } from "@/api";
import { TOKEN_KEY } from '@/constants'
import { useMessage } from "@/stores/message";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null,
    id: null,
    group_id: null,
    BD_access: null,
    table_access: null,
    cols_access: null,
    active_status: null
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
      } catch (error) {
        if(error.status === 401) {
          const storeMessage = useMessage()
          storeMessage.setMessage({
            value: 'Не вірні логін чи пароль.',
            type: 'warning'
          })
        } else {
          const storeMessage = useMessage()
          storeMessage.setMessage({
            value: error,
            type: 'warning'
        })
            throw error;
        }
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
      this.id = null;
      this.email = null;
      this.group_id = null;
      this.BD_access = null,
      this.table_access = null,
      this.cols_access = null,
      this.active_status = null,
      localStorage.removeItem(TOKEN_KEY);
    },
    userInfo({id, group_id, BD_access, table_access, cols_access, active_status }) {
      this.id = id;
      this.group_id = group_id;
      this.BD_access = BD_access,
      this.table_access = table_access,
      this.cols_access = cols_access,
      this.active_status = active_status
    },
    addCols_Access({bd_name, table_name, cols_name}) {
      this.cols_access = [...this.cols_access, {
        id: this.cols_access.lengths,
        user_id: this.id,
        bd_name: bd_name,
        table_name: table_name,
        cols_name: cols_name
      }]
    }
  },
});
