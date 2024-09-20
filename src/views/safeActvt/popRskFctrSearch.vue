<!-- 안전활동 -> TBM 등록 -> 위험요인 추가 팝업-->
<template>
  <div class="popup add_rsk_fctr popup_bg show">
    <div class="popup_title">
      <span>위험요인 검색</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>

    <div class="popup_content">
      <div class="content_box">
        <div class="item_wrap">
          <span class="title">작업 명</span>
          <input
            type="text"
            class="w300"
            id="inputWrkNm"
            @keyup.enter="searchList" />
          <button @click="searchList">검색</button>
        </div>
        <span class="top_notice"
          >Shift를 누른 상태에서 클릭하면 여러행 선택이 가능합니다.</span
        >
      </div>

      <div class="grid_default2" id="grid02">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions2"
          :rowData="gridRowData2">
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="selectRskFctr">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>
<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { onMounted, reactive, ref } from "vue";

const emit = defineEmits(["rskFctr", "close"]);
const props = defineProps(["isPopRskFatr"]);

const gridRowData2 = ref([]);
const gridApi = ref();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const loginAuthStore = useLoginAuthStore();

const onGridReady = async (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs2 = [
  {
    headerName: "공종",
    field: "contyCdNm",
    width: 100,
    maxWidth: 100,
    checkboxSelection: true,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "작업 명",
    field: "wrkNm",
    wrapText: true,
    autoHeight: true,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    wrapText: true,
    autoHeight: true,
    cellStyle: { textAlign: "left" },
    cellRenderer: (params) => {
      return params.value.replaceAll("\n", "<br/>");
    },
  },
  {
    headerName: "대책",
    field: "rskMsr",
    wrapText: true,
    autoHeight: true,
    cellStyle: { textAlign: "left" },
    cellRenderer: (params) => {
      return params.value.replaceAll("\n", "<br/>");
    },
  },
  {
    headerName: "중점/일상",
    field: "pntInsp",
    width: 100,
    maxWidth: 100,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "위험도",
    field: "risk",
    width: 100,
    maxWidth: 100,
    cellStyle: { textAlign: "center" },
  },
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
  cellStyle: { textAlign: "left" },
  wrapText: true,
  autoHeight: true,
};

const gridOptions2 = {
  headerHeight: 40,
  rowHeight: 53,
  defaultColDef: defaultColDef2,
  columnDefs: columnDefs2,
  singleClickEdit: false,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "multiple",
  onGridReady: onGridReady,
  rowMultiSelectWithClick: true,
};

const popupClose = () => {
  gridOptions2.api.deselectAll();
  emit("close");
};

// 위험요소 조회 함수
const searchList = async () => {
  // 본사 및 현장 구분
  let division = "";
  const authCd = loginAuthStore.$state.authInfo.authCd;
  if (authCd == "2000" || authCd == "3000" || authCd == "4000") {
    division = "true";
  } else {
    division = "";
  }

  const vendrCd = loginAuthStore.$state.siteInfo.vendrCd;
  const siteCd = loginAuthStore.$state.siteInfo.siteCd;
  const userId = loginAuthStore.$state.userInfo.userId;
  const psitnVendrCd = loginAuthStore.$state.userInfo.vendrCd;
  const wrkNm = document.getElementById("inputWrkNm").value;
  const param = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    psitnVendrCd: psitnVendrCd,
    division: division,
  });
  if (wrkNm != "") {
    param.wrkNm = wrkNm;
  } else {
    param.wrkNm = "";
  }

  const searchList = await toolBoxRegiStore.searchRskFctr(param);
  gridRowData2.value = searchList;
};

const selectRskFctr = () => {
  const getRow = gridOptions2.api.getSelectedRows();
  emit("rskFctr", getRow);
  popupClose();
};

onMounted(() => {
  searchList();
});
</script>

<style scope>
#grid02 {
  height: calc(100% - 90px);
}
.add_rsk_fctr {
  width: 80%;
  height: 800px;
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.top_notice {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #888888;
}
</style>
