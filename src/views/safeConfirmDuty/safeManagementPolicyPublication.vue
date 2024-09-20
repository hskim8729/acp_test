<!-- views/SAFE_CONFIRM_DUTY/safeManagementPolicyPublication -->
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
  pageTitle: "안전보건 경영방침 및 목표 공개",
  infoMessage: `경영방침과 목표는 <span class="font-weight-bold">눈에 띄는 곳에</span> <span class="text-red font-weight-bold">게시하여 공유</span>하는 것이 중요합니다.<br>
사업장 내 게시판이나 Plan2Do 등 전 직원이 볼 수 있는 곳에 <span class="font-weight-bold">게시하고 해당 내용을 기록</span>하세요.`,
};

const route = useRoute();
const safeActionResultStore = useSafeActionResultStore();
// 해당 페이지 메뉴id를 키로 데이터 불러옴
await safeActionResultStore.getResults(route.meta.menuId);
</script>

<style lang="scss" scoped></style>
