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
      :rowData="results"
      @get-grid-api="onGetParams" />
  </v-sheet>
  <pop-add-file
    v-if="isModalOpen"
    @close-modal="isModalOpen = false"
    :files="files" />
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import compButton from "@/components/button/compButton.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import popAddFile from "@/views/safeConfirmDuty/components/popAddFile.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useSafeActionResultStore } from "@/stores/safeConfirmDuty/safe-action-result-store.js";

const safeActionResultStore = useSafeActionResultStore();
const { results } = storeToRefs(safeActionResultStore);
const dialogStore = useDialogStore();

const isModalOpen = ref(false);
const files = ref([]);

/**
 * 조치 결과 컬럼 정의
 */
const columnDefs = [
  {
    headerName: "일자",
    field: "date",
    flex: 1,
    type: ["dateEditor"],
  },
  {
    headerName: "내역",
    field: "details",
    type: ["textEditor", "placeholder"],
    flex: 3,
  },
  {
    headerName: "비고",
    field: "note",
    type: ["textEditor", "placeholder"],
    cellRendererParams: {
      placeholder: "내용을 입력해주세요(선택)",
    },
    flex: 2,
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
  await safeActionResultStore.addRow();
  gridApi.setRowData(results.value);
};

const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await safeActionResultStore.deleteRow(seletedRows);
  // gridApi.setRowData(budgets.value);
};

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  gridApi.setRowData(results.value);
};
</script>

<style lang="scss" scoped></style>
