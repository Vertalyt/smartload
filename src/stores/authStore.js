import { defineStore } from "pinia";
import { getAuth } from "@/api";

const TOKEN_KEY = "authToken";

export const useModalStore = defineStore("auth", {
  state: () => ({
    isAuth: false,
    token: localStorage.getItem(TOKEN_KEY) || null,
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
        console.log('payload', {ad_user:name, ad_password: password});
      try {
        const data = await getAuth({ad_user:name, ad_password: password});
        if(data) {
          console.log(data);
          // localStorage.setItem(TOKEN_KEY, token)
          return true
        } else {
          return false
        }

      } catch (e) {
        throw new Error(e);
      }
    },
    logout() {
      this.state.token = null
      localStorage.removeItem(TOKEN_KEY)
    }
  },
});


