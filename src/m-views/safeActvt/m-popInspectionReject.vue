<!-- 안전활동/중점점검활동/팝업-중점점검활동 조치 -->

<template>
  <!-- <v-dialog v-model="dialogRef" persistent max-width="none" fullscreen>
    <v-card class="page w-100 h-100">
      <v-card-title>조치내역 반려</v-card-title>
      <div class="text-subtitle-4">조치내역 반려</div>
      <span class="title">부적합사항</span>
      <div class="pt-1 pb-3">블라블</div>
      <textarea v-model="rjctDtl"></textarea>
      <span class="title">부적합 사항 첨부</span>
      <div class="file">
        <m-file-handler
          table="SFT_ATVT_ACT_DSCTN"
          :readOnly="!isEditabled"
          :fileKey="actExistingFile"
          ref="fileHandlerRef" />
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치요구사항</span>
        <textarea v-model="actReqMsg"></textarea>
      </div>
    </v-card>
  </v-dialog> -->

  <div class="pop_in_pop inpection_reject show">
    <div class="popup_title">
      <span>조치내역 반려</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="item_wrap w100p">
          <span class="p_title">부적합사항</span><br />
          <textarea v-model="rjctDtl" width="100%"></textarea>
        </div>

        <div class="item_wrap w100p">
          <span class="p_title">조치요구사항</span><br />
          <textarea v-model="actReqMsg"></textarea>
        </div>
        <div class="item_wrap w100p">
          <span class="p_title">점검결과 첨부</span>
          <button @click="triggerFileInput" class="file_attach">
            파일첨부
          </button>
        </div>
        <div class="m_file_attach">
          <input type="file" multiple id="fileInput" hidden />
          <ul id="inspRjctPhotoPreview"></ul>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button @click="submitReject">반려의견 등록</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import {
  defineEmits,
  ref,
  defineProps,
  computed,
  getCurrentInstance,
} from "vue";

import compModal from "@/components/modal/compModal.vue";
import mFileHandler from "@/components/file/m-fileHandler.vue";

import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useDialogStore } from "@/stores/common/dialog-store";

const loginAuth = useLoginAuthStore();
const dialogStore = useDialogStore();
const adtnStore = useAdtnRiskStore();

const app = getCurrentInstance();
const uploadFileList = ref([]);
let rejectAtchFileKey = ref("");
let tempFileList = ref([]);

const rjctDtl = ref("");
const actReqMsg = ref("");
const url = import.meta.env.VITE_APP_API_DEV_URL;

const emits = defineEmits(["close"]);
const props = defineProps({
  isPopActivityReject: {
    type: Boolean,
    default: false,
  },
});

// 모바일 업로드 콜백 함수
window.uploadCallback = function (result) {
  if (result == "") {
    alert("10MB 사이즈 미만만 업로드가 가능합니다.");
    return;
  }
  rejectAtchFileKey.value = result.atchFileKey;
  drawPreview(result);
};

// 모바일 파일 업로드 함수
const triggerFileInput = () => {
  const isMobile = app.appContext.config.globalProperties.$isMobile;
  if (
    rejectAtchFileKey.value === undefined ||
    rejectAtchFileKey.value === "null"
  ) {
    rejectAtchFileKey.value = "";
  }
  const atchFileKey = rejectAtchFileKey.value;
  const userId = loginAuth.$state.userInfo.userId;
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  if (isMobile) {
    location.href =
      "tapp://upload?vendrCd=" +
      vendrCd +
      "&userId=" +
      userId +
      "&atchFileKey=" +
      atchFileKey +
      "&siteCd=" +
      siteCd;
  }
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = async (data) => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const userId = loginAuth.$state.userInfo.userId;
  const imgToDelete = document.getElementById("inspImgFileI_" + data.fileNm);
  const liToDelete = document.getElementById("inspLiFileI_" + data.fileNm);
  const buttonToDelete = document.getElementById("inspBtnFileI_" + data.fileNm);
  const divToDelete = document.getElementById("inspDivFileI_" + data.fileNm);

  if (imgToDelete) {
    imgToDelete.remove();
  }
  if (liToDelete) {
    liToDelete.remove();
  }
  if (buttonToDelete) {
    buttonToDelete.remove();
  }
  if (divToDelete) {
    divToDelete.remove();
  }

  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  const index = tempFileList.value.findIndex(
    (file) => file.fileNm == data.fileNm
  );
  if (index != -1) {
    tempFileList.value.splice(index, 1);
  }

  const param = {
    vendrCd: vendrCd,
    atchFileKey: data.atchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: userId,
  };
  await adtnStore.adtnRiskDeleteFile(param);
};

// 첨부파일> 파일 프리뷰 함수
const drawPreview = (files) => {
  files.forEach((file) => {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let div = document.createElement("div");

    li.setAttribute("id", "inspLiFileI_" + file.fileNm);
    div.setAttribute("id", "inspDivFileI_" + file.fileNm);
    img.setAttribute(
      "src",
      url +
        "/v1/common/getImage?param1=" +
        file.filePath +
        "&param2=" +
        file.fileNm
    );
    img.setAttribute("id", "inspImgFileI_" + file.fileNm);
    div.textContent = "다운로드";
    div.setAttribute("class", "file_name");
    div.addEventListener("click", async function () {
      let link = document.createElement("a");
      let downloadUrl =
        url +
        "/v1/common/getImage?param1=" +
        file.filePath +
        "&param2=" +
        file.fileNm;
      link.href = downloadUrl;
      link.download = file.fileNm;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    });

    let button = document.createElement("button");
    button.textContent = "삭제";
    button.setAttribute("id", "inspBtnFileI_" + file.fileNm);
    button.setAttribute("class", "del");
    button.onclick = function () {
      if (confirm("파일을 삭제하시겠습니까?")) {
        const param = {
          atchFileKey: file.atchFileKey,
          fileSeq: file.fileSeq,
          fileNm: file.fileNm,
          filePath: file.filePath,
        };
        saveDeleteFile(param);
      }
    };
    li.appendChild(button);

    document.getElementById("inspRjctPhotoPreview").appendChild(li);

    li.appendChild(img);
    li.appendChild(div);
  });
};

// 반려 등록 버튼 클릭
const submitReject = async () => {
  dialogStore.openConfirmDialog(`반려 하시겠습니까?`, {
    confirmCallback: async () => {
      if (tempFileList.value != "") {
        const param = { fileList: tempFileList.value };
        await adtnStore.appTempFileUpdate(param);
      }

      const data = {
        rjctDtl: rjctDtl.value,
        actReqMsg: actReqMsg.value,
        rejectAtchFileKey: rejectAtchFileKey.value,
      };

      emits("submitReject", data);
    },
  });
};

const dialogRef = computed({
  get: () => props.isPopActivityReject,
  set: (val) => emits("update:isPopActivityReject", val),
});

const popupClose = () => {
  emits("close");
};
</script>

<style scoped>
.content_box {
  height: 100%;
  margin: 0px;
  overflow: auto;
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.item_wrap input[type="text"],
.item_wrap select,
.item_wrap textarea,
.item_wrap .file {
  display: inline-block;
  vertical-align: middle;
}
.inpection_reject {
  width: 100%;
  height: 60%;
}
.page {
  height: calc(100% - 60px);
  overflow: auto;
  -ms-overflow-style: none;
}
.page::-webkit-scrollbar {
  display: none;
}
</style>
