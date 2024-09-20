<template>
  <div class="popup data_write">
    <div class="popup_title">
      <span>자료실 글쓰기</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="board_item w50p">
          <div class="title">게시기간</div>
          <div class="form">
            <input type="date" id="strtStDt" max="9999-12-31" />
            <span class="date_span">~</span>
            <input type="date" id="strtEnDt" max="9999-12-31" />
          </div>
        </div>
        <div class="board_item">
          <div class="title">제목</div>
          <div class="form"><input type="text" v-model="ttl" /></div>
        </div>
        <div class="board_item">
          <div class="title">내용</div>
          <div class="form"><textarea v-model="dtl"></textarea></div>
        </div>
        <div class="board_item_file">
          <div class="title">
            파일 첨부<button @click="onClickUpload">파일찾기</button>
          </div>
          <input
            id="dataFile"
            type="file"
            class="w100p"
            name="file"
            @change="fileList"
            hidden />
          <div class="file_list">
            <ul id="dataFileList"></ul>
          </div>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button @click="boardSave">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import dayjs from "dayjs";
import { useBoardStore } from "../../stores/board/board_store";

const loginAuth = useLoginAuthStore();
const boardStore = useBoardStore();
let addfiles = [];
const ttl = ref("");
const dtl = ref("");
const emit = defineEmits(["searchList"]);
let formData = new FormData();
let boardInfo = ref([""]);
let validChk = true;
let mb = ref("");
let limit_size = ref("");
let upload_size = ref("");

// 팝업창 닫기
function popupClose(event) {
  deleteInput();
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  document.getElementById("dataFileList").innerHTML = "";
  document.getElementById("strtStDt").value = "";
  document.getElementById("strtEnDt").value = "";
  ttl.value = "";
  dtl.value = "";
  addfiles = [];
}

// 파일 버튼 실행
const onClickUpload = () => {
  let myInput = document.getElementById("dataFile");
  myInput.click();
};

// 파일 업로드 및 리스트 추가
const fileList = (e) => {
  const file = e.target.files;
  const fileInput = document.getElementById("dataFile");
  const fileList = document.getElementById("dataFileList");

  if (file.length > 0) {
    const li = document.createElement("li");
    li.innerHTML = file[0].name;
    li.setAttribute("id", "liUploadFileI_" + file[0].lastModified);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "del");
    deleteButton.onclick = function () {
      deleteFile(file[0].lastModified);
    };
    li.appendChild(deleteButton);
    fileList.appendChild(li);
    addfiles.push(fileInput.files[0]);
    console.log("fileList addfiles : ", addfiles);
  } else {
    return;
  }
};

// 파일 목록 삭제
const deleteFile = (data) => {
  const li = document.getElementById("liUploadFileI_" + data);
  li.remove();
  const index = addfiles.findIndex((item) => {
    return item.lastModified == data;
  });
  addfiles.splice(index, 1);
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

// 게시판 저장 함수
const boardSave = async (e) => {
  const strtStDt = document
    .getElementById("strtStDt")
    .value.split("-")
    .join("");
  const strtEnDt = document
    .getElementById("strtEnDt")
    .value.split("-")
    .join("");
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
    .getElementById("strtStDt")
    .value.split("-")
    .join("");
  const strtEnDt = document
    .getElementById("strtEnDt")
    .value.split("-")
    .join("");

  boardInfo.vendrCd = vendrCd;
  boardInfo.siteCd = siteCd;
  boardInfo.userId = userId;
  boardInfo.strtStDt = strtStDt;
  boardInfo.strtEnDt = strtEnDt;
  boardInfo.ttl = ttl.value;
  boardInfo.dtl = dtl.value;
  boardInfo.mode = "I";
  boardInfo.bbsClsCd = "T2304";
  console.log("boardInfo : ", boardInfo);
  formData.append(
    "param",
    new Blob([JSON.stringify(boardInfo)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  addfiles.forEach((file, index) => {
    formData.append("files", file);
  });

  return formData;
};

onMounted(() => {});
</script>
<style scoped>
.content_box {
  height: 100%;
  margin-bottom: 0px;
}
textarea {
  height: 350px;
}

.data_write {
  width: 800px;
  height: calc(100% - 200px);
}
</style>
