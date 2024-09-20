<template>
  <!-- 회원정보수정(마이플두) 팝업 -->
  <comp-modal modalTitle="내 정보" height="700" maxModalWidth="1400">
    <v-container fluid class="popup_background">
      <v-row>
        <v-col>
          <compPageCard cardHeight="calc(100vh - 220px)">
            <template #subTitle>
              <span class="title">개인 정보</span>
            </template>
            <template #default>
              <div class="item_wrap w100p">
                <span class="title">사용자 ID</span>
                <span v-text="myInfo.userId"></span>
              </div>
              <div class="item_wrap w100p">
                <span class="title">이름</span>
                <input
                  type="text"
                  v-model="myInfo.userNm"
                  placeholder="이름을 입력하세요" />
                <button class="chgnm_btn" @click="saveUserInfo('userNm')">
                  변경하기
                </button>
              </div>
              <div class="item_wrap w100p">
                <span class="title">휴대전화</span>
                <input
                  type="text"
                  v-model="myInfo.crryTelNo"
                  @input="cUtil.regexType($event, 'crryTelNo')"
                  id="crryTelNo"
                  maxlength="13"
                  placeholder="휴대폰 번호를 입력하세요" />
                <button @click="sendCertNum">인증번호 전송</button>
                <button class="chgTelNo_btn" @click="saveUserInfo('crryTelNo')">
                  변경하기
                </button>
              </div>
              <div class="item_wrap w100p" v-if="isSendCertNum">
                <span class="title">인증번호</span>
                <input
                  type="text"
                  v-model="certNum"
                  @blur="validateCheck($event)"
                  class="cert_num"
                  placeholder="인증 번호를 입력하세요" />
                <div style="display: none" id="certNum"></div>
                <span
                  class="timer"
                  v-html="timeValue"
                  :key="timer.timer"></span>
                <button @click="confCertNum($event)">인증번호 확인</button>
              </div>
              <div class="item_wrap w100p vertical_mid">
                <span class="title">비밀번호</span>
                <div class="pw_box">
                  <div class="item_wrap">
                    <span class="title2">현재 비밀번호</span>
                    <input
                      type="password"
                      v-model="userPw"
                      @blur="validateCheck($event), validatePwchar($event)"
                      placeholder="비밀번호를 입력하세요"
                      id="UserPw" />
                    <div style="display: none" id="userPw"></div>
                  </div>
                  <div class="item_wrap">
                    <span class="title2">신규 비밀번호</span>
                    <input
                      type="password"
                      v-model="newPw"
                      @blur="validateCheck($event), validatePwchar($event)"
                      placeholder="신규 비밀번호를 입력하세요"
                      id="NewPw" />
                    <div style="display: none" id="newPw"></div>
                  </div>
                  <div class="item_wrap">
                    <span class="title2">비밀번호 확인</span>
                    <input
                      type="password"
                      v-model="chkPw"
                      @blur="
                        validateCheck($event),
                          validatePwchar($event),
                          validatePw($event)
                      "
                      placeholder="비밀번호를 다시 입력하세요"
                      id="ChkPw" />
                    <div style="display: none" id="chkPw"></div>
                    <button class="chgpw_btn" @click="saveUserInfo('newPw')">
                      변경하기
                    </button>
                  </div>
                </div>
              </div>
              <div class="item_wrap w100p vertical_mid">
                <span class="title">서명</span>
                <div class="m_sign_wrap">
                  <div class="sign">
                    <img :src="srcUrl" :key="signInfo" />
                  </div>
                  <button
                    @click="
                      signRegist(loginStore.$state.userInfo.signImgAtchFileKey)
                    "
                    v-html="btnSign"></button>
                </div>
              </div>

              <div class="term_wrap">
                <input
                  type="checkbox"
                  id="chkMrktAgreYn"
                  @click="saveMrktAgreYn($event)"
                  :checked="myInfo.mrktInfoClctAgreDt !== null" /><label
                  for="chkMrktAgreYn"
                  >마케팅 및 이벤트 목적의 개인정보 수집 및 이용
                  <span v-text="mrktInfoText"></span
                  ><button @click="privacyMkt">[보기]</button></label
                >
                <br />
                <input
                  type="checkbox"
                  id="chkAdvrAgreYn"
                  @click="saveAdvrAgreYn($event)"
                  :checked="myInfo.advrInfoRcvAgreDt !== null" /><label
                  for="chkAdvrAgreYn"
                  >광고성 정보 수신 <span v-text="advrInfoText"></span
                  ><button @click="privacyAd">[보기]</button></label
                >
                <br />
                (
                <input
                  type="checkbox"
                  id="smsRcvYn"
                  @click="saveRcvItem($event)"
                  :checked="myInfo.smsRcvYn == 'Y'"
                  :disabled="myInfo.advrInfoRcvAgreDt == null" /><label
                  for="smsRcvYn"
                  >SMS,MMS</label
                >
                <input
                  type="checkbox"
                  id="emlRcvYn"
                  @click="saveRcvItem($event)"
                  :checked="myInfo.emlRcvYn == 'Y'"
                  :disabled="myInfo.advrInfoRcvAgreDt == null" /><label
                  for="emlRcvYn"
                  >이메일</label
                >
                <input
                  type="checkbox"
                  id="pushRcvYn"
                  @click="saveRcvItem($event)"
                  :checked="myInfo.pushRcvYn == 'Y'"
                  :disabled="myInfo.advrInfoRcvAgreDt == null" /><label
                  for="pushRcvYn"
                  >푸시알림 )</label
                >
                <br />
              </div>
            </template>
          </compPageCard>
        </v-col>
        <v-col>
          <compPageCard cardHeight="calc(100vh - 220px)">
            <template #subTitle>
              <span class="title">역할 정보</span>
            </template>
            <template #default>
              <comp-ag-grid
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="gridRowData"
                :gridOptions="gridOptions1"
                @get-grid-api="getGridApi">
              </comp-ag-grid>
            </template>
          </compPageCard>
        </v-col>
      </v-row>
    </v-container>

    <div class="pop_in_pop sign_regist">
      <div class="popup_title">
        <span>서명 등록</span>
        <button class="popup_close" @click="popInPopClose"></button>
      </div>
      <div class="popup_content">
        <popSignRegist ref="signFile" :key="signInfo"></popSignRegist>
      </div>
      <div class="popup_button">
        <button @click="saveSign">등록</button>
        <button @click="popInPopClose">닫기</button>
      </div>
    </div>

    <!-- 개인정보 수집 및 이용약관 -->
    <div class="pop_in_pop privacy_mkt">
      <div class="popup_title">
        <span>개인정보 수집 및 이용약관</span>
        <button class="popup_close" @click="popInPopClose"></button>
      </div>
      <div class="popup_content">
        <div class="content_box">
          <div class="terms_title">
            [선택] 광고성 목적의 개인정보 수집 및 이용 동의
          </div>
          <br />
          <div class="indent">동의를 거부할 수 있으며, 동의를 거부하셔도</div>
          <div class="indent">서비스를 이용하실 수 있습니다.</div>
          <br />
          <div class="indent_bold">수집 항목 : 이메일 주소, 휴대전화 번호</div>
          <div class="indent_bold">
            수집 목적 : 광고 및 마케팅 참여기회 제공
          </div>
          <div class="indent_bold">
            보유 기간 : 동의철회 또는 회원탈퇴 시 지체없이 파기
          </div>
        </div>
      </div>
      <div class="popup_button">
        <button @click="popInPopClose">닫기</button>
      </div>
    </div>

    <!-- 광고성 정보 수신 -->
    <div class="pop_in_pop privacy_ad">
      <div class="popup_title">
        <span>개인정보 수집 및 이용약관</span>
        <button class="popup_close" @click="popInPopClose"></button>
      </div>
      <div class="popup_content">
        <div class="content_box">
          <div class="terms_title">[선택] 광고성 정보 수신 동의</div>
          <br />
          <div class="indent">본 동의는 거부하실 수 있으나,</div>
          <div class="indent">
            거부 시 이벤트 및 프로모션 안내를 받아보실 수 없습니다.
          </div>
          <br />
          <div class="indent_bold">
            Plan2Do는 회원님이 수집 및 이용에 동의한 개인정보를 이용하여
          </div>
          <div class="indent_bold">
            SMS, MMS, 이메일, 푸시 알림 등 다양한 전자적 전송 매체를 통해
          </div>
          <div class="indent_bold">
            오전 8시부터 오후 9시까지 광고 및 정보를 전송할 수 있습니다.
          </div>
        </div>
      </div>
      <div class="popup_button">
        <button @click="popInPopClose">닫기</button>
      </div>
    </div>
  </comp-modal>
</template>

<script setup>
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { defineEmits, onBeforeMount, onMounted, ref } from "vue";

import commonUtil from "@/utils/common-utils";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import compModal from "@/components/modal/compModal.vue";
import popSignRegist from "@/views/common/popSignRegist.vue";

import loginAuthService from "@/api/common/login-auth-service";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { myInfoStore } from "@/stores/common/myinfo-store";
import { useUsrMgmtStore } from "@/stores/sys/usr-mgmt-store";

const dialogStore = useDialogStore();
const emit = defineEmits(["togglePopup", "popSetupSignPop"]);
const url = import.meta.env.VITE_APP_API_DEV_URL;
const signFile = ref(null);
const signInfo = ref();
const srcUrl = ref("");
const cUtil = commonUtil;
const props = defineProps(["isOpenPopup"]);
const userPw = ref("");
const chkPw = ref("");
const newPw = ref("");
const certNum = ref("");
const isValid = ref(false);
const isSendCertNum = ref(false); //인증번호 전송 여부
const isConfirm = ref(false); //휴대전화 인증완료 여부
const confirmCertNo = ref("");
const rcmdtnVendrCd = ref("");
const timeValue = ref("");
const btnSign = ref("");
const validations = {
  // 비밀번호 유효성검사 통과여부 확인용
  isUserPwValid: [false, false],
  isChkPwValid: [false, false, false],
  isNewPwValid: [false, false],
};
const mrktInfoText = ref("");
const advrInfoText = ref("");
const mrktInfoDate = ref("");
const advrInfoDate = ref("");
const isInfoRcvValid = ref([]);

let timer = {
  timer: null,
  count: 180,
  string: "03:00",
};

const userStore = useUsrMgmtStore();
const infoStore = myInfoStore();
const loginStore = useLoginAuthStore();
const { userInfo } = storeToRefs(loginStore);
const { myInfo } = storeToRefs(infoStore);

/**
 * 그리드 설정
 */
const gridRowData = ref([]);
const gridApi = ref();
const gridColumnApi = ref();
const localeText = { noRowsToShow: "조회 결과가 없습니다." };

function getGridApi(params) {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;
}

const columnDefs = [
  {
    headerName: "현장명",
    field: "siteNm",
    flex: 2,
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 200,
  },
  {
    headerName: "직책",
    field: "jbttlNm",
    flex: 1,
    filter: true,
    cellStyle: { textAlign: "center" },
    width: 120,
    maxWidth: 300,
  },
  {
    headerName: "계정활성",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "시작일",
        field: "actvStDt",
        flex: 1,
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 110,
        maxWidth: 200,
        cellRenderer: (params) => {
          const startDt = params.data.actvStDt;
          return (
            startDt.substring(0, 4) +
            "-" +
            startDt.substring(4, 6) +
            "-" +
            startDt.substring(6)
          );
        },
      },
      {
        headerName: "종료일",
        field: "actvEnDt",
        flex: 1,
        filter: false,
        cellStyle: { textAlign: "center" },
        wrapText: true,
        width: 100,
        maxWidth: 200,
        cellRenderer: (params) => {
          const endDt = params.data.actvEnDt;
          return (
            endDt.substring(0, 4) +
            "-" +
            endDt.substring(4, 6) +
            "-" +
            endDt.substring(6)
          );
        },
      },
    ],
  },
  {
    headerName: "등록일",
    field: "regDate",
    flex: 1,
    filter: false,
    cellStyle: { textAlign: "center" },
    width: 100,
    maxWidth: 330,
  },
];

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 2,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const gridOptions1 = ref({
  headerHeight: 40,
  rowHeight: 53,
  defaultColDef: defaultColDef,
  localeText: localeText,
});

// 개인 정보
async function userDataList() {
  try {
    const params = {
      vendrCd: loginStore.$state.userInfo.vendrCd,
      userId: loginStore.$state.userInfo.userId,
    };
    const res = await userStore.selectUsrInfo(params);
    if (res.data != null && res.status == 200) {
      myInfo.value = res.data[0];

      userInfo.value.userNm = res.data[0].userNm;
      userInfo.value.crryTelNo = res.data[0].crryTelNo;

      // 개인정보 수집 동의 정보 셋팅
      mrktInfoText.value = !cUtil.nullCheck(myInfo.value.mrktInfoClctAgreDt)
        ? "동의함 (" +
          dayjs(res.data[0].mrktInfoClctAgreDt).format("YY.MM.DD") +
          ")"
        : "철회됨";
      advrInfoText.value = !cUtil.nullCheck(myInfo.value.advrInfoRcvAgreDt)
        ? "동의함 (" +
          dayjs(res.data[0].advrInfoRcvAgreDt).format("YY.MM.DD") +
          ")"
        : "철회됨";
      mrktInfoDate.value = myInfo.value.mrktInfoClctAgreDt;
      advrInfoDate.value = myInfo.value.advrInfoRcvAgreDt;
    } else {
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > userDataList > err : ", err);
    throw err;
  }
}

// 서명 정보
async function getMyInfo() {
  const params = {
    vendrCd: loginStore.$state.userInfo.vendrCd,
    userId: loginStore.$state.userInfo.userId,
  };
  try {
    signInfo.value = await infoStore.selectMySignMgmt(params);
  } catch (err) {
    console.log("m-myInfo.vue > getMyInfo() > err : ", err);
    throw err;
  }

  let path = "";
  let noSignImg =
    "data:image/png;base64,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";
  if (signInfo.value != null && signInfo.value != "") {
    if (
      signInfo.value.signImgAtchFileKey != null &&
      signInfo.value.signImgAtchFileKey != ""
    ) {
      path =
        url +
        "/v1/common/getImage?param1=" +
        signInfo.value.filePath +
        "&param2=" +
        signInfo.value.fileNm;
      srcUrl.value = path;
      btnSign.value = "서명 재등록하기";
    } else {
      path = noSignImg;
      btnSign.value = "서명 등록하기";
    }
  } else {
    path = noSignImg;
    btnSign.value = "서명 등록하기";
  }

  srcUrl.value = path;
}

// 역할 정보
async function getUsrDetail() {
  const params = {
    vendrCd: loginStore.$state.userInfo.vendrCd,
    userId: loginStore.$state.userInfo.userId,
  };

  try {
    const getUsrDetail = await userStore.selectUsrDetail(params);
    gridRowData.value = getUsrDetail;
  } catch (err) {
    console.log("UsrMgmtPage.vue > rowClick > err : ", err);
    throw err;
  }
}

// 입력값 validate
async function validateCheck(e) {
  const title = ref("");
  const style = ref("");
  const targetId = e.target.id;
  isValid.value = cUtil.nullCheck(e.target.value);
  if (
    e.target.classList.value == "btn_input" ||
    e.target.classList.value == "btn_input cert_num"
  ) {
    style.value = "130px";
  } else {
    style.value = "";
  }
  if (isValid.value) {
    title.value = e.target.previousElementSibling.innerHTML;
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.style.right = style.value;
    e.target.nextElementSibling.innerHTML = e.target.placeholder;

    validations["is" + targetId + "Valid"][0] = false;

    return;
  } else {
    e.target.nextElementSibling.classList.remove("notice");
    e.target.nextElementSibling.style.display = "none";
    e.target.nextElementSibling.innerHTML = "";

    //if (targetId.includes("Pw")) {
    validations["is" + targetId + "Valid"][0] = true;
    //};
  }
}

// 비밀번호 확인 검증
function validatePw(e) {
  if (newPw.value != e.target.value) {
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.innerHTML = "비밀번호가 일치하지 않습니다.";
    validations["isChkPwValid"][2] = false;
    return;
  } else {
    validations["isChkPwValid"][2] = true;
  }
}

function validatePwchar(e) {
  const passwordToCheck = e.target.value;
  const targetId = e.target.id;

  if (!validatePassword(passwordToCheck)) {
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.innerHTML =
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다.";
    validations["is" + targetId + "Valid"][1] = false;
    return;
  } else {
    validations["is" + targetId + "Valid"][1] = true;
  }
}

// 대문자, 소문자, 숫자, 특수문자 포함 여부 확인을 위한 정규식
function validatePassword(password) {
  // 대문자, 소문자, 숫자 포함 여부를 확인하는 정규식
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return regex.test(password);
}

// 인증번호 전송 버튼
async function sendCertNum(e) {
  var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/;
  let valid = false;
  const send = async () => {
    const params = {
      userId: loginStore.$state.userInfo.userId,
      crryTelNo: myInfo.value.crryTelNo.replaceAll("-", ""),
      tmplCd: "001",
    };
    try {
      const res = await loginAuthService.sendNotificationTalk(params);

      if (res.status == 200) {
        dialogStore.openToastDialog("인증번호가 전송되었습니다.");
        confirmCertNo.value = res.data.tmpParam;
        e.target.innerHTML = "인증번호 재전송";
        timer.timer = setTimer(e);
        certNum.value = "";
        isSendCertNum.value = true;
        isConfirm.value = false;
      } else {
        dialogStore.openAlertDialog(res.data.message);
        return;
      }
    } catch (err) {
      console.log(
        "popResetPassword.vue > sendCertNum() > sendNotificationTalk err : ",
        err
      );
      throw err;
    }
  };

  if (regPhone.test(myInfo.value.crryTelNo)) {
    if (myInfo.value.crryTelNo != "") {
      if (timer.timer) {
        dialogStore.openConfirmDialog("인증번호를 재전송하시겠습니까?", {
          confirmCallback: async () => {
            stopTimer(timer.timer);
            await send();
          },
        });
      } else {
        await send();
      }
    } else {
      dialogStore.openAlertDialog("휴대전화 번호를 확인하세요.");
      return;
    }
  } else {
    dialogStore.openAlertDialog("전화번호를 정확히 입력하세요.");
    return;
  }
}

// 인증번호 전송 타이머 시작
function setTimer(e) {
  timer.count = 180;

  var interval = setInterval(() => {
    timer.count--;
    timer.string = prettyTime();
    timeValue.value = timer.string;
    if (timer.count <= 0) {
      stopTimer(interval);
      e.target.innerHTML = "인증번호 전송";
      timer.count = 0;
      timer.timer = null;
    }
  }, 1000);

  return interval;
}

// 인증번호 전송 타이머 스탑
function stopTimer(timer) {
  clearInterval(timer);
  timeValue.value = "";
}

// 타이머 텍스트 시간형식으로 변환
function prettyTime() {
  let time = timer.count / 60;
  let min = parseInt(time);
  let sec = Math.round((time - min) * 60);
  let timerData =
    min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
  return timerData;
}

// 인증번호 확인 버튼
function confCertNum() {
  if (!isSendCertNum.value) {
    dialogStore.openAlertDialog("휴대폰으로 발송된 인증번호를 입력하세요.");
    return;
  } else {
    if (myInfo.value.crryTelNo != "" && certNum.value != "") {
      if (certNum.value === confirmCertNo.value) {
        dialogStore.openToastDialog("인증이 정상적으로 완료되었습니다.");
        stopTimer(timer.timer);

        const isAbled = ref();
        isAbled.value = isSendCertNum.value;
        emit("update", isAbled.value);
        isSendCertNum.value = false;
        isConfirm.value = true;
      } else {
        dialogStore.openAlertDialog("인증번호가 일치하지 않습니다.");
        return;
      }
    } else {
      dialogStore.openAlertDialog("휴대전화 번호 인증이 필요합니다.");
      return;
    }
  }
}

function signRegist(fileKey) {
  if (fileKey != null && fileKey != "") {
    dialogStore.openConfirmDialog(
      "등록된 서명을 지우고 다시 등록하시겠습니까?",
      {
        confirmCallback: async () => {
          openSignPop();
        },
      }
    );
  } else {
    openSignPop();
  }
}

/** 서명팝업 열기 */
const openSignPop = () => {
  document.getElementsByClassName("sign_regist")[0].classList.add("show");
};

function changePassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("change_password")[0].classList.add("show");
}

function popupClose(e) {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  e.target.parentElement.parentElement.classList.remove("show");
}
function popInPopClose(e) {
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  e.target.parentElement.parentElement.classList.remove("show");
}

// 서명 등록
async function saveSign() {
  dialogStore.openConfirmDialog("서명을 저장하시겠습니까?", {
    confirmCallback: async () => {
      const sign = await signFile.value.getSign();

      if (sign != "" && sign != null) {
        const blob = await sign.data.blob();

        const ext = ".png";
        const name = loginStore.$state.userInfo.userId;
        const vendrCd = loginStore.$state.userInfo.vendrCd;
        const fileName =
          name.substring(0, name.lastIndexOf("@")) + "_sign_img" + ext;

        const fileKey = ref("");
        const path = ref("");
        const fileNm = ref("");

        if (signInfo.value != null && signInfo.value != "") {
          if (
            signInfo.value.signImgAtchFileKey != null &&
            signInfo.value.signImgAtchFileKey != ""
          ) {
            fileKey.value = signInfo.value.signImgAtchFileKey;
            path.value = signInfo.value.filePath;
            fileNm.value = signInfo.value.fileNm;
          }
        }

        const params = {
          vendrCd: vendrCd,
          userId: name,
          signImgAtchFileKey: fileKey.value,
          filePath: path.value,
          fileNm: fileNm.value,
        };

        const formData = new FormData();

        formData.append(
          "param",
          new Blob([JSON.stringify(params)], { type: "application/json" })
        );
        formData.append("file", blob, fileName);

        try {
          const res = await infoStore.saveMySignMgmt(formData);
          if (res.data == "OK") {
            dialogStore.openToastDialog("저장되었습니다.");
            document
              .getElementsByClassName("popup_bg")[0]
              .classList.remove("show");
            document
              .getElementsByClassName("sign_regist")[0]
              .classList.remove("show");
            getMyInfo();
          } else {
            dialogStore.openAlertDialog(res.data.message);
          }
        } catch (err) {
          console.log("m-myInfo.vue > saveSign() > err : ", err);
          throw err;
        }
      }
    },
  });
}

// 사용자 정보 수정
async function saveUserInfo(div) {
  let chgVal = "";

  const params = {
    vendrCd: loginStore.$state.userInfo.vendrCd,
    userId: loginStore.$state.userInfo.userId,
    modId: loginStore.$state.userInfo.userId,
  };

  if (div == "newPw") {
    if (userPw.value == "") {
      dialogStore.openAlertDialog("현재 비밀번호를 입력하세요.");
      return;
    } else if (newPw.value == "") {
      dialogStore.openAlertDialog("신규 비밀번호를 입력하세요.");
      return;
    } else if (chkPw.value == "") {
      dialogStore.openAlertDialog("확인 비밀번호를 입력하세요.");
      return;
    }

    if (userPw.value == newPw.value) {
      dialogStore.openAlertDialog(
        "현재 비밀번호와 신규 비밀번호를 다르게 입력해주세요."
      );
      return;
    }

    const isAllValid = Object.values(validations).every((arr) =>
      arr.every((value) => value === true)
    );

    // 비밀번호 유효성검사를 모두 통과했는지 체크, 하나라도 false가 있을경우 재입력
    if (!isAllValid) {
      dialogStore.openAlertDialog("비밀번호를 확인해주세요.");
      return;
    }

    params.userPw = userPw.value;
    chgVal = newPw.value;
  } else if (div == "crryTelNo") {
    if (!isConfirm.value) {
      dialogStore.openAlertDialog("인증번호 확인이 필요합니다.");
      return;
    }

    chgVal = myInfo.value.crryTelNo.replaceAll("-", "");
  } else {
    chgVal = myInfo.value[div];
  }

  params[div] = chgVal;

  dialogStore.openConfirmDialog("변경하시겠습니까?", {
    confirmCallback: async () => {
      if (chgVal != "") {
        try {
          const res = await userStore.saveUserInfo(params);
          if (res.data === "OK") {
            dialogStore.openToastDialog("변경되었습니다.");
            userDataList();
            userPw.value = "";
            chkPw.value = "";
            newPw.value = "";
          } else {
            dialogStore.openAlertDialog(res.data.message);
          }
        } catch (err) {
          throw err;
        }
      } else {
        dialogStore.openAlertDialog("삭제할 사용자를 선택하세요.");
        return;
      }
    },
  });
}

// 광고성 정보 수신 동의 열기
function privacyMkt() {
  //document.getElementsByClassName("popup_bg2")[0].classList.add("show");
  document.getElementsByClassName("privacy_mkt")[0].classList.add("show");
}

// 광고성 정보 수신 동의 열기
function privacyAd() {
  //document.getElementsByClassName("popup_bg2")[0].classList.add("show");
  document.getElementsByClassName("privacy_ad")[0].classList.add("show");
}

// 개인정보 수집 이용 동의
async function saveMrktAgreYn(e) {
  const isChecked = e.target.checked;
  const targetId = e.target.id;
  const alertVal = isChecked ? "동의" : "철회";
  const today = dayjs().format("YYYYMMDD");

  dialogStore.openConfirmDialog(
    "마케팅 및 이벤트 목적의 개인정보 수집에 " + alertVal + "하시겠습니까?",
    {
      confirmCallback: async () => {
        if (isChecked) {
          mrktInfoDate.value = today;
        } else {
          mrktInfoDate.value = "";
          //철회할 경우 광고성 정보도 체크 해제
          advrInfoDate.value = "";
          myInfo.value.smsRcvYn = "N";
          myInfo.value.emlRcvYn = "N";
          myInfo.value.pushRcvYn = "N";
        }

        saveRcvYn();
      },
      cancelCallback: async () => {
        chkMrktAgreYn.checked = false;
      },
    }
  );
}

// 광고성 정보 수신 동의
async function saveAdvrAgreYn(e) {
  const isChecked = e.target.checked;
  const alertVal = isChecked ? "동의" : "철회";
  const today = dayjs().format("YYYYMMDD");

  dialogStore.openConfirmDialog(
    "광고성 정보 수신에 " + alertVal + "하시겠습니까?",
    {
      confirmCallback: async () => {
        // 동의/철회시 SMS, 이메일값 셋팅
        myInfo.value.smsRcvYn = isChecked ? "Y" : "N";
        myInfo.value.emlRcvYn = isChecked ? "Y" : "N";
        myInfo.value.pushRcvYn = "N";

        if (isChecked) {
          advrInfoDate.value = today;

          // 광고성정보 수신 동의시 마케팅 동의 체크
          if (!chkMrktAgreYn.checked) {
            mrktInfoDate.value = today;
          }
        } else {
          advrInfoDate.value = "";
        }

        saveRcvYn();
      },
      cancelCallback: async () => {
        chkAdvrAgreYn.checked = false;
      },
    }
  );
}

// 광고성 정보 수신 동의 (sms, 이메일, 푸시)
async function saveRcvItem(e) {
  const isChecked = e.target.checked;
  const targetId = e.target.id;

  const params = {
    vendrCd: loginStore.$state.userInfo.vendrCd,
    userId: loginStore.$state.userInfo.userId,
    mrktInfoClctAgreDt: myInfo.value.mrktInfoClctAgreDt,
    advrInfoRcvAgreDt: myInfo.value.advrInfoRcvAgreDt,
    [targetId]: isChecked ? "Y" : "N",
    modId: loginStore.$state.userInfo.userId,
  };

  try {
    const res = await userStore.updateRcvAgreInfo(params);
    if (res.data === "OK") {
      userDataList();
    } else {
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > delUser() > err : ", err);
    throw err;
  }
}

// 광고성 정보 수신 동의
async function saveRcvYn() {
  const params = {
    vendrCd: loginStore.$state.userInfo.vendrCd,
    userId: loginStore.$state.userInfo.userId,
    mrktInfoClctAgreDt: mrktInfoDate.value,
    advrInfoRcvAgreDt: advrInfoDate.value,
    smsRcvYn: myInfo.value.smsRcvYn,
    emlRcvYn: myInfo.value.emlRcvYn,
    pushRcvYn: myInfo.value.pushRcvYn,
    modId: loginStore.$state.userInfo.userId,
  };

  try {
    const res = await userStore.updateRcvAgreInfo(params);
    if (res.data === "OK") {
      userDataList();
    } else {
      dialogStore.openAlertDialog(res.data.message);
    }
  } catch (err) {
    console.log("UsrMgmtPage.vue > delUser() > err : ", err);
    throw err;
  }
}

function isChkValid() {
  const chkArr = ["smsRcvYn", "emlRcvYn", "pushRcvYn"];

  return chkArr.every((checkboxId) => {
    const checkbox = document.getElementById(checkboxId);
    return !checkbox || checkbox.checked === false;
  });
}

onBeforeMount(() => {});

onMounted(async () => {
  userDataList(); // 개인 정보 조회
  getMyInfo();
  getUsrDetail(); // 역할 정보 조회
});
</script>

<style scoped>
.content_box {
  height: 100%;
  margin: 0px;
  overflow: auto;
  margin: 0px;
  z-index: 1;
}

.item_wrap .title {
  width: 100px;
  text-align: left;
}

.popup_background {
  background-color: #f1f6f8;
}

.ag-theme-alpine {
  float: left;
}

.left_side {
  float: left;
  width: calc(48% - 20px);
  height: calc(100% - 40px);
  margin-right: 40px;
}

.right_side {
  float: left;
  width: calc(52% - 20px);
  height: calc(100% - 40px);
}

.grid_default {
  width: 100%;
  height: 100%;
}

.sign_regist {
  width: 345px;
  /* height:700px; */
}

.item_wrap .btn_input {
  width: calc(100% - 260px);
}

.item_wrap .btn_input.cert_num::placeholder {
  font-size: 0px;
}

.timer {
  position: absolute;
  left: 275px;
  top: 11px;
  font-size: 12px;
  color: #ff6600;
}

.m_sign_wrap {
  display: inline-block;
  width: 50%;
  height: 50%;
}
.m_sign_wrap button {
  margin-left: 0px;
}
.vertical_mid {
  display: flex;
  align-items: center;
}
.pw_box {
  display: inline-block;
  width: calc(100% - 100px);
}
.pw_box .title2 {
  margin-right: 10px;
  font-family: "Pretendard-B";
  font-size: 13px;
  color: #888888;
}

.item_wrap .notice {
  left: 85px;
  white-space: nowrap;
  padding: 0px;
  padding-top: 8px;
  background-color: rgba(0, 0, 0, 0);
}

.content_box_agre {
  line-height: 26px;
  color: #666666;
}

.privacy_mkt {
  width: 500px;
  height: auto;
}
.privacy_ad {
  width: 550px;
  height: auto;
}

.terms_title {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: "Pretendard-EB";
  font-size: 16px;
  color: #252525;
}

.indent {
  margin: 10px 0px;
  font-family: "Pretendard-R";
  font-size: 14px;
  color: #252525;
}

.indent_bold {
  margin: 10px 0px;
  font-family: "Pretendard-EB";
  font-size: 14px;
  color: #252525;
}
</style>
