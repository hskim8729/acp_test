<template class="work_selection_container">
  <div class="subtitle_area" v-if="store.selectedHrmrskFctrMstSeq">
    <div class="title">2. 표준공종 / 위험요인</div>
    <div class="right_btn">
      <input
        type="text"
        placeholder="분류 및 작업 검색"
        v-model="searchQuery"
        @keyup.enter.prevent="togglePopup" />
      <button class="search_btn" @click="togglePopup"></button>
      <search-popup
        :defaultColDef="defaultColDef"
        :localeText="localeText"
        :vendrCd="store.selectedVenderCd"
        :hrmrskFctrMstSeq="store.selectedHrmrskFctrMstSeq"
        :searchQuery="searchQuery"
        :isOpenPopup="isOpenPopup"
        @togglePopup="togglePopup"
        v-if="isOpenPopup" />
    </div>
  </div>

  <div class="grid_default" id="grid02">
    <cat-wrk
      :defaultColDef="defaultColDef"
      :localeText="localeText"
      :cntFormatter="cntFormatter"
      :cntParser="cntParser"
      :datalist="lgCatList"
      type="lg" />

    <cat-wrk
      :defaultColDef="defaultColDef"
      :localeText="localeText"
      :cntFormatter="cntFormatter"
      :cntParser="cntParser"
      :datalist="mdCatList"
      type="md" />

    <cat-wrk
      :defaultColDef="defaultColDef"
      :localeText="localeText"
      :cntFormatter="cntFormatter"
      :cntParser="cntParser"
      :datalist="wrkList"
      :handle-scroll="handleScroll"
      @scroll="handleScroll"
      type="wrk" />
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, watch, provide } from "vue";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { storeToRefs } from "pinia";
import SearchPopup from "./SearchPopup.vue";
import CatWrk from "./CatWrk.vue";

const store = useRiskFactorStandardStore();

const { defaultColDef, localeText, handleScroll } = defineProps([
  "defaultColDef",
  "localeText",
  "handleScroll",
]);

const { lgCatList, mdCatList, wrkList } = storeToRefs(store);

const searchQuery = ref("");

const isOpenPopup = ref(false);
// 검색팝업
const togglePopup = () => {
  isOpenPopup.value = !isOpenPopup.value;
  if (isOpenPopup.value == false) {
    searchQuery.value = "";
  }
};

// cnt 속성 cell에 보여주기
function cntFormatter(params) {
  let cnt = " (" + params.data.cnt + ")";
  return params.value + cnt;
}

function cntParser(params) {
  let value = params.newValue;
  if (value == null || value == "") {
    return "";
  }
  return String(value);
}
</script>

<style scoped>
#grid02 {
  float: left;
  width: 100%;
  height: calc(100% - 350px);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.ag-theme-alpine {
  float: left;
}

.subtitle_area input {
  height: 32px;
}

.subtitle_area {
  float: left;
}
</style>
