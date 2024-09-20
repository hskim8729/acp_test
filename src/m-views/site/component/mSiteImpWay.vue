<template>
  <v-select
    bg-color="gray100"
    v-model="selected"
    density="compact"
    :items="riskEvalMthdList"
    item-title="comCdNm"
    item-value="comCd"
    disabled
    variant="outlined"
    hide-details="auto"
    class="pb-3" />

  <div class="text-subtitle-4">최초평가 평가 시기</div>
  <div class="pt-1 pb-3">{{ searchList.intEval }}</div>

  <div class="text-subtitle-4">{{ info.name }} 평가시기</div>
  <v-table density="compact" class="my-2 border border-e-0 border-s-0">
    <tbody>
      <tr>
        <td class="border-e-sm" width="120px">{{ info.firstTitle }}</td>
        <td>{{ info.firstContent }}</td>
      </tr>
      <tr>
        <td class="border-e-sm" width="120px">{{ info.secondTitle }}</td>
        <td>{{ info.secondtContent }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed } from "vue";
// 외부 변수 및 함수
// 컴포넌트
// store
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

const selected = computed({
  get: () => searchList.value.riskEvalMthdCd,
});

const info = computed(() => {
  const result = {
    name: riskEvalMthdList.value.comCdNm,
    firstTitle: "",
    firstContent: null,
    secondTitle: "",
    secondtContent: null,
  };
  switch (searchList.value.riskEvalMthdCd) {
    case "T0401":
      // 수시평가
      result.firstTitle = "정기";
      result.firstContent = searchList.value.rglr;
      result.secondTitle = "수시";
      result.secondtContent = searchList.value.occs;
      break;
    case "T0402":
      // 상시평가
      result.firstTitle = "월";
      result.firstContent = searchList.value.mon;
      result.secondTitle = "주";
      result.secondtContent = searchList.value.week;
      break;

    default:
      break;
  }

  return result;
});

const siteImpStore = useSiteImpRegulationStore();
const { searchList, riskEvalMthdList } = storeToRefs(siteImpStore);
</script>

<style lang="scss" scoped></style>
