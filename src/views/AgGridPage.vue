<template>
  <br />
  <input type="date" style="width: 120px" v-model="todayStr" min="2023-10-17" />
  &nbsp;<button @click="getGrid1Data">그리드데이터</button>&nbsp;<button
    @click="addEmptyGrid1Data">
    행추가
  </button>
  <br />
  <ag-grid-vue
    style="width: 1000px; height: 40%"
    class="ag-theme-alpine"
    :columnDefs="columnDefs1"
    :rowData="grid1RowData"
    :defaultColDef="defaultColDef"
    :singleClickEdit="true"
    :undoRedoCellEditing="true"
    :undoRedoCellEditingLimit="20"
    :localeText="localeText"
    @grid-ready="onGridReady"
    :stopEditingWhenCellsLoseFocus="true"
    @row-clicked="onRowClicked">
  </ag-grid-vue>
  <br />
  <ag-grid-vue
    style="width: 1000px; height: 40%"
    class="ag-theme-alpine"
    :columnDefs="columnDefs2"
    :rowData="grid2RowData"
    :defaultColDef="defaultColDef"
    :singleClickEdit="true"
    :undoRedoCellEditing="true"
    :undoRedoCellEditingLimit="20"
    :localeText="localeText"
    @grid-ready="onGridReady2"
    :stopEditingWhenCellsLoseFocus="true"
    :suppressRowTransform="true"
    :tooltipShowDelay="tooltipShowDelay"
    :tooltipHideDelay="tooltipHideDelay">
  </ag-grid-vue>
</template>

<script setup>
import { axiosApiDEV } from "@/api";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { onBeforeMount, ref } from "vue";

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜

const todayStr = ref(year + "-" + month + "-" + date);

const stdClsMappings = {
  1: "공단표준",
  2: "사용자정의표준",
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}

function lookupValue(mappings, key) {
  return mappings[key];
}

const stdClsCds = extractKeys(stdClsMappings);

const columnDefs1 = [
  {
    headerName: "기본",
    field: "bsSlt",
    width: "80px",
    editable: false,
    cellStyle: { textAlign: "center" },
    headerClass: "cellCenter1",
    filter: false,

    cellRenderer: (params) => {
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "radio1";
      input.checked = params.data.bsSlt == 1 ? "checekd" : "";

      input.addEventListener("click", function (event) {
        if (params.data.bsSlt == "1") {
          params.data.bsSlt = "10";
        } else {
          params.data.bsSlt = "01";
        }

        grid1RowData.value.forEach((rowData) => {
          if (rowData.bsSlt == "10") rowData.bsSlt = "0";
          else if (rowData.bsSlt == "01") rowData.bsSlt = "1";
          else rowData.bsSlt = "0";
        });
      });
      return input;
    },
  },
  {
    headerName: "공사예정일",
    field: "constDate",
    cellStyle: { textAlign: "center" },
    width: "110px",
    filter: true,
    headerClass: "ag-right-header",
    cellEditor: "agDateStringCellEditor",
    cellEditorParams: {
      min: "2000-01-01",
    },
  },
  {
    headerName: "구분",
    field: "stdClsNm",
    editable: true,
    width: "110px",
    filter: true,
    cellStyle: { textAlign: "center" },
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: stdClsCds,
    },
    filterParams: {
      valueFormatter: (params) => {
        return lookupValue(stdClsMappings, params.value);
      },
    },
    valueFormatter: (params) => {
      return lookupValue(stdClsMappings, params.value);
    },
  },
  {
    headerName: "표준명",
    field: "stdNm",
    width: "110px",
    filter: true,
    editable: true,
  },
  {
    headerName: "설명",
    field: "stdDsc",
    filter: true,
    editable: true,
    width: 200,
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    cellRenderer: (params) => {
      console.log(params);
      const eDiv = document.createElement("div");
      eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");

      return eDiv;
    },
  },
  {
    headerName: "버튼",
    field: "btn",
    sortable: false,
    editable: false,
    width: "50px",
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        '<span class="my-css-class"><button class="btn-delete">삭제</button></span>';
      const eButton = eDiv.querySelectorAll(".btn-delete")[0];

      eButton.onclick = function () {
        alert(params.data.stdNm);
      };

      return eDiv;
    },
  },
];

const columnDefs2 = [
  {
    headerName: "대분류",
    field: "lgCatNm",
    width: "100px",
    editable: false,
    filter: true,
    cellStyle: { textAlign: "center" },
    tooltipField: "hdLgCatNm",
    tooltipComponentParams: { color: "#ececec" },
    rowSpan: rowSpan,
    cellClassRules: { "show-cell": 'value !== undefined && value !== ""' },
  },
  {
    headerName: "중분류",
    field: "mdCatNm",
    width: "100px",
    editable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
    tooltipField: "hdMdCatNm",
    tooltipComponentParams: { color: "#ececec" },
    rowSpan: rowSpan,
    cellClassRules: { "show-cell": 'value !== undefined && value !== ""' },
  },
  {
    headerName: "소분류",
    field: "smCatNm",
    width: "100px",
    editable: false,
    filter: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "공종명",
    field: "wrkNm",
    editable: false,
    filter: false,
    wrapText: true,
    autoHeight: true,
  }, //줄바꿈 옵션 wrapText:true, autoHeight:true
  {
    headerName: "버튼",
    field: "btn",
    sortable: false,
    editable: false,
    width: "50px",
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        '<span class="my-css-class"><button class="btn-delete">삭제</button></span>';
      const eButton = eDiv.querySelectorAll(".btn-delete")[0];

      eButton.onclick = function () {
        alert(params.data.wrkNm);
      };

      return eDiv;
    },
  },
];

const defaultColDef = {
  editable: true,
  sortable: true,
  minWidth: 50,
  filter: false,
  resizable: true,
  tooltipComponent: "CustomTooltip",
  headerClass: "centered",
  cellClass: "centered",
};

const tooltipShowDelay = ref(null);
const tooltipHideDelay = ref(null);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const grid1Api = ref(null);
const grid1ColumnApi = ref(null);
const grid2Api = ref(null);
const grid2ColumnApi = ref(null);

function onRowClicked(event) {
  event.node.setSelected(true);

  if (event.node.data.rowNum === "1") {
    grid2RowData.value = [
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 자재,장비반입,운반,보관",
        btn: "1",
      },
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공",
        btn: "2",
      },
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 자재,장비반입,운반,보관111",
        btn: "3",
      },
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공",
        btn: "4",
      },
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공5555",
        btn: "5",
      },
      {
        hdLgCatNm: "기초파일작업1",
        lgCatNm: "기초파일작업1",
        lgCatRowSpan: "6",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공",
        btn: "6",
      },
      {
        hdLgCatNm: "철근공사1",
        lgCatNm: "철근공사1",
        hdMdCatNm: "거푸집 작업",
        mdCatNm: "거푸집 작업",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        smCatNm: "",
        wrkNm: "거푸집 자재,장비반입,운반,보관",
        btn: "5",
      },
      {
        hdLgCatNm: "철근공사1",
        lgCatNm: "철근공사1",
        hdMdCatNm: "거푸집 작업",
        mdCatNm: "거푸집 작업",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        smCatNm: "",
        wrkNm: "거푸집 동바리조립",
        btn: "6",
      },
    ];
  } else if (event.node.data.rowNum === "2") {
    grid2RowData.value = [
      {
        hdLgCatNm: "기초파일작업2",
        lgCatNm: "기초파일작업2",
        lgCatRowSpan: "2",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 자재,장비반입,운반,보관",
        btn: "1",
      },
      {
        hdLgCatNm: "기초파일작업2",
        lgCatNm: "기초파일작업2",
        lgCatRowSpan: "2",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공",
        btn: "2",
      },
      {
        hdLgCatNm: "철근공사2",
        lgCatNm: "철근공사2",
        hdMdCatNm: "거푸집 작업",
        mdCatNm: "거푸집 작업",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        smCatNm: "",
        wrkNm: "거푸집 자재,장비반입,운반,보관",
        btn: "3",
      },
      {
        hdLgCatNm: "철근공사2",
        lgCatNm: "철근공사2",
        hdMdCatNm: "거푸집 작업",
        mdCatNm: "거푸집 작업",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        smCatNm: "",
        wrkNm: "거푸집 동바리조립",
        btn: "4",
      },
    ];
  } else if (event.node.data.rowNum === "3") {
    grid2RowData.value = [
      {
        hdLgCatNm: "기초파일작업3",
        lgCatNm: "기초파일작업3",
        lgCatRowSpan: "2",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 자재,장비반입,운반,보관",
        btn: "1",
      },
      {
        hdLgCatNm: "기초파일작업3",
        lgCatNm: "기초파일작업3",
        lgCatRowSpan: "2",
        mdCatNm: "",
        smCatNm: "",
        wrkNm: "기초파일 천공",
        btn: "2",
      },
      {
        hdLgCatNm: "철근공사3",
        lgCatNm: "철근공사3",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        mdCatNm: "거푸집 작업",
        hdMdCatNm: "거푸집 작업",
        smCatNm: "",
        wrkNm: "거푸집 자재,장비반입,운반,보관",
        btn: "3",
      },
      {
        hdLgCatNm: "철근공사3",
        lgCatNm: "철근공사3",
        lgCatRowSpan: "2",
        mdCatRowSpan: "2",
        mdCatNm: "거푸집 작업",
        hdMdCatNm: "거푸집 작업",
        smCatNm: "",
        wrkNm: "거푸집 동바리조립",
        btn: "4",
      },
    ];
  } else {
    grid2RowData.value = [];
  }

  var lgCatNm = grid2RowData.value[0].lgCatNm;
  var lgCatCnt = 0;
  grid2RowData.value.forEach((obj) => {
    if (lgCatNm !== obj.lgCatNm) {
      lgCatNm = obj.lgCatNm;
    } else {
      if (lgCatCnt != 0 && lgCatNm === obj.lgCatNm) {
        // delete obj.lgCatNm;
        obj.lgCatNm = "";
      }
    }

    lgCatCnt++;
  });

  var mdCatNm = grid2RowData.value[0].mdCatNm;
  var mdCatCnt = 0;
  grid2RowData.value.forEach((obj) => {
    if (mdCatNm !== obj.mdCatNm) {
      mdCatNm = obj.mdCatNm;
    } else {
      if (mdCatCnt != 0 && mdCatNm === obj.mdCatNm) {
        // delete obj.mdCatNm;
        obj.mdCatNm = "";
      }
    }

    mdCatCnt++;
  });

  console.log(grid2RowData.value);
}

function getGrid1Data(event) {
  console.log(grid1Api);
  console.log(grid1RowData);
}

function addEmptyGrid1Data() {
  grid1RowData.value = [
    ...grid1RowData.value,
    {
      rowNum: grid1RowData.value.length + 1,
      bsSlt: "0",
      stdClsNm: "2",
      stdNm: "",
      stdDsc: "",
      constDate: todayStr.value,
      btn: grid1RowData.value.length + 1,
    },
  ];
}

function onGridReady(event) {
  grid1Api.value = event.api;
  grid1ColumnApi.value = event.columnApi;
  event.api.sizeColumnsToFit();
}

function onGridReady2(event2) {
  grid2Api.value = event2.api;
  grid2ColumnApi.value = event2.columnApi;
  event2.api.sizeColumnsToFit();
}

function doSearch(params) {
  // 인증이 완료되면 AccessToken, 사용자 정보, 사용가능한 메뉴,
  // 메뉴별 권한 정보를 리턴
  return new Promise((resolve, reject) => {
    axiosApiDEV
      .post(`/v1/cum/login`, params)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const doSearchParams = {};
const grid1RowData = ref([]);
const grid2RowData = ref([]);

function rowSpan(params) {
  if (params.column.colId === "lgCatNm") {
    return params.data.lgCatRowSpan;
  } else if (params.column.colId === "mdCatNm") {
    return params.data.mdCatRowSpan;
  }
}

onBeforeMount(async () => {
  tooltipShowDelay.value = 0;
  tooltipHideDelay.value = 2000;

  //테스트 용
  // await fetch('http://localhost:7000/gridData')
  //               .then((result) => result.json())
  //               .then((remoteRowData) => {
  //                 console.log(remoteRowData);

  //                 grid1RowData.value = remoteRowData;
  //               });

  // grid1RowData.value = await doSearch(doSearchParams);
  grid1RowData.value = [
    {
      rowNum: "1",
      bsSlt: "1",
      stdClsNm: "1",
      stdNm: "KRA",
      stdDsc:
        "산업안전보건공단 제공 표준(KRA)산업산업안전보건공단 제공 표준(KRA)안전보건공단 제공 표준(KRA)",
      constDate: "2023-10-13",
      btn: "1",
    },
    {
      rowNum: "2",
      bsSlt: "0",
      stdClsNm: "1",
      stdNm: "SIF",
      stdDsc: "산업안전보건공단 제공 표준(SIF)",
      constDate: "2023-10-14",
      btn: "2",
    },
    {
      rowNum: "3",
      bsSlt: "0",
      stdClsNm: "2",
      stdNm: "SM상선(아파트)",
      stdDsc: "아파트용 회사 표준",
      constDate: "2023-10-16",
      btn: "3",
    },
  ];
});
</script>
<style>
.ag-header-cell-label,
.ag-header-group-cell {
  justify-content: center;
}

.show-cell {
  background: white;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
  border-bottom: 1px solid lightgrey !important;
}

.custom-tooltip {
  width: 150px;
  height: 70px;
  border: 1px solid cornflowerblue;
  overflow: hidden;
}
.custom-tooltip p {
  margin: 5px;
  white-space: nowrap;
}
.custom-tooltip p:first-of-type {
  font-weight: bold;
}
</style>
