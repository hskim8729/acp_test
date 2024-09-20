<!-- views//SAFE_CONFIRM_DUTY/safeBudget -->
<template>
  <comm-safe-duty :page-title="commSafeDutyParams.pageTitle">
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
      <report-view-button />
    </template>
    <template #infoBody>
      <p>
        항목별로 일일이 안전보건 예산 편성이 어려우면,
        <span class="font-weight-bold">
          <span class="text-red">총괄 금액 기준 </span>으로 예산을 편성・집행 </span
        >해보세요.
      </p>
      <comp-button
        type="detailView"
        text="자세히 보기"
        class="mt-2"
        @click="isOpenImageViewer = true" />
    </template>
    <template #pageCard>
      <compPageCard isFillPage>
        <template #multiCard="{ height }">
          <v-row dense style="overflow: hidden">
            <v-col
              class="transitioning-col"
              :xxl="selectedBudgetId !== null ? 6 : 12"
              :xl="selectedBudgetId !== null ? 6 : 12"
              :lg="selectedBudgetId !== null ? 6 : 12"
              md="12"
              sm="12"
              xs="12">
              <comp-card subTitle="연도별 예산" :height="height">
                <template #subTitleBody>
                  <!-- 연도 선택 -->
                  <v-select
                    v-model="selectedYear"
                    :items="years"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    max-width="160px" />
                </template>
                <template #defaultCard>
                  <budget-grid></budget-grid>
                </template>
              </comp-card>
            </v-col>

            <v-divider
              v-if="!lgAndUp && selectedBudgetId !== null"
              class="mt-5 mb-3" />

            <transition name="slide-right" mode="out-in">
              <v-col v-if="selectedBudgetId !== null">
                <comp-card subTitle="예산 집행 내역" :height="height">
                  <template #subTitleBody> </template>
                  <template #defaultCard>
                    <budget-grid-detail />
                  </template>
                </comp-card>
              </v-col>
            </transition>
          </v-row>
        </template>
      </compPageCard>
    </template>
  </comm-safe-duty>
  <image-viewer
    title="예산 편성·집행 절차"
    width="645px"
    height="363px"
    :fileArr="fileArr"
    :readOnly="true"
    v-if="isOpenImageViewer"
    @close="isOpenImageViewer = !isOpenImageViewer">
  </image-viewer>
</template>

<script setup>
// node_modules
import { ref, defineProps, computed } from "vue";
import { useDisplay } from "vuetify";
// 외부 변수 및 함수
// 컴포넌트
import reportViewButton from "@/components/button/reportViewButton.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import compCard from "@/components/layout/compCard.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import budgetGrid from "@/views/safeConfirmDuty/safeBudget/budgetGrid.vue";
import budgetGridDetail from "@/views/safeConfirmDuty/safeBudget/budgetGridDetail.vue";
import imageViewer from "@/components/file/imageViewer.vue";

// store
import { useSafeBudgetStore } from "@/stores/safeConfirmDuty/safe-budget-store.js";
import { storeToRefs } from "pinia";

const safeBudgetStore = useSafeBudgetStore();
const { selectedBudgetId } = storeToRefs(safeBudgetStore);

const props = defineProps({
  height: {
    type: String,
  },
});

const commSafeDutyParams = {
  pageTitle: "예산 편성 및 집행",
};

const { lgAndUp } = useDisplay();

const years = ["2024년", "2023년", "2022년"];
const selectedYear = ref(years[0]);

const isOpenImageViewer = ref(false); // 이미지뷰어 팝업
const fileArr = computed(() => {
  const imgUrl = "/img/safe_budget_guide.jpeg";

  let urlArr = [];
  urlArr.push({ src: new URL(imgUrl, import.meta.env.VITE_APP_DOMAIN_URL) });

  return urlArr;
});
</script>

<style lang="scss" scoped>
.transitioning-col {
  transition: all 0.5s ease-in-out;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
