<template>
  <comp-button
    :bg-color="btnColor"
    :variant="btnColor"
    :text="openBtnText ? openBtnText : title"
    @click="openModal"></comp-button>
  <compModal
    v-if="isModalOpen"
    @close="closeModal"
    :modalTitle="title"
    :fullscreen="fullscreen"
    :transition="fullscreen ? 'dialog-bottom-transition' : ''">
    <boardDetailViewer v-if="bbsStore.bbsList.length > 0" />
    <div style="height: 380px">
      <boardList :bbsClsCd="props.bbsClsCd" readOnly />
    </div>
  </compModal>
</template>

<script setup>
// 라이브러리
import { ref } from "vue";
// 스토어
import { useBbsStore } from "@/stores/board/bbs-store.js";
// 컴포넌트
import compModal from "@/components/modal/compModal.vue";
import boardDetailViewer from "@/views/board/components/boardDetailViewer.vue";
import boardList from "@/views/board/components/boardList.vue";

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const bbsStore = useBbsStore();

const props = defineProps({
  openBtnText: {
    type: String,
    default: "",
  },
  btnColor: {
    type: String,
    default: "text",
  },
  btnVariant: {
    type: String,
    default: "transparent",
  },
  title: {
    type: String,
    default: "게시글 종류",
  },
  bbsClsCd: {
    type: String,
    default: "",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
