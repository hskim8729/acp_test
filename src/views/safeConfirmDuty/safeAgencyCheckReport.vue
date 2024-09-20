<!-- views/SAFE_CONFIRM_DUTY/safeAgencyCheckReport -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    contentHeight="calc(100vh - 250px)"
    :hiddenCard="!condition">
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
      <report-view-button />
    </template>
    <template #infoBody>
      <p>
        <span class="font-weight-bold">외부 전문기관</span>에
        <span class="text-red font-weight-bold">위탁</span>중이시면, 점검 결과
        보고서를 등록하여 체계적으로 관리하세요.
      </p>
      <v-divider class="my-2" />
      <div class="d-flex align-center">
        <div class="text-subtitle-6 pr-5">
          외부 전문기관에 위탁하고 계신가요?
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
    <template #contents>
      <actionResultGrid></actionResultGrid>
    </template>
  </comm-safe-duty>
</template>

<script setup>
// node_modules
import { ref } from "vue";
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
  pageTitle: "위탁기관 점검 결과",
};

const route = useRoute();
const safeActionResultStore = useSafeActionResultStore();
// 해당 페이지 메뉴id를 키로 데이터 불러옴
await safeActionResultStore.getResults(route.meta.menuId);

const condition = ref(true); // 전문인력 선임 필수인지 아닌지
</script>

<style lang="scss" scoped></style>
