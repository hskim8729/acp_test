<template>
  <div class="grid_default" id="grid01">
    <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :headerHeight="40"
        :rowHeight="53"
        :columnDefs="columnDefs"
        :rowData="templateList"
        :gridOptions="gridOptions"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup>
import {reactive, ref, onBeforeMount, getCurrentInstance} from "vue";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { storeToRefs } from "pinia";
import { useLoginAuthStore } from '@/stores/common/login-auth-store';


  // 그리드 & store 정보
  const grid1Api = ref();
  const grid1ColumnApi = ref();
  const store = useRiskFactorStandardStore();
  const siteStore = useSiteRiskFactorRegulationStore();

  const loginStore = useLoginAuthStore();

  const grid1RowData = ref([]);

  const userId = loginStore.$state.userInfo.userId;
  const vendrCd = loginStore.$state.userInfo.vendrCd;
  const siteCd = loginStore.$state.siteInfo.siteCd;
  const division = "N";

  const { defaultColDef, localeText, templateList } = defineProps([
    "defaultColDef",
    "localeText",
    "templateList",
  ]);

  // Grid 컬럼
  const columnDefs = [
    {
      headerName: "구분",
      field: "stdClsNm",
      filter: false,
      cellStyle: { textAlign: "center" },
      editable: false,
      width: 200,
      maxWidth: 400,
    },
    {
      headerName: "표준명",
      field: "stdNm",
      filter: false,
      cellStyle: { textAlign: "center" },
      editable: false,
      width: 200,
      maxWidth: 400,
    },
    {
      headerName: "설명",
      field: "stdDc",
      filter: false,
      cellStyle: { textAlign: "center" },
      editable: false,
      width: 500,
      maxWidth: 1000,
    },
  ];

  // grid 실행 시
  function onGridReady(event) {
    grid1Api.value = event.api;
    grid1ColumnApi.value = event.columnApi;
    // event.api.sizeColumnsToFit();
  }

  // grid options
  const gridOptions = {
    localeText: localeText,
    defaultColDef: defaultColDef,
    singleClickEdit:true ,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 20,
    stopEditingWhenCellsLoseFocus: true,
    rowSelection: "single",
    onGridReady: onGridReady,
  };



  // 컴포넌트 생성 전
  onBeforeMount(async () => {

    const templateListParam = {
      vendrCd: vendrCd,
      siteCd: siteCd,
      userId: userId,
    };
    
    // 현장 표준 위험요인 템플릿 
    // var searchList = await siteStore.fetchTemplateList(templateListParam);
    // if(searchList.length>0){
    //   grid1RowData.value = searchList;
    // }else{
    //   alert("현장 표준 위험요인을 등록 후 이용해주세요.");
    //   return;
    // }
    // await siteStore.fetchTemplateList(templateListParam);

    // const searchList = siteStore.$state.templateList;
    // const siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;

    // console.log("siteHrmrskFctrMstSeq", siteHrmrskFctrMstSeq)
    // if(searchList.length>0){
    //   grid1RowData.value = searchList;
    // }else{
    //   alert("현장 표준 위험요인을 등록 후 이용해주세요.");
    //   return;
    // }

  });
  
  
</script>

<style scoped>
#grid01 {
  float: left;
  width: 100%;
  height: 50px;
  margin-bottom: 30px;
}

.ag-theme-alpine {
  float: left;
}
</style>
