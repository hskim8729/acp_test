<template>
  <comp-button
    type="add"
    icon="mdi-plus"
    class="mr-2"
    @click="addRow"></comp-button>
  <comp-button
    text="삭제"
    variant="outlined"
    icon="mdi-delete-outline"
    @click="deleteRow"></comp-button>
  <v-sheet height="calc(100% - 32px)">
    <compAgGrid
      type="addDelete"
      :columnDefs="columnDefs"
      :rowData="budgetsDetails"
      :gridOptions="gridOptions"
      @get-grid-api="onGetParams" />
  </v-sheet>
  <pop-add-file
    v-if="isModalOpen"
    @close-modal="isModalOpen = false"
    :files="files" />
</template>

<script setup>
import compButton from "@/components/button/compButton.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import popAddFile from "@/views/safeConfirmDuty/components/popAddFile.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useSafeBudgetStore } from "@/stores/safeConfirmDuty/safe-budget-store.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const safeBudgetStore = useSafeBudgetStore();
const { budgetsDetails } = storeToRefs(safeBudgetStore);
const dialogStore = useDialogStore();

const isModalOpen = ref(false);

const files = ref([]);

/**
 * 예산 집행 내역 컬럼 정의
 */
const columnDefs = [
  {
    headerName: "집행 내역",
    field: "budgetItemNm",
    flex: 2,
    type: ["textEditor", "placeholder"],
  },
  {
    headerName: "금액",
    field: "price",
    cellStyle: { textAlign: "right" },
    flex: 1,
    singleClickEdit: true,
    editable: true,
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
  },

  {
    headerName: "증빙",
    maxWidth: 160,
    minWidth: 160,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: (params) => {
        isModalOpen.value = true;
        files.value = params.data.files;
      },
      btnText: params.data.files.length
        ? `첨부파일 (${params.data.files?.length})`
        : "업로드",
      btnVariant: params.data.files.length ? "text" : "outlined",
      btnIcon: params.data.files.length ? "mdi-paperclip " : "mdi-upload",
    }),
  },
];

const addRow = async () => {
  await safeBudgetStore.addBudgetDetailRow();
  gridApi.setRowData(budgetsDetails.value);
};

const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await safeBudgetStore.deleteBudgetDetailRow(seletedRows);
  // gridApi.setRowData(budgets.value);
};

// 셀 값이 변경될 때 호출될 함수
const onCellValueChanged = async (event) => {
  if (event.colDef.field === "price") {
    handlePriceChange(event); // 가격이 변경되었을 때 함수 실행
  }
};

const handlePriceChange = async (event) => {
  const result = event.newValue - event.oldValue;
  await safeBudgetStore.updateExecutedBudget(result);
};

// gridOptions 설정
const gridOptions = {
  onCellValueChanged: onCellValueChanged, // 이벤트 핸들러 등록
};

/**
 * 포맷터 함수: 금액 형식으로 변환
 * @param {*} value
 */
function formatCurrency(value) {
  if (value == null || value === "") return 0 + "원";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  gridApi.setRowData(budgetsDetails.value);
};
</script>

<style lang="scss" scoped></style>
