<template>
  <div class="m_subtitle">내 정보 수정</div>
  <div class="m_content">
    <div class="item_wrap w100p">
      <span class="title">ID</span>
      <input type="text" v-model="userId" disabled />
    </div>
    <div class="item_wrap w100p">
      <span class="title">이름</span>
      <input type="text" v-model="userNm" disabled />
    </div>
    <div class="item_wrap w100p">
      <span class="title">회원사명</span>
      <input type="text" v-model="vendrNm" disabled />
    </div>
    <div class="item_wrap w100p">
      <span class="title">소속회사명</span>
      <input type="text" v-model="vendrNm" disabled />
    </div>
    <div class="item_wrap w100p">
      <span class="title">직책</span>
      <input type="text" v-model="jbttlNm" disabled />
    </div>
    <div class="item_wrap w100p">
      <span class="title"></span>
      <button @click="changePassword">비밀번호 변경</button>
    </div>
  </div>

  <div class="m_subtitle">서명관리</div>
  <div class="m_sign_wrap">
    <div class="sign">
      <img :src="srcUrl" :key="signInfo" />
    </div>
    <button
      @click="signRegist($loginStore.$state.userInfo.signImgAtchFileKey)"
      v-html="btnSign"></button>
  </div>

  <!-- 비밀번호 초기화 팝업 -->
  <div class="popup change_password">
    <div class="popup_title">
      <span>비밀번호 변경</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popChangePassword ref="passwdInfo"></popChangePassword>
    </div>
    <div class="popup_button">
      <button @click="changePasswd">변경</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>

  <!-- 서명등록 팝업 -->
  <div class="popup sign_regist">
    <div class="popup_title">
      <span>서명 등록</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popSignRegist ref="signFile" :key="signInfo"></popSignRegist>
    </div>
    <div class="popup_button">
      <button @click="saveSign">등록</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, getCurrentInstance, onMounted } from "vue";
import { myInfoStore } from "@/stores/common/myinfo-store";

import popChangePassword from "./popChangePassword.vue";
import popSignRegist from "./popSignRegist.vue";

import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useUsrMgmtStore } from "@/stores/sys/usr-mgmt-store";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const useLoginStore = useLoginAuthStore();
const userStore = useUsrMgmtStore();

const userId = ref("");
const userNm = ref("");
const vendrNm = ref("");
const jbttlNm = ref("");
const srcUrl = ref("");
const signFile = ref(null);
const signInfo = ref();
const passwdInfo = ref(null);
const url = import.meta.env.VITE_APP_API_DEV_URL;
const store = myInfoStore();
const btnSign = ref("");

function signRegist(fileKey) {
  if (fileKey != null && fileKey != "") {
    if (!confirm("등록된 서명을 지우고 다시 등록하시겠습니까?")) return;
  }
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("sign_regist")[0].classList.add("show");
}

function changePassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("change_password")[0].classList.add("show");
}

function popupClose(e) {
  // 입력한 비밀번호 초기화
  passwdInfo.value.reset();

  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  e.target.parentElement.parentElement.classList.remove("show");
}

function popClose(e) {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document
    .getElementsByClassName("change_password")[0]
    .classList.remove("show");
}

// 서명 파일 등록
async function saveSign() {
  if (!confirm("서명을 저장하시겠습니까?")) return;
  const sign = await signFile.value.getSign();
  if (sign != "" && sign != null) {
    const blob = await sign.data.blob();

    const ext = ".png";
    const name = $loginStore.$state.userInfo.userId;
    const vendrCd = $loginStore.$state.userInfo.vendrCd;
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
      const res = await store.saveMySignMgmt(formData);
      if (res.data == "OK") {
        alert("저장되었습니다.");
        document.getElementsByClassName("popup_bg")[0].classList.remove("show");
        document
          .getElementsByClassName("sign_regist")[0]
          .classList.remove("show");
        getMyInfo();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("m-myInfo.vue > saveSign() > err : ", err);
      throw err;
    }
  }
}

async function setInfo() {
  document.getElementsByClassName("m_page_title")[0].innerHTML = "내 정보";

  userId.value = $loginStore.$state.userInfo.userId;
  userNm.value = $loginStore.$state.userInfo.userNm;
  vendrNm.value = $loginStore.$state.vendrInfo.vendrNm;

  jbttlNm.value = $loginStore.$state.siteInfo.jbttlNm;

  //const btnId = document.getElementById("btnSign");
  //btnId.innerHTML = signBtn.value;
}

async function getMyInfo() {
  const params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
    userId: $loginStore.$state.userInfo.userId,
  };
  try {
    signInfo.value = await store.selectMySignMgmt(params);
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

// 대문자, 소문자, 숫자 포함 여부를 확인하는 정규식
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return regex.test(password);
}

async function changePasswd() {
  const pwInfo = passwdInfo.value.updateInfo();

  // 현재 비밀번호
  const userPw = pwInfo.recPassword;
  // 신규 비밀번호
  const passwordCheck = pwInfo.newPassword;
  // 신규 비밀번호 확인
  const passwordCheck2 = pwInfo.chkPassword;

  if (!validatePassword(passwordCheck)) {
    alert(
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다."
    );
    return;
  }
  if (!validatePassword(passwordCheck2)) {
    alert(
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다."
    );
    return;
  }

  if (pwInfo.newPassword != pwInfo.chkPassword) {
    alert("비밀번호 확인이 일치하지 않습니다.");
    return;
  } else {
    if (!confirm("비밀번호를 변경하시겠습니까?")) return;

    const params = {
      vendrCd: useLoginStore.$state.userInfo.vendrCd,
      userId: useLoginStore.$state.userInfo.userId,
      userPw: userPw,
      newPw: passwordCheck,
    };

    try {
      const res = await userStore.saveUserInfo(params);

      //const res = await loginStore.updateRstUserPw(params);
      if (res.data == "OK") {
        alert("정상적으로 변경되었습니다.");
        popClose();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("TopHeader.vue > changePw() > err : ", err);
      throw err;
    }
  }
}

onMounted(() => {
  setInfo();
});

onBeforeMount(() => {
  getMyInfo();
});
</script>

<style scoped>
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.item_wrap input {
  width: calc(100% - 110px);
}
.item_wrap button {
  width: calc(100% - 110px);
  margin: 0px;
}
.change_password,
.sign_regist {
  width: 345px;
  /* height:700px; */
}
</style>
