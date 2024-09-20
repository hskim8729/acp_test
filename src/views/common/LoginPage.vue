<template>
  <!-- 회원가입 팝업 -->
  <div class="popup member_regist">
    <div class="popup_title">
      <span>회원사 무료가입</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popMemberRegist
        ref="memInfo"
        @update="getIsAbleRegBtn"></popMemberRegist>
    </div>
    <div class="popup_button">
      <button :disabled="wait" @click="registMemInfo">무료가입</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>

  <!-- 비밀번호 초기화 팝업 -->
  <div class="popup reset_password">
    <div class="popup_title">
      <span>비밀번호 초기화</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popResetPassword
        ref="resetPwInfo"
        @update="resetPasswd"></popResetPassword>
    </div>
    <div class="popup_button">
      <button :disabled="wait" @click="getTempPw">임시비밀번호 받기</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>

  <!-- 협력사 선택 팝업 -->
  <div class="popup company_select">
    <div class="popup_title">
      <span>회사를 선택하세요</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popCompanySelect
        :selData="venList"
        @update="getVendrCd"></popCompanySelect>
    </div>
  </div>

  <!-- 개인정보이용방침 팝업 -->
  <!-- <div class="pop_in_pop regist_privacy">
    <div class="popup_title">
      <span>개인정보 이용방침</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <popRegistPrivacy></popRegistPrivacy>
    </div>
    <div class="popup_button">
      <button @click="popInPopClose">닫기</button>
    </div>
  </div> -->

  <!-- 알림소식 팝업 -->
  <popNotifyNews
    :isOpenPopup="isNotifyNewsPopup"
    @togglePopup="toggleNotifyNewsPopup"
    v-if="isNotifyNewsPopup" />

  <!-- 로그인 창 -->
  <div
    class="index_login_bg show"
    @click="isPopLoginIndex = false"
    v-show="isPopLoginIndex"></div>

  <div class="index_login_box show" v-show="isPopLoginIndex">
    <div class="login_title_area"></div>

    <label>E-mail</label>
    <input
      type="text"
      ref="userIdRef"
      v-model="userId"
      placeholder="이메일을 입력하세요"
      autocomplete="email" />
    <label>Password</label>
    <input
      type="password"
      ref="userPwRef"
      v-model="userPw"
      @keypress.enter="chkDuplicated"
      placeholder="비밀번호를 입력하세요" />

    <div class="login_id_save">
      <input type="checkbox" id="loginChk" v-model="idSave" />
      <label for="loginChk">이메일 저장</label>
    </div>

    <button @click="chkDuplicated">로그인</button>

    <div class="line"></div>
    <div class="notice">
      Plan2Do가 처음이신가요? <span @click="memberRegist">회원가입</span><br />
      비밀번호를 잊으셨나요? <span @click="resetPassword">비밀번호 초기화</span>
    </div>
  </div>
  <!-- 로그인 창 end -->

  <div class="index_top">
    <div class="logo"></div>
    <div class="top_menu">
      <button class="others" @click="toggleNotifyNewsPopup">알림소식</button>
      <!-- Contact Us 팝업 -->
      <pop-contact-us v-if="isContacUsOpen" @close="isContacUsOpen = false" />
      <button class="others" @click="isContacUsOpen = true">문의하기</button>
      <button class="trial" @click="memberRegist">회원가입</button>
      <button class="login" @click="indexLogin">로그인</button>
    </div>
  </div>
  <div class="index_content">
    <section>
      <div class="main_banner">
        <span
          >쉽고 간단한 위험성평가로<br />당신의 산업 현장을<br />안전하게
          보호하세요</span
        >
        <div class="banner_btn">
          <button class="trial" @click="memberRegist">회원가입</button>
          <button class="login" @click="indexLogin">로그인</button>
        </div>
      </div>
    </section>

    <loginPageSection1></loginPageSection1>
    <loginPageSection2></loginPageSection2>
    <loginPageSection3></loginPageSection3>
    <loginPageSection4></loginPageSection4>
    <loginPageSection5></loginPageSection5>
    <loginPageSection6></loginPageSection6>
    <loginPageSection7
      @openGoogleStore="openGoogleStore"
      @openAppleStore="openAppleStore">
    </loginPageSection7>
    <loginPageSection8></loginPageSection8>
    <loginPageSectionPrice
      @memberRegist="memberRegist"
      @indexLogin="indexLogin"
      @openContacUsOpen="isContacUsOpen = true">
    </loginPageSectionPrice>

    <section class="index_section_footer">
      <div class="footer_logo"></div>
      <div class="footer_menu">
        <popBoardRead title="서비스 이용약관" bbsClsCd="T2310"></popBoardRead>
        <popBoardRead title="개인정보처리방침" bbsClsCd="T2311"></popBoardRead>
      </div>
      <div class="info">
        서울특별시 종로구 우정국로 26 센트로폴리스 A동 23층<br />
        아시아나IDT(주) 대표이사 김응철<br />
        사업자등록번호 104-81-22547<br />
        통신판매번호 2006-03807<br />
        plan2do@asianaidt.com
      </div>
      <div class="copy">ⓒ 2024 Plan2Do. All rights reserved.</div>
    </section>
  </div>
</template>

<script setup>
import loginAuthService from "@/api/common/login-auth-service";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useRouter } from "vue-router";

import loginPageSection1 from "@/views/common/loginSection/loginPageSection1.vue";
import loginPageSection2 from "@/views/common/loginSection/loginPageSection2.vue";
import loginPageSection3 from "@/views/common/loginSection/loginPageSection3.vue";
import loginPageSection4 from "@/views/common/loginSection/loginPageSection4.vue";
import loginPageSection5 from "@/views/common/loginSection/loginPageSection5.vue";
import loginPageSection6 from "@/views/common/loginSection/loginPageSection6.vue";
import loginPageSection7 from "@/views/common/loginSection/loginPageSection7.vue";
import loginPageSection8 from "@/views/common/loginSection/loginPageSection8.vue";
import loginPageSectionPrice from "@/views/common/loginSection/loginPageSectionPrice.vue";

import { onBeforeMount, onMounted, reactive, ref } from "vue";
import popCompanySelect from "./popCompanySelect.vue";
import popMemberRegist from "./popMemberRegist.vue";
import popResetPassword from "./popResetPassword.vue";

import popBoardRead from "@/views/board/components/popBoardRead.vue";
import popContactUs from "@/views/common/popContactUs.vue";
import popNotifyNews from "./popNotifyNews.vue";

import commonUtil from "@/utils/common-utils";

const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();

const router = useRouter();

let idUrl = ref("");
let pwUrl = ref("");

// 로그인 성공 시 userId 공백처리해야됨
const userId = ref(import.meta.env.PROD ? "" : idUrl);
const userPw = ref(import.meta.env.PROD ? "" : pwUrl);
const idSave = loginStore.$state.idSave;

// 모바일 웹 구분 값
loginStore.$state.gubun = "W";
//const loginType = ref(false);
const wait = ref(true);

// 공통 유틸
const cUtil = commonUtil;

// 로그인 파라미터
const loginParams = reactive({});

// 자동 로그인 파라미터
const pubLoginParams = reactive({});

// 이메일 중복체크 시 회원사 팝업창에 보일 회원사 리스트
const venList = ref();

// 이메일 중복체크 팝업창에서 가져온 회원사 코드
const selVendrCd = ref();

// 회원사 무료가입 입력정보
const memInfo = ref(null);
const regInfo = ref();

// 비밀번호 초기화 입력 정보
const resetPwInfo = ref(null);
const pwInfo = ref();

const userIdRef = ref(null);
const userPwRef = ref(null);

// 로그인 이메일 중복체크
async function chkDuplicated() {
  let valid = false;

  // 이메일 입력 여부 체크
  if (userId.value == "") {
    dialogStore.openAlertDialog("이메일을 입력하세요.", {
      callback: () => {
        userIdRef.value.focus();
      },
    });

    return false;
  }

  // 이메일 validation 체크
  var regEmail =
    // eslint-disable-next-line
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;
  if (regEmail.test(userId.value)) {
    valid = true;
  }

  if (!valid) {
    dialogStore.openAlertDialog("이메일 형식에 맞게 입력하세요.", {
      callback: () => {
        userIdRef.value.focus();
      },
    });
    return false;
  }

  // 패스워드 입력 여부 체크
  if (userPw.value == "") {
    dialogStore.openAlertDialog("비밀번호를 입력하세요.", {
      callback: () => {
        userPwRef.value.focus();
      },
    });
    return false;
  }

  loginParams.userId = userId.value;
  loginParams.userPw = userPw.value;
  try {
    const chkLogin = await loginStore.checkDuplicated(loginParams);
    if (chkLogin.status === 200) {
      if (chkLogin.data.length > 1) {
        companySelect(chkLogin.data);
      } else {
        loginParams.vendrCd = chkLogin.data[0].vendrCd;
        login();
      }
    } else {
      dialogStore.openAlertDialog(chkLogin.data.message, { type: "error" });
      return;
    }
  } catch (err) {
    console.log("LoginPage.vue > chkDuplicated() > err : ", err);
    throw err;
  }
}

// 사용자 로그인 자동 로그인
async function autoChkDuplicated(userId, vendrCd) {
  // 사용자 로그인 (자동 로그인)
  pubLogin(userId, vendrCd);
}

// 사용자 로그인 (자동 로그인)
async function pubLogin(userId, vendrCd) {
  var msg = "";
  try {
    let autoChk = document.getElementById("loginChk").checked;
    if (autoChk) {
      loginStore.$state.idSave = autoChk;
      loginStore.$patch({ idSave: autoChk });
    }

    pubLoginParams.userId = userId;
    pubLoginParams.vendrCd = vendrCd;

    const loginResult = await loginStore.pubLogin(pubLoginParams);
    if (loginResult.status === 200) {
      if (loginStore.$state.accessToken != "undefined") {
        // 로그인 성공 후 로컬스토리지 값 삭제
        window.localStorage.removeItem("wUserId");
        window.localStorage.removeItem("wVendrCd");

        router.push({
          path: "/main",
        });
      } else {
        msg = loginResult.message;

        dialogStore.openAlertDialog(msg, { type: "error" });
      }
    } else {
      msg = loginResult.data.message;

      dialogStore.openAlertDialog(msg, { type: "error" });
    }
  } catch (err) {
    console.log("LoginPage.vue > login() > err: ", err);
    throw err;
  }
}

// 로그인
async function login() {
  var msg = "";
  try {
    let autoChk = document.getElementById("loginChk").checked;
    if (autoChk) {
      loginStore.$state.idSave = autoChk;
      loginStore.$patch({ idSave: autoChk });

      // localStorage 만료 시간 설정
      localStorageExpiration();
    }
    const loginResult = await loginStore.login(loginParams);
    if (loginResult.status === 200) {
      if (loginStore.$state.accessToken != "undefined") {
        if (idSave) {
          // localStorage 만료 시간 설정
          //localStorageExpiration();
          loginStore.$state.idSave = true;
        }

        router.push({
          path: "/main",
        });
      } else {
        msg = loginResult.message;
        dialogStore.openAlertDialog(msg, { type: "error" });
      }
    } else {
      msg = loginResult.data.message;
      dialogStore.openAlertDialog(msg, { type: "error" });
    }
  } catch (err) {
    console.log("LoginPage.vue > login() > err: ", err);
    throw err;
  }
}

// localStorage 만료 시간 설정
function localStorageExpiration() {
  const key = "wExprTime";
  const expirationDays = "30";

  const now = new Date();
  const expirationTime = now.getTime() + expirationDays * 24 * 60 * 60 * 1000; // 현재 시간에 30일을 더하여 밀리초로 계산

  localStorage.setItem(key, expirationTime);
}

// 이메일 저장 여부 체크
function loginCheck() {
  // default 로그인 유지 체크 셋팅
  document.getElementById("loginChk").checked = true;

  // localStorage 아이디, 패스워드 저장 되있는경우 불러옴

  // 사용자 ID
  const wUserId = window.localStorage.getItem("wUserId");

  // 사용자 회사 코드(사용자 로그인일 경우)
  const wVendrCd = window.localStorage.getItem("wVendrCd");

  // 셀 클릭 아닌 경우 (조회 팝업 일떄)
  if (!cUtil.nullCheck(wUserId)) {
    // 사용자 스토리지 유지시간 체크 (사용자 스토리지 유지시간)
    const retrievedToken = localStorageExpirationChk("wExprTime");

    // 스토리지 유지시간 지나지 않은 경우
    if (retrievedToken) {
      document.getElementById("loginChk").checked = true;
      userId.value = wUserId;
      // 자동 로그인
      //chkDuplicated();
      // 스토리지 유지시간 지난 경우
    } else {
      // 비밀번호 초기화
      userId.value = "";
      // 로그아웃 클릭 시 localStorage 삭제 (id, 유지 시간)
      window.localStorage.getItem("wUserId");
    }

    // 사용자 회사 코드 (사용자 로그인일 경우)
    if (!cUtil.nullCheck(wVendrCd)) {
      // 사용자 로그인 자동 로그인
      autoChkDuplicated(wUserId, wVendrCd);
    }
  }
}

// 사용자 스토리지 유지시간 체크
function localStorageExpirationChk(ExprTimekey) {
  const storedItem = localStorage.getItem(ExprTimekey);

  if (!storedItem) {
    return null; // 저장된 항목이 없는 경우
  }

  //const parsedItem = JSON.parse(storedItem);

  // 만료 시간 확인
  const now = new Date();

  if (now.getTime() > storedItem) {
    localStorage.removeItem(ExprTimekey); // 만료된 경우 로컬 스토리지에서 제거
    return null;
  }

  return storedItem;
}

onMounted(() => {
  // 이메일 저장 여부 체크
  loginCheck();
});

// 회원가입 팝업창 열기
function memberRegist() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("member_regist")[0].classList.add("show");
}

// 회원가입 팝업창에서 인증번호 확인 버튼 성공 시 무료가입 버튼 활성화
function getIsAbleRegBtn(isAbled) {
  wait.value = !isAbled;
}

// 무료가입 버튼
async function registMemInfo() {
  regInfo.value = memInfo.value.updateInfo();

  if (regInfo.value.msg.vendrNm != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.vendrNm);
    return;
  } else if (regInfo.value.msg.busNo != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.busNo);
    return;
  } else if (regInfo.value.msg.userNm != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.userNm);
    return;
  } else if (regInfo.value.msg.userId != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.userId);
    return;
  } else if (regInfo.value.msg.userPw != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.userPw);
    return;
  } else if (regInfo.value.msg.chkPw != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.chkPw);
    return;
  } else if (regInfo.value.msg.crryTelNo != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.crryTelNo);
    return;
  } else if (regInfo.value.msg.certNum != "") {
    dialogStore.openAlertDialog(regInfo.value.msg.certNum);
    return;
  } else if (!regInfo.value.terms) {
    dialogStore.openAlertDialog("이용약관을 확인하세요.");
    return;
  } else if (!regInfo.value.privacy) {
    dialogStore.openAlertDialog("개인정보 처리방침을 확인하세요.");
    return;
  } else if (regInfo.value.indstClsCd == "") {
    alert("산업구분을 선택하세요.");
    return;
  }
  const params = {
    vendrNm: regInfo.value.vendrNm,
    busNo: regInfo.value.busNo,
    userNm: regInfo.value.userNm,
    userId: regInfo.value.userId,
    userPw: regInfo.value.userPw,
    crryTelNo: regInfo.value.crryTelNo,
    rcmdtnVendrCd: regInfo.value.rcmdtnVendrCd,
    admAcctYn: "Y",
    indstClsCd: regInfo.value.indstClsCd,
  };
  var msg = "";

  try {
    const res = await loginAuthService.join(params);

    if (res.data === "OK") {
      msg = "회원가입이 완료되었습니다.";

      document.getElementsByClassName("popup_bg")[0].classList.remove("show");
      document
        .getElementsByClassName("member_regist")[0]
        .classList.remove("show");

      dialogStore.openToastDialog(msg);
      memInfo.value.reset();
    } else {
      msg = res.data.message;

      dialogStore.openAlertDialog(msg, { type: "error" });
    }
  } catch (err) {
    console.log("LoginPage.vue > registMemInfo > error : ", err);
    msg = err;
    dialogStore.openAlertDialog(msg, { type: "error" });
    throw err;
  }
}

// 비밀번호 초기화
function resetPassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("reset_password")[0].classList.add("show");
}

// 비밀번호 초기화 - 임시 비밀번호 발급 - 인증 성공시 버튼 활성화
async function resetPasswd(isAbled) {
  wait.value = !isAbled;
}

//임시 비밀번호 받기 버튼
async function getTempPw() {
  pwInfo.value = resetPwInfo.value.resetPasswd();

  if (pwInfo.value.msg.userId != "") {
    dialogStore.openAlertDialog(pwInfo.value.msg.userId);
    return;
  } else if (pwInfo.value.msg.crryTelNo != "") {
    dialogStore.openAlertDialog(pwInfo.value.msg.crryTelNo);
    return;
  } else if (pwInfo.value.msg.certNum != "") {
    dialogStore.openAlertDialog(pwInfo.value.msg.certNum);
    return;
  }

  const params = {
    userId: pwInfo.value.userId,
    crryTelNo: pwInfo.value.crryTelNo.replaceAll("-", ""),
    tmplCd: "022",
  };

  try {
    const res = await loginAuthService.updateUserTempPw(params);
    if (res.data === "OK") {
      dialogStore.openToastDialog(
        "입력하신 이메일과 휴대폰 번호로 임시 비밀번호가 발송되었습니다."
      );

      document.getElementsByClassName("popup_bg")[0].classList.remove("show");
      document
        .getElementsByClassName("reset_password")[0]
        .classList.remove("show");
    } else {
      dialogStore.openAlertDialog(res.data.message, { type: "error" });
    }
  } catch (err) {
    console.log("LoginPage.vue > updateUserTempPw > error : ", err);
    throw err;
  }
}

// 협력사 선택 확인
// function sendData(event) {
// 	loginParams.vendrCd = selVendrCd.value;
// 	popupClose(event);
// 	login();
// }

// 팝업창 닫기
function popupClose(event) {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 중복 이메일 로그인 시 회원사 선택 팝업
async function companySelect(loginData) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("company_select")[0].classList.add("show");
  venList.value = loginData;
}

// 중복 이메일 회원사 선택 시 회사코드 추출
function getVendrCd(vendrCd) {
  selVendrCd.value = vendrCd;
  loginParams.vendrCd = vendrCd;

  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("company_select")[0].classList.remove("show");

  login();
}

onBeforeMount(() => {});

// 스크롤 시 상단 바 사이즈 변경
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    document.getElementsByClassName("index_top")[0].classList.add("scroll");
    document
      .getElementsByClassName("index_login_box")[0]
      .classList.add("scroll");
  } else {
    document.getElementsByClassName("index_top")[0].classList.remove("scroll");
    document
      .getElementsByClassName("index_login_box")[0]
      .classList.remove("scroll");
  }
});

// 로그인창
const isPopLoginIndex = ref(false);
function indexLogin() {
  isPopLoginIndex.value = true;
}

// contactUs 팝업
const isContacUsOpen = ref(false);

// 알림소식 팝업
const isNotifyNewsPopup = ref(false);
const toggleNotifyNewsPopup = () => {
  isNotifyNewsPopup.value = !isNotifyNewsPopup.value;
};

function openGoogleStore() {
  // 구글 스토어 링크
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=com.asianaidt.tapp&hl=ko-KR";
  // 새 창 열기
  window.open(googlePlayLink, "_blank");
}

function openAppleStore() {
  const appStoreLink = "https://apps.apple.com/kr/app/plan2do/id6473452985";
  window.open(appStoreLink, "_blank");
}
</script>

<style scoped>
.login_box {
  display: none;
  position: fixed;
  z-index: 9999;
}
.login_box.show {
  display: block;
}

.member_regist {
  width: 520px;
  height: auto;
}

.company_select {
  width: 400px;
  height: auto;
}

button[disabled] {
  cursor: not-allowed !important;
}
.temp_id {
  position: absolute;
  right: 420px;
  top: 20px;
  width: 150px;
  line-height: 30px;
  padding: 20px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.5);
}
.temp_id label {
  display: inline-block;
  color: #000;
}

.test {
  display: none;
  position: absolute;
  top: 100px;
  left: 100px;
  width: 800px;
  height: 600px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #aaaaaa;
  z-index: 999;
}
.grid_multichk {
  height: 100%;
}
</style>
