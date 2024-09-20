<!-- 안전점검활동/합동안전점검 -->

<template>
  <compPage title="합동 안전점검">
    <compPageCard isFillPage>
      <template #subTitle>
        <span class="title">안전점검 회의목록</span>
      </template>
      <template #subTitleBody>
        <comp-button
          text="신규등록"
          @click="goDetailPage('N')"
          v-if="!isAdmin"
          requiredAuth></comp-button>
      </template>
      <template #default>
        <comp-ag-grid
          :columnDefs="columnDefs1"
          :rowData="grid1RowData"
          :singleClickEdit="true"
          @get-grid-api="getGridApi">
        </comp-ag-grid>
      </template>
    </compPageCard>
  </compPage>
</template>

<script setup>
import dayjs from "dayjs";
import { getCurrentInstance, onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";

import activitySafetyInspectionService from "@/api/services/inspcActvt/activity-safety-inspection-service";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";

let grid1RowData = ref([]);
const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const router = useRouter();
const domLayout = ref(null);
const siteImpRegStore = useSiteImpRegulationStore(); //현장실시규정

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useActivitySafetyIspStore();
const standReglStore = useStandReglStore();

const siteExeRuleStd = ref([]);
const riskLvlList = ref([]);

const apprUserParams = ref();

// Table Grid
const columnDefs1 = [
  {
    headerName: "차수",
    field: "evalSeq",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
  },
  {
    headerName: "회의명",
    field: "mtNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    // cellStyle: { textAlign: "center", cursor: "pointer" },
    // onCellClicked: (params) => {
    //   goDetailPage(params);
    // },
    editable: false,
    width: 300,
    flex: 3,
  },
  {
    headerName: "회의일시",
    field: "mtTm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 180,
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
    flex: 1,
  },
  {
    headerName: "상태",
    field: "stats",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 120,
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
  },
  {
    headerName: "상세보기",
    field: "detailBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        goDetailPage(params);
      },
      type: "modify",
      visible: true,
    }),
  },
  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        if (confirm("삭제하시겠습니까?")) {
          removeRow(params);
          alert("삭제되었습니다.");
        }
      },
      type: "del",
      visible: params.data.stats === "T0901",
    }),
  },
];

// 신규 등록 버튼 클릭 시
function newSaveCeck() {
  store.$state.searchList.mode = "I";
  store.$state.searchList.view = "N";
  router.push({
    name: "ActivitySafetyInspectionDetail",
    state: {
      siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
      riskLvlList: JSON.stringify(riskLvlList.value),
    },
  });
}

//그리드 준비완료 이벤트
let gridApi;
function getGridApi(params) {
  gridApi = params.api;
}

const removeRow = async (params) => {
  params.data.mode = "D";
  const selectedData = [params.data];
  gridApi.applyTransaction({ remove: selectedData });
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
};

/**
 * 상세페이지로 이동
 * viewMode가 V이면 읽기모드(View) / U이면 Edit모드(Register)
 */
const goDetailPage = (params) => {
  if (params === "N") {
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
    // viewMode가 V이면 읽기모드(View) / U이면 Edit모드(Register)
    const stats = params.data.stats;
    // 진행중(T0901) || 상신중(T0902) 이면 수정모드, 아니면 읽기모드
    const viewMode = stats === "T0901" || stats === "T0902" ? "U" : "V";

    params.data.mode = "U";
    store.$state.searchList = params.data;
    store.$state.searchList.mode = "U";
    store.$state.searchList.view = viewMode === "V" ? "V" : "N";

    router.push({
      name: "ActivitySafetyInspectionDetail",
      params: {
        mode: viewMode, //register
        prevPageParams: params,
        apprUserParams: apprUserParams,
      },
      state: {
        siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
        riskLvlList: JSON.stringify(riskLvlList.value),
      },
    });
  }
};

onBeforeMount(async () => {
  // 조회
  domLayout.value = "autoHeight";
  await initData();
});

const isAdmin = ref(false);
const initData = async () => {
  await validation();

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(fchParam);

  // 현장 실시 규정 표준 평가 절차 방법 조회
  riskLvlList.value = await standReglStore.riskLvlList(fchParam);
  let searchList = await activitySafetyInspectionService.searchList(fchParam);
  grid1RowData.value = searchList.data;

  // 관리자 여부
  isAdmin.value = $loginStore.$state.userInfo.admAcctYn === "Y";
};
</script>

<style scoped>
#grid01 {
  height: calc(100% - 40px);
  margin-bottom: 20px;
}
</style>
