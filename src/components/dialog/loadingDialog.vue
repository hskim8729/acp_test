<template>
  <v-overlay
    class="align-center justify-center"
    @update:modelValue="close"
    persistent>
    <!-- <v-progress-circular
      color="primary"
      indeterminate
      size="70"
      width="10"></v-progress-circular> -->
    <div class="loading">
      <div class="rotate01"></div>
      <div class="rotate02"></div>
      <div class="text"></div>
    </div>
  </v-overlay>
</template>

<script setup>
import { onMounted } from "vue";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const initData = () => {};

onMounted(() => {
  initData();
});

const close = () => {
  dialogStore.isLoadingDialog = false;
};
</script>
<style scoped></style>
