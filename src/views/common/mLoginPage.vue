<template>
  <div class="m_login_box">
    <div class="m_login_title_area"></div>
    <label>E-mail</label>
    <input
      type="text"
      id="idUserId"
      v-model="userId"
      placeholder="이메일을 입력하세요" />
    <label>Password</label>
    <input
      type="password"
      id="idUserPw"
      v-model="userPw"
      @keypress.enter="chkDuplicated"
      placeholder="패스워드를 입력하세요" />

    <div class="m_login_id_save">
      <input type="checkbox" id="loginChk" v-model="keepLogin" />
      <label for="loginChk">로그인 유지</label>
    </div>
    <button @click="chkDuplicated">로그인</button>
    <div class="line"></div>
    <div class="notice">
      비밀번호를 잊으셨나요? <span @click="resetPassword">비밀번호 초기화</span>
    </div>
  </div>

  <!-- 협력사 선택 팝업 -->
  <div class="popup company_select">
    <div class="popup_title">
      <span>회사를 선택하세요.</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popCompanySelect
        :selData="venList"
        @update="getVendrCd"></popCompanySelect>
    </div>
    <!-- <div class="popup_button">
			<button @click="sendData">확인</button>
			<button @click="popupClose">닫기</button>
		</div> -->
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
</template>

<script setup>
import loginAuthService from "@/api/common/login-auth-service";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import VueCookies from "vue-cookies";
import { useRouter } from "vue-router";

import commonUtil from "@/utils/common-utils";
import { onMounted, reactive, ref } from "vue";
import popCompanySelect from "./popCompanySelect.vue";
import popResetPassword from "./popResetPassword.vue";

const loginStore = useLoginAuthStore();
const router = useRouter();

let idUrl = ref("");
let pwUrl = ref("");

// 로그인 성공 시 userId 공백처리해야됨
const userId = ref(import.meta.env.PROD ? "" : idUrl);
const userPw = ref(import.meta.env.PROD ? "" : pwUrl);
const keepLogin = loginStore.$state.keepLogin;

// 모바일 웹 구분 값
const gubun = loginStore.$state.gubun;
loginStore.$state.gubun = "M";

//const loginType = ref(false);
const wait = ref(true);

// 로그인 파라미터
const loginParams = reactive({});

const cookieAT = VueCookies.get("AT");

// 이메일 중복체크 시 회원사 팝업창에 보일 회원사 리스트
const venList = ref();

// 이메일 중복체크 팝업창에서 가져온 회원사 코드
const selVendrCd = ref();

// 공통 유틸
const cUtil = commonUtil;

// 비밀번호 초기화 입력 정보
const resetPwInfo = ref(null);
const pwInfo = ref();

async function loginType(e) {
  var chkType = document.getElementsByName("loginBox");
  chkType.forEach((item, idx) => {
    item.checked = false;
  });
  e.target.checked = true;
}

// 로그인 이메일 중복체크
async function chkDuplicated() {
  let valid = false;

  // 이메일 입력 여부 체크
  if (userId.value == "") {
    alert("이메일을 입력하세요.");
    document.getElementById("idUserId").focus();
    return false;
  }

  // 이메일 validation 체크
  var regEmail =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;
  if (regEmail.test(userId.value)) {
    valid = true;
  }

  if (!valid) {
    alert("이메일 형식에 맞게 입력하세요.");
    document.getElementById("idUserId").focus();
    return false;
  }

  // 패스워드 입력 여부 체크
  if (userPw.value == "") {
    alert("비밀번호를 입력하세요.");
    document.getElementById("idUserPw").focus();
    return false;
  }

  loginParams.userId = userId.value;
  loginParams.userPw = userPw.value;
  const chkLogin = await loginStore.checkDuplicated(loginParams);

  //debugger;
  if (chkLogin.status === 200) {
    if (chkLogin.data.length > 1) {
      companySelect(chkLogin.data);
    } else {
      loginParams.vendrCd = chkLogin.data[0].vendrCd;
      login();
    }
  } else {
    console.log("chkLogin====", chkLogin);
    alert(chkLogin.data.message);
    return;
  }
}

// 로그인
async function login() {
  let autoChk = document.getElementById("loginChk").checked;

  if (autoChk) {
    loginStore.$state.keepLogin = autoChk;
    loginStore.$patch({ keepLogin: autoChk });

    // localStorage 만료 시간 설정
    localStorageExpiration();
  }

  var msg = "";
  const loginResult = await loginStore.login(loginParams);

  if (loginResult.status === 200) {
    if (loginStore.$state.accessToken != "undefined") {
      if (keepLogin) {
        // localStorage 만료 시간 설정
        //localStorageExpiration();
        loginStore.$state.keepLogin = true;
      }
      router.push({
        path: "/m-main",
      });
    } else {
      msg = loginResult.message;
      alert(msg);
    }
  } else {
    msg = loginResult.data.message;
    alert(msg);
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
    alert(pwInfo.value.msg.userId);
    return;
  } else if (pwInfo.value.msg.crryTelNo != "") {
    alert(pwInfo.value.msg.crryTelNo);
    return;
  } else if (pwInfo.value.msg.certNum != "") {
    alert(pwInfo.value.msg.certNum);
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
      alert("입력하신 이메일과 휴대폰 번호로 임시 비밀번호가 발송되었습니다.");

      document.getElementsByClassName("popup_bg")[0].classList.remove("show");
      document
        .getElementsByClassName("reset_password")[0]
        .classList.remove("show");
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log("LoginPage.vue > updateUserTempPw > error : ", err);
    throw err;
  }
}

// localStorage 만료 시간 설정
function localStorageExpiration() {
  const key = "mExprTime";
  const value = "exprTimeValue";
  const expirationDays = "30";

  const now = new Date();
  const expirationTime = now.getTime() + expirationDays * 24 * 60 * 60 * 1000; // 현재 시간에 30일을 더하여 밀리초로 계산

  const item = {
    value,
    expirationTime,
  };

  localStorage.setItem(key, expirationTime);
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

// 협력사 선택 확인
function sendData(event) {
  loginParams.vendrCd = selVendrCd.value;
  popupClose(event);
  login();
}

// 팝업창 닫기
function popupClose(event) {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 로그인 유지 여부 체크
function loginCheck() {
  // default 이메일 저장 체크 셋팅
  document.getElementById("loginChk").checked = true;

  // llocalStorage 아이디, 패스워드 저장 되있는경우 불러옴

  // 사용자 ID
  const keepUserId = window.localStorage.getItem("mUserId");
  // 사용자 PW
  const keepUserPw = window.localStorage.getItem("mUserPw");
  // 사용자 스토리지 유지시간
  const keepExprTime = window.localStorage.getItem("mExprTime");

  // 셀 클릭 아닌 경우 (조회 팝업 일떄)
  if (!cUtil.nullCheck(keepUserId) && !cUtil.nullCheck(keepUserPw)) {
    userId.value = keepUserId;
    userPw.value = keepUserPw;

    // 사용자 스토리지 유지시간 체크 (사용자 스토리지 유지시간)
    const retrievedToken = localStorageExpirationChk("mExprTime");

    // 스토리지 유지시간 지나지 않은 경우
    if (retrievedToken) {
      document.getElementById("loginChk").checked = true;
      // 자동 로그인
      chkDuplicated();
      // 스토리지 유지시간 지난 경우
    } else {
      // 비밀번호 초기화
      userPw.value = "";
      // 로그아웃 클릭 시 localStorage 삭제 (id, 유지 시간)
      window.localStorage.removeItem("mUserPw");
      window.localStorage.removeItem("mExprTime");
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
  // 로그인 유지 여부 체크
  loginCheck();
});
</script>

<style scoped>
.company_select {
  width: 400px;
  height: auto;
}
.temp_id {
  position: absolute;
  left: 0px;
  top: -80px;
  width: 100%;
  padding: 20px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.5);
}
.temp_id label {
  display: inline-block;
  color: #000;
}
.reset_password {
  width: 90%;
}
</style>
