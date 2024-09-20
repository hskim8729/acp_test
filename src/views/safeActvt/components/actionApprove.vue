<!-- 중점/일상 조치 -->

<template>
  <compPage :title="`${inspClsNm} 승인`">
    <compPageCard isFillPage :isSearchBtn="true" @clickSearchBtn="doSearch">
      <template #queryArea>
        <v-col>
          <span class="title">기준년월</span>
          <input type="month" v-model="crtrDt" />
        </v-col>
        <v-col>
          <span class="title">결재상태</span>
          <select v-model="statsCd">
            <option value="">전체</option>
            <option value="T1001">상신</option>
            <option value="T1003">승인</option>
          </select>
        </v-col>
      </template>
      <template #subTitle>
        <span class="title">{{ inspClsNm }} 목록</span>
      </template>
      <template #default>
        <comp-ag-grid
          style="width: 100%; height: 100%"
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

  <!-- 일상점검활동 조치 팝업 -->
  <popInspectionAppr
    v-if="isPopActivityApprove"
    @close="closePopActivityApprove"
    :rowParams="rowParams"
    :key="rowParams"
    :title="`${inspClsNm} 조치`"
    @inspectionApprove="inspectionApprove"
    @inspectionReject="openPopActivityReject"
    isApprMode>
  </popInspectionAppr>

  <!-- 조치내역 반려 팝업 -->
  <popInspectionReject
    v-if="isPopActivityReject"
    @close="closePopActivityReject"
    ref="rejectComments"
    @rejectCommentsSubmit="rejectCommentsSubmit"
    modalWidth="40%"
    height>
  </popInspectionReject>
</template>

<script setup>
import { onMounted, ref, defineProps } from "vue";
import dayjs from "dayjs";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import popInspectionAppr from "@/views/safeActvt/popInspectionAppr.vue";
import popInspectionReject from "@/views/safeActvt/popInspectionReject.vue";
import {
  defaultColumnSafeActvt,
  defaultGridOptionSafeActvt,
} from "@/views/safeActvt/common/comGridSafeActvt.vue";

import commonService from "@/api/common-service.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

// Store Data
const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();

const props = defineProps({
  inspClsCd: {
    type: String,
    default: "T0201",
  },
});

const today = dayjs().format("YYYY-MM");
const crtrDt = ref(today);
const statsCd = ref("");
const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");

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
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actExptDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
    width: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actExptDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "조치자",
    field: "actMngr",
    cellStyle: { textAlign: "center" },
    width: 120,
    valueFormatter: (params) => {
      return params.data.actMngrNm;
    },
  },
  {
    headerName: "조치일",
    field: "actDt",
    cellStyle: { textAlign: "center" },
    width: 120,
    maxWidth: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actDt);
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
        openPopActivityApprove(params.data);
      },
      type: "modify",
    }),
  },
];

/**
 * 조회
 */
const doSearch = async () => {
  const params = {
    vendrCd: loginStore.siteInfo.vendrCd,
    siteCd: loginStore.siteInfo.siteCd,
    crtrDt: crtrDt.value.replaceAll("-", ""),
    userId: loginStore.userInfo.userId,
    inspCls: props.inspClsCd, //T0201: 중점 / T0202: 일상
    stats: statsCd.value || "",
  };

  await commonService
    .axiosCall("/v1/safeActvt/actAprv", params)
    .then((result) => {
      if (result.status === 200) {
        grid1RowData.value = result.data;
      } else {
        dialogStore.openAlertDialog(res.data.message);
      }
    });
};

/**
 * 중점/일상점검 조치 승인 Modal
 */
let rowParams = ref({});
let status = ref("");

const isPopActivityApprove = ref(false);

const openPopActivityApprove = async (data) => {
  rowParams.value = data;

  isPopActivityApprove.value = true;
};

const closePopActivityApprove = (isReload) => {
  isPopActivityApprove.value = false;

  if (isReload) {
    doSearch();
  }
};

/**
 * 중점/일상점검 조치 반려 Modal
 */
const isPopActivityReject = ref(false);

const openPopActivityReject = async (data) => {
  isPopActivityReject.value = true;
};

const closePopActivityReject = (isReload) => {
  isPopActivityReject.value = false;

  if (isReload) {
    doSearch();
  }
};

/**
 * 승인 버튼 클릭
 */
const inspectionApprove = () => {
  dialogStore.openConfirmDialog("승인하시겠습니까?", {
    confirmCallback: async () => {
      status.value = "appr";

      const param = getSubmitParam();
      const formData = new FormData();

      formData.append(
        "param",
        new Blob([JSON.stringify(param)], { type: "application/json" })
      );

      doApprove(formData);
    },
  });
};

/** 반려 버튼 클릭 */
const rejectCommentsSubmit = async () => {
  status.value = "rej";

  const rejectData = rejectComments.value.getData();
  const param = getSubmitParam(rejectData);

  let totalFileSize = 0;
  if (rejectData.uploadFileList.length > 0) {
    for (let file of rejectData.uploadFileList) {
      totalFileSize += file.size;
      if (1024 * 1024 * 10 < totalFileSize) {
        dialogStore.openAlertDialog("10MB 사이즈 미만만 업로드가 가능합니다.");
        return;
      }
    }
  }

  const formData = new FormData();
  rejectData.uploadFileList.forEach((file) => {
    formData.append(`files`, file);
  });

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  doApprove(formData);
};

/**
 * 승인/반려 파라미터 생성
 */
const rejectComments = ref(null);
const getSubmitParam = (rejectCommentsData = null) => {
  let statsCd = "";
  let rjctDtl = "";
  let actReqMsg = "";

  // 승인
  if (status.value === "appr") {
    statsCd = "T1003";
  }
  // 반려
  else if (status.value === "rej") {
    statsCd = "T1004";
    rjctDtl = rejectCommentsData.rjctDtl; // 부적합 사항
    actReqMsg = rejectCommentsData.actReqMsg; // 조치요구사항
  }

  const { vendrCd, siteCd, inspCls, inspSeq, inspDt, actSeq, contyNm } =
    rowParams.value;

  const param = {
    vendrCd,
    siteCd,
    inspCls,
    inspSeq,
    inspDt,
    actSeq,
    rjctSeq: 0,
    rjctDtl: rjctDtl,
    actReqMsg: actReqMsg,
    atchFileKey: "",
    stats: statsCd,
    contyCdNm: contyNm,
    lastInspDt: "",
    userId: loginStore.userInfo.userId,
  };

  return param;
};

/**
 * 승인/반려 처리
 */
const doApprove = async (formData) => {
  await commonService
    .axiosCall("/v1/safeActvt/pntActDsctnApprMst", formData)
    .then((result) => {
      if (result.data === "OK") {
        if (status.value === "appr") {
          dialogStore.openToastDialog("승인 되었습니다.");
          closePopActivityApprove(true);
        } else {
          dialogStore.openToastDialog("반려 되었습니다.");
          closePopActivityApprove();
          closePopActivityReject(true);
        }
      } else {
        dialogStore.openAlertDialog(res.data.message);
      }
    });
};

onMounted(() => {
  doSearch();
});
</script>

<style scoped></style>
