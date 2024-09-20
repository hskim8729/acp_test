<template>
  <div class="page_title_area">
    <div class="title">공지사항</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 게시판 > 공지사항
    </nav>
    <div class="top_btn_area">
      <button
        @click="noticeWriteBtn"
        v-if="
          loginAuth.$state.authInfo.authCd != '5000' &&
          loginAuth.$state.authInfo.authCd != 'T2203'
        ">
        글쓰기
      </button>
    </div>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">공지사항 목록</span>
      <div class="right_btn">
        <select id="searchCategory">
          <option value="ttl">제목</option>
          <option value="dtl">내용</option>
          <option value="regId">작성자</option>
        </select>
        <input type="text" id="searchText" @keyup.enter="searchOption" />
        <button @click="searchOption">조회</button>
      </div>
    </div>
    <div class="grid_default3" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="35"
        :rowHeight="53"
        :columnDefs="columnDefs1"
        :rowData="grid1RowData"
        :defaultColDef="defaultColDef"
        :singleClickEdit="true"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        :stopEditingWhenCellsLoseFocus="true"
        :gridOptions="grid2Options">
      </ag-grid-vue>
    </div>
  </div>

  <!-- 글쓰기 팝업 -->
  <noticeWrite @searchList="searchList"></noticeWrite>

  <!-- 글보기 팝업 -->
  <noticeView
    :boardSeq="boardSeq"
    ref="boardUpdateInfo"
    @searchList="searchList"></noticeView>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { onBeforeMount, ref } from "vue";
import { useBoardStore } from "../../stores/board/board_store";

import noticeView from "./noticeView.vue";
import noticeWrite from "./noticeWrite.vue";
const loginAuth = useLoginAuthStore();

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜
const boardStore = useBoardStore();
const boardSeq = ref("");
const boardUpdateInfo = ref("");
const authClsCd = ref("");
const authCd = ref("");

const todayStr = ref(year + "-" + month + "-" + date);

const stdClsMappings = {
  1: "공단표준",
  2: "사용자정의표준",
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}

function lookupValue(mappings, key) {
  return mappings[key];
}

const stdClsCds = extractKeys(stdClsMappings);

const columnDefs1 = [
  {
    headerName: "No",
    field: "rowNum",
    width: 100,
    maxWidth: 100,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "구분",
    field: "bbsClsNm",
    width: 200,
    maxWidth: 200,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "제목",
    field: "ttl",
    width: 1000,
    maxWidth: 1500,
    filter: false,
    editable: false,
  },
  // {
  //   headerName: "첨부파일",
  //   field: "file",
  //   filter: false,
  //   cellStyle: { textAlign: "center" },
  //   editable: false,
  //   width: 100,
  //   maxWidth: 100,
  //   cellRenderer: (params) => {
  //     const eDiv = document.createElement("div");
  //     eDiv.classList.add("cell_center");
  //     eDiv.innerHTML = '<button class="file"></button>';
  //     const eButton = eDiv.querySelectorAll(".file")[0];
  //     eButton.onclick = function () {
  //       removeRow(params);
  //     };
  //     return eDiv;
  //   },
  // },
  {
    headerName: "작성자",
    field: "writeNm",
    width: 200,
    maxWidth: 200,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "작성일",
    field: "regDate",
    cellStyle: { textAlign: "center" },
    width: 150,
    maxWidth: 150,
    filter: true,
    headerClass: "ag-right-header",
    cellEditor: "agDateStringCellEditor",
    cellEditorParams: {
      min: "2000-01-01",
    },
  },
  {
    headerName: "조회수",
    field: "inqNum",
    width: 100,
    maxWidth: 100,
    filter: false,
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "상세조회",
    field: "detailBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 150,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="cell_btn">상세조회</button>';
      const eButton = eDiv.querySelectorAll(".cell_btn")[0];
      eButton.onclick = function () {
        onRowClicked(params);
      };

      return eDiv;
    },
  },
  {
    headerName: "삭제",
    field: "del",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="del"></button>';
      const eButton = eDiv.querySelectorAll(".del")[0];
      eButton.onclick = function () {
        if (confirm("삭제 하시겠습니까?")) {
          boardListDelete(params.data);
        }
      };
      return eDiv;
    },
  },
];

const defaultColDef = {
  editable: false,
  sortable: false,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const grid2Options = {
  headerHeight: 40,
  rowHeight: 53,
  pagination: true,
  paginationPageSize: 10,
};

const grid1RowData = ref([]);

onBeforeMount(() => {
  authClsCd.value = loginAuth.$state.authInfo.authClsCd;
  authCd.value = loginAuth.$state.authInfo.authCd;

  searchList();
});

// 게시판 게시글 삭제
const boardListDelete = async (param) => {
  let formData = new FormData();
  const userId = loginAuth.$state.userInfo.userId;
  let vendrCd = loginAuth.$state.siteInfo.vendrCd;
  console.log("param : ", param);
  if (
    authCd.value == "1000" &&
    authClsCd.value == "T2201" &&
    vendrCd === undefined
  ) {
    vendrCd = loginAuth.$state.authInfo.vendrCd;
  }

  if (param.regId != userId) {
    alert("작성자만 게시글 삭제할 수 있습니다.");
    return;
  }

  const params = {
    vendrCd: vendrCd,
    atchFileKey: param.atchFileKey,
    bbsSeq: param.bbsSeq,
    mode: "D",
    userId: userId,
  };

  formData.append(
    "param",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  await boardStore.deleteList(formData);

  searchList();
};

// 슈퍼바이저 체크 함수
const isSupervisor = () => {
  const vendrCd = loginAuth.$state.userInfo.vendrCd;
  if (vendrCd == "0000") {
    return true;
  } else {
    return false;
  }
};

// 검색조건 조회
const searchOption = async () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const authCd = loginAuth.$state.authInfo.authCd;
  const authClsCd = loginAuth.$state.authInfo.authClsCd;
  const category = document.getElementById("searchCategory").value;
  const searchText = document.getElementById("searchText").value;
  const userId = loginAuth.$state.userInfo.userId;
  let param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    authCd: authCd,
    authClsCd: authClsCd,
    [category]: searchText,
    userId: userId,
  };

  // 슈퍼바이저 계정일 경우 param 값 변경
  if (isSupervisor()) {
    param = {
      vendrCd: "0000",
      siteCd: "00000",
      userId: userId,
    };
  }
  const boardList = await boardStore.boardSelectList(param);
  grid1RowData.value = boardList;
};

// 게시글 조회
const searchList = async () => {
  const vendrCd = loginAuth.$state.authInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const authCd = loginAuth.$state.authInfo.authCd;
  const authClsCd = loginAuth.$state.authInfo.authClsCd;
  const userId = loginAuth.$state.userInfo.userId;
  let param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    authCd: authCd,
    authClsCd: authClsCd,
    userId: userId,
  };

  // 슈퍼바이저 계정일 경우 param 값 변경
  if (isSupervisor()) {
    param = {
      vendrCd: "0000",
      siteCd: "00000",
      userId: userId,
    };
  }
  console.log("게시판 param : ", param);
  const boardList = await boardStore.boardSelectList(param);
  grid1RowData.value = boardList;
};

// 그리드 클릭 이벤트
const onRowClicked = async (params) => {
  boardSeq.value = params.data.bbsSeq;
  const param = { bbsSeq: boardSeq.value };
  const detailBoard = await boardStore.boardDetailSearch(param);
  console.log("detailBoard : " + detailBoard);
  console.log("boardSeq : " + boardSeq.value);
  boardUpdateInfo.value.updateInfo(detailBoard);
  noticeViewBtn();
};

// 글보기 팝업
const noticeViewBtn = () => {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("notice_view")[0].classList.add("show");
};

// 글쓰기 팝업
function noticeWriteBtn() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("notice_write")[0].classList.add("show");
}
</script>
<style scoped>
.grid_default3 {
  height: calc(100% - 40px);
}
.right_btn input,
.right_btn select {
  height: 30px;
  margin-left: 5px;
}

.notice_write,
.notice_view {
  width: 800px;
  height: calc(100% - 200px);
}
</style>
