<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage">
    <template #pageCard>
      <risk-assmn-cnfrn-list />
    </template>
  </comm-safe-duty>
</template>

<script setup>
// 컴포넌트
import { ref } from "vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import riskAssmnCnfrnList from "@/views/inspcActvt/riskAssmnCnfrnList.vue";

const commSafeDutyParams = {
  pageTitle: "추가위험 개선방안 이행",
  infoMessage: `<span class="text-red font-weight-bold">정기적인 위험성평가를 실시</span>하세요.<br>
위험성평가를 통해 종사자 의견에 대한 조치 <span class="text-red font-weight-bold">이행 점검</span>이 가능합니다.`,
};
</script>

<style lang="scss" scoped></style>
