<!-- 안전활동/TBM -->

<template>
  <div class="page_title_area">
    <div class="title">TBM</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 안전활동 > TBM
    </nav>
  </div>

  <div class="page_content_area">
    <div class="content_box">
      <div class="item_wrap w50p">
        <span class="title">TBM 기간</span>
        <input type="date" id="fromTbmDt" max="9999-12-31" />
        <span> ~ </span>
        <input type="date" id="toTbmDt" max="9999-12-31" />
        <button class="cell_btn" @click="resetTbmDt">기간 초기화</button>
      </div>
      <button class="search" @click="tbmDateSearch">조회</button>
    </div>

    <div class="subtitle_area">
      <span class="title">TBM 목록</span>
      <div class="right_btn">
        <router-link
          :to="{
            name: 'toolBoxMeetingRegist',
            params: {
              mode: 'I',
              tbmDt: 'none',
              psitnVendrCd: 'none',
            },
          }"
          ><comp-button v-if="authCd != '1000'" text="TBM 등록"
        /></router-link>
      </div>
    </div>

    <div class="grid_default3" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="40"
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
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import dayjs from "dayjs";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToolBoxMeetingStore } from "../../stores/safeActvt/tool-box-meeting-store";

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜
const router = useRouter();
const authCd = ref("");
const authClsCd = ref("");
const ToolBoxMeetingInfoList = reactive({
  vendrCd: null,
  siteCd: null,
  psitnVendrCd: null,
  tbmDt: null,
  tbmTime: null,
  mode: null,
  userId: null,
});
const tbmRskDsrsList = reactive([]);

const todayStr = ref(year + month + date);

const stdClsMappings = {
  1: "상시",
  2: "최초",
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
    headerName: "TBM 명",
    field: "tbmNm",
    filter: false,
    cellStyle: { textAlign: "left" },
    editable: false,
    width: 200,
  },
  {
    headerName: "TBM 일자",
    field: "tbmDt",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
  },
  {
    headerName: "TBM 시간",
    field: "tbmTime",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
  },
  {
    headerName: "업체명",
    field: "vendrNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
  },
  {
    headerName: "작성자",
    field: "writeNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 200,
  },
  {
    headerName: "상세보기",
    field: "detailBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="cell_btn">상세보기</button>';
      const eButton = eDiv.querySelectorAll(".cell_btn")[0];
      console.log("상세보기 params : ", params);
      eButton.onclick = function () {
        router.push({
          name: "toolBoxMeetingRegist",
          params: {
            mode: "U",
            tbmDt: params.data.tbmDt,
            psitnVendrCd: params.data.psitnVendrCd,
            siteCd: params.data.siteCd,
          },
        });
      };

      return eDiv;
    },
  },

  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="del"></button>';
      const eButton = eDiv.querySelectorAll(".del")[0];

      eButton.onclick = function () {
        if (confirm("삭제 하시겠습니까?")) {
          deleteToolBox(params.data);
        }
      };

      return eDiv;
    },
  },
];

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const doSearchParams = {};
const grid1RowData = ref([]);
const grid2RowData = ref([]);
const toolBoxStore = useToolBoxMeetingStore();
const LoginAuthStore = useLoginAuthStore();

// 초기 날짜값 셋팅
const dateValue = () => {
  fromTbmDt.value = dayjs().format("YYYY-MM-DD");
  toTbmDt.value = dayjs().add(1, "days").format("YYYY-MM-DD");
};

onMounted(() => {
  // 유저 권한 저장
  authCd.value = LoginAuthStore.$state.authInfo.authCd;
  authClsCd.value = LoginAuthStore.$state.authInfo.authClsCd;
  dateValue();

  searchList();
});

// TBM 조회 함수
const searchList = async () => {
  const vendrCd = LoginAuthStore.$state.siteInfo.vendrCd;
  const siteCd = LoginAuthStore.$state.siteInfo.siteCd;
  const userId = LoginAuthStore.$state.userInfo.userId;
  const psitnVendrCd = LoginAuthStore.$state.vendrInfo.vendrCd;
  const from = document.getElementById("fromTbmDt").value.split("-").join("");
  const to = document.getElementById("toTbmDt").value.split("-").join("");
  const params = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    fromTbmDt: from,
    toTbmDt: to,
    userId: userId,
    psitnVendrCd: psitnVendrCd,
  });
  const searchList = await toolBoxStore.toolBoxSearchList(params);
  grid1RowData.value = searchList;
};

// 기간 검색
const tbmDateSearch = async () => {
  const vendrCd = LoginAuthStore.$state.siteInfo.vendrCd;
  const siteCd = LoginAuthStore.$state.siteInfo.siteCd;
  const psitnVendrCd = LoginAuthStore.$state.userInfo.vendrCd;
  const userId = LoginAuthStore.$state.userInfo.userId;
  const from = document.getElementById("fromTbmDt").value.split("-").join("");
  const to = document.getElementById("toTbmDt").value.split("-").join("");
  if (!validDate(from, to)) {
    return;
  }

  const params = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    fromTbmDt: fromTbmDt.value.split("-").join(""),
    toTbmDt: toTbmDt.value.split("-").join(""),
    psitnVendrCd: psitnVendrCd,
    userId: userId,
  });
  console.log("params : ", params);
  const searchList = await toolBoxStore.toolBoxSearchList(params);
  grid1RowData.value = searchList;
};

// 날짜 유효성 검사
const validDate = (from, to) => {
  if (to < from) {
    fromTbmDt.value = dayjs(to).format("YYYY-MM-DD");
    toTbmDt.value = dayjs(from).format("YYYY-MM-DD");
    return true;
  } else {
    return true;
  }
};

// 검색 기간 초기화
const resetTbmDt = () => {
  document.getElementById("fromTbmDt").value = "";
  document.getElementById("toTbmDt").value = "";
};

// 리스트 삭제
const deleteToolBox = async (data) => {
  console.log("data : ", data);

  const formData = new FormData();

  let vendrCd = data.vendrCd;
  let siteCd = data.siteCd;
  let psitnVendrCd = data.psitnVendrCd;
  let userId = LoginAuthStore.$state.userInfo.userId;
  let tbmDt = dayjs(data.tbmDt, "YYYY-MM-DD").format("YYYYMMDD");
  let tbmTime = dayjs(data.tbmTime, "HH:MM").format("HHMM");
  if (data.regId != userId) {
    alert("작성자만 게시글 삭제할 수 있습니다.");
    return;
  }

  ToolBoxMeetingInfoList.vendrCd = vendrCd;
  ToolBoxMeetingInfoList.siteCd = siteCd;
  ToolBoxMeetingInfoList.psitnVendrCd = psitnVendrCd;
  ToolBoxMeetingInfoList.tbmDt = tbmDt;
  ToolBoxMeetingInfoList.tbmTime = tbmTime;
  ToolBoxMeetingInfoList.mode = "D";
  ToolBoxMeetingInfoList.userId = userId;
  console.log("ToolBoxMeetingInfo : ", ToolBoxMeetingInfoList);
  const params = {
    toolBoxMeetingInfo: ToolBoxMeetingInfoList,
    tbmRskDsrsList: tbmRskDsrsList,
  };
  console.log("params : ", params);
  formData.append(
    "param",
    new Blob([JSON.stringify(params)], {
      type: "application/json",
    })
  );

  console.log("formData apply >>>>>>> ", formData);

  await toolBoxStore.toolBoxDeleteList(formData);

  searchList();
};

watch(
  () => {
    return toolBoxStore.$state.searchList; // 변경을 감지할 스토어의 값
  },
  (newValue, oldValue) => {
    grid1RowData.value = newValue;
  }
);
</script>

<style scoped>
#grid01 {
  height: calc(100% - 130px);
}
</style>
