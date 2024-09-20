<!-- 추가위험발굴/팝업-추가위험 등록 -->

<template>
  <div class="content_box">
    사용중인 고객사 관리자 이메일과 등록된 휴대폰 번호를 입력해 주세요.<br />
    이메일과 휴대폰으로 임시 비밀번호를 전송해 드립니다.<br />
    받으신 임시 비밀번호로 로그인 후 비밀번호를 재설정 해주세요.
  </div>
  <div class="content_box">
    <div class="item_wrap w100p">
      <span class="title">Email</span>
      <input
        type="text"
        v-model="userId"
        @blur="validateCheck($event), cUtil.checkEmail($event)"
        placeholder="이메일을 입력하세요" />
      <div style="display: none" id="userId"></div>
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
  </div>
</template>

<script setup>
import loginAuthService from "@/api/common/login-auth-service";
import commonUtil from "@/utils/common-utils";
import { defineEmits, defineExpose, onMounted, ref } from "vue";

const cUtil = commonUtil;

const isValid = ref(false);
const userId = ref("");
const crryTelNo = ref("");
const certNum = ref("");
const confirmCertNo = ref("");
const emit = defineEmits(["update"]);

const timeValue = ref("");
const isSendCertNum = ref(false);

let timer = {
  timer: null,
  count: 180,
  string: "03:00",
};

const resetPwInfo = ref({});

const msg = {};

// 입력값 validate
function validateCheck(e) {
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
    e.target.nextElementSibling.innerHTML = title.value + "을(를) 입력하세요.";
    return;
  } else {
    e.target.nextElementSibling.classList.remove("notice");
    e.target.nextElementSibling.style.display = "none";
    e.target.nextElementSibling.innerHTML = "";
  }
}

async function formatInput(e) {
  const regExp = /[ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g;

  if (regExp.test(e.target.value)) {
    //e.target.value = e.target.value.replace(regExp, "");
    e.target.value = await e.target.value.slice(0, -1);
  }
  return e.target.value;
}

// 인증번호 전송 버튼
async function sendCertNum(e) {
  var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/;
  var regEmail =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;
  let valid = false;
  let sendValid = false;
  if (regEmail.test(userId.value)) {
    valid = true;
  }
  if (regPhone.test(crryTelNo.value)) {
    const validUser = {
      userId: userId.value,
      crryTelNo: crryTelNo.value.replaceAll("-", ""),
    };
    try {
      const res = await loginAuthService.isValidUser(validUser);
      if (res.data) {
        if (crryTelNo.value != "" && valid) {
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
        } else if (userId.value === "") {
          alert("이메일 주소를 입력하세요.");
          return;
        } else if (!valid) {
          alert("이메일 형식에 맞게 입력하세요.");
          return;
        } else {
          alert("휴대전화 번호를 확인하세요.");
          return;
        }
      } else {
        alert(
          "입력하신 정보와 일치하는 고객정보가 없습니다.\n 이메일 주소와 휴대전화 번호를 확인해주세요."
        );
        return;
      }
    } catch (err) {
      console.log(
        "popResetPassword.vue > sendCertNum() > isValidUser err : ",
        err
      );
      throw err;
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

// LoginPage.vue에서 무료가입 버튼 클릭 시 넘어갈 데이터
const resetPasswd = () => {
  resetPwInfo.userId = userId.value;
  resetPwInfo.crryTelNo = crryTelNo.value;
  resetPwInfo.certifyNo = certNum.value;

  if (userId.value == "") {
    msg.userId =
      document.getElementById("userId").previousElementSibling.placeholder;
  } else {
    msg.userId = document.getElementById("userId").innerHTML;
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

  resetPwInfo.msg = msg;

  return resetPwInfo;
};

defineExpose({
  resetPasswd,
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
  line-height: 26px;
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
  left: 234px;
  top: 6px;
  font-size: 12px;
  color: #ff6600;
}
</style>
