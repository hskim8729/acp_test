<!-- 안전점검활동/위험성평가 -->

<template>
  <div class="page_title_area">
    <div class="title">위험성평가</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 안전점검활동 >
      위험성평가
    </nav>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">위험성평가 표 목록</span>
    </div>

    <div class="content_box">
      <div class="item_wrap w30p">
        <span class="title">회의일시</span>
        <input
          type="date"
          style="width: 150px"
          max="9999-12-31"
          v-model="searchForm.stMtTm" /><span> ~ </span
        ><input
          type="date"
          style="width: 150px"
          max="9999-12-31"
          v-model="searchForm.enMtTm" />
      </div>
      <div class="item_wrap w20p">
        <span class="title">업체명</span>
        <input
          type="text"
          v-model="searchForm.vendrNm"
          @keydown.enter="search" />
      </div>
      <div class="item_wrap w30p">
        <span class="title">구분</span>
        <select v-model="searchForm.evalType">
          <option value="">전체</option>
          <option
            v-for="evalType in evalTypeList"
            :value="evalType.comCd"
            :key="evalType.comCd">
            {{ evalType.comCdNm }}
          </option>
        </select>
      </div>
      <button class="search" @click="search">조회</button>
    </div>

    <div class="grid_default" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :gridOptions="gridOptions"
        :rowData="gridRowData">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script setup>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";
import { AgGridVue } from "ag-grid-vue3";
import { useRouter } from "vue-router";
import { ref, onBeforeMount, getCurrentInstance } from "vue";
import dayjs from "dayjs";

const router = useRouter();
const store = useRiskAssessmentStore();
const cdMgmtStore = useCdMgmtStore();

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const siteInfo = $loginStore.$state.siteInfo;
const userInfo = $loginStore.$state.userInfo;
const vendrInfo = $loginStore.$state.vendrInfo;

const gridApi = ref();
const evalTypeList = ref([]);

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
const gridRowData = ref([]);

const columnDefs = [
  {
    headerName: "회의일시",
    field: "mtTm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "구분",
    field: "evalTypeNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "회차",
    field: "evalSeq",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "회의명",
    field: "mtNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "공종",
    field: "contyCdNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "업체명",
    field: "vendrNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "담당자",
    field: "userNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "상태",
    field: "statsCdNm",
    width: 200,
    cellStyle: (params) => {
      if (["T1305", "T1306", "T1307"].includes(params.data.statsCd)) {
        return { textAlign: "center", color: "red" };
      }
      return { textAlign: "center" };
    },
  },
  {
    headerName: "작성/보기",
    field: "modifyBtn",
    cellStyle: { textAlign: "center" },
    sortable: false,
    editable: false,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="modify"></button>';
      return eDiv;
    },
    onCellClicked: (params) => {
      // 위험성평가 작성화면 이동
      router.push({
        name: "RiskAssmn",
        state: params.data,
      });
    },
  },
];

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
};

const gridOptions = {
  headerHeight: 40,
  rowHeight: 53,
  defaultColDef: defaultColDef,
  columnDefs: columnDefs,
  singleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  suppressCellFocus: true,
  onGridReady: onGridReady,
};

const searchForm = ref({
  stMtTm: "",
  enMtTm: "",
  vendrNm: "",
  evalType: "",
});

async function search() {
  const searchParams = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    evalTblWrtrId: userInfo.userId,
    wrtrVendrCd: userInfo.vendrCd,
    stMtTm: searchForm.value.stMtTm,
    enMtTm: searchForm.value.enMtTm,
    vendrNm: searchForm.value.vendrNm,
    evalType: searchForm.value.evalType,
  };

  // 위험성평가 목록 조회
  gridRowData.value = await store.fetchRiskAssmnList(searchParams);
}

const refresh = async () => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  // 회의일시 초기값 3개월로 셋팅
  searchForm.value.stMtTm = dayjs()
    .subtract(2, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  searchForm.value.enMtTm = dayjs().endOf("month").format("YYYY-MM-DD");

  // 공사종류 코드목록 조회
  store.fetchContyCdList({ vendrCd: siteInfo.vendrCd });

  /*
  // 로그인 한 사람의 회사코드, 현장코드, 로그인ID 값으로 전달하도록 변경해야함
  const params = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    evalTblWrtrId: userInfo.userId,
    wrtrVendrCd: userInfo.vendrCd,
  };

  // 위험성평가 목록 조회
  gridRowData.value = await store.fetchRiskAssmnList(params);
  */

  search();

  // 공통코드(평가 유형) 조회 후 주간(T0804) 제외
  const res = await cdMgmtStore.fetchComCodeList({ comCd: "T08" });
  evalTypeList.value = res.filter((evalType) => evalType.comCd !== "T0804");

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

onBeforeMount(() => {
  refresh();
});
</script>

<style scoped>
#grid01 {
  height: calc(100% - 130px);
}
</style>
