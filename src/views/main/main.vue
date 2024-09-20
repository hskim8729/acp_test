<template>
  <div class="dash_top_wrap">
    <div class="dash_tab">
      <ul v-if="loginStore.authInfo.authCd === '1000'">
        <li @click="tabAction($event)" id="headOffice">본사</li>
        <li @click="tabAction($event)" id="siteOffice">현장</li>
      </ul>
      <ul v-else-if="loginStore.authInfo.authClsCd === 'T2201'">
        <li @click="tabAction($event)" id="headOffice" class="active">본사</li>
      </ul>
      <ul v-else-if="loginStore.authInfo.authClsCd === 'T2203'">
        <li @click="tabAction($event)" id="siteOffice" class="active">
          협력사
        </li>
      </ul>
      <ul v-else>
        <li @click="tabAction($event)" id="siteOffice" class="active">현장</li>
      </ul>
    </div>
  </div>
  <div class="dash_content_wrap">
    <div :class="getAuthCls" class="show">
      <component :is="changeTab" :key="loginStore.siteInfo.siteCd"></component>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  shallowRef,
  onUpdated,
  onActivated,
  watch,
  nextTick,
} from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import mainHeadOffice from "./main_headOffice.vue";
import mainSite from "./main_site.vue";

const loginStore = useLoginAuthStore();
let changeTab = shallowRef();
let url = shallowRef();
let classNm = ref("");
let active = ref("");
let tabVal = sessionStorage.getItem("active");

const getAuthCls = async () => {
  let authCls = await loginStore.authInfo.authClsCd;

  if (authCls === "T2201") {
    classNm.value = "dash_head_office";
  } else if (authCls === "T2202") {
    classNm.value = "dash_site";
  } else {
    classNm.value = "dash_partner";
  }

  return classNm.value;
};

async function tabAction(e) {
  let dashTab = document.querySelectorAll(".dash_tab li");

  dashTab.forEach((item) => {
    item.classList.remove("active");
  });

  e.target.classList.add("active");

  if (e.target.id === "headOffice") {
    url = shallowRef(mainHeadOffice);
    active.value = "head";
  } else {
    url = shallowRef(mainSite);
    active.value = "site";
  }

  sessionStorage.setItem("active", active.value);
  changeTab.value = await url.value;
}

async function viewAuth() {
  if (loginStore.authInfo.authClsCd === "T2201") {
    if (loginStore.authInfo.authCd === "1000") {
      if (tabVal === "head") {
        active.value = "head";
        url = shallowRef(mainHeadOffice);
        document.getElementById("headOffice").classList.add("active");
        document.getElementById("siteOffice").classList.remove("active");
      }
      if (tabVal === "site") {
        active.value = "site";
        url = shallowRef(mainSite);
        document.getElementById("headOffice").classList.remove("active");
        document.getElementById("siteOffice").classList.add("active");
      }
    } else {
      active.value = "head";
      url = shallowRef(mainHeadOffice);
      document.getElementById("headOffice").classList.add("active");
    }
  } else {
    console.log("여기로 오나?");
    active.value = "site";
    url = shallowRef(mainSite);
    document.getElementById("siteOffice").classList.add("active");
  }
  changeTab.value = await url.value;
}

onBeforeMount(() => {
  tabVal = sessionStorage.getItem("active");

  if (tabVal == undefined) {
    sessionStorage.setItem("active", "head");
    tabVal = sessionStorage.getItem("active");
  }

  // 세션 저장 이후에 실행되도록 nextTick 걸음
  nextTick(() => {
    viewAuth();
  });
});
</script>

<style scoped></style>
