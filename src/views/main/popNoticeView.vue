<template>
  <div class="popup notice_view">
    <div class="popup_title">
      <span>공지사항</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="board_view_info">
          <span class="writer">{{ writeNm }}</span>
          <span class="date">{{ regDate }}</span>
          <span class="hit">{{ inqNum }}</span>
        </div>

        <div class="board_item w50p">
          <div class="title">카테고리</div>
          <div class="form">
            <select
              class="w200"
              id="boardCategory"
              disabled
              v-bind:value="bbsClsNm"
            >
              <option>{{ bbsClsNm }}</option>
            </select>
          </div>
        </div>
        <!-- <div class="board_view_info"> -->
        <div class="board_item w50p">
          <div class="title">게시기간</div>
          <div class="form">
            <input
              type="date"
              id="strtStDtDetail"
              max="9999-12-31"
              readonly
              v-model="strtStDt"
            /><span class="date_span">~</span
            ><input
              type="date"
              id="strtEnDtDetail"
              max="9999-12-31"
              readonly
              v-model="strtEnDt"
            />
          </div>
        </div>
        <div class="board_item w100p">
          <div class="title">제목</div>
          <div class="form">
            <input type="text" v-model="ttl" readonly />
          </div>
        </div>
        <!-- </div> -->
        <!-- <div class="board_view_content"> -->
        <div class="board_item">
          <div class="title">내용</div>
          <div class="form">
            <textarea v-model="dtl" readonly></textarea>
          </div>
        </div>
        <!-- </div> -->
        <!-- <div class="board_view_file"> -->
        <div class="board_item_file">
          <div class="file_list">
            <ul id="ulMainDashList"></ul>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
    <div class="popup_button">
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
const bbsClsCd = ref("");
const selectedValue = ref("");
let boardUpdateInfo = ref([""]);

// 팝업창 닫기
function popupClose(event) {
  resetData();
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 상세조회 데이터
const updateInfo = (param) => {
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
  selectedValue.value = param[0].bbsClsCd;

  detailFile(param);
};

// 데이터 초기화 함수
const resetData = () => {
  const fileList = document.getElementById("ulMainDashList");
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
};

// 상세보기 파일 리스트
const detailFile = (param) => {
  const fileList = document.getElementById("ulMainDashList");
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
      fileList.appendChild(li);
    }
  }
};

onMounted(() => {});

defineExpose({
  updateInfo,
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
.board_item {
  display: inline-block;
}
.notice_view {
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
</style>
