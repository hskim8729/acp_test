<!-- 중복 로그인 시 회원사 선택 -->

<template>
	<div class="content_box">
		<ul class="company_select_item">
			<li v-for="item in selData" :key="item.vendrCd" :id="item.userId" :value="item.vendrCd" @click="companySelectItem($event)">{{ item.vendrNm }}</li>
		</ul>
	</div>

</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(["selData"]);
const emit = defineEmits(["update"]);

const userId = ref("");
const vendrCd = ref("");

function companySelectItem(event) {
	let companyList = document.querySelectorAll(".company_select_item li");

	companyList.forEach((selected) => {
		selected.classList.remove("selected");
	});

	event.target.classList.add("selected");

	userId.value = event.target.id;
	vendrCd.value = event.target.value;

	emit("update", vendrCd.value);
}


</script >


<style scoped>
.content_box {
	margin:0px;
	text-align:center;
}
input {
	width:100%;
}
</style>