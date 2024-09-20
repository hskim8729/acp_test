
<template>
  
  <div class="grid_default2" id="grid01">
    <div class="subtitle_area">
      <button @click="updateMarkYn('fctr')">위험요인 편집</button>
      <button @click="updateMarkYn('msr')">표준감소대책 편집</button>
    </div>

    <popFctrList 
      :codeParams="codeParams" :key="codeParams"
    ></popFctrList>

    <popMsrList 
      :codeParams="codeParams" 
      :rskFctrSeq="rskFctrSeq" :key="rskFctrSeq"
    ></popMsrList>

      <ag-grid-vue
        style="width: 50%; height: 100%;"
        class="ag-theme-alpine"
        :headerHeight="40"
        :rowHeight="53"
        :columnDefs="columnDefs1"
        :rowData="grid1RowData"
        :defaultColDef="defaultColDef"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        @grid-ready="onGridReady"
        :stopEditingWhenCellsLoseFocus="true"
        @row-clicked="onRowClicked1"
    >
    </ag-grid-vue>
    
    <ag-grid-vue
        style="width: 50%; height: 100%;"
        class="ag-theme-alpine"
        :headerHeight="40"
        :rowHeight="53"
        :columnDefs="columnDefs2"
        :rowData="grid2RowData"
        :defaultColDef="defaultColDef"
        :undoRedoCellEditing="true"
        :undoRedoCellEditingLimit="20"
        :localeText="localeText"
        @grid-ready="onGridReady"
        :stopEditingWhenCellsLoseFocus="true"
    >
    </ag-grid-vue>


  </div>

</template>
<script setup>
import {reactive, ref, onBeforeMount, watchEffect, onMounted, watch} from "vue";
import {useRiskFactorStandardStore} from "@/stores/stdMgmt/risk-factor-standard-store";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import {AgGridVue} from "ag-grid-vue3";
import {storeToRefs} from "pinia";
import { useLoginAuthStore } from '@/stores/common/login-auth-store';
import popFctrList from '@/views/site/comPopup/popFctrList.vue';
import popMsrList from '@/views/site/comPopup/popMsrList.vue';

const loginStore = useLoginAuthStore();

const siteStore = useSiteRiskFactorRegulationStore();

const userId = loginStore.$state.userInfo.userId;
const vendrCd = loginStore.$state.vendrInfo.ptnrYn == "Y" ? loginStore.$state.vendrInfo.vendrUpperCd : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
let siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;
const division = "N";

const codeParams = ref({});
let rskFctrSeq = ref("");

const grid1Api = ref(null);
const grid1ColumnApi = ref(null);

const {defaultColDef, localeText} = defineProps([
  "defaultColDef",
  "localeText",
  "codeParams",
]);

// 컴포넌트 2(2. 표준공종/위험요인) 에서 대분류, 중분류, 작업명 값 받아오기
const {
  selectCodeObj,
  rskFctrMsrList,
} = storeToRefs(siteStore);

const grid1RowData = ref([]);
const grid2RowData = ref([]);

function onGridReady(event) {
  grid1Api.value = event.api;
  grid1ColumnApi.value = event.columnApi;
  event.api.sizeColumnsToFit();
}

  // 위험요인
  const columnDefs1 = [
    {
      headerName: "위험요인",
      field: "rskFctr",
      filter: false,
      cellStyle: {textAlign: "left"},
      editable: false,
      width: 200,
      maxWidth: 400,
    },
  ];

  // 감소대책
  const columnDefs2 = [
    {
      headerName: "감소대책",
      field: "rskMsr",
      filter: false,
      cellStyle: {textAlign: "left"},
      editable: false,
      width: 200,
      maxWidth: 400,
    },
  ];


onMounted(async() => {

  // await siteStore.fetchRskFctrMsrList(codeParams.value); qqq

  console.log("selectCodeObj>>", selectCodeObj.value);
  watch(() => selectCodeObj.value, (newVal, oldVal) => {
      console.log("watch.OldVal selectCodeObj====", oldVal);
      console.log("watch.NewVal ====", newVal);

      codeParams.value = newVal;
      // doSearch(codeParams);
  })

  const test = await siteStore.fetchRskFctrMsrList(selectCodeObj.value);
  console.log('siteRiskFactorsGrid3 onMounted >>>>>>> ', test)

})

// 위험요인 조회
async function doSearch(codeParams) {
  console.log("3.위험요인 및 감소대책 codeParams.value>>>", codeParams.value);

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: codeParams.value.lgCatCd,
    mdCatCd: codeParams.value.mdCatCd,
    wrkNmCd: codeParams.value.wrkCd,
    division: division,
  }
  // 위험요인 조회
  const searchList = await siteStore.fetchRskFctrList(param);
  grid1RowData.value = searchList;
}

 // 위험요인 항목 클릭 시
 async function onRowClicked1(event) {

  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: codeParams.value.lgCatCd,
    mdCatCd: codeParams.value.mdCatCd,
    wrkNmCd: codeParams.value.wrkCd,
    rskFctrSeq: event.data.rskFctrSeq,
    division: division,  //팝업이 아닐때
  };
  // rskFctrSeq.value = event.data.rskFctrSeq;

  // 감소대책 조회
  const searchList = await siteStore.fetchRskMsrList(params);
  grid2RowData.value = searchList;

  // if(searchList.length>0){
      // * 대분류 클릭 시 대,중,작업명 값 저장
      // 중분류 첫번째 값으로 세팅된 작업목록 값 param에 저장
      // 컴포넌트 3 (3.위험요인 및 감소대책) 에 대분류, 중분류, 작업명 값 넘기기
      // params.rskFctrSeq = searchList[0].rskFctrSeq;
    // }

    // * 대분류, 중분류, 작업명 값 객체(codeParams)에 저장 
    // const res = await siteStore.setCodeSelect(params);
    // codeParams.value = res;

    // console.log('onMdCatRowClicked codeParams', codeParams.value);




};

// 편집 버튼 클릭 시 
function updateMarkYn(str) {
  if(str == "fctr") popupFctrList();
  else if(str == "msr") popupMsrList();
}

//팝업 - 위험요인 편집
function popupFctrList() {
    document.getElementsByClassName("popup add_fctr")[0].classList.add("show");
}
//팝업 - 감소대책 편집
function popupMsrList() {
    document.getElementsByClassName("popup add_msr")[0].classList.add("show");
}
</script>

<style scoped>
#grid01 {
  float: left;
  width: 100%;
  height: calc(100% - 340px);
  margin-bottom: 10px;
}

.ag-theme-alpine {
  float: left;
}

.popup.add_fctr {
  width:300px;
  height:500px;
}
.popup.add_msr {
  width:300px;
  height:500px;
}
</style>
