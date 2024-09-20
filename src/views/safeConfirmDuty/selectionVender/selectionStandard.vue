<template>
  <compPageCard isFillPage>
    <comp-add-delete-grid :columnDefs="columnDefs" :rowData="standardList" />
  </compPageCard>
</template>

<script setup>
import { ref, onMounted } from "vue";

import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import compPageCard from "@/components/layout/compPageCard.vue";

const gridOptions = {
  getRowId: (params) => params.data.budgetCtgryId, // ID 필드 설정
  pinnedBottomRowData: [
    {
      budgetCtgryId: "sum",
      budgetCtgryNm: "합계",
      allocatedBudget: 0,
      executedBudget: 0,
    },
  ],
};
const columnDefs = [
  {
    headerName: "평가항목",
    field: "col1",
    singleClickEdit: true,
    flex: 2,
    editable: true,
    cellStyle: { fontFamily: "Pretendard-B" },
  },
  {
    headerName: "평가기준",
    field: "col2",
    singleClickEdit: true,
    flex: 6,
    editable: true,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "배점",
    field: "col3",
    flex: 1,
    editable: true,
    type: "numericColumn",
  },
  {
    headerName: "점수",
    field: "col4",
    flex: 1,
    editable: true,
    type: "numericColumn",
  },
];

const standardList = ref([
  {
    col1: "리더십",
    col2: "- 경영방침, 인력·시설·장비 등 자원 배정의 적정성 등",
    col3: 20,
    col4: null,
  },
  {
    col1: "근로자 참여",
    col2: "- 종사자 의견수렴 절차 및 이행 적정성",
    col3: 10,
    col4: null,
  },
  {
    col1: "위험성평가",
    col2: "- 위험요인 파악 및 개선절차 및 수준의 적정성",
    col3: 20,
    col4: null,
  },
  {
    col1: "비상조치계획",
    col2: "- 비상조치계획 적정성",
    col3: 20,
    col4: null,
  },
  {
    col1: "안전보건교육",
    col2: "- 안전보건교육 실시 적정성",
    col3: 10,
    col4: null,
  },
  {
    col1: "재해발생",
    col2: "- 최근 3년간 산업재해 발생 현황",
    col3: 20,
    col4: null,
  },
]);
</script>

<style></style>
