<template>
  <div class="pop_in_pop add_factor_standardTour">
    <div class="popup_title">
      <span>표준 추가</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <div class="subtitle_area">
        <div class="title">표준공종 / 위험요인</div>
        <button @click="applyRiskTour">저장</button>
      </div>
      <div class="content_box">
        <div class="std_sort_step1">
          <div class="sort_grid_title_area">
            <span>대분류</span>
          </div>
          <select @change="selectLgCat($event)">
            <option selected>대분류를 선택해주세요.</option>
            <option
              v-for="(item, index) in lgCateList.value"
              :key="index"
              :value="item"
            >
              {{ item.lgCatNm }}
            </option>
          </select>
          <!-- <div class="grid_sort">
            <table>
              <tr v-for="(item, index) in lgCateList.value" :key="index">
                <td @click="selectFetchMdCatList(item, index)">
                  {{ item.lgCatNm }}
                </td>
              </tr>
            </table>
          </div> -->
        </div>
        <div class="std_sort_step2">
          <div class="sort_grid_title_area">
            <span>중분류</span>
          </div>
          <select @change="selectMdCat($event)">
            <option selected>중분류를 선택해주세요.</option>
            <option v-for="(item, index) in mdCateList.value" :key="index">
              {{ item.mdCatNm }}
            </option>
          </select>
          <!-- <div class="grid_sort">
            <table>
              <tr v-for="(item, index) in mdCateList.value" :key="index">
                <td @click="selectFetchWrkCatList(item, index)">
                  {{ item.mdCatNm }}
                </td>
              </tr>
            </table>
          </div> -->
        </div>
        <div class="std_sort_step3">
          <div class="sort_grid_title_area">
            <span>작업명</span>
          </div>
          <select @change="selectWrkCat($event)">
            <option selected>작업명을 선택해주세요.</option>
            <option v-for="(item, index) in wrkCateList.value" :key="index">
              {{ item.wrkNm }}
            </option>
          </select>
          <!-- <div class="grid_sort">
            <table>
              <tr v-for="(item, index) in wrkCateList.value" :key="index">
                <td @click="selectFetchrsfRmmCatList(item, index)">
                  {{ item.wrkNm }}
                </td>
              </tr>
            </table>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getCurrentInstance,
  onBeforeMount,
  ref,
  defineComponent,
  reactive,
} from "vue";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { ko } from "date-fns/locale";
import { axiosApiDEV } from "@/api";
import { AgGridVue } from "ag-grid-vue3";
import { storeToRefs } from "pinia";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";

const { defaultColDef, localeText, popMode } = defineProps([
  "defaultColDef",
  "localeText",
  "popMode",
]);

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useComRiskFactorStandardStore();
const emit = defineEmits(["riskFactor_tour"]);
let lgCateList = reactive([]); // 대분류
let mdCateList = reactive([]); // 중분류
let wrkCateList = reactive([]); // 작업명 분류
let rsfRmmCateList = reactive([]); // 위험요인&대책 분류
let dtlparam = reactive([]);
let riskFactor = reactive({
  lgCatCd: "",
  mdCatCd: "",
  wrkNmCd: "",
  lgCatNm: "",
  mdCatNm: "",
  wrkNm: "",
});

const {
  selectedHrmrskFctrMstSeq,
  selectedLgCatCd,
  selectedLgCatNm,
  selectedMdCatCd,
  selectedMdCatNm,
  selectedWrkNmCd,
  selectedWrkNm,
  lgCatList,
  mdCatList,
  wrkList,
} = storeToRefs(store);

//표준추가 팝업 닫기
function applyRiskTour() {
  emit("riskFactor_tour", riskFactor);
  popInPopClose();
}

// 팝업 닫기
function popInPopClose() {
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  document
    .getElementsByClassName("add_factor_standardTour")[0]
    .classList.remove("show");
}

// 대분류 클릭 시 중분류 검색을 위한 중간 함수
const selectLgCat = (event) => {
  let index = event.target.selectedIndex - 1;
  console.log("index : " + index);
  if (index != -1) {
    selectFetchMdCatList(lgCateList.value[index], index);
  } else {
    return;
  }

  console.log("lgCateList.index : ", lgCateList.value[index]);
};

// 중분류 클릭 시 작업명 검색을 위한 중간 함수
const selectMdCat = (event) => {
  let index = event.target.selectedIndex - 1;
  if (index != -1) {
    console.log("mdCateList.value[index] : " + mdCateList.value[index]);
    selectFetchWrkCatList(mdCateList.value[index], index);
  } else {
    return;
  }
};

// 작업명 클릭 시 작업명 함수
const selectWrkCat = (event) => {
  let index = event.target.selectedIndex - 1;
  if (index != -1) {
    selectFetchrsfRmmCatList(wrkCateList.value[index], index);
  } else {
    return;
  }
};

// 대분류 클릭 시 중분류 검색
async function selectFetchMdCatList(item, index) {
  console.log("대분류 클릭>>>>>>>>>>>>>>>>>>>>>>>>", item);
  mdCateList.value = await store.fetchMdCatList(item);
  dtlparam.value = item;
  dtlparam.value.mdCatCd = mdCatList.value[0].mdCatCd;
  dtlparam.value.mdCatNm = mdCatList.value[0].mdCatNm;
  await selectFetchWrkCatList(dtlparam.value, index);
  riskFactor.lgCatCd = item.lgCatCd;
  riskFactor.lgCatNm = item.lgCatNm;
}

// 중분류 클릭 시 작업명 분류 검색
async function selectFetchWrkCatList(item, index) {
  console.log("중분류 클릭>>>>>>>>>>>>>>>>>>>>>", item);
  dtlparam.value.mdCatCd = item.mdCatCd;
  dtlparam.value.mdCatNm = item.mdCatNm;
  wrkCateList.value = await store.fetchWrkList(dtlparam.value, index);
  console.log("selectFetchWrkCatList", wrkCateList);
  riskFactor.mdCatCd = item.mdCatCd;
  riskFactor.mdCatNm = item.mdCatNm;
}

// 작업명 클릭 시 위험요인&대책 분류 검색
async function selectFetchrsfRmmCatList(item, index) {
  console.log(
    "작업명 클릭>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + JSON.stringify(item)
  );
  riskFactor.wrkNmCd = item.wrkNmCd;
  riskFactor.wrkNm = item.wrkNm;
  // dtlparam.value.wrkCatCd = item.mdCatCd;
  // dtlparam.value.wrkCatNm = item.mdCatNm;
  // rsfRmmCateList.value = await store.fetchRskFctrMsrList(dtlparam.value, index);
  console.log("저장 된 riskFactor : ", riskFactor);
}

onBeforeMount(async () => {
  const lgCatListParam = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
  };
  lgCateList.value = await store.fetchLgCatList(lgCatListParam);
});
</script>

<style scoped>
.content_box {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}
.content_box:nth-child(3) {
  margin: 0px;
}

.add_factor_standardTour {
  width: 100%;
  height: 70%;
}
</style>
