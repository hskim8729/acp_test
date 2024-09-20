<template>
  <div class="popup data_view">
    <div class="popup_title">
      <span>자료실</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <!-- <div class="board_view_subject">자료실 게시글 제목입니다.</div> -->
        <div class="board_view_info">
          <span class="writer">{{ writeNm }}</span>
          <span class="date">{{ regDate }}</span>
          <span class="hit">{{ inqNum }}</span>
        </div>
        <div class="board_item w50p">
          <div class="title">게시기간</div>
          <div class="form">
            <input
              type="date"
              id="strtStDtDetail"
              max="9999-12-31"
              :readonly="isEditMode == false"
              v-model="strtStDt" /><span class="date_span">~</span
            ><input
              type="date"
              id="strtEnDtDetail"
              max="9999-12-31"
              :readonly="isEditMode == false"
              v-model="strtEnDt" />
          </div>
        </div>
        <div class="board_item w100p">
          <div class="title">제목</div>
          <div class="form">
            <input type="text" v-model="ttl" :readonly="isEditMode == false" />
          </div>
        </div>
        <div class="board_item">
          <div class="title">내용</div>
          <div class="form">
            <textarea v-model="dtl" :readonly="isEditMode == false"></textarea>
          </div>
        </div>
        <!-- <div class="board_view_info">
          <span class="writer">관리자</span>
          <span class="date">2023-12-25</span>
          <span class="hit">3</span>
        </div> -->
        <div class="board_view_content"></div>
        <div class="board_item_file">
          <div class="title" @click="onClickDetailUpload">
            첨부파일
            <button v-if="isEditMode == true">파일찾기</button>
          </div>
          <input
            id="dataDetailFile"
            type="file"
            class="w100p"
            name="file"
            @change="fileListDetail"
            hidden />
          <div class="file_list">
            <ul id="ulFileDetailList"></ul>
          </div>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button v-if="isEditMode == true" @click="boardUpdate">수정</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineExpose, ref, defineEmits } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useBoardStore } from "../../stores/board/board_store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import dayjs from "dayjs";

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const boardStore = useBoardStore();
const loginAuth = useLoginAuthStore();
const bbsClsNm = ref("");
const dtl = ref("");
const ttl = ref("");
const strtStDt = ref("");
const strtEnDt = ref("");
const inqNum = ref("");
const regDate = ref("");
const writeNm = ref("");
const emit = defineEmits(["searchList"]);
const authClsCd = ref("");
const authCd = ref("");
const bbsClsCd = ref("");
const isEditMode = ref(false);
let addfiles = [];
let formData = new FormData();
let boardUpdateInfo = ref([""]);
let validChk = true;
let mb = ref("");
let limit_size = ref("");
let upload_size = ref("");

// 팝업창 닫기
function popupClose(event) {
  resetData();
  emit("searchList", "");
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 데이터 초기화 함수
const resetData = () => {
  const fileList = document.getElementById("ulFileDetailList");
  formData = new FormData();
  addfiles = [];
  fileList.innerHTML = "";
  bbsClsNm.value = "";
  dtl.value = "";
  ttl.value = "";
  strtStDt.value = "";
  strtEnDt.value = "";
  inqNum.value = "";
  regDate.value = "";
  writeNm.value = "";
  bbsClsCd.value = "";
  isEditMode.value = false;
};

// 파일 버튼 실행
const onClickDetailUpload = () => {
  let myInput = document.getElementById("dataDetailFile");
  myInput.click();
};

// 파일 업로드 및 리스트 추가
const fileListDetail = (e) => {
  const file = e.target.files;
  const fileInput = document.getElementById("dataDetailFile");
  const fileList = document.getElementById("ulFileDetailList");

  if (file.length > 0) {
    const li = document.createElement("li");
    li.innerHTML = file[0].name;
    li.setAttribute("id", "liUploadFileI_" + file[0].lastModified);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "del");
    deleteButton.onclick = function () {
      uploadDeleteFile(file[0].lastModified);
    };
    li.appendChild(deleteButton);
    fileList.appendChild(li);
    addfiles.push(fileInput.files[0]);
    console.log("fileList addfiles : ", addfiles);
  } else {
    return;
  }
};

// 파일업로드 삭제
const uploadDeleteFile = (data) => {
  const li = document.getElementById("liUploadFileI_" + data);
  li.remove();
  const index = addfiles.findIndex((item) => {
    return item.lastModified == data;
  });
  addfiles.splice(index, 1);
};

// 상세조회 데이터
const updateInfo = (param) => {
  const userId = loginAuth.$state.userInfo.userId;
  if (userId == param[0].regId) {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }
  console.log("isEditMode.value : " + isEditMode.value);
  bbsClsNm.value = param[0].bbsClsNm;
  regDate.value = param[0].regDate;
  if (param[0].strtStDt == "0001-01-01" && param[0].strtEnDt == "0001-01-01") {
    strtStDt.value = "";
    strtEnDt.value = "";
  } else {
    strtStDt.value = param[0].strtStDt;
    strtEnDt.value = param[0].strtEnDt;
  }
  inqNum.value = param[0].inqNum;
  ttl.value = param[0].ttl;
  dtl.value = param[0].dtl;
  writeNm.value = param[0].writeNm;
  bbsClsCd.value = param[0].bbsClsCd;

  // 파일 키 저장
  boardUpdateInfo.atchFileKey = param[0].atchFileKey;

  // 파일 순번 저장
  boardUpdateInfo.bbsSeq = param[0].bbsSeq;

  detailFile(param);
};

// 상세보기 파일 리스트
const detailFile = (param) => {
  const fileInput = document.getElementById("dataDetailFile");
  const fileList = document.getElementById("ulFileDetailList");
  for (let count of param) {
    if (count.filePath) {
      console.log("count : ", count);
      const li = document.createElement("li");
      li.innerHTML = count.fileNm;
      li.setAttribute("id", "liUploadFileU_" + count.fileNm);
      li.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await toolBoxRegiStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "del");
      //deleteButton.setAttribute("id", "liUploadFileDelU_" + count.fileNm);
      if (!isEditMode.value) {
        deleteButton.setAttribute("style", "display:none");
      }
      deleteButton.onclick = function (e) {
        e.stopPropagation();
        if (confirm("파일을 삭제하시겠습니까?")) {
          const userId = loginAuth.$state.userInfo.userId;
          if (count.regId == userId) {
            deleteFile(count);
          }
        }
      };
      li.appendChild(deleteButton);
      fileList.appendChild(li);
    }
  }
};

// 상세보기 파일 삭제
const deleteFile = async (data) => {
  let vendrCd = "0000";
  const atchFileKey = data.atchFileKey;
  const fileSeq = data.fileSeq;
  const fileNm = data.fileNm;
  const filePath = data.filePath;
  const userId = loginAuth.$state.userInfo.userId;

  console.log("data : ", data);
  const delFile = document.getElementById("liUploadFileU_" + data.fileNm);
  delFile.remove();
  const param = {
    vendrCd: vendrCd,
    atchFileKey: atchFileKey,
    fileSeq: fileSeq,
    fileNm: fileNm,
    filePath: filePath,
    userId: userId,
  };
  await boardStore.boardDeleteFile(param);
};

// 날짜 유효성 검사
const validDate = (strtStDt, strtEnDt) => {
  const toDay = dayjs().format("YYYYMMDD");

  if (strtEnDt < strtStDt) {
    alert("유효하지 않은 날짜 형식입니다.");
    return false;
  } else {
    return true;
  }
};

// valid 함수
const validCheck = () => {
  if (ttl.value == "") {
    alert("제목 값이 비어 있습니다. ");
    validChk = false;
  } else if (dtl.value == "") {
    alert("내용 값이 비어 있습니다. ");
    validChk = false;
  } else {
    validChk = true;
  }
  // 첨부파일 valid 추가
  addfiles.forEach((file, index) => {
    mb = 1024 * 1024; //1mb(메가)
    limit_size = mb * 10;

    upload_size = file.size;

    if (limit_size < upload_size) {
      alert("10MB 사이즈 미만만 업로드가 가능합니다.");
      validChk = false;
    }
  });
  return validChk;
};

// 게시판 수정 함수
const boardUpdate = async (e) => {
  const strtStDt = document
    .getElementById("strtStDtDetail")
    .value.split("-")
    .join("");
  const strtEnDt = document
    .getElementById("strtEnDtDetail")
    .value.split("-")
    .join("");
  console.log("strtStDt : " + strtStDt);
  console.log("strtEnDt : " + strtEnDt);
  if (!validDate(strtStDt, strtEnDt)) {
    return;
  }
  if (!validCheck()) return;
  const info = boardSaveList();
  await boardStore.saveBoardList(info);
  emit("searchList", "");
  popupClose(e);
};

// 게시판 데이터 저장
const boardSaveList = () => {
  let vendrCd = "0000";
  let siteCd = "00000";

  const userId = loginAuth.$state.userInfo.userId;
  const strtStDt = document
    .getElementById("strtStDtDetail")
    .value.split("-")
    .join("");
  const strtEnDt = document
    .getElementById("strtEnDtDetail")
    .value.split("-")
    .join("");

  boardUpdateInfo.vendrCd = vendrCd;
  boardUpdateInfo.siteCd = siteCd;
  boardUpdateInfo.userId = userId;
  boardUpdateInfo.strtStDt = strtStDt;
  boardUpdateInfo.strtEnDt = strtEnDt;
  boardUpdateInfo.ttl = ttl.value;
  boardUpdateInfo.dtl = dtl.value;
  boardUpdateInfo.mode = "U";
  boardUpdateInfo.bbsClsCd = "T2304";

  console.log("boardUpdateInfo : ", boardUpdateInfo);
  formData.append(
    "param",
    new Blob([JSON.stringify(boardUpdateInfo)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  addfiles.forEach((file, index) => {
    formData.append("files", file);
  });

  return formData;
};

defineExpose({
  updateInfo,
});
</script>
<style scoped>
.content_box {
  height: 100%;
  margin-bottom: 0px;
}
textarea {
  height: 350px;
}

.data_view {
  width: 800px;
  height: calc(100% - 200px);
}
</style>
