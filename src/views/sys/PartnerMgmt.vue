<!-- 시스템/협력업체관리 -->

<template>
  <div class="page_title_area">
    <div class="title">협력업체관리</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 시스템 > 협력업체관리
    </nav>
  </div>

  <div class="page_content_area">
    <div class="content_box">
      <div class="item_wrap w25p">
        <span for="vendrNm" class="title">회사명</span>
        <input type="text" v-model="vendrNm" @keypress.enter="onSearchGrid1" />
      </div>
      <div class="item_wrap w25p">
        <span for="busNo" class="title">사업자번호</span>
        <input type="text" v-model="busNo" @keypress.enter="onSearchGrid1" />
      </div>
      <button
        class="search"
        @click="onSearchGrid1"
        @keypress.enter="onSearchGrid1">
        조회
      </button>
    </div>

    <div class="subtitle_area">
      <div class="title">협력업체 리스트</div>
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
        :rowData="grid1RowData"
        :gridOptions="grid1Options">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
export default {
  name: "PartnerMgmt",
};
</script>

<script setup>
import { usePartnerMgmtStore } from "@/stores/sys/partner-mgmt-store";
import partnerMgmtService from "@/api/services/sys/partner-mgmt-service";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import commonUtils from "@/utils/common-utils";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount, watch, nextTick } from "vue";

const grid1Api = ref();
const grid1RowData = ref([]);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const store = usePartnerMgmtStore();
const loginStore = useLoginAuthStore();

//검색조건
var vendrParams = ref({});
const vendrNm = ref("");
const busNo = ref("");

//신규 저장
const vendrCd = loginStore.$state.userInfo.vendrCd;
const userId = loginStore.$state.userInfo.userId;

const defaultColDef = {
  editable: true,
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
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 800,
    checkboxSelection: true,
  },
  {
    headerName: "사업자번호",
    field: "busNo",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 800,
    cellRenderer: (params) => {
      return busNoRenderer(params);
    },
    cellEditorParams: { maxLength: 10 },
  },
  {
    headerName: "활성여부",
    field: "actvYn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 300,
    cellRenderer: (params) => {
      return actvYnRenderer(params);
    },
  },
];

const onGridReady1 = (params) => {
  grid1Api.value = params.api;
};

// 활성여부 랜더링
const actvYnRenderer = (params) => {
  const eDiv = document.createElement("div");
  eDiv.classList.add("cell_center");
  eDiv.innerHTML = `<div class="switch ${
    params.data.actvYn == "N" ? "off" : "on"
  }">
      <div class="click_area"></div><div class="dot"></div><span></span></div>`;
  const eButton = eDiv.querySelectorAll(".click_area")[0];

  eButton.onclick = function (event) {
    if (event.target.parentElement.classList.contains("on")) {
      event.target.parentElement.classList.replace("on", "off");
      params.data.actvYn = "N";
    } else {
      event.target.parentElement.classList.replace("off", "on");
      params.data.actvYn = "Y";
    }

    if (params.data.mode != "I") params.data.mode = "U";
  };

  return eDiv;
};

// 사업자번호 랜더링
const busNoRenderer = (params) => {
  let busNo = params.value;

  if (busNo) {
    busNo = `${busNo.substring(0, 3)}-${busNo.substring(
      3,
      5
    )}-${busNo.substring(5)}`;
  }

  return busNo;
};

// 그리드 데이터 변경시
const editCellValue = (params) => {
  const colId = params.column.colId;

  if (colId == "busNo" && params.data.busNo) {
    if (!isValidBusNo(params.data.busNo)) {
      params.data.busNo = params.oldValue;
      grid1Options.api.setRowData(grid1RowData.value);
      return;
    }
  }

  if (params.data.mode != "I") params.data.mode = "U";
  setGridRowData();
};

// 그리드 api 변경 시 실제 데이터 셋팅
const setGridRowData = () => {
  const rowData = [];
  grid1Options.api.forEachNode((node) => rowData.push(node.data));
  grid1RowData.value = rowData;
};

const grid1Options = {
  headerHeight: 40,
  rowHeight: 53,
  columnDefs: columnDefs1,
  rowData: grid1RowData.value,
  defaultColDef: defaultColDef,
  onRowDoubleClicked: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "multiple",
  onGridReady: onGridReady1,
  onCellValueChanged: editCellValue,
};

// 조회
async function onSearchGrid1() {
  vendrParams = reactive({
    vendrCd: vendrCd,
    vendrNm: vendrNm,
    busNo: busNo,
  });
  console.log("vendrParams : ", vendrParams);
  var searchList = await store.partnerSearchList(vendrParams);
  console.log("searchList : ", searchList);
  if (searchList) {
    grid1RowData.value = searchList;
    grid1Api.value.setRowData(grid1RowData.value);
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}

// 추가
function onAddRowGrid1() {
  var addRow = [
    {
      mode: "I",
      vendrUpperCd: vendrCd,
      vendrNm: "",
      busNo: "",
      actvYn: "Y",
      userId: userId,
      ptnrYn: "Y",
      filter: "agTextColumnFilter",
    },
  ];

  // grid 행 추가
  const focusedCell = grid1Options.api.getFocusedCell();
  const rowCnt = grid1Options.api.getDisplayedRowCount();
  const addIdx = focusedCell ? focusedCell.rowIndex + 1 : rowCnt;
  grid1Options.api.applyTransaction({ addIndex: addIdx, add: addRow });
  setGridRowData();
}

//삭제
async function onRemoveSelectedGrid1() {
  var selectedDatas = grid1Options.api.getSelectedRows();
  if (selectedDatas.length == 0) {
    alert("삭제할 업체를 선택해 주세요.");
    return;
  }

  let removeRows = [];

  for (const selectedData of selectedDatas) {
    // 해당 회사 소속의 유저가 있으면 삭제 불가.
    if (selectedData.mode != "I") {
      const param = { vendrCd: selectedData.vendrCd };
      let cnt = await partnerMgmtService.getCompanyMemberCnt(param);

      if (cnt.data > 0) {
        alert(selectedData.vendrNm + "에 등록된 사용자가 있습니다.");
        return;
      }

      selectedData.mode = "D";
      removeRows.push(selectedData);
    }
  }

  if (!confirm("선택된 업체를 삭제하시겠습니까?")) {
    return;
  }

  // 조회한 값만 DB에서 삭제처리
  if (removeRows.length > 0) {
    try {
      const res = await partnerMgmtService.saveMap(removeRows);
      if (res.status == 200 || res.data.status == 200) {
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // grid 행 삭제
  grid1Options.api.applyTransaction({ remove: selectedDatas });
  setGridRowData();
}

//저장 (신규 또는 수정)
async function onSaveCheckedRowGrid1() {
  const gridRows = grid1RowData.value;
  const editedRows = gridRows.filter(
    (item) => item.mode == "I" || item.mode == "U"
  );

  if (editedRows.length < 1) {
    alert("변경 사항이 없습니다.");
    return;
  }

  // 유효성체크
  for (const item of editedRows) {
    item.userId = userId;

    if (!isChkValidationSave(item)) {
      return;
    }
  }

  if (!confirm("저장하시겠습니까?")) {
    return;
  }

  try {
    const res = await partnerMgmtService.saveMap(editedRows);
    if (res.data == "OK") {
    } else {
      alert(res.data.message);
      return;
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  onSearchGrid1();
}

// 저장 유효성검사
const isChkValidationSave = (item) => {
  if (!item.vendrNm || !item.vendrNm.trim()) {
    alert("회사명을 입력해 주세요");
    return;
  }

  if (!item.busNo || !item.busNo.trim()) {
    alert("사업자번호를 입력해 주세요");
    return;
  }

  if (!isValidBusNo(item.busNo)) {
    return;
  }

  return true;
};

// 사업자번호 유효성검사
const isValidBusNo = (busNo) => {
  // 자릿수, 유효사업자 체크
  if (!commonUtils.isCheckBusNo(busNo)) {
    return;
  }

  // 화면에 중복된 사업자번호가 있는지 확인
  let duplBusRows = [];
  duplBusRows = grid1RowData.value.filter((el) => busNo == el.busNo);
  if (duplBusRows.length > 1) {
    alert("사업자번호 [" + busNo + "] 는 중복됩니다.");
    return;
  }

  return true;
};

onBeforeMount(() => {
  onSearchGrid1();
});
</script>

<style scoped>
.grid_default {
  height: calc(100% - 130px);
}
</style>
