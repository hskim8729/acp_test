<template>
  <div class="popup_title">
    <p>{{ isUsingPlan ? "이용중인 멤버쉽" : "선택한 멤버쉽" }}</p>
    <button class="popup_close" @click="callEmits('close')"></button>
  </div>
  <div class="popup_content pay_confirm">
    <v-row class="content_box ma-0 pa-1 h-100">
      <div class="img_col">
        <img :src="getProdImgUrl()" />
      </div>
      <div class="content_col">
        <v-list lines="5" class="pt-0 h-100">
          <v-list-item class="pb-4 pt-0">
            <v-list-item-title class="font-preB pb-1">
              {{ props.payPlanInfo.payInfoNm }} 멤버쉽
              {{ !isTrial ? "(구독형)" : "" }}
            </v-list-item-title>
            <v-list-item-subtitle class="v-list-item-subtitle">
              <ul>
                <li>- 사용자 {{ props.payPlanInfo.maxUserNum }}명</li>
                <li v-if="props.payPlanInfo.alrmTlkUseYn === 'Y'">
                  - 알림톡 서비스
                </li>
                <li v-if="props.payPlanInfo.trnsUseYn === 'Y'">
                  - TBM 다국어 서비스
                </li>
                <li v-if="props.payPlanInfo.aiRiskEvalUseYn === 'Y'">
                  - AI 위험성 평가(서비스 예정)
                </li>
              </ul>
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider class="w100p" />
          <v-list-item class="pt-4 pb-4">
            <v-row no-gutters>
              <v-col cols="2" class="font-preB">구독 기간</v-col>
              <v-col cols="10" class="v-list-item-subtitle">
                <p>
                  {{ props.payPlanInfo.subscrStDateView }} ~
                  {{ props.payPlanInfo.subscrEndDateView }}
                </p>
                <p v-if="isTrial">
                  ({{ props.payPlanInfo.usePsbltyMon || 1 }}개월 /
                  {{ props.payPlanInfo.leftDays }}일 후 체험판 종료)
                </p>
                <p v-else>
                  (1개월<span v-if="!isCancel">
                    / 이용 기간 만료 후 자동 갱신</span
                  >)
                </p>
              </v-col>
            </v-row>
            <!-- trial 버전, 해지된 구독은 다음 결제 정보 표시X -->
            <v-row no-gutters v-if="!isTrial && !isCancel">
              <v-col cols="2" class="font-preB">다음 결제일</v-col>
              <v-col cols="10" class="v-list-item-subtitle">
                <p>
                  {{ props.payPlanInfo.nextPayDate }}에
                  <span v-if="isChange">
                    {{ getNewPayInfoAmt("total") }}원
                  </span>
                  <span v-else class="font-preEB">
                    {{ getPayInfoAmt("total") }}원
                  </span>
                  결제 예정
                </p>
              </v-col>
            </v-row>
            <!-- 멤버쉽이 변경 되었으면 변경 정보 표시 -->
            <v-alert
              type="info"
              variant="tonal"
              class="change_info"
              v-if="isChange">
              <template #text>
                <p class="font-12">
                  회원님의 멤버쉽이
                  <span class="font-preEB"
                    >{{ props.payPlanInfo.nextPayDate }}
                    {{ props.payPlanInfo.nextPayTime }}</span
                  >에
                  <span class="font-preEB"
                    >{{ getNewPayInfoNmKor() }} 멤버쉽</span
                  >으로 변경됩니다.
                </p>
              </template>
            </v-alert>
            <!-- 멤버쉽이 해지 되었으면 해지 정보 표시 -->
            <v-alert
              type="info"
              variant="tonal"
              color="error"
              class="change_info"
              v-if="isCancel">
              <template #text>
                <p class="font-12">
                  회원님의 멤버쉽이<span class="font-preEB"
                    >{{ props.payPlanInfo.nextPayDate }}
                    {{ props.payPlanInfo.nextPayTime }}</span
                  >에 종료됩니다.
                </p>
              </template>
            </v-alert>
          </v-list-item>
          <!-- 신규(선택된 멤버쉽) -->
          <div v-if="!isUsingPlan">
            <v-list-item class="pb-4">
              <v-row>
                <v-col class="pay_info">
                  <ul>
                    <li>
                      <p>
                        * 정기 멤버쉽은 오늘 사용하여 기록된 결제 방법을 통해
                        자동 갱신되며
                      </p>
                      <p class="next-line">
                        https://www.plan2do.co.kr/에서 액세스하고 업데이트할 수
                        있습니다.
                      </p>
                    </li>
                    <li>
                      <p>
                        * 해지할 때까지 각 갱신 기간에 요금이 청구됩니다.
                        해지하려면 ’현장 관리’– ‘편집’ 에서 “해지”를 클릭하면
                        됩니다.
                      </p>
                    </li>
                    <li>
                      <p>* 해지는 자동 결제일 전까지 요청할 수 있습니다.</p>
                    </li>
                  </ul>
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider class="w100p total_border" />
            <v-list-item class="pb-4 pt-4">
              <v-row class="position-relative" justify="center">
                <v-col cols="2" class="totla_amt_title"> 총 결제 금액 </v-col>
                <v-spacer></v-spacer>
                <v-col cols="10" class="text-right">
                  월 구독료 {{ getPayInfoAmt() }} + VAT(10%)
                  {{ getPayInfoAmt("vat") }} =
                  <span class="total_amt">{{ getPayInfoAmt("total") }}원</span>
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider class="w100p sub_total_border" />
            <v-checkbox v-model="chkAgreePay" :true-value="true">
              <template #label>
                <span id="checkboxLabel" class="font-12"
                  >위 내용을 확인하였으며, 결제에 동의합니다.</span
                >
              </template>
            </v-checkbox>
          </div>
          <!-- 이용 중인 멤버쉽 -->
          <div v-else>
            <v-list-item>
              <v-row>
                <v-col class="pay_info">
                  <!-- 변경/취소 있음-->
                  <ul v-if="isChange || isCancel">
                    <li>
                      <p>* 멤버쉽 변경/취소는 한달에 한번 가능합니다.</p>
                    </li>
                    <li>
                      <p>
                        * 멤버쉽 변경에 대하여 취소를 원하실 경우 고객센터로
                        문의주시기 바랍니다.
                      </p>
                    </li>
                  </ul>
                  <!-- 변경/취소 없음 -->
                  <ul v-else>
                    <li>
                      <p>* 사용기간 시작일은 구독 결제일부터 적용되며,</p>
                      <p class="next-line">
                        예정된 정기 결제일 이전에 해지 신청을 한 경우 잔여
                        이용기간의 만료일까지 사용 가능합니다.
                      </p>
                    </li>
                    <li>
                      <p>* 서비스 잔여기간에 대하여 환불은 불가능합니다.</p>
                      <p class="next-line">
                        단, 결제일 포함 7일 이내 고객센터를 통하여 환불을 요청시
                        결제대금을 환불받을 수 있으며, 서비스는 즉시 종료됩니다.
                      </p>
                    </li>
                    <li>
                      <p>
                        * 멤버쉽 변경시 다음 결제일에부터 기능 및 변경된 금액이
                        적용됩니다.
                      </p>
                    </li>
                  </ul>
                </v-col>
              </v-row>
            </v-list-item>
          </div>
        </v-list>
      </div>
    </v-row>
  </div>
  <div class="popup_button" v-if="!isUsingPlan">
    <comp-button
      text="이전 단계"
      class="btn_default"
      @click="callEmits('previous')"
      size="large"></comp-button>
    <comp-button
      v-if="!props.isEditMode"
      :text="isTrial ? '체험판 시작' : '결제'"
      @click="callEmits('createSubscr')"
      size="large"
      :disabled="!chkAgreePay"></comp-button>
    <comp-button
      v-else
      text="변경"
      @click="callEmits('changeSubscr')"
      size="large"
      :disabled="!chkAgreePay"></comp-button>
  </div>
  <div class="popup_button" v-if="isUsingPlan">
    <comp-button
      text="해지"
      @click="callEmits('cancelSubscr')"
      class="float-left"
      color="red"
      variant="outlined"
      size="large"
      :disabled="getCancelBtnDisabled()"></comp-button>
    <comp-button
      text="결제 정보 변경"
      @click="callEmits('changePayInfo')"
      bgColor="#ffffff"
      fontColor="#666666"
      size="large"
      v-if="getChangePayBtnDisabled()"></comp-button>
    <comp-button
      text="멤버쉽 변경"
      @click="callEmits('popPayPlanChange')"
      :disabled="getChangeBtnDisabled()"
      size="large"></comp-button>
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import commonUtil from "@/utils/common-utils";

const emits = defineEmits(["eventHandler"]);

const props = defineProps({
  siteInfo: {
    type: Object,
    default: null,
  },
  payPlanList: {
    type: Array,
    default: "",
  },
  payPlanInfo: {
    type: Object,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  newPayPlanInfo: {
    type: Object,
    default: null,
  },
});

const chkAgreePay = ref(false);
const isTrial = ref(false); // 이용중인 멤버쉽 Trial 여부
const isUsingPlan = ref(false); // 이용중인 멤버쉽 여부 (true: 현재 구독중인 멤버쉽 / false: 새로 선택한 멤버쉽)
const isChange = ref(false); // 멤버쉽 변경 여부
const isCancel = ref(false); // 멤버쉽 해지 여부

const initData = () => {
  // trial 여부
  isTrial.value = props.payPlanInfo.payInfoDc === "TRIAL";

  // 이용중인 멤버쉽 조회 여부
  isUsingPlan.value = props.siteInfo.subscrStatus === "R" && !props.isEditMode;

  // 멤버쉽 취소/변경 상태
  isChange.value = props.siteInfo.isSubscrChange;
  isCancel.value = props.siteInfo.isSubscrCancel;
};

const getPayInfoAmt = (type) => {
  return props.payPlanInfo.useAmt
    ? commonUtil.getAmt(props.payPlanInfo.useAmt, type)
    : "0";
};

const getNewPayInfoAmt = (type) => {
  return props.newPayPlanInfo.useAmt
    ? commonUtil.getAmt(props.newPayPlanInfo.useAmt, type)
    : "0";
};

const getNewPayInfoNmKor = () => {
  return props.newPayPlanInfo.payInfoDc
    ? commonUtil.getPayInfoNmKor(props.newPayPlanInfo.payInfoDc)
    : "0";
};

// 커스텀 요금제는 변경/해지 등 모든 버튼 비활성화
const isCustomPayPlan = ref(props.payPlanInfo.payInfoDc === "CUSTOM");

const getCancelBtnDisabled = () => {
  const cntrcEndDt = props.siteInfo.cntrcEndDt;
  const cntrcEndDay = commonUtil.getDateDiff(cntrcEndDt);

  // 해지,변경 상태이거나 약정종료일 이전에는 해지 불가능
  const isDisabled =
    isChange.value ||
    isCancel.value ||
    cntrcEndDay > 0 ||
    isCustomPayPlan.value;

  return isDisabled;
};

const getChangeBtnDisabled = () => {
  return isChange.value || isCancel.value || isCustomPayPlan.value;
};

const getChangePayBtnDisabled = () => {
  return !isTrial.value && !isCancel.value && !isCustomPayPlan.value;
};

const getProdImgUrl = () => {
  const payInfoDc = props.payPlanInfo.payInfoDc.toLowerCase();
  const imgUrl = `/img/payplan_${payInfoDc}.png`;

  return new URL(imgUrl, import.meta.env.VITE_APP_DOMAIN_URL);
};

const callEmits = (id) => {
  emits("eventHandler", id);
};

onMounted(() => {
  initData();
});
</script>
<style scoped>
.v-list-item-subtitle {
  line-height: 1.1rem !important;
}
.pay_plan .change_info {
  border: solid 1px !important;
  padding: 8px 12px !important;
  margin-top: 16px !important;
}
.pay_plan .change_info p {
  color: #000000 !important;
}
</style>
