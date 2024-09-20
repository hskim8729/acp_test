<template>
  <mCompModal
    v-if="true"
    @close="goList"
    :isActions="isBtnAppr"
    @modal-action="inspectionApprove"
    :modalTitle="`${inspClsNm}승인`"
    actionBtnText="승인">
    <template #secondButton>
      <v-btn
        v-if="isBtnReject"
        @click="inspectionReject"
        variant="flat"
        color="#366587"
        class="ma-0 rounded-0 m-btn w-100">
        반려
      </v-btn>
    </template>

    <!-- 상세정보 공통 컴포넌트 -->
    <m-com-detail-safe-actvt
      menu-type="appr"
      :detailInfo="detailInfo"
      :isDisabled="isReadonlyMode"
      :isActInfo="true"
      @update-data="handleUpdateDate">
      <template #instFileSlot>
        <insp-file-handler
          table="SFT_ATVT_INSP_DSCTN"
          :readOnly="true"
          :fileKey="inspExistingFile" />
      </template>
      <template #actFileSlot>
        <act-file-handler
          table="SFT_ATVT_ACT_DSCTN"
          :readOnly="true"
          :fileKey="actExistingFile" />
      </template>
    </m-com-detail-safe-actvt>

    <!-- 조치내역 반려 팝업 -->
    <mPopInspectionReject
      v-if="isPopActivityReject"
      :isPopActivityReject="isPopActivityReject"
      @close="closePopActivityReject"
      @submitReject="submitReject">
    </mPopInspectionReject>
  </mCompModal>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

import {
  default as actFileHandler,
  default as inspFileHandler,
} from "@/components/file/m-fileHandler.vue";
import mComDetailSafeActvt from "@/m-views/safeActvt/common/m-comDetailSafeActvt.vue";
import mPopInspectionReject from "@/m-views/safeActvt/m-popInspectionReject.vue";
import mCompModal from "@/components/modal/mCompModal.vue";

import commonService from "@/api/common-service.js";
import commonUtil from "@/utils/common-utils";

import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useDialogStore } from "@/stores/common/dialog-store";

const router = useRouter();
const loginAuth = useLoginAuthStore();
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
const isBtnAppr = ref(false);
const isBtnReject = ref(false);
const setBtnAuth = () => {
  const stats = detailInfo.value.stats;

  // 상신 상태이면 승인/반려버튼 활성화화
  if (stats === "T1001") {
    isBtnAppr.value = true;
    isBtnReject.value = true;
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
      }

      setBtnAuth();
    });
};

/**
 * 승인/반려 데이터 조회
 */
const createFormData = (type = "appr") => {
  let rjctDtl = ""; // 부적합 사항
  let actReqMsg = ""; // 조치요구사항
  let atchFileKey = ""; // 부적합 사항 첨부

  // 반려는 반려내용 입력
  if (type === "reject") {
    rjctDtl = rejectCommentsData.rjctDtl || "";
    actReqMsg = rejectCommentsData.actReqMsg || "";
    atchFileKey = rejectCommentsData.rejectAtchFileKey || "";
  }

  const param = {
    ...detailInfo.value,
    rjctSeq: 0,
    rjctDtl: rjctDtl,
    actReqMsg: actReqMsg,
    atchFileKey: atchFileKey,
    stats: type === "appr" ? "T1003" : "T1004",
    lastInspDt: "",
    userId: userId,
  };

  let formData = new FormData();
  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );
  return formData;
};

/**
 * 승인 버튼 클릭
 */
const inspectionApprove = () => {
  dialogStore.openConfirmDialog(`승인 하시겠습니까?`, {
    confirmCallback: async () => {
      doAppr("appr");
    },
  });
};

/**
 * 반려 팝업
 */
const isPopActivityReject = ref(false);
const rejectCommentsData = ref({});

const inspectionReject = () => {
  isPopActivityReject.value = true;
};

const submitReject = (params) => {
  closePopActivityReject(params);
};

const closePopActivityReject = (params = null) => {
  if (params) {
    rejectCommentsData.value = params;
    doAppr("reject");
  }

  isPopActivityReject.value = false;
};

/**
 * 승인/반려 처리
 */
const doAppr = async (apprType) => {
  const saveData = createFormData(apprType);

  await commonService
    .axiosCall("/v1/safeActvt/pntAppActDsctnApprMst", saveData)
    .then((result) => {
      if (result.data === "OK") {
        const msg = apprType === "appr" ? "승인이" : "반려가";
        dialogStore.openToastDialog(`${msg} 완료되었습니다.`);
      } else {
        dialogStore.openAlertDialog(res.data.message);
      }

      goList(true);
    });
};

/**
 * 자식 component에서 update 된 데이터 적용
 */
const handleUpdateDate = (params) => {
  detailInfo.value = params;
};

/**
 * 목록으로 이동
 */
const goList = (isReload = false) => {
  emits("goList", isReload);
};

onBeforeMount(() => {
  doSearch();
});
</script>
<style scoped></style>
