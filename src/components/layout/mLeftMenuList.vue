<template>
  <div class="m-left-menu">
    <v-card class="mx-auto custom-card">
      <v-list class="custom-list">
        <template v-for="menu in menus" :key="menu.menuId">
          <template v-if="!menu.childrens">
            <!-- 단일 메뉴일 경우 -->
            <v-list-item
              @click="movePage(menu.link)"
              class="custom-list-item pa-0">
              <template v-slot:default>
                {{ menu.menuName }}
              </template>
              <template v-slot:append v-if="menu.apndIcon">
                <v-btn
                  color="grey-lighten-1"
                  :icon="menu.apndIcon"
                  variant="text"></v-btn>
              </template>
            </v-list-item>
          </template>
          <template v-else>
            <!-- 자식 메뉴가 있는 경우 -->
            <v-list-group :value="menu.menuId" class="custom-list-group">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" class="custom-list-item pa-0">
                  <template v-slot:default>
                    {{ menu.menuName }}
                  </template>
                </v-list-item>
              </template>

              <v-list-item
                v-for="children in menu.childrens"
                @click="movePage(children.link)"
                :key="children.id"
                :prepend-icon="children.icon"
                :title="children.menuName"
                :value="children.menuId"></v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";

import mMenus from "@/stores/common/mMenus.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

// loginStore 전역변수
const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();

// 현장 없음
const isNoSite = !loginStore.$state.siteInfo.siteCd;

const movePage = (link) => {
  // 현장 있으면 페이지 링크
  if (!isNoSite) {
    router.push(link);
    menuClose();
  } else {
    // 현장 없으면 popup open
    window.open(link, "_blank", "noopener,noreferrer");
  }
};

const menuClose = () => {
  document.getElementsByClassName("m_left_menu")[0].classList.remove("open");
  document.getElementsByClassName("m_menu_bg")[0].classList.remove("show");
};

const menus = ref([]);
onMounted(() => {
  menus.value = isNoSite ? mMenus.noSiteMenuList : mMenus.menuList;
});
</script>

<style scope></style>
