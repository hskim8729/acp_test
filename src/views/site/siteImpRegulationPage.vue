<template>
  <comm-safe-duty page-title="현장 실시규정 표준">
    <template #toolbarBody>
      <comp-button
        v-if="!readonly"
        @click="onSaveCheckedButton"
        type="save"
        text="저장"
        requiredAuth
        class="mr-2" />

      <!-- 결재의견 팝업 -->
      <div class="mr-2" v-if="isShowBtn">
        <pop-appr-opnn
          :apprUserList="apprUserList"
          :crntApprOver="crntApprOver"
          :apprBtnNm="apprBtnNm"
          :key="apprUserList"
          @apprOpnn="saveApprMst" />
      </div>

      <!-- 레포트 출력 -->
      <report-view-button
        :disabled="regCnt === 0 || siteRegApprCnt === 0"
        alert-text="현장 실시규정을 등록한 후에 출력할 수 있습니다."
        :params="reportParams" />
    </template>
    <template #infoBody>
      <p>사업장내 유해・위험요인을 확인하고 개선하는 절차를 수립하세요.</p>
      <p>
        기본 제공되는 내용을 기반으로
        <span class="text-red font-weight-bold">현장에 맞게 수정하여 사용</span>
        하십시오.
      </p>
      <br />
      <p>
        위험성 수준 판단 방법 및 기준 :
        <span class="font-weight-bold">상중하법을 사용하시면 쉽습니다.</span>
      </p>
      <p>위험성평가 방식 :</p>
      <p class="pl-5">
        사업장에서 사용하는 기계나 물질, 환경이 자주 변하지 않는 경우 →
        <span class="font-weight-bold">수시평가</span>가 효율적입니다.
      </p>
      <p class="pl-5">
        건설업의 경우 → <span class="font-weight-bold">상시평가</span>가
        효율적입니다.
      </p>
      <p>조직 및 역할 : 현장의 직무별로 역할을 지정하세요.</p>
      <p>평가절차및 방법 : 위험성평가의 절차를 수립하세요.</p>
      <p class="pl-5">
        <span class="text-red font-weight-bold">
          TBM(작업 전 안전점검회의), 아차사고 발굴, 안전 제안
        </span>
        등을 통해 현장
        <span class="font-weight-bold">종사자의 의견 청취</span>하고
        <span class="font-weight-bold">개선방안 마련, 이행여부 점검</span> 등의
        내용을 포함해보세요.
      </p>
    </template>

    <!-- 결재라인 컴포넌트 -->
    <template #pageCard>
      <appr-line
        :apprUserParams="apprUserParams"
        :key="apprUserParams"
        @apprUserList="getApprUserList"
        @crntApprOver="getCrntApprOver"
        ref="apprLineRef"
        v-if="apprKey || apprKey === null"></appr-line>

      <!-- 현장실시규정 내용 -->

      <v-form ref="form" :disabled="readonly">
        <comp-card-foldable title="1. 위험성평가 목적">
          <v-textarea
            v-model="searchList.riskEvalPrps"
            :rules="[required]"
            variant="outlined"
            hide-details="auto"
            rows="2"
            auto-grow />
        </comp-card-foldable>

        <comp-card-foldable title="2. 위험성 수준 판단 방법 및 기준">
          <site-imp-standard></site-imp-standard>
        </comp-card-foldable>

        <comp-card-foldable title="3. 위험성평가 방식">
          <site-imp-way></site-imp-way>
        </comp-card-foldable>

        <comp-card-foldable title="4. 조직 및 역할">
          <site-imp-role></site-imp-role>
        </comp-card-foldable>

        <comp-card-foldable title="5. 평가절차 및 방법">
          <site-imp-procedure></site-imp-procedure>
        </comp-card-foldable>
        <comp-card-foldable title="6. 기록 보존">
          <v-textarea
            v-model="searchList.rcdKeep"
            variant="outlined"
            hide-details="auto"
            rows="2"
            :rules="[required]"
            auto-grow />
        </comp-card-foldable>
      </v-form>

      <!-- 최종승인이 되었을 때만 동의 가능 -->
      <div v-if="siteRegApprCnt > 0" class="d-flex flex-row justify-end pb-2">
        <comp-button
          size="x-large"
          :text="isSiteAgreYn ? '확인완료' : '확인합니다'"
          :disabled="isSiteAgreYn ? true : false"
          @click="onAgrCheckedButton" />
      </div>
    </template>
  </comm-safe-duty>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import reportViewButton from "@/components/button/reportViewButton.vue";
import compCardFoldable from "@/components/layout/compCardFoldable.vue";
import apprLine from "@/views/common/apprLine.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import popApprOpnn from "@/views/common/popApprOpnn.vue";
import siteImpProcedure from "./siteImpRegulation/siteImpProcedure.vue";
import siteImpRole from "./siteImpRegulation/siteImpRole.vue";
import siteImpStandard from "./siteImpRegulation/siteImpStandard.vue";
import siteImpWay from "./siteImpRegulation/siteImpWay.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
// sevice
import loginAuthService from "@/api/common/login-auth-service";

const dialogStore = useDialogStore();
const siteImpStore = useSiteImpRegulationStore();
const loginStore = useLoginAuthStore();

onBeforeMount(async () => {
  await siteImpStore.comCodesList(); // 공통코드 조회
  await doSearch();
});

const loadingState = ref(true);
async function doSearch() {
  loadingState.value = true;
  await siteImpStore.siteApprCnt(); // 현장별 실시규정 승인여부 조회
  await siteImpStore.selectSiteStdMgMtStdImpRgltCnt(); // 현장별 실시규정 존재 여부 조회
  await siteImpStore.standReglSearchList(); // 실시규정 표준 조회
  loadingState.value = false;
}

const { searchList, commonParam, siteRegApprCnt, regCnt } =
  storeToRefs(siteImpStore);

// false : 수정가능, true : 수정불가능
const readonly = computed(() => {
  if (loginStore.$state.userInfo.admAcctYn === "Y") {
    return true; //관리자 수정 불가능
  }
  if (siteRegApprCnt.value !== 0) {
    return true; // 최종승인 되면 수정 불가능
  }
  if (
    crntApprOver.value?.apprSeq === "1" &&
    crntApprOver.value?.userId === userId
  ) {
    return false; // 기안자 상태일때 수정 가능(결재키가 null 아니어도 반려당했을 경우)
  }
  if (searchList.value.apprKey === null) {
    return false; // 결재키가 null 이면 결재 전이므로 수정 가능
  }
  return true;
});

const { isSiteAgreYn, userInfo } = storeToRefs(loginStore); // 현장실시규정 동의 여부
/**
 * 현장 인력 동의 버튼
 */
async function onAgrCheckedButton() {
  const res = await siteImpStore.updateAgreYn();
  if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
    // 동의 버튼 숨김 처리를 위해 siteInfo.agreYn 업데이트
    const params = {
      ...commonParam.value,
      vendrCd: userInfo.value.vendrCd, // commonParam의 vendrCd가 본사 기준이어서 협력사 직원의 경우에러남
      ptnrYn: loginStore.$state.vendrInfo.ptnrYn,
    };
    await loginStore.getSiteMnpwrInfo(params);
  } else {
    if (!res.svrMessage) alert(res.svrMessage);
    else alert(res.data.message);
  }
}

/**
 * 결재
 */
const userId = loginStore.$state.userInfo.userId;
const apprKey = computed(() => searchList.value.apprKey);
const apprUserParams = ref({
  vendrCd: loginStore.$state.siteInfo.vendrCd,
  siteCd: loginStore.$state.siteInfo.siteCd,
  userId: loginStore.$state.userInfo.userId,
  apprKey: apprKey,
  userNm: loginStore.$state.userInfo.userNm,
  jbttlNm: loginStore.$state.siteInfo.jbttlNm, //직책명,
  workNm: loginStore.$state.userInfo.workNm, //직무명,
  menuId: "5003000",
  isApprAddUser: true, // 결재라인 사용자 추가 가능
});

// 결제 버튼 제어
const isShowBtn = computed(() => {
  return regCnt.value && userId === crntApprOver.value?.userId;
});
// apprLine의 onSearch함수 불러와서 결재라인
const apprLineRef = ref(null);

// 결재관리
const apprBtnNm = ref("상신");

// apprLine : 결재라인에서 받아온 리스트 값
const apprUserList = ref([]);
const getApprUserList = (list) => {
  apprUserList.value = list;
};
// apprLine : 결재라인에서 받아온 현재 결재자
const crntApprOver = ref(null);
const getCrntApprOver = (data) => {
  crntApprOver.value = data;
  // 첫번쨰 결재자
  const firstApprUser = apprUserList.value[0];
  // 마지막 결재자
  const lastApprUserIdx = apprUserList.value.length - 1;
  const lastApprUser = apprUserList.value[lastApprUserIdx];
  if (lastApprUser.userId === userId) {
    if (apprUserList.value.length != 1) {
      apprBtnNm.value = "승인";
    } else {
      apprBtnNm.value = "상신";
    }
  } else {
    if (firstApprUser.userId !== userId) {
      apprBtnNm.value = "검토";
    } else {
      apprBtnNm.value = "상신";
    }
  }
};

const saveApprMst = async (btnTxt) => {
  if (!(await valiateForm())) {
    return;
  }

  // filteredData : 이미 결재한 사람은 제외한 list (가공 데이터)
  const filteredData = apprUserList.value.filter(
    (item) =>
      item.statsCd === "" ||
      !item.hasOwnProperty("statsCd") ||
      item.statsCd == null ||
      item.statsCd == "T1004" //반려자
  );
  // 전체 결재라인의 마지막 순서
  const endSeq = apprUserList.value.length;

  if (btnTxt.apprGbn == "appr") {
    //기안, 검토, 승인일때
    const saveRes = await saveSiteImpReg(); // 저장버튼 안눌러도 저장되도록
    if (!saveRes) return; // 저장 안되었으면 종료

    filteredData.forEach((item, index) => {
      if (index === 0) {
        // 기안(T1001), 검토(T1002), 승인(T1003)일 때
        if (item.apprSeq === 1) {
          item.statsCd = "T1001";
          item.tmplCd = "016";
        } else if (item.apprSeq === endSeq) {
          item.statsCd = "T1003";
          item.tmplCd = "017";
        } else {
          item.statsCd = "T1002";
          item.tmplCd = "016";
        }
      } else {
        item.statsCd = "";
      }
    });
  } else if (btnTxt.apprGbn == "rej") {
    //반려일때
    for (let i = 0; i < filteredData.length; i++) {
      filteredData[0].statsCd = "T1004"; //반려
      filteredData[0].tmplCd = "018";
      if (i != 0) filteredData[i].statsCd = "";
    }
  }

  //결재안한사람 중 첫번째 (apprInfo에 들어갈 데이터)
  const firstApprUser = { ...filteredData[0] };

  // console.log("firstApprUser>>", firstApprUser); // 결재안한사람 중 첫번째!(결재자)
  // console.log("apprUserList>>", apprUserList); // 결재라인에 있는 모든 사람
  // console.log("filteredData>>", filteredData); // 결재라인에서 결재 안한 사람
  // console.log("apprUserList.value.length>>", apprUserList.value.length); // 결재라인 길이

  const apprInfo = {
    vendrCd: firstApprUser.vendrCd,
    siteCd: firstApprUser.siteCd,
    apprSeq: firstApprUser.apprSeq,
    apprKey: firstApprUser.apprKey,
    userId: firstApprUser.userId,
    apprNm: "현장 실시규정",
    statsCd: firstApprUser.statsCd,
  };

  const arrpList = filteredData.map((item, idx) => ({
    vendrCd: item.vendrCd,
    siteCd: item.siteCd,
    apprSeq: item.apprSeq,
    apprKey: item.apprKey,
    userId: item.userId,
    apprOpnn: idx == 0 ? btnTxt.apprOpnn : "",
    apprNm: "현장 실시규정",
    statsCd: item.statsCd,
  }));

  const pushAlertParam = {
    vendrCd: firstApprUser.vendrCd,
    siteCd: firstApprUser.siteCd,
    userId: firstApprUser.userId,
    receiverId: firstApprUser.apprSeq === endSeq ? "" : arrpList[1].userId, // 결재라인 다음 결재자
    tmplCd: firstApprUser.tmplCd,
    tmpParam: loginStore.$state.siteInfo.siteNm,
  };

  const saveListMap = {
    apprInfo: apprInfo,
    arrpDtlList: arrpList,
  };

  // 결재
  const res = await siteImpStore.apprSiteImpRegulation(saveListMap);
  if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
    await apprPushAlert(pushAlertParam);
    await doSearch();
    dialogStore.openToastDialog("결재를 처리를 완료했습니다.");
    apprLineRef.value.onSearch(); // 결재현황 업데이트
  } else {
    if (!res.svrMessage) alert(res.svrMessage);
    else alert(res.data.message);
  }
};

async function apprPushAlert(param) {
  // 알림톡
  try {
    const send1res = await loginAuthService.sendNotificationTalk(param);
    if (send1res.status == 200) {
      console.log("알림톡 정상처리");
    } else {
      alert(send1res.data.message);
      return;
    }
  } catch (err) {
    console.log(
      "popResetPassword.vue > sendCertNum() > sendNotificationTalk err : ",
      err
    );
    throw err;
  }

  // push알림
  try {
    const send2res = await loginAuthService.sendPush(param);
    if (send2res.status == 200) {
      console.log("push 정상처리");
    } else {
      alert(send2res.data.message);
      return;
    }
  } catch (err) {
    console.log("popResetPassword.vue >  sendPush err : ", err);
    throw err;
  }
}

//저장 (신규 또는 수정)
async function onSaveCheckedButton() {
  if (await valiateForm()) {
    const result = await saveSiteImpReg();
    if (result) {
      await createApprLine(); // 결재라인 생성
      await doSearch();
      apprLineRef.value.onSearch(); // 결재현황 업데이트
    }
  }
}

// validate 체크
const form = ref(null);
async function valiateForm() {
  const { valid } = await form.value.validate();
  if (!valid) {
    dialogStore.openAlertDialog("빈 값을 채워주세요");
    return false;
  }
  return true;
}

async function saveSiteImpReg() {
  const saveListMap = {
    stdMgMtStdImpRgltInfo: { ...searchList.value, ...commonParam.value },
    riskLvlList: searchList.value.riskLvlList.map((item) => {
      item = { ...item, ...commonParam.value };
      return item;
    }),
    evalMthdList: searchList.value.evalMthdList.map((item) => {
      item = { ...item, ...commonParam.value };
      return item;
    }),
    stdOrgRoleList: searchList.value.stdOrgRoleList.map((item) => {
      item = { ...item, ...commonParam.value };
      return item;
    }),
  };
  const res = await siteImpStore.saveSiteImpRegulation(saveListMap);

  if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
    dialogStore.openToastDialog("현장 실시 규정이 저장되었습니다");
    return true;
  } else {
    if (!res.svrMessage) {
      alert(res.svrMessage);
    } else alert(res.data.message);
    return false;
  }
}

// 저장시 결재라인 생성
async function createApprLine() {
  if (apprUserList.value) {
    const dataList = apprUserList.value;
    const apprInfo = {
      vendrCd: dataList[0].vendrCd,
      siteCd: dataList[0].siteCd,
      apprSeq: dataList[0].apprSeq,
      apprKey: dataList[0].apprKey,
      userId: dataList[0].userId,
      apprNm: "",
      statsCd: "",
    };

    const arrpList = dataList.map((item, idx) => ({
      vendrCd: item.vendrCd,
      siteCd: item.siteCd,
      apprSeq: item.apprSeq,
      apprKey: item.apprKey,
      userId: item.userId,
      apprNm: "",
      statsCd: "",
    }));

    const apprLineParam = {
      apprInfo: apprInfo,
      arrpDtlList: arrpList,
    };

    // 결재라인 생성
    try {
      const res = await siteImpStore.apprSiteImpRegulation(apprLineParam);

      if (res.status == 200) {
        console.log("결재라인 생성 정상처리");
      } else {
        alert(res.data.message);
        return;
      }
    } catch (err) {
      console.log("apprSiteImpRegulation err : ", err);
      throw err;
    }
  }
}

// 저장 전 폼 체크할 룰
const required = (val) => {
  return val ? true : "필수 입력 값입니다.";
};

// 레포트 생성에 필요한 파람
const reportParams = {
  crfName: "site/siteImpRegulation",
};
</script>

<style lang="scss" scoped></style>
