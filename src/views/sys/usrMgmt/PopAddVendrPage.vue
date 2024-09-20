<!-- 시스템 / 사용자 관리 / 협력회사 추가 -->

<template>
  <div class="subtitle_area">
    <!-- <div class="title">협력사 리스트</div> -->
    <button @click="onAddRowGrid">추가</button>
    <button @click="onRemoveSelectedGrid">삭제</button>
  </div>
  <div class="grid_default">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :headerHeight="35"
      :rowHeight="50"
      :columnDefs="columnDefs"
      :rowData="gridRowData"
      :defaultColDef="defaultColDef"
      :undoRedoCellEditing="true"
      :undoRedoCellEditingLimit="20"
      :suppressChangeDetection="true"
      :applyTransaction="onAddRowGrid"
      :localeText="localeText"
      :onCellEditingStopped="regexBusNo"
      @grid-ready="onGridReady"
      :stopEditingWhenCellsLoseFocus="true">
    </ag-grid-vue>
  </div>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import {
  ref,
  onBeforeMount,
  defineProps,
  onMounted,
  defineEmits,
  defineExpose,
  getCurrentInstance,
} from "vue";
import usrMgmtService from "@/api/services/sys/usr-mgmt-service";
import partnerMgmtService from "@/api/services/sys/partner-mgmt-service";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const props = defineProps(["partnerList"]);
const emit = defineEmits(["update"]);

let gridApi;

const gridRowData = ref([]);
const rowData = [];

let arryBusNo = [];
// push 된 사업자 번호
let arryBusNoPush = [];

let validBusNo = ref(false);

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 2,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const columnDefs = [
  {
    headerName: "회사명",
    field: "vendrNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 500,
    checkboxSelection: true,
  },
  {
    headerName: "사업자 번호",
    field: "busNo",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: true,
    width: 500,
    maxWidth: 500,
    cellRenderer: (params) => {
      if (isNaN(Number(params.value))) {
        return params.value.replace(/[^0-9\.]+/g, "");
      } else {
        return (
          params.value.substring(0, 3) +
          "-" +
          params.value.substring(3, 5) +
          "-" +
          params.value.substring(5)
        );
      }
    },
    cellEditorParams: { maxLength: 10 },
  },
  {
    headerName: "활성여부",
    field: "actvYn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 300,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      if (params.data.actvYn == "N")
        eDiv.innerHTML =
          '<div class="switch off"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      else
        eDiv.innerHTML =
          '<div class="switch on"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      const eButton = eDiv.querySelectorAll(".click_area")[0];

      eButton.onclick = function (event) {
        if (event.target.parentElement.classList.contains("on")) {
          event.target.parentElement.classList.replace("on", "off");
          params.data.actvYn = "N";
        } else {
          event.target.parentElement.classList.replace("off", "on");
          params.data.actvYn = "Y";
        }
        params.data.grid1 = true;
      };

      return eDiv;
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
  await props.partnerList.forEach((item, index) => {
    if (item.vendrCd != $loginStore.$state.userInfo.vendrCd) {
      const data = ref({});
      data.mode = "U";
      data.vendrUpperCd = $loginStore.$state.userInfo.vendrCd;
      data.vendrCd = item.vendrCd;
      data.vendrNm = item.vendrNm;
      data.busNo = item.busNo;
      data.ptnrYn = item.ptnrYn;
      data.actvYn = item.actvYn;
      data.modId = $loginStore.$state.userInfo.userId;
      rowData.push(data);
    }
  });
  gridRowData.value = rowData;
  //emit("update", gridRowData.value);
};

async function regexBusNo(params) {
  if (params.column.colId == "busNo") {
    let busNoChk = arryBusNo.indexOf(params.value);

    if (busNoChk != -1) {
      if (params.value != "" || params.value != null) {
        arryBusNo.push(params.value);
      }
      alert("중복되는 사업자 번호가 존재합니다.");
      params.data.busNo = "";
      validBusNo.value = false;
      return;
    } else {
      if (params.value != "" || params.value != null) {
        arryBusNo.push(params.value);
      }
      const regex = /[^0-9]/g;
      const busNo = params.value;
      if (busNo.replaceAll("-", "").length == 10 && !regex.test(busNo)) {
        const param = {
          vendrCd: $loginStore.$state.userInfo.vendrCd,
          busNo: busNo.replaceAll("-", ""),
        };
        try {
          const res = await partnerMgmtService.savePartnerMgmtChk(param);

          if (res.data) {
            alert("중복되는 사업자 번호가 존재합니다.");
            params.data.busNo = "";
            //validBusNo.value = false;
            return;
          }
          var valueMap = params.data.busNo
            .replace(/-/gi, "")
            .split("")
            .map(function (item) {
              return parseInt(item, 10);
            });
          var keyArr = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
          var chkSum = 0;

          for (var i = 0; i < keyArr.length; ++i) {
            chkSum += keyArr[i] * valueMap[i];
          }

          chkSum += parseInt((keyArr[8] * valueMap[8]) / 10, 10);
          if (Math.floor(valueMap[9]) !== (10 - (chkSum % 10)) % 10) {
            alert("유효하지 않은 사업자 번호입니다.");
            params.data.busNo = "";
            return;
          }
        } catch (err) {
          console.log("PartnerMgmtPage.vue > regexBusNo() > err : ", err);
          throw err;
        }
      } else {
        alert("사업자 번호를 정확히 입력하세요.");
        params.data.busNo = "";
        //validBusNo.value = false;
        return;
      }

      // if (!validBusNo.value) {
      //   alert("중복되는 사업자 번호가 존재합니다.");
      //   params.data.busNo = "";
      //   //validBusNo.value = false;
      //   return;
      // }
    }
  }
}

async function gridReset() {
  arryBusNo = [];
  gridRowData.value = [];
  gridApi.redrawRows();
}

// 그룹코드 추가
function onAddRowGrid() {
  const seq = ref();
  const len = gridRowData.value.length;
  if (len > 0) {
    seq.value = String(Number(gridRowData.value[len - 1].authCd) + 1000);
  } else {
    seq.value = "1000";
  }
  var addRow = [
    {
      mode: "I",
      vendrUpperCd: $loginStore.$state.vendrInfo.vendrCd,
      vendrNm: "",
      busNo: "",
      ptnrYn: "Y",
      actvYn: "Y",
      regId: $loginStore.$state.userInfo.userId,
      modId: $loginStore.$state.userInfo.userId,
    },
  ];
  gridApi.applyTransaction({ add: addRow });
}

//그룹코드 삭제
async function onRemoveSelectedGrid() {
  var selectedData = gridApi.getSelectedRows();

  if (selectedData.length == 0) {
    alert("삭제할 협력사를 선택해 주세요.");
    return;
  }

  if (selectedData[0].mode === "I") {
    gridApi.applyTransaction({ remove: selectedData });
  } else {
    try {
      const list = [];
      selectedData[0].mode = "D";
      const value = {
        mode: selectedData[0].mode,
        vendrNm: selectedData[0].vendrNm,
      };
      list.push(value);
      const params = JSON.stringify(list);
      const res = await usrMgmtService.updatePtnrVendr(params);

      if (res.status == 200 || res.data.status == 200) {
        drawGrid();
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

const gridData = () => {
  validBusNo.value = true;

  arryBusNo = [];

  const gData = [];
  gridApi.forEachNode((item) => {
    const node = {};
    node.mode = item.data.mode;
    node.vendrUpperCd = item.data.vendrUpperCd;
    node.vendrCd = item.data.vendrCd;
    node.vendrNm = item.data.vendrNm;

    if (item.data.busNo != "") {
      arryBusNo.push(item.data.busNo);
    } else {
      validBusNo.value = false;
    }
    node.busNo = item.data.busNo;
    node.ptnrYn = item.data.ptnrYn;
    node.actvYn = item.data.actvYn;
    node.regId = item.data.regId;
    node.modId = item.data.modId;
    gData.push(node);
  });
  gridApi.setRowData(gData);

  if (!validBusNo.value) {
    alert("사업자 번호를 정확히 입력하세요.");
    return;
  }
  if (gData[0].vendrNm == "") {
    alert("회사명을 입력하세요.");
    return;
  }

  return gData;
};

defineExpose({
  gridData,
  drawGrid,
  gridReset,
});

onBeforeMount(() => {});

onMounted(() => {
  //drawGrid();
});
</script>

<style scoped>
.grid_default {
  height: calc(100% - 40px);
}
</style>
