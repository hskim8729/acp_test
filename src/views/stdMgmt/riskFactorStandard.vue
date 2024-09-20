<!-- views/riskFactroStandardPage -->
<template>
  <div class="page_title_area">
    <div class="title">위험요인DB 표준</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 표준관리 > 위험요인DB 표준
    </nav>
  </div>

  <div class="page_content_area" ref="scrollArea">
    <template-seletion
      :defaultColDef="defaultColDef"
      :localeText="localeText" />

    <work-selection
      :defaultColDef="defaultColDef"
      :localeText="localeText"
      :handle-scroll="handleScroll" />

    <rsk-fctr-msr
      ref="rskFctrMsrRef"
      :defaultColDef="defaultColDef"
      :localeText="localeText"
      :isAllDataVisible ="isAllDataVisible"
      @hide="hideData"
      v-if="store.selectedLgCatCd && store.selectedWrkNmCd" />
  </div>
</template>

<script setup>
import { useRiskFactorStandardStore } from "../../stores/stdMgmt/risk-factor-standard-store.js";
import { useLoginAuthStore } from "../../stores/common/login-auth-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { reactive, ref, onBeforeMount, nextTick, onUnmounted, onMounted} from "vue";
import { storeToRefs } from "pinia";
import riskFactorStandardService from "../../api/services/stdMgmt/risk-factor-standard-service.js";
import TemplateSeletion from "./riskFactorStandardComponents/TemplateSeletion.vue";
import WorkSelection from "./riskFactorStandardComponents/WorkSelection.vue";
import RskFctrMsr from "./riskFactorStandardComponents/RskFctrMsr.vue";
import debounce from 'lodash.debounce';

function extractKeys(mappings) {
  return Object.keys(mappings);
}
function lookupValue(mappings, key) {
  return mappings[key];
}

const store = useRiskFactorStandardStore();

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 2,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const scrollArea = ref(null);
const rskFctrMsrRef = ref(null);

// 작업명을 클릭하면 밑으로 살짝 스크롤을 내리는 함수
const handleScroll = () => {
  if (scrollArea.value.scrollTop < 70) {
    scrollArea.value.scrollTo({
      top: 150,
      behavior: 'smooth'
    });
  }
};

// 스크롤을 등록하고 맨 밑에 가까워지면 전체 위험요인을 다 보여줌
onMounted(() => {
  scrollArea.value.addEventListener('scroll', checkScrollPosition);
});

onUnmounted(() => {
  if (scrollArea.value) {
    scrollArea.value.removeEventListener('scroll', checkScrollPosition);
  }
});

const isAllDataVisible   = ref(false)
const hideData  = () => {
  isAllDataVisible .value = false
}
const checkScrollPosition = debounce(() => {
  const nearBottom =
  scrollArea.value.clientHeight + scrollArea.value.scrollTop >= scrollArea.value.scrollHeight - 700;
  if (nearBottom) {
    isAllDataVisible .value = true
  }
}, 400);
</script>

<style scoped>


.ag-theme-alpine {
  float: left;
}

.page_content_area {
  overflow: auto;
}
</style>
