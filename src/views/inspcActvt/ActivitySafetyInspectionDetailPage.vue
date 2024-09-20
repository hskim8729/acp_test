<!-- 안전점검활동/합동안전점검 -->

<template>
  <div class="page_title_area">
    <div class="title">합동 안전점검</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 안전점검활동 > 합동
      안전점검
    </nav>
    <div class="top_btn_area">
      <comp-button
        type="save"
        text="저장"
        requiredAuth
        v-if="dtlParams.view !== 'V' && isShownBtn1"
        @click="onClickSave(dtlParams, evalAttend.value, true)"></comp-button>
      <router-link to="/INSPC_ACTVT/ActivitySafetyInspectionPage">
        <comp-button type="list" text="목록"></comp-button>
      </router-link>
    </div>
  </div>
  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">회의 정보</span>
      <div class="right_btn">
        <comp-button type="print" text="출력" @click="reportView"></comp-button>
      </div>
    </div>
    <!-- Service Input Data -->
    <div class="content_box">
      <div class="item_wrap w20p">
        <span class="title">회의명</span>
        <input type="text" v-model="dtlParams.mtNm" :readonly="isEditMode" />
      </div>
      <div class="item_wrap w25p">
        <span class="title">회의일시</span>
        <input
          type="date"
          v-model="dtlParams.mtTmYymmdd"
          class="mr5"
          :readonly="isEditMode" />
        <input
          type="time"
          v-model="dtlParams.mtTmHhmmss"
          class="mr5"
          :readonly="isEditMode" />
      </div>
      <div class="item_wrap w30p">
        <span class="title">회의장소</span>
        <input type="text" v-model="dtlParams.plac" :readonly="isEditMode" />
      </div>
    </div>
    <div class="subtitle_area">
      <span class="title">결재자</span>
      <!-- 결재의견 팝업 -->
      <pop-appr-opnn
        :apprUserList="apprUserList"
        :crntApprOver="crntApprOver"
        :apprBtnNm="apprBtnNm"
        :key="apprUserList"
        @apprOpnn="saveApprMst"
        @validCheck="validCheck"
        ref="apprOpnn"
        v-if="dtlParams.view !== 'V' && isShownBtn4"></pop-appr-opnn>
    </div>
    <div class="content_box">
      <apprLine
        :apprUserParams="apprUserParams"
        :key="apprUserParams"
        @apprUserList="getApprUserList"
        @crntApprOver="getCrntApprOver"
        ref="apprLineRef"
        v-if="apprUserParams != null"></apprLine>
    </div>

    <div class="subtitle_area">
      <span class="title">안전점검 상세내역</span>
      <div class="right_btn">
        <comp-button
          text="표준추가"
          requiredAuth
          v-if="dtlParams.view !== 'V' && isShownBtn3"
          @click="addFactorStandard"></comp-button>
      </div>
    </div>
    <div class="grid_default2" id="grid01">
      <ag-grid-vue
        style="width: 100%"
        class="ag-theme-alpine"
        :domLayout="domLayout"
        :headerHeight="35"
        :rowHeight="53"
        :columnDefs="columnDefs2"
        :rowData="gridRowData"
        :defaultColDef="defaultColDef"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        @grid-ready="onGridReady"
        :onCellValueChanged="cellValueChanged"
        :stopEditingWhenCellsLoseFocus="true"
        :singleClickEdit="true">
      </ag-grid-vue>
    </div>

    <div class="subtitle_area">
      <span class="title">안전점검 결과 논의 공유 및 이행상황 점검내역</span>
    </div>
    <div class="content_box">
      <textarea
        placeholder="예시) 8층 철근 조립 시 개선 조치 사항 5건 중 3건 이행 완료. 2건 이행 지연 (차주 확인)
갱폼 인양 시 안전조치 사항 7건 일일점검 실시 (10/1 ~ 10/5) -> 개선완료 확인 (10/6)"
        v-model="dtlParams.rvwOpnn"
        :readonly="isEditMode"
        @change="isModified = true"></textarea>
    </div>

    <div class="subtitle_area">
      <span class="title">회의 참석자</span>
      <div class="right_btn">
        <comp-button
          text="추가"
          requiredAuth
          v-if="dtlParams.view !== 'V' && isShownBtn1"
          @click="addAttend">
        </comp-button>
      </div>
    </div>

    <div class="content_box">
      <div class="user_list">
        <ul>
          <li v-for="(item, index) in evalAttend.value" :key="item">
            <div class="sign">
              <img src="@/assets/img/user_list_icon_violet.png" />
            </div>
            <div class="roll">{{ item.authNm }}</div>
            <div class="name">{{ item.userNm }}{{ item.workNm }}</div>
            <button
              class="del"
              v-if="dtlParams.view !== 'V' && isShownBtn6"
              @click="removeUserInfo(item, index)"></button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 조치 상세 팝업 -->
  <div class="popup inpection_appr">
    <div class="popup_title">
      <span>조치 상세내역</span>
      <button
        class="popup_close"
        @click="popupClose('inpection_appr')"></button>
    </div>
    <div class="popup_content">
      <popSafetyInspection
        :rowParams="rowParams"
        :key="rowParams"></popSafetyInspection>
    </div>
    <div class="popup_button">
      <button @click="popupClose('inpection_appr')">닫기</button>
    </div>
  </div>

  <!-- 표준추가 팝업 -->
  <popSafetyFactorStandard
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    v-show="isPopFactorStandard"
    @close="closePopFactorStandard">
  </popSafetyFactorStandard>

  <!-- 참석자 등록 팝업 -->
  <popConferenceUser
    :userParams="userParams"
    @selectedUser="getConUserInfo"></popConferenceUser>

  <!-- 평가담당자 팝업 -->
  <pop-search-user
    :is-popup-bg="true"
    :userParams="apprUserParams"
    @selectedUser="getUserInfo"
    v-show="isPopSearchUser"
    @close="closePopSearchUser"></pop-search-user>
</template>
<script>
import popConferenceUser from "@/views/inspcActvt/popup/popConferenceUser.vue";
import popSearchUser from "@/views/inspcActvt/popup/popSearchUser.vue";
import popSafetyFactorStandard from "@/views/inspcActvt/popupRefact/popSafetyFactorStandard.vue";
import popSafetyInspection from "./popup/popSafetyInspection.vue";

export default {
  name: "ActivitySafetyInspectionDetail",
  components: {
    popSafetyFactorStandard: popSafetyFactorStandard,
    popConferenceUser: popConferenceUser,
  },
  methods: {
    addAttend() {
      // 참석자 추가
      // document.getElementsByClassName("popup_bg2")[0].classList.add("show");
      document.getElementsByClassName("select_user")[0].classList.add("show");
    },
    popupClose() {
      document.getElementsByClassName("popup_bg")[0].classList.add("show");
      document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
      document.getElementsByClassName("search_user")[0].classList.add("show");
    },
  },
};
</script>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import dayjs from "dayjs";
import {
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
} from "vue";
import { useRouter } from "vue-router";

import apprLine from "@/views/common/apprLine.vue";
import popApprOpnn from "@/views/common/popApprOpnn.vue";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import loginAuthService from "@/api/common/login-auth-service";
import activitySafetyInspectionService from "@/api/services/inspcActvt/activity-safety-inspection-service";
import { useApprStore } from "@/stores/common/appr-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { myInfoStore } from "@/stores/common/myinfo-store";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";

const dialogStore = useDialogStore();
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useActivitySafetyIspStore();
const riskStore = useComRiskFactorStandardStore();
const apprStore = useApprStore();
const cdMgmtStore = useCdMgmtStore();
const userInfoStore = myInfoStore();

const router = useRouter();
const rowParams = ref({});

const localeText = { noRowsToShow: "조회 결과가 없습니다." };
let evalAttend = reactive([]); // 회의 참석자리스트
let initEvalAttend = reactive([]); // 회의 참석자리스트
let contyCdList = ref([]); // 추가한 공종리스트
let dtlParams = reactive({});
let gridApi;
let gridRowData = ref([]);
// let gridColumnApi = ref();
let listData = reactive([]);
let evalData = reactive([]);

let domLayout = ref(null);
let Params = ref();
let mode;
let userParams = ref();
let isEditMode = ref(false);

//상중하법 데이터
const riskLvlList = ref(JSON.parse(history.state.riskLvlList));
const siteExeRuleStd = ref(JSON.parse(history.state.siteExeRuleStd));
const riskData = ref([]); // 안전점검 상세내역
const MstriskData = ref([]); // 안전점검 mst 저장내역

const crntApprOver = ref([]);
const apprOpnn = ref();
const apprUserParams = ref(null);
const apprUserList = ref([]);
const apprBtnNm = ref("상신");
const reportUrl = import.meta.env.VITE_APP_REPORT_DEV_URL;
const fileDiv = import.meta.env.VITE_APP_ENV_FILE_NAME;
const isShownBtn1 = ref(false); // 저장버튼
const isShownBtn2 = ref(false); // 수정버튼
const isShownBtn3 = ref(false); // 표준추가버튼
const isShownBtn4 = ref(false); // 결재버튼
const isShownBtn5 = ref(false); // gird 담당자 조회 버튼
const isShownBtn6 = ref(false); // 참석자 삭제 버튼

const isModified = ref(false); // 수정 여부

// 회의 참석자 emit 데이터
const getConUserInfo = (params) => {
  params.filter((item) => {
    item.mode = "I";
  });
  let Sflag = "Y";
  const filterData = evalAttend.value;

  if (filterData.length === 0) {
    evalAttend.value.push(...params);
  } else {
    filterData.forEach((item) => {
      for (var i = 0; i < params.length; i++) {
        if (item.userId === params[i].userId) {
          Sflag = "N";
        }
      }
    });
    if (Sflag === "Y") {
      evalAttend.value.push(...params);
    } else {
      dialogStore.openAlertDialog("이미 추가된 참석자가 있습니다.");
      return;
    }
  }
};

const getUserInfo = (params) => {
  const cell = gridApi.getFocusedCell();
  const row = gridApi.getDisplayedRowAtIndex(cell.rowIndex);

  row.data.actMngr = params.userId;
  row.data.actMngrNm = params.userNm;

  gridApi.applyTransaction({
    update: [row.data],
  });
};

async function validCheck({ resolve }) {
  const newUserIdArray = evalAttend.value
    .map((item) => item.userId)
    .filter((userId) => !initEvalAttend.includes(userId));

  // 새로 추가된 참석자가 있는지 체크
  if (newUserIdArray.length > 0) {
    isModified.value = true;
    console.log(newUserIdArray);
  }

  // 상신 전 단계에서 수정된 내용이 있으면 저장
  if (isModified.value && apprUserList.value[0].statsCd !== "T1001") {
    await onClickSave(dtlParams, evalAttend.value, false);
  }

  resolve(true); // 결재의견 open
}

// 저장버튼 클릭 시
async function onClickSave(evalParam, attParam, msgYn) {
  // 회의 정보 유효성 검사 통과 못하면 종료
  if (!(await isEvalEmpty(evalParam))) return;
  // grid에 빈값 있는 경우 종료
  if (!(await gridCheck())) return;

  if (msgYn) {
    dialogStore.openConfirmDialog("저장하시겠습니까?", {
      confirmCallback: async () => {
        await insertMeeting(evalParam, attParam, riskData.value);
      },
    });
  } else {
    await insertMeeting(evalParam, attParam.value, riskData.value);
  }
}

// grid 내용 유효성 검사
async function gridCheck() {
  // let targetIdx = 0;
  try {
    gridApi.forEachNode((item, index) => {
      // 돌면서 riskData에 값 넣음
      riskData.value[index] = item.data;

      // 공종명 체크
      if (!item.data.contyCd) {
        throw {
          field: "contyCd",
          message: "공종명을 선택해 주세요.",
        };
      }

      // 위험요인 체크
      if (!item.data.rskFctr) {
        throw {
          field: "rskFctr",
          message: "위험요인을 입력해 주세요.",
        };
      }

      // 빈도강도결과 체크
      if (siteExeRuleStd.value.riskLvlJdgmntCd !== "T0501") {
        // 빈도 체크
        if (!item.data.freq) {
          throw {
            field: "freq",
            message: "빈도를 선택해 주세요.",
          };
        }

        // 강도 체크
        if (!item.data.strngth) {
          throw {
            field: "strngth",
            message: "강도를 선택해 주세요.",
          };
        }
      } else {
        // 결과 체크
        if (!item.data.rst) {
          throw {
            field: "rst",
            message: "결과를 선택해 주세요.",
          };
        }
      }

      // 감소대책 체크
      if (!item.data.rskMsr) {
        throw {
          field: "rskMsr",
          message: "감소대책을 입력해 주세요.",
        };
      }

      // 재해형태 체크
      if (!item.data.dsstrStleCd) {
        throw {
          field: "dsstrStleCd",
          message: "재해형태를 선택해 주세요.",
        };
      }
    });
  } catch (error) {
    // if (error.field) {
    //   gridApi.value.setFocusedCell(targetIdx, error.field, null);
    // }
    dialogStore.openAlertDialog(error.message);
    return false;
  }

  return true;
}

//회의 정보 유효성 검사
async function isEvalEmpty(evalParam) {
  try {
    // 회의명 체크
    if (!evalParam.mtNm) {
      throw {
        message: "회의명을 작성해주시기 바랍니다.",
      };
    }

    if (!evalParam.mtTmYymmdd || !evalParam.mtTmHhmmss) {
      throw {
        message: "회의일시를 모두 작성해주시기 바랍니다.",
      };
    }

    if (!evalParam.plac) {
      throw {
        message: "회의장소를 작성해주시기 바랍니다.",
      };
    }

    if (
      $loginStore.$state.siteInfo.jbttlCd === "T0102" &&
      apprUserList.value.length < 2
    ) {
      throw {
        message: "현장소장이 없으면 저장이 불가능합니다.",
      };
    }
  } catch (error) {
    dialogStore.openAlertDialog(error.message);
    return false;
  }

  return true;
}

const insertMeeting = async (evalParam, attParam, riskData) => {
  let Iflag = "Y";
  try {
    document.getElementsByClassName("loading_wrap")[0].classList.add("show");

    evalParam.mtTm = evalParam.mtTmYymmdd
      .replaceAll("-", "")
      .concat(evalParam.mtTmHhmmss.replaceAll(":", ""));

    evalData = store.$state.searchList;
    //상세내역 값이있으면 Transaction 처리
    riskData.filter((item) => {
      if (item.contyCd === undefined || item.contyCd === null) {
        Iflag = "N";
      }
      item.userId = $loginStore.$state.userInfo.userId;
      item.userNm = $loginStore.$state.userInfo.userNm;
      item.vendrCd = $loginStore.$state.siteInfo.vendrCd;
      item.siteCd = $loginStore.$state.siteInfo.siteCd;
      if (item.actExptDt !== undefined && item.actExptDt !== null) {
        item.actExptDt = item.actExptDt.replaceAll("-", "");
      } else {
        item.actExptDt = null;
      }
      item.evalSeq = evalData.evalSeq;
    });

    if (Iflag === "Y") {
      // 회의 Add
      await activitySafetyInspectionService.activitySafetyIspTransaction(
        evalParam
      );

      await activitySafetyInspectionService.activitySafetyIspDtlTransaction(
        riskData
      );

      attParam.filter((item, index) => {
        item.inspSeq = index + 1;
        if (evalParam.mode === "I") {
          item.evalSeq = evalData.evalSeq + 1;
        } else {
          item.evalSeq = evalData.evalSeq;
        }
      });

      //참석자 값이있으면 Transaction 처리
      if (attParam.length !== 0) {
        // 참석자 Add
        await activitySafetyInspectionService.attendsTransaction(attParam);
      }
      dialogStore.openToastDialog("저장이 완료되었습니다.");

      if (evalParam.mode === "U") {
        if (!isModified.value) {
          await initTM();
        }
        isModified.value = false;
      } else {
        await goBack();
      }
    }
    // else {
    //   dialogStore.openAlertDialog("공종명은 필수선택입니다.");
    // }
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");

    return true;
  } catch (e) {
    return false;
  }
};

const saveApprMst = async (opnnData) => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  // dataList : 이미 결재한 사람은 제외한 list (가공 데이터)
  const dataList = apprUserList.value;

  const filteredData = dataList.filter(
    (item) =>
      !item.statsCd ||
      item.statsCd === "" ||
      item.statsCd === "T1004" ||
      item.statsCd === "T1005"
  );

  // 결재한 사람
  const filteredData2 = dataList.filter(
    (item) =>
      // 기안
      item.statsCd === "T1001" ||
      // 검토
      item.statsCd === "T1002"
  );

  // 결재한 사람중 마지막 순서
  const fileLastSeq = filteredData2.length;

  // 전체 결재라인의 마지막 순서
  const endSeq = apprUserList.value.length;

  if (!filteredData.length) {
    dialogStore.openAlertDialog("이미 승인이 완료되었습니다.");
  } else {
    // 결재 안한 사람중
    filteredData.forEach((item, index) => {
      // 마지막 사람
      if (index === 0) {
        if (opnnData.apprGbn === "appr") {
          // 상신(T1001), 검토(T1002), 승인(T1003)일 때
          if (item.apprSeq === 1) {
            item.statsCd = "T1001";
            item.tmplCd = "009";
          } else if (item.apprSeq === endSeq) {
            item.statsCd = "T1003";
            item.tmplCd = "010";
          }
        } else if (opnnData.apprGbn === "rej") {
          // 반려(T1004)일 때
          item.statsCd = "T1004";
          item.tmplCd = "011";
        }
      } else {
        item.statsCd = "";
      }
    });

    //결재안한사람 중 첫번째 (apprInfo에 들어갈 데이터)
    const firstApprUser = filteredData[0];

    const apprInfo = {
      vendrCd: dtlParams.vendrCd,
      siteCd: dtlParams.siteCd,
      apprKey: dtlParams.mtApprKey,
      apprNm: `합동안전점검 주간회의 결재_${dtlParams.evalType}_${dtlParams.evalSeq}`,
      statsCd: firstApprUser.statsCd,
      userId: firstApprUser.userId,
    };

    const arrpDtlList = filteredData.map((apprUser, index) => ({
      vendrCd: dtlParams.vendrCd,
      siteCd: dtlParams.siteCd,
      apprSeq: apprUser.apprSeq,
      apprKey: dtlParams.mtApprKey,
      userId: apprUser.userId,
      statsCd: apprUser.statsCd,
      apprOpnn: index === 0 ? opnnData.apprOpnn : "",
      Dflag: "Y",
    }));

    const params = {
      apprInfo,
      arrpDtlList,
    };

    //반려일때
    if (opnnData.apprGbn === "rej") {
      await store.deleteSafeIspEvalApprovalDtl(params);
    }
    await apprStore.fetchCreateApprMst(params);

    const param = {
      vendrCd: dtlParams.vendrCd,
      siteCd: dtlParams.siteCd,
      evalType: dtlParams.evalType,
      evalSeq: dtlParams.evalSeq,
      userId: $loginStore.$state.userInfo.userId,
    };

    const pushAlertParam = {
      vendrCd: firstApprUser.vendrCd,
      siteCd: firstApprUser.siteCd,
      userId: firstApprUser.userId,
      receiverId:
        firstApprUser.apprSeq === endSeq
          ? dataList[0].userId
          : dataList[1].userId, // 결재라인 다음 결재자
      tmplCd: firstApprUser.tmplCd,
      tmpParam: $loginStore.$state.siteInfo.siteNm,
    };

    // 현장 소장인 경우 위험성평가 마스터 저장

    if (crntApprOver.value) {
      // 반려인 경우는 저장하지 않아야 한다.
      if (opnnData.apprGbn !== "rej") {
        gridApi.forEachNode((item, index) => {
          MstriskData.value[index] = item.data;
        });
        evalData = store.$state.searchList;
        let totalRowCount = gridApi.getDisplayedRowCount();
        let RowCount = 0;
        //상세내역 값이있으면 Transaction 처리
        MstriskData.value.filter((item) => {
          item.userId = $loginStore.$state.userInfo.userId;
          item.userNm = $loginStore.$state.userInfo.userNm;
          if (item.actExptDt !== undefined && item.actExptDt !== null) {
            item.actExptDt = item.actExptDt.replaceAll("-", "");
          } else {
            item.actExptDt = null;
          }
          item.rvw_opnn = dtlParams.rvw_opnn;
          item.evalSeq = evalData.evalSeq;
          if (item.evalTblMstSeq === 0) {
            RowCount++;
          }
        });

        MstriskData.value.filter((item) => {
          if (item.evalTblMstSeq === 0) {
            item.evalTblMstSeq = ++totalRowCount - RowCount;
          }
        });

        await store.fetchCreateActSafeIsp(MstriskData.value);
        // 현장 소장의 경우 평가 회의 기본 정보 상태값 완료(T0903)으로 수정
        await store.actSafeIspEvalApproval({ ...param, stats: "T0903" });
        dialogStore.openToastDialog("결재되었습니다.");
        apprPushAlert(pushAlertParam);
        await initTM();
      } else {
        // 반려의 경우 기본 정보 상태값 진행(T0901)으로 수정
        await store.actSafeIspEvalApproval({ ...param, stats: "T0901" });
        dialogStore.openToastDialog("반려되었습니다.");
        apprPushAlert(pushAlertParam);
        await initTM();
      }
    } else {
      // 안전 관리자의 경우 평가 회의 기본 정보 상태값 상신(T0902)으로 수정
      await store.actSafeIspEvalApproval({ ...param, stats: "T0902" });
      dialogStore.openToastDialog("상신되었습니다.");
      apprPushAlert(pushAlertParam);
      await initTM();
    }

    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
  }
};

const lastApprUser = ref({}); // 마지막 결재자
const firstApprUser = ref({}); // 첫번째 결재자
const getApprUserList = (list) => {
  apprUserList.value = list;

  const lastApprUserIdx = apprUserList.value.length - 1;
  lastApprUser.value = { ...apprUserList.value[lastApprUserIdx] };
  firstApprUser.value = { ...apprUserList.value[0] };
};

const getCrntApprOver = (value) => {
  crntApprOver.value = value;

  if (value && value.userId === $loginStore.$state.userInfo.userId) {
    isShownBtn4.value = true;
    if (value.apprSeq == lastApprUser.value.apprSeq) {
      apprBtnNm.value = "승인";
    } else {
      dtlParams.appryn = "Y";
      if (value.apprSeq > firstApprUser.value.apprSeq) {
        apprBtnNm.value = "검토";
      }
    }
  } else {
    apprBtnNm.value = "상신";
  }
};

// 결재자 삭제
const removeUserInfo = async (attend, index) => {
  attend.mode = "D";
  attend.useYn = "N";
  await activitySafetyInspectionService.attendsTransaction([attend]);
  evalAttend.value.splice(index, 1);
  isModified.value = true;
};

// 뒤로 가기 함수
async function goBack() {
  router.push({ name: "AactivitySafetyInspection" });
}

//그리드 준비완료 이벤트
function onGridReady(params) {
  gridApi = params.api;
  params.api.sizeColumnsToFit();
}

function extractKeys(mappings) {
  return Object.keys(mappings);
}

function lookupValue(mappings, key) {
  return mappings[key];
}

function cellValueChanged(e) {
  const changedCellId = e.colDef.field;

  if (["freq", "strngth"].includes(changedCellId)) {
    // 안전하게 숫자로 변환 가능한지 확인
    const freq = parseFloat(e.node.data.freq);
    const strngth = parseFloat(e.node.data.strngth);

    // 둘 다 유효한 숫자인 경우에만 계산 및 업데이트 수행
    if (!isNaN(freq) && !isNaN(strngth)) {
      // 빈도 + 강도의 합계
      const sum = freq * strngth;
      let riskPrsmpGrd = "-";

      const foundRiskLvl = riskLvlList.value.find((item) => {
        return item.riskPrsmpFqinSt <= sum && sum <= item.riskPrsmpFqinEn;
      });

      if (foundRiskLvl) {
        riskPrsmpGrd = foundRiskLvl.risk;
      }

      e.node.data.rst = sum;
      e.node.data.riskPrsmpGrd = riskPrsmpGrd;
    }
  }

  // 상중하법인 경우 위험등급 변경
  if (["rst"].includes(changedCellId)) {
    const foundRiskLvl = riskLvlList.value.find((item) => {
      return parseInt(item.riskDcsCls) === e.node.data.rst;
    });

    e.node.data.riskPrsmpGrd = foundRiskLvl.risk;
  }

  // 그리드 업데이트
  gridApi.applyTransaction({
    update: [e.node.data],
  });

  // 편집상태면서 조회된 데이터 수정일 경우 상태 변경
  if (store.$state.searchList.mode === "U" && e.node.data.mode !== "I") {
    e.node.data.mode = "U";
  }

  isModified.value = true; // 수정여부
}

// 그리드 api 변경 시 실제 데이터 셋팅
const setGridRowData = () => {
  const rowData = [];
  gridApi.forEachNode((node) => rowData.push(node.data));
  gridRowData.value = rowData;
};

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 1,
  minWidth: 500,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const columnDefs2 = [
  {
    headerName: "공종",
    field: "contyCd",
    filter: true,
    cellStyle: { textAlign: "left" },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    maxWidth: 120,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      return {
        values: extractKeys(contyCdList.value),
        valueListMaxHeight: 150,
      };
    },
    valueFormatter: (params) => {
      return lookupValue(contyCdList.value, params.value);
    },
  },
  {
    headerName: "작업명",
    field: "wrkNm",
    filter: false,
    cellStyle: { textAlign: "left" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 200,
    maxWidth: 300,
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    filter: false,
    cellStyle: { textAlign: "left" },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 300,
    maxWidth: 600,
    cellEditorParams: {
      maxLength: 600,
    },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      if (params.value) {
        eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");
      }
      return eDiv;
    },
  },
  {
    headerName: "위험성결정",
    field: "",
    children: [],
  },
  {
    headerName: "위험등급",
    field: "riskPrsmpGrd",
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 110,
    maxWidth: 110,
  },
  {
    headerName: "재해형태",
    field: "dsstrStleCd",
    cellStyle: { textAlign: "center" },
    maxWidth: 130,
    wrapText: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      return { values: extractKeys(dsstrStleCds), valueListMaxWidth: 130 };
    },
    valueFormatter: (params) => {
      return lookupValue(dsstrStleCds, params.value);
    },
    editable: (params) => chkEditable(params),
  },
  {
    headerName: "감소대책",
    field: "rskMsr",
    filter: false,
    cellStyle: { textAlign: "left" },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 500,
    maxWidth: 600,
    cellEditorParams: {
      maxLength: 4000,
    },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        params.value !== null && params.value !== undefined
          ? params.value.replaceAll("\n", "<br/>")
          : "";
      return eDiv;
    },
  },
  {
    headerName: "작업위치",
    field: "wrkLoc",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 150,
    maxWidth: 250,
  },
  {
    headerName: "작업인원",
    field: "psnNum",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 100,
    maxWidth: 175,
  },
  {
    headerName: "위험물",
    field: "hrmrskMtr",
    filter: false,
    cellStyle: { textAlign: "center" },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 150,
    maxWidth: 150,
  },
  {
    headerName: "추가위험구분",
    field: "dscvTypeNm",
    filter: true,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    maxWidth: 160,
    valueFormatter: (params) => {
      return !params.value ? "-" : params.value;
    },
  },
  {
    headerName: "조치예정일",
    field: "actExptDt",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    cellEditor: "agDateStringCellEditor",
    width: 80,
    maxWidth: 160,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        params.value !== null && params.value !== undefined
          ? dayjs(params.value).format("YYYY-MM-DD")
          : "";
      return eDiv;
    },
    cellEditorParams: (params) => {
      const date = params.value
        ? dayjs(params.value).format("YYYY-MM-DD")
        : null;
      return {
        value: date,
        min: "2023-01-01",
      };
    },
  },
  {
    headerName: "조치담당자",
    field: "actMngr",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false, //(params) => chkEditable(params),
    width: 80,
    maxWidth: 180,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      const actMngrNm = !params.data.actMngrNm ? "" : params.data.actMngrNm;

      if (!params.data.childrenYn && dtlParams.view !== "V" && isShownBtn5) {
        eDiv.innerHTML = `
          <span>${actMngrNm}</span>
          <button class="search_btn" style="float: right;"></button>
        `;

        const eButton = eDiv.querySelectorAll(".search_btn")[0];

        eButton.onclick = function () {
          openPopSearchUser();
        };
      } else {
        eDiv.innerHTML = `<span>${actMngrNm}</span>`;
      }

      return eDiv;
    },
  },
  {
    headerName: "조치여부",
    field: "actYn",
    valueGetter: function (params) {
      return params.data.actYn === "Y" ? "조치완료" : "미조치";
    },
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 100,
    maxWidth: 100,
  },
  {
    headerName: "조치일",
    field: "actDt",
    filter: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        params.value !== null && params.value !== undefined
          ? dayjs(params.value).format("YYYY-MM-DD")
          : "";
      return eDiv;
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    maxWidth: 130,
  },
  {
    headerName: "완료일",
    field: "actComptDt",
    filter: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML =
        params.value !== null && params.value !== undefined
          ? dayjs(params.value).format("YYYY-MM-DD")
          : "";
      return eDiv;
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    maxWidth: 130,
  },
  {
    headerName: "조치내역",
    field: "action",
    filter: false,
    cellStyle: { textAlign: "center" },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="cell_btn">상세보기</button>';
      const eButton = eDiv.querySelectorAll(".cell_btn")[0];

      eButton.onclick = function () {
        inspectionAction(params.data);
      };

      if (params.data.actDt !== null && params.data.actDt !== undefined) {
        return eDiv;
      }
    },
  },
  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
    cellRenderer: (params) => {
      if (dtlParams.view !== "V") {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="del"></button>';
        const eButton = eDiv.querySelectorAll(".del")[0];
        eButton.onclick = function () {
          dialogStore.openConfirmDialog("삭제하시겠습니까?", {
            confirmCallback: async () => {
              if (dtlParams.mode === "I") {
                removeRow(params);
              } else {
                updateRemoveRow(params);
              }
            },
          });
        };
        return eDiv;
      }
    },
  },
  {
    headerName: "수정체크",
    field: "isEditable",
    hide: true,
  },
  {
    headerName: "위험성평가 방법 코드",
    field: "riskEvalMthdCd",
    hide: true,
  },
  {
    headerName: "위험성 수준 판단법 코드",
    field: "riskLvlJdgmntCd",
    hide: true,
  },
  {
    headerName: "마스터 평가 순번",
    field: "evalTblMstSeq",
    hide: true,
  },
];

// 위험성 수준 판단법에 따른 위험성결정 컬럼 제어
// ( T0501(상중하법), T0502(빈도강도(3X3)), T0503(빈도강도법(5X5)) )
if (siteExeRuleStd.value.riskLvlJdgmntCd === "T0501") {
  columnDefs2[3].children = [
    {
      headerName: "결과",
      field: "rst",
      cellStyle: { textAlign: "center" },
      wrapText: true,
      autoHeight: true,
      width: 110,
      maxWidth: 110,
      editable: (params) => chkEditable(params),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return {
          values: extractKeys(getRiskEvalCodes(0))
            .map(Number)
            .sort((a, b) => b - a),
        };
      },
      valueFormatter: (params) => {
        return lookupValue(getRiskEvalCodes(0), params.value);
      },
    },
  ];
} else {
  const count = siteExeRuleStd.value.riskLvlJdgmntCd === "T0502" ? 3 : 5;
  columnDefs2[3].children = [
    {
      headerName: "빈도",
      field: "freq",
      cellStyle: { textAlign: "center" },
      wrapText: true,
      autoHeight: true,
      cellEditor: "agSelectCellEditor",
      editable: (params) => chkEditable(params),
      width: 110,
      maxWidth: 110,
      cellEditorParams: (params) => {
        return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
      },
      valueFormatter: (params) => {
        return lookupValue(getRiskEvalCodes(count), params.value);
      },
    },
    {
      headerName: "강도",
      field: "strngth",
      cellStyle: { textAlign: "center" },
      wrapText: true,
      autoHeight: true,
      editable: (params) => chkEditable(params),
      width: 110,
      maxWidth: 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
      },
      valueFormatter: (params) => {
        return lookupValue(getRiskEvalCodes(count), params.value);
      },
    },
    {
      headerName: "결과",
      field: "rst",
      cellStyle: { textAlign: "center" },
      wrapText: true,
      autoHeight: true,
      editable: false,
      width: 110,
      maxWidth: 110,
    },
  ];
}

const getRiskEvalCodes = (count) => {
  let codes = {};

  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      codes[i] = i;
    }
  } else {
    codes = {
      3: "상",
      2: "중",
      1: "하",
    };
  }

  return codes;
};

// 추가한값인지 MST값인지 확인하여 수정가능 여부확인
// 합동안전점검은 추가, MST값 상관없이 수정 가능 (결재 상신 이후 수정 불가능)
const chkEditable = (params) => {
  return dtlParams.view !== "V" && isShownBtn2.value;
};

// row 삭제
const removeRow = async (params) => {
  const selectedData = [params.data];
  gridApi.applyTransaction({ remove: selectedData });
};
const updateRemoveRow = async (params) => {
  let row;
  const selectedData = [params.data];
  gridApi.applyTransaction({ remove: selectedData });
  params.data.mode = "D";
  row = Array.isArray(params) ? params.data : [params.data];
  dialogStore.openAlertDialog(await store.deleteActivitySafetyIspDetail(row));
  //await initTM();
};

// 선택된 행을 수정하는 함수
const modifySelectedRow = () => {
  const cell = gridApi.getFocusedCell();
  const rowIndex = cell ? cell.rowIndex : null;

  if (rowIndex !== null) {
    const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
    const childrenYn = rowNode.data.childrenYn;
    evalData = store.$state.searchList;
    mode = evalData.mode;
    // childrenYn가 값이 없을경우 수정가능
    if (!childrenYn) {
      if (mode === "U") {
        rowNode.data.mode = "U";
      }
      setIsEditableForRow(rowNode);
    }
  }
};

const setIsEditableForRow = (rowNode) => {
  if (rowNode) {
    rowNode.setDataValue("isEditable", true);
    gridApi.refreshCells({ rowNodes: [rowNode] });
  }
};

async function initTM() {
  setTimeout(() => {
    init();
  }, 200);
}

const apprLineRef = ref(null);
async function init() {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");
  evalData = store.$state.searchList;
  Params.value = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    evalSeq: evalData.evalSeq,
  };
  mode = evalData.mode;
  dtlParams.mode = mode;
  dtlParams.view = evalData.view;

  let list = await activitySafetyInspectionService.searchList(Params.value);
  listData.value = list.data;
  if (dtlParams.view === "V") {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }

  // mode : I(신규), U(수정)
  // stats(조치상태) : T0901(대기), T0902(진행), T0903(완료)
  if (dtlParams.mode === "I") {
    isShownBtn1.value = true;
    isShownBtn2.value = true;
    isShownBtn3.value = true;
    isShownBtn4.value = false;
    isShownBtn5.value = true;
    isShownBtn6.value = true;
  } else if (dtlParams.mode === "U" && listData.value[0].stats === "T0901") {
    isShownBtn1.value = true;
    isShownBtn2.value = true;
    isShownBtn3.value = true;
    isShownBtn5.value = true;
    isShownBtn6.value = true;
    isShownBtn4.value = true;
  } else if (dtlParams.mode === "U" && listData.value[0].stats === "T0902") {
    isShownBtn1.value = false;
    isShownBtn2.value = false;
    isShownBtn3.value = false;
    isShownBtn5.value = false;
    isShownBtn6.value = false;
    if ($loginStore.$state.siteInfo.jbttlCd === "T0101") {
      isShownBtn4.value = true;
    } else if ($loginStore.$state.siteInfo.jbttlCd === "T0102") {
      isShownBtn4.value = false;
    }
  } else if (listData.value[0].stats === "T0903") {
    isShownBtn4.value = false;
  }

  // params 셋팅
  if (mode === "U") {
    // 업데이트 시
    dtlParams.evalSeq = evalData.evalSeq;
    dtlParams.mtApprKey = evalData.mtApprKey;
    dtlParams.evalType = evalData.evalType;
    dtlParams.stats = evalData.stats;
    dtlParams.mtNm = listData.value[0].mtNm;
    dtlParams.plac = listData.value[0].plac;
    dtlParams.corprBzentyCd = evalData.corprBzentyCd;
    dtlParams.rvwOpnn = listData.value[0].rvwOpnn;
    dtlParams.mtTmYymmdd = dayjs(listData.value[0].mtTm.substring(0, 8)).format(
      "YYYY-MM-DD"
    );
    dtlParams.mtTmHhmmss = dayjs(
      listData.value[0].mtTm.substring(8, 12),
      "HHmm"
    ).format("HH:mm");
    // dtlParams.mtTmHhmmss = evalData.mtTm.substring(8, 10) + ":" + evalData.mtTm.substring(10);
    // const roundedTime = dayjs(evalData.mtTm.substring(8, 14)).minute(Math.round(dayjs(evalData.mtTm.substring(8, 14)).minute() / 10) * 10).format('HH:mm:ss');
    // console.log('시간확인 : ',evalData.mtTm.substring(8, 14))
  } else {
    // 초기 생성 시
    dtlParams.mtApprKey = "";
    dtlParams.status = "T0901";
  }

  apprUserParams.value = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    apprKey: dtlParams.mtApprKey,
    userId: $loginStore.$state.userInfo.userId,
    userNm: $loginStore.$state.userInfo.userNm,
    jbttlNm: $loginStore.$state.siteInfo.jbttlNm,
    workNm: $loginStore.$state.userInfo.workNm,
    menuId: "2002000",
    mode: mode,
    isApprAddUser: false, // 결재라인 사용자 추가 불가능
  };

  userParams.value = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    apprKey: "",
    userId: $loginStore.$state.userInfo.userId,
    userNm: $loginStore.$state.userInfo.userNm,
    jbttlNm: $loginStore.$state.siteInfo.jbttlNm,
    workNm: $loginStore.$state.userInfo.workNm,
    evalSeq: evalData.evalSeq,
    menuId: "2002000",
    mode: mode,
  };

  dtlParams.vendrCd = $loginStore.$state.siteInfo.vendrCd;
  dtlParams.siteCd = $loginStore.$state.siteInfo.siteCd;
  dtlParams.userId = $loginStore.$state.userInfo.userId;
  dtlParams.division = "S"; // 전사, 현장 구분 값(A:전사, S:현장)

  // 상세내역 List
  let res = await activitySafetyInspectionService.dtlSearchList(dtlParams);
  gridRowData.value = res.data;
  gridRowData.value.filter((item) => (item.mode = mode));

  // 회의참석자 List
  let attend = await activitySafetyInspectionService.searchAttendList(
    dtlParams
  );
  evalAttend.value = attend.data;
  evalAttend.value.filter((item) => (item.mode = mode));
  //initEvalAttend.push(...JSON.parse(JSON.stringify(evalAttend.value))); // 회의참석자 초기값
  initEvalAttend.push(...evalAttend.value.map((item) => item.userId));

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
}

// 조치 상세내역 팝업 열기
function inspectionAction(params) {
  const getRow = params;
  rowParams.value = getRow;

  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("inpection_appr")[0].classList.add("show");
}

/**
 * 담당자 선택 팝업 호출
 */
const isPopSearchUser = ref(false);
const openPopSearchUser = () => {
  isPopSearchUser.value = true;
};
const closePopSearchUser = () => {
  isPopSearchUser.value = false;
};

// 팝업 닫기
function popupClose(type) {
  if (type === "inpection_appr") {
    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document
      .getElementsByClassName("inpection_appr")[0]
      .classList.remove("show");
  } else {
    document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
    document
      .getElementsByClassName("inpection_reject")[0]
      .classList.remove("show");
  }
}

let dsstrStleCds;
onMounted(async () => {
  const commonParams = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  let conty = await riskStore.fetchContyCdList(commonParams);

  contyCdList.value = conty
    .filter((item) => item.useYn === "Y")
    .reduce((acc, item) => {
      acc[item.contyCd] = item.contyCdNm;
      return acc;
    }, {});
});

onBeforeMount(async () => {
  console.log("parent onBeforeMount");
  // 재해형태코드 불러오기
  const dsstrStleCdList = await cdMgmtStore.fetchComCodeList({ comCd: "T20" });
  dsstrStleCds = {};
  dsstrStleCdList.forEach((item) => {
    dsstrStleCds[item.comCd] = item.comCdNm;
  });

  domLayout.value = "autoHeight";

  //initTM();
  init();
});

// 레포트 출력 함수
const reportView = () => {
  let link = document.createElement("a");
  let url = reportUrl + "/view/report1.jsp?";
  let param =
    "crfName=" +
    "inspcActvt/activitySafetyInspection" +
    "&vendrCd=" +
    dtlParams.vendrCd +
    "&siteCd=" +
    dtlParams.siteCd +
    "&evalSeq=" +
    dtlParams.evalSeq +
    "&fileDiv=" +
    fileDiv;

  link.href = url + param;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

async function apprPushAlert(param) {
  // 알림톡
  try {
    const send1res = await loginAuthService.sendNotificationTalk(param);

    if (send1res.status == 200) {
      console.log("알림톡 정상처리");
    } else {
      dialogStore.openAlertDialog(send1res.data.message);
      return;
    }
  } catch (err) {
    console.log(
      "ActivitySafetyInspectionDetailPage.vue > sendCertNum() > sendNotificationTalk err : ",
      err
    );
    throw err;
  }

  // push알림
  try {
    const send2res = await loginAuthService.sendPush(param);

    if (send2res.status == 200) {
      console.log("push 정상처리");
    } else {
      dialogStore.openAlertDialog(send2res.data.message);
      return;
    }
  } catch (err) {
    console.log(
      "ActivitySafetyInspectionDetailPage.vue >  sendPush err : ",
      err
    );
    throw err;
  }
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
}

// 팝업 이벤트
// 표준추가
const isPopFactorStandard = ref(false);
const addFactorStandard = () => {
  // 표준 추가
  isPopFactorStandard.value = true;
};

const closePopFactorStandard = (param) => {
  isPopFactorStandard.value = false;

  // 선택한 항목 있으면 중복체크 및 데이터 세팅
  if (param) {
    let isDupl = false;

    let Aflag = "Y";
    evalData = store.$state.searchList;
    const filterData = gridRowData.value;

    param.filter((item) => {
      if (mode === "U") {
        item.evalseq = evalData.evalSeq;
      } else {
        item.evalseq = "0";
        item.evalTblSeq = "0";
      }
    });

    let paramList = [];
    let newItems = [
      {
        contyCd: "",
        userId: "",
        userNm: "",
        lgCatCd: "",
        mdCatCd: "",
        wrkNmCd: "",
        lgCatNm: "",
        mdCatNm: "",
        wrkNm: "",
        rskFctr: "",
        rskMsr: "",
        mode: "",
      },
    ];

    param.forEach((e, i) => {
      Aflag = "Y";
      newItems.userId = $loginStore.$state.userInfo.userId;
      newItems.userNm = $loginStore.$state.userInfo.userNm;
      newItems.lgCatCd = e.lgCatCd;
      newItems.mdCatCd = e.mdCatCd;
      newItems.wrkNmCd = e.wrkNmCd;
      newItems.lgCatNm = e.lgCatNm;
      newItems.mdCatNm = e.mdCatNm;
      newItems.wrkNm = e.wrkNm;
      newItems.rskFctr = e.rskFctrSeq > 0 ? e.rskFctr : ""; // 직접입력인 경우 텍스트필드 빈값
      newItems.rskMsr = e.rskFctrSeq > 0 ? e.rskMsr : ""; // 직접입력인 경우 텍스트필드 빈값
      newItems.mode = "I";

      filterData.forEach((item) => {
        if (
          e.rskFctrSeq > 0 &&
          item.lgCatCd === e.lgCatCd &&
          item.mdCatCd === e.mdCatCd &&
          item.wrkNmCd === e.wrkNmCd &&
          item.rskFctr === e.rskFctr
        ) {
          Aflag = "N";
          return;
        }
      });
      if (Aflag === "Y") {
        paramList.push({ ...newItems });
      } else {
        isDupl = true;
      }
    });

    if (paramList.length > 0) {
      gridApi.applyTransaction({
        add: paramList,
      });
      setGridRowData();

      for (var i = 1; i < param.length + 1; i++) {
        const lastRowIndex = gridApi.getDisplayedRowCount() - i;
        const rowNode = gridApi.getDisplayedRowAtIndex(lastRowIndex);
        setIsEditableForRow(rowNode);
      }
    }

    if (isDupl) {
      dialogStore.openAlertDialog(
        "중복된 내역을 제외한 표준이 추가되었습니다."
      );
    }
  }
};
</script>

<style scoped>
.right_approval_list {
  position: static;
}

.content_box,
#grid01 {
  margin-bottom: 30px;
}

.user_list {
  margin: 10px 0px;
}

textarea {
  height: 100px;
}

.popup.search_user {
  width: 800px;
  height: 700px;
}

.appr_wrap {
  margin-bottom: 0px;
}

.inpection_appr {
  width: 60%;
  height: 95%;
}
</style>
