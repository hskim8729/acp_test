<!-- 안전활동/중점점검활동/팝업-중점점검활동 등록 -->

<template>
  <comp-modal
    :modalTitle="title"
    @close="popupClose"
    @modal-action="authBtnAction"
    :actionBtnText="authBtnTxt"
    :isActions="isActionAuth"
    :retain-focus="false">
    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">공종</span>
        <input type="text" v-model="contyCdNm" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">작업명</span>
        <input type="text" v-model="wrkNm" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위치/장소</span>
        <input type="text" v-model="wrkLoc" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위험물</span>
        <input type="text" v-model="hrmrskMtr" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위험요인</span>
        <textarea v-model="rskFctr" readonly> </textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">감소대책</span>
        <textarea v-model="rskMsr" readonly> </textarea>
      </div>
    </div>

    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">점검일자</span>
        <input type="date" v-model="inspDt" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">점검의견</span>
        <textarea v-model="inspDtl" readonly> </textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">점검결과</span>
        <input
          type="radio"
          name="inspRst"
          v-model="inspRst"
          value="0001"
          disabled /><label for="result_01">양호</label>
        <input
          type="radio"
          name="inspRst"
          :checked="parseInt(inspRst) >= 2"
          disabled /><label for="result_02">조치요청</label>
        <!-- 조치요청 이후 단계는 조치요청으로 보여줌 -->
      </div>

      <div class="item_wrap w100p">
        <span class="title">점검결과<br />첨부</span>
        <div class="file">
          <div class="photo" id="activityPhotoPreview">
            <input
              id="acciFile"
              type="file"
              multiple
              class="w100p"
              name="file"
              @change="fileList"
              accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
              hidden />
          </div>
        </div>
      </div>

      <div v-show="actEditabled">
        <div class="item_wrap w100p">
          <span class="title">조치예정일</span>
          <input type="date" v-model="actExptDt" readonly />
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치요구</span>
          <textarea v-model="actDemandDtl" readonly> </textarea>
        </div>
        <div class="item_wrap w50p">
          <span class="title">담당자</span>
          <input
            type="text"
            class="search_input"
            v-model="actMngrNm"
            readonly />
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치내용</span>
          <textarea
            id="actDtlId"
            v-model="actDtl"
            :readonly="!isSaveAuth"
            ref="actDtlIdRef">
          </textarea>
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치일자</span>
          <input
            type="date"
            v-model="actDt"
            ref="actDtIdRef"
            :readonly="!isSaveAuth" />
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치결과<br />첨부</span>
          <div class="file">
            <div class="photo" id="activityPhotoPreview2">
              <button
                @click="onClickUpload"
                class="file_attach"
                v-if="isSaveAuth">
                파일 첨부
              </button>
              <input
                id="acciFile"
                type="file"
                multiple
                class="w100p"
                name="file"
                @change="fileList"
                accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
                hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #secondButton v-if="isSaveAuth">
      <comp-button text="저장" color="primary" @click="activitySave">
      </comp-button>
    </template>
  </comp-modal>
</template>

<script setup>
import { defineExpose, getCurrentInstance, ref, onMounted } from "vue";

import compModal from "@/components/modal/compModal.vue";

import commonUtil from "@/utils/common-utils";

import commonService from "@/api/common-service.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useFileStore } from "@/stores/common/file-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";

const emit = defineEmits(["close"]);
const app = getCurrentInstance();
const cUtil = commonUtil;
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const userId = $loginStore.$state.userInfo.userId;
const store = useMajorStore();
const dialogStore = useDialogStore();
const loginStore = useLoginAuthStore();
const fileStore = useFileStore();

const vendrCd = ref("");
const siteCd = ref("");
const inspCls = ref("");
const inspSeq = ref("");
const evalTblMstSeq = ref("");
const actAtchFileKey = ref("");
let formData = new FormData();
const isEditMode = ref(true);
const actSeq = ref("");
const stats = ref("");

const authBtnTxt = ref(""); //버튼 텍스트
const authBtnAction = ref(null); //버튼액션
const isSaveAuth = ref(false);
const isActionAuth = ref(false);

const setBtnAuth = () => {
  if (
    authMode.value == "I" &&
    isEditMode.value &&
    stats.value != "T1001" &&
    stats.value != "T1002" &&
    stats.value != "T1003"
  ) {
    isActionAuth.value = true;
    isSaveAuth.value = true;
    authBtnAction.value = activityAction;
    authBtnTxt.value = "승인요청";
  } else if (
    authMode.value == "I" &&
    isEditMode.value &&
    actSeq.value != "" &&
    stats.value == "T1001"
  ) {
    isActionAuth.value = true;
    authBtnAction.value = activityReject;
    authBtnTxt.value = "승인요청취소";
  }
};

// 저장 여부
const gubun = ref("N");
// 저장, 수정 값
const mode = ref("");
const contyCdNm = ref("");
const wrkLoc = ref("");
const wrkNm = ref("");
const hrmrskMtr = ref("");
const rskFctr = ref("");
const rskMsr = ref("");
const inspDt = ref("");
const inspDtl = ref("");
const inspRst = ref("");
const actExptDt = ref("");
const actDemandDtl = ref("");
const actMngrNm = ref("");
const actDt = ref("");
const actDtl = ref("");

let authMode = ref("");

const actEditabled = ref(true);

const props = defineProps(["rowParams", "title"]);

const upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;

// 첨부파일> 첨부파일 등록
const onClickUpload = () => {
  let myInput = document.getElementById("acciFile");
  myInput.click();
};

// 첨부파일> 파일 저장 함수
const fileList = (e) => {
  const files = [...e.target.files];
  upLoadFileList.value = [...upLoadFileList.value, ...files];
  e.target.value = "";
  //drawPreview(upLoadFileList.value);
  drawPreview2(upLoadFileList.value);
};

// 첨부파일> 파일 프리뷰 함수
const drawPreview = (files) => {
  deletePreview();

  if (files) {
    files.forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = function (e) {
          let img = document.createElement("img");
          let button = document.createElement("button");
          let div = document.createElement("div");
          div.setAttribute("id", "inspDivFileI_" + file.name);
          img.setAttribute("src", e.target.result);
          img.setAttribute("id", "inspImgFileI_" + file.name);
          button.setAttribute("class", "del");
          button.setAttribute("id", "inspBtnFileI_" + file.name);
          button.onclick = function () {
            saveDeleteFile(file);
          };

          document.getElementById("activityPhotoPreview").appendChild(div);
          div.appendChild(button);
          div.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
      // 파일 formData 저장
    });
  }
};

// 첨부파일> 파일 프리뷰 함수
const drawPreview2 = (files) => {
  deletePreview2();

  if (files) {
    files.forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = function (e) {
          let img = document.createElement("img");
          let button = document.createElement("button");
          let div = document.createElement("div");
          div.setAttribute("id", "acciDivFileI_" + file.name);
          img.setAttribute("src", e.target.result);
          img.setAttribute("id", "acciImgFileI_" + file.name);
          button.setAttribute("class", "del");
          button.setAttribute("id", "acciBtnFileI_" + file.name);
          button.onclick = function () {
            saveDeleteFile(file);
          };

          document.getElementById("activityPhotoPreview2").appendChild(div);
          div.appendChild(button);
          div.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
      // 파일 formData 저장
    });
  }
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview = () => {
  const imgElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="inspImgFileI"]');

  const btnElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="inspBtnFileI"]');

  const divElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="inspDivFileI"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview2 = () => {
  const imgElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciImgFileI"]');

  const btnElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciBtnFileI"]');

  const divElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciDivFileI"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 상세조회 파일 삭제
const deleteDetailPreview = () => {
  const imgElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="acciImgFileU"]');

  const spanElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="acciSpanFileU"]');

  const btnElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="acciBtnFileU"]');

  const divElement = document
    .getElementById("activityPhotoPreview")
    .querySelectorAll('[id*="acciDivFileU"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  spanElement.forEach((span) => {
    span.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 상세조회 파일 삭제
const deleteDetailPreview2 = () => {
  const imgElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciImgFileU"]');

  const spanElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciSpanFileU"]');

  const btnElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciBtnFileU"]');

  const divElement = document
    .getElementById("activityPhotoPreview2")
    .querySelectorAll('[id*="acciDivFileU"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  spanElement.forEach((span) => {
    span.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = (data) => {
  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  //deletePreview();

  // 조치
  deletePreview2();
  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }

  //drawPreview(upLoadFileList.value);

  // 조치
  drawPreview2(upLoadFileList.value);
};

// 팝업 닫기
function popupClose(isReload) {
  deleteData();
  deleteDetailPreview();

  deleteData2();
  deleteDetailPreview2();

  emit("close", isReload);
}

// 데이터 초기화 함수
const deleteData = () => {
  formData = new FormData();
  deletePreview();
};

// 데이터 초기화 함수
const deleteData2 = () => {
  formData = new FormData();
  deletePreview2();
};

// 등록, 상세 조회 값 대입
const updateInfo = (params) => {
  upLoadFileList.value = "";
  // 점검결과 사진 초기화
  deleteDetailPreview();

  //조치결과 사진 초기화
  deletePreview2();

  const inspDtValue = `${params.data.inspDt.substring(
    0,
    4
  )}-${params.data.inspDt.substring(4, 6)}-${params.data.inspDt.substring(6)}`;

  let actExptDtValue = "";
  if (params.data.actReqDt) {
    actExptDtValue = `${params.data.actExptDt.substring(
      0,
      4
    )}-${params.data.actExptDt.substring(
      4,
      6
    )}-${params.data.actExptDt.substring(6)}`;
  } else {
    actExptDtValue = params.data.actExptDt;
  }

  let actDtValue = "";
  let actDtlValue = "";
  if (params.data.actDt) {
    actDtValue = `${params.data.actDt.substring(
      0,
      4
    )}-${params.data.actDt.substring(4, 6)}-${params.data.actDt.substring(6)}`;
  } else {
    if (params.data.actDt == undefined) {
      actDtValue = "";
    } else {
      actDtValue = params.data.actDt;
    }
  }

  if (params.data.actDtl == undefined) {
    actDtlValue = "";
  } else {
    actDtlValue = params.data.actDtl;
  }

  contyCdNm.value = params.data.contyCdNm;
  wrkNm.value = params.data.wrkNm;
  wrkLoc.value = params.data.wrkLoc;
  hrmrskMtr.value = params.data.hrmrskMtr;
  rskFctr.value = params.data.rskFctr;
  rskMsr.value = params.data.rskMsr;
  inspDt.value = inspDtValue;
  inspDtl.value = params.data.inspDtl;
  inspRst.value = params.data.inspRst;
  actExptDt.value = actExptDtValue;
  actDemandDtl.value = params.data.actDemandDtl;
  actMngrNm.value = params.data.actMngrNm;
  actDt.value = actDtValue;
  actDtl.value = actDtlValue;

  authMode.value = params.data.authMode;
  vendrCd.value = params.data.vendrCd;
  siteCd.value = params.data.siteCd;
  inspCls.value = params.data.inspCls;
  actAtchFileKey.value = params.data.actAtchFileKey;
  inspSeq.value = params.data.inspSeq;
  evalTblMstSeq.value = params.data.evalTblMstSeq;
  stats.value = params.data.stats || ""; // 결재 상태

  // 등록 actSeq 받아오기
  if (params.data.actSeq != undefined) {
    actSeq.value = params.data.actSeq;
  } else {
    actSeq.value = "";
  }

  // 승인요청이나 등록을 한 게시글에 대한 flag 부여
  isEditAuth(params.data);

  // 점검 첨부파일
  if (!cUtil.nullCheck(params.data.atchFileList)) {
    detailPreview(params.data.atchFileList);
  }

  // 조치 첨부파일
  if (!cUtil.nullCheck(params.data.actAtchFileList)) {
    detailPreview2(params.data.actAtchFileList);
  }

  setBtnAuth();
};

// 상세조회 파일 프리뷰
const detailPreview = (param) => {
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      // let button = document.createElement("button");
      let div = document.createElement("div");
      div.setAttribute("id", "acciDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "acciImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "acciSpanFileU_" + count.fileNm);
      span.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await fileStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      document.getElementById("activityPhotoPreview").appendChild(div);
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 상세조회 파일 프리뷰
const detailPreview2 = (param) => {
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");

      let button = document.createElement("button");

      // let button = document.createElement("button");
      let div = document.createElement("div");
      div.setAttribute("id", "acciDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "acciImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "acciSpanFileU_" + count.fileNm);

      // button.setAttribute("class", "del");
      // button.setAttribute("id", "inspBtnFileI_" + count.name);

      span.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await fileStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      button.setAttribute("class", "del");
      button.setAttribute("id", "acciBtnFileU_" + count.fileNm);

      button.onclick = function () {
        dialogStore.openConfirmDialog("삭제하시겠습니까?", {
          confirmCallback: async () => {
            detailDeleteFile(count);
          },
        });
      };

      document.getElementById("activityPhotoPreview2").appendChild(div);

      // 상태가 기안, 승인완료, 반려가 아닌경우
      if (
        stats.value != "T1001" &&
        stats.value != "T1002" &&
        stats.value != "T1003" &&
        authMode.value != "U"
      ) {
        // 첨부파일 삭제 버튼
        div.appendChild(button);
      }
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 조치결과 첨부파일  삭제
const detailDeleteFile = async (data) => {
  const imgToDelete = document.getElementById("acciImgFileU_" + data.fileNm);
  const spanToDelete = document.getElementById("acciSpanFileU_" + data.fileNm);
  const buttonToDelete = document.getElementById("acciBtnFileU_" + data.fileNm);
  const divToDelete = document.getElementById("acciDivFileU_" + data.fileNm);

  if (imgToDelete) {
    imgToDelete.remove();
  }
  if (spanToDelete) {
    spanToDelete.remove();
  }
  if (buttonToDelete) {
    buttonToDelete.remove();
  }
  if (divToDelete) {
    divToDelete.remove();
  }

  const param = {
    vendrCd: vendrCd.value,
    atchFileKey: actAtchFileKey.value,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: userId,
  };

  // 조치 첨부파일 삭제 deleteFilePntActDsctn
  await store.deleteFilePntActDsctn(param);
  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.fileNm
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
  drawPreview2(upLoadFileList.value);
};

const isEditAuth = (data) => {
  if (data.inspRst != undefined) {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }
};

// 저장 필수값 체크
const actDtlIdRef = ref(null);
const actDtIdRef = ref(null);
const saveValid = async () => {
  // 조치내용 체크
  if (actDtl.value == "") {
    dialogStore.openAlertDialog("조치내용을 입력해 주세요.", {
      callback: () => {
        actDtlIdRef.value.focus();
      },
    });
    return false;
  }

  // 조치일자 체크
  if (actDt.value.replaceAll("-", "").trim() == "") {
    dialogStore.openAlertDialog("조치일자를 입력해 주세요.", {
      callback: () => {
        actDtIdRef.value.focus();
      },
    });
    return false;
  }

  let totalFileSize = 0;
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    for (let file of upLoadFileList.value) {
      totalFileSize += file.size;
      if (1024 * 1024 * 10 < totalFileSize) {
        dialogStore.openAlertDialog("10MB 사이즈 미만만 업로드가 가능합니다.");
        return;
      }
    }
  }
  return true;
};

// 중점/일상 점검 조치 승인요청
const activityAction = async () => {
  // 저장 후 승인요청
  const res = await doSave();
  const rtActSeq = res.data;

  if (!rtActSeq > 0) {
    return false;
  }

  formData = new FormData();

  const param = {
    mode: authMode.value,

    vendrCd: vendrCd.value,
    siteCd: siteCd.value,
    inspCls: inspCls.value,
    stats: "T1001",
    actAtchFileKey: actAtchFileKey.value,
    userId: loginStore.siteInfo.userId,
    inspSeq: inspSeq.value,
    inspDt: inspDt.value.replaceAll("-", ""),
    evalTblMstSeq: evalTblMstSeq.value,
    contyCdNm: contyCdNm.value,
    actSeq: rtActSeq,
    actComptDt: "",
  };

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    upLoadFileList.value.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  try {
    const res = await store.pntActDsctnApprMst(formData);

    if (res.data === "OK") {
      dialogStore.openToastDialog("승인 요청되었습니다.");
    } else {
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  popupClose(true);
};

// 중점/일상 점검 조치 승인취소
const activityReject = async () => {
  let totalFileSize = 0;
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    for (let file of upLoadFileList.value) {
      totalFileSize += file.size;
      if (1024 * 1024 * 10 < totalFileSize) {
        dialogStore.openAlertDialog("10MB 사이즈 미만만 업로드가 가능합니다.");
        return;
      }
    }
  }

  const param = {
    mode: authMode.value,
    vendrCd: vendrCd.value,
    siteCd: siteCd.value,
    inspCls: inspCls.value,
    stats: "T1005",
    actAtchFileKey: actAtchFileKey.value,
    userId: loginStore.siteInfo.userId,
    inspSeq: inspSeq.value,

    //inspDt: majorInfo.value.inspDt.replaceAll("-", ""),
    inspDt: inspDt.value.replaceAll("-", ""),

    evalTblMstSeq: evalTblMstSeq.value,

    //contyCdNm: majorInfo.value.contyCdNm,
    contyCdNm: contyCdNm.value,

    actSeq: actSeq.value,
    actComptDt: "",
  };

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    upLoadFileList.value.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  try {
    const res = await store.pntActDsctnApprMst(formData);

    if (res.data === "OK") {
      dialogStore.openToastDialog("승인 요청 취소되었습니다.");
    } else {
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  emit("closeModal");

  popupClose(true);
};

// 중점/일상 점검 조치 저장
const activitySave = async () => {
  try {
    // 조치 저장
    const res = await doSave();

    if (res.data > 0) {
      dialogStore.openToastDialog("저장되었습니다.");
    } else {
      // 이미 등록 된 안전활동 조치가 존재합니다.
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  // 팝업 닫기
  popupClose(true);
};

const doSave = async () => {
  if (!(await saveValid())) {
    return false;
  }

  formData = new FormData();

  const param = {
    mode: actSeq.value != "" ? "U" : "I",
    vendrCd: vendrCd.value,
    siteCd: siteCd.value,
    inspCls: inspCls.value,
    actSeq: actSeq.value,
    stats: stats.value,
    actAtchFileKey: actAtchFileKey.value,
    userId: loginStore.siteInfo.userId,
    inspSeq: inspSeq.value,
    inspDt: inspDt.value.replaceAll("-", ""),
    evalTblMstSeq: evalTblMstSeq.value,
    actDt: actDt.value.replaceAll("-", ""),
    actDtl: actDtl.value,
    actComptDt: "",
  };

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    upLoadFileList.value.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  deleteDetailPreview2();

  const res = await store.savePntActDsctn(formData);
  return res;
};

const doSearch = async () => {
  const data = props.rowParams;

  const params = {
    vendrCd: data.vendrCd,
    siteCd: data.siteCd,
    inspCls: data.inspCls,
    inspSeq: data.inspSeq,
    actSeq: data.actSeq,
    inspDt: data.inspDt,
    actAtchFileKey: data.actAtchFileKey,
  };

  await commonService
    .axiosCall("/v1/safeActvt/selectPntActDsctn", params)
    .then((result) => {
      result.data.authMode = "I";
      updateInfo(result);
    });
};

onMounted(() => {
  doSearch();
});

defineExpose({
  updateInfo,
});
</script>

<style scoped>
.content_box:nth-child(2) {
  margin: 0px;
}
.popup_content {
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
  width: calc(100% - 110px);
  vertical-align: middle;
}
</style>
