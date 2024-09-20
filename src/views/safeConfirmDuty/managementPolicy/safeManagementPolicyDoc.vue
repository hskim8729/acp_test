<!-- views/riskFactroStandardPage -->
<template>
  <div class="text-subtitle-6 align-center ms-1 mb-1 d-flex">
    <p class="mr-2">첨부파일</p>
    <div style="max-width: 245px; min-width: 245px">
      <file-handler
        table="SAFE_MANAGEMENT"
        :files="files"
        ref="fileHandlerRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from "vue";

import fileHandler from "@/components/file/fileHandler.vue";

const props = defineProps({
  safeInfo: {
    type: Object,
    default: {},
  },
});

const files = ref([]);
const fileHandlerRef = ref(null); // 파일 핸들러의 새로 업로드 된 파일들 목록을 가져오기 위한 ref
const getNewUploadFiles = () => {
  if (fileHandlerRef.value) {
    return fileHandlerRef.value.getNewUploadFiles();
  } else {
    return [];
  }
};

defineExpose({ getNewUploadFiles });
</script>
<style></style>
