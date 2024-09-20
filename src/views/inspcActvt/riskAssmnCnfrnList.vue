<template>
  <compPageCard subTitle="위험성 평가 회의 목록" isFillPage>
    <template #subTitleBody>
      <!-- 위험성 평가 회의 신규 등록 버튼 -->
      <comp-button text="신규등록" @click="addRiskAssessment" requiredAuth />
    </template>

    <!-- 위험성 평가 회의 목록 -->
    <comp-ag-grid
      :rowData="gridRowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      @get-grid-api="onGetParams" />

    <!-- 위험성평가 회의 등록 팝업 -->
    <popAddRiskAssessment
      v-if="isPopAddRiskAssessment"
      :siteExeRuleStd="siteExeRuleStd"
      :siteInfo="siteInfo"
      :userInfo="userInfo"
      :cnt="gridRowCnt"
      :isPopAddRiskAssessment="isPopAddRiskAssessment"
      @close="closePopAddRiskAssessment">
    </popAddRiskAssessment>
  </compPageCard>
</template>

<script setup>
// node_modules
import { getCurrentInstance, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
// 외부 변수 및 함수
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import popAddRiskAssessment from "@/views/inspcActvt/popup/popAddRiskAssessment.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
// sevice

const dialogStore = useDialogStore();

const router = useRouter();
const store = useRiskAssessmentStore();
const standReglStore = useStandReglStore();
const SiteImpRegulationStore = useSiteImpRegulationStore();

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const siteInfo = $loginStore.$state.siteInfo;
const userInfo = $loginStore.$state.userInfo;

const siteExeRuleStd = ref([]);

const apprCnt = ref(0); // 최종승인 여부 (0인경우 승인 안됨,  최종승인 경우 1)
const gridRowCnt = ref(0);

// 위험요인 표준db작성여부
const riskCnt = ref(0);

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
};

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
    width: 110,
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
    headerName: "평가표(승인완료/전체)",
    field: "riskEvalTblCnt",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "상태",
    field: "statsNm",
    cellStyle: { textAlign: "center" },
    width: 200,
  },
  {
    headerName: "편집",
    field: "modifyBtn",
    maxWidth: 80,
    cellStyle: { justifyContent: "center" },
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        // 위험성평가 회의 상세화면 이동
        router.push({
          name: "RiskAssmnCnfrnDetail",
          state: params.data,
        });
      },
      type: "modify",
    }),
  },
  {
    headerName: "회의",
    field: "modifyBtn",
    maxWidth: 80,
    cellStyle: { justifyContent: "center" },
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => onGoRiskAssmnDetail(params),
      type: "doc",
    }),
  },
  {
    headerName: "삭제",
    field: "delRiskEval",
    maxWidth: 80,
    cellStyle: { justifyContent: "center" },
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => deleteRiskAssmn(params),
      type: "del",
    }),
  },
];

const defaultColDef = {
  flex: 1,
};

const refresh = async () => {
  const params = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 위험성평가 회의 목록 조회
  gridRowData.value = await store.fetchRiskAssmnCnfrnList(params);

  gridRowCnt.value = gridRowData.value.length;

  // 공사종류 코드목록 조회
  store.fetchContyCdList(params);

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(params);
  // 현장 실시규정 표준 최종 승인여부
  apprCnt.value = await SiteImpRegulationStore.siteApprCnt(params);
  // 현장 위험대책 DB 조회
  riskCnt.value = await SiteImpRegulationStore.selectSiteRiskMstCnt(params);
};

onBeforeMount(() => {
  refresh();
});

const isPopAddRiskAssessment = ref(false);
const addRiskAssessment = () => {
  // 전체목록 건수
  const cntAll = gridRowData.value.length;

  // 이전차수 상태값
  const lastRowStats =
    cntAll > 0 ? gridApi.getDisplayedRowAtIndex(0).data.stats : "";

  // 전체목록 건수가 0건 이상이고 이전차수 상태가 완료('T0903')가 아닌경우 신규등록 불가.
  if (cntAll > 0 && lastRowStats !== "T0903") {
    dialogStore.openAlertDialog(
      "이전 차수에 완료되지 않은 위험성 평가가 있습니다.<br>완료 후 진행하시기 바랍니다."
    );
    return;
  }

  // 만약 siteExeRuleStd가 없을 경우 알람 메세지를 표시
  if (!siteExeRuleStd.value) {
    dialogStore.openAlertDialog(
      "현장 등록, 현장 실시규정, 현장 위험요인 작성 후 등록이 가능합니다.<br>작성을 완료하였는지 확인해 주세요."
    );
    return;
  }

  // 만약 siteExeRuleStd가 없을 경우 알람 메세지를 표시
  if (apprCnt.value === 0) {
    dialogStore.openAlertDialog(
      "현장실시규정이 승인되어 있지 않습니다.<br>승인 완료 후 진행하시기 바랍니다.",
      {
        callback: () => {
          router.push({
            path: "/SITE/siteImpRegulation",
            name: "siteImpRegulation",
          });
        },
      }
    );

    return;
  }

  // 만약 riskCnt 없을 경우 알람 메세지를 표시
  if (riskCnt.value === 0) {
    dialogStore.openAlertDialog(
      "위험요인DB 표준 작성이 완료되어 있지 않습니다.<br>작성 후 진행하시기 바랍니다.",
      {
        callback: () => {
          router.push({
            path: "/SITE/siteRiskFactorRegulation",
            name: "siteRiskFactorRegulation",
          });
        },
      }
    );

    return;
  }

  // 등록팝업 open
  isPopAddRiskAssessment.value = true;
};

const closePopAddRiskAssessment = (isRefresh) => {
  isPopAddRiskAssessment.value = false;
  if (isRefresh) {
    refresh();
  }
};

const deleteRiskAssmn = async (params) => {
  if (params.data.stats !== "T0901") {
    dialogStore.openAlertDialog("진행, 완료 상태에서는 삭제하실 수 없습니다.");
    return;
  }

  dialogStore.openConfirmDialog("삭제하시겠습니까?", {
    confirmCallback: async () => {
      const msg = await store.deleteRiskAssmnCnfrn(params.data);

      await refresh();

      dialogStore.openAlertDialog(msg);
    },
  });
};

const onGoRiskAssmnDetail = async (params) => {
  const Param = {
    vendrCd: params.data.vendrCd,
    siteCd: params.data.siteCd,
    evalType: params.data.evalType,
    evalSeq: params.data.evalSeq,
  };
  // 위험성평가 회의 상세 조회
  const tblInfo = await store.fetchRiskAssmnCnfrnDetail(Param);

  // 대상공종 목록 조회
  const tblInfoList = await store.fetchRiskAssmnCnfrnDetailContyList(Param);

  for (var i = 0; i < tblInfoList.length; i++) {
    // 대상공종 상태 값 승인완료(T1303) 유무 체크
    if (tblInfoList[i].statsCd !== "T1303") {
      dialogStore.openAlertDialog(
        "대상공종 상태값중 승인 완료되지 않은 공종이 있습니다."
      );
      return;
    }
  }

  const param = {
    vendrCd: params.data.vendrCd,
    siteCd: params.data.siteCd,
    evalType: params.data.evalType,
    evalSeq: params.data.evalSeq,
    pageFlag: "cnfrn",
    mtApprKey: tblInfo.mtApprKey,
    rvwOpnn: tblInfo.rvwOpnn === "null" ? "" : tblInfo.rvwOpnn,
  };

  // 위험성평가 회의 상세화면 이동
  router.push({
    name: "RiskAssmnCnfrn",
    state: param,
  });
};
</script>

<style lang="scss" scoped></style>
