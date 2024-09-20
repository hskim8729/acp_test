<!-- views/riskFactroStandardPage -->
<template>
  <div class="text-subtitle-6 align-end ms-1 mb-1 d-flex">
    <p>경영방침</p>
    <v-spacer></v-spacer>
    <comp-button
      type="ai"
      text="AI"
      variant="outlined"
      density="compact"
      @click="openPopAi"></comp-button>
  </div>
  <v-textarea
    v-model="safeInfo.policy"
    variant="outlined"
    hide-details="auto"
    rows="5"
    bg-color="#FFFFFF"
    placeholder="경영방침을 입력해주세요."
    auto-grow />
  <div class="text-subtitle-6 align-end ms-1 mt-3 mb-1 d-flex">
    <p>목표</p>
    <v-spacer></v-spacer>
    <comp-button
      type="ai"
      text="AI"
      variant="outlined"
      density="compact"
      @click="openPopAi"></comp-button>
  </div>
  <v-textarea
    v-model="safeInfo.objective"
    variant="outlined"
    hide-details="auto"
    rows="5"
    bg-color="#FFFFFF"
    placeholder="목표를 입력해주세요."
    auto-grow />
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  safeInfo: {
    type: Object,
    default: {},
  },
});

const isPopAi = ref(false);
const openPopAi = () => {
  console.log("준비중입니다.");
};
const closePopAi = () => {};
const closePopAiObjective = () => {};
const getAiRecList = () => {};
</script>
<style></style>
