<template>
  <v-dialog
    class="alert-dialog"
    @update:modelValue="close"
    @keyup.enter="close"
    @keyup.esc="close"
    @keyup.space="close">
    <v-card class="alert-dialog pa-5">
      <v-card-title class="text-center justify-center pb-0 font-preB">
        <v-icon
          v-if="icon"
          :icon="icon"
          :color="iconColor"
          class="pb-2"></v-icon>
        <p v-dompurify-html="title"></p>
      </v-card-title>
      <v-card-text class="text-center">
        <p v-dompurify-html="message"></p>
      </v-card-text>
      <v-card-actions class="justify-center pa-0">
        <v-btn
          :class="btnClass"
          variant="elevated"
          :color="btnColor"
          @click="close"
          >{{ btnText }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const icon = ref("");
const iconColor = ref("");
const title = ref("");
const message = ref("");
const btnText = ref("");
const btnClass = ref("");
const btnColor = ref("");

const callbackFunction = ref(null);

const initData = () => {
  const alertMessage = dialogStore.alertMessage;
  const params = dialogStore.alertParams || {};

  message.value = alertMessage || "";
  title.value = params.title || "";
  btnText.value = params.btnText || "확인";
  btnColor.value = params.btnColor || "primary";
  btnClass.value = params.btnClass || "alert-btn";

  // callback 함수
  callbackFunction.value = params.callback;

  // 아이콘 커스텀 하는 경우
  if (params.icon) {
    icon.value = params.icon;
    iconColor.value = params.iconColor || "";
  } else {
    // type을 받아 기본 정의된 아이콘 사용하는 경우
    // TODO 추후에 디자인 나오면 아이콘, 색상 변경예정
    switch (params.type) {
      case "no-icon":
        icon.value = "";
        iconColor.value = "";
        break;
      case "error":
        icon.value = "mdi-close-circle-outline";
        iconColor.value = "#FF3B30";
        break;
      default:
        icon.value = "mdi-alert-circle-outline";
        iconColor.value = "primary";
    }
  }
};

onMounted(() => {
  initData();
});

onUnmounted(() => {
  if (callbackFunction.value) {
    callbackFunction.value();
  }
});

const close = () => {
  dialogStore.isAlertDialog = false;
};
</script>
<style scoped></style>
