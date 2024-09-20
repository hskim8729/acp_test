<template>
  <div class="d-flex justify-space-between align-center" style="height: 96px">
    <span
      >요금 관련 자세한 내용은 <br />
      Plan2Do에 문의해 주세요</span
    >
    <comp-button
      @click="isContacUsOpen = true"
      text="문의하기"
      variant="outlined"
      color="pay-info-custom" />

    <!-- Contact Us 팝업 -->
    <pop-contact-us
      v-if="isContacUsOpen"
      @close="isContacUsOpen = false"
      fullscreen />
  </div>
</template>

<script setup>
import popContactUs from "@/views/common/popContactUs.vue";
import { ref } from "vue";

// contactUs 팝업
const isContacUsOpen = ref(false);
</script>

<style lang="scss" scoped></style>
