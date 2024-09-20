<template>
  <div class="popup_background">
    <div class="popup_area popup notify_news_write show">
      <div class="popup_title">
        <span>{{ title }} 글쓰기</span>
        <button class="popup_close" @click="close"></button>
      </div>
      <div class="popup_content">
        <div class="content_box">
          <div class="board_item">
            <div class="title">제목</div>
            <div class="form">
              <input type="text" v-model="notifyNewsDetailInfo.ttl" />
            </div>
          </div>
          <div class="board_item">
            <div class="title">내용</div>
            <div class="form">
              <compEditor ref="editor" :params="editParam"></compEditor>
            </div>
          </div>
          <div class="board_item_file" ref="attFileRef">
            <div class="title" @click="onClickUpload">
              파일 첨부<button>파일찾기</button>
            </div>
            <input
              ref="notiFileRef"
              type="file"
              class="w100p"
              name="file"
              @change="fileList"
              hidden />
            <div class="file_list">
              <ul ref="fileListRef" v-if="attFiles.length > 0">
                <li v-for="(file, index) in attFiles" :key="index">
                  <span
                    :class="file.status === 'U' ? 'pointer' : ''"
                    @click="fileDownload(file)"
                    >{{ file.fileNm }}</span
                  >
                  <button
                    class="del"
                    v-if="isEditable"
                    @click="deleteFile(file, index)"></button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="popup_button">
        <button @click="doSave" v-if="isEditable">저장</button>
        <button @click="close()" v-if="isEditable">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, onMounted } from "vue";
import compEditor from "@/components/editor/compEditor.vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useBoardStore } from "../../stores/board/board_store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const loginAuth = useLoginAuthStore();
const boardStore = useBoardStore();
const title = ref("공지사항");
const editor = ref(null);
const notiFileRef = ref(null);
const fileListRef = ref(null);
const attFileRef = ref(null);
const attFiles = reactive([]);

let saveMode = ref("I");
let isEditable = ref(false);
let formData = new FormData();
let validChk = true;

const boardSeq = ref("");
const notifyNewsDetailInfo = reactive({
  dtl: "",
  ttl: "",
});

const editorHeight = window.innerHeight - 520;
const editParam = reactive({
  height: editorHeight,
  cntn: "",
  reaonly: true,
});

const emit = defineEmits(["close"]);

const { notifyNewsInfo, bbsClsCd, isPopVisible } = defineProps([
  "notifyNewsInfo",
  "bbsClsCd",
  "isPopVisible",
]);

// 데이터초기화
const initData = () => {
  title.value = bbsClsCd === "T2308" ? "공지사항" : "홍보자료";

  saveMode.value = "I";
  notifyNewsDetailInfo.bbsClsCd = "";
  notifyNewsDetailInfo.bbsSeq = 0;
  notifyNewsDetailInfo.cntn = "";
  notifyNewsDetailInfo.siteCd = "";
  notifyNewsDetailInfo.ttl = "";
  notifyNewsDetailInfo.vendrCd = "";

  // fileListRef.value.innerHTML = '';
  isEditable.value = true;
  editor.value.setHtmlContent("");
};

// 저장버튼 클릭
const doSave = async (e) => {
  if (!validCheck()) return;
  const formData = getNotifyNewsInfo();
  await boardStore.saveBoardList(formData);
  close(true);
};

// valid 함수
const validCheck = () => {
  if (notifyNewsDetailInfo.ttl == "") {
    alert("제목 값이 비어 있습니다. ");
    validChk = false;
  } else if (editor.value.getHtmlContent() == "") {
    alert("내용 값이 비어 있습니다. ");
    validChk = false;
  } else {
    validChk = true;
  }
  return validChk;
};

// 저장 파라미터 생성
const getNotifyNewsInfo = () => {
  const cntn = editor.value.getHtmlContent(); // 에디터 html

  notifyNewsDetailInfo.cntn = cntn;
  notifyNewsDetailInfo.bbsSeq = boardSeq.value;
  notifyNewsDetailInfo.vendrCd = loginAuth.$state.userInfo.vendrCd;
  notifyNewsDetailInfo.userId = loginAuth.$state.userInfo.userId;
  notifyNewsDetailInfo.mode = saveMode.value; // I: 추가, U: 수정, D: 삭제제
  notifyNewsDetailInfo.siteCd = "00000";
  notifyNewsDetailInfo.bbsClsCd = bbsClsCd;
  notifyNewsDetailInfo.strtEnDt = "29991231";
  notifyNewsDetailInfo.strtStDt = "19990101";

  formData.append(
    "param",
    new Blob([JSON.stringify(notifyNewsDetailInfo)], {
      type: "application/json",
    })
  );

  // 첨부파일 FormData 추가
  attFiles.forEach((file, index) => {
    if (file.status === "I") {
      formData.append("files", file.file);
    }
  });

  return formData;
};

// 팝업창 open시 상세조회
const searchDetail = async () => {
  boardSeq.value = notifyNewsInfo.bbsSeq;

  if (boardSeq.value) {
    const param = { bbsSeq: boardSeq.value };
    const detailBoard = await boardStore.boardDetailSearch(param);

    updateInfo(detailBoard);
    detailFile(detailBoard);
  }
};

const updateInfo = (param) => {
  saveMode.value = "U";
  notifyNewsDetailInfo.ttl = param[0].ttl;
  notifyNewsDetailInfo.atchFileKey = param[0].atchFileKey;

  // 첨부가 있으면 editor height 설정 시 첨부 영역 포함 (파일 height + top 여백 20)
  if (param[0].atchFileKey) {
    editParam.height -= attFileRef.value.clientHeight - 20;
  }

  editor.value.setHtmlContent(param[0].cntn);
  isEditable.value = param[0].regId === loginAuth.$state.userInfo.userId;
};

// 팝업창 Close
const close = (isReload) => {
  emit("close", isReload);
};

// 파일찾기 버튼 클릭
const onClickUpload = () => {
  notiFileRef.value.click();
};

// 첨부파일 조회
const detailFile = (param) => {
  for (let count of param) {
    if (count.filePath) {
      attFiles.push({
        fileNm: count.fileNm,
        fileId: `liUploadFileI_${count.fileNm}`,
        filePath: count.filePath,
        status: "U",
        atchFileKey: count.atchFileKey,
        fileSeq: count.fileSeq,
      });
    }
  }
};

// 첨부파일 다운로드
const fileDownload = async (file) => {
  // 추가된 파일은 서버에 없어서 다운로드 불가능
  if (file.status === "I") {
    return;
  }

  const response = await toolBoxRegiStore.fileDownloadForExtern(file);

  let link = document.createElement("a");
  let url = URL.createObjectURL(response);
  link.href = url;
  link.download = file.fileNm;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

// 파일 업로드 및 리스트 추가
const fileList = (e) => {
  const file = e.target.files;

  if (file.length > 0) {
    attFiles.push({
      fileNm: file[0].name,
      fileId: `liUploadFileI_${file[0].lastModified}`,
      status: "I",
      file: file[0], // 파일저장용으로 file도 저장
    });
  }
};

// 파일 목록 삭제
const deleteFile = (file, index) => {
  if (!confirm("파일을 삭제하시겠습니까?")) return;

  // 조회한 파일은 서버에서 삭제처리
  if (file.status === "U") {
    deleteFileServer(file);
  }

  attFiles.splice(index, 1);
};

// 서버에서 파일 삭제
const deleteFileServer = async (data) => {
  const param = {
    vendrCd: "0000",
    atchFileKey: data.atchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: loginAuth.$state.userInfo.userId,
  };

  await boardStore.boardDeleteFile(param);
};

onMounted(() => {
  initData();
  searchDetail();
});
</script>
<style scoped>
.popup_background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(30, 50, 100, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.2s, height 0.2s 0.2s;
  animation: popupFade 0.1s ease-in-out forwards;
}
@keyframes popupFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.notify_news_write {
  width: 80%;
  height: calc(100% - 100px);
}
.notify_news_write .pointer {
  cursor: pointer;
}
</style>
