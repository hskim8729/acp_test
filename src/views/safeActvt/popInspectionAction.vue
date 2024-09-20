<!-- 안전활동/중점점검활동/팝업-중점점검활동 등록 -->

<template>
  <comp-modal
    :modalTitle="title"
    @close="deleteInput"
    @modal-action="emit('inspectionReg')"
    actionBtnText="등록"
    :isActions="!isEditMode"
    height="80%">
    <div class="content_box">
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

    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">점검일자</span>
        <input type="date" v-model="majorInfo.inspDt" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">점검의견</span>
        <textarea v-model="majorInfo.inspDtl" :disabled="isEditMode">
        </textarea>
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
          :checked="parseInt(majorInfo.inspRst) >= 2" /><label for="result_02"
          >조치요청</label
        >
        <!-- 조치요청 이후 단계는 조치요청으로 보여줌 -->
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
            @click="isAddModalOpen = true"
            :disabled="isEditMode"></button>

          <pop-select-user
            v-if="isAddModalOpen"
            rowSelection="single"
            @close-modal="isAddModalOpen = false"
            @get-selected-users="getUserDataPop" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">조치내용</span>
          <textarea v-model="majorInfo.actDtl" readonly> </textarea>
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치일자</span>
          <input type="date" v-model="majorInfo.actDt" readonly />
        </div>
        <div class="item_wrap w100p">
          <span class="title">조치결과<br />첨부</span>
          <div class="file">
            <div class="photo" id="actPhotoPreview"></div>
          </div>
        </div>
      </div>
    </div>
  </comp-modal>
</template>

<script setup>
import dayjs from "dayjs";
import {
  defineExpose,
  getCurrentInstance,
  onMounted,
  ref,
  watchEffect,
} from "vue";

import compModal from "@/components/modal/compModal.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";

import commonUtil from "@/utils/common-utils";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useFileStore } from "@/stores/common/file-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";

const emit = defineEmits(["inspectionReg"]);

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useMajorStore();
const fileStore = useFileStore();
const dialogStore = useDialogStore();

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
  "title",
]); // modeFlag: 등록, 상세보기 체크

let upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;
let formData = new FormData();

onMounted(() => {
  //doSearch();
});

watchEffect(() => {
  if (props.rowParams.mode === "reg") isEditMode.value = false; // 등록일때
  if (props.rowParams.mode === "detail") isEditMode.value = true; // 상세보기일때
  doSearch();
});

async function doSearch() {
  const searchParam = {
    vendrCd: props.rowParams.vendrCd,
    siteCd: props.rowParams.siteCd,
    inspSeq: props.rowParams.inspSeq,
    inspCls: props.rowParams.inspCls,
    inspDt: props.rowParams.inspDt,
    actSeq: props.rowParams.actSeq,
  };

  majorInfo.value = await store.selectPntInspDsctn(searchParam);

  if (majorInfo.value) {
    majorInfo.value.inspDt = dayjs(majorInfo.value.inspDt).format("YYYY-MM-DD");
    majorInfo.value.actExptDt = dayjs(majorInfo.value.actExptDt).format(
      "YYYY-MM-DD"
    );
    majorInfo.value.actDt = dayjs(majorInfo.value.actDt).format("YYYY-MM-DD");
    actMngr.value = majorInfo.value.actMngrNm;
    console.log("majorInfo.value : ", majorInfo.value);
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

    // 첨부파일이 있을때  -> 상세내역 화면일때
    // 점검결과 첨부
    if (majorInfo.value.inspAtchFileKey) {
      detailPreview(majorInfo.value.atchFileList);
    }

    // 조치결과 첨부 프리뷰
    if (majorInfo.value.actAtchFileKey) {
      detailActPreview(majorInfo.value.actAtchFileList);
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
        dialogStore.openConfirmDialog("삭제하시겠습니까?", {
          confirmCallback: async () => {
            detailDeleteFile(count);
          },
        });
      };
      document.getElementById("inspPhotoPreview").appendChild(div);
      if (!props.isEditabled) div.appendChild(button);
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 상세조회 조치결과 사진 미리보기
const detailActPreview = (param) => {
  console.log("상세조회 조치결과 사진 미리보기ㅏ param :", param);
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      let div = document.createElement("div");
      div.setAttribute("id", "actDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "actImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "actSpanFileU_" + count.fileNm);
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

      document.getElementById("actPhotoPreview").appendChild(div);
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
  upLoadFileList.value = "";
  document.getElementById("inspPhotoPreview").innerHTML = "";
  document.getElementById("actPhotoPreview").innerHTML = "";
}

// 첨부파일> 첨부파일 등록
const onClickUpload = () => {
  let myInput = document.getElementById("inspFile");
  myInput.click();
};

// 조치결과 등록
const createFormData = () => {
  const radio = document.querySelector('input[name="inspRst"][value="0001"]');
  formData = new FormData();
  if (majorInfo.value.inspRst == "" && radio.checked) {
    majorInfo.value.inspRst = "0001";
  }

  if (majorInfo.value.inspRst == "") {
    dialogStore.openAlertDialog("점검결과를 선택해주세요.");
    return false;
  } else if (
    !dayjs(majorInfo.value.actExptDt).isValid() &&
    majorInfo.value.inspRst != "0001"
  ) {
    dialogStore.openAlertDialog("조치예정일 값이 비어있습니다.");
    return;
  } else if (
    cUtil.nullCheck(majorInfo.value.actMngr) &&
    majorInfo.value.inspRst != "0001"
  ) {
    dialogStore.openAlertDialog("담당자 값이 비어있습니다.");
    return;
  } else {
    majorInfo.value.mode = "U";
    majorInfo.value.userId = userId;
    majorInfo.value.inspCls = props.rowParams.inspCls;

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
  majorInfo.value.inspCls = props.rowParams.inspCls;

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

// 담당자 선택
const isAddModalOpen = ref(false);
// 담당자 선택 후 함수
function getUserDataPop(selected) {
  if (selected.length === 0) {
    return;
  }
  majorInfo.value.actMngr = selected[0].userId;
  actMngr.value = selected[0].userNm;
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
