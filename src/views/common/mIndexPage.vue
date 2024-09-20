<template>
  <v-layout style="height: 100vh">
    <v-app-bar density="comfortable" :style="appBarStyle">
      <v-app-bar-title>
        <v-img :src="logoUrl" alt="Plan2do Logo" width="112" />
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn
          rounded="xl"
          variant="flat"
          color="white"
          density="comfortable"
          class="mx-3 text-subtitle-6 px-4"
          @click="isOpenMemberRegist = true"
          >무료 회원가입</v-btn
        >
      </template>
    </v-app-bar>

    <v-main>
      <div ref="containerRef" class="snap-container">
        <div
          v-for="(item, index) in components"
          :key="index"
          class="snap-child">
          <component :is="item.component" v-bind="item.props" />
        </div>
      </div>
    </v-main>

    <v-btn
      color="#1B2F4B"
      class="start-btn"
      block
      height="56"
      @click="downloadApp">
      앱 다운로드
    </v-btn>
  </v-layout>
  <m-member-regist
    v-if="isOpenMemberRegist"
    @close="isOpenMemberRegist = false">
  </m-member-regist>
</template>

<script setup>
import logoUrl from "@/assets/img/index_top_logo.png";
import { useSnapScroll } from "@/composables/useSnapScroll";
import mFooter from "@/views/common/mIndex/mFooter.vue";
import mIndexCard from "@/views/common/mIndex/mIndexCard.vue";
import cardInfoList from "@/views/common/mIndex/mIndexInfo";
import { onMounted, ref } from "vue";

import mMemberRegist from "@/m-views/sys/m-memberRegist.vue";

const isOpenMemberRegist = ref(false);

const cards = cardInfoList.map((info) => ({
  component: mIndexCard,
  props: info,
}));

const components = [...cards, { component: mFooter, props: {} }];

const { containerRef } = useSnapScroll();

const appBarStyle = {
  background: "linear-gradient(90deg, #1a2e4a, #31445f)",
};

const isIOS = ref(false);

onMounted(() => {
  // 간단한 iOS 감지 로직
  isIOS.value =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
});

const downloadApp = () => {
  if (isIOS.value) {
    openAppleStore();
  } else {
    openGoogleStore();
  }
};

function openGoogleStore() {
  // 구글 스토어 링크
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=com.asianaidt.tapp&hl=ko-KR";
  // 새 창 열기
  window.open(googlePlayLink, "_blank");
}

function openAppleStore() {
  const appStoreLink = "https://apps.apple.com/kr/app/plan2do/id6473452985";
  window.open(appStoreLink, "_blank");
}
</script>

<style lang="scss" scoped>
.snap-container {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  padding-bottom: 55px; /* Add padding to account for the fixed button */
}

.snap-child {
  scroll-snap-align: start;
}

::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}

.start-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-radius: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
