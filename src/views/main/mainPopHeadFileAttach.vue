<template>
  <div class="pop_in_pop pop_file_attach main_head_popup">
    <div class="popup_title">
      <span>첨부파일 목록</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <button class="add_file" @click="onClickUpload">파일 추가</button>
      <input
        id="postFile"
        type="file"
        class="w100p"
        name="file"
        multiple
        @change="fileList"
        accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
        hidden
      />
      <div class="content_box">
        <div class="add_file_list">
          <ul id="uploadFileList">
            <li
              class="no_file"
              v-if="addfiles.length == 0"
              id="uploadNoFileList"
            >
              첨부된 파일이 없습니다.
            </li>
          </ul>
        </div>

        <div class="subtitle">첨부된 파일 목록</div>
        <div class="db_file_list">
          <ul id="detailFileList"></ul>
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button @click="saveData">저장</button>
      <button @click="popInPopClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted, defineEmits } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainHeadStore } from "@/stores/common/main-head-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";

let addfiles = ref([]);
let formData = new FormData();
const loginAuth = useLoginAuthStore();
const mainPost = useMainHeadStore();
const authCd = ref("");
const authClsCd = ref("");
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const emit = defineEmits(["mainFileList"]);
let bbsSeq = ref("");
let atchFileKey = ref("");

// 전사 포스터 조회
const searchList = async () => {
  let ptnrYn = loginAuth.$state.vendrInfo.ptnrYn;
  let vendrCd = "";

  if (ptnrYn === "N") {
    vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  } else {
    vendrCd = loginAuth.$state.vendrInfo.vendrUpperCd;
  }

  const param = {
    vendrCd: vendrCd,
  };

  const mainFileList = await mainPost.searchPostFile(param);
  if (mainFileList.selectSftyHlthPstrBbsList.length > 0) {
    bbsSeq.value = mainFileList.selectSftyHlthPstrBbsList[0].bbsSeq;
    atchFileKey.value = mainFileList.selectSftyHlthPstrBbsList[0].atchFileKey;
  }
  console.log("bbsSeq.value : " + bbsSeq.value);
  console.log("atchFileKey.value : " + atchFileKey.value);
  drawDetailList(mainFileList.selectSftyHlthPstrBbsList);
  emit("mainFileList", mainFileList.selectSftyHlthPstrBbsList);
};

// 상세조회 파일 리스트 그리기
const drawDetailList = (data) => {
  const fileList = document.getElementById("detailFileList");

  // 상세조회 리스트 일괄 삭제 후 다시 그려주기
  const liElement = document
    .getElementById("detailFileList")
    .querySelectorAll('[id*="liUploadFileU_"]');

  liElement.forEach((li) => {
    li.remove();
  });

  data.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item.fileNm;
    li.setAttribute("id", "liUploadFileU_" + item.fileNm);
    li.addEventListener("click", async function () {
      const param = { fileNm: item.fileNm, filePath: item.filePath };
      const response = await toolBoxRegiStore.fileDownload(param);

      let link = document.createElement("a");
      let url = URL.createObjectURL(response);
      link.href = url;
      link.download = item.fileNm;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "del");
    deleteButton.onclick = function (e) {
      e.stopPropagation(); // 상위 다운로드 이벤트 중지
      if (confirm("파일을 삭제하시겠습니까?")) {
        deleteDetailFile(item);
      }
    };
    li.appendChild(deleteButton);
    fileList.appendChild(li);
  });
};

// 상세보기 파일 삭제 함수
const deleteDetailFile = async (data) => {
  const li = document.getElementById("liUploadFileU_" + data.fileNm);
  const userId = loginAuth.$state.userInfo.userId;
  li.remove();
  const param = {
    vendrCd: data.vendrCd,
    atchFileKey: data.atchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: userId,
  };
  await mainPost.deletePostFile(param);
  searchList();
};

// 팝업 닫기
const popInPopClose = () => {
  deleteData();
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  document
    .getElementsByClassName("main_head_popup")[0]
    .classList.remove("show");
};

// 데이터 초기화 함수
function deleteData() {
  formData = new FormData();
  const liElement = document
    .getElementById("uploadFileList")
    .querySelectorAll('[id*="liUploadFileI_"]');

  liElement.forEach((li) => {
    li.remove();
  });

  addfiles.value = [];
}

// 파일 버튼 실행
const onClickUpload = () => {
  let myInput = document.getElementById("postFile");
  myInput.click();
};

// 파일 업로드 및 리스트 추가
const fileList = (e) => {
  let files = [];
  for (let count of e.target.files) {
    let ext = count.name.split(".").pop();
    ext = ext.toLowerCase();
    if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "pjpeg") {
      files.push(count);
      console.log("files : ", files);
    } else {
      alert("이미지 파일만 업로드 할 수 있습니다.");
      files = [];
      return;
    }
  }
  e.target.value = "";
  drawList(files);
  //drawList(addfiles.value);
};

// 파일 목록 그리기
const drawList = (files) => {
  const fileInput = document.getElementById("postFile");
  const fileList = document.getElementById("uploadFileList");
  files.forEach((file) => {
    const li = document.createElement("li");
    li.innerHTML = file.name;
    li.setAttribute("id", "liUploadFileI_" + file.lastModified);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "del");
    deleteButton.onclick = function () {
      if (confirm("파일을 삭제하시겠습니까?")) {
        deleteFile(file.lastModified);
      }
    };
    li.appendChild(deleteButton);
    fileList.appendChild(li);
    addfiles.value.push(file);
  });
};

// 파일 목록 삭제
const deleteFile = (data) => {
  const li = document.getElementById("liUploadFileI_" + data);
  li.remove();
  console.log("data : " + data);
  const index = addfiles.value.findIndex((file) => file.lastModified == data);
  if (index != -1) {
    addfiles.value.splice(index, 1);
  }
};

// 파일 등록 함수
const saveData = async () => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");
  if (addfiles.value.length > 0) {
    const info = postDateSave();
    await mainPost.savePostFile(info);
  }
  searchList();
  popInPopClose();
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

// 데이터 저장 함수
const postDateSave = () => {
  let siteCd = "";
  let ptnrYn = loginAuth.$state.vendrInfo.ptnrYn;
  let vendrCd = "";

  if (ptnrYn === "N") {
    vendrCd = loginAuth.$state.vendrInfo.vendrCd;
    siteCd = "00000";
  } else {
    vendrCd = loginAuth.$state.vendrInfo.vendrUpperCd;
    siteCd = "00000";
  }

  const userId = loginAuth.$state.userInfo.userId;
  let param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
  };

  // 포스터에 모든 파일을 삭제하고 다시 등록 했을 시 파일키 초기화
  const detailFileList = document
    .getElementById("detailFileList")
    .querySelectorAll('[id^="liUploadFileU_"]').length;
  if (detailFileList == 0) {
    atchFileKey.value = "";
  }

  // 만약에 파일이 저장되어 있다면
  if (bbsSeq.value != "") {
    param = {
      vendrCd: vendrCd,
      siteCd: siteCd,
      userId: userId,
      bbsSeq: bbsSeq.value,
      atchFileKey: atchFileKey.value,
    };
  }

  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );
  // 첨부파일 FormData 추가
  addfiles.value.forEach((file, index) => {
    formData.append("files", file);
  });

  return formData;
};

onMounted(() => {
  authClsCd.value = loginAuth.$state.authInfo.authClsCd;
  authCd.value = loginAuth.$state.authInfo.authCd;

  searchList();
});
</script>

<!-- <script>
export default {
  methods: {
    popInPopClose() {
      document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
      document
        .getElementsByClassName("pop_file_attach")[0]
        .classList.remove("show");
    },
  },
};
</script> -->
