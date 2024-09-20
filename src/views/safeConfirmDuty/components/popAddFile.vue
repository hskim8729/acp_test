<template>
  <comp-modal
    style="min-width: 800px"
    class="bg-background"
    modal-title="증빙파일"
    @close="emit('closeModal')"
    @modal-action="modalAction"
    isActions
    actionBtnText="저장"
    maxModalWidth="800px">
    <v-sheet class="ma-3" style="height: calc(100% - 32px)" rounded="lg">
      <!-- 파일 갯수가 0일때 -->
      <template v-if="files.length === 0">
        <div class="d-flex flex-column justify-center align-center h-100">
          <v-icon size="120" color="gray200">mdi-file-upload-outline</v-icon>

          <div class="text-body-1 text-gray500 text-center pa-3">
            파일 업로드를 눌러 증빙 파일을 추가해주세요
          </div>
        </div>
      </template>
      <!-- 파일이 있을때 -->
      <v-list lines="2" class="px-3" v-else>
        <template v-for="(file, index) in files" :key="file.fileNm">
          <v-list-item class="py-3">
            <template v-slot:prepend>
              <v-avatar
                @mouseenter="setHover(index, true)"
                @mouseleave="setHover(index, false)"
                color="gray100"
                size="80"
                rounded="lg"
                :class="isHovered[index] ? 'pointer-cursor' : ''">
                <v-icon size="x-large" color="gray500"
                  >mdi-file-document-outline</v-icon
                >
                <v-btn
                  v-show="isHovered[index]"
                  icon="mdi-magnify"
                  size="small"
                  density="comfortable"
                  color="gray500"
                  variant="flat"
                  class="position-absolute bottom-0 right-0 ma-2" />
              </v-avatar>
            </template>

            <v-list-item-title
              @mouseenter="setHover(index, true)"
              @mouseleave="setHover(index, false)"
              :class="
                isHovered[index]
                  ? 'font-weight-bold text-decoration-underline pointer-cursor'
                  : ''
              ">
              {{ file.fileNm }}
            </v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="gray400"
                icon="mdi-tray-arrow-down"
                variant="text" />
              <v-btn
                color="error"
                icon="mdi-trash-can-outline"
                variant="text" />
            </template>
          </v-list-item>
          <v-divider v-if="index < files.length - 1"></v-divider>
        </template>
      </v-list>
    </v-sheet>
    <template #secondButton>
      <comp-button text="파일 업로드" variant="outlined" icon="mdi-upload" />
    </template>
  </comp-modal>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 컴포넌트
import compModal from "@/components/modal/compModal.vue";

// hover 상태 관리
const isHovered = ref({});

const setHover = (index, value) => {
  isHovered.value = { ...isHovered.value, [index]: value };
};

const loginStore = useLoginAuthStore();
const { vendrInfo, siteInfo, userInfo } = storeToRefs(loginStore);

const props = defineProps({
  files: { type: Array, default: [] },
});

const emit = defineEmits(["closeModal"]);

const modalAction = () => {
  emit("closeModal");
};
</script>

<style lang="scss" scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
