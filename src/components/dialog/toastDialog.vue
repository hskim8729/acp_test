<template>
  <v-snackbar
    :timeout="2000"
    :color="color"
    @update:modelValue="onSnackbarClose">
    <v-icon v-if="isInfoIconShow" class="mr-2">mdi-information-outline</v-icon>
    <p v-dompurify-html="message"></p>

    <template v-slot:actions>
      <v-icon v-if="isCloseIconShow" @click="onSnackbarClose">mdi-close</v-icon>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const isInfoIconShow = ref(false);
const isCloseIconShow = ref(false);
const message = ref("");
const color = ref("");

const initData = () => {
  const toastMsg = dialogStore.toastMessage;
  const toastParams = dialogStore.toastParams || {};

  message.value = toastMsg || "";
  color.value = toastParams.color || "black";
};

const onSnackbarClose = () => {
  dialogStore.isToastDialog = false;
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.snackbar-wrapper {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
}
</style>
