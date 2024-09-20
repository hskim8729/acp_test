<template>
  <div class="popup add_factor_standard popup_bg show">
    <div class="popup_title">
      <span>표준 추가</span>
      <button class="popup_close" @click="close"></button>
    </div>
    <div class="popup_content">
      <div class="left">
        <div class="subtitle_area">
          <div class="title">표준공종</div>
          <div class="right_btn">
            <!-- 검색기능 -->
            <WorkCateSearch @onClickSearchedData="onClickSearchedData" />
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
          <comp-button
            text="AI 위험성평가"
            @click="openPopAiRiskEval"></comp-button>
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
                v-for="(item, index) in rskCateList"
                :key="index">
                <td>
                  <input
                    type="checkbox"
                    class="multi_chk_left"
                    v-model="item.isSelected"
                    @change="selectRskCateList(item, index)"
                    :data-id="item.rskFctrSeq + '/@' + item.rskFctr" />
                  <v-badge
                    v-if="item.isAiRecomond"
                    class="pl-5"
                    color="#ff006a"
                    content="AI"
                    inline></v-badge>
                  <span :class="index === 0 ? 'text-red' : ''">
                    {{ item.rskFctr }}
                  </span>

                  <!-- 왼쪽 항목 -->
                </td>
                <td>
                  <table
                    v-for="(msrItem, msrIndex) in item.msrCateList"
                    :key="msrIndex">
                    <tr v-if="item.rskFctrSeq === msrItem.rskFctrSeq">
                      <td>
                        <input
                          type="checkbox"
                          class="multi_chk_right"
                          v-model="msrItem.isSelected"
                          @change="selectMsrCateList(msrItem, index)"
                          :value="msrItem.rskMsr"
                          :data-id="item.rskFctrSeq + '/@' + msrItem.rskMsr" />
                        <span :class="index === 0 ? 'text-red' : ''">
                          {{ msrItem.rskMsr }}
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
      </div>
    </div>
    <pop-ai-risk-eval
      v-if="isPopAiRiskEval"
      v-model="isPopAiRiskEval"
      :ai-params="aiParams"
      @getAiRecList="getAiRecList"
      @close="closePopAiRiskEval">
    </pop-ai-risk-eval>
    <div class="popup_button">
      <button @click="applyParam">저장</button>
      <button @click="close">닫기</button>
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
import {
  defineEmits,
  getCurrentInstance,
  onBeforeMount,
  reactive,
  ref,
  watch,
} from "vue";

import compButton from "@/components/button/compButton.vue";
import popAiRiskEval from "@/views/aiRiskEval/popAiRiskEval.vue";
import WorkCateSearch from "../../../components/searchBar/workCatSearchBar.vue/workCateSearch.vue";

import commonUtil from "@/utils/common-utils";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { filter } from "lodash";

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useComRiskFactorStandardStore();
const dialogStore = useDialogStore();

let lgCateList = reactive([]); // 대분류
let mdCateList = reactive([]); // 중분류
let wrkCateList = reactive([]); // 작업명 분류
let rskFctrCateList = ref([]); // 위험요인
let rskMsrCateList = ref([]); // 대책 분류
let rskCateList = ref([]); // 위험요인/감소대책
let emitDtl = reactive({});
const emit = defineEmits(["applyParam", "close"]);

let selectedLgCatRowIndex = ref(null);
let selectedMdCatRowIndex = ref(null);
let selectedWrkCatRowIndex = ref(null);
const cUtil = commonUtil;

const chIndex = ref(0);

// 위험요인 text값
let rskFctrValues = reactive([]);

// 감소대책 text 값
let rskMsrValues = reactive([]);

//표준추가 저장버튼
const applyParam = () => {
  // 표준 공종 저장 시 최종 저장 값
  let paramList = reactive([]);

  paramList = rskCateList.value.filter((item) => {
    return item.isSelected;
  });
  paramList.forEach((item) => {
    let rskMsr = "";
    let detailList = item.msrCateList.filter((itemMsr) => {
      return itemMsr.isSelected;
    });

    // 위험요인 내 감소대책은 줄바꿈처리
    detailList.forEach((item, index) => {
      rskMsr += `${index > 0 ? "\n" : " "} \xb7 ${item.rskMsr}`;
    });

    item.vendrCd = emitDtl.vendrCd;
    item.siteCd = emitDtl.siteCd;
    item.siteHrmrskFctrMstSeq = emitDtl.siteHrmrskFctrMstSeq;
    item.lgCatCd = emitDtl.lgCatCd;
    item.lgCatNm = emitDtl.lgCatNm;
    item.mdCatCd = emitDtl.mdCatCd;
    item.mdCatNm = emitDtl.mdCatNm;
    item.wrkNmCd = emitDtl.wrkNmCd;
    item.wrkNm = emitDtl.wrkNm;
    item.rskMsr = rskMsr;
    item.mode = "I";
    item.isEditable = true;
  });

  // SAVE
  if (paramList.length < 1) {
    dialogStore.openAlertDialog("선택한 표준이 없습니다.");
    return false;
  }

  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      close(paramList);
    },
  });
  // if (confirm("저장하시겠습니까?")) {
  //   close(paramList);
  // }
};

const initData = async () => {
  const lgCatListParam = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
  };
  lgCateList.value = await store.fetchLgCatList(lgCatListParam);

  emitDtl.vendrCd = lgCatListParam.vendrCd;
  emitDtl.siteCd = lgCatListParam.siteCd;
  emitDtl.siteHrmrskFctrMstSeq = lgCateList.value[0].siteHrmrskFctrMstSeq;
};

// 팝업창 닫기
const close = (params) => {
  emit("close", params);
  chkReset();
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

  emitDtl.lgCatCd = lgItem.lgCatCd;
  emitDtl.lgCatNm = lgItem.lgCatNm;

  mdCateList.value = await store.fetchMdCatList(lgItem, index);

  // 조회 된 중분류 값 중에
  mdCateList.value.find((item, index) => {
    if (allParam != undefined) {
      // 내가 선택한 중분류랑 조회된 중분류 코드 같은 경우
      if (item.mdCatCd === allParam.mdCatCd) {
        // 작업명 조회
        selectFetchMdCatList(item, index, allParam);
      }
    } else {
      if (index === 0) {
        selectFetchMdCatList(item, 0, mdCateList.value[0]);
      }
    }
  });

  return false;
}

// 중분류 클릭 시 작업명 분류 검색
async function selectFetchMdCatList(mdItem, index, allParam, cnt) {
  // 위험요인, 감소대책 체크박스 해지
  chkReset();

  // 중분류 row index 값
  selectedMdCatRowIndex.value =
    index === undefined || index === null ? 0 : index;

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

  // 셀 클릭 아닌 경우 (조회 팝업 일떄)
  if (!cUtil.nullCheck(allParam)) {
    // 작업명이 널 아닌경우
    if (!cUtil.nullCheck(allParam.wrkNmCd)) {
      // 조회 된 작업명 값 중에
      wrkCateList.value.find((item, index) => {
        // 내가 선택한 중분류랑 조회된 중분류 코드 같은 경우
        if (item.wrkNmCd === allParam.wrkNmCd) {
          // 위험요인 조회
          selectFetchWrkCatList(item, index);
        }
      });

      // 작업명이 널인 경우
    } else {
      selectFetchWrkCatList(wrkCateList.value[0], 0);
    }
  } else {
    selectFetchWrkCatList(wrkCateList.value[0], 0);
  }
}

// 작업명 클릭 시 위험요인 분류 검색
async function selectFetchWrkCatList(wrkItem, index) {
  // 위험요인, 감소대책 체크박스 해지
  chkReset();

  selectedWrkCatRowIndex.value = index === undefined ? 0 : index;

  if (wrkItem.lgCatCd === undefined) {
    wrkItem.lgCatCd = emitDtl.lgCatCd;
    wrkItem.lgCatNm = emitDtl.lgCatNm;
    wrkItem.mdCatCd = emitDtl.mdCatCd;
    wrkItem.mdCatNm = emitDtl.mdCatNm;
  }

  emitDtl.wrkNmCd = wrkItem.wrkNmCd;
  emitDtl.wrkNm = wrkItem.wrkNm;

  // 위험요인/감소대책 데이터 세팅
  await setRskFctrList(wrkItem, index);

  document
    .getElementById("wrkTbody")
    .children[selectedWrkCatRowIndex.value].focus();
}

const setRskFctrList = async (wrkItem, index) => {
  const fctrList = await store.fetchRskFctrList(wrkItem, index);
  const msrList = await store.fetchRskMsrList(wrkItem, index);

  if (fctrList.length > 0) {
    fctrList.unshift({});
    fctrList[0].rskFctrSeq = 0;
    fctrList[0].rskFctr = "직접입력";
  }

  if (msrList.length > 0) {
    msrList.unshift({});
    msrList[0].rskFctrSeq = 0;
    msrList[0].rskMsrSeq = 1;
    msrList[0].rskMsr = "직접입력";
  }

  msrList.forEach((item) => {
    item.isSelected = false;
  });

  // 위험요인 하위 목록에 감소대책 설정
  fctrList.forEach((item) => {
    item.isSelected = false;
    item.msrCateList = msrList.filter((el) => {
      return item.rskFctrSeq === el.rskFctrSeq;
    });
  });

  rskCateList.value = fctrList;
};

// 위험요인 클릭 이벤트
const selectRskCateList = (item, index) => {
  let list = rskCateList.value[index].msrCateList;

  // 위험요인 변경 시 감소대책 설정
  list.forEach((itemMsr) => {
    itemMsr.isSelected = item.isSelected;
  });
};

// 감소대책 클릭 이벤트
const selectMsrCateList = (item, index) => {
  let list = rskCateList.value[index].msrCateList;
  let isSelected = list.some((itemMsr) => {
    return itemMsr.isSelected;
  });

  // 감소대책 선택된 항목 있으면 위험요인 설정
  rskCateList.value[index].isSelected = isSelected;
};

// 위험요인, 감소대책 전체 체크 박스 해지
function chkReset() {
  rskCateList.value.forEach((item) => {
    item.isSelected = false;

    item.msrCateList.forEach((itemMsr) => {
      itemMsr.isSelected = false;
    });
  });
}

const onClickSearchedData = (selected) => {
  lgCateList.value.find((item, index) => {
    if (item.lgCatCd === selected.lgCatCd) {
      // 대분류 클릭 시 중분류 조회
      if (selected.mdCatCd === "") {
        //undefined 주면 자동 검색 됨
        selectFetchLgCatList(item, index, undefined);
      } else {
        selectFetchLgCatList(item, index, selected);
      }
    }
  });
};

// AI 위험성평가
const isPopAiRiskEval = ref(false);
const isChangeCate = ref(false); // 공종 변경 여부 (변경 후 오픈 시 메시지 바로 전송)
const aiParams = ref({});

const openPopAiRiskEval = () => {
  if (!emitDtl.lgCatCd || !emitDtl.mdCatCd || !emitDtl.wrkNmCd) {
    dialogStore.openAlertDialog("표준공종의 분류와 작업명을 선택하세요.");
    return false;
  }
  aiParams.value = {
    aiMessage: getAiMessage(),
    isSendMessage: false, // isChangeCate.value,
  };
  isPopAiRiskEval.value = true;
};

const getAiRecList = (aiRecList) => {
  let fctrList = [];
  let rskFctrSeq = rskCateList.value.length;

  aiRecList.forEach((item, index) => {
    // 중복된 위험요인 있는지 확인하여 위험요인 추가가
    const fctrItem = fctrList.filter(
      (fctrItem) => item.rskFctr === fctrItem.rskFctr
    );

    if (fctrItem.length < 1) {
      fctrList.push({
        rskFctrSeq: rskFctrSeq,
        rskFctr: item.rskFctr,
        isSelected: true,
        isAiRecomond: true,
      });

      rskFctrSeq++;
    }
  });

  // 감소대책 추가
  fctrList.forEach((item, index) => {
    let msrList = [];

    aiRecList.forEach((rskItem, rskIndex) => {
      if (rskItem.rskFctr === item.rskFctr) {
        msrList.push({
          rskFctrSeq: item.rskFctrSeq,
          rskMsrSeq: msrList.length + 1,
          rskMsr: rskItem.rskMsr,
          isSelected: true,
        });
      }
    });
    item.msrCateList = msrList;
  });

  console.log(fctrList);

  // 첫 번째 요소
  const firstPart = rskCateList.value.slice(0, 1);
  // 두 번째 요소부터 끝까지
  const secondPart = rskCateList.value.slice(1);

  // 새로운 배열 생성
  rskCateList.value = [...firstPart, ...fctrList, ...secondPart];

  // rskCateList.value = [...rskCateList.value, ...fctrList];

  closePopAiRiskEval();
};

const closePopAiRiskEval = (params) => {
  isChangeCate.value = false;
  isPopAiRiskEval.value = false;
};

// AI 메세지 생성
const getAiMessage = () => {
  // 순번 제거한 분류명/공종명 조회
  const lgCateMsg = cUtil.removeNumbering(emitDtl.lgCatNm);
  const mdCatMsg = cUtil.removeNumbering(emitDtl.mdCatNm);
  const wrkMsg = cUtil.removeNumbering(emitDtl.wrkNm);

  // 산업구분코드
  const indstClsCd = $loginStore.$state.vendrInfo.indstClsCd;
  const indstNm = indstClsCd === "T2401" ? "건설" : "제조";
  const aiMessage = `${indstNm}현장에서 [${lgCateMsg}/${mdCatMsg}/${wrkMsg}] 공종의 위험요인과 감소대책을 추천해줘`;

  return aiMessage;
};

watch(
  emitDtl,
  (newValue, oldValue) => {
    // 공종 변경
    if (newValue.wrkNmCd || oldValue.wrkNmCd !== newValue.wrkNmCd) {
      isChangeCate.value = true;
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  initData();
});
</script>

<style scoped>
.popup.add_factor_standard {
  width: 1400px;
  height: 80%;
}

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
