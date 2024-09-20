import { defineStore } from "pinia";

export const useDialogStore = defineStore({
  id: "dialogStore",
  state: () => ({
    isAlertDialog: false,
    isConfirmDialog: false,
    isToastDialog: false,
    alertMessage: "",
    alertParams: {},
    toastMessage: "",
    toastParams: {},
    confirmMessage: "",
    confirmParams: {},
    isLoadingDialog: false,
  }),
  getters: {},
  actions: {
    openAlertDialog(message, params) {
      this.isAlertDialog = true;
      this.alertMessage = message;
      this.alertParams = params;
    },
    openToastDialog(message, params) {
      this.isToastDialog = true;
      this.toastMessage = message;
      this.toastParams = params;
    },
    openConfirmDialog(message, params) {
      this.isConfirmDialog = true;
      this.confirmMessage = message;
      this.confirmParams = params;
    },
  },
});
