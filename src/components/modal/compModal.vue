<template>
  <v-dialog
    v-model="dialogRef"
    @click:outside="handleOutsideClick"
    scrollable
    :width="modalWidth"
    persistent
    no-click-animation
    close-on-back
    :fullscreen="fullscreen"
    :max-width="maxModalWidth">
    <template #default="{ isActive }">
      <v-card :rounded="fullscreen ? '' : 'lg'">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="font-weight-black ps-2 pt-1">
            {{ modalTitle }}
          </div>

          <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
        </v-card-title>

        <v-divider />

        <v-card-text
          :style="{ height: props.height }"
          class="pa-0"
          :class="props.class">
          <slot name="default" v-bind="isActive">
            {{ "모달에 들어갈 컨텐츠" }}
          </slot>
        </v-card-text>

        <v-divider v-if="isActions" />

        <!-- 모달 하단 액션부분 : isActions=false 인 경우 사용 X -->
        <v-card-actions
          v-if="isActions"
          class="my-1 d-flex justify-space-between">
          <slot name="actions">
            <comp-button
              variant="outlined"
              fontColor="#4C5663"
              :text="cancleBtnText"
              @click="emit('close')"></comp-button>
            <v-spacer />
            <slot name="secondButton"> </slot>
            <comp-button
              :text="actionBtnText"
              @click="emit('modalAction')"></comp-button>
          </slot>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { useDialogStore } from "@/stores/common/dialog-store";
import { computed } from "vue";

const props = defineProps({
  isModalOpen: {
    // isModalOpen은 항상 true로 두고 prop으로 넘기지X 페이지 컴포넌트에서 제어함
    type: Boolean,
    default: true,
  },
  maxModalWidth: {
    type: [String, Number],
    default: 900,
  },
  modalWidth: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: "800px",
  },
  modalTitle: {
    type: String,
    default: "모달제목",
  },
  isPersistent: {
    type: Boolean,
    default: false,
  },
  isActions: {
    type: Boolean,
    default: false,
  },
  actionBtnText: {
    type: String,
    default: "모달 액션 실행하기",
  },
  cancleBtnText: {
    type: String,
    default: "취소하기",
  },
  class: {
    type: String,
    default: "",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

/**
 * 부모 컴포넌트에서 @modal-action 등 케밥케이스 형태로 함수 전달
 */
const emit = defineEmits(["modalAction", "close", "update:isModalOpen"]);

const dialogStore = useDialogStore();
const handleOutsideClick = () => {
  if (props.isPersistent === true) {
    dialogStore.openConfirmDialog("현재 작성하던 내용이 지워집니다.", {
      confirmCallback: () => {
        emit("close");
      },
    });
  } else {
    emit("close");
  }
};

const dialogRef = computed({
  get: () => props.isModalOpen,
  set: (val) => emit("update:isModalOpen", val),
});
</script>

<style scoped></style>
