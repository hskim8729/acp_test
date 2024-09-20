<template>
  <!-- 
    중점/일상조치 하나로 합치고 inspClsCd 코드(중점: T0201/일상: T0202)로 처리하도록 변경
    router 이슈로 최상위 컴포넌트는 분리. 
  -->
  <action-activity inspClsCd="T0201"></action-activity>
</template>

<script setup>
import actionActivity from "@/views/safeActvt/components/actionActivity.vue";
</script>

<style scoped></style>
