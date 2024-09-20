<!-- views/SAFE_CONFIRM_DUTY/safeRiskAssmnReport -->
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
  pageTitle: "위험성평가 결과 보고",
  infoMessage: `현장에서의 위험성평가 실시 결과를 <span class="font-weight-bold"><span class="text-red">경영책임자에게 보고</span>하고,보고결과를 기록</span>하세요.`,
};

const route = useRoute();
const safeActionResultStore = useSafeActionResultStore();
// 해당 페이지 메뉴id를 키로 데이터 불러옴
await safeActionResultStore.getResults(route.meta.menuId);
</script>

<style lang="scss" scoped></style>
