<template>
  <div class="m_page_top_btn">
    <router-link to="/ADTN_RISK/m-additionalRisk">
      <comp-button type="list" text="목록"></comp-button>
    </router-link>
    <comp-button
      type="save"
      text="등록"
      requiredAuth
      v-if="!isEditMode"
      @click="workdentReportSave"></comp-button>
  </div>

  <div class="item_wrap w100p mt30">
    <span class="p_title">공종</span><br />
    <select id="workTapp" :disabled="pageFlag == 'workDetail'">
      <option
        v-for="(item, index) in workSelData"
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
      @click="addFactorStandardwork"
      v-if="pageFlag != 'workDetail'"></button>
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
    <span class="p_title">생각/경험적 위험요인</span><br />
    <textarea v-model="rskFctr" :readonly="isEditMode" maxlength="300">
    </textarea>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">감소대책 제안</span><br />
    <textarea
      v-model="rskMsr"
      :readonly="isEditMode"
      maxlength="2000"></textarea>
  </div>

  <div class="clear"></div>

  <div class="m_subtitle">
    점검결과 첨부
    <file-handler
      table="ADD_RSK_DSCV"
      :readOnly="isEditMode"
      :fileKey="existingFile"
      ref="fileHandlerRef" />
  </div>

  <popRiskFactorStandardWork
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    @riskFactor_work="riskFactor_work"></popRiskFactorStandardWork>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import fileHandler from "@/components/file/m-fileHandler.vue";
import popRiskFactorStandardWork from "@/m-views/adtnRisk/popRiskFactorStandardWork.vue";

import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
const dialogStore = useDialogStore();

const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "근로자 제보"; // 페이지 타이틀 입력

const loginAuth = useLoginAuthStore();
const adtnStore = useAdtnRiskStore();
const workSelData = ref([]);
const workMemInfo = ref({});
const wrkNm = ref("");
const wrkLoc = ref("");
const hrmrskMtr = ref("");
const rskFctr = ref("");
const rskMsr = ref("");
const router = useRouter();
const route = useRoute();
const existingFile = ref("");

let formData = new FormData();
let modeFlag = ref();
let isEditMode = ref(false);
let pageFlag = ref();
let validChk = true;
let tempFileList = ref([]);

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

function addFactorStandardwork() {
  document
    .getElementsByClassName("add_factor_standardWork")[0]
    .classList.add("show");
}

// 작업명 저장 함수
const riskFactor_work = (item) => {
  wrkNm.value = item.wrkNm;

  workMemInfo.lgCatCd = item.lgCatCd;
  workMemInfo.mdCatCd = item.mdCatCd;
  workMemInfo.wrkNmCd = item.wrkNmCd;
  workMemInfo.lgCatNm = item.lgCatNm;
  workMemInfo.mdCatNm = item.mdCatNm;
};

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  document.getElementById("workTapp").options[0].selected = true;
  wrkNm.value = "";
  wrkLoc.value = "";
  hrmrskMtr.value = "";
  rskFctr.value = "";
  rskMsr.value = "";
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

// 상세조회 함수
const detailSearch = async () => {
  const param = route.params.param;
  const adtnDetailinfo = await adtnStore.searchDetailList(param);
  adtnDetailinfo[0].pageFlag = "workDetail";
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

  workMemInfo.dscvSeq = param[0].dscvSeq; // 업데이트 시 파일 순번 필요

  pageFlag.value = param[0].pageFlag;
  wrkNm.value = param[0].wrkNm;
  //plac.value = param[0].plac;
  wrkLoc.value = param[0].wrkLoc;
  hrmrskMtr.value = param[0].hrmrskMtr;
  rskFctr.value = param[0].rskFctr;
  rskMsr.value = param[0].rskMsr;

  // 작업명 데이터 넣기
  workMemInfo.lgCatCd = param[0].lgCatCd;
  workMemInfo.mdCatCd = param[0].mdCatCd;
  workMemInfo.wrkNmCd = param[0].wrkNmCd;
  workMemInfo.lgCatNm = param[0].lgCatNm;
  workMemInfo.mdCatNm = param[0].mdCatNm;

  workMemInfo.atchFileKey = param[0].atchFileKey;

  let SelCount = document.getElementById("workTapp").options;
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
    dialogStore.openAlertDialog("생각/경험적 위험요인 값이 비어 있습니다.");
    validChk = false;
  } else if (rskMsr.value == "") {
    dialogStore.openAlertDialog("감소대책 제안 값이 비어 있습니다.");
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
const workdentReportSave = async (e) => {
  if (!validCheck()) return;

  let info = workSaveList();

  if (tempFileList.value.length > 0) {
    const param = { fileList: tempFileList.value };
    await adtnStore.appTempFileUpdate(param);
  }

  await adtnStore.mobileSaveList(info);
  deleteInput();
  router.push("/ADTN_RISK/m-additionalRisk");
};
// 아차사고 데이터 저장 함수
const workSaveList = () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;
  console.log("pageFlag.value : " + pageFlag.value);
  if (pageFlag.value == "workDetail") {
    workMemInfo.mode = "U"; // 수정 플래그
  } else {
    workMemInfo.mode = "I"; // 등록 플래그
  }
  workMemInfo.contyCd =
    document.getElementById("workTapp").options[
      document.getElementById("workTapp").selectedIndex
    ].value;
  workMemInfo.dscvTypeCd = "T1102"; //아차사고 등록
  workMemInfo.wrkNm = wrkNm.value;
  //workMemInfo.plac = plac.value;
  workMemInfo.wrkLoc = wrkLoc.value;
  workMemInfo.hrmrskMtr = hrmrskMtr.value;
  workMemInfo.rskFctr = rskFctr.value;
  workMemInfo.rskMsr = rskMsr.value;

  workMemInfo.vendrCd = vendrCd;
  workMemInfo.siteCd = siteCd;
  workMemInfo.userId = userId;

  // 첨부파일 FormData 추가
  tempFileList.value = getNewUploadFiles();

  if (tempFileList.value.length > 0) {
    workMemInfo.atchFileKey = tempFileList.value[0].atchFileKey;
  }

  console.log("근로자 등록 정보 : " + JSON.stringify(workMemInfo));
  // 테스트 데이터 삽입 end
  formData.append(
    "param",
    new Blob([JSON.stringify(workMemInfo)], { type: "application/json" })
  );

  return formData;
};

onMounted(() => {
  // 공종 가져오기
  const TappMgmt = adtnStore.$state.TappMgmtList;
  workSelData.value = TappMgmt;

  // 현재 상세보기 및 등록 플래그 함수
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
</style>
