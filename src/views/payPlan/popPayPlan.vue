<template>
  <div class="popup pay_plan show">
    <KeepAlive :exclude="excludeKeepAliveComp">
      <component
        :is="secondaryView"
        :key="secondaryView"
        :siteInfo="siteInfo"
        :payPlanInfo="payPlanInfo"
        :payPlanList="payPlanList"
        :newPayPlanInfo="newPayPlanInfo"
        :isEditMode="isEditMode"
        @eventHandler="eventHandler">
      </component>
    </KeepAlive>
  </div>
</template>
<script setup>
import { ref, onMounted, shallowRef, defineEmits, defineProps } from "vue";
import dayjs from "dayjs";

import popPayPlanSelect from "@/views/payPlan/popPayPlanSelect.vue";
import popPayPlanConfirm from "@/views/payPlan/popPayPlanConfirm.vue";
import popPayPlanChange from "@/views/payPlan/popPayPlanChange.vue";

import commonUtil from "@/utils/common-utils";
import commonService from "@/api/common-service.js";

import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { usePayPlanStore } from "@/stores/payPlan/pay-plan-store";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();
const payPlanStore = usePayPlanStore();
const loginStore = useLoginAuthStore();

const emits = defineEmits(["close"]);

const props = defineProps({
  siteInfo: {
    type: Object,
    default: null,
  },
  isPopPayPlan: {
    type: Boolean,
    default: false,
  },
});

const excludeKeepAliveComp = ref("popPayPlanConfirm");

let payPlanInfo = ref(null);
let newPayPlanInfo = ref(null);
let secondaryView = shallowRef();

const payPlanList = ref(null);
const isEditMode = ref(false);

// 멤버쉽 데이터 세팅
const initData = () => {
  payPlanList.value = payPlanStore.searchList.selectPayPlcyList;

  if (payPlanList.value.length < 1) {
    dialogStore.openAlertDialog(
      "멤버쉽 조회 중 에러 발생.<br>시스템 관리자에게 문의하세요.",
      { type: "error" }
    );
    closePop();
    return false;
  }

  // 이용중인 멤버쉽 정보들 셋팅
  if (props.siteInfo.subscrStatus === "R") {
    secondaryView.value = shallowRef(popPayPlanConfirm).value;
    payPlanInfo.value = payPlanList.value.find(
      (item) => item.payInfoCd === props.siteInfo.payInfoCd
    );
    newPayPlanInfo.value = payPlanList.value.find(
      (item) => item.payInfoCd === props.siteInfo.nextPayInfoCd
    );
    calSubscrDate();
  } else {
    secondaryView.value = shallowRef(popPayPlanSelect).value;
  }
};

// 구독기간 계산
const calSubscrDate = () => {
  const usePsbltyMon = payPlanInfo.value.usePsbltyMon || 1; // 구독개월수

  // 현재 구독중 상태이면 구독시작일은 실제 구독 시작일, 신규인 경우는 오늘날짜
  // 구독시작일: 오늘 / 구독종료일: 한달-1일 / 다음결제일: 한달 후
  let subscrStDt = props.siteInfo.subscrCreateDt
    ? dayjs(props.siteInfo.subscrCreateDt)
    : dayjs();
  let endDay = dayjs(subscrStDt).add(usePsbltyMon, "month").add(-1, "day");
  let nextPayDay = dayjs(subscrStDt).add(usePsbltyMon, "month");
  let payDateTime = dayjs(props.siteInfo.payDatetime);

  payPlanInfo.value.subscrStDate = subscrStDt.format("YYYYMMDD");
  payPlanInfo.value.subscrEndDate = endDay.format("YYYYMMDD");

  payPlanInfo.value.subscrStDateView = subscrStDt.format("YYYY.MM.DD");
  payPlanInfo.value.subscrEndDateView = endDay.format("YYYY.MM.DD");
  payPlanInfo.value.nextPayDate = nextPayDay.format("YYYY.MM.DD");
  payPlanInfo.value.nextPayTime = payDateTime.format("hh시mm분");

  payPlanInfo.value.leftDays = commonUtil.getDateDiff(endDay);
};

// emits 이벤트 핸들러
const eventHandler = (id, params) => {
  if (id === "update:payPlanInfo") {
    // 멤버쉽 선택 시
    if (isEditMode.value) {
      newPayPlanInfo.value = params;
    } else {
      payPlanInfo.value = params;
    }
    calSubscrDate();
  } else if (id === "close") {
    // 팝업 X 버튼
    closePop();
  } else if (id === "next") {
    // 다음 버튼
    if (isEditMode.value) {
      if (validSelectPayPlan()) {
        changeComp("changeConfirm");
      }
    } else {
      changeComp(id);
    }
  } else if (id === "previous") {
    // 이전 버튼
    changeComp(id);
  } else if (id === "popPayPlanChange") {
    // 멤버쉽 변경 버튼
    if (validChangePayPlan(id)) {
      isEditMode.value = true;
      changeComp(id);
    }
  } else if (id === "createSubscr") {
    // 결제 버튼
    createSubscr();
  } else if (id === "changeSubscr") {
    // 변경 버튼
    changeSubscr();
  } else if (id === "cancelSubscr") {
    // 해지 버튼
    if (validChangePayPlan(id)) {
      cancelSubscr();
    }
  } else if (id === "changePayInfo") {
    // 결제 수단 변경 버튼
    changePayInfo();
  }
};

// 컴포넌트 변경
const changeComp = (action) => {
  if (action === "next") {
    secondaryView.value = shallowRef(popPayPlanConfirm).value;
  } else if (action === "previous" || action === "popPayPlanChange") {
    secondaryView.value = shallowRef(popPayPlanSelect).value;
  } else if (action === "changeConfirm") {
    secondaryView.value = shallowRef(popPayPlanChange).value;
  }
};

const validSelectPayPlan = () => {
  if (props.siteInfo.payInfoCd === newPayPlanInfo.value.payInfoCd) {
    dialogStore.openAlertDialog(
      "이미 구독중인 멤버쉽입니다. <br>변경할 멤버쉽을 선택하세요.",
      { type: "error" }
    );
    return false;
  }

  return true;
};

const validChangePayPlan = (id) => {
  if (props.siteInfo.chgPsbltyYn === "N") {
    let typeNm = id === "cancelSubscr" ? "해지가" : "변경이";
    dialogStore.openAlertDialog(
      `멤버쉽은 한달에 한번만 변경이 가능합니다.<br>다음 결제일 이후 ${typeNm} 가능합니다.`,
      { type: "error" }
    );
    return false;
  }

  return true;
};

// 결제 버튼
const createSubscr = () => {
  dialogStore.openConfirmDialog("멤버쉽 구독을 신청하시겠습니까?", {
    confirmCallback: () => {
      doCreateSubscr();
    },
  });
};

const getCreateParam = (type) => {
  // 변경이면 새로 선택한 멤버쉽 정보 등록
  let payInfo = type === "change" ? newPayPlanInfo.value : payPlanInfo.value;

  const params = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    userId: loginStore.$state.userInfo.userId,
    userNm: loginStore.$state.userInfo.userNm,
    crryTelNo: loginStore.$state.userInfo.crryTelNo,
    apiPrdCd: payInfo.apiPrdCd,
    apiPriceCd: payInfo.apiPriceCd,
    payInfoCd: payInfo.payInfoCd,
    payInfoDc: payInfo.payInfoDc,
    subscrStDt: payInfo.subscrStDate,
    subscrEndDt: payInfo.subscrEndDate,
  };

  return params;
};

// 결제 로직
const doCreateSubscr = (type) => {
  const params = getCreateParam(type);

  commonService
    .axiosCall("/v1/common/createSubscription", params)
    .then((result) => {
      if (result.data.errYn === "Y") {
        dialogStore.openAlertDialog(result.data.errMsg);
        return false;
      } else {
        // Trial은 실결제가 없어 결제팝업호출X
        if (payPlanInfo.value.payInfoDc === "TRIAL" && type !== "change") {
          const msg = "체험판구독을 시작합니다.";

          closePop(true, msg);
        } else {
          openSubscrPop(result.data.ordId);
        }
      }
    });
};

// 결제 후처리 - STEP PAY 팝업 호출
const openSubscrPop = (orderId) => {
  const defaultUrl = import.meta.env.VITE_APP_DOMAIN_URL;
  const defaultPath = "SITE/siteRegDetail";
  const returnUrl = `${defaultUrl}${defaultPath}`;

  let params = {
    successUrl: `${returnUrl}`,
    errorUrl: `${returnUrl}`,
  };
  let url = new URL(`https://api.steppay.kr/api/public/orders/${orderId}/pay`);
  url.search = new URLSearchParams(params).toString();
  window.open(url, "_black");
};

// 변경
const changeSubscr = () => {
  const title = "멤버쉽을 변경하시겠습니까?";
  let msg = `멤버쉽을 변경하면 ${payPlanInfo.value.nextPayDate}부터 적용됩니다.<br>${payPlanInfo.value.subscrEndDateView}까지는 변경전 멤버쉽 혜택이 적용됩니다.`;

  if (payPlanInfo.value.payInfoDc === "TRIAL") {
    msg = `확인 버튼을 누르는 즉시 트라이얼이 해지됩니다.<br>정말 변경하시겠습니까?`;
  }

  dialogStore.openConfirmDialog(msg, {
    title,
    confirmCallback: () => {
      // trial은 멤버쉽 생성
      if (payPlanInfo.value.payInfoDc === "TRIAL") {
        doCreateSubscr("change");
      } else {
        doChangeSubscr();
      }
    },
  });
};

// 변경 로직
const doChangeSubscr = () => {
  const params = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    userId: loginStore.$state.userInfo.userId,
    apiPrdCd: newPayPlanInfo.value.apiPrdCd,
    apiPriceCd: newPayPlanInfo.value.apiPriceCd,
    payInfoCd: newPayPlanInfo.value.payInfoCd,
    apiSubscrId: props.siteInfo.apiSubscrId,
    apiSubscrItemId: props.siteInfo.apiSubscrItemId,
  };

  commonService
    .axiosCall("/v1/common/changeSubscription", params)
    .then((result) => {
      if (result.data.errYn === "Y") {
        dialogStore.openAlertDialog(result.data.errMsg);
        return false;
      } else {
        closePop(true, "변경되었습니다.");
      }
    });
};

// 해지
const cancelSubscr = () => {
  const title = "멤버쉽을 해지하시겠습니까?";
  let msg = `멤버쉽을 해지하면 ${payPlanInfo.value.nextPayDate}부터 적용됩니다.<br>${payPlanInfo.value.subscrEndDateView}까지는 멤버쉽 혜택을 계속 이용하실 수 있습니다.`;

  if (payPlanInfo.value.payInfoDc === "TRIAL") {
    msg = `Trial 혜택이 즉시 종료됩니다.<br>정말 해지 하시겠습니까?`;
  }

  dialogStore.openConfirmDialog(msg, {
    title,
    confirmCallback: () => {
      doCancelSubscr();
    },
  });
};

// 해지 로직
const doCancelSubscr = () => {
  const params = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    userId: loginStore.$state.userInfo.userId,
    apiSubscrId: props.siteInfo.apiSubscrId,
    payInfoDc: props.siteInfo.payInfoDc,
  };

  commonService
    .axiosCall("/v1/common/cancelSubscription", params)
    .then((result) => {
      if (result.data.errYn === "Y") {
        dialogStore.openAlertDialog(result.data.errMsg);
        return false;
      } else {
        closePop(
          true,
          "멤버쉽 구독이 해지 되었습니다.<br>멤버쉽을 계속 이용하시려면 다시 구독하시기 바랍니다."
        );
      }
    });
};

// 결제정보변경
const changePayInfo = () => {
  const params = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    userId: loginStore.$state.userInfo.userId,
    apiSubscrId: props.siteInfo.apiSubscrId,
  };

  commonService
    .axiosCall("/v1/common/changePaymentMethod", params)
    .then((result) => {
      if (result.data.errYn === "Y") {
        dialogStore.openAlertDialog(result.data.errMsg);
        return false;
      } else {
        openSubscrPop(result.data.ordId);
      }
    });
};

onMounted(() => {
  initData();
});

const closePop = (isReload, msg) => {
  emits("close", isReload, msg);
};
</script>
<style scoped>
.pay_plan {
  min-width: 910px !important;
  width: 910px !important;
  height: auto !important;
}
</style>
