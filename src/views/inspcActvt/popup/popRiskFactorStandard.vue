<template>
  <div class="popup add_factor_standard">
    <div class="popup_title">
      <span>표준 추가</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="left">
        <div class="subtitle_area">
          <div class="title">표준공종</div>
          <div class="right_btn">
            <!-- 검색기능 -->
            <input
              type="text"
              class="search_input_h32"
              placeholder="분류 및 작업 검색"
              v-model="searchQuery"
              @keyup.enter.prevent="togglePopup" />
            <button class="search_btn" @click="togglePopup"></button>
            <popSearchStandard
              :defaultColDef="defaultColDef"
              :localeText="localeText"
              :vendrCd="$loginStore.$state.siteInfo.vendrCd"
              :siteCd="$loginStore.$state.siteInfo.siteCd"
              :siteHrmrskFctrMstSeq="emitDtl.siteHrmrskFctrMstSeq"
              :isOpenPopup="isOpenPopup"
              :searchQuery="searchQuery"
              @togglePopup="togglePopup"
              v-if="isOpenPopup" />
          </div>
        </div>

        <div class="content_box">
          <div class="std_sort_step1">
            <div class="sort_grid_title_area">
              <span>대분류</span>
            </div>
            <div class="grid_sort">
              <table>
                <tbody id="lgTbody">
                  <tr
                    tabIndex="0"
                    v-for="(item, index) in lgCateList.value"
                    :key="index">
                    <!-- 대분류 체크 된 항목-->
                    <td
                      v-if="index === selectedLgCatRowIndex"
                      :class="{ checked: index === selectedLgCatRowIndex }"
                      @click="selectFetchLgCatList(item, index, allParam)"
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                      {{ item.lgCatNm }}
                    </td>

                    <!-- 대분류 체크 안된 항목-->
                    <td
                      v-if="index != selectedLgCatRowIndex"
                      @click="selectFetchLgCatList(item, index, allParam)"
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                      {{ item.lgCatNm }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="std_sort_step2">
            <div class="sort_grid_title_area">
              <span>중분류</span>
            </div>
            <div class="grid_sort">
              <table>
                <tbody id="mdTbody">
                  <tr
                    tabIndex="0"
                    v-for="(item, index) in mdCateList.value"
                    :key="index">
                    <td
                      :class="{ checked: index === selectedMdCatRowIndex }"
                      @click="selectFetchMdCatList(item, index)"
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                      {{ item.mdCatNm }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="std_sort_step3">
            <div class="sort_grid_title_area">
              <span>작업명</span>
            </div>
            <div class="grid_sort">
              <table>
                <tbody id="wrkTbody">
                  <tr
                    tabIndex="0"
                    v-for="(item, index) in wrkCateList.value"
                    :key="index">
                    <td
                      :class="{ checked: index === selectedWrkCatRowIndex }"
                      @click="selectFetchWrkCatList(item, index)"
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                      {{ item.wrkNm }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="subtitle_area">
          <div class="title">위험요인/감소대책</div>
        </div>
        <!-- 멀티체크 테스트 -->
        <div class="content_box risk">
          <div class="sort_grid_title_area">
            <div class="fl_l w40p">
              <span>위험요인</span>
            </div>
            <div class="fl_l w60p">
              <span>감소대책</span>
            </div>
          </div>
          <div class="grid_multichk">
            <table>
              <tr
                class="multi_chk_row"
                v-for="(item, index) in rskFctrCateList.value"
                :key="index">
                <td @click="selectFetchRskFctrCatList(item, index)">
                  <input
                    type="checkbox"
                    class="multi_chk_left"
                    :value="item.rskFctr"
                    :data-id="item.rskFctrSeq + '/@' + item.rskFctr" />
                  <span>
                    {{ item.rskFctr }}
                  </span>

                  <!-- 왼쪽 항목 -->
                </td>
                <td>
                  <table
                    v-for="(item2, index2) in rskMsrCateList.value"
                    :key="index2">
                    <tr v-if="item.rskFctrSeq === item2.rskFctrSeq">
                      <td @click="selectFetchRskMsrCatList(item2, item)">
                        <input
                          type="checkbox"
                          class="multi_chk_right"
                          :value="item2.rskMsr"
                          :data-id="item.rskFctrSeq + '/@' + item2.rskMsr" />
                        <span>
                          {{ item2.rskMsr }}
                        </span>
                        <!-- 오른쪽 항목 -->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 멀티체크 테스트 end -->
      </div>
    </div>
    <div class="popup_button">
      <button @click="applyParam">저장</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "popRiskFactorStandard",
  methods: {
    addFactorStandardChild() {
      // 편집 팝업
      document
        .getElementsByClassName("loading_wrap")[0]
        .classList.remove("show");
      document.getElementsByClassName("popup_bg")[0].classList.add("show");
    },
  },
};
</script>

<script setup>
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";
import commonUtil from "@/utils/common-utils";
import popSearchStandard from "@/views/inspcActvt/popup/popSearchStandard.vue";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import {
  defineEmits,
  defineExpose,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

const { defaultColDef, localeText } = defineProps([
  "defaultColDef",
  "localeText",
]);

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useComRiskFactorStandardStore();

let lgCateList = reactive([]); // 대분류
let mdCateList = reactive([]); // 중분류
let wrkCateList = reactive([]); // 작업명 분류
let rskFctrCateList = reactive([]); // 위험요인
let rskMsrCateList = reactive([]); // 대책 분류
let emitDtl = reactive({});
const emit = defineEmits(["applyParam"]);

let selectedLgCatRowIndex = ref(null);
let selectedMdCatRowIndex = ref(null);
let selectedWrkCatRowIndex = ref(null);
const cUtil = commonUtil;

let rskFctrSeqValues = ref([]);

// 위험요인 배열
const arryRskFctr = reactive([]);
// 위험요인 순번 배열
const arryRskFctrSeq = reactive([]);

// 감소대책 배열
let arryRskMsr = reactive([]);

// 감소대책 배열
let arryRskMsr2 = reactive([]);

// 감소대책 필터 값
let arryRskMsrFilter = reactive([]);

// 감소대책 순번 배열
const arryRskMsrSeq = reactive([]);

const chIndex = ref(0);

//const paramList = ref([]);
let rskMsr = [];

let simpleParamList = reactive([]);

// 위험요인 text값
let rskFctrValues = reactive([]);

// 감소대책 text 값
let rskMsrValues = reactive([]);

// 표준 공종 저장 시 최종 저장 값
let paramList = reactive([]);

//표준추가 저장버튼
const applyParam = () => {
  console.log("저장 버튼 클릭시", emitDtl);
  const separator = "/";

  // 감소대책 배열
  let arryRskMsr3 = [];
  let indexValue = 0;

  if (emitDtl.rskFctr == "") {
    alert("위험요인 또는 감소대책 선택 후 저장 가능합니다.");
    return false;
  } else {
    let simpleParam = {
      vendrCd: emitDtl.vendrCd,
      siteCd: emitDtl.siteCd,
      siteHrmrskFctrMstSeq: emitDtl.siteHrmrskFctrMstSeq,
      lgCatCd: emitDtl.lgCatCd,
      lgCatNm: emitDtl.lgCatNm,
      mdCatCd: emitDtl.mdCatCd,
      mdCatNm: emitDtl.mdCatNm,
      wrkNmCd: emitDtl.wrkNmCd,
      wrkNm: emitDtl.wrkNm,
      rskFctrSeq: emitDtl.rskFctrSeq,
      //rskFctr: emitDtl.rskFctr,
      rskFctr: "",
      rskMsrSeq: emitDtl.rskMsrSeq,
      // rskMsr: emitDtl.rskMsr,
      rskMsr: "",
      mode: "I",
      isEditable: true,
    };

    /**
     *  위험요인 갯수만큼 row생성 후 (simpleParam)
     *  맞는 대책 값 넣어주기
     */
    let simpleParamList = [
      {
        vendrCd: "",
        siteCd: "",
        siteHrmrskFctrMstSeq: "",
        lgCatCd: "",
        lgCatNm: "",
        mdCatCd: "",
        mdCatNm: "",
        wrkNmCd: "",
        wrkNm: "",
        rskFctrSeq: "",
        rskFctr: "",
        rskMsrSeq: "",
        rskMsr: "",
        mode: "",
        isEditable: "",
      },
    ];

    let simpleParamList3 = [
      {
        vendrCd: "",
        siteCd: "",
        siteHrmrskFctrMstSeq: "",
        lgCatCd: "",
        lgCatNm: "",
        mdCatCd: "",
        mdCatNm: "",
        wrkNmCd: "",
        wrkNm: "",
        rskFctrSeq: "",
        rskFctr: "",
        rskMsrSeq: "",
        rskMsr: "",
        mode: "",
        isEditable: "",
      },
    ];

    console.log("emitDtl.rskFctr ==>", emitDtl.rskFctr);
    console.log("emitDtl.rskFctr ==>", emitDtl.rskFctr);
    console.log("emitDtl.rskFctr ==>", emitDtl.vendrCd);

    if (emitDtl.rskFctr != undefined && emitDtl.rskFctr != "") {
      // 위험요인
      emitDtl.rskFctr.forEach((e, index) => {
        // 첫 감소대책 순번 체크 위한 값
        let sameNum = 0;

        //console.log("위험요인:: "+ e);

        simpleParamList.vendrCd = emitDtl.vendrCd;
        simpleParamList.siteCd = emitDtl.siteCd;
        simpleParamList.siteHrmrskFctrMstSeq = emitDtl.siteHrmrskFctrMstSeq;
        simpleParamList.lgCatCd = emitDtl.lgCatCd;
        simpleParamList.lgCatNm = emitDtl.lgCatNm;
        simpleParamList.mdCatCd = emitDtl.mdCatCd;
        simpleParamList.mdCatNm = emitDtl.mdCatNm;

        simpleParamList.wrkNmCd = emitDtl.wrkNmCd;
        simpleParamList.wrkNm = emitDtl.wrkNm;
        simpleParamList.rskFctrSeq = emitDtl.rskFctrSeq;
        // 위험요인
        //simpleParamList.rskFctr = e;
        simpleParamList.rskMsrSeq = emitDtl.rskMsrSeq;

        // 감소대책
        simpleParamList.rskMsr = "";
        simpleParamList.mode = "I";
        simpleParamList.isEditable = true;

        // ** 위험요인 ** //

        // 1. @/ 위험요인 초기 값
        let rskFctrDesc = emitDtl.rskFctr[index].toString();
        //console.log("위험요인 값::",rskFctrDesc);

        // (@/ 위치 값)
        let rskFctrIndex = rskFctrDesc.indexOf("/@");
        // console.log("위험요인 골뱅이 위치 ==>"+rskFctrIndex);

        // 위험요인  순번 값
        let rskFctrNum = rskFctrDesc.substring(0, rskFctrIndex);
        //console.log("위험요인 순번 값==>"+rskFctrNum);

        // 숫자/@  제거한 값
        simpleParamList.rskFctr = rskFctrDesc.substring(rskFctrIndex + 2);

        // ** 감소대책 ** //

        //  감소대책
        emitDtl.rskMsr.forEach((e, i) => {
          /** 위험요인순번에 , 감소대책 순번 비교해서 넣기 **/

          // 1. @/ 감소대책 초기 값
          let rskMsrDesc = emitDtl.rskMsr[i].toString();
          //console.log("감소대책 값::",rskMsrDesc);

          // (@/ 위치 값)
          let rskMsrIndex = rskMsrDesc.indexOf("/@");
          //console.log("골뱅이 위치 ==>"+rskMsrIndex);

          // 감소대책 순번 값
          let rskMsrNum = rskMsrDesc.substring(0, rskMsrIndex);
          //console.log("감소대책 순번 값==>"+rskMsrNum);

          // 감소대책 숫자/@  제거한 값
          let replaceRskMsrDesc = rskMsrDesc.substring(rskMsrIndex + 2);

          // 위험요인 순번, 감소대책 비교 후 같으면 insert
          if (rskFctrNum == rskMsrNum) {
            sameNum += 1;
            // 처음 빼고 나머지에서 줄바꿈 처리
            if (sameNum === 1) {
              simpleParamList.rskMsr += "\xb7 " + replaceRskMsrDesc;
            } else {
              simpleParamList.rskMsr += "\n" + "\xb7 " + replaceRskMsrDesc;
            }
          }
        });

        paramList.push({ ...simpleParamList });
      });
    } else {
      simpleParamList.vendrCd = emitDtl.vendrCd;
      simpleParamList.siteCd = emitDtl.siteCd;
      simpleParamList.siteHrmrskFctrMstSeq = emitDtl.siteHrmrskFctrMstSeq;

      paramList.push({ ...simpleParamList });
    }

    console.log("배열 값  : ", paramList);

    emit("applyParam", paramList);
    popupClose();

    // if (confirm("저장하시겠습니까?")) {
    //   emit("applyParam", paramList);
    //   // 저장 시 초기화
    //   //paramList = [];
    //   popupClose();
    // } else {
    //   //paramList = [];
    //   return false;
    // }
  }
};

// 추가 버튼 클릭 시 초기화
function dataReset() {
  rskFctrValues = [];
  rskMsrValues = [];

  emitDtl.rskFctr = "";
  paramList = [];
  simpleParamList = [];
}

// 팝업창 닫기
const popupClose = () => {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
  document.getElementsByClassName("popup")[0].classList.remove("show");
  document
    .getElementsByClassName("add_factor_standard")[0]
    .classList.remove("show");

  const multiChk = document.querySelectorAll(".multi_chk_row");
  selectedLgCatRowIndex.value = null;
  selectedMdCatRowIndex.value = null;
  selectedWrkCatRowIndex.value = null;
  emitDtl.value = null;

  multiChk.forEach(function (el, i) {
    const parent = document.querySelectorAll(".multi_chk_row")[i];
    const checkLeft = parent.querySelector(".multi_chk_left");
    const checkRight = parent.querySelectorAll(".multi_chk_right");

    checkLeft.checked = false;
    for (const checkRightChecked of checkRight) {
      checkRightChecked.checked = false;
    }
    checkRight.checked = false;
  });
};

// 대분류 클릭 시 중분류 검색
async function selectFetchLgCatList(lgItem, index, allParam) {
  // 위험요인, 감소대책 체크박스 해지
  chkReset();

  selectedLgCatRowIndex.value =
    index === undefined || index === null ? 0 : index;
  document
    .getElementById("lgTbody")
    .children[selectedLgCatRowIndex.value].focus();

  console.log("대분류 인덱스:", selectedLgCatRowIndex.value);

  emitDtl.lgCatCd = lgItem.lgCatCd;
  emitDtl.lgCatNm = lgItem.lgCatNm;

  mdCateList.value = await store.fetchMdCatList(lgItem, index);

  console.log("중분류 조회 된 값==>", mdCateList.value);

  // 조회 된 중분류 값 중에
  mdCateList.value.find((item, index) => {
    if (allParam != undefined) {
      // 내가 선택한 중분류랑 조회된 중분류 코드 같은 경우
      if (item.mdCatCd === allParam.mdCatCd) {
        console.log("내가 중분류 선택 한 값", item.mdCatCd);
        // 작업명 조회
        selectFetchMdCatList(item, index, allParam);
      }
    } else {
      if (index === 0) {
        selectFetchMdCatList(item, 0, mdCateList.value[0], index);
      }
    }
  });

  //console.log('중분류 최종 값 : ',mdCateList.value)

  return false;
}

// 중분류 클릭 시 작업명 분류 검색
async function selectFetchMdCatList(mdItem, index, allParam) {
  // 위험요인, 감소대책 체크박스 해지
  chkReset();

  console.log("2번째 allParam==>", allParam);

  // 중분류 row index 값
  selectedMdCatRowIndex.value =
    index === undefined || index === null ? 0 : index;

  console.log("중분류 인덱스==>", selectedMdCatRowIndex.value);

  if (mdItem.lgCatCd === null) {
    mdItem.lgCatCd = emitDtl.lgCatCd;
    mdItem.lgCatNm = emitDtl.lgCatNm;
  }

  emitDtl.mdCatCd = mdItem.mdCatCd;
  emitDtl.mdCatNm = mdItem.mdCatNm;

  wrkCateList.value = await store.fetchWrkList(mdItem, index);

  // 중분류 포커스 주기
  document
    .getElementById("mdTbody")
    .children[selectedMdCatRowIndex.value].focus();

  console.log("작업명 조회 된 값==>", wrkCateList.value);

  // 셀 클릭 아닌 경우 (조회 팝업 일떄)
  if (!cUtil.nullCheck(allParam)) {
    console.log("allParam2가 널 아닌경우==>");

    // 작업명이 널 아닌경우
    if (!cUtil.nullCheck(allParam.wrkNmCd)) {
      // 조회 된 작업명 값 중에
      wrkCateList.value.find((item, index) => {
        // 내가 선택한 중분류랑 조회된 중분류 코드 같은 경우
        if (item.wrkNmCd === allParam.wrkNmCd) {
          console.log("내가 작업명 선택 한 값", item.wrkNmCd, index);
          // 위험요인 조회
          selectFetchWrkCatList(item, index);
        }
      });

      // 작업명이 널인 경우
    } else {
      console.log("작업명이 널");
      selectFetchWrkCatList(wrkCateList.value[0], 0);
    }
  } else {
    console.log("셀클릭 널");
    selectFetchWrkCatList(wrkCateList.value[0], 0);
  }
}

// 작업명 클릭 시 위험요인 분류 검색
async function selectFetchWrkCatList(wrkItem, index) {
  // 위험요인, 감소대책 체크박스 해지
  chkReset();

  console.log("최종스 작업 클릭 됨==>", wrkItem);
  console.log("최종스 작업 인덱스==>", index);

  selectedWrkCatRowIndex.value = index === undefined ? 0 : index;

  console.log("최종스 작업 인덱스 대입 후 ==>", selectedWrkCatRowIndex.value);

  if (wrkItem.lgCatCd === undefined) {
    wrkItem.lgCatCd = emitDtl.lgCatCd;
    wrkItem.lgCatNm = emitDtl.lgCatNm;
    wrkItem.mdCatCd = emitDtl.mdCatCd;
    wrkItem.mdCatNm = emitDtl.mdCatNm;
  }

  emitDtl.wrkNmCd = wrkItem.wrkNmCd;
  emitDtl.wrkNm = wrkItem.wrkNm;

  //await selectFetchWrkCatList(wrkCateList.value[0], selectedWrkCatRowIndex.value)

  // console.log('보낼 데이터확인', emitDtl)

  console.log("마지막 라스트 값==>", wrkItem);

  rskFctrCateList.value = await store.fetchRskFctrList(wrkItem, index);
  rskMsrCateList.value = await store.fetchRskMsrList(wrkItem, index);

  document
    .getElementById("wrkTbody")
    .children[selectedWrkCatRowIndex.value].focus();
}

// 위험요인, 감소대책 전체 체크 박스 해지
function chkReset() {
  const multiChk = document.querySelectorAll(".multi_chk_row");

  multiChk.forEach(function (el, i) {
    // 왼쪽 클릭
    const parent = document.getElementsByClassName("multi_chk_row")[i];
    const checkAll = parent.querySelector(".multi_chk_left");
    const rightCheckboxes = parent.querySelectorAll(".multi_chk_right");
    const leftCheckboxes = parent.querySelectorAll(".multi_chk_left");

    // 위험요인 순번
    for (const checkbox of rightCheckboxes) {
      checkbox.checked = false;
    }
    // 감소대책 순번
    for (const checkbox of leftCheckboxes) {
      checkbox.checked = false;
    }
  });
}

// 위험요인 클릭 시 감소대책 전체선택
function selectFetchRskFctrCatList(fctrItem) {
  // 위험요인 초기화
  rskFctrValues = [];
  // 감소대책 초기화
  rskMsrValues = [];

  if (fctrItem === undefined) {
    fctrItem.lgCatCd = emitDtl.lgCatCd;
    fctrItem.lgCatNm = emitDtl.lgCatNm;
    fctrItem.mdCatCd = emitDtl.mdCatCd;
    fctrItem.mdCatNm = emitDtl.mdCatNm;
    fctrItem.wrkNmCd = emitDtl.wrkNmCd;
    fctrItem.wrkNm = emitDtl.wrkNm;
    fctrItem.rskFctrSeq = emitDtl.rskFctrSeq;
    fctrItem.rskFctr = emitDtl.rskFctr;
  }

  let rskFctr = [];
  let rskFctrSeq = "";
  let rskMsr = [];
  let rskMsrSeq = "";
  const separator = "/";

  const multiChk = document.querySelectorAll(".multi_chk_row");

  multiChk.forEach(function (el, i) {
    // 위험요인 순번이랑 같은 경우에만 체크 적용
    if (i == fctrItem.rskFctrSeq - 1) {
      // 왼쪽 클릭
      const parent = document.getElementsByClassName("multi_chk_row")[i];
      const checkAll = parent.querySelector(".multi_chk_left");
      const checkboxes = parent.querySelectorAll(".multi_chk_right");

      if (checkAll.checked) {
        for (const checkbox of checkboxes) {
          checkbox.checked = true;
        }
      } else {
        for (const checkbox of checkboxes) {
          checkbox.checked = false;
        }
      }
    }
  });

  const rskFctrList = Array.from(document.querySelectorAll(".multi_chk_left"));
  const rskMsrList = Array.from(document.querySelectorAll(".multi_chk_right"));

  const rskFctrArr = rskFctrList.filter((item) => item.checked);
  const rskMsrArr = rskMsrList.filter((item) => item.checked);

  console.log("전체 체크 위험요인 배열:", rskFctrArr);

  // const rskFctrValues = rskFctrArr.map((item) => item.value);
  // const rskMsrValues = rskMsrArr.map((item) => item.value);

  // 위험요인 text 값
  rskFctrArr.map((item) => {
    console.log("몇번");

    rskFctrValues.push(item.dataset.id);
  });

  // 감소대책 text 값
  rskMsrArr.map((item) => {
    rskMsrValues.push(item.dataset.id);
  });

  console.log("전체 체크한 위험요인 값==>" + rskFctrValues);
  console.log("전체 체크한 감소대책 값==>" + rskMsrValues);

  // console.log("rskFctrValues=>", rskFctrValues);
  // console.log("rskMsrValues=>", rskMsrValues);

  rskFctrValues.forEach((e, i) => {});

  rskMsrValues.forEach((e, i) => {});

  // emitDtl.rskFctrSeq = fctrItem.rskFctrSeq;
  //emitDtl.rskFctr = rskFctr.replaceAll("/", "\n");
  // emitDtl.rskMsrSeq = fctrItem.rskMsrSeq;
  //emitDtl.rskMsr = rskMsr.replaceAll("/", "\n");

  // 위험요인 순번
  //emitDtl.rskFctrSeq = rskFctrSeq;
  // 위험요인
  emitDtl.rskFctr = rskFctrValues;
  // 감소대책
  emitDtl.rskMsr = rskMsrValues;
}

// 감소대책 클릭 시
function selectFetchRskMsrCatList(msrItem, originRskMsrCate) {
  //let arryRskMsr = [];
  //let arryRskMsr2 = [];

  // 위험요인 초기화
  rskFctrValues = [];
  // 감소대책 초기화
  rskMsrValues = [];

  // 클릭 여부
  chIndex.value += 1;
  console.log("msrItem==>", msrItem);

  if (msrItem === undefined) {
    msrItem.lgCatCd = emitDtl.lgCatCd;
    msrItem.lgCatNm = emitDtl.lgCatNm;
    msrItem.mdCatCd = emitDtl.mdCatCd;
    msrItem.mdCatNm = emitDtl.mdCatNm;
    msrItem.wrkNmCd = emitDtl.wrkNmCd;
    msrItem.wrkNm = emitDtl.wrkNm;
    msrItem.rskFctrSeq = emitDtl.rskFctrSeq;
    msrItem.rskFctr = emitDtl.rskFctr;
    msrItem.rskMsrSeq = emitDtl.rskMsrSeq;
    msrItem.rskMsr = emitDtl.rskMsr;
  }

  const multiChk = document.querySelectorAll(".multi_chk_row");

  multiChk.forEach(function (el, i) {
    const parent = document.getElementsByClassName("multi_chk_row")[i];
    const checkAll = parent.querySelector(".multi_chk_left");
    // 오른쪽 클릭
    const checkboxes = parent.querySelectorAll(".multi_chk_right");

    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        const checkedCnt = parent.querySelectorAll(
          ".multi_chk_right:checked"
        ).length;
        parent.querySelector(".multi_chk_left").checked = checkedCnt > 0;
      } else {
        const checkedCnt = parent.querySelectorAll(
          ".multi_chk_right:checked"
        ).length;
        if (checkedCnt == 0) {
          parent.querySelector(".multi_chk_left").checked = false;
        }
      }
    }
  });

  let rskFctr = [];
  let rskFctrSeq = "";
  let rskMsr = [];
  let rskMsrSeq = "";

  const rskFctrList = Array.from(document.querySelectorAll(".multi_chk_left"));
  const rskMsrList = Array.from(document.querySelectorAll(".multi_chk_right"));

  const rskFctrArr = rskFctrList.filter((item) => item.checked);
  const rskMsrArr = rskMsrList.filter((item) => item.checked);

  // 위험요인 text 값
  rskFctrArr.map((item) => {
    rskFctrValues.push(item.dataset.id);
  });

  // 감소대책 text 값
  rskMsrArr.map((item) => {
    rskMsrValues.push(item.dataset.id);
  });

  console.log("체크한 위험요인 값==>" + rskFctrValues);
  console.log("체크한 감소대책 값==>" + rskMsrValues);

  // 위험요인
  rskFctrValues.forEach((e, i) => {});

  // 감소대책
  rskMsrValues.forEach((e, i) => {});

  emitDtl.rskFctr = rskFctrValues;
  emitDtl.rskMsr = rskMsrValues;

  console.log("위험요인에 param: ", msrItem);
  console.log("보내줄데이터 : ", emitDtl);
}

const searchQuery = ref("");
const isOpenPopup = ref(false);

// 검색팝업 emit
const togglePopup = (param) => {
  console.log("검색팝업 최종 값", param);

  //console.log(isOpenPopup.value, "열기전")
  isOpenPopup.value = !isOpenPopup.value;
  //console.log(isOpenPopup.value, "열기후", searchQuery.value)
  // console.log('파람 확인 : ', param)
  //console.log('파람 확인 : ', lgCateList.value)
  lgCateList.value.find((item, index) => {
    //console.log('대분류 값 확인 : ', item)
    // console.log('대분류 인덱스 확인 : ',index)
    if (item.lgCatCd === param.lgCatCd) {
      console.log("조회된 대분류 ==>" + item.lgCatCd);
      console.log("넘어온 대분류 ==>" + param.lgCatCd);

      // 대분류 클릭 시 중분류 조회
      selectFetchLgCatList(item, index, param);
    }
  });

  if (isOpenPopup.value === false) {
    searchQuery.value = "";
  }
};

onMounted(async () => {
  watch(
    () => lgCateList.value,
    (newVal, oldVal) => {}
  );

  // //중분류 클릭 시 감지
  // watch(() => mdCateList.value, (newVal, oldVal) => {

  //   console.log("중분류 클릭");

  //   console.log("중분류 클릭 전 값 : ", oldVal);
  //   newVal.filter(item => {
  //     item.lgCatCd = emitDtl.lgCatCd
  //     item.lgCatNm = emitDtl.lgCatNm
  //   });
  //   rskFctrCateList.value = reactive([]);
  //   rskMsrCateList.value = reactive([]);

  //   console.log('새로운 클릭 값 : ',newVal[0])

  //   selectFetchMdCatList(newVal[0])
  // })
});

onBeforeMount(async () => {
  const lgCatListParam = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
  };
  lgCateList.value = await store.fetchLgCatList(lgCatListParam);

  emitDtl.vendrCd = lgCatListParam.vendrCd;
  emitDtl.siteCd = lgCatListParam.siteCd;
  emitDtl.siteHrmrskFctrMstSeq = lgCateList.value[0].siteHrmrskFctrMstSeq;

  console.log("데이터 확인 : ", lgCateList.value);
  console.log("데이터 확인 : emitDtl>>>> ", emitDtl);
});

defineExpose({
  //emitMethod,
  dataReset,
});
</script>

<style scoped>
.content_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content_box:nth-child(3) {
  margin: 0px;
}
.popup.add_site_category {
  width: 300px;
  height: 500px;
}
tr td:hover {
  background-color: #eaf5fe;
  cursor: pointer;
}
td {
  vertical-align: top;
  padding: 10px;
}
.right_btn .search_input {
  width: 201px;
  height: 32px;
}
.popup_background {
  left: 0px;
}
.search_input_h32 {
  height: 32px;
}

span {
  white-space: pre-wrap;
}
</style>
