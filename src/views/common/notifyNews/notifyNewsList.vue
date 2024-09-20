<template>
  <div class="subtitle_area">
    <span class="title">{{
      bbsClsCd === "T2308" ? "공지사항" : "홍보자료"
    }}</span>
    <div class="right_btn">
      <select v-model="searchCategory">
        <option value="ttl">제목</option>
        <option value="cntn">내용</option>
      </select>
      <input
        type="text"
        v-model="searchText"
        @keyup.enter.prevent="searchList(bbsClsCd)" />
      <button @click="searchList(bbsClsCd)">조회</button>
    </div>
  </div>
  <div class="grid_default" id="grid01">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :headerHeight="35"
      :rowHeight="53"
      :columnDefs="columnDefs1"
      :rowData="grid1RowData"
      :defaultColDef="defaultColDef"
      :singleClickEdit="true"
      :undoRedoCellEditing="true"
      :undoRedoCellEditingLimit="20"
      :localeText="localeText"
      :stopEditingWhenCellsLoseFocus="true"
      :gridOptions="grid2Options">
    </ag-grid-vue>
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits, defineProps, watch } from "vue";
import { useBoardStore } from "../../../stores/board/board_store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

const searchCategory = ref("ttl");
const searchText = ref();
const boardStore = useBoardStore();

const { bbsClsCd } = defineProps(["bbsClsCd"]);

const grid1RowData = ref([]);
const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs1 = [
  {
    headerName: "No",
    field: "rowNum",
    width: 100,
    maxWidth: 100,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "제목",
    field: "ttl",
    width: 1000,
    maxWidth: 1500,
    filter: false,
    editable: false,
    cellStyle: { cursor: "pointer" },
  },
  {
    headerName: "작성일",
    field: "regDate",
    cellStyle: { textAlign: "center" },
    width: 150,
    maxWidth: 150,
    filter: true,
    headerClass: "ag-right-header",
    cellEditor: "agDateStringCellEditor",
    cellEditorParams: {
      min: "2000-01-01",
    },
  },
  {
    headerName: "첨부파일",
    field: "file",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      if (params.data.atchFileKey) {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<p class="file_no_cursor"></p>';
        return eDiv;
      }
    },
  },
  {
    headerName: "조회수",
    field: "inqNum",
    width: 100,
    maxWidth: 100,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
];

const defaultColDef = {
  editable: false,
  sortable: false,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const grid2Options = {
  headerHeight: 40,
  rowHeight: 53,
  pagination: true,
  paginationPageSize: 10,
  onRowClicked: (param) => selectRow(param),
};

const emit = defineEmits(["changeDetail"]);

const searchList = async (clsCd) => {
  // props를 이중으로 감싸서 받으니 제대로 바인딩 되지 않아서 파라미터로 직접 받음
  const vendrCd = "0000";
  const siteCd = "00000";

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    [searchCategory.value]: searchText.value,
    bbsClsCd: clsCd,
  };

  const boardList = await boardStore.getNotifyNewsList(param);
  grid1RowData.value = boardList;
};

const selectRow = (params) => {
  emit("changeDetail", params);
};

const selectCategory = (clsCd) => {
  searchList(clsCd);
};

onMounted(() => {
  searchList(bbsClsCd);
});

defineExpose({
  selectCategory,
});
</script>

<style scoped>
.notify_news_list {
  height: 100%;
}
.grid_default {
  height: calc(100% - 25px);
}
.right_btn input,
.right_btn select {
  height: 30px;
  margin-left: 5px;
}
.grid_default .file_no_cursor {
  cursor: default;
  background-image: url(/src/assets/img/file_icon.png);
}
</style>
