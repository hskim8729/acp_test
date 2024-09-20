<!-- views//SAFE_CONFIRM_DUTY/safeBudget -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage"
    isTabPage
    :tabList="tabList"
    :hiddenCard="!condition">
    <!-- 버튼 영역 -->
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
    </template>

    <!-- information box 영역 -->
    <template #infoBody>
      <p>
        <comp-button
          type="detailView"
          text="자세히 보기"
          class="mt-2"
          @click="isOpenImageViewer = true" />
      </p>
      <v-divider class="mt-3 mb-2" />
      <div class="d-flex align-center">
        <div class="text-subtitle-6 pr-5">
          우리사업장은 제3자에게 업무의 도급,용역, 위탁 등을 하지 않습니다.
        </div>
        <v-radio-group
          v-model="condition"
          hide-details="auto"
          inline
          density="compact">
          <v-radio label="예" :value="true"></v-radio>
          <v-radio label="아니요" :value="false" class="ml-2"></v-radio>
        </v-radio-group>
      </div>
    </template>
  </comm-safe-duty>
  <image-viewer
    title="적격업체 선정 기준/절차"
    width="640px"
    height="285px"
    :fileArr="fileArr"
    :readOnly="true"
    v-if="isOpenImageViewer"
    @close="isOpenImageViewer = !isOpenImageViewer" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch, markRaw, computed } from "vue";

import reportViewButton from "@/components/button/reportViewButton.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import imageViewer from "@/components/file/imageViewer.vue";

import selectionStandard from "@/views/safeConfirmDuty/selectionVender/selectionStandard.vue";
import selectionProcess from "@/views/safeConfirmDuty/selectionVender/selectionProcess.vue";

const commSafeDutyParams = {
  pageTitle: "적격업체 선정 기준/절차",
  infoMessage: `상시근로자 50인 미만 기업이더라도, 제3자에게 도급, 위탁 등을 한 경우,
  도급인(원칭 사업주)은 수급인(하청 사업주) 및 수급인의 종사자에 대한 안전보건 확보를 위한 기준·절차(적격업체 선정, 비용 및 기간 등)을 마련해야 합니다.<br>
  *(도급예시) 유지·보수업체, 경비·조경·청소 등 용역서비스, 통근버스·구내식당 등 복리후생시설위탁운영 등
  `,
};

const tabList = ref([
  {
    value: "standard",
    name: "선정기준",
    component: markRaw(selectionStandard),
  },
  {
    value: "process",
    name: "선정절차",
    component: markRaw(selectionProcess),
  },
]);

const isOpenImageViewer = ref(false); // 이미지뷰어 팝업
const fileArr = computed(() => {
  const imgUrl = "/img/selection_vender_standard_guide.jpeg";

  let urlArr = [];
  urlArr.push({ src: new URL(imgUrl, import.meta.env.VITE_APP_DOMAIN_URL) });

  return urlArr;
});

const condition = ref(true); // 전문인력 선임 필수인지 아닌지
const activeTab = ref("");
</script>

<style lang="scss" scoped></style>
