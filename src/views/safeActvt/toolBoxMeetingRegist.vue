<template>
  <comp-page title="TBM" minWidth="1200px">
    <template #toolbarBody>
      <router-link to="/SAFE_ACTVT/toolBoxMeeting">
        <comp-button text="목록으로" class="mr-2" />
      </router-link>
      <comp-button
        text="저장"
        @click="onSaveTbmBtn"
        class="mr-2"
        v-if="!readonly" />

      <!-- 레포트 출력 -->
      <report-view-button
        v-if="route.params.mode !== 'I'"
        :params="reportParams" />
    </template>

    <v-form ref="formRef" :disabled="readonly">
      <!-- TBM 내용 -->
      <tbm-info
        :readonly="readonly"
        ref="tbmInfoRef"
        @after-upload-file="afterUploadFile" />
    </v-form>

    <!-- 위험성 평가 내용 -->
    <tbm-rsk-fctr :readonly="readonly" />

    <!-- tbm 참석자 -->
    <tbm-attnd-list
      :readonly="readonly"
      :attendList="attendList"
      @detail-search="detailSearch"
      v-if="route.params.mode === 'U'" />
  </comp-page>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// 외부 변수 및 함수
import { useAiLogin } from "@/utils/common-utils";
// 컴포넌트
import reportViewButton from "@/components/button/reportViewButton.vue";
import compPage from "@/components/layout/compPage.vue";
import TbmAttndList from "./TBM/tbmAttndList.vue";
import tbmInfo from "./TBM/tbmInfo.vue";
import tbmRskFctr from "./TBM/tbmRskFctr.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
// sevice
import aiRiskEvalService from "@/api/services/aiRiskEval/ai-risk-eval-service.js";

const route = useRoute(); // 현재 라우트 정보를 가져옴.
const router = useRouter(); // 라우터 인스턴스를 사용하여 라우트 전환 메서드 호출

const dialogStore = useDialogStore();
const loginStore = useLoginAuthStore();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const { siteInfo, userInfo } = storeToRefs(loginStore); // 현장실시규정 동의 여부
const { detailInfo, tbmAttndList, tbmRskDsrsList } =
  storeToRefs(toolBoxRegiStore);
const attendList = ref([]);
const formRef = ref(null);

const { sendLoginInfo } = useAiLogin();

const tbmExists = async () => {
  if (route.params.mode !== "I") {
    return false;
  }
  const param = {
    vendrCd: detailInfo.value.vendrCd,
    siteCd: detailInfo.value.siteCd,
    psitnVendrCd: detailInfo.value.psitnVendrCd,
    tbmDt: detailInfo.value.tbmDt,
  };

  const res = await toolBoxRegiStore.tbmValidCheck(param);
  // 존재하면 true가 돌아옴
  return res.data;
};

async function onSaveTbmBtn() {
  const { valid } = await formRef.value.validate();

  // validation 통과하지 못하면 함수 종료
  if (!valid) {
    return false;
  }
  const tbmDateValid = await tbmExists();
  if (tbmDateValid) {
    dialogStore.openAlertDialog("해당 일자에 등록된 tbm이 존재합니다");
    return false;
  }

  const params = {
    tbmRskDsrsList: tbmRskDsrsList.value,
    toolBoxMeetingInfo: detailInfo.value,
  };
  const formData = new FormData();
  formData.append(
    "param",
    new Blob([JSON.stringify(params)], {
      type: "application/json",
    })
  );
  // 첨부파일 FormData 추가
  const files = getNewUploadFiles();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });

  await toolBoxRegiStore.saveToolBoxRegi(formData);
  router.push("/SAFE_ACTVT/toolBoxMeeting");
}

// 첨부파일 목록 가져옴
const tbmInfoRef = ref(null);
const getNewUploadFiles = () => {
  if (tbmInfoRef.value) {
    return tbmInfoRef.value.getNewUploadFiles();
  }
  return [];
};

// 레포트 생성에 필요한 파람
const reportParams = {
  crfName: "safeActvt/toolBoxMeeting",
  tbmDt: route.params.tbmDt.split("-").join(""),
  psitnVendrCd: route.params.psitnVendrCd,
};

// TBM 상세보기 조회 함수
const detailSearch = async () => {
  const siteCd = siteInfo.value.siteCd;
  const vendrCd = siteInfo.value.vendrCd;
  const psitnVendrCd = route.params.psitnVendrCd;
  const tbmDt = route.params.tbmDt.split("-").join("");
  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    tbmDt: tbmDt,
    psitnVendrCd: psitnVendrCd,
  };

  const res = await toolBoxRegiStore.detailSearchToolBox(param);

  attendList.value = tbmAttndList.value ? tbmAttndList.value : [];
};

if (route.params.mode === "U") {
  await detailSearch();
  detailInfo.value.mode = "U";
} else {
  await toolBoxRegiStore.detailInfoInit();
  detailInfo.value.mode = "I";
  attendList.value = [];
}

// false : 수정가능, true : 수정불가능
const readonly = computed(() => {
  if (route.params.mode === "I") {
    return false; // 신규 작성은 수정 가능
  }
  if (userInfo.value.admAcctYn === "Y") {
    return false; // 관리자 수정 가능
  }
  if (detailInfo.value?.regId === userInfo.value.userId) {
    return false; // 작성자 수정 가능
  }
  return true;
});

const afterUploadFile = (file) => {
  if (file.length === 0) {
    dialogStore.openAlertDialog("업로드된 파일이 없습니다.");
    return false;
  }

  dialogStore.openConfirmDialog(
    "등록 작업계획서를 이용하여 <br> AI안전담당자가 작성을 도와드릴까요?",
    {
      confirmCallback: async () => {
        await sendLoginInfo();
        await sendUploadDoc(file);
      },
    }
  );
};

// 문서 기반 추천
const sendUploadDoc = async (file) => {
  const param = {
    client_id: userInfo.value.userId,
    conversation_id: sessionStorage.getItem("aiConversationId"),
    access_token: sessionStorage.getItem("aiToken"),
  };

  const formData = new FormData();
  formData.append(
    "param",
    new Blob([JSON.stringify(param)], {
      type: "application/json",
    })
  );

  formData.append("file", file);

  try {
    await aiRiskEvalService
      .axiosCallAIFile("/v1/chat/reqDocBasedRcmnd", formData)
      .then((res) => {
        if (res.data != null) {
          let responseData = res.data.dta;
          let riskFactor = responseData["risk_factor"];
          let reductionMeasure = responseData["reduction_measure"];
          let riskFactorString = "";
          let reductionMeasureString = "";

          detailInfo.value.wrkNm = responseData["name"]; // 작업명
          detailInfo.value.wrkDtl = responseData["description"]; // 작업내용
          detailInfo.value.wrkLoc = responseData["location"]; // 장소
          detailInfo.value.inptPsn = responseData["personnel"]; // 인원수
          detailInfo.value.inptEqmnt = responseData["equipment"]; // 장비 및 도구

          riskFactorString = riskFactor
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");

          reductionMeasureString = reductionMeasure
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");

          // 안전교육
          detailInfo.value.sftEdu =
            "· 위험요인\n" +
            riskFactorString +
            "\n \n · 감소대책\n" +
            reductionMeasureString;

          dialogStore.openToastDialog("AI 추천이 완료되었습니다.");
        } else {
          dialogStore.openAlertDialog("파일을 다시 업로드해주세요.");
        }
      });
  } catch (error) {
    console.error("요청 중 오류 발생:", error);
  }
};
</script>

<style lang="scss" scoped></style>
