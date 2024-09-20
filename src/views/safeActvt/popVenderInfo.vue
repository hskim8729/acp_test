<!-- 안전활동 -> TBM 등록 -> 소속회사 팝업-->
<template>
  <div class="popup add_vender_info">
    <div class="popup_title">
      <span>소속회사</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_default" id="grid03">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions2"
          :rowData="gridRowData2"
        >
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="selectVender">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const gridRowData2 = ref([]);
const gridApi = ref();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const loginAuthStore = useLoginAuthStore();
const emit = defineEmits(["vender"]);

const onGridReady = async (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs2 = [
  {
    headerName: "회사명",
    field: "vendrNm",
    width: 60,
    checkboxSelection: true,
  },
  { headerName: "회사명 코드", field: "vendrId", hide: true },
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

const popupClose = () => {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document
    .getElementsByClassName("popup add_vender_info")[0]
    .classList.remove("show");
};
const selectVender = () => {
  const getRow = gridOptions2.api.getSelectedRows()[0];
  console.log("getRow : " + JSON.stringify(getRow));
  emit("vender", getRow);
  popupClose();
};

onMounted(async () => {
  const vendrCd = loginAuthStore.$state.siteInfo.vendrCd;
  const param = reactive({ vendrCd: vendrCd });
  const venderInfo = await toolBoxRegiStore.searchVenderInfo(param);
  gridRowData2.value = venderInfo;
});
</script>

<style scope>
#grid03 {
  height: calc(100%);
}
.add_vender_info {
  width: 400px;
  height: 500px;
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
</style>
