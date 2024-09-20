<template>
  <popLgCatList :doSearch="doSearch"></popLgCatList>

  <popMdCatList
    :codeParams="codeParams"
    :key="codeParams"
    :doSearch="doSearch"></popMdCatList>

  <popWrkList
    :codeParams="codeParams"
    :key="codeParams"
    :doSearch="doSearch"></popWrkList>

  <popFctrList
    :codeParams="codeParams"
    :key="codeParams"
    :doSearch="doSearch"></popFctrList>

  <popMsrList
    :codeParams="codeParams"
    :key="codeParams"
    :doSearch="doSearch"></popMsrList>

  <div class="content_box">
    <div class="std_sort_step1 temp_menu_mapping">
      <popMdCatList
        :codeParams="codeParams"
        :key="codeParams"
        :doSearch="doSearch"></popMdCatList>
      <div class="sort_grid_title_area">
        <span>대분류</span>
        <button @click="updateMarkYn('lgCat')" class="edit_btn"></button>
      </div>
      <div class="grid_sort">
        <table>
          <tr v-for="(item, index) in lgCateList.value" :key="index">
            <td
              :class="{ checked: index === selectedLgCatRowIndex }"
              @click="selectFetchLgCatList(item, index)">
              {{ item.lgCatNm }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="std_sort_step2 temp_menu_mapping">
      <div class="sort_grid_title_area">
        <span>중분류</span>
        <button @click="updateMarkYn('mdCat')" class="edit_btn"></button>
      </div>
      <div class="grid_sort">
        <table>
          <tr v-for="(item, index) in mdCateList.value" :key="index">
            <td
              :class="{ checked: index === selectedMdCatRowIndex }"
              @click="selectFetchMdCatList(item, index)">
              {{ item.mdCatNm }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="std_sort_step3 temp_menu_mapping">
      <div class="sort_grid_title_area">
        <span>작업명</span>
        <button @click="updateMarkYn('wrk')" class="edit_btn"></button>
      </div>
      <div class="grid_sort">
        <table>
          <tr v-for="(item, index) in wrkCateList.value" :key="index">
            <td
              :class="{ checked: index === selectedWrkCatRowIndex }"
              @click="selectFetchWrkCatList(item, index)">
              {{ item.wrkNm }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <div class="subtitle_area">
    <div class="title">3. 위험요인 및 감소대책</div>
  </div>
  <div class="content_box">
    <div class="std_sort_step4 temp_menu_mapping">
      <div class="sort_grid_title_area">
        <div class="fl_l w40p">
          <span>위험요인</span>
          <button @click="updateMarkYn('fctr')" class="edit_btn"></button>
        </div>
        <div class="fl_l w60p">
          <span>감소대책</span>
          <button @click="updateMarkYn('msr')" class="edit_btn"></button>
        </div>
      </div>
      <div class="grid_sort2">
        <table>
          <colgroup>
            <col style="width: 40%" />
            <col style="width: 60%" />
          </colgroup>

          <tbody v-for="msrList in rsfRmmCateList.value" :key="msrList">
            <tr>
              <td :rowspan="msrList[0].cnt" @click="selectFctrList(msrList[0])">
                <span>
                  {{ msrList[0].rskFctr }}
                </span>
              </td>
              <td v-show="msrList[1].rskMsrMarkYn == 'Y'">
                <span>
                  {{ msrList[1].rskMsr }}
                </span>
              </td>
            </tr>
            <tr v-for="msr in msrList.slice(2)" :key="msr.rskMsrSeq">
              <td v-show="msr.rskMsrMarkYn == 'Y'">
                <span>
                  {{ msr.rskMsr }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import commonUtil from "@/utils/common-utils";
import { onMounted, reactive, ref } from "vue";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import popFctrList from "@/views/site/comPopup/popFctrList.vue";
import popLgCatList from "@/views/site/comPopup/popLgCatList.vue";
import popMdCatList from "@/views/site/comPopup/popMdCatList.vue";
import popMsrList from "@/views/site/comPopup/popMsrList.vue";
import popWrkList from "@/views/site/comPopup/popWrkList.vue";

const siteStore = useSiteRiskFactorRegulationStore();
const loginStore = useLoginAuthStore();
const comRiskStore = useComRiskFactorStandardStore();

const cUtil = commonUtil;

const userId = loginStore.$state.userInfo.userId;
const vendrCd =
  loginStore.$state.vendrInfo.ptnrYn == "Y"
    ? loginStore.$state.vendrInfo.vendrUpperCd
    : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
const division = "N"; // 팝업이 아닐때: "N"
const siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;

let lgCateList = reactive([]); // 대분류
let mdCateList = reactive([]); // 중분류
let wrkCateList = reactive([]); // 작업명 분류
let selectedLgCatRowIndex = ref(null);
let selectedMdCatRowIndex = ref(null);
let selectedWrkCatRowIndex = ref(null);

let rsfRmmCateList = reactive([]); // 위험요인&대책 분류

const codeParams = ref({});
const rskFctrSeq = ref("");

function refreshAll() {
  // 대분류가 새로 조회되었을때 다른 데이터 초기화
  mdCateList.value = [];
  wrkCateList.value = [];
  rsfRmmCateList.value = [];
}

// 컴포넌트 생성 전
onMounted(async () => {
  await doSearch();
  selectRow(); // 첫번째 값 세팅하기 위함
});

async function selectRow() {
  // 첫번째 값 세팅
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: "LG_CAT_0001",
    mdCatCd: "MD_CAT_0001",
    wrkNmCd: "WRK_NM_0001",
    division: division, //팝업이 아닐때: "N"
  };

  // 중분류 조회
  mdCateList.value = await siteStore.selectMdCatList(params);
  // 작업목록 조회
  wrkCateList.value = await siteStore.selectWrkCatList(params);
  // 위험요인 & 감소대책 조회
  rsfRmmCateList.value = await siteStore.fetchRskFctrMsrList(params, 0);

  codeParams.value = params;
}

async function doSearch() {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    division: division, //팝업이 아닐때
  };

  // 대분류 조회
  lgCateList.value = await siteStore.selectLgCatList(params);

  refreshAll();
}

// 대분류 항목 클릭 시
async function selectFetchLgCatList(item, index) {
  refreshAll();

  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: item.lgCatCd,
    division: division, //팝업이 아닐때
  };
  selectedLgCatRowIndex.value =
    index === undefined || index === null ? 0 : index;
  selectedMdCatRowIndex.value = 0;
  selectedWrkCatRowIndex.value = 0;
  // //중분류 조회
  mdCateList.value = await siteStore.selectMdCatList(params);

  if (mdCateList.value.length > 0) {
    // * 대분류 클릭 시 작업목록 조회
    // 중분류 첫번째 값으로 작업목록 세팅
    params.mdCatCd = mdCateList.value[0].mdCatCd;
    params.mdCatNm = mdCateList.value[0].mdCatNm;

    // 작업목록 조회
    wrkCateList.value = await siteStore.selectWrkCatList(params);
  } else {
    wrkCateList.value = [];
  }

  if (wrkCateList.value.length > 0) {
    params.wrkNmCd = wrkCateList.value[0].wrkNmCd;
    params.wrkNm = wrkCateList.value[0].wrkNm;
  } else {
    rsfRmmCateList.value = [];
  }

  // * 대분류, 중분류, 작업명 값 객체(codeParams)에 저장
  codeParams.value = params;
}

// 중분류 항목 클릭 시
async function selectFetchMdCatList(item, index) {
  wrkCateList.value = [];
  rsfRmmCateList.value = [];

  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: codeParams.value.lgCatCd,
    mdCatCd: item.mdCatCd,
    division: division, //팝업이 아닐때
  };
  selectedMdCatRowIndex.value =
    index === undefined || index === null ? 0 : index;
  selectedWrkCatRowIndex.value = 0;
  // 작업목록 조회
  wrkCateList.value = await siteStore.selectWrkCatList(params);

  if (wrkCateList.value.length > 0) {
    // * 대분류 클릭 시 대,중,작업명 값 저장
    params.wrkNmCd = wrkCateList.value[0].wrkNmCd;
    params.wrkNm = wrkCateList.value[0].wrkNm;
  }
  // * 대분류, 중분류, 작업명 값 객체(codeParams)에 저장
  codeParams.value = params;
}

// 작업명 항목 클릭 시
async function selectFetchWrkCatList(item, index) {
  rsfRmmCateList.value = [];

  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: codeParams.value.lgCatCd,
    mdCatCd: codeParams.value.mdCatCd,
    wrkNmCd: item.wrkNmCd,
    division: division, //팝업이 아닐때
  };
  selectedWrkCatRowIndex.value = index === undefined ? 0 : index;
  // 위험요인 & 감소대책 조회
  rsfRmmCateList.value = await siteStore.fetchRskFctrMsrList(params, index);

  codeParams.value = params;
}

// 위험요인 항목 클릭 시
async function selectFctrList(item) {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: codeParams.value.lgCatCd,
    mdCatCd: codeParams.value.mdCatCd,
    wrkNmCd: codeParams.value.wrkNmCd,
    rskFctrSeq: item.rskFctrSeq,
  };

  codeParams.value = params;
}

// 편집 버튼 클릭 시
function updateMarkYn(str) {
  if (str == "lgCat") popupLgCatList();
  else if (str == "mdCat") {
    if (cUtil.nullCheck(codeParams.value)) {
      alert("대분류를 선택해주세요.");
      return;
    } else {
      popupMdCatList();
    }
  } else if (str == "wrk") {
    if (cUtil.nullCheck(codeParams.value)) {
      alert("대분류를 선택해주세요.");
      return;
    } else {
      popupWrkList();
    }
  } else if (str == "fctr") {
    if (cUtil.nullCheck(codeParams.value)) {
      alert("작업명을 선택해주세요.");
      return;
    } else {
      popupFctrList();
    }
  } else if (str == "msr") {
    if (cUtil.nullCheck(codeParams.value.rskFctrSeq)) {
      alert("위험요인을 선택해주세요.");
      return;
    } else {
      popupMsrList();
    }
  }
}

//팝업 - 대분류 편집
function popupLgCatList() {
  document.getElementsByClassName("popup add_lg_cat")[0].classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}
//팝업 - 중분류 편집
function popupMdCatList() {
  document.getElementsByClassName("popup add_md_cat")[0].classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}
//팝업 - 작업명 편집
function popupWrkList() {
  document.getElementsByClassName("popup add_wrk")[0].classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}
//팝업 - 위험요인 편집
function popupFctrList() {
  document.getElementsByClassName("popup add_fctr")[0].classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}
//팝업 - 감소대책 편집
function popupMsrList() {
  document.getElementsByClassName("popup add_msr")[0].classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}
</script>

<style scoped>
.temp_menu_mapping td:hover {
  background-color: #eaf5fe;
}
.temp_menu_mapping td.checked:hover {
  background-color: #c4e0fa;
}
.content_box {
  display: flex;
  justify-content: space-between;
}
.content_box:nth-child(3) {
  margin: 0px;
}
.popup.add_lg_cat {
  width: 500px;
  height: auto;
}
.popup.add_md_cat {
  width: 500px;
  height: auto;
}
.popup.add_wrk {
  width: 500px;
  height: auto;
}
.popup.add_fctr {
  width: 1000px;
  height: auto;
}
.popup.add_msr {
  width: 1000px;
  height: auto;
}
span {
  white-space: pre-wrap;
}
</style>
