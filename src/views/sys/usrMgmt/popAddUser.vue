<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="content_box">
    <div class="item_wrap w100p">
      <span class="title">사용자 ID</span>
      <input
        type="text"
        v-model="regUserId"
        @blur="validateCheck($event), cUtil.checkEmail($event)"
        class="btn_input"
        placeholder="이메일을 입력하세요" />
      <div style="display: none" id="msgId"></div>
      <button @click="isValidUserId($event)">중복확인</button>
    </div>

    <div class="item_wrap w100p">
      <span class="title">사용자이름</span>
      <input
        type="text"
        v-model="regUserNm"
        @blur="validateCheck($event)"
        class="btn_input"
        placeholder="이름을 입력하세요" />
      <div style="display: none" id="msgNm"></div>
    </div>

    <div class="item_wrap w100p">
      <span class="title">소속회사</span>
      <select v-model="partner" @change="changePartner">
        <option v-for="list in partnerList" :key="list" :value="list.vendrCd">
          {{ list.vendrNm }}
        </option>
      </select>
      <button @click="addVendr">추가</button>
    </div>

    <div class="item_wrap w100p">
      <span class="title">직위</span>
      <input
        type="text"
        v-model="workNm"
        id="workNm"
        class="btn_input"
        placeholder="직위를 입력하세요" />
      <div style="display: none"></div>
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
      <div style="display: none" id="msgTel"></div>
    </div>

    <div class="item_wrap w100p">
      <span class="title">관리자 여부</span>
      <!-- <div id="switchId" class="switch off"> -->
      <div
        id="switchId"
        :class="modAdmAcctYn == 'Y' ? 'switch on' : 'switch off'"
        v-if="getVendrUpperCd(partner) === '0'">
        <div class="click_area" @click="switchItem"></div>
        <input v-model="modAdmAcctYn" />
        <div class="dot"></div>
        <span></span>
      </div>
      <div v-else class="switch disable">
        <input v-model="modAdmAcctYn" disabled />
        <div class="dot"></div>
        <span></span>
      </div>
    </div>

    <!-- <div class="sign_area">
      <div class="title">서명</div>
    </div> -->
  </div>
</template>

<script setup>
import usrMgmtService from "@/api/services/sys/usr-mgmt-service";
import commonUtil from "@/utils/common-utils";
import {
  defineEmits,
  defineExpose,
  defineProps,
  getCurrentInstance,
  onMounted,
  ref,
} from "vue";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const props = defineProps([
  "partnerList",
  "formData",
  "regUserId",
  "regUserNm",
  "partner",
  "workNm",
  "crryTelNo",
  "modAdmAcctYn",
]);
const cUtil = commonUtil;

const regUserId = ref("");
const regUserNm = ref("");
const workNm = ref("");
const crryTelNo = ref("");
const isValid = ref(false);
const userInfo = ref({});

const parList = ref([]);
const partner = ref();

const validUserId = ref(false);

const emit = defineEmits(["loadData"]);

// 입력한 사용자 정보
let editUserInfo = ref({});

// 관리자 여부
const modAdmAcctYn = ref("");

const msg = {};

let testValue = ref("");

// 사용자 id
let userId = ref("");
// 사용자 명
let userNm = ref("");

// 입력값 validate
function validateCheck(e) {
  const title = ref("");
  const style = ref("");
  isValid.value = cUtil.nullCheck(e.target.value);
  if (e.target.classList.contains("btn_input")) {
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
  } else {
    e.target.nextElementSibling.classList.remove("notice");
    e.target.nextElementSibling.style.display = "none";
    e.target.nextElementSibling.innerHTML = "";
  }
}

// 사용여부
function switchItem(event) {
  if (event.target.parentElement.classList.contains("on")) {
    event.target.parentElement.classList.replace("on", "off");
    modAdmAcctYn.value = "N";

    // 직위 비활성화
    const modWorkNmBtn = document.getElementById("workNm");
    modWorkNmBtn.disabled = false;
    // 직위 초기화
    workNm.value = "";
  } else {
    event.target.parentElement.classList.replace("off", "on");
    modAdmAcctYn.value = "Y";

    // 직위 활성화
    const modWorkNmBtn = document.getElementById("workNm");
    modWorkNmBtn.disabled = true;
    // 직위 관리자
    workNm.value = "관리자";
  }
}

function validateEmail(email) {
  // 이메일 주소 검증
  const re =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;

  return re.test(email);
}

// ID 중복 확인
async function isValidUserId(e) {
  if (!validateEmail(regUserId.value)) {
    alert("이메일 형식에 맞게 입력하세요.");
    return;
  }

  if (regUserId.value != "") {
    const params = {
      userId: regUserId.value,
      vendrCd: $loginStore.$state.userInfo.vendrCd,
    };
    try {
      const res = await usrMgmtService.isValidUserId(params);
      if (res.data) {
        e.target.previousElementSibling.classList.add("notice");
        e.target.previousElementSibling.classList.add("btn_input");
        e.target.previousElementSibling.style.display = "block";
        e.target.previousElementSibling.style.right = "130px";
        e.target.previousElementSibling.innerHTML = "중복되는 ID가 존재합니다.";
        //e.target.previousElementSibling.previousElementSibling.value = "";
      } else {
        e.target.previousElementSibling.classList.remove("notice");
        e.target.previousElementSibling.style.display = "none";
        e.target.previousElementSibling.innerHTML = "";
        validUserId.value = true;
        alert("사용 가능한 이메일입니다.");
      }
    } catch (err) {
      console.log(
        "UsrMgmtPage.vue > popAddUser.vue > duplicateUserId() err : ",
        err
      );
      throw err;
    }
  } else {
  }
}

// 소속회사 추가
function addVendr() {
  editUserInfo.userId = regUserId.value;
  editUserInfo.userNm = regUserNm.value;
  editUserInfo.partner = partner.value;
  editUserInfo.workNm = workNm.value;
  editUserInfo.crryTelNo = crryTelNo.value;
  editUserInfo.modAdmAcctYn = modAdmAcctYn.value;

  // 입력한 사용자 정보
  emit("loadData", editUserInfo);

  parent.document.getElementsByClassName("popup_bg")[0].classList.add("show");
  parent.document.getElementsByClassName("add_vendr")[0].classList.add("show");
}

// 선택한 소속회사 상위코드 get
function getVendrUpperCd(vendrCd) {
  const vendrUpperCd = ref();
  parList.value.forEach((item) => {
    if (item.vendrCd === vendrCd) {
      vendrUpperCd.value = item.vendrUpperCd;
    }
  });

  return vendrUpperCd.value;
}

const updateInfo = () => {
  userInfo.userId = regUserId.value;
  userInfo.userNm = regUserNm.value;
  userInfo.vendrCd = partner.value;
  userInfo.vendrUpperCd = getVendrUpperCd(partner.value);
  userInfo.workNm = workNm.value;
  userInfo.crryTelNo = crryTelNo.value;
  userInfo.validId = validUserId.value;

  if (modAdmAcctYn.value == "") {
    userInfo.modAdmAcctYn = "N";
  } else {
    userInfo.modAdmAcctYn = modAdmAcctYn.value;
  }

  if (regUserId.value == "") {
    msg.userId =
      document.getElementById("msgId").previousElementSibling.placeholder;
  } else {
    msg.userId = document.getElementById("msgId").innerHTML;
  }

  if (regUserNm.value == "") {
    msg.userNm =
      document.getElementById("msgNm").previousElementSibling.placeholder;
  } else {
    msg.userNm = document.getElementById("msgNm").innerHTML;
  }

  if (
    partner.value == undefined ||
    partner.value == "" ||
    partner.value == null
  ) {
    msg.vendrCd = "소속회사를 선택하세요.";
  } else {
    msg.vendrCd = "";
  }

  if (crryTelNo.value == "") {
    msg.crryTelNo =
      document.getElementById("msgTel").previousElementSibling.placeholder;
  } else {
    msg.crryTelNo = document.getElementById("msgTel").innerHTML;
  }

  userInfo.msg = msg;

  return userInfo;
};

const reset = () => {
  regUserId.value = "";
  regUserNm.value = "";
  partner.value = "";
  workNm.value = "";
  crryTelNo.value = "";
  validUserId.value = false;

  document.getElementById("msgId").style.display = "none";
  document.getElementById("msgNm").style.display = "none";
  document.getElementById("msgTel").style.display = "none";
};

defineExpose({
  updateInfo,
  reset,
});

onMounted(() => {
  // 입력된 사용자 정보
  regUserId.value = props.regUserId;
  regUserNm.value = props.regUserNm;
  partner.value = props.partner;
  workNm.value = props.workNm;
  crryTelNo.value = props.crryTelNo;
  modAdmAcctYn.value = props.modAdmAcctYn;

  let elm = document.getElementById("switchId");
  if (props.modAdmAcctYn == "Y") {
    elm = "switch on";
  } else if (props.modAdmAcctYn == "N") {
    elm = "switch off";
  }
  parList.value = props.partnerList;
});
</script>

<style scoped>
.content_box {
  height: 100%;
  margin-bottom: 0px;
}
.item_wrap .title {
  width: 100px;
}
.item_wrap input,
.item_wrap select {
  width: calc(100% - 250px);
}

.item_wrap .btn_input {
  width: calc(100% - 250px);
}

.sign_area {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  height: 230px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.sign_area .title {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: "Pretendard-B";
  font-size: 15px;
  color: #999999;
}
</style>
