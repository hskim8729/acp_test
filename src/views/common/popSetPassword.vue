<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="content_box">
    <div class="item_wrap w100p">
      <span for="vendrNm" class="title">새 비밀번호</span>
      <input type="password" v-model="userPw" />
    </div>

    <div class="item_wrap w100p">
      <span for="vendrNm" class="title">비밀번호 확인</span>
      <input type="password" @keyup.enter="enterChangePw" v-model="chkPw" />
    </div>
  </div>

  
</template>

<script setup>
import { ref, defineExpose, onBeforeMount, } from 'vue';

const userPw = ref("");
const chkPw = ref("");

const emit = defineEmits(["changePw"]);

const updateInfo = () => {
  
  const params = {
    userPw: userPw.value,
    chkPw: chkPw.value,
  }

  return params;
}

// 표준추가 팝업 닫기
const enterChangePw = () => {
  emit("changePw","");
};

onBeforeMount(() => {
  
})

defineExpose({
  updateInfo,
})

</script>


<style scoped>
.item_wrap .title {
  width:100px;
}
</style>