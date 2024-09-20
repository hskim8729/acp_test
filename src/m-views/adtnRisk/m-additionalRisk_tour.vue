<template>
  <div ref="scrollMove" class="scroll-container">
    <div class="m_page_top_btn">
      <router-link to="/ADTN_RISK/m-additionalRisk">
        <comp-button type="list" text="목록"></comp-button>
      </router-link>
      <comp-button
        type="save"
        text="등록"
        requiredAuth
        v-if="!isEditMode"
        @click="tourSave"></comp-button>
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
      <!-- <div class="m_subtitle"> -->
      <span class="p_title">점검결과 첨부</span>
      <file-handler
        table="ADD_RSK_DSCV"
        :readOnly="isEditMode"
        :fileKey="existingFile"
        ref="fileHandlerRef"
        @after-upload-file="afterUploadFile" />
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
    </div>
    <div class="item_wrap w100p">
      <span class="p_title">담당자</span>
      <input type="text" class="search_input" v-model="actMngr" readonly />
      <button
        class="search_btn"
        @click="popupSearchUser()"
        v-if="!isEditMode"></button>
    </div>
  </div>

  <!-- <div class="clear"></div> -->

  <popRiskFactorStandardTour
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    @riskFactor_tour="riskFactor_tour">
  </popRiskFactorStandardTour>
  <popSearchUser @userInfo="getUserData"></popSearchUser>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import datepicker from "vue3-datepicker";

import commonUtil, { useAiLogin } from "@/utils/common-utils";

import fileHandler from "@/components/file/m-fileHandler.vue";
import popRiskFactorStandardTour from "@/m-views/adtnRisk/popRiskFactorStandardTour.vue";
import popSearchUser from "./popSearchUser.vue";

import aiRiskEvalService from "@/api/services/aiRiskEval/ai-risk-eval-service.js";
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const cUtils = commonUtil;
const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "순회점검 등록"; // 페이지 타이틀 입력
let formData = new FormData();
const dialogStore = useDialogStore();
const loginAuth = useLoginAuthStore();
const adtnStore = useAdtnRiskStore();
const { sendLoginInfo } = useAiLogin();
const tourSelData = ref([]);
const SiteRuleInfo = ref();
const tourMemInfo = ref({});
const wrkNm = ref("");
const wrkLoc = ref("");
const hrmrskMtr = ref("");
const rskFctr = ref("");
const rskMsr = ref("");
const freq = ref("");
const strngth = ref("");
const rst = ref("");
const actExptDt = ref();
const actMngr = ref("");
const router = useRouter();
const route = useRoute();
const existingFile = ref("");

let pageFlag = ref();
let modeFlag = ref();
let isEditMode = ref(false);
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
  tempFileList.value = [];
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

  // 파일 프리뷰 위해 서버에 업로드 된 파일 리스트 생성
  existingFile.value = param[0].atchFileKey;
}

// valid 함수
const validCheck = () => {
  if (wrkNm.value == "") {
    dialogStore.openAlertDialog("작업명 값이 비어 있습니다. ");
    validChk = false;
  } else if (wrkLoc.value == "") {
    dialogStore.openAlertDialog("장소 값이 비어 있습니다.");
    validChk = false;
  } else if (hrmrskMtr.value == "") {
    dialogStore.openAlertDialog("위험물 값이 비어 있습니다.");
    validChk = false;
  } else if (rskFctr.value == "") {
    dialogStore.openAlertDialog("위험요인 값이 비어 있습니다.");
    validChk = false;
  } else if (rskMsr.value == "") {
    dialogStore.openAlertDialog("감소대책 값이 비어 있습니다.");
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

  let info = tourSaveList();

  if (tempFileList.value.length > 0) {
    const param = { fileList: tempFileList.value };
    await adtnStore.appTempFileUpdate(param);
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

  // 첨부파일 FormData 추가
  tempFileList.value = getNewUploadFiles();

  if (tempFileList.value.length > 0) {
    tourMemInfo.atchFileKey = tempFileList.value[0].atchFileKey;
  }

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

const fetchImageAsBlob = async (url) => {
  try {
    // 이미지 데이터를 fetch로 가져오기
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // 응답을 Blob으로 변환
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error("Error fetching the image:", error);
    return null;
  }
};

const afterUploadFile = async (imgSrc) => {
  if (!imgSrc || imgSrc.length === 0) {
    dialogStore.openAlertDialog("업로드된 파일이 없습니다.");
    return false;
  }

  dialogStore.openConfirmDialog(
    "위험요인과 감소대책 작성을<br>AI에게 추천 받으시겠습니까?",
    {
      confirmCallback: async () => {
        await sendLoginInfo();

        // 이미지 src를 blob으로 변환
        const blobData = await fetchImageAsBlob(imgSrc[0]);
        const reader = new FileReader();

        reader.onload = async function (e) {
          const fileUrl = e.target.result;
          await sendUploadFile(fileUrl);
        };

        // // 파일 읽기를 시작합니다.
        reader.readAsDataURL(blobData);
      },
    }
  );
};

// 이미지 기반 추천
const sendUploadFile = async (fileUrl) => {
  const param = {
    vendrCd: loginAuth.$state.siteInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    client_id: loginAuth.$state.userInfo.userId,
    conversation_id: sessionStorage.getItem("aiConversationId"),
    access_token: sessionStorage.getItem("aiToken"),
    img_src: fileUrl,
  };

  try {
    await aiRiskEvalService
      .axiosCallAI("/v1/chat/reqImageBasedRcmnd", param)
      .then((res) => {
        if (res.data != null) {
          let responseData = res.data.dta;
          let riskFactor = responseData["risk_factor"];
          let reductionMeasure = responseData["reduction_measure"];
          let riskFactorString = "";
          let reductionMeasureString = "";

          riskFactorString = riskFactor
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");

          reductionMeasureString = reductionMeasure
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");

          rskFctr.value = riskFactorString; // 위험요인
          rskMsr.value = reductionMeasureString; // 감소대책

          scrollToBottom();
          dialogStore.openToastDialog("AI 추천이 완료되었습니다.");
        } else {
          dialogStore.openAlertDialog("파일을 다시 업로드해주세요.");
        }
      });
  } catch (error) {
    console.error("요청 중 오류 발생:", error);
  }
};

const scrollMove = ref(null);
const scrollToBottom = () => {
  if (scrollMove.value) {
    scrollMove.value.scrollTo({
      top: scrollMove.value.scrollHeight,
      behavior: "smooth",
    });
  }
};
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
.scroll-container {
  max-height: 100%;
  overflow-y: auto;
}
/* 스크롤바 숨기기 */
.scroll-container::-webkit-scrollbar {
  display: none;
}
</style>
