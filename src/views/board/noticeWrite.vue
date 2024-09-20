<template>
  <div class="popup notice_write">
    <div class="popup_title">
      <span>공지사항 글쓰기</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="board_item w50p">
          <div class="title">카테고리</div>
          <div class="form">
            <select class="w200" id="boardCategory">
              <option
                value="T2301"
                v-if="authCd == '1000' && authClsCd == 'T2201'">
                전사공지
              </option>
              <option
                value="T2302"
                v-if="
                  (authCd == '1000' && authClsCd == 'T2201') ||
                  (authCd == '2000' && authClsCd == 'T2202') ||
                  (authCd == '3000' && authClsCd == 'T2202') ||
                  (authCd == '4000' && authClsCd == 'T2202')
                ">
                현장공지
              </option>
              <option
                value="T2303"
                v-if="
                  (authCd == '1000' && authClsCd == 'T2201') ||
                  (authCd == '3000' && authClsCd == 'T2202')
                ">
                협력사공지
              </option>
              <option value="T2307" v-if="authCd == '9999'">시스템공지</option>
            </select>
          </div>
        </div>
        <div class="board_item w50p">
          <div class="title">게시기간</div>
          <div class="form">
            <input type="date" id="strtStDt" max="9999-12-31" /><span
              class="date_span"
              >~</span
            ><input type="date" id="strtEnDt" max="9999-12-31" />
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
          <div class="title" @click="onClickUpload">
            파일 첨부<button>파일찾기</button>
          </div>
          <input
            id="notiFile"
            type="file"
            class="w100p"
            name="file"
            @change="fileList"
            hidden />
          <div class="file_list">
            <ul id="fileList"></ul>
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
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import dayjs from "dayjs";
import { defineEmits, onMounted, ref } from "vue";
import { useBoardStore } from "../../stores/board/board_store";

const authClsCd = ref("");
const authCd = ref("");
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
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
  deleteInput();
}

// 파일 버튼 실행
const onClickUpload = () => {
  let myInput = document.getElementById("notiFile");
  myInput.click();
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

// 파일 업로드 및 리스트 추가
const fileList = (e) => {
  const file = e.target.files;
  const fileInput = document.getElementById("notiFile");
  const fileList = document.getElementById("fileList");

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

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  document.getElementById("boardCategory").options[0].selected = true;
  document.getElementById("fileList").innerHTML = "";
  document.getElementById("strtStDt").value = "";
  document.getElementById("strtEnDt").value = "";
  ttl.value = "";
  dtl.value = "";
  addfiles = [];
}

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
  let vendrCd = loginAuth.$state.siteInfo.vendrCd;
  let siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;
  const strtStDt = document
    .getElementById("strtStDt")
    .value.split("-")
    .join("");
  const strtEnDt = document
    .getElementById("strtEnDt")
    .value.split("-")
    .join("");

  boardInfo.userId = userId;
  boardInfo.strtStDt = strtStDt;
  boardInfo.strtEnDt = strtEnDt;
  boardInfo.ttl = ttl.value;
  boardInfo.dtl = dtl.value;
  boardInfo.mode = "I";
  boardInfo.bbsClsCd =
    document.getElementById("boardCategory").options[
      document.getElementById("boardCategory").selectedIndex
    ].value;

  // bbsClsCd 따라 변경
  if (
    // 전사일 경우
    boardInfo.bbsClsCd === "T2301"
  ) {
    siteCd = "00000";
    vendrCd = loginAuth.$state.authInfo.vendrCd;
  } else if (authCd.value == "9999") {
    // 슈퍼바이저일 경우
    siteCd = "00000";
    vendrCd = loginAuth.$state.userInfo.vendrCd;
  }
  boardInfo.vendrCd = vendrCd;
  boardInfo.siteCd = siteCd;
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

onMounted(() => {
  authClsCd.value = loginAuth.$state.authInfo.authClsCd;
  authCd.value = loginAuth.$state.authInfo.authCd;

  // 슈퍼바이저 계정은 authCd가 없기 때문에 조건을 위해 9999로 저장
  if (authCd.value === undefined && authClsCd.value === undefined) {
    authCd.value = "9999";
  }
});
</script>
<style scoped>
.grid_default {
  height: calc(100% - 40px);
}
.right_btn input,
.right_btn select {
  height: 30px;
  margin-left: 5px;
}

.notice_write {
  width: 800px;
  height: calc(100% - 200px);
}
.content_box {
  height: 100%;
  margin-bottom: 0px;
}
textarea {
  height: 350px;
}
.board_item {
  display: inline-block;
}
</style>
