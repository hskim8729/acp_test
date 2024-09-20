<!-- 안전점검활동/위험성평가 -->

<template>
  <!-- 회의 상세 화면 -->
  <riskAssmnCnfrn
    v-if="showCnfrnPage"
    :siteInfo="siteInfo"
    :userInfo="userInfo"
    :riskLvlList="riskLvlList"
    :siteExeRuleStd="siteExeRuleStd"
    :dsstrStleCdList="dsstrStleCdList"></riskAssmnCnfrn>

  <!-- 등록 -->
  <riskAssmnRegist
    v-if="showRegistPage"
    :siteInfo="siteInfo"
    :userInfo="userInfo"
    :menuInfo="menuInfo"
    :vendrInfo="vendrInfo"
    :contyCdList="contyCdList"
    :riskLvlList="riskLvlList"
    :siteExeRuleStd="siteExeRuleStd"
    :dsstrStleCdList="dsstrStleCdList"
    pageMode="reg"></riskAssmnRegist>

  <!-- 검토/승인 -->
  <riskAssmnModify
    v-if="showModifyPage"
    :siteInfo="siteInfo"
    :userInfo="userInfo"
    :menuInfo="menuInfo"
    :vendrInfo="vendrInfo"
    :contyCdList="contyCdList"
    :riskLvlList="riskLvlList"
    :siteExeRuleStd="siteExeRuleStd"
    :dsstrStleCdList="dsstrStleCdList"
    pageMode="mod"></riskAssmnModify>
</template>

<script setup>
import { getCurrentInstance, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import riskAssmnCnfrn from "@/views/inspcActvt/riskAssmnCnfrn.vue";
import {
  default as riskAssmnModify,
  default as riskAssmnRegist,
} from "@/views/inspcActvt/riskAssmnModify.vue";

import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";

const store = useRiskAssessmentStore();
const standReglStore = useStandReglStore();
const cdMgmtStore = useCdMgmtStore();
const router = useRouter();

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const siteInfo = $loginStore.$state.siteInfo;
const userInfo = $loginStore.$state.userInfo;
const menuInfo = $loginStore.$state.menuInfo;
const vendrInfo = $loginStore.$state.vendrInfo;

const contyCdList = ref([]);
const riskLvlList = ref([]);
const siteExeRuleStd = ref([]);
const dsstrStleCdList = ref([]);
const showCnfrnPage = ref(false);
const showRegistPage = ref(false);
const showModifyPage = ref(false);

const { statsCd, pageFlag } = history.state;

// 위험성평가 회의 화면 표시 여부 설정
const setPageDisplay = () => {
  if (pageFlag === "cnfrn") {
    showCnfrnPage.value = true;
  } else if (["T1305", "T1306", "T1307"].includes(statsCd)) {
    showRegistPage.value = true;
  } else {
    showModifyPage.value = true;
  }
};

const fetchData = async () => {
  const params = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 공사종류 코드목록 조회
  contyCdList.value = await store.fetchContyCdList(params);

  // 현장 실시 규정 표준 평가 절차 방법 조회
  riskLvlList.value = await standReglStore.riskLvlList(params);

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(params);

  // 재해형태 공통코드 조회
  dsstrStleCdList.value = await cdMgmtStore.fetchComCodeList({ comCd: "T20" });

  setPageDisplay();
};

onBeforeMount(() => {
  fetchData();
});
</script>
