<template>
  <div>
    <div class="item_wrap w100p">
      <span class="p_title">기준일자</span><br />
      <datepicker class="full" v-model="crtrDt" :key="crtrDtKey" />
    </div>
    <button class="m_search" @click="doSearch">조회</button>

    <div class="m_subtitle">점검 목록</div>
    <m-com-card-safe-actvt :searchGridData="searchGridData" menu-type="insp">
      <template #buttonSlot="{ item }">
        <button @click="detailView(item)">상세보기</button>
      </template>
    </m-com-card-safe-actvt>
  </div>

  <!-- 상세 -->
  <m-inspection-activity-regist
    v-if="isDetail"
    :isDetail="isDetail"
    :inspClsCd="inspClsCd"
    :modeFlag="modeFlag"
    :rowParams="rowParams"
    @go-list="goList">
  </m-inspection-activity-regist>
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
import mInspectionActivityRegist from "@/m-views/safeActvt/components/m-InspectionActivityRegist.vue";

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
pageTitle.innerText = `${inspClsNm.value}활동`; // 페이지 타이틀 입력

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

// 등록 권한
const authChk = (item) => {
  if (isToday.value) {
    if (item.modId == userId) {
      // T18 (0001:양호, 0002:조치요청, 0003:조치완료, 0004:조치중)
      // 수정가능한 점검상태, 진행상태
      const arrInspRst = ["", "0001", "0002"];
      const arrStats = [null, "", "T1004", "T1005"];

      return arrInspRst.includes(item.inspRst) && arrStats.includes(item.stats);
    } else {
      return item.inspRst === "";
    }
  }
};

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
let isToday = ref(false);
const doSearch = () => {
  // 현재일자일때는 점검데이터 생성하고 아닐경우는 점검데이터 조회만 한다.
  if (commonUtil.pickerToString(crtrDt.value) == today) {
    isToday.value = true;
    searchInit();
  } else {
    isToday.value = false;
    searchData();
  }
};

// 조회 파라미터 생성
const getSearchParameter = () => {
  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    inspCls: props.inspClsCd,
    crtrDt: commonUtil.pickerToString(crtrDt.value),
    userId: userId,
  };

  return param;
};

/**
 * 조회 - 점검데이터 생성
 */
const searchInit = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/insertPntInspDsctn", params)
    .then((result) => {
      searchData();
    });
};

/**
 * 조회 - 점검데이터 조회
 */
const searchData = async () => {
  const params = getSearchParameter();

  await commonService
    .axiosCall("/v1/safeActvt/inspActv", params)
    .then((result) => {
      if (result.data) {
        searchGridData.value = result.data;
      } else {
        searchGridData.value = [];
      }
    });
};

/**
 * 상세보기/등록버튼 처리
 */
const isDetail = ref(false);
const modeFlag = ref("");
const rowParams = ref({});

const listRef = ref(null);

const detailView = (data) => {
  let str = authChk(data) ? "reg" : "detail";
  const param = data;
  param.mode = str;

  modeFlag.value = str;
  rowParams.value = param;
  isDetail.value = true;
};

// 목록 화면으로 이동
const goList = (isReload = false) => {
  isDetail.value = false;

  if (isReload) {
    searchData();
  }
};

onBeforeMount(() => {
  tempFileDelete();

  // 초기 조회
  doSearch();
});
</script>
<style scoped></style>
