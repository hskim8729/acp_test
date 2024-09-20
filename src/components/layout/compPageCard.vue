<template>
  <div class="d-flex flex-column">
    <!-- 조회조건 영역 -->
    <div v-if="$slots.queryArea" class="query_box" ref="queryRef">
      <v-row class="item_wrap w100p">
        <slot name="queryArea"> </slot>
        <v-col class="d-flex justify-end">
          <comp-button
            v-if="isSearchBtn"
            type="search"
            class="float-right"
            text="조회"
            @click="clickSearchBtn">
          </comp-button>
        </v-col>
      </v-row>
    </div>
    <!-- 결재 컴포넌트 영역 -->
    <div v-if="$slots.apprArea" ref="apprRef">
      <slot name="apprArea"> </slot>
    </div>
    <!-- subtitle 영역 -->
    <div
      v-if="$slots.subTitle || $slots.subTitleBody"
      class="text-h6 ms-3 my-1 d-flex sub_title_section">
      <slot v-if="$slots.subTitle || $slots.subTitleBody" name="subTitle">
        <p class="align-center">{{ subTitle }}</p>
      </slot>
      <template v-if="$slots.subTitleBody">
        <v-spacer></v-spacer>
        <slot name="subTitleBody"> </slot>
      </template>
    </div>
    <!-- 본문영역 -->
    <div ref="defaultRef">
      <comp-card
        v-if="!$slots.multiCard"
        :height="isFillPage ? pageHeight : props.cardHeight">
        <template #defaultCard>
          <slot name="default"> </slot>
        </template>
      </comp-card>

      <slot
        name="multiCard"
        :height="isFillPage ? pageHeight : props.cardHeight">
      </slot>
    </div>
  </div>
</template>

<script setup>
import {
  defineEmits,
  defineProps,
  defineExpose,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
  inject,
  provide,
} from "vue";
import compCard from "@/components/layout/compCard.vue";

const props = defineProps({
  queryArea: {
    type: Object,
    default: {},
  },
  isSearchBtn: {
    // 조회버튼 숨기려면 isSearchBtn : false
    type: Boolean,
    default: true,
  },
  subTitle: {
    type: String,
    default: "",
  },
  cardHeight: {
    type: String,
    default: "calc(100%)",
  },
  isFillPage: {
    type: Boolean,
    default: false,
  },
  fillPageHeight: {
    type: String,
    default: "calc(100vh - 172px)",
  },
  isApprLine: {
    type: Boolean,
    default: false,
  },
  apprLineHeight: {
    type: String,
    default: "70px",
  },
});

const emits = defineEmits(["clickSearchBtn"]);

const defaultRef = ref(null);
const queryRef = ref(null);
const apprRef = ref(null);
const queryAreaHeight = ref(0);
const apprAreaHeight = ref(0);
const pageHeight = ref(props.fillPageHeight);

const clickSearchBtn = () => {
  emits("clickSearchBtn");
};

// 결재 컴포넌트 observer
const observer = new ResizeObserver(() => {
  updateHeight();
});

// update 후에 height 계산
const updateHeight = () => {
  nextTick(() => {
    calDefaultHeight();
  });
};

/**
 * props.isFillPage : true일 경우 카드영역 height 자동 계산
 * 계산식 : (100vh - compCard 영역의 top)
 */
const calDefaultHeight = () => {
  let topHeight = 0;

  if (defaultRef.value) {
    const ract = defaultRef.value.getBoundingClientRect();

    if (ract.top > 0) {
      topHeight = ract.top;
    }
  }

  pageHeight.value = `calc(100vh - 20px - ${topHeight}px)`;
};

/**
 * 상위 컴포넌트에서 리사이즈 됐을 때, updateHeight 함수 호출하도록 inject 전달.
 */
const registerCalcPageCardHeight = inject("registerCalcPageCardHeight");

onMounted(() => {
  if (registerCalcPageCardHeight) {
    registerCalcPageCardHeight(updateHeight);
  }

  if (apprRef.value) {
    observer.observe(apprRef.value);
  }
});

onUnmounted(() => {
  if (apprRef.value) {
    observer.unobserve(apprRef.value);
  }
});

watchEffect(() => {
  updateHeight();
});

defineExpose({
  updateHeight,
});
</script>
<style lang="scss" scoped>
.sub_title_section {
  min-height: 32px;
}

.query_box {
  position: relative;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: auto;
  background-color: #ffffff;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
}
</style>
