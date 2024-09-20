<template>
  <comp-button
    class="file-btn"
    type="addfile"
    requiredAuth
    v-if="!props.readOnly"
    @click="onClickUpload"></comp-button>
  <div class="d-flex flex-column m_file_attach">
    <fileViews
      :fileArr="existingFiles.src"
      :read-only="props.readOnly"
      isDownload
      @download-file="downloadFiles"
      @delete-file="deleteExistingFile" />
    <fileViews
      :read-only="props.readOnly"
      :fileArr="newUploadFiles.src"
      @delete-file="deleteNewUploadFile" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

import fileService from "@/api/common/file-service";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

import fileViews from "@/components/file/m-fileViews.vue";
import { storeToRefs } from "pinia";

const emits = defineEmits(["afterUploadFile"]);
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  table: {
    type: String,
    default: "",
    validator: (propValue) => {
      // 프로시저에 정의된 값만 넘겨줘야함
      return [
        "SITE_BS_INFO", // 현장등록 첨부 파일
        "ADD_RSK_DSCV", // 추가위험 발굴 첨부파일
        "SFT_ATVT_INSP_DSCTN", // 안전활동 점검 첨부파일
        "SFT_ATVT_ACT_DSCTN", // 안전활동 조치 첨부파일
        "TBM", // TBM 첨부파일
        "BBS", // 게시판 첨부파일
      ].includes(propValue);
    },
  },
  isDeleteMaster: {
    // 파일키로 엮인 파일의 갯수가 0이 되면 마스터(게시글 등)을 삭제
    type: Boolean,
    default: false,
  },
  fileKey: {
    type: String,
    default: "",
  },
});

const dialogStore = useDialogStore();

const url = import.meta.env.VITE_APP_API_DEV_URL;
const newUploadFiles = ref({
  list: [],
  src: [],
});
const existingFiles = ref({
  list: [],
  src: [],
});

const getNewUploadFiles = () => {
  return newUploadFiles.value.list;
};

defineExpose({ getNewUploadFiles });

const showFileList = async (fileKey) => {
  const param = {
    vendrCd: siteInfo.value.vendrCd,
    atchFileKey: fileKey,
  };

  // 첨부파일 정보 조회
  const res = await fileService.retrieveAtchFileList(param);

  for (let file of res.data) {
    if (file?.filePath) {
      const src =
        url +
        "/v1/common/getImage?param1=" +
        file.filePath +
        "&param2=" +
        file.fileNm;
      existingFiles.value.src.push(src);
      existingFiles.value.list.push(file);
    }
  }
};

// files props를 감시하기 위한 watch 설정
watch(
  () => props.fileKey,
  (newVal) => {
    if (newVal) {
      showFileList(newVal);
    }
  },
  { immediate: true }
); // deep 옵션으로 내부 객체의 변경도 감시

// 서버에 업로드 되어있는 파일 다운로드
const downloadFiles = async (idx) => {
  const file = existingFiles.value.list[idx];
  const param = { fileNm: file.fileNm, filePath: file.filePath };
  const response = await fileService.fileDownload(param);
  const downloadFile = response.data;
  let link = document.createElement("a");
  let url = URL.createObjectURL(downloadFile);
  link.href = url;
  link.download = file.fileNm;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

// 서버에 올라가지 않은 파일 프리뷰 삭제
const deleteNewUploadFile = (idx) => {
  newUploadFiles.value.list.splice(idx, 1);
  newUploadFiles.value.src.splice(idx, 1);
};

// 서버에 올라가있던 파일 및 프리뷰 삭제
const loginStore = useLoginAuthStore();
const { siteInfo } = storeToRefs(loginStore);
const deleteExistingFile = async (idx) => {
  dialogStore.openConfirmDialog("삭제하시겠습니까?", {
    confirmCallback: async () => {
      const param = {
        vendrCd: siteInfo.value.vendrCd,
        atchFileKey: existingFiles.value.list[idx].atchFileKey,
        fileSeq: existingFiles.value.list[idx].fileSeq,
        fileNm: existingFiles.value.list[idx].fileNm,
        filePath: existingFiles.value.list[idx].filePath,
        userId: siteInfo.value.userId,
        jobDiv: props.table,
        fileDiv: props.isDeleteMaster ? "D" : null,
      };
      // 서버에 저장된 파일 삭제
      await fileService.deleteAtchFile(param);
      // 프론트에 남아있는 파일데이터 삭제(화면에서 제거)
      existingFiles.value.list.splice(idx, 1);
      existingFiles.value.src.splice(idx, 1);
    },
  });
};

// 모바일 파일 업로드
const onClickUpload = () => {
  let atchFileKey = "";

  if (existingFiles.value.list.length > 0) {
    atchFileKey = existingFiles.value.list[0].atchFileKey;
  }

  if (atchFileKey === undefined || atchFileKey === "null") {
    atchFileKey = "";
  }

  location.href =
    "tapp://upload?vendrCd=" +
    siteInfo.value.vendrCd +
    "&userId=" +
    siteInfo.value.userId +
    "&atchFileKey=" +
    atchFileKey +
    "&siteCd=" +
    siteInfo.value.siteCd;
};

// 모바일 업로드 콜백 함수
window.uploadCallback = function (files) {
  if (files == "") {
    dialogStore.openAlertDialog("10MB 사이즈 미만만 업로드가 가능합니다.");
    return;
  }

  onChangefileList(files);
};

// 첨부파일> 파일 저장 함수
const onChangefileList = (files) => {
  const imgSrcArr = []; // AI 추천용 src
  let imgSrc = "";

  Array.from(files).forEach((file) => {
    imgSrc =
      url +
      "/v1/common/getImage?param1=" +
      file.filePath +
      "&param2=" +
      file.fileNm;

    newUploadFiles.value.src.push(imgSrc);
    newUploadFiles.value.list.push(file);

    imgSrcArr.push(imgSrc);
  });

  emits("afterUploadFile", imgSrcArr);
};
</script>

<style lang="scss" scoped>
.file-btn {
  border-radius: 20px;
  font-size: 13px;
}
</style>
