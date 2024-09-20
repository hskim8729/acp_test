<!-- views/SAFE_CONFIRM_DUTY/safeEmergencyManualCheck -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage"
    contentHeight="calc(100vh - 250px)">
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
      <report-view-button />
    </template>

    <template #contents>
      <actionResultGrid></actionResultGrid>
    </template>
  </comm-safe-duty>
</template>

<script setup>
// node_modules
import { useRoute } from "vue-router";
// 외부 변수 및 함수
// 컴포넌트
import compButton from "@/components/button/compButton.vue";
import reportViewButton from "@/components/button/reportViewButton.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import actionResultGrid from "@/views/safeConfirmDuty/components/actionResultGrid.vue";
// store
import { useSafeActionResultStore } from "@/stores/safeConfirmDuty/safe-action-result-store.js";

const commSafeDutyParams = {
  pageTitle: "재해대응 메뉴얼 조치 점검",
  infoMessage: `매뉴얼에 따른 조치결과를 <span class="text-red font-weight-bold">반기 1회 이상 점검</span>하세요.<br>
비상상황 대응훈련 등을 통한 점검결과에 따라 <span class="font-weight-bold">매뉴얼의 현행화, 내용 보완을 등록 관리</span>하세요.`,
};

const route = useRoute();
const safeActionResultStore = useSafeActionResultStore();
// 해당 페이지 메뉴id를 키로 데이터 불러옴
await safeActionResultStore.getResults(route.meta.menuId);
</script>

<style lang="scss" scoped></style>
