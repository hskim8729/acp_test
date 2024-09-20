import { defineStore } from "pinia";

export const aiUserStore = defineStore("aiUserInfo", {
  state: () => ({
    userId: 0,
    userToken: "",
    userSession: "",
    isAdmin: false,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    getUser: (state) => {
      return state.userId;
    },
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
