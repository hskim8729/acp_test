<template>
  <comp-button :text="btnText + ' 작성하기'" @click="openModal"> </comp-button>
  <compModal
    v-if="isModalOpen"
    @close="closeModal"
    @modal-action="modalAction"
    :modalTitle="title"
    :actionBtnText="actionBtnText"
    :isPersistent="isPersistent"
    isActions>
    <div class="pa-2">
      <formText label="게시글제목" class="py-2">
        <v-text-field
          v-model="bbsDetail.ttl"
          density="compact"
          placeholder="게시글 제목을 입력해주세요"
          variant="outlined"
          hide-details="auto">
        </v-text-field>
      </formText>
      <compEditor class="px-2" ref="editor" :params="editParam"></compEditor>
      <formText v-if="mode === 'U'" label="게시글삭제" class="py-2 pt-2">
        <v-btn @click="deleteBoard">게시글 삭제</v-btn>
      </formText>
    </div>
  </compModal>
</template>

<script setup>
// 라이브러리
import { computed, nextTick, ref, watch } from "vue";
// 스토어
import { useBbsStore } from "@/stores/board/bbs-store.js";
import { storeToRefs } from "pinia";
// 컴포넌트
import formText from "@/components/form/formText.vue";
// import compInput from "@/components/input/compInput.vue";
import compEditor from "@/components/editor/compEditor.vue";
import compModal from "@/components/modal/compModal.vue";

const props = defineProps({
  title: {
    type: String,
    default: "게시글 종류",
  },
  btnText: {
    type: String,
    default: "게시글 작성하기",
  },
  bbsClsCd: {
    type: String,
    default: "",
  },
});

const editor = ref(null);
const editorHeight = window.innerHeight - 420;
const editParam = ref({
  height: editorHeight,
  cntn: "",
  reaonly: true,
});

//compModal 열고 닫을때 isModalOpen 감지해서 내용을 업데이트함(에디터 준비되었는지 체크 후 업데이트)
const bbsStore = useBbsStore();
const { mode, isModalOpen, bbsDetail } = storeToRefs(bbsStore);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const updateBbsDetail = () => {
  if (editor.value) {
    editor.value.setHtmlContent(bbsDetail.value.cntn);
  } else {
    console.log("에디터가 준비되지 않았습니다.");
  }
};

// checkEditorAndRun 함수는 editor.value가 준비될 때까지 자신을 재귀적으로 호출, nextTick을 사용하여 각 호출이 다음 DOM 업데이트 사이클 이후에 일어나도록 함
const checkEditorAndRun = () => {
  if (editor.value) {
    updateBbsDetail();
  } else {
    nextTick(() => {
      checkEditorAndRun();
    });
  }
};

watch(
  () => isModalOpen.value,
  async () => {
    if (isModalOpen.value) {
      checkEditorAndRun();
    } else {
      // 모달 닫힐때 게시글 내용 초기화
      bbsStore.resetDetail();
    }
  }
);

// ttl, cntn 중 1개라도 값이 있으면 백그라운드 클릭시 바로 닫지 못함
const isPersistent = computed(() => {
  const cntn = editor.value?.getHtmlContent();
  if (bbsDetail.value.ttl || cntn) {
    return true;
  } else {
    return false;
  }
});

// 게시글 저장하기
const actionBtnText = computed(() =>
  mode.value === "I" ? props.title + " 작성하기" : props.title + " 수정하기"
);
const modalAction = async () => {
  const cntn = editor.value.getHtmlContent();
  bbsDetail.value.strtEnDt = "29991231";
  bbsDetail.value.strtStDt = "19990101";
  try {
    const result = await bbsStore.saveBoardList(props.bbsClsCd, cntn);
    isModalOpen.value = false;
    return bbsStore.boardSelectList(props.bbsClsCd);
  } catch (e) {
    console.log("saveBoardList >> 게시글 생성에 실패했습니다.");
  }
};

const deleteBoard = async () => {
  if (confirm("게시글이 삭제됩니다.")) {
    try {
      const result = await bbsStore.deleteList(
        bbsDetail.value.atchFileKey,
        bbsDetail.value.bbsSeq
      );
      isModalOpen.value = false;
      return await bbsStore.boardSelectList(props.bbsClsCd);
    } catch (e) {
      alert("게시글 삭제에 실패했습니다.");
    }
  }
};
</script>

<style lang="scss" scoped></style>
