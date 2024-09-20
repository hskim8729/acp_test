<template>
  <compPageCard isFillPage>
    <comp-add-delete-grid :columnDefs="columnDefs" :rowData="processList" />
  </compPageCard>
</template>

<script setup>
import { ref, onMounted } from "vue";

import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import compPageCard from "@/components/layout/compPageCard.vue";

const columnDefs = [
  {
    headerName: "순서",
    field: "col1",
    flex: 1,
    cellRenderer: (params) => params.node.rowIndex + 1,
  },
  {
    headerName: "내용",
    field: "col2",
    singleClickEdit: true,
    cellEditor: "agLargeTextCellEditor",
    cellStyle: { textAlign: "left" },
    flex: 9,
    editable: true,
  },
];

const processList = ref([
  {
    col1: "",
    col2: `입찰단계에서 산재예방 조치 능력·기술 평가 기준 제시 \n예) 위험성평가 실행 여부, 안전보건교육 실시 여부, 비상 대응 매뉴얼 마련 여부 등`,
  },
  {
    col1: "",
    col2: `하청업체 평가`,
  },
  {
    col1: "",
    col2: `평가기준에 적격한 업체와 계약`,
  },
  {
    col1: "",
    col2: `원하청 안전보건활동 실시 \n예) 위험성평가 실시, 합동 순회점검 실시, 안전보건 정보 제공 등`,
  },
  {
    col1: "",
    col2: `주기적으로 하청업체 안전보건 수준 재평가 및 반영 \n예)재평가 결과 안전보건 수준이 미흡한 업체와는 재계약X`,
  },
]);
</script>

<style></style>
