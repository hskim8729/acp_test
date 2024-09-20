<!-- 안전점검활동/합동안전점검 -->

<template>
  <div class="page_title_area">
    <div class="title">합동 안전점검</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 안전점검활동 > 합동
      안전점검
    </nav>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">안전점검 회의목록</span>
      <div class="right_btn">
        <button @click="newSaveCeck">신규등록</button>
      </div>
    </div>
    <div class="grid_default" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="35"
        :rowHeight="53"
        :columnDefs="columnDefs1"
        :rowData="grid1RowData"
        :gridOptions="grid1Options"
        :singleClickEdit="true"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        :stopEditingWhenCellsLoseFocus="true">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import dayjs from "dayjs";
import {
  onBeforeMount,
  defineAsyncComponent,
  reactive,
  ref,
  getCurrentInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import { useApprStore } from "@/stores/common/appr-store";
import activitySafetyInspectionService from "@/api/services/inspcActvt/activity-safety-inspection-service";
import apprLine from "@/views/inspcActvt/riskAssmnCnfrnApprLine.vue";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

let grid1Api;
// let grid2Api;
let grid1ColumnApi = ref();
// let grid2ColumnApi = ref();
let grid1RowData = ref([]);
// let grid2RowData = ref([]);
const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const router = useRouter();
const domLayout = ref(null);
const siteImpRegStore = useSiteImpRegulationStore(); //현장실시규정

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useActivitySafetyIspStore();
const standReglStore = useStandReglStore();
const apprStore = useApprStore();

const siteExeRuleStd = ref([]);
const riskLvlList = ref([]);
let evalAttend = reactive([]);

var dtlParams = reactive({});
const apprUserParams = ref();
const apprUserList = ref([]);
const crntApprOver = ref({});

// Table Grid
const columnDefs1 = [
  {
    headerName: "차수",
    field: "evalSeq",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
  },
  {
    headerName: "회의명",
    field: "mtNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 300,
    maxWidth: 600,
  },
  {
    headerName: "회의일시",
    field: "mtTm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 200,
    cellEditor: "agDateStringCellEditor",
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        params.value !== null && params.value !== undefined
          ? dayjs(params.value.trim()).format("YYYY-MM-DD HH:mm")
          : "";
      return eDiv;
    },
    cellEditorParams: {},
  },
  {
    headerName: "장소",
    field: "plac",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 400,
  },
  {
    headerName: "상태",
    field: "stats",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 200,
    cellRenderer: (params) => {
      let stats = "";
      if (params.data.stats === "T0901") {
        stats = "진행중";
      } else if (params.data.stats === "T0902") {
        stats = "상신중";
      } else {
        stats = "승인완료";
      }
      return stats;
    },
    // valueFormatter: (params) => {
    //   let stats = "";
    //   stats = params.data.stats == 'T0902' ? "진행중" : "승인완료"
    //   return
    // },
  },
  {
    headerName: "상세보기",
    field: "detailBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="modify"></button>';
      const eButton = eDiv.querySelectorAll(".modify")[0];
      if (
        $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
        $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
        $loginStore.$state.userInfo.admAcctYn === "Y"
      ) {
        if (params.data.stats === "T0903") {
          eButton.onclick = function () {
            params.data.mode = "U";
            store.$state.searchList = params.data;
          };
        } else {
          eDiv.innerHTML =
            '<button class="modify" style="display: none"></button>';
        }
      } else {
        eButton.onclick = function () {
          params.data.mode = "U";
          store.$state.searchList = params.data;
        };
      }
      return eDiv;
    },
    onCellClicked: (event) => {
      if (
        $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
        $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
        $loginStore.$state.userInfo.admAcctYn === "Y"
      ) {
        if (event.data.stats === "T0903") {
          store.$state.searchList.mode = "U";
          store.$state.searchList.view = "V";
          router.push({
            name: "ActivitySafetyInspectionDetail",
            params: {
              mode: "V", //detail
              prevPageParams: event,
              apprUserParams: apprUserParams,
            },
            state: {
              siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
              riskLvlList: JSON.stringify(riskLvlList.value),
            },
          });
        }
      } else {
        store.$state.searchList.mode = "U";
        store.$state.searchList.view = "V";
        router.push({
          name: "ActivitySafetyInspectionDetail",
          params: {
            mode: "V", //detail
            prevPageParams: event,
            apprUserParams: apprUserParams,
          },
          state: {
            siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
            riskLvlList: JSON.stringify(riskLvlList.value),
          },
        });
      }
    },
  },
  {
    headerName: "편집",
    field: "modifyBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="modify"></button>';
      const eButton = eDiv.querySelectorAll(".modify")[0];
      if (
        $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
        $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
        $loginStore.$state.userInfo.admAcctYn === "Y"
      ) {
        if (params.data.stats === "T0901" || params.data.stats === "T0902") {
          eButton.onclick = function () {
            params.data.mode = "U";
            store.$state.searchList = params.data;
          };
        } else {
          eDiv.innerHTML =
            '<button class="modify" style="display: none"></button>';
        }
      } else {
        eDiv.innerHTML =
          '<button class="modify" style="display: none"></button>';
      }
      return eDiv;
    },
    onCellClicked: (event) => {
      if (event.data.stats === "T0901" || event.data.stats === "T0902") {
        store.$state.searchList.mode = "U";
        store.$state.searchList.view = "N";
        if (
          $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
          $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
          $loginStore.$state.userInfo.admAcctYn === "Y"
        ) {
          router.push({
            name: "ActivitySafetyInspectionDetail",
            params: {
              mode: "U", //register
              prevPageParams: event,
              apprUserParams: apprUserParams,
            },
            state: {
              siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
              riskLvlList: JSON.stringify(riskLvlList.value),
            },
          });
        } else {
          alert("안전관리자와 현장 소장만 편집가능합니다.");
          return false;
        }
      }
    },
  },
  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
    cellRenderer: (params) => {
      if (
        $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
        $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
        $loginStore.$state.userInfo.admAcctYn === "Y"
      ) {
        if (params.data.stats === "T0901") {
          const eDiv = document.createElement("div");
          eDiv.classList.add("cell_center");
          eDiv.innerHTML = '<button class="del"></button>';

          return eDiv;
        }
      }
    },
    onCellClicked: (event) => {
      if (
        $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
        $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
        $loginStore.$state.userInfo.admAcctYn === "Y"
      ) {
        if (event.data.stats === "T0901") {
          if (confirm("삭제하시겠습니까?")) {
            removeRow(event);
            alert("삭제되었습니다.");
          }
        }
      }
    },
  },
];

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
  onGridReady: onGridReady1,
};

// 신규 등록 버튼 클릭 시
function newSaveCeck() {
  if (
    $loginStore.$state.siteInfo.jbttlCd === "T0101" ||
    $loginStore.$state.siteInfo.jbttlCd === "T0102" ||
    $loginStore.$state.userInfo.admAcctYn === "Y"
  ) {
    store.$state.searchList.mode = "I";
    store.$state.searchList.view = "N";
    router.push({
      name: "ActivitySafetyInspectionDetail",
      state: {
        siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
        riskLvlList: JSON.stringify(riskLvlList.value),
      },
    });
  } else {
    alert("안전관리자와 현장 소장만 신규등록 가능합니다.");
    return false;
  }
}

// Row 클릭 시 하위 상세내역 목록 조회 (기능 제외)
/*async function onGrid1RowClicked(params) {
  // grid2RowData = [];
  // grid2Api.setRowData(grid2RowData.data);

  dtlParams.vendrCd = params.data.vendrCd;
  dtlParams.siteCd = params.data.siteCd;
  dtlParams.evalSeq = params.data.evalSeq;
  dtlParams.inspSeq = params.data.inspSeq;
  dtlParams.userId = $loginStore.$state.userInfo.userId;
  dtlParams.atchFileKey = params.data.atchFileKey;
  dtlParams.rvwOpnn = params.data.rvwOpnn
  dtlParams.mode = "S"

  apprUserParams.value = {
    vendrCd: params.data.vendrCd,
    siteCd: params.data.siteCd,
    apprKey: params.data.mtApprKey,
    userId: $loginStore.$state.userInfo.userId,
    userNm: $loginStore.$state.userInfo.userNm,
    jbttlNm: $loginStore.$state.siteInfo.jbttlNm,
    workNm: $loginStore.$state.userInfo.workNm,
    menuId: "2002000",
  };

  try {
    // const res = await activitySafetyInspectionService.dtlSearchList(dtlParams);
    const attend = await activitySafetyInspectionService.searchAttendList(dtlParams)

    evalAttend.value = attend.data;
    // grid2RowData = res.data;
    // grid2Api.setRowData(grid2RowData);

  } catch (err) {
    console.error(err);
    throw err;
  }
}*/

const getApprUserList = (list) => {
  apprUserList.value = list;
};

const getCrntApprOver = (data) => {
  console.log("getCrntApprOver >>>>>>>>>>>>>>> ", data);
  crntApprOver.value = data;
};

//그리드 준비완료 이벤트
function onGridReady1(params) {
  grid1Api = params.api;
  grid1ColumnApi.value = params.columnApi;
  params.api.sizeColumnsToFit();
}

const removeRow = async (params) => {
  params.data.mode = "D";
  const selectedData = [params.data];
  grid1Api.applyTransaction({ remove: selectedData });
  await store.deleteActivitySafetyIsp(params.data);
  await initData();
};

const fchParam = reactive({
  // vendrCd: $loginStore.$state.siteInfo.vendrCd,
  vendrCd:
    $loginStore.$state.vendrInfo.ptnrYn === "Y"
      ? $loginStore.$state.vendrInfo.vendrUpperCd
      : $loginStore.$state.vendrInfo.vendrCd,
  siteCd: $loginStore.$state.siteInfo.siteCd,
  userId: $loginStore.$state.userInfo.userId,
  division: "S",
});

// 유효성 체크(현장 실시규정, 위험요인 데이터 있을때 삭제 x)
const validParam = {
  vendrCd: fchParam.vendrCd,
  siteCd: fchParam.siteCd,
  division: "S", // 현장
};

// 유효성검사
const validation = async () => {
  // 현장 실시규정, 위험요인 여부 조회
  const regCnt = await siteImpRegStore.selectSiteStdMgMtStdImpRgltCnt(
    validParam
  );
  const riskCnt = await siteImpRegStore.selectSiteRiskMstCnt(validParam);
  // if(regCnt !== 0){
  //   alert("현장 실시규정 표준이 등록되어있어 삭제할 수 없습니다.");
  //   return router.back();
  // }

  // if(riskCnt !== 0){
  //   alert("현장 위험요인 표준이 등록되어있어 삭제할 수 없습니다.");
  //   return router.back();
  // }
};

onBeforeMount(async () => {
  // 조회
  domLayout.value = "autoHeight";
  await initData();
});

const initData = async () => {
  await validation();

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(fchParam);

  // 현장 실시 규정 표준 평가 절차 방법 조회
  riskLvlList.value = await standReglStore.riskLvlList(fchParam);
  let searchList = await activitySafetyInspectionService.searchList(fchParam);
  grid1RowData.value = searchList.data;
};
</script>

<style scoped>
#grid01 {
  height: calc(100% - 60px);
  margin-bottom: 20px;
}

.approval_margin {
  margin-top: 100px;
}

.item_title {
  margin-top: 30px;
}
</style>
