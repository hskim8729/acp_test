<template>
  <compPageCard isFillPage>
    <comp-add-delete-grid
      :columnDefs="columnDefs"
      :rowData="safeEvalItemList"
      :empty-data="emptyData" />
  </compPageCard>
</template>

<script setup>
import { ref } from "vue";

import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import compPageCard from "@/components/layout/compPageCard.vue";

const columnDefs = [
  {
    headerName: "평가 항목",
    field: "safeEvalItemNm",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 4,
    editable: true,
  },
  {
    headerName: "평가 기준",
    field: "safeEvalStandard",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 4,
    editable: true,
  },
  {
    headerName: "배점",
    field: "point",
  },
];

const safeEvalItemList = ref([
  {
    safeEvalId: 0,
    safeEvalItemSeq: 1,
    safeEvalItemNm:
      "작업장 안전관리 점검 평가(기계·기구·설비, 정리정돈 통로확보 등)",
    safeEvalStandard: "양호 : 법령에 따른 업보를 적정하게 수행함",
    jbttlCd: "T0101",
    point: 10,
  },
  {
    safeEvalId: 0,
    safeEvalItemSeq: 1,
    safeEvalItemNm: "산업재해 재발방지 조치",
    safeEvalStandard: "경영방침에 부합한 산업재해 예방계획이 수립되었는지",
    jbttlCd: "T0101",
    point: 10,
  },
]);

const emptyData = {
  safeEvalItemNm: "항목을 입력해주세요",
  safeEvalStandard: "기준을 입력해주세요",
  point: 0,
};
</script>

<style></style>
