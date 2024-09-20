<template>
  <comp-button
    text="결재현황 보기"
    size="large"
    class="appr_status"
    @click="openModal"
    v-if="props.apprStatusHistList.length > 0">
  </comp-button>
  <comp-modal
    v-if="isModalOpen"
    @close="closeModal"
    modal-title="결재 현황"
    height="400px"
    max-width="1300px">
    <template #default>
      <comp-ag-grid
        :rowData="props.apprStatusHistList"
        :columnDefs="columnDefs">
      </comp-ag-grid>
    </template>
  </comp-modal>
</template>

<script setup>
import dayjs from "dayjs";
import { ref } from "vue";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compModal from "@/components/modal/compModal.vue";

const props = defineProps({
  apprStatusHistList: {
    type: Object,
    default: null,
  },
});

/**
 * compModal 열고 닫기
 */
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

/**
 * 결재 현황 컬럼 정의
 */
const columnDefs = [
  {
    headerName: "순번",
    maxWidth: 80,
    cellStyle: { textAlign: "center" },
    valueGetter: (params) => params.node.rowIndex + 1,
  },
  {
    headerName: "구분",
    field: "statsNm",
    maxWidth: 80,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "성명",
    field: "userNm",
    minWidth: 120,
    maxWidth: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "직위",
    field: "workNm",
    minWidth: 100,
    maxWidth: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "소속",
    field: "vendrNm",
    minWidth: 180,
    maxWidth: 400,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "직책",
    field: "jbttlNm",
    minWidth: 100,
    maxWidth: 200,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "승인/반려의견",
    field: "apprOpnn",
    flex: 1,
    minWidth: 180,
    maxWidth: 400,
  },
  {
    headerName: "처리일시",
    field: "rstDate",
    minWidth: 200,
    maxWidth: 850,
    cellRenderer: (params) => {
      if (params.value) {
        return dayjs(params.value).format("YYYY-MM-DD HH:mm:ss");
      }
      return "";
    },
    cellStyle: { textAlign: "center" },
  },
];
</script>

<style scoped></style>
