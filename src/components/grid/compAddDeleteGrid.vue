<template>
  <slot v-if="!noButton">
    <comp-button type="add" icon="mdi-plus" @click="onAddRow" class="mr-2" />
    <comp-button
      text="삭제"
      variant="outlined"
      icon="mdi-delete-outline"
      @click="onDeleteRow" />
  </slot>
  <slot name="buttons"></slot>
  <v-sheet :height="gridHeight">
    <compAgGrid
      :columnDefs="columnDefs"
      :rowData="rows"
      :gridOptions="gridOptions"
      @get-grid-api="onGetParams" />
  </v-sheet>
</template>

<script setup>
// 모듈
import { ref } from "vue";
// 스토어
import { useDialogStore } from "@/stores/common/dialog-store";
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";

const dialogStore = useDialogStore();

const props = defineProps({
  gridHeight: {
    type: String,
    default: "calc(100% - 40px)",
  },
  rowData: {
    type: Array,
    default: [],
  },
  columnDefs: {
    type: Array,
    default: [
      {
        headerName: "예산 항목",
        field: "bugetCtgyNm",
        singleClickEdit: true,
        flex: 2,
        editable: true,
      },
    ],
  },
  emptyData: {
    type: Object,
    default: {
      bugetCtgyNm: "수정하기",
    },
  },
  noButton: {
    type: Boolean,
    default: false,
  },
});

const gridOptions = {
  rowSelection: "multiple", // 다중 선택
  rowMultiSelectWithClick: false, // 행 선택으로 체크박스 선택 막음
  suppressRowClickSelection: true, // 체크박스 눌러야만클릭되게 함
};

/**
 * 데이터 컬럼 정의에 기본으로 체크박스
 */
const columnDefs = [
  {
    headerName: "",
    field: "check",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    cellStyle: { textAlign: "center", whiteSpace: "normal" },
    editable: false,
    sortable: false,
    resizable: false,
    minWidth: 48,
    maxWidth: 48,
  },
  ...props.columnDefs,
];

const emit = defineEmits(["onGetParams"]);

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  emit("onGetParams", params);
};

const rows = ref([]);
rows.value = props.rowData.map((item, index) => ({
  ...item,
  originalIndex: index, // 추후 삭제를위해 originalIndex 추가
}));

const onAddRow = () => {
  rows.value.push({ ...props.emptyData, originalIndex: rows.value.length });
  gridApi.setRowData(rows.value);
};

const onDeleteRow = () => {
  const selected = gridApi.getSelectedNodes();
  if (!selected.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  // Set을 사용하여 선택된 행의 originalIndex 값을 수집
  const selectedIndices = new Set(
    selected.map((node) => node.data.originalIndex)
  );
  // filter를 통해 원본 배열에서 선택된 항목을 제거
  rows.value = rows.value.filter(
    (row) => !selectedIndices.has(row.originalIndex)
  );
  // 업데이트된 rows 배열을 그리드에 반영
  gridApi.setRowData(rows.value);
};
</script>

<style lang="scss" scoped></style>
