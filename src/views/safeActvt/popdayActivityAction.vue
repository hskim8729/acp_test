<!-- 안전활동/일상점검활동/팝업-일상점검활동 등록 -->

<template>
  <div class="popup activity_action">
    <div class="popup_title">
      <span>일상점검 조치</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
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
            disabled
          /><label for="result_01">양호</label>
          <input
            type="radio"
            name="inspRst"
            v-model="inspRst"
            value="0002"
            disabled
          /><label for="result_02">조치요청</label>
        </div>

        <div class="item_wrap w100p">
          <span class="title">점검결과<br />첨부</span>
          <div class="file">
            <!-- <div class="photo" id="acciPhotoPreview"> -->
            <div class="photo" id="activityPhotoPreview">
              <!-- <input
                id="inspFile"
                type="file"
                multiple
                class="w100p"
                name="file"
                @change="fileList"
                accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
                hidden
              /> -->
              <!-- <button @click="onClickUpload" class="file_attach">
                파일 첨부
              </button> -->

              <input
                id="acciFile"
                type="file"
                multiple
                class="w100p"
                name="file"
                @change="fileList"
                accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
                hidden
              />
            </div>
            <!-- <div class="file_drop">여기에 파일을 드래그해 주세요.</div> -->
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
              readonly
            />
          </div>
          <div class="item_wrap w100p">
            <span class="title">조치내용</span>
            <textarea
              id="actDtlId"
              v-model="actDtl"
              :readonly="authMode == 'U'"
            >
            </textarea>
          </div>
          <div class="item_wrap w100p">
            <span class="title">조치일자</span>
            <input
              type="date"
              id="actDtId"
              v-model="actDt"
              :readonly="authMode == 'U'"
            />
          </div>
          <div class="item_wrap w100p">
            <span class="title">조치결과<br />첨부</span>
            <div class="file">
              <div class="photo" id="activityPhotoPreview2">
                <button
                  @click="onClickUpload"
                  class="file_attach"
                  v-if="authMode == 'I'"
                >
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
                  hidden
                />
              </div>
              <!-- <div class="file_drop">여기에 파일을 드래그해 주세요.</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button
        @click="activitySave"
        v-if="
          authMode == 'I' &&
          isEditMode &&
          stats != 'T1001' &&
          stats != 'T1002' &&
          stats != 'T1003'
        "
      >
        저장
      </button>
      <button
        @click="activityAction"
        v-if="
          authMode == 'I' &&
          isEditMode &&
          actSeq != '' &&
          stats != 'T1001' &&
          stats != 'T1004'
        "
      >
        승인요청
      </button>
      <button
        @click="activityReject"
        v-if="authMode == 'I' && isEditMode && actSeq != '' && stats == 'T1001'"
      >
        승인요청취소
      </button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
  <!-- <popSearchUser @userInfo="getUserData"></popSearchUser> -->
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import popSearchUser from "./popSearchUser.vue";
import { AgGridVue } from "ag-grid-vue3";
import commonUtil from "@/utils/common-utils";
import {
  ref,
  onBeforeMount,
  getCurrentInstance,
  createHydrationRenderer,
  onBeforeUpdate,
  onMounted,
  defineExpose,
} from "vue";
import { useMajorStore } from "@/stores/safeActvt/major-store";
import majorService from "@/api/services/safeActvt/major-service";
import dayjs from "dayjs";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useFileStore } from "@/stores/common/file-store";

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useMajorStore();
const actMngr = ref("");
const cUtil = commonUtil;
const loginStore = useLoginAuthStore();
const fileStore = useFileStore();

const userId = $loginStore.$state.userInfo.userId;
const vendrCd = ref("");
const siteCd = ref("");
const inspCls = ref("");
const inspSeq = ref("");
const evalTblMstSeq = ref("");
const actAtchFileKey = ref("");
const actComptDt = ref("");
let formData = new FormData();
const isEditMode = ref(true);
const actSeq = ref("");
const stats = ref("");
const param = ref("");

// 저장 여부
const gubun = ref("N");
// 저장, 수정 값
const mode = ref("");

const emit = defineEmits(["loadData", "gridData"]);

// let majorInfo = ref({
//   contyCdNm: "",
//   wrkLoc: "",
//   wrkNm: "",
//   hrmrskMtr: "",
//   rskFctr: "",
//   rskMsr: "",
//   inspDt: "",
//   inspDtl: "",
//   inspRst: "",
//   actExptDt: "",
//   actDemandDtl: "",
//   actMngrNm: "",
//   actDt: "",
//   actDtl: "",
// });

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

const props = defineProps(["rowParams"]);

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
function popupClose(type) {
  deleteData();
  deleteDetailPreview();

  deleteData2();
  deleteDetailPreview2();

  // 팝업에서 저장 구분 여부('저장:Y', 미저장:"N")
  if (gubun.value == "Y") {
    gubun.value = "N";
    // 일상조치활동 재 조회
    emit("gridData", "");
  }
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document
    .getElementsByClassName("activity_action")[0]
    .classList.remove("show");
}

// 데이터 초기화 함수
const deleteData = () => {
  const fileList1 = document.getElementById("activityPhotoPreview");
  //fileList.innerHTML = "";
  formData = new FormData();
  deletePreview();

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

  // majorInfo = ref({
  //   contyCdNm: "",
  //   wrkLoc: "",
  //   wrkNm: "",
  //   hrmrskMtr: "",
  //   rskFctr: "",
  //   rskMsr: "",
  //   inspDt: "",
  //   inspDtl: "",
  //   inspRst: "",
  //   actExptDt: "",
  //   actDemandDtl: "",
  //   actMngrNm: "",
  //   actDt: "",
  //   actDtl: "",
  // });
};

// 데이터 초기화 함수
const deleteData2 = () => {
  const fileList1 = document.getElementById("activityPhotoPreview2");
  //fileList.innerHTML = "";
  formData = new FormData();
  deletePreview2();
  // majorInfo = ref({
  //   contyCdNm: "",
  //   wrkLoc: "",
  //   wrkNm: "",
  //   hrmrskMtr: "",
  //   rskFctr: "",
  //   rskMsr: "",
  //   inspDt: "",
  //   inspDtl: "",
  //   inspRst: "",
  //   actExptDt: "",
  //   actDemandDtl: "",
  //   actMngrNm: "",
  //   actDt: "",
  //   actDtl: "",
  // });

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
};

// 등록, 상세 조회 값 대입
const updateInfo = (params) => {
  upLoadFileList.value = "";
  // 점검결과 사진 초기화
  deleteDetailPreview();

  //조치결과 사진 초기화
  deletePreview2();

  console.log("params==>" + params.data.inspDt);

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
  wrkLoc.value = params.data.wrkNm;
  wrkNm.value = params.data.wrkLoc;
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

  // majorInfo.value.contyCdNm = params.data.contyCdNm;
  // majorInfo.value.wrkNm = params.data.wrkNm;
  // majorInfo.value.wrkLoc = params.data.wrkLoc;
  // majorInfo.value.hrmrskMtr = params.data.hrmrskMtr;
  // majorInfo.value.rskFctr = params.data.rskFctr;
  // majorInfo.value.rskMsr = params.data.rskMsr;
  // majorInfo.value.inspDt = inspDt;
  // majorInfo.value.inspDtl = params.data.inspDtl;
  // majorInfo.value.inspRst = params.data.inspRst;
  // majorInfo.value.actExptDt = actExptDt;
  // majorInfo.value.actDemandDtl = params.data.actDemandDtl;
  // majorInfo.value.actMngrNm = params.data.actMngrNm;
  // majorInfo.value.actDtl = params.data.actDtl;
  // majorInfo.value.actDt = actDt;

  authMode.value = params.data.authMode;
  vendrCd.value = params.data.vendrCd;
  siteCd.value = params.data.siteCd;
  inspCls.value = params.data.inspCls;
  actAtchFileKey.value = params.data.actAtchFileKey;
  inspSeq.value = params.data.inspSeq;
  evalTblMstSeq.value = params.data.evalTblMstSeq;
  //inspAtchFileList.value = params.data.inspAtchFileList;

  console.log("inspAtchFileList.value==>" + params.data.atchFileList);
  console.log("atchFileList.value==>" + params.data.actAtchFileList);

  // 결재 상태
  if (params.data.stats != undefined) {
    stats.value = params.data.stats;
  } else {
    stats.value = "";
  }

  // 등록 actSeq 받아오기
  if (params.data.actSeq != undefined) {
    actSeq.value = params.data.actSeq;
  } else {
    actSeq.value = "";
  }

  console.log("actSeq : " + actSeq.value);
  // 승인요청이나 등록을 한 게시글에 대한 flag 부여
  isEditAuth(params.data);

  console.log("params.data.actAtchFileList)==>@@", params.data.actAtchFileList);

  // 점검 첨부파일
  if (!cUtil.nullCheck(params.data.atchFileList)) {
    detailPreview(params.data.atchFileList);
  }

  // 조치 첨부파일
  if (!cUtil.nullCheck(params.data.actAtchFileList)) {
    detailPreview2(params.data.actAtchFileList);
  }
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

      console.log("count==>>>", count);

      button.onclick = function () {
        console.log("count==>>>>", count);

        if (confirm("삭제하시겠습니까?")) detailDeleteFile(count);
        else return;
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
  console.log("isEditAuth data.inspRst : " + data.inspRst);
  if (data.inspRst != undefined) {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }
};

// 일상점검 조치 승인요청
const activityAction = async () => {
  formData = new FormData();

  //console.log("majorInfo.value : ", majorInfo.value);
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

  const param = {
    mode: authMode.value,

    vendrCd: vendrCd.value,
    siteCd: siteCd.value,
    inspCls: inspCls.value,
    stats: "T1001",
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
  console.log("param : ", param);
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
      alert("승인 요청되었습니다.");
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  // 조치활동 재조회
  emit("gridData", "");

  console.log("param : ", param);

  popupClose();
};

// 일상점검 조치 승인취소
const activityReject = async () => {
  //console.log("majorInfo.value : ", majorInfo.value);
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
  console.log("param : ", param);
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
      alert("승인 요청 취소되었습니다.");
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  console.log("param : ", param);

  // 조치활동 재조회
  emit("gridData", "");

  popupClose();
};

// 일상점검 조치 저장
const activitySave = async () => {
  formData = new FormData();

  // 조치내용 체크
  if (actDtl.value == "") {
    alert("조치내용을 입력해 주세요.");
    document.getElementById("actDtlId").focus();
    return false;
  }
  // 조치일자 체크
  if (actDt.value.replaceAll("-", "").trim() == "") {
    alert("조치일자를 입력해 주세요.");
    document.getElementById("actDtId").focus();
    return false;
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


  const param = {
    mode: actSeq.value != "" ? "U" : "I",
    vendrCd: vendrCd.value,
    siteCd: siteCd.value,
    inspCls: inspCls.value,
    actSeq: actSeq.value,
    stats: stats.value,
    //actAtchFileKey: stats.value == "T1004" ? "" : actAtchFileKey.value,
    actAtchFileKey: actAtchFileKey.value,
    userId: loginStore.siteInfo.userId,
    inspSeq: inspSeq.value,
    inspDt: inspDt.value.replaceAll("-", ""),
    evalTblMstSeq: evalTblMstSeq.value,
    actDt: actDt.value.replaceAll("-", ""),
    actDtl: actDtl.value,
    actComptDt: "",
  };

  console.log("param : ", param);

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  console.log("formData===>" + formData);
  console.log("param===>" + param);
  console.log("upLoadFileList.value==>" + upLoadFileList.value);

  // 첨부파일 FormData 추가
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    upLoadFileList.value.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  try {
    deleteDetailPreview2();

    // 조치 저장
    const res = await store.savePntActDsctn(formData);

    console.log("res.data==>", res.data);

    if (res.data > 0) {
      alert("저장되었습니다.");
    } else {
      // 이미 등록 된 안전활동 조치가 존재합니다.
      alert(res.data.message);
      popupClose();
    }

    // 저장 여부
    gubun.value = "Y";
    //조치내역 팝업 재조회
    emit("loadData", res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
  console.log("param : ", param);

  // 팝업 닫기
  //popupClose();
};

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

.activity_action {
  width: 800px;
  height: 800px;
}
</style>
