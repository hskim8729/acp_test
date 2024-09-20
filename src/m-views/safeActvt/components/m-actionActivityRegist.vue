<template>
  <mCompModal
    v-if="true"
    @close="goList"
    :isActions="isBtnSave"
    @modal-action="activitySave"
    :modalTitle="`${inspClsNm}등록`"
    actionBtnText="저장">
    <template #secondButton v-if="isBtnApprCncl || isBtnApprReq">
      <v-btn
        v-if="isBtnApprCncl"
        @click="activityReject"
        variant="flat"
        color="#366587"
        class="ma-0 rounded-0 m-btn w-100">
        승인요청취소
      </v-btn>
      <v-btn
        v-if="isBtnApprReq"
        @click="activityAction"
        variant="flat"
        color="#366587"
        class="ma-0 rounded-0 m-btn w-100">
        승인요청
      </v-btn>
    </template>

    <!-- 상세정보 공통 컴포넌트 -->
    <m-com-detail-safe-actvt
      menu-type="action"
      :detailInfo="detailInfo"
      :isDisabled="isReadonlyMode"
      :isActInfo="true"
      @update-data="handleUpdateDate">
      <template #instFileSlot>
        <insp-file-handler
          table="SFT_ATVT_INSP_DSCTN"
          readOnly
          :fileKey="inspExistingFile" />
      </template>
      <template #actFileSlot>
        <act-file-handler
          table="SFT_ATVT_ACT_DSCTN"
          :readOnly="!isEditabled"
          :fileKey="actExistingFile"
          ref="fileHandlerRef" />
      </template>
    </m-com-detail-safe-actvt>
  </mCompModal>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeMount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import {
  default as actFileHandler,
  default as inspFileHandler,
} from "@/components/file/m-fileHandler.vue";
import mComDetailSafeActvt from "@/m-views/safeActvt/common/m-comDetailSafeActvt.vue";
import mCompModal from "@/components/modal/mCompModal.vue";

import commonService from "@/api/common-service.js";

import commonUtil from "@/utils/common-utils";

import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useDialogStore } from "@/stores/common/dialog-store";

const router = useRouter();
const route = useRoute();
const loginAuth = useLoginAuthStore();
const adtnStore = useAdtnRiskStore();
const dialogStore = useDialogStore();
const cUtil = commonUtil;

const emits = defineEmits(["goList"]);
const props = defineProps({
  isDetail: {
    type: Boolean,
    default: false,
  },
  inspClsCd: {
    type: String,
    default: "T0201",
  },
  rowParams: {
    type: Object,
    default: {},
  },
});

const userId = loginAuth.$state.userInfo.userId;
const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");

const isReadonlyMode = ref(true);

const inspExistingFile = ref("");
const actExistingFile = ref("");
let tempFileList = ref([]);

const detailInfo = ref({
  contyCdNm: "",
  wrkNm: "",
  wrkLoc: "",
  hrmrskMtr: "",
  rskFctr: "",
  rskMsr: "",
  inspDt: new Date(),
  inspDtl: "",
  inspRst: "",
  actExptDt: new Date(), // 조치예정일
  actReqDt: new Date(), // 조치요청일
  actMngrNm: "",
  actDemandDtl: "",
  actDtl: "",
  actDt: new Date(), // 조치일자
  inspAtchFileKey: "",
  stats: "",
});

/**
 * 버튼권한 조회
 */
const isEditabled = ref(true);
const isBtnSave = ref(false); // 저장버튼
const isBtnApprReq = ref(false); // 승인요청버튼
const isBtnApprCncl = ref(false); // 승인요청취소버튼

const setBtnAuth = () => {
  const authMode = props.rowParams.authMode;
  isEditabled.value = authMode === "I";

  const stats = detailInfo.value.stats;
  const actSeq = detailInfo.value.actSeq;

  if (isEditabled.value) {
    // 상신하기 전에는 저장 가능
    if (stats != "T1001" && stats != "T1002" && stats != "T1003") {
      isBtnSave.value = true;
    }
    // 저장되었고 검토/승인일 때는 승인요청 가능
    if (actSeq != "" && stats != "T1001" && stats != "T1004") {
      isBtnApprReq.value = true;
    }
    // 상신일 때는 승인요청취소 가능
    if (actSeq != "" && stats == "T1001") {
      isBtnApprCncl.value = true;
    }
  }
};

/**
 * 조회 파라미터 조회
 */
const getSearchParameter = () => {
  const paramData = props.rowParams;

  const param = {
    vendrCd: paramData.vendrCd,
    siteCd: paramData.siteCd,
    inspCls: paramData.inspCls,
    inspSeq: paramData.inspSeq,
    inspDt: paramData.inspDt,
    inspRst: paramData.inspRst,
    actSeq: paramData.actSeq,
    actAtchFileKey: paramData.actAtchFileKey,
  };

  return param;
};

/**
 * 상세내역 조회
 */
const doSearch = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/selectPntActDsctn", params)
    .then((result) => {
      let { data } = result;
      detailInfo.value = data;

      if (data) {
        detailInfo.value.authMode = props.rowParams.authMode;
        detailInfo.value.inspRst = "0002"; // 조치요청으로 고정

        // 파일 프리뷰 위해 서버에 업로드 된 파일 리스트 생성
        // 점검결과
        if (data.inspAtchFileKey) {
          inspExistingFile.value = data.inspAtchFileKey;
        }
        //조치결과
        if (data.actAtchFileKey) {
          actExistingFile.value = data.actAtchFileKey;
        }
        // 버튼 권한 부여
        setBtnAuth();
      }
    });
};

/**
 * 저장 데이터 조회
 */
const createFormData = (type = "save") => {
  let mode = detailInfo.value.authMode;
  let stats = detailInfo.value.stats;

  // 저장
  if (type === "save") {
    mode = detailInfo.value.actSeq != "" ? "U" : "I";
  }
  // 승인요청
  else if (type === "appr") {
    stats = "T1001";
  }
  // 승인요청 취소
  else if (type === "apprCncl") {
    stats = "T1005";
  }

  const param = {
    ...detailInfo.value,
    mode: mode,
    stats: stats,
    userId: userId,
    actComptDt: "",
  };

  // 첨부파일
  tempFileList.value = getNewUploadFiles();

  if (tempFileList.value.length > 0) {
    param.actAtchFileKey = tempFileList.value[0].atchFileKey;

    const fileParam = { fileList: tempFileList.value };
    adtnStore.appTempFileUpdate(fileParam);
  }

  let formData = new FormData();
  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  return formData;
};

/**
 * 저장 버튼 클릭
 */
const activitySave = async () => {
  if (!saveValid()) {
    return false;
  }

  dialogStore.openConfirmDialog(`저장 하시겠습니까?`, {
    confirmCallback: async () => {
      const result = await doSave();
      if (result.data > 0) {
        dialogStore.openToastDialog("저장되었습니다.");

        if (result.data > 0) {
          detailInfo.value.actSeq = result.data;
          detailInfo.value.stats = "";
        }

        setBtnAuth();
      } else {
        dialogStore.openAlertDialog(result.data.message);
      }
    },
  });
};

/**
 * 저장 유효성 체크
 */
const saveValid = () => {
  // 조치내용 체크
  if (cUtil.nullCheck(detailInfo.value.actDtl)) {
    dialogStore.openAlertDialog("조치내용을 입력해 주세요.");
    return false;
  }

  // 조치일자 체크
  if (cUtil.nullCheck(detailInfo.value.actDt)) {
    dialogStore.openAlertDialog("조치일자를 입력해 주세요.");
    return false;
  }

  return true;
};

/**
 * 저장처리
 */
const doSave = async (saveType) => {
  const saveData = createFormData("save");
  let res = null;

  await commonService
    .axiosCall("/v1/safeActvt/saveAppPntActDsctn", saveData)
    .then((result) => {
      res = result;
    });

  return res;
};

/**
 * 승인요청 버튼 클릭
 */
const activityAction = async () => {
  // 저장 후 승인요청
  if (!saveValid()) {
    return false;
  }

  dialogStore.openConfirmDialog(`승인요청 하시겠습니까?`, {
    confirmCallback: async () => {
      const result = await doSave();

      if (result.data > 0) {
        doAppr("appr");
      } else {
        dialogStore.openAlertDialog(result.data.message);
      }
    },
  });
};

/**
 * 승인요청취소 버튼 클릭
 */
const activityReject = () => {
  dialogStore.openConfirmDialog(`승인요청 취소를 하시겠습니까?`, {
    confirmCallback: async () => {
      doAppr("apprCncl");
    },
  });
};

/**
 * 승인요청/취소 처리
 */
const doAppr = async (apprType) => {
  const saveData = createFormData(apprType);
  const msg = apprType === "appr" ? "승인요청이" : "승인요청 취소가";

  await commonService
    .axiosCall("/v1/safeActvt/pntAppActDsctnApprMst", saveData)
    .then((result) => {
      if (result.data === "OK") {
        dialogStore.openToastDialog(`${msg} 완료되었습니다.`);
      } else {
        dialogStore.openAlertDialog(res.data.message);
      }

      goList(true);
    });
};

/**
 * 목록으로 이동
 */
const goList = (isReload = false) => {
  emits("goList", isReload);
};

/**
 * 자식 component에서 update 된 데이터 적용
 */
const handleUpdateDate = (params) => {
  detailInfo.value = params;
};

/**
 * 파일 핸들러의 새로 업로드 된 파일들 목록을 가져오기 위한 ref
 */
const fileHandlerRef = ref(null);
const getNewUploadFiles = () => {
  if (fileHandlerRef.value) {
    return fileHandlerRef.value.getNewUploadFiles();
  } else {
    return null;
  }
};

onBeforeMount(() => {
  doSearch();
});
</script>
<style scoped></style>
