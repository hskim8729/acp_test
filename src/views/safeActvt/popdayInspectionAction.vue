<!-- 안전활동/일상점검활동/팝업-일상점검활동 등록 -->
<template>
  <div class="content_box" v-if="majorInfo">
    <div class="item_wrap w100p">
      <span class="title">공종</span>
      <input type="text" v-model="majorInfo.contyCdNm" readonly />
    </div>
    <div class="item_wrap w100p">
      <span class="title">작업명</span>
      <input type="text" v-model="majorInfo.wrkNm" readonly />
    </div>
    <div class="item_wrap w100p">
      <span class="title">위치/장소</span>
      <input type="text" v-model="majorInfo.wrkLoc" readonly />
    </div>
    <div class="item_wrap w100p">
      <span class="title">위험물</span>
      <input type="text" v-model="majorInfo.hrmrskMtr" readonly />
    </div>
    <div class="item_wrap w100p">
      <span class="title">위험요인</span>
      <textarea v-model="majorInfo.rskFctr" readonly> </textarea>
    </div>
    <div class="item_wrap w100p">
      <span class="title">감소대책</span>
      <textarea v-model="majorInfo.rskMsr" readonly> </textarea>
    </div>
  </div>

  <div class="content_box" v-if="majorInfo">
    <div class="item_wrap w100p">
      <span class="title">점검일자</span>
      <input type="date" v-model="majorInfo.inspDt" readonly />
    </div>
    <div class="item_wrap w100p">
      <span class="title">점검의견</span>
      <textarea v-model="majorInfo.inspDtl" :disabled="isEditMode"> </textarea>
    </div>
    <div class="item_wrap w100p">
      <span class="title">점검결과</span>
      <input
        type="radio"
        name="inspRst"
        v-model="majorInfo.inspRst"
        value="0001"
        @click="onClickInspRst($event.target.value)"
        :disabled="isEditMode"
        checked /><label for="result_01">양호</label>
      <input
        type="radio"
        name="inspRst"
        v-model="majorInfo.inspRst"
        value="0002"
        @click="onClickInspRst($event.target.value)"
        :disabled="isEditMode"
        :checked="majorInfo.inspRst == '0004'" /><label for="result_02"
        >조치요청</label
      >
    </div>

    <div class="item_wrap w100p">
      <span class="title">점검결과<br />첨부</span>
      <div class="file">
        <div class="photo" id="inspPhotoPreview">
          <input
            id="inspFile"
            type="file"
            multiple
            class="w100p"
            name="file"
            @change="fileList"
            accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
            hidden />
          <button
            @click="onClickUpload"
            class="file_attach"
            :hidden="isEditMode">
            파일 첨부
          </button>
        </div>
        <!-- <div class="file_drop">여기에 파일을 드래그해 주세요.</div> -->
      </div>
    </div>

    <div v-show="actEditabled">
      <div class="item_wrap w100p">
        <span class="title">조치예정일</span>
        <input
          type="date"
          v-model="majorInfo.actExptDt"
          :disabled="isEditMode" />
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치요구</span>
        <textarea v-model="majorInfo.actDemandDtl" :disabled="isEditMode">
        </textarea>
      </div>
      <div class="item_wrap w50p">
        <span class="title">담당자</span>
        <input type="text" class="search_input" v-model="actMngr" readonly />
        <button
          class="search_btn"
          @click="popupSearchUser()"
          :disabled="isEditMode"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFileStore } from "@/stores/common/file-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";
import commonUtil from "@/utils/common-utils";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import dayjs from "dayjs";
import {
  defineExpose,
  getCurrentInstance,
  onMounted,
  ref,
  watchEffect,
} from "vue";

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useMajorStore();
const fileStore = useFileStore();
const actMngr = ref("");
const cUtil = commonUtil;

const userId = $loginStore.$state.userInfo.userId;

const majorInfo = ref({
  contyCdNm: "",
  wrkNm: "",
  wrkLoc: "",
  hrmrskMtr: "",
  rskFctr: "",
  rskMsr: "",
  inspDt: "",
  inspDtl: "",
  inspRst: "",
  actReqDt: "",
  actDemandDtl: "",
});

const actEditabled = ref(false);
const isEditMode = ref(true);

const props = defineProps([
  "isEditabled",
  "rowParams",
  "modeFlag",
  "propUserId",
  "propUserNm",
  "test99",
]); // modeFlag: 등록, 상세보기 체크

let upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;
let formData = new FormData();

onMounted(() => {
  doSearch();
});

watchEffect(() => {
  console.log("props.rowParams.mode>>>", props.rowParams.mode);
  if (props.rowParams.mode === "reg") isEditMode.value = false; // 등록일때
  if (props.rowParams.mode === "detail") isEditMode.value = true; // 상세보기일때
  doSearch();
});

async function doSearch() {
  const searchParam = {
    vendrCd: props.rowParams.vendrCd,
    siteCd: props.rowParams.siteCd,
    inspSeq: props.rowParams.inspSeq,
    inspCls: props.rowParams.inspCls, //T0202 : 일상
    inspDt: props.rowParams.inspDt,
  };

  majorInfo.value = await store.selectPntInspDsctn(searchParam);

  if (majorInfo.value) {
    majorInfo.value.inspDt = dayjs(majorInfo.value.inspDt).format("YYYY-MM-DD");
    majorInfo.value.actExptDt = dayjs(majorInfo.value.actExptDt).format(
      "YYYY-MM-DD"
    );
    actMngr.value = majorInfo.value.actMngrNm;

    // 점검결과: 조치요청일때
    if (majorInfo.value.inspRst == "0002") actEditabled.value = true;

    // 점검결과: 조치 중일 경우 조치요청에 체크박스 체크
    if (
      majorInfo.value.inspRst == "0004" ||
      majorInfo.value.inspRst == "0003"
    ) {
      actEditabled.value = true;
    }

    // 미점검일 경우 상세보기는 체크박스 해제
    if (majorInfo.value.inspRst == "" && isEditMode.value) {
      if (
        document.querySelector('input[name="inspRst"]:checked') != "" &&
        document.querySelector('input[name="inspRst"]:checked') != undefined
      ) {
        document.querySelector('input[name="inspRst"]:checked').checked = false;
      }
    } else if (majorInfo.value.inspRst == "" && !isEditMode.value) {
      majorInfo.value.inspRst = "0001";
      actEditabled.value = false;
    }

    let atchFileKeyList = [];

    if (majorInfo.value.inspAtchFileKey) {
      atchFileKeyList = majorInfo.value.atchFileList;

      // 첨부파일이 있을때  -> 상세내역 화면일때
      if (!cUtil.nullCheck(atchFileKeyList)) {
        detailPreview(majorInfo.value.atchFileList);
      }
    }
  }
}

// 상세조회 사진 미리보기
const detailPreview = (param) => {
  deleteInput();
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      let button = document.createElement("button");
      let div = document.createElement("div");
      div.setAttribute("id", "inspDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "inspImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "inspSpanFileU_" + count.fileNm);
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
      button.setAttribute("id", "inspBtnFileU_" + count.fileNm);
      button.onclick = function () {
        if (confirm("삭제하시겠습니까?")) detailDeleteFile(count);
        else return;
      };

      document.getElementById("inspPhotoPreview").appendChild(div);

      //if (props.rowParams.mode == "reg") div.appendChild(button);
      if (!props.isEditabled) div.appendChild(button);
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 첨부파일> 파일 저장 함수
const fileList = (e) => {
  const files = [...e.target.files];
  upLoadFileList.value = [...upLoadFileList.value, ...files];
  e.target.value = "";
  drawPreview(upLoadFileList.value);
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

          document.getElementById("inspPhotoPreview").appendChild(div);
          div.appendChild(button);
          div.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
      // 파일 formData 저장
    });
  }
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = (data) => {
  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  deletePreview();
  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
  drawPreview(upLoadFileList.value);
};

// 상세보기 파일 삭제
const detailDeleteFile = async (data) => {
  const imgToDelete = document.getElementById("inspImgFileU_" + data.fileNm);
  const spanToDelete = document.getElementById("inspSpanFileU_" + data.fileNm);
  const buttonToDelete = document.getElementById("inspBtnFileU_" + data.fileNm);
  const divToDelete = document.getElementById("inspDivFileU_" + data.fileNm);

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
    vendrCd: props.rowParams.vendrCd,
    atchFileKey: props.rowParams.inspAtchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: userId,
  };

  // 첨부파일 삭제deleteFilePntInspDsctn
  await store.deleteFilePntInspDsctn(param);

  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview = () => {
  const imgElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspImgFileI"]');

  const btnElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspBtnFileI"]');

  const divElement = document
    .getElementById("inspPhotoPreview")
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

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  document.getElementById("inspFile").value = "";
  upLoadFileList.value = "";

  const imgElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("img");

  const spanElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("span");

  const btnElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspBtnFile"]');

  const divElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("div");

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
}

// 첨부파일> 첨부파일 등록
const onClickUpload = () => {
  let myInput = document.getElementById("inspFile");
  myInput.click();
};

// 조치결과 등록
const createFormData = () => {
  const radio = document.querySelector('input[name="inspRst"][value="0001"]');

  if (majorInfo.value.inspRst == "" && radio.checked) {
    majorInfo.value.inspRst = "0001";
  }

  let totalFileSize = 0;
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    for (let file of upLoadFileList.value) {
      totalFileSize += file.size;
      if (1024 * 1024 * 10 < totalFileSize) {
        alert("10MB 사이즈 미만만 업로드가 가능합니다.");
        return;
      }
    }
  }

  if (majorInfo.value.inspRst == "") {
    alert("점검결과를 선택해주세요.");
    return false;
  } else if (
    !dayjs(majorInfo.value.actExptDt).isValid() &&
    majorInfo.value.inspRst != "0001"
  ) {
    alert("조치예정일 값이 비어있습니다.");
    return;
  } else if (
    cUtil.nullCheck(majorInfo.value.actMngr) &&
    majorInfo.value.inspRst != "0001"
  ) {
    alert("담당자 값이 비어있습니다.");
    return;
  } else {
    majorInfo.value.mode = "U";
    majorInfo.value.userId = userId;
    majorInfo.value.inspCls = "T0202"; //일상

    majorInfo.value.inspDt = majorInfo.value.inspDt.replaceAll("-", "");
    majorInfo.value.actExptDt = majorInfo.value.actExptDt.replaceAll("-", "");

    const param = { ...majorInfo.value };

    // FormData 추가
    formData.append(
      "param",
      new Blob([JSON.stringify(param)], { type: "application/json" })
    );

    // 첨부파일 FormData 추가
    if (
      Array.isArray(upLoadFileList.value) &&
      upLoadFileList.value.length > 0
    ) {
      upLoadFileList.value.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    return formData;
  }
};

// 조치결과 삭제
const deleteFormData = () => {
  majorInfo.value.mode = "D";
  majorInfo.value.inspCls = "T0202"; //일상

  majorInfo.value.inspDt = majorInfo.value.inspDt.replaceAll("-", "");

  const param = { ...majorInfo.value };

  // FormData 추가
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

  return formData;
};

defineExpose({
  createFormData,
  drawPreview,
  deleteInput,
  doSearch,
  deleteFormData,
  detailPreview,
  getUserDataPop,
});

// 담당자 선택 팝업
function popupSearchUser() {
  document
    .getElementsByClassName("pop_in_pop search_user")[0]
    .classList.add("show");
  document.getElementsByClassName("popup_bg2")[0].classList.add("show");
}

// 담당자 선택 후 함수
function getUserDataPop(data) {
  majorInfo.value.actMngr = data.userId;
  actMngr.value = data.userNm;
}

function onClickInspRst(value) {
  majorInfo.value.inspRst = value;

  if (value === "0001") actEditabled.value = false;
  if (value === "0002") actEditabled.value = true;
}

function checked(target) {
  return target === majorInfo.value.inspRst;
}
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
