<template>
  <compPageCard isFillPage>
    <v-row dense class="mt-2" style="overflow: hidden">
      <v-col
        class="transitioning-col"
        :xxl="selectedBudgetId !== null ? 6 : 12"
        :xl="selectedBudgetId !== null ? 6 : 12"
        :lg="selectedBudgetId !== null ? 6 : 12"
        md="12"
        sm="12"
        xs="12">
        <comp-card subTitle="연도별 예산">
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
          <comp-card subTitle="예산 집행 내역">
            <template #subTitleBody> </template>
            <template #defaultCard>
              <budget-grid-detail />
            </template>
          </comp-card>
        </v-col>
      </transition>
    </v-row>
  </compPageCard>
</template>

<script setup>
// node_modules
import { ref } from "vue";
import { useDisplay } from "vuetify";
// 외부 변수 및 함수
// 컴포넌트
import compPageCard from "@/components/layout/compPageCard.vue";
import compCard from "@/components/layout/compCard.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import budgetGrid from "@/views/safeConfirmDuty/safeBudget/budgetGrid.vue";
import budgetGridDetail from "@/views/safeConfirmDuty/safeBudget/budgetGridDetail.vue";
// store
import { useSafeBudgetStore } from "@/stores/safeConfirmDuty/safe-budget-store.js";
import { storeToRefs } from "pinia";

const safeBudgetStore = useSafeBudgetStore();
const { selectedBudgetId } = storeToRefs(safeBudgetStore);

const commSafeDutyParams = {
  pageTitle: "예산 편성 및 집행",
  infoMessage: `적어주시면 <span class="text-red">바꿀게영</span>, 목표는 <span class="text-red">구체적으로</span> 작성해보세요.`,
};

const { lgAndUp } = useDisplay();

const years = ["2024년", "2023년", "2022년"];
const selectedYear = ref(years[0]);
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
