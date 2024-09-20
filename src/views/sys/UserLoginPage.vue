<!-- 시스템/사용자 로그인 -->

<template>
  <div class="page_title_area">
    <div class="title">사용자 로그인</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 시스템 > 사용자 로그인
    </nav>
  </div>

  <div class="page_content_area">
    <div class="content_box">
      <div class="item_wrap w25p">
        <span for="vendrNm" class="title">회사명</span>
        <input type="text" v-model="vendrNm" @keypress.enter="onSearchGrid1" />
      </div>
      <div class="item_wrap w25p">
        <span for="userId" class="title">사용자 ID</span>
        <input type="text" v-model="userId" @keypress.enter="onSearchGrid1" />
      </div>

      <div class="item_wrap w25p">
        <span for="userNm" class="title">사용자 명</span>
        <input type="text" v-model="userNm" @keypress.enter="onSearchGrid1" />
      </div>

      <button
        class="search"
        @click="onSearchGrid1"
        @keypress.enter="onSearchGrid1">
        조회
      </button>
    </div>

    <div class="subtitle_area">
      <div class="title">사용자 리스트</div>
    </div>
    <div class="grid_default">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :rowData="grid1RowData"
        :gridOptions="grid1Options">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
export default {
  name: "PartnerMgmtPage",
};
</script>

<script setup>
import { usePartnerMgmtStore } from "@/stores/sys/partner-mgmt-store";
import partnerMgmtService from "@/api/services/sys/partner-mgmt-service";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
//import loginAuthService from "@/api/common/login-auth-service";

import commonUtil from "@/utils/common-utils";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeUpdate, onBeforeMount } from "vue";

const grid1Api = ref();
const grid1RowData = ref([]);

var grid1OriginRowData = reactive([]);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const store = usePartnerMgmtStore();
const loginStore = useLoginAuthStore();
//const loginService = loginAuthService();

const cUtil = commonUtil;

const grid1ColumnApi = ref(null);

//검색조건
var vendrParams = ref({});
const vendrNm = ref("");
const userId = ref("");
const userNm = ref("");
const busNo = ref("");

//신규 저장
const vendrCd = loginStore.$state.userInfo.vendrCd;
const vendrUpperCd = loginStore.$state.userInfo.vendrUpperCd;
const storeUserId = loginStore.$state.userInfo.userId;
let validBusNo = ref(false);

var preBusNo = ref();

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const columnDefs1 = [
  {
    headerName: "회사명",
    field: "vendrNm",
    filter: false,
    cellStyle: { textAlign: "left" },
    editable: false,
    width: 500,
    maxWidth: 800,
  },
  {
    headerName: "사용자 ID",
    field: "userId",
    filter: false,
    cellStyle: { textAlign: "left" },
    editable: false,
    width: 500,
    maxWidth: 800,
  },
  {
    headerName: "사용자 명",
    field: "userNm",
    filter: true,
    cellStyle: { textAlign: "left" },
    editable: false,
    width: 500,
    maxWidth: 800,
  },
  {
    headerName: "",
    field: "detailBtn",
    filter: false,
    cellStyle: { textAlign: "left" },
    editable: false,
    width: 100,
    maxWidth: 150,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="cell_btn">로그인</button>';
      const eButton = eDiv.querySelectorAll(".cell_btn")[0];
      eButton.onclick = function () {
        fn_userLogin(params);
      };

      return eDiv;
    },
  },
];

const grid1Options = {
  headerHeight: 40,
  rowHeight: 53,
  columnDefs: columnDefs1,
  rowData: grid1RowData.value,
  defaultColDef: defaultColDef,
  //doubleClickEdit: true,
  onRowDoubleClicked: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "multiple",
  onGridReady: onGridReady1,
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}
function lookupValue(mappings, key) {
  return mappings[key];
}

// 자동 로그인
function fn_userLogin(params) {
  /**
   ***** 자동 로그인 순서 *****
   *
   *  1. 존재하는 로컬스토리지 한번 지우고
   *  2. 로그인 선택한 사용자 로컬스토리지 값 셋팅
   *  3. 로그아웃
   *  4. 로그인 페이지 이동
   *  5. 로그인 후
   *  6. 로컬스토리지 삭제
   */

  /* 1. 존재하는 로컬스토리지 한번 지우고 */
  window.localStorage.removeItem("wUserId");
  window.localStorage.removeItem("wVendrCd");
  window.localStorage.removeItem("wExprTime");

  /* 2. 로그인 선택한 사용자 로컬스토리지 값 셋팅 */
  // localStorage에 사용자 id
  window.localStorage.setItem("wUserId", params.data.userId);
  // localStorage에 사용자 회사 코드
  window.localStorage.setItem("wVendrCd", params.data.vendrCd);

  /* 3. 로그아웃 */
  loginStore.logout();
}

// 조회
async function onSearchGrid1() {
  vendrParams = reactive({
    vendrNm: vendrNm,
    userId: userId,
    userNm: userNm,
  });

  var searchList = await loginStore.selectUserLogin(vendrParams);

  if (searchList) {
    grid1RowData.value = searchList;
    grid1Api.value.setRowData(grid1RowData.value);
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}

function onGridReady1(params) {
  grid1Api.value = params.api;
  //params.api.sizeColumnsToFit();430031
}

onBeforeMount(() => {
  onSearchGrid1();
});
</script>

<style scoped>
.grid_default {
  height: calc(100% - 130px);
}
</style>
