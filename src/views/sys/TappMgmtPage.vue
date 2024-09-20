<!-- 시스템/협력업체관리 -->

<template>
  <div class="page_title_area">
    <div class="title">공종코드관리</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 시스템 > 공종코드관리
      퍼블리싱x
    </nav>
  </div>

  <div class="page_content_area">
    <div class="content_box">
        <div class="item_wrap w25p">
          <span class="title">공종명</span>
          <input type="text" id="contyCdNm" />
        </div>
        <button class="search" @click="onSearchGrid1">조회</button>
    </div>

    <div class="subtitle_area">
      <div class="title">협력업체 리스트</div>
      <button @click="onAddRowGrid1">추가</button>
      <button @click="onRemoveSelectedGrid1">삭제</button>
      <button @click="onSaveCheckedRowGrid1">저장</button>
    </div>
    <div class="grid_default">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :rowData="grid1RowData"
        :gridOptions="grid1Options"
      >
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
import { useTappMgmtStore } from "@/stores/sys/tapp-mgmt-store";
import tappMgmtService from "@/api/services/sys/tapp-mgmt-service";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount } from "vue";

const grid1Api = ref();
const grid1RowData = ref([]);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const store = useTappMgmtStore();

const doSearchParams = {};

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
    headerName: "공종코드",
    field: "contyCd",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 800,
    checkboxSelection: true,
  },
  {
    headerName: "공종명",
    field: "contyCdNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 800,
  },
  {
    headerName: "설명",
    field: "contyCdDc",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 800,
  },
  {
    headerName: "활성여부",
    field: "useYn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 300,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML =
        '<div class="switch on"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      const eButton = eDiv.querySelectorAll(".click_area")[0];

      eButton.onclick = function (event) {
        if (event.target.parentElement.classList.contains("on")) {
          event.target.parentElement.classList.replace("on", "off");
        } else {
          event.target.parentElement.classList.replace("off", "on");
        }

        if(params.data.useYn == "Y") {
          saveCall = true;
        }else if(params.data.useYn = "N"){
          event.target.parentElement.classList.replace("off", "on");
          saveCall = false;
        }
        if(saveCall){  
          saveImmediately(params);
        }
        
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
  doubleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  onGridReady: onGridReady1,
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}
function lookupValue(mappings, key) {
  return mappings[key];
}



var Params = reactive({
  contyCdNm : document.getElementById("contyCdNm")
});

// 조회
async function onSearchGrid1() {
  var searchLists = await store.tappSearchList(Params);
  grid1RowData.value = searchLists;
  grid1Api.value.setRowData(grid1RowData.value);

}

// 추가
function onAddRowGrid1() {
  var addRow = [
    {
      mode: "New",
      rowNum: grid1RowData.value.length + 1,
      ptnrNm: "",
      ptnrNo: "",
      ptnrYn: "",
    },
  ];
  var res = grid1Options.api.applyTransaction({ add: addRow });
  grid1Api.value.redrawRows();
}

//삭제
function onRemoveSelectedGrid1() {
  var selectedData = grid1Options.api.getSelectedRows();
  var res = grid1Options.api.applyTransaction({ remove: selectedData });
}

//저장
async function onSaveCheckedRowGrid1() {
  var selectedData = grid1Options.api.getSelectedRows();
  if (selectedData.length == 0) {
    alert("저장을 원하는 행을 선택해 주세요");
    return;
  }

  try {
    const res = await cdMgmtService.saveComCodes(selectedData);
  } catch (error) {
    console.error(err);
  }
}

async function saveImmediately(params){
  try {
    params.mode = "U";
    const res = await cdMgmtService.saveComCodes(params);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function onGridReady1(params) {
  grid1Api.value = params.api;
  //params.api.sizeColumnsToFit();
}

onBeforeMount(async () => {
});
</script>

<style scoped>
.grid_default {
  height: calc(100% - 130px);
}
</style>
