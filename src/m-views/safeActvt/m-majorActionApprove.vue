<template lang="">
  <!-- 
    중점/일상점검활동 하나로 합치고 inspClsCd 코드(중점: T0201/일상: T0202)로 처리하도록 변경
    router 이슈로 최상위 컴포넌트는 분리. 
  -->
  <m-action-approve inspClsCd="T0201"> </m-action-approve>
</template>
<script setup>
import mActionApprove from "@/m-views/safeActvt/components/m-actionApprove.vue";
</script>
<style lang=""></style>
