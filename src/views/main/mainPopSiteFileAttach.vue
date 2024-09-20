<template>
  <div class="pop_in_pop pop_file_attach main_site_popup">
    <div class="popup_title">
      <span>첨부파일 목록</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <button class="add_file" @click="onClickUpload">파일 추가</button>
      <input
        id="sitePostFile"
        type="file"
        class="w100p"
        name="file"
        @change="fileList"
        accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
        hidden />
      <div class="content_box">
        <div class="add_file_list">
          <ul id="uploadNoSiteFileList">
            <li
              class="no_file"
              v-if="addfile.length < 1 && mngTrgtList.length < 1">
              첨부된 파일이 없습니다.
            </li>
          </ul>
        </div>

        <div class="subtitle">첨부된 파일 목록</div>
        <div class="db_file_list">
          <ul id="detailsiteFileList"></ul>
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
import {
  reactive,
  ref,
  onBeforeMount,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainSiteStore } from "../../stores/common/main-site-store";

let addfile = ref([]);
let mngTrgtList = ref([]);
let formData = new FormData();
const loginAuth = useLoginAuthStore();
const authCd = ref("");
const authClsCd = ref("");
const sitePost = useMainSiteStore();
const props = defineProps(["bbsSeq"]);
const emits = defineEmits(["searchSiteList"]);
let validChk = true;

// 현장 포스터 조회
const searchList = async () => {
  const param = {
    vendrCd: loginAuth.$state.siteInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    userId: loginAuth.$state.userInfo.userId,
  };
  await sitePost.selectDashBoardPartnerList(param);

  mngTrgtList.value = sitePost.$state.mngTrgtList; // 경영목표 파일리스트

  let file = mngTrgtList.value[0];
  const List = document.getElementById("detailsiteFileList");
  const li = document.createElement("li");
  if (file !== undefined) {
    li.innerHTML = file.fileNm;
    li.setAttribute("id", "liUploadSiteFileI_" + file.atchFileKey);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "del");
    deleteButton.onclick = function () {
      deleteFileData(file);
      deleteFile(file.atchFileKey);
    };
    li.appendChild(deleteButton);
    List.appendChild(li);
    addfile.value.push(file);
  }
};

// 팝업 닫기
const popInPopClose = () => {
  deleteData();
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  document
    .getElementsByClassName("main_site_popup")[0]
    .classList.remove("show");
};

// 데이터 초기화 함수
function deleteData() {
  formData = new FormData();
  const liElement = document
    .getElementById("uploadNoSiteFileList")
    .querySelectorAll('[id*="liUploadSiteFileI_"]');

  liElement.forEach((li) => {
    li.remove();
  });

  addfile.value = [];
}

// 파일 버튼 실행
const onClickUpload = () => {
  let myInput = document.getElementById("sitePostFile");
  myInput.click();
};

// 파일 업로드 및 리스트 추가
const fileList = (e) => {
  if (addfile.value.length > 0) {
    alert("파일은 1개만 업로드 가능합니다. 기존 파일을 삭제 해주세요.");
    return;
  }
  let file = e.target.files[0];
  let ext = file.name.split(".").pop();
  ext = ext.toLowerCase();
  if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "pjpeg") {
    drawList(file);
  } else {
    alert("이미지 파일만 업로드 할 수 있습니다.");
    return;
  }
  e.target.value = "";
};

// 파일 목록 그리기
const drawList = (file) => {
  const fileList = document.getElementById("uploadNoSiteFileList");
  const li = document.createElement("li");
  li.innerHTML = file.name;
  li.setAttribute("id", "liUploadSiteFileI_" + file.lastModified);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "del");
  deleteButton.onclick = function () {
    deleteFile(file.lastModified);
  };
  li.appendChild(deleteButton);
  fileList.appendChild(li);
  addfile.value.push(file);
};

// 파일 목록 삭제
const deleteFile = async (data) => {
  const li = document.getElementById("liUploadSiteFileI_" + data);
  li.remove();
  addfile.value = [];
};

// 파일 등록 함수
const saveData = async () => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  if (addfile.value.length === 0) {
    alert("첨부된 파일이 없습니다.");
  } else {
    if (!validCheck()) return;
    const info = postDateSave();
    await sitePost.saveSitePostFile(info);
    emits("searchSiteList", "");
    popInPopClose();
    searchList();
  }
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

// 파일 삭제 함수
const deleteFileData = async (data) => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  //console.log(JSON.stringify(addfile.value));
  //const info = postDateSave();
  const param = {
    vendrCd: data.vendrCd,
    atchFileKey: data.atchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: loginAuth.$state.userInfo.userId,
  };
  try {
    await sitePost.deleteSitePostFile(param);
  } catch (error) {
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
  }

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

// valid 함수
const validCheck = () => {
  // 첨부파일 valid 추가
  let mb = 1024 * 1024; //1mb(메가)
  let limit_size = mb * 10;

  if (addfile.value.length > 0) {
    let upload_size = addfile.value[0].size;

    if (limit_size < upload_size) {
      alert("10MB 사이즈 미만만 업로드가 가능합니다.");
      validChk = false;
      document
        .getElementsByClassName("loading_wrap")[0]
        .classList.remove("show");
    }
  } else {
    validChk = true;
  }

  return validChk;
};

// 데이터 저장 함수
const postDateSave = () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;
  const bbsSeq = props.bbsSeq;
  let atchFileKey = "";

  if (addfile.value.length == 0) {
    atchFileKey = "";
  } else {
    addfile.value[0].atchFileKey;
  }

  // 포스터에 모든 파일을 삭제하고 다시 등록 했을 시 파일키 초기화
  const detailFileList = document
    .getElementById("uploadNoSiteFileList")
    .querySelectorAll('[id^="liUploadSiteFileI_"]').length;
  if (detailFileList == 0) {
    atchFileKey = "";
  }

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    bbsSeq: bbsSeq,
    atchFileKey: atchFileKey,
  };
  formData.append(
    "param",
    new Blob([JSON.stringify(param)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  formData.append("files", addfile.value[0]);

  return formData;
};

onBeforeMount(() => {
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
