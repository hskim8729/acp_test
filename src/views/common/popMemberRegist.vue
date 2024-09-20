<!-- 회원사 무료가입 -->

<template>
  <div class="content_box">
    <div class="item_wrap w100p">
      <span class="title">회사명</span>
      <input
        type="text"
        @blur="validateCheck($event)"
        v-model="vendrNm"
        placeholder="회사명을 입력하세요" />
      <div style="display: none" id="vendrNm"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">사업자번호</span>
      <input
        type="text"
        @input="cUtil.regexType($event, 'busNo')"
        @blur.prevent="validateCheck($event), cUtil.$chkBusNo($event)"
        v-model="busNo"
        maxlength="12"
        placeholder="사업자번호를 입력하세요" />
      <div style="display: none" id="busNo"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">산업구분</span>
      <select v-model="indstClsCd">
        <option disabled value="">선택</option>
        <option
          v-for="item in indstClsCdList"
          :key="item.comCd"
          :value="item.comCd">
          {{ item.comCdNm }}
        </option>
      </select>
      <v-divider class="join_divider"></v-divider>
    </div>
    <div class="item_wrap w100p">
      <span class="title">이름</span>
      <input
        type="text"
        v-model="userNm"
        @blur="validateCheck($event)"
        placeholder="이름을 입력하세요" />
      <div style="display: none" id="userNm"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">Email</span>
      <input
        type="text"
        v-model="userId"
        @input="cUtil.checkEmail($event)"
        @blur="validateCheck($event), cUtil.checkEmail($event)"
        placeholder="ID로 사용할 이메일을 입력하세요" />
      <div style="display: none" id="userId"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">비밀번호</span>
      <input
        type="password"
        v-model="userPw"
        @blur="validateCheck($event), validatePwchar($event)"
        placeholder="비밀번호를 입력하세요" />
      <div style="display: none" id="userPw"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">비밀번호 확인</span>
      <input
        type="password"
        v-model="chkPw"
        @blur="
          validateCheck($event), validatePw($event), validatePwchar($event)
        "
        placeholder="비밀번호를 다시 입력하세요" />
      <div style="display: none" id="chkPw"></div>
    </div>
    <div class="item_wrap w100p">
      <span class="title">휴대전화</span>
      <input
        type="text"
        v-model="crryTelNo"
        @input="cUtil.regexType($event, 'crryTelNo')"
        @blur="validateCheck($event), cUtil.chkCrryTelNo($event)"
        class="btn_input"
        id="crryTelNo"
        maxlength="13"
        placeholder="휴대폰 번호를 입력하세요" />
      <div style="display: none" id="crryTelNo"></div>
      <button @click="sendCertNum">인증번호 전송</button>
    </div>
    <div class="item_wrap w100p">
      <span class="title">인증번호</span>
      <input
        type="text"
        v-model="certNum"
        @blur="validateCheck($event)"
        class="btn_input cert_num"
        placeholder="인증 번호를 입력하세요" />
      <div style="display: none" id="certNum"></div>
      <span class="timer" v-html="timeValue" :key="timer.timer"></span>
      <button @click="confCertNum($event)">인증번호 확인</button>
    </div>
    <div class="item_wrap w100p">
      <span class="title">추천인/추천사</span>
      <input
        type="text"
        v-model="rcmdtnVendrCd"
        placeholder="가입 추천 받은 경우, 받으신 코드를 입력하세요" />
    </div>

    <div class="term_wrap">
      <input type="checkbox" id="chkAll" @click="checkAll" /><label for="chkAll"
        >모두 동의합니다.</label
      ><br />
      <input type="checkbox" id="chkTerm" />
      <label for="chkTerm"
        >이용약관 동의 (필수)
        <popBoardRead
          title="서비스 이용약관"
          openBtnText="[확인]"
          bbsClsCd="T2310"></popBoardRead></label
      ><br />
      <input type="checkbox" id="chkPrivacy" /><label for="chkPrivacy"
        >개인정보처리방침 동의 (필수)
        <popBoardRead
          title="개인정보처리방침"
          bbsClsCd="T2311"
          openBtnText="[확인]"></popBoardRead></label
      ><br />
    </div>
  </div>
</template>

<script setup>
import loginAuthService from "@/api/common/login-auth-service";
import commonUtil from "@/utils/common-utils";
import popBoardRead from "@/views/board/components/popBoardRead.vue";
import { defineEmits, defineExpose, onBeforeMount, onMounted, ref } from "vue";

const cUtil = commonUtil;
const memInfo = ref({});

const vendrNm = ref("");
const busNo = ref("");
const userNm = ref("");
const userId = ref("");
const userPw = ref("");
const chkPw = ref("");
const crryTelNo = ref("");
const certNum = ref("");
const isValid = ref(false);
const isSendCertNum = ref(false);
const confirmCertNo = ref("");
const rcmdtnVendrCd = ref("");
const emit = defineEmits(["update"]);
const timeValue = ref("");

const indstClsCdList = ref([]); // 산업구분
const indstClsCd = ref("");

let timer = {
  timer: null,
  count: 180,
  string: "03:00",
};

const msg = {};

// 입력값 validate
async function validateCheck(e) {
  const title = ref("");
  const style = ref("");
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
    return;
  } else {
    e.target.nextElementSibling.classList.remove("notice");
    e.target.nextElementSibling.style.display = "none";
    e.target.nextElementSibling.innerHTML = "";
  }
}

// 비밀번호 확인 검증
function validatePw(e) {
  if (userPw.value != e.target.value) {
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.innerHTML = "비밀번호가 일치하지 않습니다.";
    return;
  }
}

// 비밀번호 대,소문자, 숫자, 특수문자 포함 여부 확인 검증
function validatePwchar(e) {
  const passwordToCheck = e.target.value;

  if (!validatePassword(passwordToCheck)) {
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.innerHTML =
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다.";
    return;
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
  var regEmail =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;
  let valid = false;
  if (regEmail.test(userId.value)) {
    valid = true;
  }
  if (regPhone.test(crryTelNo.value)) {
    if (crryTelNo.value != "") {
      if (timer.timer) {
        if (!confirm("인증번호를 재전송하시겠습니까?")) return;
        stopTimer(timer.timer);
      }
      const params = {
        userId: userId.value,
        crryTelNo: crryTelNo.value.replaceAll("-", ""),
        tmplCd: "001",
      };
      try {
        const res = await loginAuthService.sendNotificationTalk(params);

        if (res.status == 200) {
          alert("인증번호가 전송되었습니다.");
          confirmCertNo.value = res.data.tmpParam;
          e.target.innerHTML = "인증번호 재전송";
          timer.timer = setTimer(e);
          isSendCertNum.value = true;
        } else {
          alert(res.data.message);
          return;
        }
      } catch (err) {
        console.log(
          "popResetPassword.vue > sendCertNum() > sendNotificationTalk err : ",
          err
        );
        throw err;
      }
    } else {
      alert("휴대전화 번호를 확인하세요.");
      return;
    }
  } else {
    alert("전화번호를 정확히 입력하세요.");
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
  //console.log("timer===", timerData);
  return timerData;
}

// 인증번호 확인 버튼
function confCertNum() {
  if (!isSendCertNum.value) {
    alert("휴대폰으로 발송된 인증번호를 입력하세요.");
    return;
  } else {
    if (crryTelNo.value != "" && certNum.value != "") {
      if (certNum.value === confirmCertNo.value) {
        alert("인증이 정상적으로 완료되었습니다.");
        stopTimer(timer.timer);

        const isAbled = ref();
        isAbled.value = isSendCertNum.value;
        emit("update", isAbled.value);
        isSendCertNum.value = false;
      } else {
        alert("인증번호가 일치하지 않습니다.");
        return;
      }
    } else {
      alert("휴대전화 번호 인증이 필요합니다.");
      return;
    }
  }
}

// 이용약관 전체 동의
async function checkAll(e) {
  const chkTerm = document.getElementById("chkTerm");
  const chkPrivacy = document.getElementById("chkPrivacy");

  if (e.target.checked) {
    chkTerm.checked = true;
    chkPrivacy.checked = true;
  } else {
    chkTerm.checked = false;
    chkPrivacy.checked = false;
  }
}

// LoginPage.vue에서 무료가입 버튼 클릭 시 넘어갈 데이터
const updateInfo = () => {
  memInfo.vendrNm = vendrNm.value;
  memInfo.busNo = busNo.value.replaceAll("-", "");
  memInfo.userId = userId.value;
  memInfo.userNm = userNm.value;
  memInfo.userPw = userPw.value;
  memInfo.chkPw = chkPw.value;
  memInfo.crryTelNo = crryTelNo.value.replaceAll("-", "");
  memInfo.certNum = certNum.value;
  memInfo.confirmCertNo = confirmCertNo.value;
  memInfo.rcmdtnVendrCd = rcmdtnVendrCd.value;
  memInfo.isSendCertNum = isSendCertNum.value;
  memInfo.indstClsCd = indstClsCd.value;

  const chkTerm = document.getElementById("chkTerm");
  const chkPrivacy = document.getElementById("chkPrivacy");

  memInfo.terms = chkTerm.checked;
  memInfo.privacy = chkPrivacy.checked;

  if (vendrNm.value == "") {
    msg.vendrNm =
      document.getElementById("vendrNm").previousElementSibling.placeholder;
  } else {
    msg.vendrNm = document.getElementById("vendrNm").innerHTML;
  }

  if (busNo.value == "") {
    msg.busNo =
      document.getElementById("busNo").previousElementSibling.placeholder;
  } else {
    msg.busNo = document.getElementById("busNo").innerHTML;
  }

  if (userNm.value == "") {
    msg.userNm =
      document.getElementById("userNm").previousElementSibling.placeholder;
  } else {
    msg.userNm = document.getElementById("userNm").innerHTML;
  }

  if (userId.value == "") {
    msg.userId =
      document.getElementById("userId").previousElementSibling.placeholder;
  } else {
    msg.userId = document.getElementById("userId").innerHTML;
  }

  if (userPw.value == "") {
    msg.userPw =
      document.getElementById("userPw").previousElementSibling.placeholder;
  } else {
    msg.userPw = document.getElementById("userPw").innerHTML;
  }

  if (chkPw.value == "") {
    msg.chkPw =
      document.getElementById("chkPw").previousElementSibling.placeholder;
  } else {
    msg.chkPw = document.getElementById("chkPw").innerHTML;
  }

  if (crryTelNo.value == "") {
    msg.crryTelNo =
      document.getElementById("crryTelNo").previousElementSibling.placeholder;
  } else {
    msg.crryTelNo = document.getElementById("crryTelNo").innerHTML;
  }

  if (certNum.value == "") {
    msg.certNum =
      document.getElementById("certNum").previousElementSibling.placeholder;
  } else {
    msg.certNum = document.getElementById("certNum").innerHTML;
  }

  memInfo.msg = msg;

  return memInfo;
};

const reset = () => {
  vendrNm.value = "";
  busNo.value = "";
  userId.value = "";
  userNm.value = "";
  userPw.value = "";
  chkPw.value = "";
  crryTelNo.value = "";
  certNum.value = "";
  confirmCertNo.value = "";
  rcmdtnVendrCd.value = "";

  const chkAll = document.getElementById("chkAll");
  const chkTerm = document.getElementById("chkTerm");
  const chkPrivacy = document.getElementById("chkPrivacy");

  chkAll.checked = false;
  chkTerm.checked = false;
  chkPrivacy.checked = false;
};

defineExpose({
  updateInfo,
  reset,
});

onBeforeMount(async () => {
  const res1 = await loginAuthService.selectIndstClsCdList();

  indstClsCdList.value = res1.data; // 산업구분
});

onMounted(() => {
  if (timer.timer != null) {
    stopTimer(timer.timer);
    timer.timer = null;
  }
});
</script>

<style scoped>
.content_box {
  max-height: 450px;
  margin: 0px;
  overflow: auto;
  margin: 0px;
}

.item_wrap .title {
  width: 100px;
  text-align: right;
}

.item_wrap input {
  width: calc(100% - 130px);
}

.item_wrap .btn_input {
  width: calc(100% - 260px);
}
.item_wrap .btn_input.cert_num::placeholder {
  font-size: 0px;
}

.item_wrap button {
  width: 120px;
  margin-left: 10px;
}
.timer {
  position: absolute;
  left: 242px;
  top: 11px;
  font-size: 12px;
  color: #ff6600;
}
.join_divider {
  float: left;
  width: 100%;
  line-height: 26px;
  margin-top: 10px;
}
</style>
