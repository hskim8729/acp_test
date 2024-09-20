<template>
  <div class="subtitle_area">
    <div class="title">1. 템플릿 선택</div>
    <div class="right_btn">
      <button @click="onDownloadClick">엑셀 탬플릿 다운로드</button>
      <button @click="addTemplate">새로운 템플릿 만들기</button>
    </div>
  </div>
  <div class="grid_default" id="grid01">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :headerHeight="40"
      :rowHeight="53"
      :columnDefs="columnStdList"
      :rowData="templateList"
      :defaultColDef="defaultColDef"
      :undoRedoCellEditing="true"
      :undoRedoCellEditingLimit="20"
      :localeText="localeText"
      @grid-ready="onGridReady"
      rowSelection="single"
      :stopEditingWhenCellsLoseFocus="true">
    </ag-grid-vue>
  </div>
  <input
    type="file"
    @change="handleFileUpload"
    ref="fileInput"
    style="display: none" />
</template>

<script setup>
import { useDialogStore } from "@/stores/common/dialog-store";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import riskFactorStandardService from "../../../api/services/stdMgmt/risk-factor-standard-service.js";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";

const store = useRiskFactorStandardStore();
const dialogStore = useDialogStore();
const {
  templateList,
  vendrCd,
  selectedVenderCd,
  selectedHrmrskFctrMstSeq,
  selectedLgCatCd,
  selectedLgCatNm,
  selectedMdCatCd,
  selectedMdCatNm,
  selectedWrkNmCd,
} = storeToRefs(store);

const { defaultColDef, localeText } = defineProps([
  "defaultColDef",
  "localeText",
]);

// 파일업로드
const fileInput = ref(null);
let file = ref(null);
const tempSeq = ref("");

// 파일 업로드
async function onUploadClicked(event) {
  await onTemplateClicked(event);
  // 공단 표준은 업로드 못하게 막기
  if (event.data.vendrCd !== vendrCd.value) {
    return;
  }

  dialogStore.openConfirmDialog("기존자료는 삭제됩니다. 업로드 하시겠습니까?", {
    confirmCallback: async () => {
      tempSeq.value = event.data.hrmrskFctrMstSeq;
      fileInput.value.click();
    },
  });
}

async function handleFileUpload() {
  let formData = new FormData();

  // Create a param object
  let param = {
    vendrCd: vendrCd.value,
    hrmrskFctrMstSeq: tempSeq.value,
  };

  // Convert the param object to a JSON string
  let paramJson = JSON.stringify(param);

  // Convert the JSON string to a Blob
  let paramBlob = new Blob([paramJson], { type: "application/json" });

  // Add paramBlob and file to formData
  formData.append("param", paramBlob);
  if (fileInput.value.files.length > 0) {
    formData.append("file", fileInput.value.files[0]);
    try {
      const res = await riskFactorStandardService.uploadExcelTemplate(formData);
      if (res.svrMessage) {
        dialogStore.openAlertDialog(res.svrMessage);
      } else {
        // 업로드 후 업로드 결과 보여주기
        store.fetchLgCatList(param).then((lgList) => {
          if (lgList.length > 0) {
            param.lgCatCd = lgList[0].lgCatCd;
            selectedLgCatCd.value = lgList[0].lgCatCd;
            selectedLgCatNm.value = lgList[0].lgCatNm;
            store.fetchMdCatList(param);
          }
        });
      }
    } catch (error) {
      console.log("엑셀 파일 업로드 에러 : ", error);
    }
  } else {
    console.error("No file selected", fileInput);
  }
}

const columnStdList = ref([
  {
    headerName: "구분",
    field: "stdClsCd",
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 200,
    valueFormatter: classFormatter,
  },
  {
    headerName: "표준명",
    field: "stdNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: (params) => params.data.vendrCd == vendrCd.value,
    width: 200,
    maxWidth: 400,
    onCellClicked: onTemplateClicked,
    onCellValueChanged: onStdValueChanged,
  },
  {
    headerName: "설명",
    field: "stdDc",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: (params) => params.data.vendrCd == vendrCd.value,
    width: 500,
    maxWidth: 1000,
    onCellClicked: onTemplateClicked,
    onCellValueChanged: onStdValueChanged,
  },
  {
    headerName: "",
    field: "std",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    onCellClicked: onStdClicked,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      if (params.data.stdClsCd === "T2101") {
        eDiv.innerHTML = '<button class="cell_btn">복사 및 수정</button>';
      } else {
        eDiv.innerHTML = '<button class="cell_btn">템플릿 복사</button>';
      }
      return eDiv;
    },
  },
  {
    headerName: "",
    field: "upload",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 100,
    onCellClicked: onUploadClicked,
    cellRenderer: (params) => {
      if (params.data.stdClsCd === "T2101") {
        return;
      } else {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="cell_btn">엑셀 업로드</button>';
        return eDiv;
      }
    },
  },
  {
    headerName: "",
    field: "del",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 60,
    maxWidth: 60,
    onCellClicked: onDelClicked,
    cellRenderer: (params) => {
      if (params.data.stdClsCd === "T2101") {
        return;
      } else {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="del"></button>';
        return eDiv;
      }
    },
  },
]);

const gridApi = ref();
const onGridReady = (params) => {
  gridApi.value = params.api;
};

onBeforeMount(async () => {
  // 템플릿 리스트 불러오고 첫번째 템플릿 선택해서 보여줌
  const templateListParam = {
    vendrCd: vendrCd.value,
  };
  const templateList = await store.fetchTemplateList(templateListParam);
  selectedVenderCd.value = templateList[0].vendrCd;
  selectedHrmrskFctrMstSeq.value = templateList[0].hrmrskFctrMstSeq;
  // 첫번째 행 선택
  gridApi.value.forEachNode((node) => {
    if (node.rowIndex === 0) {
      node.setSelected(true);
    }
  });
});

// 템플릿 선택시
async function onTemplateClicked(event) {
  if (
    selectedVenderCd.value !== event.data.vendrCd ||
    selectedHrmrskFctrMstSeq.value !== event.data.hrmrskFctrMstSeq
  ) {
    selectedVenderCd.value = event.data.vendrCd;
    selectedHrmrskFctrMstSeq.value = event.data.hrmrskFctrMstSeq;
    selectedLgCatCd.value = "";
    selectedMdCatCd.value = "";
    selectedWrkNmCd.value = "";
  }
}

// 템플릿 분류(공단표준, 사용자정의, 전사표준) 포맷터
function classFormatter(params) {
  return params.data?.stdClsNm;
}

// 셀 내용 수정
async function onStdValueChanged(event) {
  if (event.data.stdNm && event.data.stdDc) {
    const params = {
      mode: "U",
      bsSltYn: event.data.bsSltYn,
      hrmrskFctrMstSeq: event.data.hrmrskFctrMstSeq,
      stdNm: event.data.stdNm,
      stdDc: event.data.stdDc,
    };
    await store.fetchTemplate(params, false);
  } else {
    dialogStore.openAlertDialog("빈칸을 입력할 수 없습니다.");
    const colId = event.column.colId;
    const rowNode = gridApi.value.getRowNode(event.node.id);
    rowNode.setDataValue(colId, event.oldValue);
  }
}

// 셀 선택
async function onStdClicked(event) {
  await doDuplicate(event);
}

async function doDuplicate(event) {
  const params = {
    mode: "DUP",
    hrmrskFctrMstSeq: event.data.hrmrskFctrMstSeq,
    selectedVendrCd: event.data.vendrCd,
  };
  await store
    .fetchTemplate(params)
    .then(
      // 템플릿 복제 후 복제된 템플릿 선택
      (templateList) => {
        let len = templateList.length;
        selectedVenderCd.value = vendrCd.value;
        selectedHrmrskFctrMstSeq.value = templateList[len - 1].hrmrskFctrMstSeq;
        gridApi.value.forEachLeafNode((node) => {
          if (node.id === (len - 1).toString()) {
            node.setSelected(true);
            gridApi.value.ensureIndexVisible(node.rowIndex, "middle");
          }
        });
      }
    )
    .catch((error) => {
      console.error(error);
    });
}

// 삭제
async function onDelClicked(event) {
  if (event.data.stdClsCd !== "T2101") {
    dialogStore.openConfirmDialog(
      "사용자 정의 위험요인 표준 템플릿을 삭제 하시겠습니까?",
      {
        confirmCallback: async () => {
          const params = {
            mode: "D",
            hrmrskFctrMstSeq: event.data.hrmrskFctrMstSeq,
          };
          await store
            .fetchTemplate(params)
            .then(
              // 템플릿 삭제 후 처음 템플릿 선택
              (templateList) => {
                selectedVenderCd.value = templateList[0].vendrCd;
                selectedHrmrskFctrMstSeq.value =
                  templateList[0].hrmrskFctrMstSeq;

                gridApi.value.forEachLeafNode((node) => {
                  if (node.id === "0") {
                    node.setSelected(true);
                    gridApi.value.ensureIndexVisible(node.rowIndex, "middle");
                  }
                });
              }
            )
            .catch((error) => {
              console.error(error);
            });
        },
      }
    );
  }
}

const onDownloadClick = async () => {
  const res = await riskFactorStandardService.downloadExcelTemplate();
  let link = document.createElement("a");
  let url = URL.createObjectURL(res.data);
  link.href = url;
  link.download = "위험요인표준관리_엑셀_템플릿.xlsx";
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

// 템플릿 추가
const addTemplate = async () => {
  const params = {
    mode: "I",
  };

  await store
    .fetchTemplate(params)
    .then(
      // 템플릿 추가 후 추가된 템플릿 선택
      (templateList) => {
        const len = templateList.length;
        selectedVenderCd.value = templateList[len - 1].vendrCd;
        selectedHrmrskFctrMstSeq.value = templateList[len - 1].hrmrskFctrMstSeq;
        gridApi.value.forEachLeafNode((node) => {
          if (node.id === (len - 1).toString()) {
            node.setSelected(true);
            gridApi.value.ensureIndexVisible(node.rowIndex, "middle");
          }
        });
      }
    )
    .catch((error) => {
      console.error(error);
    });
};
</script>

<style scoped>
#grid01 {
  float: left;
  width: 100%;
  height: 230px;
  margin-bottom: 30px;
}

.ag-theme-alpine {
  float: left;
}
</style>
