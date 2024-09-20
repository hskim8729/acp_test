<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="content_box">
    <div class="item_wrap w100p">
      <span class="title">사용자 ID</span>
      <input
        type="text"
        class="btn_input"
        v-model="modUserId"
        disabled="disabled" />
    </div>

    <div class="item_wrap w100p">
      <span class="title">사용자이름</span>
      <input
        type="text"
        v-model="modUserNm"
        @blur="validateCheck($event)"
        class="btn_input"
        placeholder="이름을 입력하세요" />
      <div style="display: none" id="msgModNm"></div>
    </div>

    <div class="item_wrap w100p">
      <span class="title">소속회사</span>
      <select
        class="btn_input"
        v-model="modPartner"
        @change="changePartner"
        id="modPartner">
        <option v-for="list in partnerList" :key="list" :value="list.vendrCd">
          {{ list.vendrNm }}
        </option>
      </select>
      <!-- <button @click="addVendr" id="addVendr">추가</button> -->
    </div>

    <div class="item_wrap w100p">
      <span class="title">직위</span>
      <input
        type="text"
        v-model="modWorkNm"
        class="btn_input"
        id="modWorkNm"
        placeholder="직위를 입력하세요" />
      <div style="display: none"></div>
    </div>

    <div class="item_wrap w100p">
      <span class="title">휴대전화</span>
      <input
        type="text"
        v-model="modCrryTelNo"
        @input="cUtil.regexType($event, 'crryTelNo')"
        @blur="validateCheck($event), cUtil.chkCrryTelNo($event)"
        class="btn_input"
        id="modCrryTelNo"
        maxlength="13"
        placeholder="휴대폰 번호를 입력하세요" />
      <div style="display: none" id="msgModTel"></div>
    </div>

    <div class="item_wrap w100p">
      <span class="title">관리자 여부</span>
      <div
        :class="modAdmAcctYn == 'Y' ? 'switch on' : 'switch off'"
        v-if="getVendrUpperCd(modPartner) == '0'">
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
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  defineProps,
  onMounted,
  defineEmits,
  defineExpose,
  getCurrentInstance,
} from "vue";
import usrMgmtService from "@/api/services/sys/usr-mgmt-service";
import commonUtil from "@/utils/common-utils";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const props = defineProps(["partnerList", "modInfo"]);
const cUtil = commonUtil;

const modUserId = ref("");
const modUserNm = ref("");
const modWorkNm = ref("");
const modCrryTelNo = ref("");

// 관리자 여부
const modAdmAcctYn = ref("");

const isValid = ref(false);
const userInfo = ref({});

const parList = ref([]);
const modPartner = ref();

const msg = {};

let originWrkNm = ref();

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
    const modWorkNmBtn = document.getElementById("modWorkNm");
    modWorkNmBtn.disabled = false;
    // 조회 된 기존 직위명
    modWorkNm.value = originWrkNm.value;
  } else {
    event.target.parentElement.classList.replace("off", "on");
    modAdmAcctYn.value = "Y";

    // 직위 활성화
    const modWorkNmBtn = document.getElementById("modWorkNm");
    modWorkNmBtn.disabled = true;
    modWorkNm.value = "관리자";
  }
}

// // 소속회사 추가
// function addVendr() {
//   parent.document.getElementsByClassName("popup_bg")[0].classList.add("show");
//   parent.document.getElementsByClassName("add_vendr")[0].classList.add("show");
// }

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

// 선택한 소속회사 관리자 여부 get
function getAdmAcctYn(vendrCd) {
  const admAcctYn = ref();
  parList.value.forEach((item) => {
    if (item.vendrCd === vendrCd) {
      admAcctYn.value = item.admAcctYn;
    }
  });
  return admAcctYn.value;
}

const updateInfo = () => {
  userInfo.userId = modUserId.value;
  userInfo.userNm = modUserNm.value;
  userInfo.vendrCd = modPartner.value;
  userInfo.vendrUpperCd = getVendrUpperCd(modPartner.value);
  userInfo.workNm = modWorkNm.value;
  // if (getAdmAcctYn(modPartner.value) == "Y") {
  //   userInfo.admAcctYn = "Y";
  // } else {
  //   userInfo.admAcctYn = "N";
  // }
  userInfo.crryTelNo = modCrryTelNo.value;

  userInfo.modAdmAcctYn = modAdmAcctYn.value;

  if (modUserNm.value == "") {
    msg.userNm =
      document.getElementById("msgModNm").previousElementSibling.placeholder;
  } else {
    msg.userNm = document.getElementById("msgModNm").innerHTML;
  }

  if (
    modPartner.value == undefined ||
    modPartner.value == "" ||
    modPartner.value == null
  ) {
    msg.vendrCd = "소속회사를 선택하세요.";
  } else {
    msg.vendrCd = "";
  }

  if (modCrryTelNo.value == "") {
    msg.crryTelNo =
      document.getElementById("msgModTel").previousElementSibling.placeholder;
  } else {
    msg.crryTelNo = document.getElementById("msgModTel").innerHTML;
  }

  userInfo.msg = msg;

  return userInfo;
};

const reset = () => {
  modUserId.value = "";
  modUserNm.value = "";
  modPartner.value = "";
  modWorkNm.value = "";
  modCrryTelNo.value = "";

  document.getElementById("msgModNm").style.display = "none";
  document.getElementById("msgModTel").style.display = "none";
};

const modify = (params) => {
  // 기존 직위 명
  originWrkNm.value = params.workNm;

  modUserId.value = params.userId;
  modUserNm.value = params.userNm;
  modPartner.value = params.vendrCd;
  parList.value = props.partnerList;
  const adm = params.admAcctYn;

  // 관리자 여부
  modAdmAcctYn.value = params.admAcctYn;

  if (adm == "Y") {
    modWorkNm.value = "관리자";
    document.getElementById("modWorkNm").disabled = "disabled";
    document.getElementById("modPartner").disabled = "disabled";
    //document.getElementById("addVendr").style.display = "none";
  } else {
    modWorkNm.value = params.workNm;
    //document.getElementById("addVendr").style.display = "";
    // 사용자 직위 활성화
    const modWorkNmBtn = document.getElementById("modWorkNm");
    modWorkNmBtn.disabled = false;

    document.getElementById("modPartner").disabled = "disabled";

    // 소속회사 활성화
    // const modPartnerBtn = document.getElementById("modPartner");
    // modPartnerBtn.disabled = false;
  }

  const tel = params.crryTelNo;
  modCrryTelNo.value =
    tel.substring(0, 3) + "-" + tel.substring(3, 7) + "-" + tel.substring(7);
};

defineExpose({
  updateInfo,
  modify,
  reset,
});

onMounted(() => {});
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
  width: 210px;
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
