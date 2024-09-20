<template>
  <v-tabs v-model="tab" class="mb-2 px-1 mt-2 text-gray400" grow>
    <v-tab
      v-for="item in items"
      hide-slider
      color="white"
      class="text-subtitle-6"
      :selected-class="`bg-${itemsDetail[item].color}`"
      base-color="transparent"
      rounded="lg"
      size="small"
      variant="flat"
      :key="item"
      :text="item"
      :value="item"></v-tab>
  </v-tabs>

  <v-tabs-window
    v-model="tab"
    v-touch="{
      left: onSwipeLeft,
      right: onSwipeRight,
    }">
    <v-tabs-window-item v-for="item in items" :key="item" :value="item">
      <!-- price 카드 -->
      <v-card
        rounded="lg"
        class="ma-2 card-bg pa-3"
        height="340px"
        :color="itemsDetail[item].color"
        variant="outlined">
        <!-- 카드 타이들 -->
        <v-card-title>
          <span class="text-h3">{{ item }}</span>
          <span class="text-body-3 mx-2">{{ itemsDetail[item].name }}</span>
        </v-card-title>

        <v-card-text>
          <v-divider></v-divider>
          <!-- 문의하기 -->
          <component
            v-if="itemsDetail[item].subComponent"
            :is="itemsDetail[item].subComponent"
            v-bind="itemsDetail[item].subComponentProps" />
          <!-- 정보 리스트 -->
          <v-list lines="1" v-else>
            <v-list-item
              v-for="info in itemsDetail[item].infoItemList"
              class="px-0">
              <div class="d-flex flex-row">
                <v-icon :color="itemsDetail[item].color">mdi-check</v-icon>
                <span
                  class="text-gray-900 text-subtitle-2 px-2"
                  v-dompurify-html="info.title"></span>
                <v-spacer></v-spacer>
                <span
                  :class="`text-${itemsDetail[item].color}`"
                  class="text-gray-900 text-subtitle-2"
                  v-dompurify-html="info.info"></span>
              </div>
            </v-list-item>
          </v-list>

          <!-- 카드 그레이박스 -->
          <template v-if="itemsDetail[item].detailList.length > 0">
            <v-sheet
              color="gray100"
              class="pa-4 d-flex flex-column ga-1"
              rounded>
              <span
                v-for="detail in itemsDetail[item].detailList"
                class="text-gray500 text-subtitle-4"
                v-dompurify-html="detail"></span>
            </v-sheet>
          </template>

          <!--  카드 아래쪽 가격 부분 -->
          <div class="card-bottom-area d-flex align-center text-gray400 ma-2">
            <span class="text-cation-1">금액</span>
            <span class="text-body-4 px-2">(Vat 별도)</span>
            <v-spacer />
            <span class="text-h4 text-gray900 px-1">{{
              itemsDetail[item].priceInfo.price
            }}</span>
            <span class="text-cation-1">{{
              itemsDetail[item].priceInfo.desc
            }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import mIndexCustomSub from "@/views/common/mIndex/mIndexCustomSub.vue";
import { ref } from "vue";

/**
 * 카드 스와이프
 */
function onSwipeLeft() {
  const currentIndex = items.indexOf(tab.value);
  const nextIndex = (currentIndex + 1) % items.length;
  tab.value = items[nextIndex];
}

function onSwipeRight() {
  const currentIndex = items.indexOf(tab.value);
  const previousIndex = (currentIndex - 1 + items.length) % items.length;
  tab.value = items[previousIndex];
}

const tab = ref("Free Trial");
const items = ["Free Trial", "Standard", "Preminum", "Custom"];
const itemsDetail = {
  "Free Trial": {
    name: "프리 트라이얼",
    color: "pay-info-trial",
    infoItemList: [
      {
        title: "사용자수",
        info: "30명",
      },
      {
        title: '가입 후 첫 <span class="text-pay-info-trial">2개월 무료</span>',
        info: "",
      },
    ],
    detailList: [],
    priceInfo: {
      price: "무료",
      desc: "/ 가입 첫 2개월",
    },
  },
  Standard: {
    name: "스탠다드",
    color: "pay-info-standard",
    infoItemList: [
      {
        title: "사용자수",
        info: "50명",
      },
      {
        title: "부가서비스",
        info: "",
      },
    ],
    detailList: ["다국어 번역 (TBM)", "알림톡 / SMS"],
    priceInfo: {
      price: "30만원",
      desc: "/ 월 / 현장",
    },
  },
  Preminum: {
    name: "프리미엄",
    color: "pay-info-premium",
    infoItemList: [
      {
        title: "사용자수",
        info: "100명",
      },
      {
        title: "부가서비스",
        info: "",
      },
    ],
    detailList: ["다국어 번역 (TBM)", "알림톡 / SMS", "AI 위험성평가"],
    priceInfo: {
      price: "40만원",
      desc: "/ 월 / 현장",
    },
  },
  Custom: {
    name: "커스텀",
    color: "pay-info-custom",
    infoItemList: [],
    detailList: [
      "<span class='text-subtitle-2 text-gray900'>추가 연계 서비스</span>",
      "기업별 맞춤 요금 설계",
      "초기 안전 진단 컨설팅 연계",
    ],
    subComponent: mIndexCustomSub,
    priceInfo: {
      price: "문의",
      desc: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.card-bg {
  background-color: white;
}

.card-bottom-area {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  padding: 0 16px; /* 좌우 여백 추가 */
}
</style>
