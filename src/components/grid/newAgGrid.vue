<template>
  <ag-grid-vue
    style="width: 100%; height: 100%"
    class="ag-theme-plan2do"
    :rowData="rowData"
    :gridOptions="options"
    @row-clicked="onRowClicked"
    @grid-ready="onGridReady">
  </ag-grid-vue>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { computed, watch } from "vue";

const emit = defineEmits(["rowClicked", "getGridApi"]);

/**
 * 프롭으로 데이터 받고 해당 데이터를 그리드 렌더링하기 전에 넣어줌
 */
const props = defineProps({
  headerHeight: {
    type: Number,
    default: 40,
  },
  rowHeight: {
    type: Number,
    default: 53,
  },
  defaultColDef: {
    type: Object,
    default: {
      editable: false,
      sortable: true,
      minWidth: 80,
      filter: false,
      resizable: true,
      headerClass: "centered",
      cellClass: "centered",
      cellStyle: { textAlign: "center", whiteSpace: "pre-wrap" },
      wrapText: true,
      autoHeight: true,
    },
  },
  singleClickEdit: {
    type: Boolean,
    default: false,
  },
  undoRedoCellEditing: {
    type: Boolean,
    default: true,
  },
  undoRedoCellEditingLimit: {
    type: Number,
    default: 20,
  },
  localeText: {
    type: Object,
    default: { noRowsToShow: "조회 결과가 없습니다." },
  },
  stopEditingWhenCellsLoseFocus: {
    type: Boolean,
    default: true,
  },
  rowData: {
    type: Array,
    default: [],
  },
  columnDefs: {
    type: Array,
    default: [
      {
        headerName: "고정",
        field: "fix",
        width: 200,
        // rowSelection 따라 변경
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
      },
      {
        headerName: "예시1",
        field: "ex1",
        flex: 1,
        minWidth: 200,
        maxWidth: 850,
      },
      {
        headerName: "예시2",
        field: "ex2",
        flex: 2,
        minWidth: 200,
        maxWidth: 850,
        filter: "agSetColumnFilter",
      },
    ],
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  paginationPageSize: {
    type: Number,
    default: 10,
  },
  rowSelection: {
    type: String,
    default: "",
    validator: (propValue) => {
      // 정의된 값만 넘겨줘야함
      return ["", "single", "multiple"].includes(propValue);
    },
  },
  gridOptions: {
    type: Object,
    default: {},
  },
  type: {
    type: String,
    default: "",
  },
});

const defaultGridOptions = {
  headerHeight: props.headerHeight,
  rowHeight: props.rowHeight,
  defaultColDef: props.defaultColDef,
  singleClickEdit: props.singleClickEdit,
  undoRedoCellEditing: props.undoRedoCellEditing,
  undoRedoCellEditingLimit: props.undoRedoCellEditingLimit,
  stopEditingWhenCellsLoseFocus: props.stopEditingWhenCellsLoseFocus,
  localeText: props.localeText,
  pagination: props.pagination,
  paginationPageSize: props.paginationPageSize,
  rowSelection: props.rowSelection,
  rowMultiSelectWithClick: true, // 클릭으로 row 다중 선택
  // columnDefs: props.columnDefs,
  // ...props.gridOptions,
};

const options = computed(() => {
  switch (props.type) {
    case "addDelete":
      return {
        ...defaultGridOptions,
        rowSelection: "multiple", // 다중 선택
        rowMultiSelectWithClick: false, // 행 선택으로 체크박스 선택 막음
        suppressRowClickSelection: true, // 체크박스 눌러야만클릭되게 함
        columnDefs: [
          // 첫 컬럼에 체크박스
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
        ],
        ...props.gridOptions,
      };

    default:
      return {
        ...defaultGridOptions,
        columnDefs: props.columnDefs,
        ...props.gridOptions,
      };
  }
});

// const selectGridOptions = {
//   rowSelection: props.rowSelection,
//   rowMultiSelectWithClick: true, // 클릭으로 row 다중 선택
// };

/**
 * Grid LifeCycle에서 grid reday 시점에 원하는 함수 사용 가능
 */
let gridParams;
let gridApi = null;
const onGridReady = (params) => {
  gridApi = params.api;
  gridParams = params;
  emit("getGridApi", gridParams);
};

/**
 * 행 클릭시 작동할 함수 설정
 * @param {*} row
 */
const onRowClicked = (row) => {
  emit("rowClicked", row);
};

watch(
  () => props.rowData,
  (newVal) => {
    if (gridApi) {
      gridApi.setRowData(newVal);
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
