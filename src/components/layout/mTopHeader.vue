<template>
  <div class="m_top_wrap">
    <button class="m_top_menu_btn" @click="mMenuOpen"></button>
    <div class="m_page_title"></div>
    <router-link to="/m-main"
      ><button class="m_top_home_btn"></button
    ></router-link>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  getCurrentInstance,
  onMounted,
} from "vue";
import VueCookies from "vue-cookies";
import mLeftMenu from "@/components/layout/mLeftMenu.vue";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const mMenuOpen = () => {
  /** 로그인 후 최초에 메뉴 버튼 클릭 시 메뉴리스트 조회 */
  if (!$loginStore.isFirstOpenMenu) {
    $loginStore.isFirstOpenMenu = true;
  }
  document.getElementsByClassName("m_left_menu")[0].classList.add("open");
  document.getElementsByClassName("m_menu_bg")[0].classList.add("show");
};

/* 로그아웃 기능 좌측 메뉴로 이동
function logout() {
   
    if (confirm("로그아웃 하시겠습니까?")) {
        // 로그아웃 클릭 시 localStorage 삭제 (id, pw)
        window.localStorage.removeItem("mUserId");
        window.localStorage.removeItem("mUserPw");
        window.localStorage.removeItem("mExprTime");

        VueCookies.remove("AT");
        window.sessionStorage.clear();

        location.href = "/m-login";
    }

    //$loginStore.logout();
}
*/
</script>

<style></style>
