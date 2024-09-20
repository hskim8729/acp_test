<template>
  <v-dialog
    v-model="dialogRef"
    no-click-animation
    close-on-back
    hide-overlay
    transition="dialog-bottom-transition"
    fullscreen>
    <template #default="{ isActive }">
      <v-card class="card-scrollbar">
        <v-toolbar dark color="white" density="comfortable">
          <template #prepend>
            <!-- 뒤로가기 버튼 -->
            <v-btn icon @click="emit('close')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <!-- 제목 -->
          <v-toolbar-title class="ml-0 font-weight-black text-center">
            {{ modalTitle }}
          </v-toolbar-title>

          <template #append>
            <!-- 가운데 정렬을 위한 더미 버튼-->
            <v-btn icon disabled class="invisible">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
        <v-divider />

        <v-card-text :class="noInnerPadding ? 'pa-0' : ''">
          <slot name="default" v-bind="isActive">
            {{ "모달에 들어갈 컨텐츠" }}
          </slot>
        </v-card-text>

        <v-divider v-if="isActions" />

        <!-- 모달 하단 액션부분 : isActions=false 인 경우 사용 X -->
        <v-card-actions
          v-if="isActions || $slots.secondButton"
          class="ma-0 pa-0 d-flex justify-space-between m-modal-action">
          <slot name="actions">
            <v-row>
              <v-col
                v-if="$slots.secondButton"
                :cols="isActions ? '6' : '12'"
                class="pa-0">
                <slot name="secondButton"> </slot>
              </v-col>
              <v-col
                v-if="isActions"
                :cols="$slots.secondButton ? '6' : '12'"
                class="pa-0">
                <v-btn
                  @click="emit('modalAction')"
                  variant="flat"
                  color="#366587"
                  :class="`ma-0 w-100 rounded-0 m-btn ${
                    $slots.secondButton ? 'border-l-1' : ''
                  }`">
                  {{ actionBtnText }}
                </v-btn>
              </v-col>
            </v-row>
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
  modalTitle: {
    type: String,
    default: "모달제목",
  },
  isPersistent: {
    type: Boolean,
    default: false,
  },
  noInnerPadding: {
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

<style scoped>
.m-modal-action {
  min-height: 43px;
}
.border-l-1 {
  border-left: white 1px solid;
}

.invisible {
  visibility: hidden;
}

.card-scrollbar {
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.card-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
