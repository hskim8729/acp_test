<template>
  <div class="w100p h-100">
    <div class="popup_title">
      <p>원하는 멤버쉽을 선택하세요.</p>
      <button class="popup_close" @click="callEmits('close')"></button>
    </div>
    <div class="popup_content">
      <v-row>
        <v-col class="cols5_custom pl-0 pr-0 pb-0">
          <v-card-title class="pay_plan_item pr-0" />
          <v-card-item class="cols5_custom_padding">
            <v-row>
              <v-col>사용자 등록</v-col>
            </v-row>
            <v-row>
              <v-col>알림톡 서비스</v-col>
            </v-row>
            <v-row>
              <v-col
                >TBM 다국적 서비스
                <v-tooltip
                  location="bottom left"
                  :location="location"
                  content-class="tbm-tooltip"
                  no-click-animation
                  v-if="false">
                  <template #activator="{ props }">
                    <v-icon
                      icon="mdi-information-outline"
                      color="#bbbbbb"
                      v-bind="props" />
                  </template>

                  <div class="font-12">
                    <p>모바일 TBM 번역 서비스 제공</p>
                  </div>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col>AI 위험성 평가 <span class="pay_info">(예정)</span></v-col>
            </v-row>
            <v-row>
              <v-col
                >요금
                <p class="pay_info">/월/현장</p></v-col
              >
            </v-row>
          </v-card-item>
        </v-col>
        <div class="cols5_custom-list-area">
          <v-col
            class="cols5_custom pa-0 pt-3"
            v-for="item in payPlanList"
            :key="item.payInfoDc">
            <v-badge
              color="#FFFFFF"
              text-color="#F54631"
              content="구독중"
              class="pay-badge font-12 pr-2"
              v-model="item.isSubscr">
              <v-card :item="item" class="cols5_custom mx-auto">
                <v-card-title
                  :class="`pay_plan_item ${item.payInfoDc.toLowerCase()}`">
                  <v-row class="ma-0 mt-2">
                    <p>{{ item.payInfoNm }}</p>
                  </v-row>
                  <div
                    class="pay_plan_sub_title"
                    v-if="item.payInfoDc === 'TRIAL'">
                    <p>첫 등록 현장</p>
                    <p>(건설업 외 6개월)</p>
                  </div>
                  <div
                    class="pay_plan_sub_title mt-1"
                    v-if="item.payInfoDc === 'STANDARD'">
                    <span class="best-icon">추천</span>
                  </div>
                </v-card-title>
                <v-card-item
                  :class="`pay_plan_card text-center ${
                    selectPayPlanInfo.payPlanCd === item.payInfoDc
                      ? 'item_selected_'
                      : ''
                  }${item.payInfoDc.toLowerCase()}`">
                  <v-row>
                    <v-col>{{ item.maxUserNum }}명</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-icon
                        :icon="
                          item.trnsUseYn === 'Y' ? 'mdi-check' : 'mdi-close'
                        " />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-icon
                        :icon="
                          item.alrmTlkUseYn === 'Y' ? 'mdi-check' : 'mdi-close'
                        " />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-icon
                        :icon="
                          item.aiRiskEvalUseYn === 'Y'
                            ? 'mdi-check'
                            : 'mdi-close'
                        " />
                    </v-col>
                  </v-row>
                  <v-row class="pt-2 pb-3">
                    <v-radio-group
                      inline
                      v-model="selectPayPlanInfo.payPlanCd"
                      @change="updatePayPlanInfo(item)"
                      hide-details>
                      <v-radio
                        :value="item.payInfoDc"
                        :disabled="
                          item.payInfoDc === 'TRIAL' &&
                          props.siteInfo.freeSelYn === 'Y'
                        ">
                        <template #label>
                          <div>
                            <span class="amt_style">{{
                              `${commonUtil.numberToKorean(item.useAmt)}원`
                            }}</span>
                            <span class="pay_info"> /월</span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-row>
                </v-card-item>
              </v-card>
            </v-badge>
          </v-col>
          <v-col class="cols5_custom pa-0 pt-3">
            <v-card class="mx-auto">
              <v-card-title class="pay_plan_item custom pt-4">
                Custom
              </v-card-title>
              <v-card-item class="text-center pl-2 pr-2">
                <div class="pay_plan_sub_title mt-4">
                  <p>요금 관련 자세한 내용은</p>
                  <p>Plan2do에 문의해 주세요.</p>
                </div>
                <v-btn
                  class="mt-2 mb-3 btn_default"
                  @click="openContactUsModal">
                  문의하기
                </v-btn>
              </v-card-item>
            </v-card>
            <v-card class="mx-auto mt-2 text-center pay_add_service font-preB">
              <v-card-title class="add-service-title">
                추가 연계 서비스
              </v-card-title>
              <v-card-item class="pl-2 pr-2">
                <v-row>
                  <v-col class="pay_plan_sub_title"
                    >기업별 맞춤 요금 설계</v-col
                  >
                </v-row>
                <v-row>
                  <v-col class="pay_plan_sub_title"
                    >초기 안전 진단 컨설팅 연계</v-col
                  >
                </v-row>
              </v-card-item>
            </v-card>
          </v-col>
        </div>
      </v-row>
      <v-row>
        <v-col class="pay_info">
          <ul>
            <li>* 모든 멤버쉽 금액은 VAT (10%) 별도입니다.</li>
            <li>
              * 사용기간 시작일은 구독 결제일부터 적용되며, 예정된 정기 결제일
              이전에 해지 신청을 한 경우 잔여 이용기간의 만료일까지 사용
              가능합니다.
            </li>
            <li>
              * 서비스 잔여기간에 대하여 환불은 불가능합니다. 단, 결제일 포함
              7일 이내 고객센터를 통하여 환불을 요청시 결제대금을 환불받을 수
              있으며, 서비스는 즉시 종료됩니다.
            </li>
          </ul>
        </v-col>
      </v-row>
    </div>
    <div class="popup_button">
      <comp-button
        text="다음 단계"
        @click="callEmits('next')"
        size="large"></comp-button>
    </div>
    <pop-contact-us v-if="isContacUsOpen" @close="closeContactUsModal" />
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import commonUtil from "@/utils/common-utils";
import popContactUs from "@/views/common/popContactUs.vue";

const emits = defineEmits(["eventHandler"]);
const props = defineProps({
  siteInfo: {
    type: Object,
    default: "",
  },
  payPlanList: {
    type: Array,
    default: "",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

let selectPayPlanInfo = ref({
  payPlanCd: "",
});

const payPlanList = ref(null);
const initData = async () => {
  payPlanList.value = props.payPlanList;

  let selectItem = {};

  payPlanList.value.forEach((item) => {
    // 구독 여부에 따라 구독중 뱃지 설정
    item.isSubscr =
      props.siteInfo.subscrUseYn === "Y" &&
      item.payInfoCd === props.siteInfo.payInfoCd
        ? true
        : false;

    // default 선택 멤버쉽
    // 1. 신규 : 신규일 경우 TRAIL, 이용 현장이 존재하는경우는 STANDARD
    // 2. 멤버쉽 변경 : 기존 사용중인 멤버쉽
    let payInfoDc = "TRIAL";
    if (!props.isEditMode) {
      payInfoDc = props.siteInfo.freeSelYn === "N" ? "TRIAL" : "STANDARD";
    } else {
      payInfoDc = props.siteInfo.payInfoDc;
    }

    if (item.payInfoDc === payInfoDc) {
      selectItem = item;
    }
  });

  updatePayPlanInfo(selectItem);
};

const updatePayPlanInfo = (item) => {
  selectPayPlanInfo.value = item;
  selectPayPlanInfo.value.payPlanCd = item.payInfoDc;
  callEmits("update:payPlanInfo", selectPayPlanInfo.value);
};

const callEmits = (id, param = null) => {
  emits("eventHandler", id, param);
};

// 문의하기 팝업
const isContacUsOpen = ref(false);
const openContactUsModal = () => {
  isContacUsOpen.value = true;
};
const closeContactUsModal = () => {
  isContacUsOpen.value = false;
};

onMounted(() => {
  initData();
});
</script>
<style scope>
.v-card-item .v-card-item__content .v-row {
  border-bottom: solid 1px #d1dce1;
}
.amt_style {
  font-family: "Pretendard-EB";
  color: black;
  opacity: inherit;
}
.pay-badge .v-radio {
  width: 100%;
  justify-content: center;
}
</style>
