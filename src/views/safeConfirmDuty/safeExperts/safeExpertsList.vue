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
      :rowData="expertsList"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      @get-grid-api="onGetParams" />
  </v-sheet>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
// 스토어
import { useDialogStore } from "@/stores/common/dialog-store";
import { useSafeExpertsStore } from "@/stores/safeConfirmDuty/safe-experts-store.js";

const safeExpertsStore = useSafeExpertsStore();
const dialogStore = useDialogStore();

// 전문가 목록 데이터 불러오기
const { expertsList, selectedExpert } = storeToRefs(safeExpertsStore);

const selectedName = computed(() => selectedExpert.value?.name);
watch(selectedName, () => {
  gridApi.refreshCells({ force: true });
});

/**
 * 전문가 목록 컬럼 정의
 */
const columnDefs = [
  {
    headerName: "이름",
    field: "name",
    flex: 10,
    type: ["textEditor", "placeholder"],
    cellClassRules: {
      "text-subtitle-6": (params) =>
        params.data.id === selectedExpert.value?.id,
    },
    onCellClicked: (params) => {
      openDetailTable(params);
    },
  },
  {
    headerName: "정보입력",
    field: "button",
    minWidth: 100,
    maxWidth: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: (params) => {
        openDetailTable(params);
      },
      btnText: "등록",
    }),
  },
];

const openDetailTable = (params) => {
  selectedExpert.value = params.data; // store 내 watch가 변경되면 detail 불러옴
  params.node.setSelected(true, true); // 선택 상태 true, 선택 초기화 true
  params.api.refreshCells({ force: true });
};

const addRow = async () => {
  const newId = await safeExpertsStore.addRow("expert");
  gridApi.setRowData(expertsList.value);

  const newRowNode = await gridApi.getRowNode(newId);
  if (newRowNode) {
    newRowNode.setSelected(true, true); // 새로 추가된 행을 선택 상태로 설정
    gridApi.refreshCells({ force: true });
    // openDetailTable({ data: empty, node: newRowNode, api: gridApi }); // 새로 추가된 행의 세부 정보 열기
  }
};

const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await safeExpertsStore.deleteRow(seletedRows, "expert");
  // gridApi.setRowData(expertsList.value);
};

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  gridApi.setRowData(expertsList.value);
};

const gridOptions = {
  getRowId: (params) => params.data.id, // ID 필드 설정
};
</script>

<style lang="scss" scoped></style>
