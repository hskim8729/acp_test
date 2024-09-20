<template>
  <section class="index_section_07">
    <div class="title_text">다양한 단말기를 통해<br />언제 어디서든 사용</div>
    <div class="content_text">
      컴퓨터, 스마트폰/태블릿(안드로이드, iOS) 등 다양한 장비를 지원합니다.<br />
      본사, 현장사무소, 작업현장, 이동중 등 어디서든 위험 관리가 가능합니다.
    </div>
    <div class="store">
      <button class="google" @click="emits('openGoogleStore')"></button>
      <button class="apple" @click="emits('openAppleStore')"></button>
    </div>
  </section>
</template>

<script setup>

import { defineEmits } from "vue";

const emits = defineEmits(["openGoogleStore", "openAppleStore"]);

</script>
<style scoped>
</style>
