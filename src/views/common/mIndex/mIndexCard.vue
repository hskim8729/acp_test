<template>
  <v-img :src="bgUrl" :height="height" class="pa-2" cover :lazy="false">
    <div
      class="py-5 px-3 d-flex flex-column justify-space-between"
      :style="{ height: props.height }">
      <div class="d-flex flex-column">
        <span
          :style="gradientStyle"
          class="text-h3 pt-2 pb-1 gradient-text"
          :class="titleShadow ? 'text-shadow' : ''"
          v-dompurify-html="title"></span>
        <span
          v-for="(detail, index) in detailList"
          :key="index"
          class="text-body-3 py-1"
          v-dompurify-html="detail"></span>
      </div>

      <div class="d-flex flex-column">
        <component
          v-if="subComponent"
          :is="subComponent"
          v-bind="subComponentProps" />
      </div>
    </div>
  </v-img>
</template>

<script setup>
import { computed } from "vue";
const gradientStyle = computed(() => ({
  "--gradient-start": props.gradientStart,
  "--gradient-end": props.gradientEnd,
}));
const props = defineProps({
  height: {
    type: String,
    default: "400px",
  },
  title: {
    type: String,
    default: "카드 타이틀",
  },
  titleShadow: {
    type: Boolean,
    default: true,
  },
  gradientStart: {
    type: String,
    default: "",
  },
  gradientEnd: {
    type: String,
    default: "",
  },
  detailList: {
    type: Array,
    default: [
      "`예시예시예시, <br/> 예시예시예시,예시예시예시,`",
      "`<span class='text-subtitle-6'>예시예시예시,.</span> 예시예시예시,`",
    ],
  },
  bgUrl: {
    type: String,
    default: "",
  },
  subComponent: [Object, Function],
  subComponentProps: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="scss" scoped>
.text-shadow {
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
.gradient-text {
  background: linear-gradient(
    to right,
    var(--gradient-start),
    var(--gradient-end)
  );
  background-clip: text;
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
