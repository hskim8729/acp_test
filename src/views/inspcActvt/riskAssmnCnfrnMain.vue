<template>
  <comm-safe-duty page-title="위험성평가 회의">
    <template #pageCard>
      <risk-assmn-cnfrn-list />
    </template>
    <template #infoBody>
      <p>위험성평가 업무 절차</p>
      <comp-button
        type="detailView"
        text="자세히 보기"
        class="mt-2"
        @click="isOpenImageViewer = true" />
    </template>
  </comm-safe-duty>
  <image-viewer
    title="위험성평가 업무 절차"
    width="660px"
    :fileArr="fileArr"
    :readOnly="true"
    v-if="isOpenImageViewer"
    @close="isOpenImageViewer = !isOpenImageViewer">
  </image-viewer>
</template>

<script setup>
import { computed, ref } from "vue";
// 컴포넌트
import imageViewer from "@/components/file/imageViewer.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import riskAssmnCnfrnList from "@/views/inspcActvt/riskAssmnCnfrnList.vue";

const isOpenImageViewer = ref(false); // 이미지뷰어 팝업

const fileArr = computed(() => {
  const imgUrl = "/img/risk_assmn_cnfrn_guide.jpeg";

  let urlArr = [];
  urlArr.push({ src: new URL(imgUrl, import.meta.env.VITE_APP_DOMAIN_URL) });

  return urlArr;
});
</script>

<style lang="scss" scoped></style>
