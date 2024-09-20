<!-- 사인패드 -->

<template>
	<div class="content_box">
		<div class="item_wrap w100p">
			<span class="p_title" >현재 비밀번호</span>
			<input type="password" class="w100p" v-model="recPassword" />
		</div>
		<div class="item_wrap w100p">
			<span class="p_title">신규 비밀번호</span>
			<input type="password" class="w100p" v-model="newPassword">
		</div>
		<div class="item_wrap w100p">
			<span class="p_title">비밀번호 확인</span>
			<input type="password" class="w100p" v-model="chkPassword">
		</div>
	</div>
</template>

<script setup>
import { ref, defineExpose, onBeforeMount, getCurrentInstance, } from 'vue';

const recPassword = ref("");
const newPassword = ref("");
const chkPassword = ref("");

const emit = defineEmits(["changePw"]);

const updateInfo = () => {
  
  const params = {
	recPassword: recPassword.value,
    newPassword: newPassword.value,
    chkPassword: chkPassword.value,
  }

  return params;
}

// 입력한 비밀번호 값 초기화
const reset = () => {
  
	recPassword.value = "";
    newPassword.value = "";
    chkPassword.value = "";

}

// 표준추가 팝업 닫기
const enterChangePw = () => {
  emit("changePw","");
};


defineExpose({
  updateInfo,
  reset,
})
</script>

<style scoped>
</style>
