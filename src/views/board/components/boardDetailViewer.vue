<template>
  <div class="pa-3" ref="viewer"></div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, watch } from "vue";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
// 스토어
import { storeToRefs } from "pinia";
import { useBbsStore } from "@/stores/board/bbs-store.js";

const bbsStore = useBbsStore();
const { bbsDetail } = storeToRefs(bbsStore);

const viewer = ref("");
const viewerRef = ref("");

// toast viewer 초기화
const setViewer = () => {
  viewerRef.value = new Viewer({
    el: viewer.value,
    height: `500px`,
    initialValue: bbsDetail.value?.cntn,
  });
};

// 스크롤 맨 위로 올리기
const goToTop = () => {
  viewer.value.scrollIntoView({
    behavior: "smooth",
  });
};

onMounted(async () => {
  setViewer();
});

watch(
  () => bbsDetail.value?.bbsSeq,
  () => {
    setViewer();
    goToTop();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
