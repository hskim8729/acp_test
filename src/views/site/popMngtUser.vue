<!-- 현장등록/현장등록/팝업-안전관리자등록 -->

<template>
  <div class="popup mgmt_user">
    <div class="popup_title">
      <span>안전관리자 등록</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
        <div class="grid_default3" id="grid01">
          <ag-grid-vue
              style="width: 100%; height: 100%"
              class="ag-theme-alpine"
              :rowData="grid1RowData"
              :gridOptions="grid1Options"
          >
          </ag-grid-vue>
        </div>
    </div>
    <div class="popup_button">
      <button @click="choiceUser">선택</button>
    </div>
  </div>
</template>

<script setup>
  import "ag-grid-community/styles//ag-grid.css";
  import "ag-grid-community/styles//ag-theme-alpine.css";
  import { AgGridVue } from "ag-grid-vue3";
  import { reactive, ref, onBeforeMount, defineEmits } from 'vue';
  import siteRegService from '@/api/services/site/site-reg-service';
  import { useLoginAuthStore } from '@/stores/common/login-auth-store';

  const grid1RowData = ref([]);
  const grid1Api = ref();
  const loginStore = useLoginAuthStore();

  const localeText = {noRowsToShow: "조회 결과가 없습니다."};

  const emit = defineEmits(["check"]);

  function extractKeys(mappings) {
    return Object.keys(mappings);
  }
  function lookupValue(mappings, key) {
    return mappings[key];
  }

  const defaultColDef = {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 50,
    filter: false,
    resizable: true,
    headerClass: "centered", 
    cellClass: "centered"
  };

  const columnDefs1 = [
    { headerName: "성명", field: "userNm", filter: false, cellStyle: {textAlign: "center",},editable: false, width: 120, maxWidth: 200, checkboxSelection: true,},
    { headerName: "직위", field: "workNm", filter: false, cellStyle: {textAlign: "center"}, editable: false, width: 120,maxWidth: 150},
    { headerName: "사용자 ID", field: "userId", filter: false, cellStyle: {textAlign: "center"},editable: false, width: 120 ,maxWidth: 250},
  ];

  const grid1Options = {
    headerHeight: 40,
    rowHeight: 53,
    columnDefs: columnDefs1,
    rowData: grid1RowData.value,
    defaultColDef: defaultColDef,
    doubleClickEdit: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 20,
    localeText: localeText,
    stopEditingWhenCellsLoseFocus: true,
    rowSelection: "single",
    onGridReady: onGridReady1,
    onRowClicked: onRowClicked,
  };

  //조회 파라메타
  var fchParams = reactive({
    vendrCd : loginStore.$state.userInfo.vendrCd
  });

  onBeforeMount(async() => {
    //안전관리자 목록 조회
    var searchList = await siteRegService.selectMgmtUser(fchParams);
    if(searchList){
      grid1RowData.value = searchList.data.selectMngtUser;
    }else{
      alert("조회된 데이터가 없습니다.");
    }
  });

  async function onRowClicked(param){
    selectUser(param.data);
  }

  function selectUser(data) {

    // const dataObj = {
    //   "userNm" : data.userNm,
    //   "userId" : data.userId,
    // }
    // emit("check", dataObj);
  }

  function onGridReady1(params) {
    grid1Api.value = params.api;
    params.api.sizeColumnsToFit();
  }

  // 선택 버튼 클릭 시
  function choiceUser() {

    const getRow = grid1Options.api.getSelectedRows()[0];

    const dataObj = {
      "userNm" : getRow.userNm,
      "userId" : getRow.userId,
    }
    emit("check", dataObj);

    popupClose();
    
  }

  //팝업 닫기
  function popupClose(){
    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("popup mgmt_user")[0].classList.remove("show");
  }


</script>


<style scoped>
#grid01 {
  height:100%;
}
.popup_content {
  height:calc(100% - 115px);
}
.popup.mgmt_user {
	 width:600px;
	 height:565px;
}
</style>