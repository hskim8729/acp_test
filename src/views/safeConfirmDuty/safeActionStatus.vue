<!-- 안전활동/종합조치활동 -->

<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage">
    <template #contents>
      <!-- 본문영역 -->
      <comp-ag-grid
        class="ag-theme-alpine"
        :columnDefs="columnDefs1"
        :rowData="grid1RowData"
        :defaultColDef="defaultColDef">
      </comp-ag-grid>
    </template>
  </comm-safe-duty>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  getCurrentInstance,
  createHydrationRenderer,
} from "vue";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { useRoute } from "vue-router";

import commSafeDuty from "@/views/common/commSafeDuty.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";

import { useMajorStore } from "@/stores/safeActvt/major-store";
import majorService from "@/api/services/safeActvt/major-service";

// Store Data
const route = useRoute();
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useMajorStore();

const commSafeDutyParams = {
  pageTitle: "위험성평가 조치현황",
  infoMessage: `<span class="font-weight-bold">위험성평가로 도출된 항목 중 <span class="text-red">허용 불가능한 위험 수준</span>의 요인들을 <span class="text-red">조치</span></span>합니다.<br>
<span class="font-weight-bold">안전활동 > 중점점검/중점점검 조치</span> 메뉴에서 점검할 수 있습니다.`,
};

const crtrDt = ref("");

// Row&Param Data
const grid1RowData = ref([]);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const defaultColDef = {
  flex: 1,
  minWidth: 50,
  headerClass: "centered",
  cellClass: "centered",
};

function onGridReady1(mappings, key) {
  return Object.keys(mappings);
}

function onGrid1RowClicked(mappings, key) {
  return mappings[key];
}

const columnDefs1 = [
  {
    headerName: "점검일자",
    //field: "sortNm",
    field: "inspDt",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 200,
    maxWidth: 200,
    cellRenderer: (params) => {
      const dt = params.data.inspDt;
      if (dt != null) {
        return (
          dt.substring(0, 4) + "-" + dt.substring(4, 6) + "-" + dt.substring(6)
        );
      } else {
        return null;
      }
    },
  },
  {
    headerName: "중점점검(A)",
    // field: "workNm",
    field: "data1",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 150,
    maxWidth: 150,
  },
  {
    headerName: "점검등록(B)",
    //field: "position",
    field: "data2",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 150,
    maxWidth: 150,
  },
  {
    headerName: "조치중(C)",
    //field: "danger",
    field: "data3",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 150,
    maxWidth: 150,
  },
  {
    headerName: "미점검(A-(B+C))",
    //field: "factor",
    field: "data4",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 200,
    maxWidth: 200,
  },
  {
    headerName: "점검결과",
    children: [
      {
        headerName: "양호(C)",
        field: "data5",
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 100,
        maxWidth: 200,
      },
      {
        headerName: "조치요청(E)",
        field: "data6",
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 100,
        maxWidth: 200,
      },
    ],
  },
  {
    headerName: "조치완료(F)",
    //field: "measure",
    field: "data7",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 120,
    maxWidth: 120,
    // cellRenderer: (params) => {
    //   console.log(params);
    //   const eDiv = document.createElement('div');
    //   //eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");

    //   return eDiv;
    // }
  },
  {
    headerName: "미조치(E-F)",
    field: "data8",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 80,
    maxWidth: 160,
  },
  {
    headerName: "조치율(%)(F/E)",
    //field: "status",
    field: "data9",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 300,
    maxWidth: 300,
  },
];

const grid1Options = {
  headerHeight: 35,
  rowHeight: 53,
  columnDefs: columnDefs1,
  rowData: grid1RowData,
  defaultColDef: defaultColDef,
  undoRedoCellEditing: true,
  singleClickEdit: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  onGridReady: onGridReady1,
  onRowClicked: onGrid1RowClicked,
};

// 점검데이터 Load 버튼
async function loadData() {}

async function gridData(e = null) {
  // 기준일자 현재날짜로 자동입력
  let current = null;
  if (!e) {
    current = new Date();
  } else {
    current = new Date(e.target.value);
  }

  let year = current.getFullYear();
  let month = current.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  const date = year + "-" + month;
  crtrDt.value = "2024-08"; // date;

  const params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    yearMonth: crtrDt.value.replaceAll("-", ""),
    inspCls: "T0201",
  };
  try {
    const res = await store.selectPntInspDsctnSttusList(params);
    if (res.data.length > 0) {
      if (res.data != "" && res.status === 200) {
        let rowData = [];
        res.data.forEach((item, index) => {
          if (item.data1 !== "-") {
            rowData.push(item);
            res.data.slice(index);
          }
        });
        grid1RowData.value = rowData;
        // grid1RowData.value = res.data;
      } else {
        alert(res.data.message);
      }
    } else {
      alert(res.data.message);
      return;
    }
  } catch (err) {
    console.log("MajorActionActivity.vue > gridData() > err : ", err);
    throw err;
  }
}

onBeforeMount(() => {
  gridData();
});
</script>

<style scoped>
#grid01 {
  height: calc(100% - 130px);
}

.inpection_action {
  width: 800px;
  height: 800px;
}

.inpection_reject {
  width: 700px;
  height: 530px;
}
</style>
