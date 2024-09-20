<template>
  <div class="page_title_area">
    <div class="title">자료실</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 게시판 > 자료실
    </nav>
    <div class="top_btn_area">
      <button @click="dataWriteBtn" v-if="isWriteAuth">글쓰기</button>
    </div>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">자료실 목록</span>
      <div class="right_btn">
        <select id="searchCategory">
          <option value="ttl">제목</option>
          <option value="dtl">내용</option>
          <option value="regId">작성자</option>
        </select>
        <input type="text" id="searchText" />
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
        :stopEditingWhenCellsLoseFocus="true">
      </ag-grid-vue>
    </div>
  </div>

  <!-- 글쓰기 팝업 -->
  <dataWrite @searchList="searchList"></dataWrite>

  <!-- 글보기 팝업 -->
  <dataView
    :boardSeq="boardSeq"
    ref="boardUpdateInfo"
    @searchList="searchList"></dataView>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref, onBeforeMount, onMounted } from "vue";
import Datepicker from "vue3-datepicker";
import { axiosApiDEV } from "@/api";
import { useBoardStore } from "../../stores/board/board_store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import commonUtil from "@/utils/common-utils";

import dataWrite from "./dataWrite.vue";
import dataView from "./dataView.vue";

const boardStore = useBoardStore();
const loginAuth = useLoginAuthStore();
let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜
const boardSeq = ref("");
const boardUpdateInfo = ref("");
const isWriteAuth = ref(false);
const cUtils = commonUtil;

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
    headerName: "제목",
    field: "ttl",
    width: 1200,
    maxWidth: 1500,
    filter: false,
    editable: false,
  },
  {
    headerName: "첨부파일",
    field: "file",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      console.log("params.data.atchFileKey : " + params.data.atchFileKey);
      if (!cUtils.nullCheck(params.data.atchFileKey)) {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="file"></button>';
        return eDiv;
      } else {
        return "";
      }
    },
  },
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
};

const grid1RowData = ref([]);

// 상세보기 이벤트
const onRowClicked = async (params) => {
  boardSeq.value = params.data.bbsSeq;
  const param = { bbsSeq: boardSeq.value };
  const detailBoard = await boardStore.boardDetailSearch(param);
  boardUpdateInfo.value.updateInfo(detailBoard);
  dataViewBtn();
};

// 글보기 팝업
function dataViewBtn(params) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("data_view")[0].classList.add("show");
}

// 글쓰기 팝업
function dataWriteBtn() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("data_write")[0].classList.add("show");
}

// 게시판 게시글 삭제
const boardListDelete = async (param) => {
  const userId = loginAuth.$state.userInfo.userId;
  if (param.regId != userId) {
    alert("작성자만 게시글 삭제할 수 있습니다.");
    return;
  }

  let formData = new FormData();

  const vendrCd = "0000";

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

// 검색조건 조회
const searchOption = async () => {
  const vendrCd = "0000"; // 자료실은 슈퍼바이저만 작성 할 수 있음
  const siteCd = "00000";
  const category = document.getElementById("searchCategory").value;
  const searchText = document.getElementById("searchText").value;
  const userId = loginAuth.$state.userInfo.userId;
  const param = {
    userId: userId,
    vendrCd: vendrCd,
    siteCd: siteCd,
    [category]: searchText,
    bbsClsCd: "T2304",
  };
  const boardList = await boardStore.boardSelectList(param);
  grid1RowData.value = boardList;
};

// 게시글 조회
const searchList = async () => {
  const vendrCd = "0000";
  const siteCd = "00000";
  const userId = loginAuth.$state.userInfo.userId;
  const param = {
    userId: userId,
    vendrCd: vendrCd,
    siteCd: siteCd,
    bbsClsCd: "T2304",
  };
  const boardList = await boardStore.boardSelectList(param);
  grid1RowData.value = boardList;
};

onMounted(() => {
  // 자료실은 슈퍼바이저만 작성 할 수 있음
  const vendrCd = loginAuth.$state.userInfo.vendrCd;
  //const upperVenderCd = loginAuth.$state.vendrInfo.vendrUpperCd;
  if (vendrCd == "0000") {
    isWriteAuth.value = true;
  } else {
    isWriteAuth.value = false;
  }
  searchList();
});
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
</style>
