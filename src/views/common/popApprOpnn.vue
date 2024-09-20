<!-- 팝업-결재 승인의견 -->
<template>
  <comp-button
    :text="apprBtnNm"
    class="appr_status"
    @click="popupApprOpnn"
    :disabled="disabled"
    :requiredAuth="apprBtnNm === '상신'">
  </comp-button>
  <comp-modal
    v-if="isModalOpen"
    modal-title="결재 의견"
    height="200px"
    max-width="500px"
    :actionBtnText="apprBtnNm"
    @modal-action="sendApprOpnn('appr', apprBtnNm)"
    @close="closeModal"
    isActions>
    <v-textarea
      class="pa-2"
      style="height: 200px"
      variant="outlined"
      ref="apprOpnnTextarea"
      auto-grow
      hide-details
      hide-spin-buttons
      v-model="textApprOpnn"></v-textarea>
    <template #secondButton v-if="isShownBtn">
      <comp-button text="반려" @click="sendApprOpnn('rej', '반려')">
      </comp-button>
    </template>
  </comp-modal>
</template>

<script setup>
import { defineExpose, getCurrentInstance, onBeforeMount, ref } from "vue";

import compModal from "@/components/modal/compModal.vue";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useDialogStore } from "@/stores/common/dialog-store";
import { myInfoStore } from "@/stores/common/myinfo-store";

const userInfoStore = myInfoStore();
const dialogStore = useDialogStore();
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const props = defineProps({
  apprUserList: {
    type: Object,
    default: null,
  },
  crntApprOver: {
    type: Object,
    default: null,
  },
  apprBtnNm: {
    type: String,
    default: "상신",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["apprOpnn", "validCheck"]);

const textApprOpnn = ref("");
const isShownBtn = ref(true);

const apprOpnnTextarea = ref(null);

function sendApprOpnn(apprGbn, apprBtn) {
  const params = {
    apprOpnn: textApprOpnn.value,
    apprGbn,
    apprBtn,
  };
  emit("apprOpnn", params);

  closeModal();
}

function rejChk() {
  if (!props.crntApprOver) {
    isShownBtn.value = false;
  } else {
    if (props.crntApprOver.ASIDflag === "Y") {
      isShownBtn.value = false;
    } else {
      isShownBtn.value = Number(props.crntApprOver.apprSeq) !== 1;
    }
  }
}

// 팝업 - 결재의견 추가
async function popupApprOpnn() {
  const isValid = await new Promise((resolve) => {
    // 결재의견 팝업 open전 화면에서 유효성 체크가 필요한 경우
    if (isValidCheck) {
      emit("validCheck", { resolve });
    } else {
      resolve(true);
    }
  });

  if (isValid) {
    const params = {
      vendrCd: $loginStore.$state.userInfo.vendrCd,
      userId: $loginStore.$state.userInfo.userId,
    };

    // 서명정보 조회
    const signInfo = await userInfoStore.selectMySignMgmt(params);

    if (!signInfo) {
      dialogStore.openAlertDialog("서명을 등록해주세요.");
      return false;
    }

    if (props.apprUserList.length <= 1) {
      dialogStore.openAlertDialog("결재자는 1명 이상이여야 합니다.");
      return false;
    }

    openModal();
  }
}

/**
 * compModal 열고 닫기
 */
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

let isValidCheck = false;
onBeforeMount(() => {
  const instance = getCurrentInstance();

  if (instance) {
    // 부모 컴포넌트에서 validCheck 이벤트가 정의되어 있는지 확인
    isValidCheck = "onValidCheck" in instance.vnode.props;
  }

  rejChk();
});

const focus = () => {
  apprOpnnTextarea.value.focus();
};

defineExpose({
  focus,
});
</script>

<style scoped></style>
