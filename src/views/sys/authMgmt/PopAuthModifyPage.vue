<!-- 시스템/코드관리 -->

<template>
  <div class="subtitle_area">
    <div class="title">권한 리스트</div>
    <button @click="onAddRowGrid">추가</button>
    <button @click="onRemoveSelectedGrid">삭제</button>
  </div>
  <div class="grid_default3">
    <ag-grid-vue 
      style="width: 100%; height: 100%" 
      class="ag-theme-alpine" 
      :headerHeight=35 
      :rowHeight=50
      :columnDefs="columnDefs" 
      :rowData="gridRowData" 
      :defaultColDef="defaultColDef" 
      :doubleClickEdit="true"
      :undoRedoCellEditing="true" 
      :undoRedoCellEditingLimit="20" 
      :suppressChangeDetection="true"
      :applyTransaction="onAddRowGrid"
      :localeText="localeText" 
      @grid-ready="onGridReady"
      :stopEditingWhenCellsLoseFocus="true">
    </ag-grid-vue>
  </div>
</template>
  
<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { ref, onBeforeMount, defineProps, onMounted, defineEmits, defineExpose, getCurrentInstance } from 'vue';
import authMgmtService from '@/api/services/sys/auth-mgmt-service';

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const props = defineProps(["authList"]);
const emit = defineEmits(["update"]);

let gridApi;

const gridRowData = ref([]);
const rowData = [];

const localeText = { noRowsToShow: "조회 결과가 없습니다." };


const stdClsMappings = {
  'T2201': '본사',
  'T2202': '현장',
  'T2203': '협력회사'
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}

const stdClsCds = extractKeys(stdClsMappings);

function lookupValue(mappings, key) {
    return mappings[key];
}

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 2,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
};

const columnDefs = [
  {
    headerName: "권한명", field: "authNm", filter: false, cellStyle: { textAlign: "center" }, editable: true, width: 500, maxWidth: 500, checkboxSelection: true
  },
  {
    headerName: "구분", field: "authClsCd", editable: true,
    width: 110,
    filter: true,
    cellStyle: { textAlign: "center" },
    cellEditor: 'agSelectCellEditor',
    // cellEditorParams: {
    //   values: stdClsCds,
    // },
    cellEditorParams: params => {
      return {values : stdClsCds }
    },
    
    valueFormatter: (params) => {
      return lookupValue(stdClsMappings, params.value);
    },
  },
];




function onGridReady(params) {
  gridApi = params.api;
  //params.api.sizeColumnsToFit();
}

// function isCellEditable(params) {
//   return params.data.mode === "I";
// }

const drawGrid = async () => {
  await props.authList.forEach((item, index) => {
    const data = ref({});
    data.vendrCd = item.vendrCd;
    data.authCd = item.authCd;
    data.authClsCd = item.authClsCd;
    data.authNm = item.authNm;
    data.bsAuthYn = item.bsAuthYn;
    data.mode = "U";
    data.regId = $loginStore.$state.userInfo.userId;
    data.modId = $loginStore.$state.userInfo.userId;
    rowData.push(data);
  })
  gridRowData.value = rowData;
  //emit("update", gridRowData.value);
}

// 그룹코드 추가
function onAddRowGrid() {
  const seq = ref();
  //const len = gridRowData.value.length;
  const len = gridApi.getRenderedNodes().length;
  if (len > 0) {
    seq.value = String(Number(gridApi.getRenderedNodes()[len - 1].data.authCd) + 1000);  
  } else {
    seq.value = "1000";
  }
  var addRow = [{ "mode": "I", "vendrCd": $loginStore.$state.userInfo.vendrCd, "authCd": seq.value, "authClsCd": "T2201", "authNm": "", "regId": $loginStore.$state.userInfo.userId, "modId": $loginStore.$state.userInfo.userId }];
  gridApi.applyTransaction({ add: addRow });
  gridApi.redrawRows();
}

//그룹코드 삭제
async function onRemoveSelectedGrid() {
  var selectedData = gridApi.getSelectedRows();
  const seq = ref();
  const len = gridRowData.value.length;
  seq.value = String(Number(gridRowData.value[len - 1].authCd) + 1000);

  if (selectedData.length == 0) {
    alert("삭제할 권한을 선택해 주세요.");
    return;
  }

  // 기본권한여부인 경우 삭제 불가
  if(selectedData[0].bsAuthYn == "Y"){
    alert("기본 권한은 삭제 불가능합니다.");
    return false;
  } 

  if (selectedData[0].authCd == seq.value) {
    gridApi.applyTransaction({ remove: selectedData });
  } else {
    if (confirm("해당 권한을 삭제하시겠습니까?")) {
      try {
        const list = [];
        selectedData[0].mode = "D";
        const value = {
          "mode": selectedData[0].mode,
          "vendrCd": selectedData[0].vendrCd,
          "authCd": selectedData[0].authCd,
        };
        list.push(value);
        const params = JSON.stringify(list);
        const res = await authMgmtService.updateAuth(params);  

        if (res.status == 200 || res.data.status == 200) {
          alert("정상적으로 처리하였습니다.");
          location.reload();

        } else {
          alert(res.data.message);
          return;
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
      

    }
  }

}


const gridData = () => {
  const gData = [];
  gridApi.forEachNode(item => {
    const node = {};
    node.mode = item.data.mode;
    node.vendrCd = $loginStore.$state.userInfo.vendrCd;
    node.authCd = item.data.authCd;
    node.authClsCd = item.data.authClsCd;
    node.authNm = item.data.authNm;
    node.regId = item.data.regId;
    node.modId = item.data.modId;
    gData.push(node);
  })
  gridApi.setRowData(gData);
  return gData;
}

defineExpose({
  gridData,
})

onBeforeMount(() => {

})

onMounted(() => {
  drawGrid();
})



</script>
  
  
<style scoped>
.grid_default3 {
  height: calc(100% - 40px);
}
</style>