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
      :rowData="budgets"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      @get-grid-api="onGetParams" />
  </v-sheet>
</template>

<script setup>
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
// import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useSafeBudgetStore } from "@/stores/safeConfirmDuty/safe-budget-store.js";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";

const safeBudgetStore = useSafeBudgetStore();
const dialogStore = useDialogStore();

// 예산 데이터 불러오기
await safeBudgetStore.getBudgets();
const { budgets, selectedBudgetId } = storeToRefs(safeBudgetStore);

const sum = computed(() => {
  let allocatedTotal = 0;
  let executedTotal = 0;

  budgets.value.forEach((item) => {
    allocatedTotal += item.allocatedBudget || 0;
    executedTotal += item.executedBudget || 0;
  });

  return {
    allocatedTotal,
    executedTotal,
  };
});

/**
 * 연도별 예산 컬럼 정의
 */
const columnDefs = [
  {
    headerName: "예산 항목",
    field: "budgetCtgryNm",
    type: ["textEditor", "pinnedBottom", "placeholder"],
    flex: 2,
    cellClassRules: {
      "text-subtitle-6": (params) =>
        params.data.budgetCtgryId === selectedBudgetId.value,
    },
  },
  {
    headerName: "편성금액",
    field: "allocatedBudget",
    type: ["editable", "pinnedBottom"],
    cellStyle: { textAlign: "right" },
    flex: 1,
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
    cellClassRules: {
      "text-subtitle-6": (params) =>
        params.data.budgetCtgryId === selectedBudgetId.value,
    },
  },
  {
    headerName: "집행금액",
    field: "executedBudget",
    cellStyle: (params) => ({
      textAlign: "right",
      cursor: params.node.isRowPinned() ? "default" : "pointer",
    }),
    onCellClicked: (params) => {
      if (!params.node.isRowPinned()) {
        openDetailTable(params);
      }
    },
    flex: 1,
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
    cellClassRules: {
      "text-subtitle-6": (params) =>
        params.data.budgetCtgryId === selectedBudgetId.value,
    },
  },
  {
    headerName: "잔액",
    field: "balance",
    flex: 1,
    cellStyle: (params) => ({
      textAlign: "right",
      cursor: params.node.isRowPinned() ? "default" : "pointer",
    }),
    onCellClicked: (params) => {
      if (!params.node.isRowPinned()) {
        openDetailTable(params);
      }
    },
    valueGetter: (params) => {
      return params.data.allocatedBudget - (params.data.executedBudget || 0);
    },
    valueFormatter: (params) => {
      return formatCurrency(params.value);
    },
    cellClassRules: {
      "text-subtitle-6": (params) =>
        params.data.budgetCtgryId === selectedBudgetId.value,
    },
  },
  {
    headerName: "집행내역",
    field: "button",
    minWidth: 100,
    maxWidth: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: (params) => {
        openDetailTable(params);
      },
      btnText: "등록",
      visible: params.data.budgetCtgryId !== "sum",
    }),
  },
];

const openDetailTable = (params) => {
  const id = params.data.budgetCtgryId;
  selectedBudgetId.value = id; // store 내 watch가 변경되면 detail 불러옴
  params.node.setSelected(true, true); // 선택 상태 true, 선택 초기화 true
  params.api.refreshCells({ force: true });
};

const addRow = async () => {
  await safeBudgetStore.addBudgetRow();
  gridApi.setRowData(budgets.value);
};

const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await safeBudgetStore.deleteBudgetRow(seletedRows);
  gridApi.setRowData(budgets.value);
};

// 포맷터 함수: 금액 형식으로 변환
function formatCurrency(value) {
  if (!value) return 0 + "원";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  gridApi.setRowData(budgets.value);
  setPinnedBottomData(sum.value);
  safeBudgetStore.getBudgetGridApi(gridApi);
};

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

// 합계가 변경될 때마다 pinnedBottomRowData 업데이트
watch(sum, (newSum) => {
  if (newSum) setPinnedBottomData(newSum);
});

// pinnedBottomRowData 업데이트
function setPinnedBottomData(computedSum) {
  const newData = {
    budgetCtgryId: "sum",
    budgetCtgryNm: "합계",
    allocatedBudget: computedSum.allocatedTotal,
    executedBudget: computedSum.executedTotal,
  };
  const node = gridApi.getPinnedBottomRow(0);
  node.updateData(newData);
}
</script>

<style lang="scss" scoped></style>
