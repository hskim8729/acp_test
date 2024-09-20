<template>
  <v-footer class="bg-gray900 d-flex flex-column align-start py-5">
    <v-img
      :src="footerLogoUrl"
      class="py-3"
      alt="Plan2do footer Logo"
      width="112" />
    <p class="text-body-4 text-gray500 py-3">
      서울특별시 종로구 우정국로 26 센트로폴리스 A동 23층<br />
      아시아나IDT(주) 대표이사 김응철<br />
      사업자등록번호 104-81-22547<br />
      통신판매번호 2006-03807<br />
      plan2do@asianaidt.com
    </p>

    <div class="d-flex">
      <popBoardRead
        title="서비스 이용약관"
        bbsClsCd="T2310"
        fullscreen></popBoardRead>
      <popBoardRead
        title="개인정보처리방침"
        bbsClsCd="T2311"
        fullscreen></popBoardRead>
    </div>

    <p class="text-body-5 text-gray600 py-3">
      ⓒ 2024 Plan2Do. All rights reserved.
    </p>
  </v-footer>
</template>

<script setup>
import footerLogoUrl from "@/assets/img/footer_logo.png";
import popBoardRead from "@/views/board/components/popBoardRead.vue";
</script>

<style lang="scss" scoped></style>
