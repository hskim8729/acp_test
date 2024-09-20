<template>
  <v-app>
    <div class="loading_wrap">
      <div class="loading">
        <div class="rotate01"></div>
        <div class="rotate02"></div>
        <div class="text"></div>
      </div>
    </div>

    <div class="popup_bg"></div>
    <div class="popup_bg2"></div>
    <div class="popup_bg_no_close"></div>

    <div class="m_menu_bg" @click="mMenuClose"></div>

    <!-- CONFIRM -->
    <div class="confirm_popup">
      <span>confirm 내용<br />confirm 내용<br />confirm 내용</span>
      <div class="btn_area">
        <button>확인</button>
        <button>취소</button>
      </div>
    </div>

    <!-- 모바일 화면 -->
    <el-container class="layoutWrap" v-if="isMobile">
      <el-header v-if="!isMLoginPaths">
        <mTopHeader></mTopHeader>
      </el-header>

      <el-aside v-if="!isMLoginPaths">
        <mLeftMenu :key="loginStore.$state.menuInfo"></mLeftMenu>
      </el-aside>

      <el-container class="m_content_wrap" v-if="!isMLoginPaths">
        <!-- page area start -->
        <RouterView v-if="$route.path === '/SITE/m-siteImpRegulation'">
        </RouterView>

        <div v-else class="m_content_area">
          <RouterView :key="loginStore.$state.userInfo" />
        </div>
        <!-- page area end -->
      </el-container>

      <el-container class="m_login_wrap" v-if="isMLoginPaths">
        <!-- page area start -->
        <RouterView :key="loginStore.$state.userInfo" />
        <!-- page area end -->
      </el-container>
    </el-container>

    <!-- 웹 화면 -->
    <el-container class="layoutWrap" v-else>
      <el-header
        v-if="
          !(
            $route.path === '/terms' ||
            $route.path === '/login' ||
            $route.path === '/notifyNewsView' ||
            $route.path === '/sso'
          )
        ">
        <top-header :key="loginStore.$state.userInfo"></top-header>
      </el-header>

      <el-aside
        v-if="
          !(
            $route.path === '/terms' ||
            $route.path === '/login' ||
            $route.path === '/notifyNewsView' ||
            $route.path === '/sso'
          )
        ">
        <left-menu :key="loginStore.$state.menuInfo"></left-menu>
      </el-aside>

      <el-container
        class="content_wrap"
        v-if="
          !(
            $route.path === '/terms' ||
            $route.path === '/login' ||
            $route.path === '/notifyNewsView' ||
            $route.path === '/sso'
          )
        ">
        <div class="content_area">
          <!-- page area start -->
          <RouterView :key="loginStore" />
          <!-- page area end -->
        </div>
      </el-container>

      <el-container
        class="index_wrap"
        v-if="$route.path === '/login' || $route.path === '/sso'">
        <!-- page area start -->
        <RouterView :key="loginStore" />
        <!-- page area end -->
      </el-container>

      <el-container class="index_wrap" v-if="$route.path === '/terms'">
        <!-- page area start -->
        <RouterView :key="loginStore" />
        <!-- page area end -->
      </el-container>

      <el-container class="index_wrap" v-if="$route.path === '/notifyNewsView'">
        <!-- page area start -->
        <RouterView :key="loginStore" />
        <!-- page area end -->
      </el-container>
    </el-container>

    <alert-dialog v-if="isAlertDialog" v-model="isAlertDialog"></alert-dialog>
    <toast-dialog v-if="isToastDialog" v-model="isToastDialog"></toast-dialog>
    <confirm-dialog
      v-if="isConfirmDialog"
      v-model="isConfirmDialog"></confirm-dialog>
    <loading-dialog
      v-if="isLoadingDialog"
      v-model="isLoadingDialog"></loading-dialog>
  </v-app>
</template>

<script setup>
import {
  getCurrentInstance,
  onBeforeMount,
  ref,
  watchEffect,
  computed,
} from "vue";
import { useRoute } from "vue-router";

import alertDialog from "@/components/dialog/alertDialog.vue";
import confirmDialog from "@/components/dialog/confirmDialog.vue";
import loadingDialog from "@/components/dialog/loadingDialog.vue";
import toastDialog from "@/components/dialog/toastDialog.vue";
import LeftMenu from "@/components/layout/LeftMenu.vue";
import TopHeader from "@/components/layout/TopHeader.vue";
import mLeftMenu from "@/components/layout/mLeftMenu.vue";
import mTopHeader from "@/components/layout/mTopHeader.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();
const route = useRoute();

// loginStore 전역변수 설정
const app = getCurrentInstance();
app.appContext.config.globalProperties.$isMobile = MobileYn();
app.appContext.config.globalProperties.$loginStore = loginStore;
const isMobile = app.appContext.config.globalProperties.$isMobile;

// 모바일 login path일 때는 header, leftmenu, content영역 숨기기
const loginPaths = ["/m-login", "/sso", "/m-index"];
const isMLoginPaths = computed(() => loginPaths.includes(route.path));

function popupClose() {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");

  // 팝업이 여러개일때 popup 클래스 모두 닫음
  let popupClass = document.querySelectorAll(".popup");

  popupClass.forEach((popupClose) => {
    popupClose.classList.remove("show");
  });
}

function popInPopClose() {
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");

  // 팝업이 여러개일때 pop_in_pop 클래스 모두 닫음
  let pipClass = document.querySelectorAll(".pop_in_pop");

  pipClass.forEach((pipClose) => {
    pipClose.classList.remove("show");
  });
}

function mMenuClose() {
  document.getElementsByClassName("m_menu_bg")[0].classList.remove("show");
  document.getElementsByClassName("m_left_menu")[0].classList.remove("open");
}

function MobileYn() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

onBeforeMount(() => {
  console.log("isMobile ======", isMobile);
});

// 공통 Dialog 처리
const isAlertDialog = ref(false);
const isConfirmDialog = ref(false);
const isToastDialog = ref(false);
const isLoadingDialog = ref(false);

watchEffect(() => {
  // alert, confirm, toast dialog 호출하기 위해 commonStore에서 값 조회해서 업데이트
  isAlertDialog.value = dialogStore.isAlertDialog;
  isConfirmDialog.value = dialogStore.isConfirmDialog;
  isToastDialog.value = dialogStore.isToastDialog;
  isLoadingDialog.value = dialogStore.isLoadingDialog;
});
</script>

<style scoped></style>
