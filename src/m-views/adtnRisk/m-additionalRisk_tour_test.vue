<template>
  <div class="m_page_top_btn">
    <router-link to="/ADTN_RISK/m-additionalRisk"
      ><button>목록으로</button></router-link
    >
    <button class="submit" @click="tourSave" v-if="!isEditMode">등록</button>
  </div>

  <div class="item_wrap w100p mt30">
    <span class="p_title">공종</span><br />
    <select id="tourTapp" :disabled="pageFlag == 'tourDetail'">
      <option
        v-for="(item, index) in tourSelData"
        :key="index"
        :value="item.contyCd">
        {{ item.contyCdNm }}
      </option>
    </select>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">작업명</span><br />
    <input type="text" class="search_input" v-model="wrkNm" readonly />
    <button
      class="search_btn"
      @click="addFactorStandardTour"
      v-if="pageFlag != 'tourDetail'"></button>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">장소</span><br />
    <input
      type="text"
      v-model="wrkLoc"
      :readonly="isEditMode"
      maxlength="200" />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위험물</span><br />
    <input
      type="text"
      v-model="hrmrskMtr"
      :readonly="isEditMode"
      maxlength="200" />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위험요인</span><br />
    <textarea v-model="rskFctr" :readonly="isEditMode" maxlength="300">
    </textarea>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">감소대책</span><br />
    <textarea
      v-model="rskMsr"
      :readonly="isEditMode"
      maxlength="2000"></textarea>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위험성</span>
    <input
      class="w40p mr10"
      readonly
      :value="SiteRuleInfo.comCdNm"
      v-if="SiteRuleInfo" />
    <span
      class="riskCombo"
      id="r01"
      v-if="SiteRuleInfo"
      :class="{ show: SiteRuleInfo.comCd == 'T0501' }">
      <input
        type="radio"
        name="danger"
        id="danger01"
        v-model="rst"
        value="3"
        :disabled="isEditMode" /><label for="danger01">상</label>
      <input
        type="radio"
        name="danger"
        id="danger02"
        v-model="rst"
        value="2"
        :disabled="isEditMode" /><label for="danger02">중</label>
      <input
        type="radio"
        name="danger"
        id="danger03"
        v-model="rst"
        value="1"
        :disabled="isEditMode" /><label for="danger03">하</label>
    </span>

    <span
      class="riskCombo"
      id="r02"
      v-if="SiteRuleInfo"
      :class="{ show: SiteRuleInfo.comCd == 'T0502' }">
      <span class="mr5">빈도</span>
      <select
        class="w60 mr10"
        v-model="freq"
        @change="rstUpdate"
        :disabled="isEditMode">
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <span class="mr5">강도</span>
      <select
        class="w60 mr10"
        v-model="strngth"
        @change="rstUpdate"
        :disabled="isEditMode">
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <span class="mr5">결과</span>
      <input type="text" class="w60" v-model="rst" id="r02_rst" readonly />
    </span>
    <span
      class="riskCombo"
      id="r03"
      v-if="SiteRuleInfo"
      :class="{ show: SiteRuleInfo.comCd == 'T0503' }">
      <span class="mr5">빈도</span>
      <select
        class="w60 mr10"
        v-model="freq"
        @change="rstUpdate"
        :disabled="isEditMode">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
      <span class="mr5">강도</span>
      <select
        class="w60 mr10"
        v-model="strngth"
        @change="rstUpdate"
        :disabled="isEditMode">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
      <span class="mr5">결과</span>
      <input type="text" class="w60" v-model="rst" id="r03_rst" readonly />
    </span>
  </div>
  <div class="item_wrap w100p">
    <span class="p_title">조치예정일</span>
    <datepicker v-model="actExptDt" :disabled="isEditMode" :key="actKey" />
    <!-- <input type="date" v-model="actExptDt" :readonly="isEditMode" /> -->
  </div>
  <div class="item_wrap w100p">
    <span class="p_title">담당자</span>
    <input type="text" class="search_input" v-model="actMngr" readonly />
    <button
      class="search_btn"
      @click="popupSearchUser()"
      v-if="!isEditMode"></button>
  </div>

  <div class="clear"></div>

  <div class="m_subtitle">
    점검결과 첨부
    {{ tempFileList }}
    <file-handler
      table="ADD_RSK_DSCV"
      :readOnly="isEditMode"
      :files="existingFiles"
      ref="fileHandlerRef"
      v-if="!isEditMode" />
  </div>

  <popRiskFactorStandardTour
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    @riskFactor_tour="riskFactor_tour">
  </popRiskFactorStandardTour>
  <popSearchUser @userInfo="getUserData"></popSearchUser>
</template>

<script setup>
import popRiskFactorStandardTour from "@/m-views/adtnRisk/popRiskFactorStandardTour.vue";
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import commonUtil from "@/utils/common-utils";
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import datepicker from "vue3-datepicker";
import popSearchUser from "./popSearchUser.vue";
const cUtils = commonUtil;

import fileHandler from "@/components/file/m-fileHandler.vue";

const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "순회점검 등록"; // 페이지 타이틀 입력
//const toolBoxRegiStore = useToolBoxMeetingRegistStore();
//let upLoadFileList = ref([]);
let formData = new FormData();
const loginAuth = useLoginAuthStore();
const adtnStore = useAdtnRiskStore();
const tourSelData = ref([]);
const SiteRuleInfo = ref();
const tourMemInfo = ref({});
const wrkNm = ref("");
const wrkLoc = ref("");
const hrmrskMtr = ref("");
const rskFctr = ref("");
const rskMsr = ref("");
let modeFlag = ref();
let isEditMode = ref(false);
const url = import.meta.env.VITE_APP_API_DEV_URL;
const router = useRouter();
const route = useRoute();
let pageFlag = ref();
const freq = ref("");
const strngth = ref("");
const rst = ref("");
const actExptDt = ref();
const actMngr = ref("");
const app = getCurrentInstance();
let validChk = true;
let tempFileList = ref([]);
let actKey = ref(0);

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

// 작업명 저장 함수
const riskFactor_tour = (item) => {
  wrkNm.value = item.wrkNm;

  tourMemInfo.lgCatCd = item.lgCatCd;
  tourMemInfo.mdCatCd = item.mdCatCd;
  tourMemInfo.wrkNmCd = item.wrkNmCd;
  tourMemInfo.lgCatNm = item.lgCatNm;
  tourMemInfo.mdCatNm = item.mdCatNm;
};

function addFactorStandardTour() {
  document
    .getElementsByClassName("add_factor_standardTour")[0]
    .classList.add("show");
}

// 직원정보 추가 -담당자 선택 팝업
function popupSearchUser() {
  document.getElementsByClassName("popup_bg2")[0].classList.add("show");
  document.getElementsByClassName("search_user")[0].classList.add("show");
}

// 담당자 선택 후 함수
function getUserData(data) {
  tourMemInfo.actMngr = data.userId;
  actMngr.value = data.vendrNm + " / " + data.userNm;
}

// 결과값 저장 함수
const rstUpdate = () => {
  rst.value = freq.value * strngth.value;
};

// 모바일 업로드 콜백 함수
// window.uploadCallback = function (result) {
//   if (result == "") {
//     alert("10MB 사이즈 미만만 업로드가 가능합니다.");
//     return;
//   }
//   tourMemInfo.atchFileKey = result.atchFileKey;
//   appDrawPreview(result);
// };

// 모바일 파일 업로드 함수
// const fileBtn = () => {
//   const isMobile = app.appContext.config.globalProperties.$isMobile;
//   if (
//     tourMemInfo.atchFileKey === undefined ||
//     tourMemInfo.atchFileKey === "null"
//   ) {
//     tourMemInfo.atchFileKey = "";
//   }
//   const atchFileKey = tourMemInfo.atchFileKey;
//   const userId = loginAuth.$state.userInfo.userId;
//   const vendrCd = loginAuth.$state.siteInfo.vendrCd;
//   const siteCd = loginAuth.$state.siteInfo.siteCd;
//   if (isMobile) {
//     location.href =
//       "tapp://upload?vendrCd=" +
//       vendrCd +
//       "&userId=" +
//       userId +
//       "&atchFileKey=" +
//       atchFileKey +
//       "&siteCd=" +
//       siteCd;
//   }
// };
// App 파일 등록 함수
// const appDrawPreview = (results) => {
//   for (let result of results) {
//     tempFileList.value.push(result);
//     tourMemInfo.atchFileKey = result.atchFileKey;
//     let li = document.createElement("li");
//     let img = document.createElement("img");
//     let div = document.createElement("div");

//     li.setAttribute("id", "tourLiFileI_" + result.fileNm);
//     div.setAttribute("id", "tourDivFileI_" + result.fileNm);
//     img.setAttribute(
//       "src",
//       url +
//         "/v1/common/getImage?param1=" +
//         result.filePath +
//         "&param2=" +
//         result.fileNm
//     );
//     img.setAttribute("id", "tourImgFileI_" + result.fileNm);
//     div.textContent = "다운로드";
//     div.setAttribute("class", "file_name");
//     div.addEventListener("click", async function () {
//       let link = document.createElement("a");
//       let downloadUrl =
//         url +
//         "/v1/common/getImage?param1=" +
//         result.filePath +
//         "&param2=" +
//         result.fileNm;
//       link.href = downloadUrl;
//       link.download = result.fileNm;
//       document.body.appendChild(link);
//       link.click();
//       window.URL.revokeObjectURL(downloadUrl);
//       document.body.removeChild(link);
//     });

//     if (!isEditMode.value) {
//       let button = document.createElement("button");
//       button.textContent = "삭제";
//       button.setAttribute("id", "tourBtnFileI_" + result.fileNm);
//       button.setAttribute("class", "del");
//       button.onclick = function () {
//         if (confirm("파일을 삭제하시겠습니까?")) {
//           const param = {
//             atchFileKey: result.atchFileKey,
//             fileSeq: result.fileSeq,
//             fileNm: result.fileNm,
//             filePath: result.filePath,
//           };
//           appDeleteFile(param);
//         }
//       };
//       li.appendChild(button);
//     }

//     document.getElementById("tourPhotoPreview").appendChild(li);

//     li.appendChild(img);
//     li.appendChild(div);
//   }
// };

// App 파일 삭제 함수
// const appDeleteFile = async (data) => {
//   const vendrCd = loginAuth.$state.siteInfo.vendrCd;
//   const userId = loginAuth.$state.userInfo.userId;
//   const imgToDelete = document.getElementById("tourImgFileI_" + data.fileNm);
//   const liToDelete = document.getElementById("tourLiFileI_" + data.fileNm);
//   const buttonToDelete = document.getElementById("tourBtnFileI_" + data.fileNm);
//   const divToDelete = document.getElementById("tourDivFileI_" + data.fileNm);

//   if (imgToDelete) {
//     imgToDelete.remove();
//   }
//   if (liToDelete) {
//     liToDelete.remove();
//   }
//   if (buttonToDelete) {
//     buttonToDelete.remove();
//   }
//   if (divToDelete) {
//     divToDelete.remove();
//   }

//   const index = tempFileList.value.findIndex(
//     (file) => file.fileNm == data.fileNm
//   );
//   if (index != -1) {
//     tempFileList.value.splice(index, 1);
//   }

//   const param = {
//     vendrCd: vendrCd,
//     atchFileKey: data.atchFileKey,
//     fileSeq: data.fileSeq,
//     fileNm: data.fileNm,
//     filePath: data.filePath,
//     userId: userId,
//   };
//   await adtnStore.adtnRiskDeleteFile(param);
// };

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();

  document.getElementById("tourTapp").options[0].selected = true;
  tourMemInfo.value = {};
  wrkNm.value = "";
  wrkLoc.value = "";
  //plac.value = "";
  hrmrskMtr.value = "";
  rskFctr.value = "";
  // document.getElementById("tourFile").value = "";
  freq.value = "";
  strngth.value = "";
  rst.value = "";
  rskMsr.value = "";
  //actExptDt.value = dayjs().format("YYYY-MM-DD");
  actExptDt.value = new Date();
  actMngr.value = "";
  pageFlag.value = "";
  tempFileList.value = "";
  //upLoadFileList.value = "";

  // const imgElement = document
  //   .getElementById("tourPhotoPreview")
  //   .querySelectorAll("img");

  // const liElement = document
  //   .getElementById("tourPhotoPreview")
  //   .querySelectorAll("li");

  // const btnElement = document
  //   .getElementById("tourPhotoPreview")
  //   .querySelectorAll('[id*="tourBtnFile"]');

  // const divElement = document
  //   .getElementById("tourPhotoPreview")
  //   .querySelectorAll("div");

  // imgElement.forEach((img) => {
  //   img.remove();
  // });
  // liElement.forEach((li) => {
  //   li.remove();
  // });
  // btnElement.forEach((btn) => {
  //   btn.remove();
  // });
  // divElement.forEach((div) => {
  //   div.remove();
  // });
}

// 현재 라우터의 정보에 접근하는 함수
const updateMode = () => {
  modeFlag.value = route.params.mode;
};

// mode 값이 변경되면 실행하는 함수
const handleModeChange = () => {
  if (modeFlag.value == "U") {
    detailSearch();
  }
};

watch(modeFlag, handleModeChange);

watch(actExptDt, () => {
  actKey.value++;
});

// 상세조회 함수
const detailSearch = async () => {
  const param = route.params.param;
  const adtnDetailinfo = await adtnStore.searchDetailList(param);
  adtnDetailinfo[0].pageFlag = "tourDetail";
  updateInfo(adtnDetailinfo);
};

// 수정 데이터 불러오기 함수
const existingFiles = ref([]);
function updateInfo(param) {
  const userId = loginAuth.$state.userInfo.userId;
  if (userId != param[0].regId) {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }

  tourMemInfo.dscvSeq = param[0].dscvSeq; // 업데이트 시 파일 순번 필요

  pageFlag.value = param[0].pageFlag;
  wrkNm.value = param[0].wrkNm;
  //plac.value = param[0].plac;
  wrkLoc.value = param[0].wrkLoc;
  hrmrskMtr.value = param[0].hrmrskMtr;
  rskFctr.value = param[0].rskFctr;
  strngth.value = param[0].strngth;
  freq.value = param[0].freq;
  rst.value = param[0].rst;
  rskMsr.value = param[0].rskMsr;
  // actExptDt.value = param[0].actExptDt.replace(
  //   /(\d{4})(\d{2})(\d{2})/,
  //   "$1-$2-$3"
  // );
  if (!cUtils.nullCheck(param[0].actExptDt)) {
    actExptDt.value = cUtils.stringToPicker(param[0].actExptDt);
  }
  if (cUtils.nullCheck(param[0].vendrNm)) param[0].vendrNm = "";
  if (cUtils.nullCheck(param[0].userNm)) param[0].userNm = "";

  if (param[0].vendrNm == "" && param[0].userNm == "") {
    actMngr.value = "";
  } else {
    actMngr.value = param[0].vendrNm + " / " + param[0].userNm;
  }

  // 담당자 데이터 넣기
  tourMemInfo.actMngr = param[0].actMngr;

  // 작업명 데이터 넣기
  tourMemInfo.lgCatCd = param[0].lgCatCd;
  tourMemInfo.mdCatCd = param[0].mdCatCd;
  tourMemInfo.wrkNmCd = param[0].wrkNmCd;
  tourMemInfo.lgCatNm = param[0].lgCatNm;
  tourMemInfo.mdCatNm = param[0].mdCatNm;

  tourMemInfo.atchFileKey = param[0].atchFileKey;

  let SelCount = document.getElementById("tourTapp").options;
  for (let count of SelCount) {
    if (count.value == param[0].contyCd) count.selected = true;
  }
  console.log("상세보기 param >>>>>>>>>>>>>>>>> : ", param);
  // 사진이 있는지 확인
  //detailPreview(param);

  // 파일 프리뷰 위해 서버에 업로드 된 파일 리스트 생성
  existingFiles.value = param.map((item) => {
    if (item.filePath) {
      return {
        filePath: item.filePath,
        fileNm: item.fileNm,
        fileSeq: item.fileSeq,
        atchFileKey: item.atchFileKey,
      };
    }
  });
}

// 상세조회 사진 미리보기
// const detailPreview = (param) => {
//   for (let count of param) {
//     if (count.filePath) {
//       let li = document.createElement("li");
//       let img = document.createElement("img");
//       let div = document.createElement("div");

//       li.setAttribute("id", "tourLiFileU_" + count.fileNm);
//       div.setAttribute("id", "tourDivFileU_" + count.fileNm);
//       img.setAttribute(
//         "src",
//         url +
//           "/v1/common/getImage?param1=" +
//           count.filePath +
//           "&param2=" +
//           count.fileNm
//       );
//       img.setAttribute("id", "tourImgFileU_" + count.fileNm);
//       div.textContent = "다운로드";
//       div.setAttribute("class", "file_name");
//       div.addEventListener("click", async function () {
//         let link = document.createElement("a");
//         let downloadUrl =
//           url +
//           "/v1/common/getImage?param1=" +
//           count.filePath +
//           "&param2=" +
//           count.fileNm;
//         link.href = downloadUrl;
//         link.download = count.fileNm;
//         document.body.appendChild(link);
//         link.click();
//         window.URL.revokeObjectURL(downloadUrl);
//         document.body.removeChild(link);
//       });

//       if (!isEditMode.value) {
//         let button = document.createElement("button");
//         button.setAttribute("id", "tourBtnFileU_" + count.fileNm);
//         button.setAttribute("class", "del");
//         button.onclick = function () {
//           if (confirm("파일을 삭제하시겠습니까?")) {
//             detailDeleteFile(count);
//           }
//         };
//         li.appendChild(button);
//       }

//       document.getElementById("tourPhotoPreview").appendChild(li);

//       li.appendChild(img);
//       li.appendChild(div);

//       //upLoadFileList.value = [...upLoadFileList.value, count];
//     }
//   }

//   //console.log("upLoadFileList + ", upLoadFileList.value);
// };

// 상세보기 파일 삭제
// const detailDeleteFile = async (data) => {
//   const vendrCd = loginAuth.$state.siteInfo.vendrCd;
//   const userId = loginAuth.$state.userInfo.userId;

//   const imgToDelete = document.getElementById("tourImgFileU_" + data.fileNm);
//   const spanToDelete = document.getElementById("tourSpanFileU_" + data.fileNm);
//   const buttonToDelete = document.getElementById("tourBtnFileU_" + data.fileNm);
//   const divToDelete = document.getElementById("tourDivFileU_" + data.fileNm);
//   console.log("buttonToDelete : " + buttonToDelete);

//   if (imgToDelete) {
//     imgToDelete.remove();
//   }
//   if (spanToDelete) {
//     spanToDelete.remove();
//   }
//   if (buttonToDelete) {
//     buttonToDelete.remove();
//   }
//   if (divToDelete) {
//     divToDelete.remove();
//   }

//   if (pageFlag.value == "tourDetail") {
//     const param = {
//       vendrCd: vendrCd,
//       atchFileKey: data.atchFileKey,
//       fileSeq: data.fileSeq,
//       fileNm: data.fileNm,
//       filePath: data.filePath,
//       userId: userId,
//     };
//     console.log("삭제 파람>>>>>>>>>>>>>>>>> : ", param);
//     await adtnStore.adtnRiskDeleteFile(param);
//   }

//   // const index = upLoadFileList.value.findIndex(
//   //   (file) => file.name == data.name
//   // );
//   // if (index != -1) {
//   //   upLoadFileList.value.splice(index, 1);
//   // }
// };

// valid 함수
const validCheck = () => {
  if (wrkNm.value == "") {
    alert("작업명 값이 비어 있습니다. ");
    validChk = false;
  } else if (wrkLoc.value == "") {
    alert("장소 값이 비어 있습니다.");
    validChk = false;
  } else if (hrmrskMtr.value == "") {
    alert("위험물 값이 비어 있습니다.");
    validChk = false;
  } else if (rskFctr.value == "") {
    alert("위험요인 값이 비어 있습니다.");
    validChk = false;
  } else if (rskMsr.value == "") {
    alert("감소대책 값이 비어 있습니다.");
    validChk = false;
  } else {
    validChk = true;
  }
  return validChk;
};

// 파일 핸들러의 새로 업로드 된 파일들 목록을 가져오기 위한 ref
const fileHandlerRef = ref(null);
const getNewUploadFiles = () => {
  if (fileHandlerRef.value) {
    return fileHandlerRef.value.getNewUploadFiles();
  } else {
    return null;
  }
};

// 모바일 아차사고 등록 함수
const tourSave = async (e) => {
  if (!validCheck()) return;

  // 첨부파일 FormData 추가
  tempFileList.value = getNewUploadFiles();
  tourMemInfo.atchFileKey = tempFileList.value[0].atchFileKey;

  let info = tourSaveList();

  if (tempFileList.value != "") {
    const param = { fileList: tempFileList.value };
    await adtnStore.appTempFileUpdate(param);
    alert(tempFileList.value[0].atchFileKey);
  }
  await adtnStore.mobileSaveList(info);
  deleteInput();
  router.push("/ADTN_RISK/m-additionalRisk");
};

// 저장 함수
const tourSaveList = () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;

  if (pageFlag.value != "tourDetail") {
    tourMemInfo.mode = "I"; // 수정 플래그
  } else {
    tourMemInfo.mode = "U"; // 등록 플래그
  }
  console.log("tourMemInfo.mode : " + tourMemInfo.mode);
  tourMemInfo.contyCd =
    document.getElementById("tourTapp").options[
      document.getElementById("tourTapp").selectedIndex
    ].value;
  tourMemInfo.dscvTypeCd = "T1101"; //순회점검
  tourMemInfo.wrkNm = wrkNm.value;
  //tourMemInfo.plac = plac.value;
  tourMemInfo.wrkLoc = wrkLoc.value;
  tourMemInfo.hrmrskMtr = hrmrskMtr.value;
  tourMemInfo.rskFctr = rskFctr.value;
  tourMemInfo.freq = freq.value;
  tourMemInfo.strngth = strngth.value;
  tourMemInfo.rst = rst.value;
  tourMemInfo.rskMsr = rskMsr.value;
  //tourMemInfo.actExptDt = actExptDt.value.split("-").join(""); // 등록일 하이픈 제거
  tourMemInfo.actExptDt = cUtils.pickerToString(actExptDt.value);
  //tourMemInfo.actMngr = actMngr.value;
  if (actMngr.value == "") {
    tourMemInfo.actMngr = "";
  }

  tourMemInfo.vendrCd = vendrCd;
  tourMemInfo.siteCd = siteCd;
  tourMemInfo.userId = userId;
  // 테스트 데이터 삽입 end
  console.log("tourMemInfo : ", tourMemInfo);
  formData.append(
    "param",
    new Blob([JSON.stringify(tourMemInfo)], { type: "application/json" })
  );

  return formData;
};

onMounted(() => {
  // 공종 가져오기
  const TappMgmt = adtnStore.$state.TappMgmtList;
  tourSelData.value = TappMgmt;

  // 위험성 가져오기
  const SiteRule = adtnStore.$state.siteRuleList;
  SiteRuleInfo.value = SiteRule;
  console.log("SiteRuleInfo : ", SiteRuleInfo);

  updateMode();
});
</script>

<style scoped>
.item_wrap input[type="text"],
.item_wrap input[type="date"],
.item_wrap input[type="time"],
.item_wrap select {
  width: 100%;
}
.m_subtitle {
  margin-top: 50px;
}
.switch {
  margin: 4px 0px;
}
.riskCombo {
  display: none;
}
.riskCombo.show {
  display: inline;
}
.add_user_search {
  width: 100%;
  height: 70%;
}
</style>
