<!-- 시스템/권한관리 -->

<template>
  <div class="page_title_area">
      <div class="title">권한관리</div>
      <nav><span><router-link to="/">홈</router-link></span> > 시스템 > 권한관리</nav>
  </div>

  <div class="page_content_area">
    <div class="tab">
      <ul v-if="$loginStore.$state.userInfo.vendrCd === '0000'">
        <li class="active" @click="tabAction($event)" id="tab01">회원사 메뉴</li>
      </ul>
      <ul v-else>
        <li class="active" @click="tabAction($event)" id="tab02">메뉴</li>
        <!-- <li @click="tabAction($event)" id="tab03">사용자</li> -->
      </ul>
    </div>
    
    <div class="tabpage show">
        <component :is="changeTab" :key="changeTab"></component>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, getCurrentInstance, shallowRef } from 'vue';

import authMgmtCompany from './AuthMgmtCompanyPage.vue';
import authMgmtMenu from './AuthMgmtMenuPage.vue';
import authMgmtUser from './AuthMgmtUserPage.vue';

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

let changeTab = shallowRef();
let url = shallowRef();


async function tabAction(e) {
  
  const children = e.target.parentElement.children;
  const tabId = e.target.id;
  
  for (let i = 0; i < children.length; i++) {
    children[i].classList.remove("active");
  }
  e.target.classList.add("active");
  if (tabId === "tab01") {
    url = shallowRef(authMgmtCompany);
  } else if (tabId === "tab02") {
    url = shallowRef(authMgmtMenu);
  } else {
    url = shallowRef(authMgmtUser);
  }
  changeTab.value = await url.value;
}

onBeforeMount(() => {
  if ($loginStore.$state.userInfo.vendrCd === "0000") {
    url = shallowRef(authMgmtCompany);
  } else {
    url = shallowRef(authMgmtMenu);
  }
  changeTab.value = url.value;
})

</script>

<style scoped>

</style>