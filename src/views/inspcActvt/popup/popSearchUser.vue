<!-- 팝업-사용자 등록(결재관리 시 필요한 사용자 선택) -->

<template>
  <div class="pop_in_pop search_user show">
    <div class="popup_title">
      <span>담당자 조회</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="item_wrap w50p">
          <span for="vendrNm" class="title">사용자명</span>
          <input type="text" v-model="userNm" />
        </div>
        <button class="search" @click="onSearch">조회</button>
      </div>
      <div class="grid_default" id="grid01">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions"
          :rowData="gridRowData">
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="selectedUser">선택</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMenuAuthUserStore } from "@/stores/common/menu-auth-user-store";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["userParams", "isPopupBg"]);
const siteRegDetailStore = useSiteRegDetailStore();
const menuAuthUserStore = useMenuAuthUserStore();
const gridRowData = ref([]);
const gridApi = ref();

const emit = defineEmits(["selectedUser", "close"]);

const loginStore = useLoginAuthStore();

const userNm = ref("");

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs = [
  {
    headerName: "회사명",
    field: "vendrNm",
    width: 150,
    checkboxSelection: true,
  },
  { headerName: "사용자명", field: "userNm", width: 80 },
  { headerName: "직위명", field: "workNm", width: 100 },
  { headerName: "직책", field: "jbttlNm", width: 100 },
  { headerName: "사용자ID", field: "userId", width: 150 },
];

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
  cellStyle: { textAlign: "left" },
};

const gridOptions = {
  headerHeight: 40,
  rowHeight: 53,
  defaultColDef: defaultColDef,
  columnDefs: columnDefs,
  singleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  rowSelection: "single",
  onGridReady: onGridReady,
};

// 취소
const popupClose = () => {
  gridApi.value.deselectAll(); // 기존에 선택된 행이 있다면 모두 선택 해제
  emit("close");
};

// 선택
const selectedUser = (params) => {
  const getRow = gridOptions.api.getSelectedRows()[0];
  emit("selectedUser", getRow);
  popupClose();
};

onBeforeMount(() => {
  onSearch();
});

// 조회
async function onSearch() {
  const params = {
    ...props.userParams,
    userNm: userNm.value,
  };

  //사용자 조회
  const userInfoList = await menuAuthUserStore.selectMenuAuthUserList(params);

  if (userInfoList) {
    gridRowData.value = userInfoList;
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}
</script>

<style scoped>
#grid01 {
  height: calc(100% - 90px);
}

.search_user {
  width: 70%;
  height: 80%;
}
</style>
