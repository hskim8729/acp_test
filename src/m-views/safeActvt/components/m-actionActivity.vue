<template>
  <div>
    <div class="item_wrap w50p">
      <span class="p_title">점검 월</span><br />
      <datepicker
        class="w90p"
        v-model="crtrDt"
        type="month"
        inputFormat="yyyy-MM"
        minimumView="month"
        :key="crtrDtKey" />
    </div>
    <div class="item_wrap w50p">
      <span class="p_title">조치상태</span><br />
      <select v-model="inspRstSel" class="w100p">
        <option value="">전체</option>
        <option value="0002">조치요청</option>
        <option value="0003">조치완료</option>
      </select>
    </div>
    <button class="m_search" @click="doSearch">조회</button>

    <div class="m_subtitle">점검 목록</div>
    <m-com-card-safe-actvt :searchGridData="searchGridData" menu-type="action">
      <template #buttonSlot="{ item }">
        <button @click="detailView(item)">상세보기</button>
      </template>
    </m-com-card-safe-actvt>
  </div>

  <!-- 상세 -->
  <m-action-activity-regist
    v-if="isDetail"
    :isDetail="isDetail"
    :inspClsCd="inspClsCd"
    :rowParams="rowParams"
    ref="detailRef"
    @go-list="goList">
  </m-action-activity-regist>
</template>

<script setup>
import {
  onBeforeMount,
  ref,
  getCurrentInstance,
  watch,
  defineProps,
} from "vue";
import datepicker from "vue3-datepicker";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

import mComCardSafeActvt from "@/m-views/safeActvt/common/m-comCardSafeActvt.vue";
import mActionActivityRegist from "@/m-views/safeActvt/components/m-actionActivityRegist.vue";

import commonService from "@/api/common-service.js";

import commonUtil from "@/utils/common-utils";

const router = useRouter();
const props = defineProps({
  inspClsCd: {
    type: String,
    default: "T0201",
  },
});

const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");
const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = `${inspClsNm.value}조치`; // 페이지 타이틀 입력

const inspRstSel = ref("");

// date
const today = dayjs().format("YYYYMMDD");
let crtrDtKey = ref(0);
let crtrDt = ref(new Date());

watch(crtrDt, () => {
  crtrDtKey.value++;
});

let searchGridData = ref([]);

const app = getCurrentInstance();
const loginStore = app.appContext.config.globalProperties.$loginStore;
const vendrCd = loginStore.$state.siteInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
const userId = loginStore.$state.userInfo.userId;

/**
 * 모바일 temp파일 삭제
 */
const tempFileDelete = async () => {
  const params = getSearchParameter();

  await commonService.axiosCall("/v1/adtnRisk/appTempFileDelete", params);
};

/**
 * 조회 버튼 클릭
 */
const doSearch = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/actActv", params)
    .then((result) => {
      if (result.data) {
        searchGridData.value = result.data;
      } else {
        searchGridData.value = [];
      }
    });
};

// 조회 파라미터 생성
const getSearchParameter = () => {
  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    inspCls: props.inspClsCd,
    crtrDt: commonUtil.pickerToStringMonth(crtrDt.value),
    userId: userId,
    inspRst: inspRstSel.value || "",
  };

  return param;
};

/**
 * 상세보기/등록버튼 처리
 */
const isDetail = ref(false);
const modeFlag = ref("");
const rowParams = ref({});

const listRef = ref(null);

const detailView = (data) => {
  const param = data;

  // 조치완료 되었으면 읽기모드, 그 외는 등록모드
  param.authMode = data.inspRst !== "0003" ? "I" : "U";

  rowParams.value = param;
  isDetail.value = true;
};

// 목록 화면으로 이동
const goList = (isReload = false) => {
  isDetail.value = false;

  if (isReload) {
    doSearch();
  }
};

onBeforeMount(() => {
  tempFileDelete();

  // 초기 조회
  doSearch();
});
</script>
<style scoped></style>
