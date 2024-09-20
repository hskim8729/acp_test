<!-- sys/sysCodeMng -->

<template>
  <div class="page_title_area">
    <div class="title">코드관리</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 시스템 > 코드관리
    </nav>
  </div>

  <div class="page_content_area">
    <div class="left_side">
      <div class="subtitle_area">
        <div class="title">그룹코드</div>
        <div class="right_btn">
          <button @click="onAddRowGrid1">추가</button>
          <button @click="onRemoveSelectedGrid1">삭제</button>
          <button @click="onSaveCheckedRowGrid1">저장</button>
        </div>
      </div>
      <div class="grid_default">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="grid1Options"
          :columnTypes="grid1ColumnApi"
          :doubleClickEdit="true">
        </ag-grid-vue>
      </div>
    </div>

    <div class="right_side">
      <div class="subtitle_area">
        <div class="title">그룹코드 상세</div>
        <div class="right_btn">
          <button @click="onAddRowGrid2">추가</button>
          <button @click="onRemoveSelectedGrid2">삭제</button>
          <button @click="onSaveCheckedRowGrid2">저장</button>
        </div>
      </div>
      <div class="grid_default">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="grid2Options"
          :columnTypes="grid2ColumnApi">
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";
import cdMgmtService from "@/api/services/sys/cd-mgmt-service";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount, getCurrentInstance } from "vue";

import { NumericEditor } from "@/agGrid/NumericEditor";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

var grid1Api;
var grid2Api;

var grid1RowData = reactive([]);
var grid2RowData = reactive([]);

var grid1ColumnApi = ref();
var grid2ColumnApi = ref();

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const store = useCdMgmtStore();
const sltComUpperCd = ref("");

var grid1OriginRowData = reactive([]);
var grid2OriginRowData = reactive([]);

const vendrCd = ref();

var fchParams = reactive({
  comUpperCd: "0",
});

var dtlParams = reactive({});

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
    headerName: "유형코드",
    field: "comCd",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 150,
    maxWidth: 150,
    checkboxSelection: true,
    type: "editableColumn",
  },
  {
    headerName: "유형코드명",
    field: "comCdNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 200,
    maxWidth: 200,
    type: "editableColumn",
  },
  {
    headerName: "설명",
    field: "comCdDc",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 300,
    maxWidth: 400,
    type: "editableColumn",
  },
  {
    headerName: "정렬",
    field: "sortOrdr",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 80,
    maxWidth: 80,
    type: "editableColumn",
    cellEditor: NumericEditor,
  },
  {
    headerName: "사용여부",
    field: "useYn",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      if (params.data.useYn == "N")
        eDiv.innerHTML =
          '<div class="switch off"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      else
        eDiv.innerHTML =
          '<div class="switch on"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      const eButton = eDiv.querySelectorAll(".click_area")[0];

      if (params.data.mode != "I") {
        eButton.onclick = function (event) {
          if (event.target.parentElement.classList.contains("on")) {
            event.target.parentElement.classList.replace("on", "off");
            params.data.useYn = "N";
          } else {
            event.target.parentElement.classList.replace("off", "on");
            params.data.useYn = "Y";
          }

          params.data.grid1 = true;
          params.data.grid2 = false;

          onSaveImmediately(params);
        };
      }

      return eDiv;
    },
  },
];

const columnDefs2 = [
  {
    headerName: "유형코드",
    field: "comCd",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 150,
    maxWidth: 150,
    checkboxSelection: true,
    type: "editableColumn",
  },
  {
    headerName: "유형코드명",
    field: "comCdNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 200,
    maxWidth: 200,
    type: "editableColumn",
  },
  {
    headerName: "설명",
    field: "comCdDc",
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 300,
    maxWidth: 400,
    type: "editableColumn",
  },
  {
    headerName: "정렬",
    field: "sortOrdr",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 80,
    maxWidth: 80,
    cellEditor: NumericEditor,
    type: "editableColumn",
  },
  {
    headerName: "사용여부",
    field: "useYn",
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      if (params.data.useYn == "N")
        eDiv.innerHTML =
          '<div class="switch off"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      else
        eDiv.innerHTML =
          '<div class="switch on"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      const eButton = eDiv.querySelectorAll(".click_area")[0];

      if (params.data.mode != "I") {
        eButton.onclick = function (event) {
          if (event.target.parentElement.classList.contains("on")) {
            event.target.parentElement.classList.replace("on", "off");
            params.data.useYn = "N";
          } else {
            event.target.parentElement.classList.replace("off", "on");
            params.data.useYn = "Y";
          }

          params.data.grid1 = false;
          params.data.grid2 = true;

          onSaveImmediately(params);
        };
      }

      return eDiv;
    },
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
  // columnTypes : grid1ColumnTypes,
  onGridReady: onGridReady1,
  onRowClicked: onGrid1RowClicked,
};

const grid2Options = {
  headerHeight: 40,
  rowHeight: 53,
  columnDefs: columnDefs2,
  rowData: grid2RowData,
  defaultColDef: defaultColDef,
  singleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  rowSelection: "single",
  stopEditingWhenCellsLoseFocus: true,
  onGridReady: onGridReady2,
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}
function lookupValue(mappings, key) {
  return mappings[key];
}

async function onGrid1RowClicked(params) {
  console.log("onGrid1RowClicked >>>>>>> ", params);
  sltComUpperCd.value = "";
  grid2RowData = [];
  grid2Api.setRowData(grid2RowData);

  if (params.data.mode == "I" || !params.data.comCd) return;

  sltComUpperCd.value = "(" + params.data.comCd + ")";

  if (params.data.mode != "I") {
    //dtlParams.vendrCD = vendrCd;
    dtlParams.comCd = params.data.comCd;

    try {
      const res = await cdMgmtService.retrieveComCodeDetail(dtlParams);
      console.log("1 res >>>>>>>>>>> ", res);
      grid2OriginRowData = res.data;
      grid2RowData = res.data;
      grid2Api.setRowData(grid2RowData);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

// 그룹코드 추가
function onAddRowGrid1() {
  var addRow = [
    {
      mode: "I",
      comCd: "",
      comUpperCd: "T00",
      comCdNm: "",
      comCdDc: "",
      sortOrdr: 0,
      useYn: "Y",
      regId: $loginStore.$state.userInfo.userId,
      modId: $loginStore.$state.userInfo.userId,
    },
  ];
  grid1Options.api.applyTransaction({ add: addRow });
  grid1Api.redrawRows();
}

//그룹코드(하위) 추가
function onAddRowGrid2() {
  if (!sltComUpperCd.value) {
    alert("그룹코드(좌측)를 선택하세요.");
    return;
  }

  var addRow = [
    {
      mode: "I",
      comCd: "",
      comUpperCd: sltComUpperCd.value.replace("(", "").replace(")", ""),
      comCdNm: "",
      comCdDc: "",
      sortOrdr: 0,
      useYn: "Y",
      regId: $loginStore.$state.userInfo.userId,
      modId: $loginStore.$state.userInfo.userId,
    },
  ];
  grid2Options.api.applyTransaction({ add: addRow });
  grid2Api.redrawRows();
}
//그룹코드 삭제
async function onRemoveSelectedGrid1() {
  var selectedData = grid1Options.api.getSelectedRows();

  if (selectedData.length == 0) {
    alert("삭제할 그룹코드를 선택해 주세요.");
    return;
  }

  if (selectedData[0].mode == "I") {
    grid1Options.api.applyTransaction({ remove: selectedData });
  } else {
    if (
      !confirm(
        "삭제 시 하위 그룹코드까지 삭제됩니다.\n정말로 삭제하시겠습니까?"
      )
    )
      return;

    try {
      selectedData[0].mode = "D";
      const res = await cdMgmtService.saveComCodes(selectedData);

      if (res.status == 200 || res.data.status == 200) {
        drawGrid();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }

    const comCodes = await store.fetchComCodes(fchParams);
    grid1RowData = comCodes;
    grid1Api.setRowData(grid1RowData);

    grid2RowData = [];
    grid2Api.setRowData(grid2RowData);
  }
}

//그룹코드(하위) 삭제
async function onRemoveSelectedGrid2() {
  var selectedData = grid2Options.api.getSelectedRows();

  if (selectedData.length == 0) {
    alert("삭제할 그룹코드를 선택해 주세요.");
    return;
  }

  if (selectedData[0].mode == "I") {
    grid2Options.api.applyTransaction({ remove: selectedData });
  } else {
    if (!confirm("삭제하시겠습니까?")) return;

    try {
      selectedData[0].mode = "D";
      const res = await cdMgmtService.saveComCodesDtl(selectedData);

      if (res.status == 200 || res.data.status == 200) {
        alert("정상적으로 처리하였습니다.");

        try {
          const res = await cdMgmtService.retrieveComCodeDetail(dtlParams);
          console.log("2 res >>>>>>>>>>> ", res);
          grid2OriginRowData = res.data;
          grid2RowData = res.data;
          grid2Api.setRowData(grid2RowData);
        } catch (err) {
          console.error(err);
          throw err;
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

//그룹코드 저장
async function onSaveCheckedRowGrid1() {
  var selectedData = grid1Options.api.getSelectedRows();
  if (selectedData.length == 0) {
    alert("저장을 원하는 행을 선택해 주세요");
    return;
  }

  if (!selectedData[0].comCd.trim()) {
    alert("저장을 원하는 행의 유형코드를 입력해 주세요");
    return;
  }

  if (!selectedData[0].comCdNm.trim()) {
    alert("저장을 원하는 행의 유형코드명을 입력해 주세요");
    return;
  }

  if (!selectedData[0].sortOrdr || selectedData[0].sortOrdr < 1) {
    alert("저장을 원하는 행의 정렬순서를(0보다 큰) 입력해 주세요.");
    return;
  }

  if (selectedData[0].mode == "I") {
    var orgData = grid1OriginRowData.find(
      (item) => item.comCd === selectedData[0].comCd
    );

    if (orgData) {
      alert("유형코드[" + selectedData[0].comCd + "]는 이미 사용중 입니다.");
      return;
    }
  }

  var orgData = grid1OriginRowData.find(
    (item) =>
      item.vendrCd === selectedData[0].vendrCd &&
      item.comCd === selectedData[0].comCd &&
      item.comCdNm === selectedData[0].comCdNm &&
      item.comUpperCd === selectedData[0].comUpperCd &&
      item.comCdDc === selectedData[0].comCdDc &&
      item.sortOrdr === selectedData[0].sortOrdr
  );

  if (orgData) {
    // alert("변경 사항이 없습니다.");
    return;
  }

  try {
    const res = await cdMgmtService.saveComCodes(selectedData);

    if (res.status == 200 || res.data.status == 200) {
      var comCodes = await store.fetchComCodes(fchParams);

      grid1RowData = comCodes;
      grid1Api.setRowData(grid1RowData);

      grid1OriginRowData = reactive(store.getComCodes);
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//그룹코드(하위) 저장
async function onSaveCheckedRowGrid2() {
  var selectedData = grid2Options.api.getSelectedRows();
  if (selectedData.length == 0) {
    alert("저장을 원하는 행을 선택해 주세요");
    return;
  }

  if (!selectedData[0].comCd.trim()) {
    alert("저장을 원하는 행의 유형코드를 입력해 주세요");
    return;
  }

  if (!selectedData[0].comCdNm.trim()) {
    alert("저장을 원하는 행의 유형코드명을 입력해 주세요");
    return;
  }

  if (!selectedData[0].sortOrdr || selectedData[0].sortOrdr < 1) {
    alert("저장을 원하는 행의 정렬순서를(0보다 큰)  입력해 주세요.");
    return;
  }

  if (selectedData[0].mode == "I") {
    var orgData = grid1OriginRowData.find(
      (item) => item.comCd === selectedData[0].comCd
    );

    if (orgData) {
      alert("유형코드[" + selectedData[0].comCd + "]는 이미 사용중 입니다.");
      return;
    }

    orgData = grid2OriginRowData.find(
      (item) => item.comCd === selectedData[0].comCd
    );

    if (orgData) {
      alert("유형코드[" + selectedData[0].comCd + "]는 이미 사용중 입니다.");
      return;
    }
  }

  var orgData = grid2OriginRowData.find(
    (item) =>
      item.vendrCd === selectedData[0].vendrCd &&
      item.comCd === selectedData[0].comCd &&
      item.comCdNm === selectedData[0].comCdNm &&
      item.comUpperCd === selectedData[0].comUpperCd &&
      item.comCdDc === selectedData[0].comCdDc &&
      item.sortOrdr === selectedData[0].sortOrdr
  );

  if (orgData) {
    // alert("변경 사항이 없습니다.");
    return;
  }

  try {
    const res = await cdMgmtService.saveComCodesDtl(selectedData);
    if (res.status == 200 || res.data.status == 200) {
      try {
        const res = await cdMgmtService.retrieveComCodeDetail(dtlParams);
        grid2OriginRowData = res.data;
        grid2RowData = res.data;
        grid2Api.setRowData(grid2RowData);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function onSaveImmediately(params) {
  var saveParams = [];
  var res;
  try {
    params.data.mode = "U";
    saveParams.push(params.data);
    document.getElementsByClassName("loading_wrap")[0].classList.add("show");
    if (params.data.grid1) res = await cdMgmtService.saveComCodes(saveParams);
    if (params.data.grid2)
      res = await cdMgmtService.saveComCodesDtl(saveParams);
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");

    if (res.status == 200 || res.data.status == 200) {
      alert("정상적으로 처리하였습니다.");

      if (params.data.grid1) {
        try {
          const res = await cdMgmtService.retrieveComCodeDetail(dtlParams);
          console.log("4 res >>>>>>>>>>> ", res);
          grid2OriginRowData = res.data;
          grid2RowData = res.data;
          grid2Api.setRowData(grid2RowData);
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
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

function isCellEditable(params) {
  return params.data.mode === "I";
}

async function drawGrid() {
  // 그리드 1
  grid1ColumnApi.value = {
    editableColumn: {
      editable: (params) => {
        return isCellEditable(params);
      },
      cellStyle: (params) => {
        if (isCellEditable(params)) {
          return { backgroundColor: "lightBlue" };
        }
      },
    },
  };
  // 그리드 2
  grid2ColumnApi.value = {
    editableColumn: {
      editable: (params) => {
        return isCellEditable(params);
      },
      cellStyle: (params) => {
        if (isCellEditable(params)) {
          return { backgroundColor: "lightBlue" };
        }
      },
    },
  };

  try {
    var comCodes = await store.fetchComCodes(fchParams);
    grid1RowData = comCodes;
    grid1Api.setRowData(grid1RowData);
    grid1OriginRowData = reactive(store.getComCodes);
  } catch (err) {
    console.log("CdMgmtPage.vue > drawGrid() > err : ", err);
    throw err;
  }
}

onBeforeMount(() => {
  vendrCd.value = $loginStore.$state.userInfo.vendrCd;
  vendrCd.value = $loginStore.$state.userInfo.vendrCd;

  drawGrid();
});
</script>

<style scoped>
.left_side {
  float: left;
  width: calc(50% - 20px);
  height: 100%;
  margin-right: 40px;
}
.right_side {
  float: left;
  width: calc(50% - 20px);
  height: 100%;
}
.grid_default {
  height: calc(100% - 40px);
}
</style>
