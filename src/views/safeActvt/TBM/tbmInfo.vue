<template>
  <comp-card-foldable title="1. TBM 정보" isFlat>
    <v-sheet max-width="1200px" class="mx-auto">
      <v-container class="d-flex flex-row pa-0">
        <form-text label="TBM 명">
          <comp-input
            v-model="detailInfo.tbmNm"
            placeholder="TBM 명을 입력해주세요"
            name="TBM 명"
            required />
        </form-text>

        <formText label="TBM 일시">
          <div class="d-flex flex-row">
            <comp-input
              type="date"
              v-model="formedDate"
              class="mr-2"
              name="TBM 날짜"
              :disabled="route.params.mode !== 'I'"
              required />
            <comp-input
              type="time"
              v-model="formedTime"
              class="ms-2"
              name="TBM 시간"
              required />
          </div>
        </formText>
      </v-container>

      <formText label="주최자">
        <v-text-field
          v-model="actMgnrText"
          placeholder="주최자를 지정해주세요"
          :rules="[required]"
          @click="isAddModalOpen = true"
          density="compact"
          variant="outlined"
          hide-details="auto"
          append-inner-icon="mdi-magnify" />
      </formText>

      <pop-select-user
        v-if="isAddModalOpen"
        rowSelection="single"
        @close-modal="isAddModalOpen = false"
        @get-selected-users="onAddUsers" />

      <v-container>
        <v-divider />
      </v-container>

      <v-container class="d-flex flex-row pa-0">
        <formText label="작업명">
          <comp-input
            v-model="detailInfo.wrkNm"
            class="ms-2"
            placeholder="작업명을 입력해주세요"
            name="작업명"
            required />
        </formText>

        <formText label="작업계획서">
          <div class="d-flex flex-row">
            <button
              class="file_list_btn text-white"
              @click="openPopFileAttach"
              type="button">
              파일추가<label>{{ saveFileCnt }}</label>
            </button>
          </div>
        </formText>
      </v-container>

      <formText label="작업내용">
        <v-textarea
          v-model="detailInfo.wrkDtl"
          placeholder="작업내용을 입력해주세요"
          :rules="[required]"
          maxlength="2000"
          variant="outlined"
          auto-grow
          hide-details="auto"
          hide-spin-buttons />
      </formText>

      <formText label="작업위치" isOption>
        <comp-input
          v-model="detailInfo.wrkLoc"
          class="ms-2"
          placeholder="작업위치를 입력해주세요" />
      </formText>

      <v-container class="d-flex flex-row pa-0">
        <formText label="인원수" isOption>
          <comp-input
            v-model="peopleNum"
            class="ms-2"
            placeholder="인원수를 입력해주세요" />
        </formText>
        <formText label="장비/도구" isOption width="92px">
          <comp-input
            v-model="detailInfo.inptEqmnt"
            class="ms-2"
            placeholder="장비/도구를 입력해주세요" />
        </formText>
      </v-container>

      <v-container>
        <v-divider />
      </v-container>

      <formText label="안전교육">
        <v-textarea
          v-model="detailInfo.sftEdu"
          placeholder="안전교육을 입력해주세요"
          :rules="[required]"
          maxlength="2000"
          variant="outlined"
          auto-grow
          hide-details="auto"
          hide-spin-buttons />
      </formText>

      <v-container>
        <v-divider />
      </v-container>

      <form-text label="첨부파일" isOption>
        <div class="pt-2" style="max-width: 300px; min-width: 300px">
          <file-handler
            table="TBM"
            :files="files"
            :readOnly="readonly"
            :userId="detailInfo?.regId ? detailInfo.regId : ''"
            ref="fileHandlerRef" />
        </div>
      </form-text>
    </v-sheet>
  </comp-card-foldable>

  <pop-file-attach
    :sendData="detailInfo"
    :key="detailInfo"
    :isWriteAuth="!readonly"
    @saveFileCnt="getSaveFileCnt"
    @sendSelectedFiles="getSelectedFiles"
    v-if="isPopFileAttach"
    @close="closePopFileAttach">
  </pop-file-attach>
</template>

<script setup>
// node_modules
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, defineEmits, ref } from "vue";
import { useRoute } from "vue-router";
// 컴포넌트
import fileHandler from "@/components/file/fileHandler.vue";
import formText from "@/components/form/formText.vue";
import compCardFoldable from "@/components/layout/compCardFoldable.vue";
import popFileAttach from "@/views/common/popFileAttach.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";
// store
// import { useDialogStore } from "@/stores/common/dialog-store";

import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
// sevice

const route = useRoute(); // 현재 라우트 정보를 가져옴.

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const { detailInfo, tbmAtchFileList } = storeToRefs(toolBoxRegiStore);
const files = ref([]);
files.value = tbmAtchFileList.value;

const emits = defineEmits(["afterUploadFile"]);
const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
});

const formedDate = computed({
  get: () => {
    if (detailInfo.value.tbmDt) {
      return dayjs(detailInfo.value.tbmDt, "YYYYMMDD").format("YYYY-MM-DD");
    } else {
      return "";
    }
  },
  set: (val) => {
    if (val) {
      detailInfo.value.tbmDt = val.split("-").join("");
    }
  },
});

const formedTime = computed({
  get: () => {
    return dayjs(detailInfo.value.tbmTime, "HHmm").format("HH:mm");
  },
  set: (val) => {
    if (val) {
      detailInfo.value.tbmTime = val.split(":").join("");
    }
  },
});

const peopleNum = computed({
  get: () => {
    return detailInfo.value.inptPsn;
  },
  set: (val) => {
    detailInfo.value.inptPsn = val
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
  },
});

const actMgnrText = computed(() => {
  if (detailInfo.value.tbmOrgnsId) {
    // tbm 주최자의 회사와와 작성자의 회사가 다른 경우 문제 생김
    // const vendrNm = detailInfo.value.vendrNm
    //   ? detailInfo.value.vendrNm
    //   : "소속 없음";
    return detailInfo.value.tbmOrgnsNm;
  }
  return "";
});

const fileHandlerRef = ref(null); // 파일 핸들러의 새로 업로드 된 파일들 목록을 가져오기 위한 ref
const getNewUploadFiles = () => {
  if (fileHandlerRef.value) {
    return fileHandlerRef.value.getNewUploadFiles();
  } else {
    return [];
  }
};

defineExpose({ getNewUploadFiles });

const isAddModalOpen = ref(false);

const onAddUsers = (selected) => {
  if (selected.length === 0) {
    return;
  }
  // detailInfo.value.vendrNm = selected[0].vendrNm;
  // detailInfo.value.psitnVendrCd = selected[0].vendrCd;
  detailInfo.value.tbmOrgnsId = selected[0].userId;
  detailInfo.value.tbmOrgnsNm = selected[0].userNm;
};

// 저장 전 폼 체크할 룰
const required = (val) => {
  return val ? true : "필수 입력 값입니다.";
};

/**
 * 파일첨부 관리 팝업 호출
 */
const isPopFileAttach = ref(false);
const openPopFileAttach = () => {
  isPopFileAttach.value = true;
};
const closePopFileAttach = () => {
  isPopFileAttach.value = false;
};

const fileList = ref([]);
const saveFileCnt = ref(0);
const getSelectedFiles = (files) => {
  fileList.value = files;
  emits("afterUploadFile", files[0]);
};

const getSaveFileCnt = (cnt) => {
  saveFileCnt.value = cnt;
};
</script>

<style lang="scss" scoped></style>
