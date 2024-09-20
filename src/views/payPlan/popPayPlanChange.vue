<template>
  <div class="popup_title">
    <p>멤버쉽 변경</p>
    <button class="popup_close" @click="callEmits('close')"></button>
  </div>
  <div class="popup_content pay_confirm">
    <v-row class="content_box ma-0 pa-3">
      <div class="img_col align-content-center">
        <p class="font-preB">구독중인 멤버쉽</p>
      </div>
      <div class="content_col pl-0">
        <v-row>
          <v-col cols="8">
            <v-list lines="5" class="pt-0">
              <v-list-item>
                <template #prepend="{ isActive }">
                  <img
                    :src="getProdImgUrl(props.payPlanInfo.payInfoDc)"
                    class="w85p"
                    :model-value="isActive" />
                </template>
                <v-list-item-title class="font-preB pb-1">
                  {{ props.payPlanInfo.payInfoNm }} 멤버쉽
                  {{ !isTrial ? "(구독형)" : "" }}
                </v-list-item-title>
                <v-list-item-subtitle class="pa-0">
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
            </v-list>
          </v-col>
          <v-col cols="4" class="text-right align-content-center">
            <span class="total_amt_prev">{{ getPayInfoAmt("total") }}원</span>
            <p class="v-list-item-subtitle font-12">
              월 구독료 {{ getPayInfoAmt() }}
            </p>
            <p class="v-list-item-subtitle font-12">
              + VAT(10%) {{ getPayInfoAmt("vat") }}
            </p>
          </v-col>
        </v-row>
      </div>
      <v-divider class="w100p" />
      <div class="img_col align-content-center">
        <p class="font-preB">새로운 멤버쉽</p>
      </div>
      <div class="content_col pl-0">
        <v-row>
          <v-col cols="8">
            <v-list lines="5" class="pt-0">
              <v-list-item>
                <template #prepend="{ isActive }">
                  <img
                    :src="getProdImgUrl(props.newPayPlanInfo.payInfoDc)"
                    class="w85p"
                    :model-value="isActive" />
                </template>
                <v-list-item-title class="font-preB pb-1">
                  {{ props.newPayPlanInfo.payInfoNm }} 멤버쉽
                  {{ !isTrial ? "(구독형)" : "" }}
                </v-list-item-title>
                <v-list-item-subtitle class="pa-0">
                  <ul>
                    <li>- 사용자 {{ props.newPayPlanInfo.maxUserNum }}명</li>
                    <li v-if="props.newPayPlanInfo.alrmTlkUseYn === 'Y'">
                      - 알림톡 서비스
                    </li>
                    <li v-if="props.newPayPlanInfo.trnsUseYn === 'Y'">
                      - TBM 다국어 서비스
                    </li>
                    <li v-if="props.newPayPlanInfo.aiRiskEvalUseYn === 'Y'">
                      - AI 위험성 평가(서비스 예정)
                    </li>
                  </ul>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="4" class="text-right align-content-center">
            <span class="total_amt">{{ getNewPayInfoAmt("total") }}원</span>
            <p class="v-list-item-subtitle font-12">
              월 구독료 {{ getNewPayInfoAmt() }}
            </p>
            <p class="v-list-item-subtitle font-12">
              + VAT(10%) {{ getNewPayInfoAmt("vat") }}
            </p>
          </v-col>
        </v-row>
      </div>
      <v-divider class="w100p" />
      <div class="img_col align-content-center">
        <p class="font-preB">멤버쉽 변경</p>
      </div>
      <div class="content_col pl-0 v-list-item-subtitle">
        새 멤버쉽이
        <span class="font-preB" v-if="isTrial">즉시</span>
        <span class="font-preB" v-else
          >{{ props.payPlanInfo.nextPayDate }}일에</span
        >
        시작됩니다.
      </div>
      <v-divider class="w100p" />
      <v-list>
        <v-list-item>
          <v-row>
            <v-col class="pay_info">
              <ul>
                <li>
                  <p>
                    * 멤버쉽 변경시 다음 결제일에부터 기능 및 변경된 금액이
                    적용됩니다.
                  </p>
                  <p>
                    * 멤버쉽 변경에 대하여 취소를 원하실 경우 고객센터로
                    문의주시기 바랍니다.
                  </p>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-row>
  </div>
  <div class="popup_button">
    <comp-button
      text="이전 단계"
      class="btn_default"
      @click="callEmits('previous')"
      size="large"></comp-button>
    <comp-button
      text="변경"
      @click="callEmits('changeSubscr')"
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
  newPayPlanInfo: {
    type: Object,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const isTrial = ref(false); // trial 여부

const initData = () => {
  isTrial.value = props.payPlanInfo.payInfoDc === "TRIAL";
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

const getProdImgUrl = (payInfoDc) => {
  const payInfoDcToLow = payInfoDc.toLowerCase();
  const imgUrl = `/img/payplan_${payInfoDcToLow}.png`;

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
</style>
