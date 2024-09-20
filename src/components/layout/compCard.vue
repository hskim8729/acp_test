<template>
  <!-- subtitle 영역 -->
  <div
    v-if="$slots.subTitle || $slots.subTitleBody"
    class="text-h6 ms-3 my-1 d-flex sub_title_section"
    ref="subTitleRef">
    <slot v-if="$slots.subTitle || $slots.subTitleBody" name="subTitle">
      <p class="align-center">{{ subTitle }}</p>
    </slot>
    <template v-if="$slots.subTitleBody">
      <v-spacer></v-spacer>
      <slot name="subTitleBody"> </slot>
    </template>
  </div>

  <!-- 본문영역 -->
  <v-card
    class="pa-3 overflow-y-auto w-100"
    :height="getHeight()"
    min-height="200px"
    elevation="1"
    rounded="lg">
    <slot name="defaultCard">
      <div>디폴트 슬롯에 내용을 넣으세요</div>
    </slot>
  </v-card>
</template>

<script setup>
import { ref, defineProps, watch, useSlots } from "vue";

const slots = useSlots();
const props = defineProps({
  height: {
    type: String,
    default: "calc(100vh - 20px)",
  },
  subTitle: {
    type: String,
    default: "",
  },
});

const subTitleRef = ref(null);

/**
 * card height 계산
 * subtitle 없음(기본) : props에서 받아온 height
 * subtitle 있음 : props.height - subtitle height
 */
const getHeight = () => {
  let height = props.height;

  if (subTitleRef.value && (slots.subTitle || slots.subTitleBody)) {
    const subTitleHeight = subTitleRef.value.getBoundingClientRect().height;
    height = `calc(${height} - ${subTitleHeight}px)`;
  }
  return height;
};
</script>
<style lang="scss" scoped></style>
