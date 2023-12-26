import { defineStore } from "pinia";

export const useMessage = defineStore("message", {
  state: () => ({
    message: null,
  }),
  getters: {
    getMessage(state) {
      return state.message;
    },
  },
  actions: {
    setMessage(payload) {
        this.message = payload
        setTimeout(() => {
            this.clearMessage()
        }, 1500);
    },
    clearMessage() {
        this.message = null
    }

  },
});


