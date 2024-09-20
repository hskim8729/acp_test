<template>
  <mCompModal
    v-if="isDetail"
    @close="goList"
    :isActions="!isReadonlyMode"
    @modal-action="inspectionReg"
    :modalTitle="`${inspClsNm}등록`"
    actionBtnText="저장">
    <!-- 상세정보 공통 컴포넌트 -->
    <m-com-detail-safe-actvt
      v-if="isDetail"
      menu-type="insp"
      :detailInfo="majorInfo"
      :isDisabled="isReadonlyMode"
      :isActInfo="actEditabled"
      @openPopSearchUser="openPopSearchUser"
      @update-data="handleUpdateDate">
      <template #instFileSlot>
        <insp-file-handler
          table="SFT_ATVT_INSP_DSCTN"
          :readOnly="isReadonlyMode"
          :fileKey="inspExistingFile"
          ref="fileHandlerRef" />
      </template>
    </m-com-detail-safe-actvt>

    <popSearchUser
      v-show="isPopSearchUser"
      @close="closePopSearchUser"></popSearchUser>
  </mCompModal>
</template>

<script setup>
import { ref, defineProps, defineEmits, onBeforeMount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import inspFileHandler from "@/components/file/m-fileHandler.vue";
import popSearchUser from "@/m-views/safeActvt/popSearchUser.vue";
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
  modeFlag: {
    type: String,
    default: "",
  },
  rowParams: {
    type: Object,
    default: {},
  },
});

const userId = loginAuth.$state.userInfo.userId;
const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");

const actEditabled = ref(false);
const isReadonlyMode = ref(props.modeFlag === "detail"); // 상세보기이면 readonly

const actMngr = ref("");
const inspExistingFile = ref("");
let tempFileList = ref([]);

const majorInfo = ref({
  contyCdNm: "",
  wrkNm: "",
  wrkLoc: "",
  hrmrskMtr: "",
  rskFctr: "",
  rskMsr: "",
  inspDt: null,
  actExptDt: null,
  inspDtl: "",
  inspRst: "",
  actDt: null,
  actReqDt: null,
  actDemandDtl: "",
  inspAtchFileKey: "",
});

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
  };

  return param;
};

/**
 * 저장가능여부 조회
 */
const buttonValidation = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/selectPntActDsctnCnt", params)
    .then((result) => {
      // 점검 상태 조치중 아니면 수정 가능
      if (result.cnt === 0 && params.inspRst != "0004") {
        isReadonlyMode.value = false;
      }
    });
};

/**
 * 상세내역 조회
 */
const doSearch = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/selectPntInspDsctn", params)
    .then((result) => {
      let { data } = result;

      majorInfo.value = data;

      if (data) {
        actMngr.value = data.actMngrNm;

        // 조치요청 이상일 때는 조치요청으로 표시
        if (["0002", "0004", "0003"].includes(data.inspRst)) {
          majorInfo.value.inspRst = "0002";
          actEditabled.value = true;
        }

        // 파일 프리뷰 위해 서버에 업로드 된 파일 리스트 생성
        if (data.inspAtchFileKey) {
          inspExistingFile.value = data.inspAtchFileKey;
        }
      }
    });
};

/**
 * 저장 데이터 조회
 */
const createFormData = () => {
  majorInfo.value.mode = "U";
  majorInfo.value.userId = userId;
  majorInfo.value.inspCls = props.inspClsCd; //중점

  // 첨부파일 FormData 추가
  tempFileList.value = getNewUploadFiles();

  if (tempFileList.value.length > 0) {
    majorInfo.value.inspAtchFileKey = tempFileList.value[0].atchFileKey;
  }

  const param = { ...majorInfo.value };

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
const inspectionReg = () => {
  if (majorInfo.value.inspRst == "") {
    dialogStore.openAlertDialog("점검결과를 선택해주세요.");
    return false;
  } else if (
    cUtil.nullCheck(majorInfo.value.actExptDt) &&
    majorInfo.value.inspRst != "0001"
  ) {
    dialogStore.openAlertDialog("조치예정일 값이 비어있습니다.");
    return false;
  } else if (
    cUtil.nullCheck(majorInfo.value.actMngr) &&
    majorInfo.value.inspRst != "0001"
  ) {
    dialogStore.openAlertDialog("담당자 값이 비어있습니다.");
    return false;
  }

  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      doSave();
    },
  });
};

/**
 * 저장 처리
 */
const doSave = async () => {
  const saveData = createFormData();

  if (tempFileList.value != "") {
    const param = { fileList: tempFileList.value };
    await adtnStore.appTempFileUpdate(param);
  }

  await commonService
    .axiosCall("/v1/safeActvt/saveAppPntInspDsctn", saveData)
    .then((result) => {
      if (result.data === "OK") {
        dialogStore.openToastDialog("정상적으로 처리하였습니다.");
        goList(true);
      } else {
        dialogStore.openAlertDialog(result.data.message);
      }
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
  majorInfo.value = params;
};

/**
 * 담당자 선택 팝업 처리
 */
const isPopSearchUser = ref(false);
const openPopSearchUser = () => {
  isPopSearchUser.value = true;
};

const closePopSearchUser = (data = null) => {
  if (data.userId) {
    majorInfo.value.actMngr = data.userId;
    majorInfo.value.actMngrNm = data.userNm;
    actMngr.value = data.userNm;
  }

  isPopSearchUser.value = false;
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
  buttonValidation();

  doSearch();
});
</script>
<style scoped></style>
