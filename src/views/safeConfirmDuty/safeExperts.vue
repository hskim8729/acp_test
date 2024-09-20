<!-- views//SAFE_CONFIRM_DUTY/safeBudget -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage"
    :tabList="experts"
    isTabPage
    :hiddenCard="!condition">
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
      <report-view-button />
    </template>
    <template #infoBody>
      <div class="text-body-5 text-gray400 py-1">
        <p>
          * 1.제조업, 2.임업, 3.하수/폐수/분뇨처리업,
          4.폐기물수집/운반/처리/원료재생업, 5.환경정화/복원업
        </p>
        <p>(안전보건관리담당자의 업무는 외부 전문기관에 위탁할 수 있습니다.)</p>
      </div>
      <v-divider class="my-2" />
      <div class="d-flex align-center">
        <div class="text-subtitle-6 pr-5">
          전문인력 선임 조건에 해당되시나요?
        </div>
        <v-radio-group
          v-model="condition"
          hide-details="auto"
          inline
          density="compact">
          <!-- 아니요 체크한 경우 빈 박스만 뜸 -->
          <!-- 예 체크한 경우 입력할 칸이 뜸 -->
          <v-radio label="예" :value="true"></v-radio>
          <v-radio label="아니요" :value="false" class="ml-2"></v-radio>
        </v-radio-group>
      </div>
    </template>
  </comm-safe-duty>
</template>

<script setup>
// node_modules
import { markRaw, ref } from "vue";

// 외부 변수 및 함수
// 컴포넌트
import reportViewButton from "@/components/button/reportViewButton.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import safeExpertsContainer from "@/views/safeConfirmDuty/safeExperts/safeExpertsContainer.vue";

const commSafeDutyParams = {
  pageTitle: "전문인력 선임",
  infoMessage: `산업안전보건법 제17조(안전관리자), 제18조(보건관리자), 제22조(산업보건의)에 따른 전문인력 선임대상 조건 : 상시근로자 50인 이상 </br>
  다만, 제조업 등 일부 업종* 상시근로자 20명 이상 50명 미만 사업장의 경우, 산업안전보건법 제19조에 따라 안전보건관리담당자를 두어야 합니다.`,
};

const condition = ref(true); // 전문인력 선임 필수인지 아닌지

const experts = [
  {
    name: "안전관리자",
    value: "safeMngr",
    component: markRaw(safeExpertsContainer),
    params: {
      value: "safeMngr",
    },
  },
  {
    name: "보건관리자",
    value: "healthMngr",
    component: markRaw(safeExpertsContainer),
    params: {
      value: "healthMngr",
    },
  },
  {
    name: "산업보건의",
    value: "ohpDoctor", // OHP: Occupational Health Physician
    component: markRaw(safeExpertsContainer),
    params: {
      value: "ohpDoctor",
    },
  },
];
</script>

<style lang="scss" scoped></style>
