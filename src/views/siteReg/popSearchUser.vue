<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="popup search_user">
    <div class="popup_title">
      <span>직원 조회</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_default3" id="grid01">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions"
          :rowData="gridRowData"
        >
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
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { reactive, ref, onBeforeMount, defineEmits } from "vue";
import { useSiteRegDetailStore } from '@/stores/site/site-reg-detail-store';
import { useLoginAuthStore } from '@/stores/common/login-auth-store';
import { AgGridVue } from "ag-grid-vue3";

  const siteRegDetailStore = useSiteRegDetailStore();
  const gridRowData = ref([]);
  const gridApi = ref();

  const props = defineProps(["selectEmpList"]);
  const emit = defineEmits(["userInfo"]);

  const loginStore = useLoginAuthStore();
  const vendrCd = loginStore.$state.userInfo.vendrCd;

  const onGridReady = (params) => {
    gridApi.value = params.api;
  };

  const localeText = { noRowsToShow: "조회 결과가 없습니다." };

  const columnDefs = [
    { headerName: "회사명", field: "vendrNm",        width: 150, checkboxSelection: true},
    { headerName: "사용자명", field: "userNm",        width: 80, },
    { headerName: "직위명",   field: "workNm",       width: 80 },
    { headerName: "휴대전화", field: "crryTelNo",     width: 100 },
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
    cellStyle: { textAlign: "center" },
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
    rowSelection: "multiple",
    rowMultiSelectWithClick: true,
    onGridReady: onGridReady,
  };
  
  const selectedUser = () => {
    const getRow = gridOptions.api.getSelectedRows();
    let isUserAlreadyExists;
    console.log("getRow",getRow);

    if (props.selectEmpList && Array.isArray(props.selectEmpList) && props.selectEmpList.length > 0) {
      // props.selectEmpList가 존재하고 배열이며, 배열에 요소가 하나 이상 있는 경우
        // 원하는 동작 수행
        // 이미 추가된 사용자인지 확인
         isUserAlreadyExists = props.selectEmpList.some(
          user => {
            return user.userId === getRow[0].userId && user.userNm === getRow[0].userNm
          }
        );
    }
    emit("userInfo", getRow);
    
    popupClose();
  };

  onBeforeMount(async () => {
    doSearch();
    
  });

  async function doSearch(){
    //사용자 조회
    const userInfoList = await siteRegDetailStore.selectSiteOverviewUserInfoList({"vendrCd": vendrCd});
    gridRowData.value = userInfoList;
  }

  //팝업 닫기
  function popupClose() {

    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("popup search_user")[0].classList.remove("show");

    gridOptions.api.deselectAll();  // 선택 초기화
    doSearch();
  }
</script>


<style scoped>
#grid01 {
  height:calc(100%);
}
</style>