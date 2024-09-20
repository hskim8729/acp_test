<!-- 팝업 - 전사 표준 위험요인 템플릿 -->
<template>
  <div class="popup risk_factor_reg">
    <div class="popup_title">
      <span>전사 표준 위험요인</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_default" id="grid01">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions"
          :rowData="gridRowData">
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="selectedRiskFactor">선택</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, defineProps } from "vue";
import { useRiskFactorStandardStore } from "@/stores/stdMgmt/risk-factor-standard-store";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { storeToRefs } from "pinia";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useRouter } from "vue-router";

// 로그인 세션
const loginStore = useLoginAuthStore();
const router = useRouter();

const userId = loginStore.$state.userInfo.userId;
const vendrCd =
  loginStore.$state.vendrInfo.ptnrYn == "Y"
    ? loginStore.$state.vendrInfo.vendrUpperCd
    : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;

const gridRowData = ref([]);
const gridApi = ref();

const store = useRiskFactorStandardStore();
const siteStore = useSiteRiskFactorRegulationStore();

const { localeText, doSearch } = defineProps(["localeText", "doSearch"]);

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const columnDefs = [
  {
    headerName: "구분",
    field: "stdClsNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 400,
    checkboxSelection: true,
  },
  {
    headerName: "표준명",
    field: "stdNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
    maxWidth: 400,
  },
  {
    headerName: "설명",
    field: "stdDc",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 500,
    maxWidth: 1000,
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
  cellStyle: { textAlign: "center" },
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
  rowSelection: "single",
  onGridReady: onGridReady,
};

onBeforeMount(async () => {
  const param = {
    vendrCd: vendrCd,
  };
  // 전사 템플릿 조회
  const templateList = await store.fetchTemplateList(param);

  if (templateList) gridRowData.value = templateList;
});

//현장 표준 위험요인 등록
async function selectedRiskFactor() {
  const getRow = gridOptions.api.getSelectedRows()[0];

  const saveParam = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: getRow.hrmrskFctrMstSeq, //전사 위험 요인 마스터 순번
    stdClsCd: getRow.stdClsCd,
    stdNm: getRow.stdNm,
    stdDc: getRow.stdDc,
    userId: userId,
  };

  if (!confirm("선택하신 표준위험요인으로 등록하시겠습니까?")) return;

  // 현장 표준 위험요인 등록
  try {
    const res = await siteStore.fetchsaveSiteHrmrskFctr(saveParam);

    if (res.data == "OK") {
      alert("정상적으로 처리하였습니다.");
      gridOptions.api.deselectAll(); // 선택 초기화
      doSearch();
      popupClose();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function popupClose() {
  gridOptions.api.deselectAll(); // 선택 초기화
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document
    .getElementsByClassName("popup risk_factor_reg")[0]
    .classList.remove("show");
}
</script>

<style scoped>
#grid01 {
  float: left;
  width: 100%;
  height: 240px;
}

.ag-theme-alpine {
  float: left;
}
</style>
