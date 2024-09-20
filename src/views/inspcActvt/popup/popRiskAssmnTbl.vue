<!-- 안전점검활동/위험성평가 -->

<template>
  <compModal
    modalTitle="위험성평가 상세정보"
    @close="popupClose"
    maxModalWidth="95%"
    modalWidth="95%">
    <div class="text-right pt-2 pr-2">
      <comp-button @click="reportView" text="출력" type="print"></comp-button>
    </div>
    <div class="grid_default2" id="grid">
      <ag-grid-vue
        v-if="gridReady"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :gridOptions="gridOptions"
        :rowData="gridRowData">
      </ag-grid-vue>
    </div>

    <!-- 중점점검활동 조치 팝업 -->
    <popInspectionAppr
      v-if="isApprModalOpen"
      @close="closeApprModal"
      :rowParams="sftAtvtActParams"
      :key="sftAtvtActParams"
      title="중점점검 조치">
    </popInspectionAppr>
  </compModal>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { defineEmits, defineExpose, onBeforeMount, onMounted, ref } from "vue";

import compModal from "@/components/modal/compModal.vue";
import popInspectionAppr from "@/views/safeActvt/popInspectionAppr.vue";

import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const reportUrl = import.meta.env.VITE_APP_REPORT_DEV_URL;
const fileDiv = import.meta.env.VITE_APP_ENV_FILE_NAME;

const props = defineProps({
  siteInfo: {},
  popRiskAssmnTblParams: {
    type: Object,
    default: () => {},
  },
  isPopRiskAssmnTbl: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);

const store = useRiskAssessmentStore();
const standReglStore = useStandReglStore();
const cdMgmtStore = useCdMgmtStore();

const gridApi = ref();
const gridColumnApi = ref();
const contyCdList = ref([]);
const riskLvlList = ref([]);
const siteExeRuleStd = ref([]);
const dsstrStleCdList = ref([]);

const saveFileCnt = ref(0);
const basicInfo = ref([]);

const sftAtvtActParams = ref({});

const columnDefs = [
  {
    headerName: "",
    field: "treeCell",
    width: 0,
    cellRenderer: "treeCellRenderer",
  },
  {
    headerName: "공종",
    field: "contyCd",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    valueFormatter: (params) => {
      return getContyNm(params.value);
    },
  },
  {
    headerName: "작업명",
    field: "wrkNmCd",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 300,
    valueFormatter: (params) => {
      return params.data.wrkNm;
    },
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    cellStyle: (params) => {
      return checkChildMismatch(params, "rigth");
    },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: false,
    minWidth: 500,
    cellEditorParams: {
      maxLength: 600,
    },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      if (params.value) {
        eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");
      }

      return eDiv;
    },
  },
  {
    headerName: "위험등급",
    field: "riskPrsmpGrd",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 90,
  },
  {
    headerName: "재해형태",
    field: "dsstrStleCd",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      const codes = {};
      dsstrStleCdList.value.forEach((item) => {
        codes[item.comCd] = item.comCdNm;
      });

      return { values: extractKeys(codes) };
    },
    valueFormatter: (params) => {
      const codes = {};
      dsstrStleCdList.value.forEach((item) => {
        codes[item.comCd] = item.comCdNm;
      });

      return lookupValue(codes, params.value);
    },
  },
  {
    headerName: "감소대책",
    field: "rskMsr",
    cellStyle: (params) => {
      return checkChildMismatch(params, "rigth");
    },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: false,
    minWidth: 500,
    cellEditorParams: {
      maxLength: 4000,
    },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      if (params.value) {
        eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");
      }

      return eDiv;
    },
  },
  {
    headerName: "작업위치",
    field: "wrkLoc",
    cellStyle: (params) => {
      return checkChildMismatch(params, "rigth");
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 200,
  },
  {
    headerName: "작업인원",
    field: "psnNum",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 90,
    cellEditor: "agNumberCellEditor",
    cellEditorParams: {
      min: 1,
      precision: 0,
    },
  },
  {
    headerName: "위험물",
    field: "hrmrskMtr",
    cellStyle: (params) => {
      return checkChildMismatch(params, "rigth");
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 200,
  },
  {
    headerName: "추가위험구분",
    field: "dscvTypeNm",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    editable: false,
    width: 120,
    valueFormatter: (params) => {
      return !params.value ? "-" : params.value;
    },
  },
  {
    headerName: "작성자",
    field: "userId",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    valueFormatter: (params) => {
      return params.data.userNm;
    },
  },
  {
    headerName: "조치예정일",
    field: "actExptDt",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 150,
    cellEditor: "agDateStringCellEditor",
    cellEditorParams: {
      max: "9999-12-31",
    },
  },
  {
    headerName: "조치담당자",
    field: "actMngr",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 130,
    valueFormatter: (params) => {
      return params.data.actMngrNm;
    },
  },
  {
    headerName: "조치상태/조치일시",
    field: "actStats",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 180,
    cellRenderer: (params) => {
      if (!params.data.actStatsNm) return;
      let actDt = params.data.actDt ? params.data.actDt : "";
      const eDiv = document.createElement("div");
      eDiv.style.lineHeight = "150%";
      eDiv.innerHTML = `${params.data.actStatsNm}<br/>${actDt}`;
      return eDiv;
    },
    onCellClicked: (params) => {
      const reqParams = {
        vendrCd: params.data.vendrCd,
        siteCd: params.data.siteCd,
        inspCls: params.data.inspCls,
        inspSeq: params.data.inspSeq,
        inspDt: params.data.inspDt,
        actSeq: params.data.actSeq,
      };

      if (params.data.inspSeq) {
        inspectionAction(reqParams);
      }

      // alert("안전점검조치 팝업 띄우기" + JSON.stringify(reqParams));
    },
  },
  {
    headerName: "검토의견",
    field: "rvwOpnn",
    cellStyle: (params) => {
      return checkChildMismatch(params, "rigth");
    },
    cellEditor: "agLargeTextCellEditor",
    wrapText: true,
    autoHeight: true,
    editable: false,
    cellEditorParams: {
      maxLength: 300,
    },
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      if (params.value) {
        eDiv.innerHTML = params.value.replaceAll("\n", "<br/>");
      }
      return eDiv;
    },
  },
  {
    headerName: "수정체크",
    field: "isEditable",
    hide: true,
  },
  {
    headerName: "위험성평가 방법 코드",
    field: "riskEvalMthdCd",
    hide: true,
  },
  {
    headerName: "위험성 수준 판단법 코드",
    field: "riskLvlJdgmntCd",
    hide: true,
  },
  {
    headerName: "이전테이터확인",
    field: "childrenYn",
    hide: true,
  },
];
const riskPrsmpGrdIdx = columnDefs.findIndex(
  (column) => column.field === "riskPrsmpGrd"
);
// 위험성 수준 판단법에 따른 위험성결정 컬럼 제어
// ( T0501(상중하법), T0502(빈도강도(3X3)), T0503(빈도강도법(5X5)) )
if (siteExeRuleStd.value.riskLvlJdgmntCd === "T0501") {
  const riskDecision = {
    headerName: "위험성결정",
    field: "rst",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 110,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      return {
        values: extractKeys(getRiskEvalCodes(0))
          .map(Number)

          .sort((a, b) => b - a),
      };
    },
    valueFormatter: (params) => {
      return lookupValue(getRiskEvalCodes(0), params.value);
    },
  };

  columnDefs.splice(riskPrsmpGrdIdx, 0, riskDecision);
} else {
  const count = siteExeRuleStd.value.riskLvlJdgmntCd === "T0502" ? 3 : 5;

  const riskDecision = {
    headerName: "위험성결정",
    children: [
      {
        headerName: "빈도",
        field: "freq",
        cellStyle: (params) => {
          return checkChildMismatch(params);
        },
        wrapText: true,
        autoHeight: true,
        cellEditor: "agSelectCellEditor",
        editable: (params) => chkEditable(params),
        width: 90,
        cellEditorParams: (params) => {
          return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
        },
        valueFormatter: (params) => {
          return lookupValue(getRiskEvalCodes(count), params.value);
        },
      },
      {
        headerName: "강도",
        field: "strngth",
        cellStyle: (params) => {
          return checkChildMismatch(params);
        },
        wrapText: true,
        autoHeight: true,
        editable: (params) => chkEditable(params),
        width: 90,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: (params) => {
          return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
        },
        valueFormatter: (params) => {
          return lookupValue(getRiskEvalCodes(count), params.value);
        },
      },
      {
        headerName: "결과",
        field: "rst",
        cellStyle: (params) => {
          return checkChildMismatch(params);
        },
        wrapText: true,
        autoHeight: true,
        editable: false,
        width: 90,
      },
    ],
  };

  columnDefs.splice(riskPrsmpGrdIdx, 0, riskDecision);
}

function extractKeys(mappings) {
  return Object.keys(mappings);
}

function lookupValue(mappings, key) {
  return mappings[key];
}

const getRiskEvalCodes = (count) => {
  let codes = {};

  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      codes[i] = i;
    }
  } else {
    codes = {
      3: "상",
      2: "중",
      1: "하",
    };
  }

  return codes;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const onGridReady = (params) => {
  doSearch();
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;

  // 위험성평가 목록의 상태값이 미작성, 작성중인 경우 검토의견 컬럼 hide
  if (["T1305", "T1306", "T1307"].includes(basicInfo.value.statsCd)) {
    hideColumnByField(params.columnApi, "conOpn");
  }
};

// Gird의 특정 컬럼의 필드를 찾아 숨기는 함수
function hideColumnByField(columnApi, field) {
  const column = columnApi.getColumn(field); // 필드로 컬럼을 찾음

  if (column) {
    columnApi.setColumnVisible(field, false);
  }
}

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 0,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const gridOptions = {
  headerHeight: 40,
  rowHeight: 57,
  defaultColDef: defaultColDef,
  columnDefs: columnDefs,
  singleClickEdit: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  localeText: localeText,
  stopEditingWhenCellsLoseFocus: true,
  suppressCellFocus: true,
  components: { treeCellRenderer: TreeCellRenderer },
  rowClassRules: {
    childrenRow: (params) => {
      return params.data.childrenYn === "Y";
    },
    editRow: (params) => {
      return params.data.isEditable;
    },
  },
  onGridReady: onGridReady,
  onCellValueChanged: cellValueChanged,
};

function cellValueChanged(e) {
  const changedCellId = e.colDef.field;

  if (["freq", "strngth"].includes(changedCellId)) {
    // 안전하게 숫자로 변환 가능한지 확인
    const freq = parseFloat(e.node.data.freq);
    const strngth = parseFloat(e.node.data.strngth);

    // 둘 다 유효한 숫자인 경우에만 계산 및 업데이트 수행
    if (!isNaN(freq) && !isNaN(strngth)) {
      // 빈도 + 강도의 합계
      const sum = freq * strngth;
      let riskPrsmpGrd = "-";

      const foundRiskLvl = riskLvlList.value.find((item) => {
        return item.riskPrsmpFqinSt <= sum && sum <= item.riskPrsmpFqinEn;
      });

      if (foundRiskLvl) {
        riskPrsmpGrd = foundRiskLvl.risk;
      }

      e.node.data.rst = sum;
      e.node.data.riskPrsmpGrd = riskPrsmpGrd;
    }
  }

  // 상중하법인 경우 위험등급 변경
  if (["rst"].includes(changedCellId)) {
    const foundRiskLvl = riskLvlList.value.find((item) => {
      return parseInt(item.riskDcsCls) === e.node.data.rst;
    });

    e.node.data.riskPrsmpGrd = foundRiskLvl.risk;
  }

  // 그리드 업데이트
  gridApi.value.applyTransaction({
    update: [e.node.data],
  });
}

const gridRowData = ref([]);
const riskAssmnTblList = ref([]);
const gridReady = ref(false);

// 초기화
const init = async () => {
  const commonParams = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 공사종류 코드목록 조회
  contyCdList.value = await store.fetchContyCdList(commonParams);

  // 현장 실시 규정 표준 평가 절차 방법 조회
  riskLvlList.value = await standReglStore.riskLvlList(commonParams);

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(commonParams);

  // 재해형태 공통코드 조회
  dsstrStleCdList.value = await cdMgmtStore.fetchComCodeList({ comCd: "T20" });
  console.log(dsstrStleCdList.value);
};

onBeforeMount(async () => {
  await init();
  gridReady.value = true;
});

onMounted(() => {});

const getSaveFileCnt = (cnt) => {
  saveFileCnt.value = cnt;
};

function getContyNm(contyCd) {
  const findContyCd = contyCdList.value.find(
    (item) => item.contyCd === contyCd
  );
  return !findContyCd ? "" : findContyCd.contyCdNm;
}

const popupClose = () => {
  emits("close");
};

function TreeCellRenderer() {}

const initTreeCellRenderer = (data) => {
  let showBlankForExpanded = true;
  const blankForExpandedObject = ref({});

  let idCount = 0;
  addIdInDataResurcive(data);

  let rowDataExpanded = [];
  function updateData(e) {
    const a = recursiveFindById(data, e);
    if (a) {
      a.expanded = !a.expanded;
      rowDataExpanded = [];
      makeDataResurcive(data, 0);
      gridOptions.api.setRowData(rowDataExpanded);
    }
  }

  function recursiveFindById(e, a) {
    let n = e.find((e) => e.customId === a);
    return n || (e.every((e) => !(n = recursiveFindById(e.childrens, a))), n);
  }

  function makeDataResurcive(e, a) {
    e.forEach((e) => {
      e.level = a;
      if (e.childrens.length > 0 && e.expanded && showBlankForExpanded) {
        e = { ...e, ...blankForExpandedObject };
      }
      rowDataExpanded.push(e);
      if (e.expanded) {
        makeDataResurcive(e.childrens, a + 20);
      }
    });
  }

  function addIdInDataResurcive(e) {
    e.forEach((e) => {
      e.customId = idCount;
      idCount++;
      addIdInDataResurcive(e.childrens);
    });
  }

  TreeCellRenderer.prototype.init = function (e) {
    this.eGui = document.createElement("span");
    this.eGui.style = `padding-left:${e.data.level}px`;
    if (e.data.childrens.length > 0) {
      this.eGui.innerHTML = e.data.expanded
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 20 20" style="vertical-align: middle;">
    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"></path>
  </svg> `
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 20 20" style="vertical-align: middle;">
    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
  </svg> `;
    }
    this.eventListener = function () {
      updateData(e.data.customId);
    };

    if (e.data.childrens.length > 0) {
      this.eGui.addEventListener("click", this.eventListener);
    }
  };

  TreeCellRenderer.prototype.getGui = function () {
    return this.eGui;
  };
};

function checkChildMismatch(params, dynamicTextAlign = "center") {
  const baseStyle = {
    justifyContent: dynamicTextAlign,
    alignItems: "baseline",
  };
  const fieldName = params.colDef.field;
  const { childrens, childrenYn } = params.data;

  if (
    childrens.length > 0 &&
    !childrenYn &&
    params.value !== childrens[0][fieldName]
  ) {
    return { ...baseStyle, color: "blue" };
  }

  return baseStyle;
}

const doSearch = async () => {
  basicInfo.value = props.popRiskAssmnTblParams.data;

  // "위험성결정" 헤더를 가진 열을 찾기
  const columnIndexToRemove = columnDefs.findIndex(
    (column) => column.headerName === "위험성결정"
  );

  // 해당 열이 존재할 경우 삭제
  if (columnIndexToRemove !== -1) {
    columnDefs.splice(columnIndexToRemove, 1);
  }

  // 위험성 수준 판단법에 따른 위험성결정 컬럼 제어
  // ( T0501(상중하법), T0502(빈도강도(3X3)), T0503(빈도강도법(5X5)) )
  if (siteExeRuleStd.value.riskLvlJdgmntCd === "T0501") {
    const riskDecision = {
      headerName: "위험성결정",
      field: "rst",
      cellStyle: (params) => {
        return checkChildMismatch(params);
      },
      wrapText: true,
      autoHeight: true,
      editable: (params) => chkEditable(params),
      width: 110,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return {
          values: extractKeys(getRiskEvalCodes(0))
            .map(Number)

            .sort((a, b) => b - a),
        };
      },
      valueFormatter: (params) => {
        return lookupValue(getRiskEvalCodes(0), params.value);
      },
    };

    columnDefs.splice(riskPrsmpGrdIdx, 0, riskDecision);
  } else {
    const count = siteExeRuleStd.value.riskLvlJdgmntCd === "T0502" ? 3 : 5;

    const riskDecision = {
      headerName: "위험성결정",
      children: [
        {
          headerName: "빈도",
          field: "freq",
          cellStyle: (params) => {
            return checkChildMismatch(params);
          },
          wrapText: true,
          autoHeight: true,
          cellEditor: "agSelectCellEditor",
          editable: (params) => chkEditable(params),
          width: 90,
          cellEditorParams: (params) => {
            return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
          },
          valueFormatter: (params) => {
            return lookupValue(getRiskEvalCodes(count), params.value);
          },
        },
        {
          headerName: "강도",
          field: "strngth",
          cellStyle: (params) => {
            return checkChildMismatch(params);
          },
          wrapText: true,
          autoHeight: true,
          editable: (params) => chkEditable(params),
          width: 90,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: (params) => {
            return { values: extractKeys(getRiskEvalCodes(count)).map(Number) };
          },
          valueFormatter: (params) => {
            return lookupValue(getRiskEvalCodes(count), params.value);
          },
        },
        {
          headerName: "결과",
          field: "rst",
          cellStyle: (params) => {
            return checkChildMismatch(params);
          },
          wrapText: true,
          autoHeight: true,
          editable: false,
          width: 90,
        },
      ],
    };

    columnDefs.splice(riskPrsmpGrdIdx, 0, riskDecision);
  }

  gridOptions.api.setColumnDefs(columnDefs);

  const params = {
    vendrCd: basicInfo.value.vendrCd,
    siteCd: basicInfo.value.siteCd,
    contyCd: basicInfo.value.contyCd,
    evalType: basicInfo.value.evalType,
    evalSeq: basicInfo.value.evalSeq,
  };

  // 위험성평가 목록 조회
  riskAssmnTblList.value = await store.fetchRiskAssmnTblList(params);

  gridRowData.value = riskAssmnTblList.value;

  gridRowData.value.forEach((row) => {
    row.riskEvalMthdCd = siteExeRuleStd.value.riskEvalMthdCd;
    row.riskLvlJdgmntCd = siteExeRuleStd.value.riskLvlJdgmntCd;
  });

  initTreeCellRenderer(gridRowData.value);
};

defineExpose({
  doSearch,
});

// 중점점검활동 조치 팝업 열기
function inspectionAction(params) {
  const getRow = params;
  sftAtvtActParams.value = getRow;

  openApprModal();
}

// 레포트 출력 함수
const reportView = () => {
  if (gridRowData.value.length == 0) {
    alert("등록된 위험성 평가 내역이 없습니다.");
    return;
  }

  let link = document.createElement("a");
  let url = reportUrl + "/view/report1.jsp?";
  let param =
    "crfName=" +
    "inspcActvt/riskAssmnCnfrnConty" +
    "&vendrCd=" +
    basicInfo.value.vendrCd +
    "&siteCd=" +
    basicInfo.value.siteCd +
    "&evalType=" +
    basicInfo.value.evalType +
    "&evalSeq=" +
    basicInfo.value.evalSeq +
    "&contyCd=" +
    basicInfo.value.contyCd +
    "&fileDiv=" +
    fileDiv;

  link.href = url + param;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

// 조치내역 Modal
const isApprModalOpen = ref(false);
const openApprModal = () => {
  isApprModalOpen.value = true;
};
const closeApprModal = () => {
  isApprModalOpen.value = false;
};
</script>

<style scoped>
#grid {
  height: calc(100% - 36px);
  padding-top: 0;
}
</style>

<style>
.childrenRow {
  color: gray;
}

/* .editRow {
  font-weight: bold;
  background-color: #c5ba1e;
} */

.inpection_appr {
  width: 60%;
  height: 60%;
}
</style>
