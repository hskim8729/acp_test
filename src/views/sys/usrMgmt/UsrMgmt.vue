<!-- 시스템/코드관리 -->

<template>
  <div class="page_title_area">
    <div class="title">사용자관리</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 시스템 > 사용자관리
    </nav>
  </div>

  <div class="page_content_area">
    <div class="content_box">
      <div class="item_wrap w20p">
        <span class="title">사용자 명</span>
        <input type="text" v-model="userNm" @keypress.enter="searchList" />
      </div>

      <div class="item_wrap w20p">
        <span class="title">회사명</span>
        <input type="text" v-model="vendrNm" @keypress.enter="searchList" />
      </div>

      <div class="item_wrap w20p">
        <span class="title">사용자 ID</span>
        <input type="text" v-model="userId" @keypress.enter="searchList" />
      </div>

      <div class="item_wrap w20p">
        <span class="title">사용자 휴대전화</span>
        <input type="text" v-model="crryTelNo" @keypress.enter="searchList" />
      </div>

      <button class="search" @click="searchList" @keypress.enter="searchList">
        조회
      </button>
    </div>
    <div class="left_side">
      <div class="subtitle_area">
        <div class="title">사용자 리스트</div>
        <div class="right_btn">
          <button @click="addUser">사용자 등록</button>
          <button @click="delUser">삭제</button>
          <button @click="updateRstUserPw">비밀번호 초기화</button>
        </div>
      </div>
      <div class="grid_default3">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="grid1Options">
        </ag-grid-vue>
      </div>
    </div>

    <div class="right_side">
      <div class="subtitle_area">
        <div class="title">사용자 역할 정보</div>
      </div>
      <div class="content_box">
        <div class="item_wrap w50p">
          <span class="title">사용자 ID</span>
          <input type="text" v-model="disUserId" disabled="true" />
        </div>
        <div class="item_wrap w50p">
          <span class="title">사용자 이름</span>
          <input type="text" v-model="disUserNm" disabled="true" />
        </div>
      </div>

      <div class="grid_default3 bottom">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="grid2Options">
        </ag-grid-vue>
      </div>
    </div>
  </div>

  <!-- 사용자등록 팝업 -->
  <div class="popup add_user">
    <div class="popup_title">
      <span>사용자 등록</span>
      <button class="popup_close" @click="popupClose('add_user')"></button>
    </div>
    <div class="popup_content">
      <popAddUser
        :partnerList="partnerList"
        :regUserId="editRegUserId"
        :regUserNm="editRegUserNm"
        :partner="editPartner"
        :workNm="editWorkNm"
        :crryTelNo="editCrryTelNo"
        :modAdmAcctYn="editModAdmAcctYn"
        :key="partnerList"
        :formData="partnerList"
        @loadData="loadData"
        ref="regUsrInfo"></popAddUser>
    </div>
    <div class="popup_button">
      <button @click="registUser">등록</button>
      <button @click="popupClose('add_user')">취소</button>
    </div>
  </div>

  <!-- 사용자 수정 팝업 -->
  <div class="popup mod_user">
    <div class="popup_title">
      <span>사용자 수정</span>
      <button class="popup_close" @click="popupClose('mod_user')"></button>
    </div>
    <div class="popup_content">
      <popModUser
        :partnerList="partnerList"
        :modInfo="modInfo"
        ref="modUsrInfo"></popModUser>
    </div>
    <div class="popup_button">
      <button @click="modifyUser">수정</button>
      <button @click="popupClose('mod_user')">취소</button>
    </div>
  </div>

  <!-- 소속회사 추가 팝업 -->
  <div class="popup add_vendr">
    <div class="popup_title">
      <span>소속회사 추가 등록</span>
      <button class="popup_close" @click="popupClose('add_vendr')"></button>
    </div>
    <div class="popup_content">
      <popAddVendr
        :partnerList="partnerList"
        :key="partnerList"
        ref="gridValue"></popAddVendr>
    </div>
    <div class="popup_button">
      <button @click="onSaveCheckedRowGrid">등록</button>
      <button @click="popupClose('add_vendr')">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useUsrMgmtStore } from "@/stores/sys/usr-mgmt-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import usrMgmtService from "@/api/services/sys/usr-mgmt-service";
import loginAuthService from "@/api/common/login-auth-service";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount, getCurrentInstance } from "vue";

import popAddUser from "./popAddUser.vue";
import popModUser from "./popModUser.vue";
import popAddVendr from "./PopAddVendrPage.vue";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const vendrNm = ref("");
const userId = ref("");
const userNm = ref("");
const crryTelNo = ref("");

const wait = ref(true);

const disUserId = ref("");
const disUserNm = ref("");

// 회원사의 소속회사(협력사) 리스트
const partnerList = ref([]);
//const menuAuth = ref();

// 사용자 등록 팝업창에서 받아오는 데이터 (사용자 등록정보, 소속회사 추가정보)
const regUsrInfo = ref(null);
const gridValue = ref(null);

// 사용자 수정 팝업창에서 받아오는 데이터 (사용자 수정정보)
const modUsrInfo = ref(null);
const modInfo = ref({});

let editRegUserId = ref("");
let editRegUserNm = ref("");
let editPartner = ref("");
let editWorkNm = ref("");
let editCrryTelNo = ref("");
let editModAdmAcctYn = ref("");

var grid1Api;
var grid2Api;

var grid1RowData = reactive([]);
var grid2RowData = reactive([]);

// 입력한 사용자 정보
let editUserInfo = ref({});

const paramInfo = ref({});

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const store = useUsrMgmtStore();

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 2,
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
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 280,
    checkboxSelection: true,
  },

  {
    headerName: "사용자ID",
    field: "userId",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 150,
    maxWidth: 270,
  },

  {
    headerName: "이름",
    field: "userNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 80,
    maxWidth: 100,
  },
  {
    headerName: "직위",
    field: "workNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 80,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");

      if (params.data.admAcctYn == "Y") {
        eDiv.innerHTML = '<span style="color:#eb003f;"> 관리자 </span>';
      } else {
        eDiv.innerHTML = "<span>" + params.data.workNm + "</span>";
      }
      return eDiv;
    },
  },
  {
    headerName: "휴대전화",
    field: "crryTelNo",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 150,
    cellRenderer: (params) => {
      const phone = params.data.crryTelNo;
      return (
        phone.substring(0, 3) +
        "-" +
        phone.substring(3, 7) +
        "-" +
        phone.substring(7)
      );
    },
  },
  {
    headerName: "등록일",
    field: "regDate",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 150,
  },
];

const columnDefs2 = [
  {
    headerName: "현장명",
    field: "siteNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 200,
  },
  // { headerName: "담당역할", field: "jbttlNm", filter: true, cellStyle: {textAlign: "center"}, width: 120 ,maxWidth: 300  },
  {
    headerName: "직책",
    field: "jbttlNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 120,
    maxWidth: 300,
  },
  {
    headerName: "계정활성",
    children: [
      {
        headerName: "시작일",
        field: "actvStDt",
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 100,
        maxWidth: 200,
        cellRenderer: (params) => {
          const startDt = params.data.actvStDt;
          return (
            startDt.substring(0, 4) +
            "-" +
            startDt.substring(4, 6) +
            "-" +
            startDt.substring(6)
          );
        },
      },
      {
        headerName: "종료일",
        field: "actvEnDt",
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 100,
        maxWidth: 200,
        cellRenderer: (params) => {
          const endDt = params.data.actvEnDt;
          return (
            endDt.substring(0, 4) +
            "-" +
            endDt.substring(4, 6) +
            "-" +
            endDt.substring(6)
          );
        },
      },
    ],
  },
  {
    headerName: "등록일",
    field: "regDate",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 330,
  },
];

const grid1Options = {
  headerHeight: 40,
  rowHeight: 53,
  columnDefs: columnDefs1,
  rowData: grid1RowData,
  defaultColDef: defaultColDef,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  //rowSelection: "multiple",
  //rowMultiSelectWithClick: true,
  // columnTypes : grid1ColumnTypes,
  onGridReady: onGridReady1,
  onRowClicked: onGrid1RowClicked,
  onRowDoubleClicked: onGridModify,
};

const grid2Options = {
  headerHeight: 40,
  rowHeight: 53,
  columnDefs: columnDefs2,
  rowData: grid2RowData,
  defaultColDef: defaultColDef,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  // columnTypes : grid1ColumnTypes,
  onGridReady: onGridReady2,
  onRowClicked: onGrid2RowClicked,
};

async function onGrid1RowClicked(params) {
  disUserId.value = params.data.userId;
  disUserNm.value = params.data.userNm;
  const dParams = params.data.userId;

  paramInfo.userId = params.data.userId;
  paramInfo.vendrCd = params.data.vendrCd;

  try {
    const getUsrDetail = await store.selectUsrDetail(paramInfo);

    grid2RowData = getUsrDetail;
    grid2Api.setRowData(grid2RowData);
  } catch (err) {
    console.log("UsrMgmtPage.vue > rowClick > err : ", err);
    throw err;
  }
}

// 더블 클릭 시 사용자 정보 수정 팝업창
async function onGridModify(params) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("mod_user")[0].classList.add("show");

  modInfo.userId = params.data.userId;
  modInfo.userNm = params.data.userNm;
  modInfo.vendrCd = params.data.vendrCd;
  modInfo.workNm = params.data.workNm;
  modInfo.crryTelNo = params.data.crryTelNo;
  modInfo.admAcctYn = params.data.admAcctYn;

  modUsrInfo.value.modify(modInfo);
}

async function onGrid2RowClicked(params) {
  grid2RowData = [];
  //grid2Api.setRowData(grid2RowData);
}

function onGridReady1(params) {
  grid1Api = params.api;
  //params.api.sizeColumnsToFit();
}

function onGridReady2(params) {
  grid2Api = params.api;
  //params.api.sizeColumnsToFit();
}

const doSearchParams = {};

async function searchList() {
  doSearchParams.vendrCd = $loginStore.$state.userInfo.vendrCd;
  doSearchParams.vendrNm = vendrNm.value;
  doSearchParams.userId = userId.value;
  doSearchParams.userNm = userNm.value;
  doSearchParams.crryTelNo = crryTelNo.value;

  try {
    const res = await store.selectUsrInfo(reactive(doSearchParams));

    if (res.data.length > 0) {
      grid1RowData = res.data;
      grid1Api.setRowData(grid1RowData);
    } else {
      grid1RowData = [];
      grid1Api.setRowData(grid1RowData);
    }

    disUserId.value = userId.value;
    disUserNm.value = userNm.value;

    grid2RowData = [];
    grid2Api.setRowData(grid2RowData);
  } catch (err) {
    console.log("UsrMgmtPage.vue > searchList() > err : ", err);
    throw err;
  }
}

function addUser() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("add_user")[0].classList.add("show");
}

// 사용자 삭제
async function delUser() {
  const delData = grid1Api.getSelectedRows();

  if (!confirm("삭제하시겠습니까?")) return;

  if (delData != "") {
    if (delData[0].admAcctYn === "Y") {
      alert("시스템 관리자는 삭제할 수 없습니다.");
      return;
    }
    const params = {
      userId: delData[0].userId,
      vendrCd: delData[0].vendrCd,
      crryTelNo: delData[0].crryTelNo,
    };
    try {
      const res = await usrMgmtService.deleteUser(params);
      if (res.data === "OK") {
        userDataList();
        getPartnerList();
      } else {
        alert("현장에 추가된 사용자는 삭제할 수 없습니다.");
      }
    } catch (err) {
      console.log("UsrMgmtPage.vue > delUser() > err : ", err);
      throw err;
    }
  } else {
    alert("삭제할 사용자를 선택하세요.");
    return;
  }
}

async function popupClose(type) {
  if (type == "add_vendr") {
    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("add_vendr")[0].classList.remove("show");
    gridValue.value.gridReset();
  } else if (type == "mod_user") {
    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("mod_user")[0].classList.remove("show");
    modUsrInfo.value.reset();
  } else {
    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("add_user")[0].classList.remove("show");
    regUsrInfo.value.reset();
  }
}

// 사용자 리스트
async function userDataList() {
  try {
    const params = {
      vendrCd: $loginStore.$state.userInfo.vendrCd,
    };
    const res = await store.selectUsrInfo(params);
    if (res.data != null && res.status == 200) {
      grid1RowData = res.data;
      grid1Api.setRowData(grid1RowData);
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > userDataList > err : ", err);
    throw err;
  }
}

// 사용자 등록 팝업 소속회사 리스트
async function getPartnerList() {
  const params = $loginStore.$state.userInfo.vendrCd;
  try {
    partnerList.value = await store.getPartnerList(params);
  } catch (err) {
    console.log("UsrMgmtPage.vue > getPartnerList > err : ", err);
    throw err;
  }
}

// 소속회사 추가 등록 버튼
async function onSaveCheckedRowGrid() {
  const gridData = ref([]);
  gridData.value = gridValue.value.gridData();

  if (gridData.value.length > 0) {
    try {
      const params = JSON.stringify(gridData.value);
      const res = await usrMgmtService.updatePtnrVendr(params);
      if (res.status == 200) {
        gridValue.value.drawGrid();
        popupClose("add_vendr");
        userDataList();
        getPartnerList();
        // 입력된 사용자 정보 값
        fn_editUserInfo();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  } else {
    alert("데이터가 없습니다.");
    return;
  }
}

// 입력된 사용자 정보 값
function fn_editUserInfo() {
  editRegUserId.value = editUserInfo.value.userId;
  editRegUserNm.value = editUserInfo.value.userNm;
  editPartner.value = editUserInfo.value.partner;
  editWorkNm.value = editUserInfo.value.workNm;
  editCrryTelNo.value = editUserInfo.value.crryTelNo;
  editModAdmAcctYn.value = editUserInfo.value.modAdmAcctYn;
}
// 사용자 등록
async function registUser() {
  const userInfo = ref({});
  userInfo.value = regUsrInfo.value.updateInfo();

  if (userInfo.value.msg.userId != "") {
    alert(userInfo.value.msg.userId);
    return;
  } else if (userInfo.value.msg.userNm != "") {
    alert(userInfo.value.msg.userNm);
    return;
  } else if (userInfo.value.msg.vendrCd != "") {
    alert(userInfo.value.msg.vendrCd);
    return;
  } else if (userInfo.value.msg.crryTelNo != "") {
    alert(userInfo.value.msg.crryTelNo);
    return;
  }

  if (!userInfo.value.validId) {
    alert("사용자 ID 중복확인을 하세요.");
    return;
  }
  const params = {
    mode: "I",
    vendrCd: userInfo.value.vendrCd,
    userId: userInfo.value.userId,
    userPw: "Plan2do!",
    tmplCd: "022",
    userNm: userInfo.value.userNm,
    workNm: userInfo.value.workNm,
    crryTelNo: userInfo.value.crryTelNo.replaceAll("-", ""),
    admAcctYn: userInfo.value.modAdmAcctYn,
    // admAcctYn: "N",
    pwIntlYn: "Y",
    regId: $loginStore.$state.userInfo.userId,
    modId: $loginStore.$state.userInfo.userId,
  };

  try {
    const res = await usrMgmtService.registUser(params);

    if (res.data == "OK") {
      alert(
        "정상적으로 등록되었습니다.\n등록된 사용자 계정의 비밀번호는 Plan2do!입니다.\n등록된 사용자의 이메일과 휴대폰으로 비밀번호가 발송되었습니다."
      );
      popupClose("add_user");
      regUsrInfo.value.reset();
      userDataList();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > registUser() > err : ", err);
    throw err;
  }
}

// 사용자 수정 버튼
async function modifyUser() {
  const userInfo = ref({});
  userInfo.value = modUsrInfo.value.updateInfo();

  if (userInfo.value.msg.userNm != "") {
    alert(userInfo.value.msg.userNm);
    return;
  } else if (userInfo.value.msg.vendrCd != "") {
    alert(userInfo.value.msg.vendrCd);
    return;
  } else if (userInfo.value.msg.crryTelNo != "") {
    alert(userInfo.value.msg.crryTelNo);
    return;
  }

  const params = {
    mode: "U",
    vendrCd: userInfo.value.vendrCd,
    userId: userInfo.value.userId,
    userNm: userInfo.value.userNm,
    workNm: userInfo.value.workNm,
    admAcctYn: userInfo.value.modAdmAcctYn,
    crryTelNo: userInfo.value.crryTelNo.replaceAll("-", ""),
    modId: $loginStore.$state.userInfo.userId,
  };

  try {
    const res = await usrMgmtService.registUser(params);
    if (res.data == "OK") {
      popupClose("mod_user");
      modUsrInfo.value.reset();
      userDataList();
    } else {
      if (userInfo.value.modAdmAcctYn === "Y") {
        alert("현장에 등록된 인원은 관리자 변경이 불가합니다.");
      } else {
        alert(res.data.message);
      }
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > registUser() > err : ", err);
    throw err;
  }
}

// 사용자 비밀번호 초기화
async function updateRstUserPw() {
  const resetData = grid1Api.getSelectedRows();

  if (resetData.length > 0) {
    const params = {
      vendrCd: resetData[0].vendrCd,
      userId: resetData[0].userId,
      tmplCd: "022",
      admAcctYn: $loginStore.$state.userInfo.admAcctYn,
      crryTelNo: resetData[0].crryTelNo,
    };

    if (
      !confirm(
        "해당 사용자의 임시비밀번호를 이메일과 휴대전화번호로 발송하시겠습니까?"
      )
    )
      return;

    var msg = "";
    try {
      const res = await loginAuthService.updateUserTempPw(params);
      if (res.data === "OK") {
        alert(
          "해당 사용자의 메일과 휴대전화번호로 임시비밀번호가 발송되었습니다."
        );
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("UsrMgmtPage.vue > updateRstUserPw() > err :", err);
      alert(err);
      throw err;
    }

    alert(msg);

    userDataList();
    getPartnerList();
  } else {
    alert("사용자를 선택하세요.");
    return;
  }
}

// 입력 된 사용자 정보 값
function loadData(paramUserInfo) {
  editUserInfo.value = paramUserInfo;
}

onBeforeMount(() => {
  userDataList();
  getPartnerList();
});
</script>

<style scoped>
button[disabled] {
  cursor: not-allowed !important;
}

.left_side {
  float: left;
  width: calc(60% - 20px);
  height: calc(100% - 90px);
  margin-right: 40px;
}
.right_side {
  float: left;
  width: calc(40% - 20px);
  height: calc(100% - 90px);
}
.grid_default3 {
  height: calc(100% - 40px);
}
.grid_default2.bottom {
  height: calc(100% - 130px);
}

.popup.add_user {
  width: 650px;
  height: 480px;
}
.popup.mod_user {
  width: 650px;
  height: 480px;
}
.popup.add_vendr {
  width: 700px;
  height: 500px;
}
</style>
