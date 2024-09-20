<template>
  <div class="pop_in_pop pop_file_attach show">
    <div class="popup_title">
      <span>파일 목록</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <comp-button
        class="add_file"
        @click="openFileInput"
        v-if="showAddFile && props.isWriteAuth"
        text="파일 추가"
        density="default"
        requiredAuth>
      </comp-button>
      <input
        class="fileInput"
        type="file"
        ref="fileInput"
        style="display: none"
        multiple
        @change="handleFileUpload" />
      <div class="content_box">
        <div class="add_file_list" v-if="showAddFileList">
          <div class="subtitle">파일 추가 목록</div>
          <ul v-if="fileList.length > 0">
            <li v-for="(file, index) in fileList" :key="index">
              {{ file.name }}
              <comp-button
                class="del"
                size="x-small"
                @click="deleteSelectedFile(index)"
                v-if="props.isWriteAuth"
                requiredAuth></comp-button>
            </li>
          </ul>
          <ul v-else>
            <li class="no_file">선택된 파일이 없습니다.</li>
          </ul>
        </div>

        <div class="db_file_list" v-if="showDbFileList">
          <div class="subtitle">첨부된 파일 목록</div>
          <ul v-if="saveFileList.length > 0">
            <li v-for="(file, index) in saveFileList" :key="index">
              <span class="download" @click="downloadSaveFile(file)">{{
                file.fileNm
              }}</span>
              <comp-button
                v-if="showAddListBtn && props.isWriteAuth"
                class="del"
                size="x-small"
                @click="deleteSaveFile(file)"
                requiredAuth></comp-button>
            </li>
          </ul>
          <ul v-else>
            <li class="no_file">첨부된 파일이 없습니다.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <comp-button
        text="등록"
        @click="sendSelectedFilesToParent"
        density="default"
        v-if="showAddListBtn && props.isWriteAuth"
        requiredAuth>
      </comp-button>
      <comp-button
        @click="popInPopClose"
        density="default"
        text="닫기"></comp-button>
    </div>
  </div>
</template>

<script setup>
import { useFileStore } from "@/stores/common/file-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { defineExpose, onBeforeMount, ref, watch } from "vue";

const store = useRiskAssessmentStore();
const fileStore = useFileStore();

const props = defineProps({
  sendData: {},
  isWriteAuth: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["saveFileCnt", "sendSelectedFiles", "close"]);

const fileInput = ref();
let fileList = ref([]);
let saveFileList = ref([]);

const showAddFile = ref(false);
const showAddFileList = ref(false);
const showDbFileList = ref(false);
const showAddListBtn = ref(true);
let validChk = ref(true);
const sendData = ref([]);

const openFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  fileList.value = [...fileList.value, ...Array.from(files)];
  event.target.value = "";
};

// 파일 추가 목록에서 삭제
const deleteSelectedFile = (index) => {
  fileList.value.splice(index, 1);
  emits("saveFileCnt", saveFileList.value.length + fileList.value.length);
  emits("sendSelectedFiles", fileList.value);
};

// DB에 저장되어 있는 파일 삭제
const deleteSaveFile = async (file) => {
  if (!confirm("삭제하시겠습니까?")) return;
  await fileStore.removeFile(file);
  await onSearch();
};

// DB에 저장되어 있는 파일 다운로드
const downloadSaveFile = async (file) => {
  try {
    const response = await fileStore.fileDownload(file);
    const url = URL.createObjectURL(response);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.fileNm;

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("파일 다운로드 에러: ", error);
  } finally {
    if (link) {
      document.body.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
  }
};

const sendSelectedFilesToParent = () => {
  fileList.value.forEach((item) => {
    item.flag = "add";
  });

  let totalFileSize = 0;
  if (Array.isArray(fileList.value) && fileList.value.length > 0) {
    fileList.value.forEach((file, index) => {
      totalFileSize += file.size;
      if (1024 * 1024 * 10 < totalFileSize) {
        alert("10MB 사이즈 미만만 업로드가 가능합니다.");
        validChk.value = false;
      } else {
        validChk.value = true;
      }
    });
  }
  emits("saveFileCnt", saveFileList.value.length + fileList.value.length);
  emits("sendSelectedFiles", fileList.value);

  if (validChk.value) {
    popInPopClose();
  }
};

const popInPopClose = (event) => {
  fileList.value = fileList.value.filter((item) => {
    return item.flag === "add";
  });

  emits("close");
};

const onSearch = async (data = null) => {
  if (data == "ParentCall") {
    fileList.value = [];
    saveFileList.value = [];
  }
  // 위험성평가 회의의 신규등록의 파일첨부인 경우.
  if (!props.sendData.stats && !props.sendData.statsCd && props.isWriteAuth) {
    // 파일 추가 버튼, 파일 추가 목록을 보여준다.
    showAddFile.value = true;
    showAddFileList.value = true;
  }

  // 위험성평가 회의의 파일첨부인 경우.
  if (props.sendData.stats && !props.sendData.statsCd) {
    if (props.sendData.stats === "T0901") {
      // 위험성평가 회의 상태가 대기(T0901)인 경우 파일 추가 버튼, 파일 추가 목록, 첨부된 파일 목록을 보여준다.
      showAddFile.value = true;
      showAddFileList.value = true;
      showDbFileList.value = true;
    } else {
      // 위험성평가 회의 상태가 진행(T0902), 완료(T0903)인 경우에는 첨부된 파일 목록은 보여주고, 목록추가 버튼은 감춘다.
      showDbFileList.value = true;
      showAddListBtn.value = false;
    }
  }

  // 위험성평가 표의 예정공정표인 경우.
  if (props.sendData.stats && props.sendData.statsCd) {
    if (
      props.sendData.stats === "T0901" &&
      props.sendData.statsCd !== "T1003"
    ) {
      // 위험성평가 회의 상태가 대기(T0901)이면서 위험성평가 표 상태가 승인완료(T1003)가 아닌 경우에만 파일 추가 버튼, 파일 추가 목록, 첨부된 파일 목록을 보여준다.
      showAddFile.value = true;
      showAddFileList.value = true;
      showDbFileList.value = true;
    } else {
      // 위험성평가 회의 상태가 진행(T0902), 완료(T0903)이거나 위험성평가 표 상태가 승인완료(T1003)인 경우에는 첨부된 파일 목록은 보여주고, 목록추가 버튼은 감춘다.
      showDbFileList.value = true;
      showAddListBtn.value = false;
    }
  }

  // 파일 목록을 가져오고
  const fileParam = {
    vendrCd: props.sendData.vendrCd,
    siteCd: props.sendData.siteCd,
    atchFileKey: props.sendData.atchFileKey,
  };
  saveFileList.value = await fileStore.fetchAtchFileList(fileParam);

  emits("saveFileCnt", saveFileList.value.length);
};

onBeforeMount(() => {
  onSearch();
});

defineExpose({
  onSearch,
});

watch(
  () => {
    return saveFileList; // 변경을 감지할 스토어의 값
  },
  (newValue, oldValue) => {}
);
</script>

<style scoped>
.download {
  cursor: pointer;
}
</style>
