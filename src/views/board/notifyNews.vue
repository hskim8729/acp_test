<template>
  <div class="page_title_area">
    <div class="title">알림소식</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 게시판 > 알림소식
    </nav>
    <div class="top_btn_area">
      <button @click="openWrite(false)">글쓰기</button>
      <button @click="openTestAPI(false)" v-if="false">API TEST</button>
    </div>
  </div>
  <div class="page_content_area">
    <div class="subtitle_area">
      <div class="tab_wrap">
        <div class="notify_tab">
          <ul>
            <li
              v-for="item in bbsClsList"
              :key="item.bbsClsCd"
              :class="bbsClsCd === item.bbsClsCd ? 'active' : ''"
              @click="changeTab(item.bbsClsCd)">
              {{ item.bbsClsNm }}
            </li>
          </ul>
        </div>
      </div>
      <div class="right_btn w-33">
        <select v-model="searchCategory">
          <option value="ttl">제목</option>
          <option value="cntn">내용</option>
          <option value="regId">작성자</option>
        </select>
        <input type="text" id="searchText" @keyup.enter.prevent="searchList" />
        <button @click="searchList">조회</button>
      </div>
    </div>
    <div class="grid_default" id="grid01">
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
  <notifyNewsWrite
    ref="notifyNewsWriteRef"
    @close="closeWrite"
    v-if="isWritePopVisible"
    :isPopVisible="isWritePopVisible"
    :notifyNewsInfo="selectRowParam"
    :bbsClsCd="bbsClsCd">
  </notifyNewsWrite>
  <apiTest v-if="isOpenTest" @close="closeTestAPI"> </apiTest>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBoardStore } from "../../stores/board/board_store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import notifyNewsWrite from "./notifyNewsWrite.vue";
import apiTest from "@/views/board/apiTest.vue";

const loginAuth = useLoginAuthStore();
const notifyNewsWriteRef = ref(null);
const grid1RowData = ref([]);
const isWritePopVisible = ref(false);
const isWriteAuth = ref(false);
const searchCategory = ref("ttl");
const bbsClsCd = ref("T2308");

const userId = loginAuth.$state.userInfo.userId;

const boardStore = useBoardStore();
const localeText = { noRowsToShow: "조회 결과가 없습니다." };
let selectRowParam = ref([]);

const bbsClsList = ref([
  { bbsClsCd: "T2308", bbsClsNm: "공지사항" },
  { bbsClsCd: "T2309", bbsClsNm: "홍보자료" },
]);

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
    width: 1000,
    maxWidth: 1500,
    filter: false,
    editable: false,
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
    headerName: "첨부파일",
    field: "file",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    cellRenderer: (params) => {
      if (params.data.atchFileKey) {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<p class="file_no_cursor"></p>';
        return eDiv;
      }
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
      // 본인이 작성한 글은 삭제 가능
      if (isWriteAuth.value && params.data.regId === userId) {
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
      }
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

// 목록 조회
const searchList = async () => {
  const vendrCd = "0000";
  const siteCd = "00000";
  const param = {
    userId: userId,
    vendrCd: vendrCd,
    siteCd: siteCd,
    [searchCategory.value]: searchText.value,
    bbsClsCd: bbsClsCd.value,
  };

  const boardList = await boardStore.boardSelectList(param);
  grid1RowData.value = boardList;
};

// 게시글 삭제
const boardListDelete = async (param) => {
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

// 작성팝업 open
const openWrite = (param) => {
  selectRowParam.value = { ...param.data };
  isWritePopVisible.value = true;
};

// 작성팝업 close
const closeWrite = (isReload) => {
  isWritePopVisible.value = false;

  if (isReload) {
    searchList();
  }
};

const changeTab = (clsCd) => {
  bbsClsCd.value = clsCd;

  searchList();
};

// 상세보기 click
const onRowClicked = async (params) => {
  openWrite(params);
};

const isOpenTest = ref(false);
const openTestAPI = () => {
  isOpenTest.value = true;
};
const closeTestAPI = () => {
  isOpenTest.value = false;
};

onMounted(() => {
  // 슈퍼바이저만 작성 가능
  const vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  if (vendrCd == "0000") {
    isWriteAuth.value = true;
  } else {
    isWriteAuth.value = false;
  }
  console.log(`vendrCd :: ${vendrCd} // isWriteAuth :: ${isWriteAuth.value}`);
  searchList();
});
</script>
<style scoped>
.grid_default {
  height: calc(100% - 40px);
}
.tab_wrap {
  position: relative;
  width: 100%;
}
.tab_wrap .notify_tab {
  left: 0px;
  height: 30px;
}
.tab_wrap .notify_tab li {
  float: left;
  height: 30px;
  padding: 0px 20px;
  line-height: 30px;
  border-left: 3px solid #cccccc;
  font-family: "Pretendard-EB";
  font-size: 18px;
  color: #999999;
  cursor: pointer;
}
.tab_wrap .notify_tab li.active {
  color: #252525;
}
.tab_wrap .notify_tab li:first-child {
  border: 0px;
}
.right_btn input,
.right_btn select {
  height: 30px;
  margin-left: 5px;
}
</style>
