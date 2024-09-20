<!-- 현장등록/현장등록 -->

<template>
  <div class="page_title_area">
    <div class="title">현장등록</div>
    <nav v-if="false">
      <span><router-link to="/">홈</router-link></span> > 현장 > 현장목록
    </nav>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">현장 목록</span>
      <div class="right_btn">
        <comp-button type="new" @click="addSaveSite"></comp-button>
      </div>
    </div>
    <div class="grid_default3" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :rowData="grid1RowData"
        :gridOptions="grid1Options">
      </ag-grid-vue>
    </div>
  </div>

  <!-- 현장등록 팝업 -->
  <popAddSite :doSearch="doSearch"></popAddSite>

  <!-- 멤버쉽 팝업 -->
  <popPayPlan
    :siteInfo="siteInfo"
    :isPopPayPlan="isPopPayPlan"
    @close="isPopPayPlan = false"
    v-if="isPopPayPlan">
  </popPayPlan>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount, defineExpose, onMounted } from "vue";
import siteRegService from "@/api/services/site/site-reg-service";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteRegStore } from "@/stores/site/site-reg-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { useRouter, useRoute } from "vue-router";
import commonUtil from "@/utils/common-utils";
import popAddSite from "@/views/site/popAddSite.vue";
import popPayPlan from "@/views/payPlan/popPayPlan.vue";
import { upperCase } from "lodash";

const loginStore = useLoginAuthStore();
const siteRegStore = useSiteRegStore();
const siteImpRegStore = useSiteImpRegulationStore(); //현장실시규정

const cUtil = commonUtil;

var fchParams = reactive({
  vendrCd: loginStore.$state.userInfo.vendrCd,
  userId: loginStore.$state.userInfo.userId,
});

const router = useRouter();
const route = useRoute();

const grid1Api = ref();
const grid1RowData = ref([]);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

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

// 멤버쉽 버튼 랜더링
const payPlanRenderer = (params) => {
  const payPlan = params.data.payInfoDc || "";
  let payPlanBtn = "-";

  if (payPlan != "") {
    payPlanBtn = `<span class="pay_plan_icon">
        <button class="${payPlan.toLowerCase()} pa-0" style="cursor: auto;">${
      params.data.payInfoNm
    }</button>
        </span>`;
  }

  return payPlanBtn;
};

const siteInfo = ref(null);
const isPopPayPlan = ref(false);

const clickPayPlan = (params) => {
  const payPlan = params.data.payPlan || "";

  if (payPlan != "") {
    siteInfo.value = params.data;
    isPopPayPlan.value = true;
  }
};

const columnDefs1 = [
  {
    headerName: "현장명",
    field: "siteNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    minWidth: 300,
  },
  {
    headerName: "현장코드",
    field: "siteCd",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 300,
  },
  {
    headerName: "현장소장",
    field: "userNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 200,
  },
  {
    headerName: "발주처",
    field: "odr",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 250,
    maxWidth: 500,
  },
  {
    headerName: "진행상태",
    field: "state",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 250,
    maxWidth: 500,
  },
  {
    headerName: "등록일",
    field: "regDate",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 200,
  },
  {
    headerName: "구독 멤버쉽",
    field: "payPlanBtn",
    filter: false,
    cellStyle: { textAlign: "center", padding: "13px" },
    width: 120,
    maxWidth: 120,
    minWidth: 120,
    editable: false,
    cellRenderer: payPlanRenderer,
  },
  {
    headerName: "편집",
    field: "modifyBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    maxWidth: 70,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="modify"></button>';
      const eButton = eDiv.querySelectorAll(".modify")[0];

      eButton.onclick = function () {
        params.data.mode = "U";
      };
      return eDiv;
    },
    onCellClicked: (event) => {
      // 현장>현장개요
      router.push({
        name: "siteRegDetailPage",
        state: {
          dataObj: {
            vendrCd: event.data.vendrCd,
            siteCd: event.data.siteCd,
          },
        },
      });
    },
  },
  {
    headerName: "삭제",
    field: "siteDel",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 70,
    maxWidth: 70,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="del"></button>';

      return eDiv;
    },
    onCellClicked: (params) => {
      if (confirm("삭제하시겠습니까?")) {
        removeRow(params);
      }
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

onBeforeMount(async () => {
  doSearch();
});

onMounted(() => {
  const orderId = route.query.order_id;

  if (orderId) {
    // 멤버쉽 가입 후처리
    afterPay();
  }

  doSearch();
});

const afterPay = () => {
  const status = route.query.status;
  alert("결제가 완료되었습니다.");

  router.push({
    path: "/SITE/siteReg",
  });
};

async function doSearch() {
  //현장 목록 조회
  // const res = await siteRegStore.fetchselectSiteOpenList(fchParams);
  // grid1RowData.value = res.siteOpenList;

  const res = await siteRegStore.fetchselectSiteOpenList(fchParams);
  let list = res.siteOpenList;

  grid1RowData.value = list;
}

function onGridReady1(params) {
  grid1Api.value = params.api;
  params.api.sizeColumnsToFit();
}

//삭제
async function removeRow(removeParam) {
  const selectedData = [removeParam.data];

  const siteCd = selectedData[0].siteCd;

  // 유효성 체크(현장 실시규정, 위험요인 데이터 있을때 삭제 x)
  const validParam = {
    vendrCd: fchParams.vendrCd,
    siteCd: siteCd,
    division: "S", // 현장
  };

  // 현장 실시규정, 위험요인 여부 조회
  const regCnt = await siteImpRegStore.selectSiteStdMgMtStdImpRgltCnt(
    validParam
  );
  const riskCnt = await siteImpRegStore.selectSiteRiskMstCnt(validParam);

  if (regCnt != 0) {
    alert("현장 실시규정 표준이 등록되어있어 삭제할 수 없습니다.");
    return;
  }

  if (riskCnt != 0) {
    alert("현장 위험요인 표준이 등록되어있어 삭제할 수 없습니다.");
    return;
  }

  const params = {
    vendrCd: fchParams.vendrCd,
    siteCd: siteCd,
    atchFileKey: selectedData[0].atchFileKey,
    userId: fchParams.userId,
    mode: "D",
  };

  const formData = new FormData();

  // 현장 목록 FormData 추가
  formData.append(
    "params",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  try {
    // 첨부파일 삭제
    await siteRegStore.fetchDeleteFileSiteOpen(params);
    // 현장정보 삭제
    const res = await siteRegStore.fetchSiteSave(formData);

    if (res.data == "OK") {
      alert("정상적으로 처리하였습니다.");
      doSearch();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
}

// 신규 등록
async function addSaveSite() {
  // 유효성 체크(현장 실시규정, 위험요인 데이터 있을때 삭제 x)
  const validParam = {
    vendrCd: fchParams.vendrCd,
    division: "A", // 전사
  };

  const res = await siteImpRegStore.standReglSearchList(validParam);

  if (cUtil.nullCheck(res)) {
    alert(
      "[표준>실시규정 표준]이 등록되지 않았습니다. \n실시규정 표준 화면으로 이동합니다."
    );

    router.push({
      path: "/STD_MGMT/standardslmRegulation",
      name: "standardslmRegulation",
    });

    return;
  }

  // 현장 등록 체크 ( 추후 개발: 고객 가입 여부에 따른 현장 등록 수 체크)
  const rst = await siteRegStore.selectSiteOpenChk(validParam);

  if (rst.data != "OK") {
    alert(rst.data.message);
    return false;
  }

  document.getElementsByClassName("popup add_site")[0].classList.add("show");
}
</script>

<style scoped>
#grid01 {
  height: calc(100% - 40px);
}
.popup.add_site {
  width: 800px;
  height: 700px;
}
</style>
