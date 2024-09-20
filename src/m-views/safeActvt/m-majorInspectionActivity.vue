<template lang="">
  <!-- 
    중점/일상점검활동 하나로 합치고 inspClsCd 코드(중점: T0201/일상: T0202)로 처리하도록 변경
    router 이슈로 최상위 컴포넌트는 분리. 
  -->
  <m-inspection-activity inspClsCd="T0201"> </m-inspection-activity>
</template>
<script setup>
import mInspectionActivity from "@/m-views/safeActvt/components/m-InspectionActivity.vue";
</script>
<style lang=""></style>
