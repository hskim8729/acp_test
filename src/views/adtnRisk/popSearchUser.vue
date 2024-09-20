<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="pop_in_pop search_user">
    <div class="popup_title">
      <span>직원 조회</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_default3" id="grid02">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions2"
          :rowData="gridRowData2">
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="selectedUser">선택</button>
      <button @click="popInPopClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { defineEmits, onBeforeMount, ref } from "vue";

const adtnStore = useAdtnRiskStore();
const gridRowData2 = ref([]);
const gridApi = ref();

const emit = defineEmits(["userInfo"]);

const loginStore = useLoginAuthStore();
const vendrCd = loginStore.$state.siteInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;

const onGridReady = async (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs2 = [
  {
    headerName: "사용자ID",
    field: "userId",
    width: 150,
    checkboxSelection: true,
  },
  { headerName: "사용자명", field: "userNm", width: 80 },
  { headerName: "업체명", field: "vendrNm", width: 80 },
  { headerName: "직위명", field: "workNm", width: 100 },
  { headerName: "휴대전화", field: "crryTelNo", width: 100 },
];

const defaultColDef2 = {
  editable: false,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
  cellStyle: { textAlign: "center" },
};

const gridOptions2 = {
  headerHeight: 40,
  rowHeight: 53,
  defaultColDef: defaultColDef2,
  columnDefs: columnDefs2,
  singleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  onGridReady: onGridReady,
};

const popInPopClose = () => {
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  document.getElementsByClassName("search_user")[0].classList.remove("show");

  gridOptions2.api.setRowData(gridRowData2.value);
};

const selectedUser = (params) => {
  const getRow = gridOptions2.api.getSelectedRows()[0];
  console.log("getRow : " + JSON.stringify(getRow));
  emit("userInfo", getRow);
  popInPopClose();
};

const searchUserList = async () => {
  //사용자 조회
  const userInfoList = await adtnStore.selectSiteOverviewUserInfoList({
    vendrCd: vendrCd,
    siteCd: siteCd,
  });
  gridRowData2.value = userInfoList;
};

onBeforeMount(() => {
  searchUserList();
});
</script>

<style scoped>
#grid02 {
  height: calc(100%);
}

.search_user {
  width: 95%;
  height: 400px;
}
</style>
