<template>
  <div class="popup pop_detail_view show">
    <div class="popup_title">
      <span>{{ title }}</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <span class="view_content"></span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineExpose, ref } from "vue";

const title = ref();
const content = ref();
const emit = defineEmits(["close"]);

const setTextarea = (params) => {
  title.value = params.colDef.headerName;
  content.value = params.value;

  const span = document.querySelector(".view_content");
  if (span) {
    span.innerHTML = params.value.replaceAll("\n", "<br/>");
  }
};

defineExpose({
  setTextarea,
});

// 팝업 닫기
function popupClose() {
  emit("close");
}
</script>

<style scoped>
.view_content {
  font-size: 2.5rem;
}
.popup_content {
  height: calc(100% - 60px);
}
</style>
