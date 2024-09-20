<!-- 중점/일상 점검 -->

<template>
  <compPage :title="inspClsNm">
    <compPageCard isFillPage :isSearchBtn="true" @clickSearchBtn="doSearch">
      <template #queryArea>
        <v-col>
          <span class="title">기준일자</span>
          <input type="date" v-model="crtrDt" />
        </v-col>
      </template>
      <template #subTitle>
        <span class="title">{{ inspClsNm }} 목록</span>
      </template>
      <template #default>
        <comp-ag-grid
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="grid1RowData"
          :gridOptions="grid1Options"
          :singleClickEdit="true"
          @get-grid-api="getGridApi">
        </comp-ag-grid>
      </template>
    </compPageCard>
  </compPage>

  <!-- 일상/중점 점검 등록 팝업 -->
  <pop-inspection-action
    v-if="isPopInspectionAction"
    @close="isPopInspectionAction = false"
    :isEditabled="isReadonly"
    :rowParams="rowParams"
    :modeFlag="modeFlag"
    :key="rowParams"
    :title="`${inspClsNm} 등록`"
    ref="popInspectActionRef"
    @inspectionReg="inspectionReg">
  </pop-inspection-action>
</template>
<script setup>
import { ref, defineProps, onMounted } from "vue";
import dayjs from "dayjs";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import popInspectionAction from "@/views/safeActvt/popInspectionAction.vue";
import {
  defaultColumnSafeActvt,
  defaultGridOptionSafeActvt,
} from "@/views/safeActvt/common/comGridSafeActvt.vue";

import commonService from "@/api/common-service.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();

const props = defineProps({
  inspClsCd: {
    type: String,
    default: "T0201",
  },
});

const userId = loginStore.userInfo.userId;
const today = dayjs().format("YYYY-MM-DD");
const crtrDt = ref(today);
const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");

const popInspectActionRef = ref(null);

/**
 * 그리드 설정
 */
const gridApi = ref();
const getGridApi = (params) => {
  gridApi.value = params.api;
};

const grid1RowData = ref([]);
const grid1Options = { ...defaultGridOptionSafeActvt };
const columnDefs = [
  ...defaultColumnSafeActvt, // 중점/일상 그리드 공통 컬럼 불러오기
  {
    headerName: "조치예정일",
    field: "actExptDt",
    cellStyle: { textAlign: "center" },
    width: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actExptDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "조치일",
    field: props.inspClsCd === "T0201" ? "actDt" : "actReqDt",
    cellStyle: { textAlign: "center" },
    width: 120,
    cellRenderer: (params) => {
      const actDt =
        props.inspClsCd === "T0201" ? params.data.actDt : params.data.actReqDt;
      const dt = dayjs(actDt);

      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "상세보기",
    field: "confirmStatus",
    pinned: "right",
    cellStyle: { textAlign: "center" },
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        openPopInspectionAction(params.data);
      },
      type: "modify",
    }),
  },
];

// 조회 파라미터 생성
const getSearchParameter = () => {
  const params = {
    vendrCd: loginStore.siteInfo.vendrCd,
    siteCd: loginStore.siteInfo.siteCd,
    crtrDt: crtrDt.value.replaceAll("-", ""),
    inspCls: props.inspClsCd, //T0201: 중점 / T0202: 일상
    userId,
  };

  return params;
};

// 조회 버튼 클릭
let isToday = ref(false);
async function doSearch() {
  // 현재일자일때는 점검데이터 생성하고 아닐경우는 점검데이터 조회만 한다.
  if (crtrDt.value == today) {
    isToday.value = true;
    searchInit();
  } else {
    isToday.value = false;
    searchData();
  }
}

/**
 * 조회 - 점검데이터 생성
 */
async function searchInit() {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/insertPntInspDsctn", params)
    .then((result) => {
      searchData();

      // OK가 안오는데.. 메세지는 일부러 안띄워주는건가?? 혹시 에러처리 필요하면 주석해제..
      // if (result.data == "OK") {
      // } else {
      //   dialogStore.openAlertDialog(result.svrMessage);
      // }
    });
}

/**
 * 조회 - 점검데이터 조회
 */
async function searchData() {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/inspActv", params)
    .then((result) => {
      if (result.data) {
        grid1RowData.value = result.data;
      } else {
        grid1RowData.value = [];
      }
    });
}

/**
 * 중점/일상점검 등록 Modal
 */
let rowParams = ref({});
let modeFlag = ref();
let isReadonly = ref(true);

const isPopInspectionAction = ref(false);

const openPopInspectionAction = async (data = null) => {
  // 수정가능여부 체크
  await getEditModeInspectionAction(data);

  modeFlag.value = isReadonly.value ? "detail" : "reg";

  rowParams.value = data;
  rowParams.value.mode = modeFlag.value;

  isPopInspectionAction.value = true;
};

/**
 * 안전점검 현재 상태가 수정 가능인지 서버에서 한번더 체크
 */
const getEditModeInspectionAction = async (paramData) => {
  const param = {
    vendrCd: paramData.vendrCd,
    siteCd: paramData.siteCd,
    inspCls: paramData.inspCls,
    inspSeq: paramData.inspSeq,
    inspDt: paramData.inspDt,
    inspRst: paramData.inspRst,
  };

  await commonService
    .axiosCall("/v1/safeActvt/selectPntActDsctnCnt", param)
    .then((result) => {
      const { data } = result;
      if (data.cnt == 0 && param.inspRst != "0004" && isToday.value) {
        // 미점검이이고 오늘 데이터이면 수정 가능
        isReadonly.value = false;
      } else {
        // 나머지는 수정 불가능
        isReadonly.value = true;
      }
    });
};

/**
 * 점검내역 등록
 */
const inspectionReg = (params) => {
  const saveData = popInspectActionRef.value.createFormData();

  if (saveData) {
    dialogStore.openConfirmDialog("저장하시겠습니까?", {
      confirmCallback: async () => {
        await commonService
          .axiosCall("/v1/safeActvt/savePntInspDsctn", saveData)
          .then((result) => {
            if (result.data === "OK") {
              dialogStore.openToastDialog("정상적으로 처리하였습니다.");
              doSearch(); // 중점점검 목록 조회
              isPopInspectionAction.value = false;
            } else {
              dialogStore.openAlertDialog(result.data.message);
              doSearch(); // 중점점검 목록 조회
            }
          });
      },
    });
  }
};

onMounted(() => {
  doSearch();
});
</script>
<style lang=""></style>
