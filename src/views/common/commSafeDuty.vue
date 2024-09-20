<template>
  <compPage :title="pageTitle" class="safe_duty">
    <template #toolbarBody v-if="$slots.toolbarBody">
      <slot name="toolbarBody"></slot>
    </template>

    <!-- information box 영역 -->
    <div ref="expansionPanelRef">
      <v-expansion-panels
        v-model="informPanels"
        class="mb-2 safe_info_panel z-index-0">
        <v-expansion-panel>
          <v-expansion-panel-title min-height="0" class="compact">
            <template v-slot:default>
              <span class="safe-info-icon"><i></i></span>
              <p class="font-weight-bold pl-2 info-title">
                {{ infoTitle }}
              </p>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <span v-dompurify-html="infoMessage"></span>
            <slot name="infoBody"></slot>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <slot name="cardTop"></slot>

    <!-- 본문 영역-->
    <!-- 1. #pageCard : slot으로 custom -->
    <slot name="pageCard" v-if="$slots.pageCard"></slot>

    <!-- 2. isTabPage=true : 탭 페이지 -->
    <safe-tab-page v-else-if="isTabPage && !hiddenCard" :tabList="tabList">
      <template #betweenTab v-if="$slots.betweenTab">
        <slot name="betweenTab" />
      </template>
      <template #tabItem v-if="$slots.tabItem">
        <slot name="tabItem" />
      </template>
    </safe-tab-page>
    <!-- 3. 기본 페이지, hiddenCard=true로 주면 빈화면  -->

    <compPageCard
      v-else-if="!hiddenCard"
      :cardHeight="contentHeight"
      :isFillPage="isFillPage">
      <template #subTitle v-if="$slots.contentTitle">
        <slot name="contentTitle"></slot>
      </template>
      <template #subTitleBody v-if="$slots.contentButton">
        <slot name="contentButton"></slot>
      </template>
      <template #default v-if="$slots.contents">
        <slot name="contents"></slot>
      </template>
    </compPageCard>
  </compPage>

  <slot name="cardBottom"></slot>
</template>
<script setup>
import {
  ref,
  defineProps,
  defineExpose,
  onMounted,
  onUnmounted,
  nextTick,
  provide,
  watch,
} from "vue";

import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import safeTabPage from "@/views/safeConfirmDuty/components/safeTabPage.vue";

const props = defineProps({
  pageTitle: {
    type: String,
    default: "",
  },
  infoTitle: {
    type: String,
    default: "이렇게 해보세요!",
  },
  infoMessage: {
    type: String,
    default: "",
  },
  infoMaxHeight: {
    type: String,
    default: "",
  },
  contentHeight: {
    type: String,
    default: "",
  },
  isFillPage: {
    type: Boolean,
    default: true,
  },
  isTabPage: {
    type: Boolean,
    default: false,
  },
  // tab 구성인 경우 tab 목록 (component는 markRaw로 감싸서 전달 필수)
  tabList: {
    type: Array,
    default: [],
  },
  // false(기본) : #default 슬롯 보여짐
  // true : 아무런 영역도 보여지지 않음
  hiddenCard: {
    type: Boolean,
    default: false,
  },
});

const informPanels = ref("0");
const expansionPanelRef = ref(null);

/**
 * 사이즈 변경 observer 생성하고, height 계산하는 메소드 provide 등록
 */
const resizeObserver = new ResizeObserver(() => {
  calcPageCardHeight();
});

const calcHeightProvide = ref(null);
const calcPageCardHeight = () => {
  if (calcHeightProvide.value) {
    calcHeightProvide.value();
  }
};

provide("registerCalcPageCardHeight", (action) => {
  calcHeightProvide.value = action;
});

onMounted(() => {
  // information box observer생성
  if (expansionPanelRef.value) {
    resizeObserver.observe(expansionPanelRef.value);
  }
});

onUnmounted(() => {
  // information box observer 제거
  if (resizeObserver && expansionPanelRef.value) {
    resizeObserver.unobserve(expansionPanelRef.value);
  }
});
</script>
<style scope>
.z-index-0 {
  z-index: 0 !important;
}
</style>
