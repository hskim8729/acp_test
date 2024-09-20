<template>
  <div class="d-inline-flex justify-start">
    <v-radio-group
      v-for="option in riskEvalMthdList"
      v-model="searchList.riskEvalMthdCd"
      hide-details="auto">
      <v-radio :label="option.comCdNm" :value="option.comCd"></v-radio>
    </v-radio-group>
  </div>

  <div class="text-subtitle-4">최초평가 시기</div>
  <div class="pt-1 pb-3">
    <comp-input
      v-model="searchList.intEval"
      name="최초평가 시기"
      required></comp-input>
  </div>

  <div class="text-subtitle-4">{{ info.name }} 시기</div>
  <v-table density="compact" class="my-2 border border-e-0 border-s-0">
    <tbody>
      <tr>
        <td
          class="border-b-sm bg-gray700 border-gray200 text-center"
          width="120px">
          {{ info.firstTitle }}
        </td>
        <td>
          <comp-input
            v-if="searchList.riskEvalMthdCd === 'T0401'"
            v-model="searchList.rglr"
            name="정기 평가 시기"
            required />
          <comp-input
            v-if="searchList.riskEvalMthdCd === 'T0402'"
            v-model="searchList.mon"
            name="수시 평가 시기"
            required />
        </td>
      </tr>
      <tr>
        <td class="bg-gray700 text-center" width="120px">
          {{ info.secondTitle }}
        </td>
        <td>
          <comp-input
            v-if="searchList.riskEvalMthdCd === 'T0401'"
            v-model="searchList.occs"
            name="월 단위 평가 시기"
            required />
          <comp-input
            v-if="searchList.riskEvalMthdCd === 'T0402'"
            v-model="searchList.week"
            name="주 단위 평가 시기"
            required />
        </td>
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

// const info = {
//   name: searchList.value.riskEvalMthdCd === "T0401" ? "수시평가" : "상시평가",
//   firstTitle: searchList.value.riskEvalMthdCd === "T0401" ? "정기" : "월",
//   secondTitle: searchList.value.riskEvalMthdCd === "T0401" ? "수시" : "주",
// };

const siteImpStore = useSiteImpRegulationStore();
const { searchList, riskEvalMthdList } = storeToRefs(siteImpStore);

const info = computed(() => {
  const result = {
    name: "",
    firstTitle: "",
    secondTitle: "",
  };
  switch (searchList.value.riskEvalMthdCd) {
    case "T0401":
      // 수시평가
      result.name = "수시평가";
      result.firstTitle = "정기";
      result.secondTitle = "수시";
      break;
    case "T0402":
      // 상시평가
      result.name = "상시평가";
      result.firstTitle = "월";
      result.secondTitle = "주";
      break;

    default:
      break;
  }
  return result;
});
</script>

<style lang="scss" scoped></style>
