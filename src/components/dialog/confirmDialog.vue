<template>
  <v-dialog
    class="confirm-dialog"
    @update:modelValue="onClose"
    @keyup.enter="onConfirm"
    @keyup.esc="onClose">
    <v-card class="pa-5">
      <v-card-title class="text-center justify-center pb-0 font-preB">
        <v-icon
          v-if="icon"
          :icon="icon"
          :color="iconColor"
          class="pb-2 mb-"></v-icon>
        <p v-dompurify-html="title"></p>
      </v-card-title>
      <v-card-text class="text-center">
        <p v-dompurify-html="message"></p>
      </v-card-text>
      <v-card-actions class="justify-center pa-0">
        <v-btn
          variant="outlined"
          text
          :class="cancelBtnClass"
          :color="cancelBtnColor"
          @click="onCancel"
          >{{ cancelBtnText }}</v-btn
        >
        <v-btn
          variant="elevated"
          :class="confirmBtnClass"
          :color="confirmBtnColor"
          @click="onConfirm"
          >{{ confirmBtnText }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const icon = ref("");
const iconColor = ref("");
const title = ref("");
const message = ref("");
const confirmBtnText = ref("");
const confirmBtnClass = ref("");
const confirmBtnColor = ref("");
const cancelBtnText = ref("");
const cancelBtnClass = ref("");
const cancelBtnColor = ref("");

const confirmCallback = ref(null);
const cancelCallback = ref(null);

const initData = () => {
  const confirmMessage = dialogStore.confirmMessage;
  const params = dialogStore.confirmParams || {};

  message.value = confirmMessage || "";
  title.value = params.title || "";

  icon.value = params.icon || "mdi-check-circle-outline";
  iconColor.value = params.iconColor || "#19A63C";
  confirmBtnText.value = params.confirmBtnText || "확인";
  cancelBtnText.value = params.cancelBtnText || "취소";
  confirmBtnClass.value = params.confirmBtnClass || "confirm-btn";
  confirmBtnColor.value = params.confirmBtnColor || "primary";
  cancelBtnClass.value = params.cancelBtnClass || "cancel-btn";
  cancelBtnColor.value = params.cancelBtnColor || "primary";

  // callback 함수
  confirmCallback.value = params.confirmCallback;
  cancelCallback.value = params.cancelCallback;
};

onMounted(() => {
  initData();
});

const onConfirm = () => {
  if (confirmCallback.value) {
    confirmCallback.value();
  }
  onClose();
};

const onCancel = () => {
  if (cancelCallback.value) {
    cancelCallback.value();
  }
  onClose();
};

const onClose = () => {
  dialogStore.isConfirmDialog = false;
};
</script>

<style scoped></style>
