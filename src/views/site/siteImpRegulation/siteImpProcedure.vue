<template>
  <div
    class="dot-step"
    :class="idx + 1 === searchList.evalMthdList.length ? 'pb-0' : 'pb-4'"
    v-for="(item, idx) in searchList.evalMthdList">
    <div class="text-subtitle-4 pb-1">
      {{ evalProc[item.evalProcCd] }}
    </div>
    <v-textarea
      v-model="item.mthd"
      :rules="[required]"
      variant="outlined"
      hide-details="auto"
      rows="2"
      auto-grow />
  </div>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
// 외부 변수 및 함수
// 컴포넌트
// store
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

const siteImpStore = useSiteImpRegulationStore();
const { evalProc, searchList } = storeToRefs(siteImpStore);

// 저장 전 폼 체크할 룰
const required = (val) => {
  return val ? true : "필수 입력 값입니다.";
};
</script>

<style lang="scss" scoped>
.dot-step {
  position: relative;
  padding-left: 24px; /* 점과 내용 사이의 간격 */
}

.dot-step::before {
  content: "";
  position: absolute;
  top: 6px; /* 점의 세로 위치 조정 */
  left: 0;
  width: 14px;
  height: 14px;
  background-color: white; /* 점의 색상 */
  border-radius: 50%; /* 점을 원형으로 만듭니다 */
  border: 4px solid rgb(var(--v-theme-gray200));
}
.dot-step::after {
  content: "";
  position: absolute;
  top: 18px; /* 선의 세로 위치 조정 */
  left: 6px; /* 선의 가로 위치 조정 */
  width: 1px; /* 선의 두께 */
  height: calc(100% - 4px); /* 선의 길이 */
  background-color: rgb(var(--v-theme-gray200)); /* 선의 색상 */
}

.dot-step:last-child::after {
  display: none; /* 첫 번째 요소에는 선이 필요하지 않습니다 */
}
</style>
