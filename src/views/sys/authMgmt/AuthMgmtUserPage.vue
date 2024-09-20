<!-- 시스템/권한관리/사용자 -->

<template>
  <div class="content_box">
    <div class="item_wrap">
      <span class="title">권한</span>
      <select v-model="userAuth" @change="changeAuth" :key="gridData">
        <option :value="0">== 선택하세요 ==</option>
        <option
          v-for="list in authList"
          :key="list.authCd"
          :value="list.authCd">
          {{ list.authNm }}
        </option>
      </select>
      <button @click="authModify">권한편집</button>
    </div>
  </div>

  <div class="left_side">
    <div class="subtitle_area">
      <div class="title">전체 사용자 목록</div>
    </div>
    <div class="grid_default">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="40"
        :rowHeight="53"
        :columnDefs="columnDefs1"
        :rowData="grid1RowData"
        :defaultColDef="defaultColDef"
        :singleClickEdit="true"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        rowSelection="multiple"
        rowMultiSelectWithClick="true"
        @grid-ready="onGridReady1"
        :stopEditingWhenCellsLoseFocus="true">
      </ag-grid-vue>
    </div>
  </div>

  <div class="move_btn_area">
    <div class="position">
      <button class="add" @click="addAuth">추가</button>
      <button class="del" @click="delAuth">삭제</button>
    </div>
  </div>

  <div class="right_side">
    <div class="subtitle_area">
      <div class="title">권한 사용자 목록</div>
    </div>
    <div class="grid_default">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="40"
        :rowHeight="53"
        :columnDefs="columnDefs2"
        :rowData="grid2RowData"
        :defaultColDef="defaultColDef"
        :singleClickEdit="true"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        rowSelection="multiple"
        rowMultiSelectWithClick="true"
        @grid-ready="onGridReady2"
        :stopEditingWhenCellsLoseFocus="true">
      </ag-grid-vue>
    </div>
  </div>

  <!-- 권한 수정 팝업 -->
  <div class="popup auth_modify">
    <div class="popup_title">
      <span>권한편집</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popAuthModify
        :authList="authList"
        :key="authList"
        ref="gridValue"></popAuthModify>
    </div>
    <div class="popup_button">
      <button @click="onSaveCheckedRowGrid">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthMgmtStore } from "@/stores/sys/auth-mgmt-store";
import authMgmtService from "@/api/services/sys/auth-mgmt-service";
import { ref, onBeforeMount, getCurrentInstance } from "vue";

// 팝업 권한편집
import popAuthModify from "./PopAuthModifyPage.vue";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const store = useAuthMgmtStore();

// 회원사에서 설정한 권한 리스트
const authList = ref([]);
const userAuth = ref();

const gridValue = ref(null);
const gridData = ref([]);

const columnDefs1 = [
  {
    headerName: "회사 명",
    field: "vendrNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 150,
    maxWidth: 600,
    checkboxSelection: true,
  },
  {
    headerName: "사용자 ID",
    field: "userId",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 300,
  },
  {
    headerName: "사용자명",
    field: "userNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 300,
  },
];

const columnDefs2 = [
  {
    headerName: "회사 명",
    field: "vendrNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 150,
    maxWidth: 600,
    checkboxSelection: true,
  },
  {
    headerName: "사용자 ID",
    field: "userId",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 300,
  },
  {
    headerName: "사용자명",
    field: "userNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 300,
  },
];

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

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

let grid1Api = ref();
let grid2Api = ref();

const doSearchParams = {};
const grid1RowData = ref([]);
const grid2RowData = ref([]);

//추가 버튼
async function addAuth() {
  const cVal = [];

  if (userAuth.value === "0") {
    alert("권한을 선택하세요.");
    return;
  }
  const addData = grid1Api.getSelectedRows();
  addData.filter((item) => {
    if (
      !grid2RowData.value.some(
        (other) =>
          other.vendrCd === item.vendrCd && other.userId === item.userId
      )
    ) {
      const node = {};
      node.mode = "I";
      node.vendrCd = item.vendrCd;
      node.authCd = userAuth.value;
      node.userId = item.userId;
      node.regId = $loginStore.$state.userInfo.userId;
      node.modId = $loginStore.$state.userInfo.userId;

      cVal.push(node);
    }
  });

  if (addData.length === 0) {
    alert("사용자를 선택하세요.");
    return null;
  } else if (cVal == "") {
    alert("중복 사용자가 선택되었습니다.");
    return null;
  } else {
    // if (confirm("저장하시겠습니까?")) {
    //   try {
    //     const params = cVal;
    //     const res = await authMgmtService.updateUserAuth(params);
    //     if (res.data == "OK") {
    //       alert("정상적으로 처리하였습니다.");
    //       changeAuth();

    //     } else {
    //       alert(res.data.message);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     throw err;
    //   }
    // }
    try {
      const params = cVal;
      const res = await authMgmtService.updateUserAuth(params);
      if (res.data == "OK") {
        changeAuth();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

//삭제버튼
async function delAuth() {
  if (grid2RowData.value.length > 0) {
    const deleteData = grid2Api.getSelectedRows();
    const cVal = [];

    deleteData.forEach((item) => {
      const node = {};
      node.mode = "D";
      node.vendrCd = item.vendrCd;
      node.authCd = userAuth.value;
      node.userId = item.userId;

      cVal.push(node);
    });

    if (cVal == "") {
      alert("삭제할 사용자를 선택하세요.");
      return null;
    } else {
      // if (confirm("삭제하시겠습니까?")) {
      //   try {
      //     const params = cVal;
      //     const res = await authMgmtService.updateUserAuth(params);
      //     if (res.status == 200) {
      //       alert("정상적으로 처리하였습니다.");
      //       changeAuth();

      //     } else {
      //       alert(res.data.message);
      //     }
      //   } catch (err) {
      //     console.error(err);
      //     throw err;
      //   }
      // }

      try {
        const params = cVal;
        const res = await authMgmtService.updateUserAuth(params);
        if (res.status == 200) {
          changeAuth();
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  } else {
    alert("권한을 선택하세요.");
    return;
  }
}

function onGridReady1(params) {
  grid1Api = params.api;
  params.api.sizeColumnsToFit();
}

function onGridReady2(params) {
  grid2Api = params.api;
  params.api.sizeColumnsToFit();
}

// 권한 selectBox 선택 시 사용자 목록
async function changeAuth() {
  var params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
    authCd: userAuth.value,
  };

  try {
    const userList = await store.getUserList(JSON.stringify(params));
    if (userList.length > 0) {
      grid1RowData.value = userList;
    }

    if (params.authCd != "") {
      const userAuthList = await store.getUserAuthList(JSON.stringify(params));

      if (userAuthList.length > 0) {
        grid2RowData.value = userAuthList;
      } else {
        grid2RowData.value = [];
      }
      //selectMenu.value = treeTopCom;
      //checkDupMenu.value = selMenus;
      //checkSelMenu.value = [];
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 권한 리스트
async function getAuthList() {
  const params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
  };
  authList.value = await store.getMenuAuthList(JSON.stringify(params));
}

//권한 편집 버튼
async function authModify() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("auth_modify")[0].classList.add("show");
  //console.log("authList============", authList.value);
}

// 권한 편집 저장 버튼
async function onSaveCheckedRowGrid() {
  gridData.value = gridValue.value.gridData();
  if (gridData.value.length > 0) {
    // if (confirm("저장하시겠습니까?")) {
    //   try {
    //     const params = JSON.stringify(gridData.value);
    //     const res = await authMgmtService.updateAuth(params);
    //     if (res.status == 200) {
    //       alert("정상적으로 처리하였습니다.");
    //       location.reload();

    //     } else {
    //       alert(res.data.message);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     throw err;
    //   }
    // }
    try {
      const params = JSON.stringify(gridData.value);
      const res = await authMgmtService.updateAuth(params);
      if (res.data == "OK") {
        getAuthList();
        popupClose();
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

//팝업 닫기
function popupClose() {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("auth_modify")[0].classList.remove("show");
}

onBeforeMount(() => {
  changeAuth();
  getAuthList();
  userAuth.value = "0";
});
</script>

<style scoped>
.left_side {
  float: left;
  width: calc(50% - 80px);
  height: calc(100% - 90px);
}
.right_side {
  float: left;
  width: calc(50% - 80px);
  height: calc(100% - 90px);
}
.move_btn_area {
  float: left;
  width: 160px;
  height: calc(100% - 90px);
  padding: 20px;
}
.grid_default {
  height: calc(100% - 40px);
}
.item_wrap .title {
  display: inline-block;
  width: 60px;
}
.popup.auth_modify {
  width: 600px;
  height: 500px;
}
</style>
