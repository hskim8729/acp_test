<template>
  <v-sheet class="h-100 bg-transparent">
    <v-textarea
      :maxlength="textMax"
      :counter="textMax"
      class="read-only-style-none h-100"
      hide-details="auto"
      v-model="fctrOrMsr"
      density="compact"
      auto-grow
      rows="1"
      variant="plain"
      spellcheck="false"
      :disabled="selectedVenderCd === '0000'"
      :placeholder="placeholderTxt"
      @blur="onBlur"
      @input="updateItem(fctrMsrItem, $event)">
      <template #append-inner v-if="selectedVenderCd !== '0000'">
        <v-btn
          v-if="isChanged === true || !fctrMsrItem.isTextarea"
          :icon="icon"
          size="small"
          density="comfortable"
          @click="onClick"></v-btn>
      </template>
    </v-textarea>
  </v-sheet>
</template>

<script setup>
import { useDialogStore } from "@/stores/common/dialog-store";
import { useRiskFactorStandardStore } from "@/stores/stdMgmt/risk-factor-standard-store.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const store = useRiskFactorStandardStore();
const dialogStore = useDialogStore();
const { fctrMsrItem } = defineProps(["fctrMsrItem"]);
const { selectedVenderCd } = storeToRefs(store);

const fctrOrMsr = computed({
  get: () => (fctrMsrItem.isRskFctr ? fctrMsrItem.rskFctr : fctrMsrItem.rskMsr),
  set: (value) => {
    if (fctrMsrItem.isRskFctr) {
      fctrMsrItem.rskFctr = value;
    } else {
      fctrMsrItem.rskMsr = value;
    }
  },
});

const textMax = computed(() => {
  return fctrMsrItem.isRskFctr ? 300 : 2000;
});

const placeholderTxt = computed({
  get: () => {
    if (fctrMsrItem.isRskFctr) {
      return `해당 작업의 위험요인을 입력해주세요(최대 ${textMax.value}자)`;
    } else if (selectedVenderCd.value === "0000") {
      return "해당 위험요인의 표준 감소대책이 없습니다";
    }
    return `위험요인의 표준 감소 대책을 입력해주세요(최대 ${textMax.value}자)`;
  },
});

//   fctrOrMsr를 변경했을 때만 수정 버튼이 보이게 하려고 이 값을 변경했는지 추적
const isChanged = ref(false);

// 위험요소와 감소대책 분기처리
const updateItem = (fctrMsrItem, event) => {
  isChanged.value = true;
  if (fctrMsrItem.isRskFctr) {
    fctrMsrItem.rskFctr = event.target.value;
    // nextTick(() => resizeTextArea(fctrMsrItem.textareaRef));
  } else {
    fctrMsrItem.rskMsr = event.target.value;
    // nextTick(() => resizeTextArea(fctrMsrItem.textareaRef));
  }
};

const icon = computed(() => {
  if (selectedVenderCd.value === "0000") {
    return "";
  } else if (!isChanged.value) {
    // 값에 변경 내용이 없으면 삭제
    return "mdi-delete";
  } else if (fctrMsrItem.isTextarea) {
    // 값에 변경 내용이 있는경우 fctrMsrItem.isTextarea true인 경우 신규추가
    return "mdi-plus";
  } else {
    // 업데이트
    return "mdi-content-save";
  }
});
const onClick = () => {
  // v-if로 막아놨으나 혹시 몰라 방지
  if (selectedVenderCd.value === "0000") {
    dialogStore.openAlertDialog("위험요인 기본 템플릿을 삭제할 수 없습니다.");
    return false;
  }
  // onBlur가 보통 먼저 실행 되어서 click 실행이 거의 안되긴 함
  if (icon.value === "mdi-delete") {
    onDeleteBtnClick();
  } else if (isChanged.value && icon.value === "mdi-plus") {
    onAddBtnClick();
  } else if (isChanged.value && icon.value === "mdi-content-save") {
    onUpdateBtnClick();
  }
};
const onBlur = () => {
  // 버튼 클릭시 blur 함수가 같이 일어나기 때문에 changed 하지 않은 경우 함수 실행 X
  if (isChanged.value && icon.value === "mdi-plus") {
    onAddBtnClick();
  } else if (isChanged.value && icon.value === "mdi-content-save") {
    onUpdateBtnClick();
  }
};

// 추가 시
const onAddBtnClick = () => {
  // 빈칸은 신규 추가하지 않음
  if (fctrOrMsr.value === "") {
    isChanged.value = false;
    return;
  }

  if (fctrMsrItem.isRskFctr) {
    const params = {
      mode: "I",
      rskFctr: fctrMsrItem.rskFctr.trim(),
    };
    store.fetchRskFctr(params).then(() => {
      fctrMsrItem.rskFctr = "";
    });
  } else {
    const params = {
      mode: "I",
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
      rskMsr: fctrMsrItem.rskMsr.trim(),
    };
    store.fetchRskFctrMsr(params).then(() => {
      fctrMsrItem.rskMsr = "";
    });
  }
};

// 삭제 시
const onDeleteBtnClick = () => {
  dialogStore.openConfirmDialog("이 항목을 삭제하시겠습니까?", {
    confirmCallback: () => {
      if (fctrMsrItem.isRskFctr) {
        const params = {
          mode: "D",
          rskFctr: fctrMsrItem.rskFctr,
          rskFctrSeq: fctrMsrItem.rskFctrSeq,
        };
        store.fetchRskFctr(params);
      } else {
        const params = {
          mode: "D",
          rskFctrSeq: fctrMsrItem.rskFctrSeq,
          rskMsr: fctrMsrItem.rskMsr,
          rskMsrSeq: fctrMsrItem.rskMsrSeq,
        };
        store.fetchRskFctrMsr(params);
      }
    },
  });
};

// 수정 시
const onUpdateBtnClick = () => {
  if (fctrMsrItem.isRskFctr) {
    const params = {
      mode: "U",
      rskFctr: fctrMsrItem.rskFctr.trim(),
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
    };
    store.fetchRskFctr(params).then((isChanged.value = false));
  } else {
    const params = {
      mode: "U",
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
      rskMsr: fctrMsrItem.rskMsr.trim(),
      rskMsrSeq: fctrMsrItem.rskMsrSeq,
    };
    store.fetchRskFctrMsr(params).then((isChanged.value = false));
  }
};
</script>

<style scoped></style>
