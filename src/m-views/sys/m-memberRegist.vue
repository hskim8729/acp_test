<template>
  <mCompModal
    v-if="true"
    @close="closePopup"
    isActions
    @modal-action="registMember"
    modalTitle="회원가입"
    actionBtnText="회원가입하기"
    noInnerPadding>
    <v-form
      ref="formRef"
      validate-on="input"
      class="d-flex flex-column ga-2 bg-gray100">
      <!-- 회원 정보 -->
      <v-sheet class="d-flex flex-column ga-4 pa-4">
        <div class="text-gray900 text-subtitle-1">
          회원정보를 입력해 주세요.
        </div>
        <m-form-text label="아이디">
          <comp-input
            name="아이디"
            type="email"
            required
            v-model="memberInfo.userId"
            placeholder="아이디로 사용하실 이메일을 입력하세요" />
        </m-form-text>
        <m-form-text label="비밀번호">
          <comp-input
            name="비밀번호"
            type="password"
            required
            :rules="pwRules"
            v-model="memberInfo.userPw"
            placeholder="비밀번호를 입력하세요" />
        </m-form-text>
        <m-form-text label="비밀번호 확인">
          <comp-input
            name="비밀번호 확인"
            type="password"
            required
            :rules="confirmPwRules"
            v-model="memberInfo.chkPw"
            placeholder="비밀번호를 다시 입력하세요" />
        </m-form-text>
        <m-form-text label="이름">
          <comp-input
            name="이름"
            required
            v-model="memberInfo.userNm"
            placeholder="이름을 입력하세요" />
        </m-form-text>
        <m-form-text label="휴대전화">
          <comp-input
            name="휴대전화"
            type="telno"
            ref="telnoRef"
            required
            v-model="memberInfo.crryTelNo"
            placeholder="휴대폰번호를 입력하세요" />
          <comp-button
            :disabled="!validTelno"
            :text="`인증번호 ${certNumBtnNm}`"
            class="ms-2 h-40px"
            density="default"
            @click="sendCertNum"></comp-button>
        </m-form-text>
        <m-form-text label="인증번호">
          <comp-input
            name="인증번호"
            :suffix="isSendCertNum ? formatterTimer : ''"
            required
            type="number"
            v-model="memberInfo.certNum"
            placeholder="인증번호를 입력하세요" />
          <comp-button
            v-if="isSendCertNum"
            text="인증번호 확인"
            class="ms-2 h-40px"
            density="default"
            @click="confCertNum"></comp-button>
        </m-form-text>
      </v-sheet>

      <!-- 회사 정보 -->
      <v-sheet class="d-flex flex-column ga-4 px-4 py-5">
        <m-form-text label="회사명">
          <comp-input
            name="회사명"
            required
            v-model="memberInfo.vendrNm"
            placeholder="회사명을 입력하세요" />
        </m-form-text>
        <m-form-text label="사업자번호">
          <comp-input
            name="사업자번호"
            type="busno"
            required
            v-model="memberInfo.busNo"
            :rules="busNoRules"
            placeholder="사업자번호를 입력하세요" />
        </m-form-text>
        <m-form-text label="산업구분">
          <v-select
            required
            density="compact"
            :items="indstClsCdList"
            item-title="comCdNm"
            item-value="comCd"
            variant="outlined"
            hide-details="auto"
            v-model="memberInfo.indstClsCd"
            placeholder="산업구분을 입력하세요" />
        </m-form-text>
        <m-form-text label="추천인/추천사" optional>
          <comp-input
            v-model="memberInfo.rcmdtnVendrCd"
            placeholder="프로모션 코드 또는 추천인 아이디를 입력하세요" />
        </m-form-text>
      </v-sheet>

      <!-- 약관동의 체크박스 -->
      <v-sheet class="d-flex flex-column ga-2 px-4 py-5">
        <div class="text-gray700 text-subtitle-2">약관동의</div>

        <v-checkbox v-model="chkAll" density="compact">
          <template #label> 모두 동의합니다 </template>
        </v-checkbox>

        <v-divider></v-divider>

        <div>
          <div class="d-flex justify-space-between align-center">
            <div>
              <v-checkbox
                label="[필수] 이용약관 동의"
                v-model="chkTerm"
                density="compact"
                required
                :rules="chkRule">
              </v-checkbox>
            </div>
            <popBoardRead
              title="서비스 이용약관"
              openBtnText="내용보기"
              bbsClsCd="T2310"
              fullscreen />
          </div>

          <div class="d-flex justify-space-between">
            <div class="d-flex flex-column align-center">
              <v-checkbox
                label="[필수] 개인정보처리방침 동의"
                v-model="chkPrivacy"
                density="compact"
                required
                :rules="chkRule">
              </v-checkbox>
            </div>
            <popBoardRead
              title="개인정보처리방침"
              bbsClsCd="T2311"
              openBtnText="내용보기"
              fullscreen />
          </div>
        </div>
      </v-sheet>
    </v-form>
  </mCompModal>
</template>

<script setup>
import { computed, defineEmits, onMounted, onUnmounted, ref, watch } from "vue";

import mFormText from "@/components/form/mFormText.vue";
import mCompModal from "@/components/modal/mCompModal.vue";
import commonUtils from "@/utils/common-utils";
import popBoardRead from "@/views/board/components/popBoardRead.vue";

const memberInfo = ref({
  // 유저 정보
  userId: "",
  userPw: "",
  chkPw: "",
  userNm: "",
  crryTelNo: "",
  certNum: "",
  certNumConfirm: false,
  // 회사정보
  vendrNm: "",
  busNo: "",
  indstClsCd: "",
  rcmdtnVendrCd: "",
});

const certNumBtnNm = ref("전송"); // 전송/재전송 문구
const confirmCertNo = ref(""); // 전송한 인증번호 저장
const isSendCertNum = ref(false); // 인증번호 전송 여부
const isConfirmCertNum = ref(false); // 인증번호 확인 여부

import loginAuthService from "@/api/common/login-auth-service";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const emits = defineEmits(["close"]);

const indstClsCdList = ref([]); // 산업구분리스트

/**
 * 유효성체크
 */
/** 휴대전화 validation 체크 */
const validTelno = computed(() => {
  const telPattern = commonUtils.getPatterns("telno").pattern;
  const telNo = memberInfo.value.crryTelNo;

  if (!telNo) {
    return false;
  } else if (!telPattern.test(telNo)) {
    return false;
  }
  return true;
});

/** 비밀번호 유효성 체크 */
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
const pwRules = [
  (pw) =>
    (pw && regex.test(pw)) ||
    "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다.",
];

/** 비밀번호 확인유효성 체크 */
const confirmPwRules = [
  (confirmPw) =>
    confirmPw === memberInfo.value.userPw || "비밀번호가 일치하지 않습니다.",
];

/** 사업자번호 중복 체크 */
const busNoRules = [
  async (busno) => {
    const isUnique = await commonUtils.chkDuplicatedBusNo(busno);
    return isUnique || "이미 등록된 사업자 번호입니다.";
  },
];

/**
 * 회원가입
 */
const formRef = ref(null);
/** 회원가입 버튼 클릭 */
const registMember = async () => {
  const { valid } = await formRef.value.validate();

  // validation 통과하지 못하면 함수 종료
  if (!valid) {
    dialogStore.openAlertDialog("필수 입력값을 확인하세요.");
    return false;
  } else if (!isConfirmCertNum.value) {
    dialogStore.openAlertDialog("휴대전화 번호 인증이 필요합니다.");
    return;
  }

  dialogStore.openConfirmDialog(`회원가입을 하시겠습니까?`, {
    confirmCallback: async () => {
      doRegistMember();
    },
  });
};

/** 회원가입 */
const doRegistMember = async () => {
  const params = {
    vendrNm: memberInfo.value.vendrNm,
    busNo: memberInfo.value.busNo.replaceAll("-", ""),
    userNm: memberInfo.value.userNm,
    userId: memberInfo.value.userId,
    userPw: memberInfo.value.userPw,
    crryTelNo: memberInfo.value.crryTelNo.replaceAll("-", ""),
    rcmdtnVendrCd: memberInfo.value.rcmdtnVendrCd,
    admAcctYn: "Y",
    indstClsCd: memberInfo.value.indstClsCd,
  };

  try {
    const res = await loginAuthService.join(params);

    if (res.data === "OK") {
      dialogStore.openAlertDialog("회원가입이 완료되었습니다.", {
        icon: "mdi-check-circle-outline",
        iconColor: "primary",
      });
      closePopup(true);
    } else {
      dialogStore.openAlertDialog(res.data.message, { type: "error" });
    }
  } catch (err) {
    dialogStore.openAlertDialog(err, { type: "error" });
    throw err;
  }
};
/**
 * 인증번호
 */
/** 인증번호 포맷팅 */
const formatterTimer = computed(() => {
  // 나중에 공통유틸로 분리예정
  const minutes = Math.floor(time.value / 60); // 분 계산
  const remainingSeconds = time.value % 60; // 초 계산

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
});

/** 인증번호 전송 버튼 클릭 */
const sendCertNum = () => {
  if (!validTelno) {
    return;
  }

  dialogStore.openConfirmDialog(
    `인증번호를 ${certNumBtnNm.value} 하시겠습니까?`,
    {
      confirmCallback: async () => {
        doSendCertNum();
      },
    }
  );
};

/** 인증번호 전송 */
const doSendCertNum = async () => {
  const params = {
    userId: memberInfo.value.userId,
    crryTelNo: memberInfo.value.crryTelNo.replaceAll("-", ""),
    tmplCd: "001",
  };

  const res = await loginAuthService.sendNotificationTalk(params);

  if (res.status == 200) {
    dialogStore.openToastDialog("인증번호가 전송되었습니다.");

    confirmCertNo.value = res.data.tmpParam;

    startTimer();
    certNumBtnNm.value = "재전송";
    memberInfo.value.certNum = "";

    isConfirmCertNum.value = false;
    isSendCertNum.value = true;
  } else {
    dialogStore.openAlertDialog(res.data.message, { type: "error" });
    return;
  }
};

/** 인증번호 확인 */
const confCertNum = () => {
  if (isValidCertNum()) {
    dialogStore.openToastDialog("인증이 완료되었습니다.");
    isConfirmCertNum.value = true;
    stopTimer();
  }
};

/** 인증번호 인증 성공 여부 조회 */
const isValidCertNum = () => {
  if (memberInfo.value.certNum === "") {
    dialogStore.openAlertDialog("휴대폰으로 발송된 인증번호를 입력하세요.");
    return;
  }
  if (memberInfo.value.certNum !== confirmCertNo.value) {
    dialogStore.openAlertDialog("인증번호가 일치하지 않습니다.");
    return;
  }

  return true;
};

// 인증번호 타이머
const initTime = 180;
const time = ref(initTime); // 초기 시간을 180초로 설정
const timer = ref(null);

/** 인증번호 전송 타이머 시작 */
const startTimer = () => {
  if (timer.value) stopTimer(); // 타이머가 이미 실행 중인 경우

  timer.value = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
    } else {
      stopTimer();
    }
  }, 1000);
};

/** 인증번호 전송 타이머 스탑 */
const stopTimer = () => {
  if (timer.value) {
    time.value = initTime;
    isSendCertNum.value = false;

    clearInterval(timer.value);
    timer.value = null;
  }
};

/**
 * 이용약관
 */
const chkAll = ref(false); // 전체동의 여부
const chkTerm = ref(false); //이용약관 동의
const chkPrivacy = ref(false); // 개인정보처리방침 동의
/** 이용약관 전체 동의 */
watch(chkAll, (newVal) => {
  if (newVal === true) {
    chkTerm.value = true;
    chkPrivacy.value = true;
  } else if (newVal === false) {
    chkTerm.value = false;
    chkPrivacy.value = false;
  }
});
// 체크박스 validate rull
const chkRule = [(v) => !!v || ""];

const closePopup = (isRegist) => {
  emits("close", isRegist);
};

onMounted(async () => {
  const clsCdList = await loginAuthService.selectIndstClsCdList();
  indstClsCdList.value = clsCdList.data; // 산업구분
  memberInfo.value.indstClsCd = indstClsCdList.value[0].comCd;
});

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped></style>
