<template>
  <!-- <workCateSearchBar :searchQuery="searchQuery" /> -->
  <input
    ref="searchInput"
    type="text"
    class="search_input"
    placeholder="분류 및 작업 검색"
    v-model="searchQuery"
    @keyup.enter.prevent="doSearch" />
  <button
    class="search_btn"
    @click="searchQuery ? doSearch() : closePopup()"></button>
  <workCateSearchResult
    v-if="isOpen"
    :searchedWord="searchedWord"
    :searchResult="searchResult"
    @selectData="selectData"
    @closePopup="closePopup" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import {
  ref,
  watchEffect,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
} from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import comRiskFactorStandardService from "@/api/services/inspcActvt/com-risk-factor-standard-service.js";
import workCateSearchResult from "./workCateSearchResult.vue";

const loginStore = useLoginAuthStore();
const { siteInfo } = storeToRefs(loginStore);

const emit = defineEmits(["onClickSearchedData"]);

// 본사 위험요인 표준 검색과 현장 위험요인 표준 검색 위한 프롭
// vendr 프롭으로 주지 않으면 현장 위험요인 표준 검색
const props = defineProps({
  vendr: {
    type: Boolean,
    default: false,
  },
});

/**
 * 검색 결과 화면 닫고 열기
 */
const isOpen = ref(false);
const closePopup = () => {
  isOpen.value = false;
};
const openPopup = () => {
  isOpen.value = true;
};

/**
 * 입력된 단어로 검색 결과 받아오고 검색결과팝업 열기
 */
const searchInput = ref(null); // 입력 인풋 제어 역할
const searchQuery = ref(""); // 함수에 넣어서 검색할 문자열
const searchedWord = ref(""); // 검색 결과 없을시 보여줄 문자열
const searchResult = ref([]);
const doSearch = async () => {
  // 검색어가 빈칸이면 검색하지 않고 포커스만 줌
  if (searchQuery.value == "") {
    searchInput.value.select();
    openPopup();
    return;
  }

  // vendr옵션 주면 본사 위험요인 표준 검색 후 결과화면 열기
  // 디폴트는 현장검색
  if (props.vendr) {
    searchResult.value = await searchVendr();
  } else {
    searchResult.value = await searchSite();
  }
  searchedWord.value = searchQuery.value;
  openPopup();

  // 검색완료 후 다른 단어 검색이 쉽도록 입력 필드의 텍스트 드래그(선택)
  searchInput.value.select();
};

const searchVendr = async () => {
  // 본사 위험요인 db 검색결과 리턴
};
const searchSite = async () => {
  // 현장 위험요인 db 검색결과 리턴
  const params = {
    vendrCd: siteInfo.value.vendrCd,
    siteCd: siteInfo.value.siteCd,
    siteHrmrskFctrMstSeq: siteInfo.value.siteHrmrskFctrMstSeq,
    searchQuery: searchQuery.value,
  };

  const res = await comRiskFactorStandardService.searchRiskStandardResult(
    params
  );

  return res.data;
};

/**
 * 검색 결과 선택하면 emit 함수로 데이터 전달하고 팝업 닫음
 * @param {*} selected
 */
const selectData = (selected) => {
  emit("onClickSearchedData", selected);
  closePopup();
  searchInput.value.select();
};
</script>

<style scoped>
.search_input {
  width: 201px;
  height: 32px;
}
</style>
