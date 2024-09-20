<template>
  <div class="loginWrap">
    <div class="login_box">
      <div class="login_title_area"></div>

      <div class="temp_id">
        <input
          type="checkbox"
          id="loginSupervisor"
          name="loginBox"
          @click="loginType" />
        <label for="loginSupervisor" style="margin-right: 7px"
          >슈퍼바이저 계정</label
        >
        <input
          type="checkbox"
          id="loginAdmin"
          name="loginBox"
          @click="loginType" />
        <label for="loginAdmin" style="margin-right: 7px">관리자 계정</label>
        <input
          type="checkbox"
          id="loginUser"
          name="loginBox"
          @click="loginType" />
        <label for="loginUser" style="margin-right: 7px">사용자 계정</label>
      </div>
      <label>E-mail</label>
      <input type="text" v-model="userId" placeholder="이메일을 입력하세요" />
      <label>Password</label>
      <input
        type="password"
        v-model="userPw"
        @keypress.enter="chkDuplicated"
        placeholder="패스워드를 입력하세요" />

      <div class="login_id_save">
        <input type="checkbox" id="loginChk" v-model="idSave" />
        <label for="loginChk">이메일 저장</label>
      </div>

      <button @click="chkDuplicated">로그인</button>

      <div class="line"></div>
      <div class="notice">
        안전보건플랫폼이 처음이신가요?
        <span @click="memberRegist">회원가입</span><br />
        비밀번호를 잊으셨나요?
        <span @click="resetPassword">비밀번호 초기화</span>
      </div>
    </div>
  </div>

  <div class="login_footer">
    <span>
      아시아나IDT(주)&nbsp;&nbsp;|&nbsp;&nbsp;대표이사:김응철&nbsp;&nbsp;|&nbsp;&nbsp;사업자번호:104-81-22547&nbsp;&nbsp;|&nbsp;&nbsp;plan2do@asianaidt.com&nbsp;&nbsp;|&nbsp;&nbsp;서울시
      종로구 우정국로 26 센트로폴리스 A동 23 (03161)
    </span>
    <span> © 2024 Plan2Do. All rights reserved. </span>
  </div>

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
      <button @click="getTempPw">임시비밀번호 받기</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>

  <!-- 협력사 선택 팝업 -->
  <div class="popup company_select">
    <div class="popup_title">
      <span>협력사 선택</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popCompanySelect
        :selData="venList"
        @update="getVendrCd"></popCompanySelect>
    </div>
    <div class="popup_button">
      <button @click="sendData">확인</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
};
</script>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import loginAuthService from "@/api/common/login-auth-service";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";

import popResetPassword from "./popResetPassword.vue";
import popMemberRegist from "./popMemberRegist.vue";
import popCompanySelect from "./popCompanySelect.vue";
import { onBeforeMount, onMounted, reactive, ref } from "vue";

const loginStore = useLoginAuthStore();

const router = useRouter();

let idUrl = ref("");
let pwUrl = ref("");

// 로그인 성공 시 userId 공백처리해야됨
const userId = ref(import.meta.env.PROD ? "" : idUrl);
const userPw = ref(import.meta.env.PROD ? "" : pwUrl);
const idSave = loginStore.$state.idSave;
//const loginType = ref(false);
const wait = ref(true);

// 로그인 파라미터
const loginParams = reactive({});

const cookieAT = VueCookies.get("AT");

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

async function loginType(e) {
  var chkType = document.getElementsByName("loginBox");
  chkType.forEach((item, idx) => {
    item.checked = false;
  });
  e.target.checked = true;

  if (e.target.id === "loginSupervisor") {
    idUrl.value = "supervisor@test.co.kr";
    pwUrl.value = "admin";
  } else if (e.target.id === "loginAdmin") {
    idUrl.value = "bb@test.co.kr";
    pwUrl.value = "1234";
  } else {
    idUrl.value = "elelel@naver.com";
    pwUrl.value = "1234";
  }
}

// 로그인 이메일 중복체크
async function chkDuplicated() {
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
    alert(chkLogin.data.message);
    return;
  }
}

// 로그인
async function login() {
  const loginResult = await loginStore.login(loginParams);
  if (loginResult.status === 200) {
    if (loginStore.$state.accessToken != "undefined") {
      if (idSave) {
        loginStore.$state.idSave = true;
      }

      router.push({
        path: "/main",
      });
    } else {
      alert(loginResult.message);
      return;
    }
  } else {
    alert(loginResult.data.message);
    return;
  }
}

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
  if (regInfo.value.vendrNm == "") {
    alert("회사명을 입력하세요.");
    return;
  } else if (regInfo.value.busNo == "") {
    alert("사업자 번호를 입력하세요.");
    return;
  } else if (regInfo.value.userNm == "") {
    alert("이름을 입력하세요.");
    return;
  } else if (regInfo.value.userId == "") {
    alert("Email주소를 입력하세요.");
    return;
  } else if (regInfo.value.userPw == "") {
    alert("비밀번호를 입력하세요.");
    return;
  } else if (regInfo.value.chkPw == "") {
    alert("비밀번호를 확인하세요.");
    return;
  } else if (regInfo.value.crryTelNo == "") {
    alert("휴대전화 번호를 입력하세요.");
    return;
  }
  const params = {
    vendrNm: regInfo.value.vendrNm,
    busNo: regInfo.value.busNo,
    userNm: regInfo.value.userNm,
    userId: regInfo.value.userId,
    userPw: regInfo.value.userPw,
    crryTelNo: regInfo.value.crryTelNo,
    admAcctYn: "Y",
  };

  try {
    const res = await loginAuthService.join(params);

    if (res.status === 200) {
      alert("회원가입이 완료되었습니다.");

      document.getElementsByClassName("popup_bg")[0].classList.remove("show");
      document
        .getElementsByClassName("member_regist")[0]
        .classList.remove("show");

      memInfo.value.reset();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log("LoginPage.vue > registMemInfo > error : ", err);
    throw err;
  }
}

// 비밀번호 초기화
function resetPassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("reset_password")[0].classList.add("show");
}

// 비밀번호 초기화 - 임시 비밀번호 발급
async function resetPasswd() {
  pwInfo.value = resetPwInfo.value.resetPasswd();
}

//임시 비밀번호 받기 버튼
async function getTempPw() {
  const params = {
    userId: pwInfo.value.userId,
    crryTelNo: pwInfo.value.crryTelNo.replaceAll("-", ""),
    certifyNo: pwInfo.value.certifyNo,
    admAcctYn: "N",
  };

  try {
    const res = await loginAuthService.resetPasswd(params);
    if (res.status === 200) {
      alert("입력하신 이메일로 임시 비밀번호가 발송되었습니다.");

      document.getElementsByClassName("popup_bg")[0].classList.remove("show");
      document
        .getElementsByClassName("reset_password")[0]
        .classList.remove("show");
    }
  } catch (err) {
    console.log("LoginPage.vue > resetPasswd > error : ", err);
    throw err;
  }
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

// 중복 이메일 로그인 시 회원사 선택 팝업
async function companySelect(loginData) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("company_select")[0].classList.add("show");
  venList.value = loginData;
}

// 중복 이메일 회원사 선택 시 회사코드 추출
function getVendrCd(vendrCd) {
  selVendrCd.value = vendrCd;
}

onBeforeMount(() => {});
</script>

<style scoped>
.reset_password {
  width: 500px;
  height: 480px;
}

.member_regist {
  width: 520px;
  height: 585px;
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
</style>
