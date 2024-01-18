import { defineStore } from "pinia";

export const useMessage = defineStore("message", {
  state: () => ({
    message: null,
    print: null,
  }),
  getters: {
    getMessage(state) {
      return state.message;
    },
    getPrint(state) {
      return state.print;
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
    },
    setPrint(payload) {
      this.print = payload
    },
    clearPrint() {
    this.print = null
    },
  },
});


