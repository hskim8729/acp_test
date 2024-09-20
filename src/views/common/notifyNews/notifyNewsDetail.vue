<template>
  <div class="subtitle_area">
    <button @click="back" class="back_btn"></button>
  </div>
  <div class="content_box">
    <div class="board_item">
      <div class="notify_news_title">
        <span class="font_20">{{ notifyNewsDetailInfo.ttl }}</span>
        <!-- <span class="title_right">작성자 : {{ notifyNewsDetailInfo.writeNm }}</span> -->
      </div>
      <div class="notify_news_attfile title_right" v-show="attCnt > 0">
        <span class="pointer" @click="isContextMenu = !isContextMenu"
          >첨부파일 ({{ attCnt }})</span
        >
        <fileContextMenu
          :options="contextMenuOption"
          v-if="isContextMenu"
          @itemCliek="fileDownload"
          @close="closeContextMenu">
        </fileContextMenu>
      </div>
    </div>
    <div class="board_item content_view" ref="contentRef">
      <div class="form viewer_default">
        <div ref="viewer"></div>
        <!-- <iframe :src="notifyNewsDetailInfo.dtl" height="300" width="100%"></iframe> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, defineProps, watch } from "vue";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import { useBoardStore } from "../../../stores/board/board_store";
import fileContextMenu from "./fileContextMenu.vue";

const viewer = ref("");
const viewerRef = ref("");
const contentRef = ref("");
const attCnt = ref(0);
const isContextMenu = ref(false);

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const boardStore = useBoardStore();
const notifyNewsDetailInfo = reactive({});
const { notifyNewsInfo, bbsClsCd } = defineProps([
  "notifyNewsInfo",
  "bbsClsCd",
]);

const emit = defineEmits(["goBack"]);

const contextMenuOption = reactive([]);

// toast viewer 초기화
const setViewer = () => {
  viewerRef.value = new Viewer({
    el: viewer.value,
    height: `500px`,
    initialValue: notifyNewsDetailInfo.cntn,
  });
};

// 뒤로가기 버튼
const back = () => {
  emit("goBack");
};

// 상세 조회
const searchNotifyNewsDetail = async () => {
  const param = { bbsSeq: notifyNewsInfo.bbsSeq };
  const detailBoard = await boardStore.getNotifyNewsInfo(param);

  updateInfo(detailBoard);
  detailFile(detailBoard);
  setViewer();
};

const updateInfo = (param) => {
  notifyNewsDetailInfo.ttl = param[0].ttl;
  notifyNewsDetailInfo.writeNm = param[0].writeNm;
  notifyNewsDetailInfo.cntn = param[0].cntn;
  // notifyNewsDetailInfo.dtl = 'https://map.kakao.com';
};

const fileDownload = async (param) => {
  const response = await toolBoxRegiStore.fileDownloadForExtern(param);

  let link = document.createElement("a");
  let url = URL.createObjectURL(response);
  link.href = url;
  link.download = param.fileNm;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

const detailFile = (param) => {
  // 파일 상세 조회
  for (let count of param) {
    if (count.filePath) {
      attCnt.value += 1;

      contextMenuOption.push({
        fileNm: count.fileNm,
        fileId: `liUploadFileI_${count.fileNm}`,
        filePath: count.filePath,
      });
    }
  }
};

const closeContextMenu = () => {
  isContextMenu.value = false;
};

onMounted(() => {
  searchNotifyNewsDetail();
});
</script>

<style scoped>
.viewer_default {
  height: calc(100% - 25px);
  padding: 10px;
  border-radius: 8px;
  overflow: auto;
}

.content_box {
  height: calc(100% - 25px);
}

.content_view {
  height: calc(90% - 50px);
  margin-top: 35px;
}
.back_btn {
  position: absolute;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  border: 0px;
  background-color: transparent;
  background-image: url("@/assets/img/back-icon.png");
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.2s, background-color 0.2s;
}

.notify_news_title {
  border-bottom: solid 1px gainsboro;
  padding-bottom: 10px;
}
.font_20 {
  font-size: 20px;
}
.title_right {
  float: right;
  padding-top: 10px;
}
.notify_news_attfile .pointer {
  cursor: pointer;
}
</style>
