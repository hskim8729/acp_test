<!-- 시스템/권한관리/팝업-사용자등록 -->
<template>
  <comp-modal
    modalTitle="직원 조회"
    @close="popInPopClose"
    @modal-action="selectedUser"
    actionBtnText="선택"
    maxModalWidth="50%"
    modalWidth="50%"
    height="500px"
    isActions>
    <div class="content_box">
      <div class="item_wrap w50p">
        <span for="vendrNm" class="title">사용자명</span>
        <input type="text" v-model="userNm" />
      </div>
      <button class="search" @click="onSearch">조회</button>
    </div>
    <div class="grid_default3" id="grid02">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :gridOptions="gridOptions2"
        :rowData="gridRowData2">
      </ag-grid-vue>
    </div>
  </comp-modal>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { defineEmits, onMounted, ref } from "vue";

import compModal from "@/components/modal/compModal.vue";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";

const gridRowData2 = ref([]);
const gridApi = ref();

const emit = defineEmits(["userInfo"]);

const loginStore = useLoginAuthStore();
const store = useMajorStore();
const vendrCd = loginStore.$state.siteInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
const userNm = ref("");

const onGridReady = async (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs2 = [
  {
    headerName: "회사명",
    field: "vendrNm",
    width: 150,
    checkboxSelection: true,
  },
  { headerName: "사용자명", field: "userNm", width: 80 },
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
  emit("close");

  gridOptions2.api.setRowData(gridRowData2.value);
};

const selectedUser = () => {
  const getRow = gridOptions2.api.getSelectedRows()[0];
  console.log("getRow : " + JSON.stringify(getRow));
  emit("userInfo", getRow);
  popInPopClose();
};

onMounted(() => {
  onSearch();
});

// 조회
async function onSearch() {
  const params = {
    userNm: userNm.value,
    vendrCd: vendrCd,
    siteCd: siteCd,
  };

  //사용자 조회
  const userInfoList = await store.selectPntActDsctnEmpInfoList(params);
  if (userInfoList) {
    gridRowData2.value = userInfoList;
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}
</script>

<style scoped>
#grid02 {
  height: calc(100% - 100px);
}

.search_user {
  width: 70%;
  height: 600px;
}
</style>
