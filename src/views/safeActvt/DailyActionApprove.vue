<!-- 안전활동/종합점검 승인 -->
<template>
  <!-- 
    중점/일상 승인 하나로 합치고 inspClsCd 코드(중점: T0201/일상: T0202)로 처리하도록 변경
    router 이슈로 최상위 컴포넌트는 분리. 
  -->
  <action-approve inspClsCd="T0202"> </action-approve>
</template>

<script setup>
import actionApprove from "@/views/safeActvt/components/actionApprove.vue";
</script>

<style scoped></style>
