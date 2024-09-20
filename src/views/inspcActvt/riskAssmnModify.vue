<!-- 안전점검활동/위험성평가 -->

<template>
  <compPage title="위험성평가표">
    <template #toolbarBody>
      <comp-button
        type="save"
        text="저장"
        v-if="isShownBtn1 && isWritableUser"
        @click="saveRiskAssmn"
        class="mr-1"
        requiredAuth>
      </comp-button>
      <!-- 결재의견 팝업 -->
      <pop-appr-opnn
        :apprUserList="apprUserList"
        :crntApprOver="crntApprOver"
        :apprBtnNm="apprBtnNm"
        :key="apprUserList"
        @apprOpnn="saveApprMst"
        ref="apprOpnn"
        v-if="
          isShownBtn1 && isWritableUser && riskAssmnTblList.length > 0
        "></pop-appr-opnn>
      <comp-button
        text="승인요청취소"
        class="ml-1"
        v-if="isShownBtn2 && isWritableUser"
        @click="cancelApprMst">
      </comp-button>
      <comp-button
        text="승인취소"
        class="ml-1"
        v-if="isShownBtn3 && isWritableUser"
        @click="cancelApprMst2">
      </comp-button>
      <router-link to="/INSPC_ACTVT/riskAssmnMain">
        <comp-button type="list" text="목록" class="ml-1"></comp-button>
      </router-link>
    </template>
    <compPageCard isFillPage>
      <template #apprArea>
        <!-- 결재라인 컴포넌트 -->
        <apprLine
          v-if="riskAssmnTblList.length > 0"
          :apprUserParams="apprUserParams"
          :key="apprUserParams"
          @apprUserList="getApprUserList"
          @crntApprOver="getCrntApprOver"
          @prevApprOver="getPrevApprOver"></apprLine>
      </template>
      <template #subTitle>
        <span class="title">{{ titleNm }}</span>
      </template>
      <template #subTitleBody>
        <!-- 위험성평가 검토/승인 -->
        <button class="file_list_btn" @click="openPopFileAttach">
          예정공정표<label>{{ saveFileCnt }}</label>
        </button>
        <comp-button
          text="추가"
          class="ml-1"
          v-if="isShownBtn1 && isWritableUser"
          @click="addFactorStandard"
          requiredAuth>
        </comp-button>
      </template>
      <template #default>
        <comp-ag-grid
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="gridRowData"
          :gridOptions="gridOptions"
          :singleClickEdit="true"
          @get-grid-api="getGridApi">
        </comp-ag-grid>
      </template>
    </compPageCard>
  </compPage>

  <!-- 평가담당자 팝업 -->
  <pop-select-user
    v-if="isPopSelectUser"
    rowSelection="single"
    :menuId="route.meta.menuId"
    @close-modal="isPopSelectUser = false"
    @get-selected-users="getUserInfo" />

  <!-- 표준추가 팝업 -->
  <pop-safety-factor-standard
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    v-show="isPopFactorStandard"
    @close="closePopFactorStandard"></pop-safety-factor-standard>

  <!-- 파일 제어 팝업 -->
  <pop-file-attach
    :sendData="basicInfo"
    :key="basicInfo"
    :isWriteAuth="isShownBtn1 && isWritableUser"
    @saveFileCnt="getSaveFileCnt"
    @sendSelectedFiles="getSelectedFiles"
    v-show="isPopFileAttach"
    @close="closePopFileAttach"></pop-file-attach>
  <!-- ref="fileOnSearch"></popFileAttach> regist -->

  <!-- 특정 셀 크게보기 팝업 -->
  <pop-detail-view
    ref="popDetailViewRef"
    v-show="isPopDetailView"
    @close="closePopDetailView"></pop-detail-view>

  <!-- 중점점검활동 조치 팝업 -->
  <popInspectionAppr
    v-if="isApprModalOpen"
    @close="closeApprModal"
    :rowParams="sftAtvtActParams"
    :key="sftAtvtActParams"
    title="중점점검 조치">
  </popInspectionAppr>
</template>

<script setup>
import { onBeforeMount, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import apprLine from "@/views/common/apprLine.vue";
import popApprOpnn from "@/views/common/popApprOpnn.vue";
import popFileAttach from "@/views/common/popFileAttach.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";
import popDetailView from "@/views/inspcActvt/popup/popDetailView.vue";
import popSafetyFactorStandard from "@/views/inspcActvt/popupRefact/popSafetyFactorStandard.vue";
import popInspectionAppr from "@/views/safeActvt/popInspectionAppr.vue";

import loginAuthService from "@/api/common/login-auth-service";
import { useApprStore } from "@/stores/common/appr-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";

const props = defineProps([
  "siteInfo",
  "userInfo",
  "menuInfo",
  "vendrInfo",
  "contyCdList",
  "riskLvlList",
  "siteExeRuleStd",
  "dsstrStleCdList",
  "pageMode",
]);

const store = useRiskAssessmentStore();
const apprStore = useApprStore();
const dialogStore = useDialogStore();
const router = useRouter();
const route = useRoute();
const basicInfo = history.state;

const apprUserParams = ref();
const sftAtvtActParams = ref({});
const apprUserList = ref([]);
const crntApprOver = ref([]);
const prevApprOver = ref([]);
const apprOpnn = ref();
const apprBtnNm = ref("상신");

const isShownBtn1 = ref(false);
const isShownBtn2 = ref(false);
const isShownBtn3 = ref(false);
const isWritableUser = ref(false);

const fileList = ref([]);
const saveFileCnt = ref(0);
const popDetailViewRef = ref(null);

const emitMethod = ref(null);

const pageMode = ref(""); // reg, mod

// 타이틀명
const titleNm = ref("");

let findContyNm = ref("");

/**
 * 그리드 설정
 */
const gridRowData = ref([]);
const gridApi = ref();
const gridColumnApi = ref();
const localeText = { noRowsToShow: "조회 결과가 없습니다." };

function getGridApi(params) {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;

  // 위험성평가 목록의 상태값이 미작성, 작성중인 경우 검토의견 컬럼 hide
  if (pageMode.value === "mod") {
    visibleColumnByField("rvwOpnn");
  }
}

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 0,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
};

const columnDefs = [
  {
    headerName: "",
    field: "treeCell",
    width: 50,
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
    minWidth: 120,
    valueFormatter: (params) => {
      return getContyNm(params.value);
    },
  },
  {
    headerName: "작업명",
    field: "wrkNmCd",
    cellStyle: {
      justifyContent: "left",
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
    editable: (params) => chkEditable(params),
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
    width: 110,
  },
  {
    headerName: "재해형태",
    field: "dsstrStleCd",
    cellStyle: (params) => {
      return checkChildMismatch(params);
    },
    wrapText: true,
    autoHeight: true,
    editable: (params) => chkEditable(params),
    width: 130,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      const codes = {};
      props.dsstrStleCdList.forEach((item) => {
        codes[item.comCd] = item.comCdNm;
      });

      return { values: extractKeys(codes), valueListMaxWidth: 150 };
    },
    valueFormatter: (params) => {
      const codes = {};
      props.dsstrStleCdList.forEach((item) => {
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
    editable: (params) => chkEditable(params),
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
    editable: (params) => chkEditable(params),
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
    editable: (params) => chkEditable(params),
    width: 90,
    cellEditor: "agNumberCellEditor",
    cellEditorParams: {
      min: 0,
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
    editable: (params) => chkEditable(params),
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
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 100,
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
    editable: (params) => chkEditable(params),
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
      return checkChildMismatch(params, "rigth");
    },
    wrapText: true,
    autoHeight: true,
    editable: false,
    width: 170,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => {
      const actMngrNm = !params.data.actMngrNm ? "" : params.data.actMngrNm;

      if (isShownBtn1.value && !params.data.childrenYn) {
        return {
          onClick: () => {
            openPopSelectUser();
          },
          type: "search",
          cellText: actMngrNm,
        };
      } else {
        return {
          type: "",
          cellText: actMngrNm,
          visible: false,
        };
      }
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
    editable: (params) => chkEditable(params),
    hide: true,
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
    headerName: "수정",
    field: "modifyBtn",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    sortable: false,
    editable: false,
    hide: true,
    maxWidth: 65,
    pinned: "right",
    cellRenderer: compGridButton,
    cellRendererParams: (params) => {
      if (!params.data.childrenYn) {
        return {
          onClick: () => {
            params.data.mode = "U";
            params.data.beforeUserId = params.data.userId;
            params.data.isEditable = true;

            const selectedRowNode = gridApi.value.getDisplayedRowAtIndex(
              params.rowIndex
            );
            selectedRowNode.setDataValue("isEditable", true);
            gridApi.value.refreshCells({ rowNodes: [selectedRowNode] });
          },
          type: "modify",
        };
      } else {
        return {
          type: "",
        };
      }
    },
  },
  {
    headerName: "삭제",
    field: "deleteBtn",
    cellStyle: {
      justifyContent: "center",
      alignItems: "baseline",
    },
    sortable: false,
    editable: false,
    hide: true,
    maxWidth: 65,
    pinned: "right",
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        if (!params.data.childrenYn) {
          removeSelectedRow(params.data);
        }
      },
      type: "del",
    }),
  },
  {
    headerName: "수정체크",
    field: "isEditable",
    hide: true,
  },
  {
    headerName: "변경체크",
    field: "isModified",
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
  rowGroupPanelShow: "always", // 항상 행 고정 영역을 표시합니다.
  components: { treeCellRenderer: TreeCellRenderer },
  rowClassRules: {
    childrenRow: (params) => {
      return params.data.childrenYn === "Y";
    },
    editRow: (params) => {
      return params.data.isEditable;
    },
  },
  onCellValueChanged: handleCellChanged,
  onCellClicked: (params) => {
    if (["rskFctr", "rskMsr"].includes(params.colDef.field)) {
      if (!params.data.isEditable) {
        openPopDetailView();
        popDetailViewRef.value.setTextarea(params);
      }
    }
  },
};

const riskPrsmpGrdIdx = columnDefs.findIndex(
  (column) => column.field === "riskPrsmpGrd"
);

// 위험성 수준 판단법에 따른 위험성결정 컬럼 제어
// ( T0501(상중하법), T0502(빈도강도(3X3)), T0503(빈도강도법(5X5)) )
if (props.siteExeRuleStd.riskLvlJdgmntCd === "T0501") {
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
      const lookAt = lookupValue(getRiskEvalCodes(0), params.value);
      if (lookAt == null) {
        return "-";
      } else {
        return lookAt;
      }
    },
  };

  columnDefs.splice(riskPrsmpGrdIdx, 0, riskDecision);
} else {
  const count = props.siteExeRuleStd.riskLvlJdgmntCd === "T0502" ? 3 : 5;

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
          const lookAtt = lookupValue(getRiskEvalCodes(count), params.value);
          if (lookAtt == null) {
            return "-";
          } else {
            return lookAtt;
          }
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

// Gird 컬럼 visible 처리
function visibleColumnByField(field) {
  const column = gridColumnApi.value.getColumn(field); // 필드로 컬럼을 찾음

  if (column) {
    gridColumnApi.value.setColumnVisible(field, true);
  }
}

function handleCellChanged(params) {
  const { node, colDef } = params;

  if (["freq", "strngth"].includes(colDef.field)) {
    // 안전하게 숫자로 변환 가능한지 확인
    const freq = parseFloat(node.data.freq);
    const strngth = parseFloat(node.data.strngth);

    // 둘 다 유효한 숫자인 경우에만 계산 및 업데이트 수행
    if (!isNaN(freq) && !isNaN(strngth)) {
      // 빈도 + 강도의 합계
      const sum = freq * strngth;
      let riskPrsmpGrd = "-";

      const foundRiskLvl = props.riskLvlList.find((item) => {
        return item.riskPrsmpFqinSt <= sum && sum <= item.riskPrsmpFqinEn;
      });

      if (foundRiskLvl) {
        riskPrsmpGrd = foundRiskLvl.risk;
      }

      node.data.rst = sum;
      node.data.riskPrsmpGrd = riskPrsmpGrd;
    }
  }

  // 상중하법인 경우 위험등급 변경
  if (["rst"].includes(colDef.field)) {
    const foundRiskLvl = props.riskLvlList.find((item) => {
      return parseInt(item.riskDcsCls) === node.data.rst;
    });

    node.data.riskPrsmpGrd = foundRiskLvl.risk;
  }

  // 수정버튼 클릭 한 row의 cell하나라도 변경 된 경우
  node.data.isModified = true;

  // 그리드 업데이트
  gridApi.value.applyTransaction({
    update: [node.data],
  });
}

const riskAssmnTblList = ref([]);

const onSearch = async () => {
  titleNm.value =
    "위험성평가 " +
    (pageMode.value === "reg" ? "작성" : "검토/승인") +
    " [ " +
    basicInfo.mtNm +
    " / " +
    basicInfo.evalSeq +
    "차수 / " +
    basicInfo.contyCdNm +
    " ] ";

  apprUserParams.value = {
    vendrCd: props.siteInfo.vendrCd,
    siteCd: props.siteInfo.siteCd,
    apprKey: basicInfo.evalTblApprKey,
    userId: props.userInfo.userId,
    userNm: props.userInfo.userNm,
    jbttlNm: props.siteInfo.jbttlNm,
    workNm: props.userInfo.workNm,
    menuId: route.meta.menuId, // 위험성평가 표 목록 권한을 가진 유저를 조회하기 위해서
    isApprAddUser: true, // 결재라인 사용자 추가 가능
  };

  const params = {
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    contyCd: basicInfo.contyCd,
    evalType: basicInfo.evalType,
    evalSeq: basicInfo.evalSeq,
  };

  // 위험성평가 목록 조회
  riskAssmnTblList.value = await store.fetchRiskAssmnTblList(params);

  apprUserChk();

  if (riskAssmnTblList.value.length > 0) {
    gridRowData.value = riskAssmnTblList.value;
    initTreeCellRenderer(gridRowData.value);
  }
  // 미작성
  else {
    // 위험성평가 표 마스터, 추가 위험 발굴 목록 조회
    const riskAssmnTblMstList = await store.fetchRiskAssmnTblMstList(params);
    gridRowData.value = riskAssmnTblMstList;

    // 작성권한 부여
    if (isWritableUser.value) {
      isShownBtn1.value = true;
      visibleColumnByField("deleteBtn");
    }
  }

  gridRowData.value.forEach((row) => {
    row.riskEvalMthdCd = props.siteExeRuleStd.riskEvalMthdCd;
    row.riskLvlJdgmntCd = props.siteExeRuleStd.riskLvlJdgmntCd;
  });
};

onBeforeMount(() => {
  pageMode.value = props.pageMode; // 작성:reg, 검토/승인:mod
  onSearch();
});

const saveRiskAssmn = async () => {
  if (validation()) return;

  const data = new FormData();

  let allRowData = [];

  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      // 위험성평가 저장 목록 생성
      gridApi.value.forEachNode((obj, idx) => {
        // 수정버튼을 클릭 후 수정사항이 없을 경우 목록에서 제외
        if (obj.data.isEditable && !obj.data.isModified) {
          return;
        }

        obj.data.vendrCd = basicInfo.vendrCd;
        obj.data.siteCd = basicInfo.siteCd;
        obj.data.contyCd = basicInfo.contyCd;
        obj.data.evalType = basicInfo.evalType;
        obj.data.evalSeq = basicInfo.evalSeq;
        obj.data.evalTblApprKey = basicInfo.evalTblApprKey;
        obj.data.userId = props.userInfo.userId;
        obj.data.corprBzentyCd = props.userInfo.vendrCd;
        obj.data.atchFileKey = basicInfo.atchFileKey;

        if (pageMode.value === "reg") {
          obj.data.lastRfltTrgt = "Y";
          obj.data.mode = "I";
        }

        allRowData.push(obj.data);
      });

      // 첨부파일 FormData 추가
      fileList.value.forEach((file) => {
        data.append(`files`, file);
      });

      // 회의록 FormData 추가
      data.append("rvwOpnn", "");

      // 위험성평가 FormData 추가
      data.append(
        "params",
        new Blob([JSON.stringify(allRowData)], { type: "application/json" })
      );

      await store.fetchCreateRiskAssmn(data);

      await createApprLine();

      await onSearch();
    },
  });
};

const saveRiskAssmn2 = async () => {
  if (validation()) return;

  const data = new FormData();

  let allRowData = [];

  // 위험성평가 저장 목록 생성
  gridApi.value.forEachNode((obj, idx) => {
    // 수정버튼을 클릭 후 수정사항이 없을 경우 목록에서 제외
    if (obj.data.isEditable && !obj.data.isModified) {
      return;
    }

    obj.data.vendrCd = basicInfo.vendrCd;
    obj.data.siteCd = basicInfo.siteCd;
    obj.data.contyCd = basicInfo.contyCd;
    obj.data.evalType = basicInfo.evalType;
    obj.data.evalSeq = basicInfo.evalSeq;
    obj.data.evalTblApprKey = basicInfo.evalTblApprKey;
    obj.data.userId = props.userInfo.userId;
    obj.data.corprBzentyCd = props.userInfo.vendrCd;
    obj.data.atchFileKey = basicInfo.atchFileKey;

    allRowData.push(obj.data);
  });

  // 첨부파일 FormData 추가
  fileList.value.forEach((file) => {
    data.append(`files`, file);
  });

  // 회의록 FormData 추가
  data.append("rvwOpnn", "");

  // 위험성평가 FormData 추가
  data.append(
    "params",
    new Blob([JSON.stringify(allRowData)], { type: "application/json" })
  );

  await store.fetchCreateRiskAssmn(data);
  await onSearch();
};

// 특정 행에 'isEditable' 속성을 추가하고 값을 설정하는 함수
const setIsEditableForRow = (rowNode) => {
  if (rowNode) {
    rowNode.setDataValue("isEditable", true);
    rowNode.setDataValue("isModified", true);
    gridApi.value.refreshCells({ rowNodes: [rowNode] });
  }
};

async function removeSelectedRow(data) {
  try {
    if (data.userId && data.userId !== props.userInfo.userId) {
      throw `작성자가 일치하지 않습니다.`;
    }
  } catch (error) {
    dialogStore.openAlertDialog(error);
    return;
  }

  dialogStore.openConfirmDialog("삭제 하시겠습니까??", {
    confirmCallback: async () => {
      if (data.evalTblSeq && data.evalTblHistSeq) {
        await store.deleteRiskEvalTbl([data]);
        await onSearch();
      }

      gridApi.value.applyTransaction({ remove: [data] });
    },
  });
}

const getUserInfo = (params) => {
  const idx = gridApi.value.getFocusedCell().rowIndex;
  const row = gridApi.value.getDisplayedRowAtIndex(idx);

  gridRowData.value[idx].actMngr = params[0].userId;
  gridRowData.value[idx].actMngrNm = params[0].userNm;
  gridRowData.value = [...gridRowData.value];
};

/**
 * 표준추가 팝업 호출
 */
const isPopFactorStandard = ref(false);
const addFactorStandard = () => {
  isPopFactorStandard.value = true;
};
const closePopFactorStandard = (param) => {
  isPopFactorStandard.value = false;

  // 선택한 항목 있으면 중복체크 및 데이터 세팅
  if (param) {
    let isDupl = false;

    let Aflag = "Y";
    const filterData = gridRowData.value;

    let paramList = [];
    let newItems = {
      contyCd: "",
      userId: "",
      userNm: "",
      lgCatCd: "",
      mdCatCd: "",
      wrkNmCd: "",
      lgCatNm: "",
      mdCatNm: "",
      wrkNm: "",
      rskFctr: "",
      rskMsr: "",
      lastRfltTrgt: "",
      childrens: [],
      mode: "",
    };

    param.forEach((e) => {
      Aflag = "Y";
      newItems.contyCd = basicInfo.contyCd;
      newItems.userId = props.userInfo.userId;
      newItems.userNm = props.userInfo.userNm;
      newItems.lgCatCd = e.lgCatCd;
      newItems.mdCatCd = e.mdCatCd;
      newItems.wrkNmCd = e.wrkNmCd;
      newItems.lgCatNm = e.lgCatNm;
      newItems.mdCatNm = e.mdCatNm;
      newItems.wrkNm = e.wrkNm;
      newItems.lastRfltTrgt = "Y";
      newItems.rskFctr = e.rskFctrSeq > 0 ? e.rskFctr : ""; // 직접입력인 경우 텍스트필드 빈값
      newItems.rskMsr = e.rskFctrSeq > 0 ? e.rskMsr : ""; // 직접입력인 경우 텍스트필드 빈값
      newItems.mode = "I";
      newItems.isEditable = true;

      filterData.forEach((item) => {
        if (
          e.rskFctrSeq > 0 &&
          item.lgCatCd === e.lgCatCd &&
          item.mdCatCd === e.mdCatCd &&
          item.wrkNmCd === e.wrkNmCd &&
          item.rskFctr === e.rskFctr
        ) {
          Aflag = "N";
          return;
        }
      });
      if (Aflag === "Y") {
        paramList.push({ ...newItems });
      } else {
        isDupl = true;
      }
    });

    if (paramList.length > 0) {
      const focusedCell = gridApi.value.getFocusedCell();
      const rowCnt = gridApi.value.getDisplayedRowCount();
      const addIdx = focusedCell ? focusedCell.rowIndex + 1 : rowCnt;

      gridRowData.value = [...gridRowData.value, ...paramList];
    }

    if (isDupl) {
      dialogStore.openAlertDialog("중복을 제외한 표준이 추가되었습니다.");
      return false;
    }
  }
};

/**
 * 사용자 검색 팝업 호출
 */
const isPopSelectUser = ref(false);
const openPopSelectUser = () => {
  isPopSelectUser.value = true;
};

/**
 * 파일첨부 관리 팝업 호출
 */
const isPopFileAttach = ref(false);
const openPopFileAttach = () => {
  isPopFileAttach.value = true;
};
const closePopFileAttach = () => {
  isPopFileAttach.value = false;
};

/**
 * 특정 셀 크게보기 팝업 호출
 */
const isPopDetailView = ref(false);
const openPopDetailView = () => {
  isPopDetailView.value = true;
};
const closePopDetailView = () => {
  isPopDetailView.value = false;
};

const getSelectedFiles = (files) => {
  fileList.value = files;
};

const getSaveFileCnt = (cnt) => {
  saveFileCnt.value = cnt;
};

/**
 * 결재
 */
const lastApprUser = ref({}); // 마지막 결재자
const firstApprUser = ref({}); // 첫번째 결재자
const getApprUserList = (list) => {
  apprUserList.value = list;

  const lastApprUserIdx = apprUserList.value.length - 1;
  lastApprUser.value = { ...apprUserList.value[lastApprUserIdx] };
  firstApprUser.value = { ...apprUserList.value[0] };
};

const getCrntApprOver = (value) => {
  crntApprOver.value = value;
  apprBtnNm.value = "상신";

  if (value && value.userId === props.userInfo.userId) {
    // 결재상신 전
    isShownBtn1.value = true;

    // 결재상신 이후
    if (crntApprOver.value.statsCd !== "") {
      if (value.apprSeq == lastApprUser.value.apprSeq) {
        apprBtnNm.value = "승인";
      } else if (value.apprSeq > firstApprUser.value.apprSeq) {
        apprBtnNm.value = "검토";
      }
    }
  }

  if (isShownBtn1.value) {
    // 저장권한이 있으면 수정,삭제버튼 보이기
    visibleColumnByField("deleteBtn");

    if (pageMode.value === "mod") {
      visibleColumnByField("modifyBtn");
    }

    gridRowData.value.forEach((row) => {
      row.isShownBtn1 = isShownBtn1.value;
    });
  }
};

const getPrevApprOver = (value) => {
  prevApprOver.value = value;

  if (value) {
    isShownBtn2.value = props.userInfo.userId === value.userId;
  }
};

const cancelApprMst2 = async () => {
  dialogStore.openConfirmDialog("승인요청 취소하시겠습니까?", {
    confirmCallback: async () => {
      document.getElementsByClassName("loading_wrap")[0].classList.add("show");

      // 이전 결재자
      const prevApprIdx = apprUserList.value.length - 1;
      const prevApprover = apprUserList.value[prevApprIdx];

      const apprInfo = {
        vendrCd: prevApprover.vendrCd,
        siteCd: prevApprover.siteCd,
        apprKey: prevApprover.apprKey,
        apprNm: prevApprover.apprNm,
        statsCd: "T1005",
        userId: prevApprover.userId,
      };

      const arrpDtlList = [
        {
          vendrCd: prevApprover.vendrCd,
          siteCd: prevApprover.siteCd,
          apprSeq: prevApprover.apprSeq,
          apprKey: prevApprover.apprKey,
          statsCd: "T1005",
          userId: prevApprover.userId,
        },
      ];

      const params = {
        apprInfo,
        arrpDtlList,
      };

      await apprStore.fetchCreateApprMst(params);
      document
        .getElementsByClassName("loading_wrap")[0]
        .classList.remove("show");
      await router.push({ name: "RiskAssmnMain" });
    },
  });
};

// 결재 - 승인요청취소
const cancelApprMst = async () => {
  let otherIdChk = false;

  gridApi.value.forEachNode((item) => {
    if (item.data.userId === crntApprOver.value.userId) {
      otherIdChk = true;
    }
  });

  if (otherIdChk && prevApprOver.value.userId != crntApprOver.value.userId) {
    dialogStore.openAlertDialog(
      "상위 결재자의 수정 이력이 있어 승인요청취소 할 수 없습니다."
    );
    return;
  }

  dialogStore.openConfirmDialog("승인요청 취소하시겠습니까?", {
    confirmCallback: async () => {
      document.getElementsByClassName("loading_wrap")[0].classList.add("show");

      const dataList = apprUserList.value;

      // 이전 결재자 정보 찾기
      const previousApprover = dataList.find(
        (item) => item.userId === prevApprOver.value.userId
      );

      const apprInfo = {
        vendrCd: previousApprover.vendrCd,
        siteCd: previousApprover.siteCd,
        apprKey: previousApprover.apprKey,
        apprNm: previousApprover.apprNm,
        statsCd: "T1005",
        userId: previousApprover.userId,
      };

      const arrpDtlList = [
        {
          vendrCd: previousApprover.vendrCd,
          siteCd: previousApprover.siteCd,
          apprSeq: previousApprover.apprSeq,
          apprKey: previousApprover.apprKey,
          statsCd: "T1005",
          userId: previousApprover.userId,
        },
      ];

      const params = {
        apprInfo,
        arrpDtlList,
      };

      await apprStore.fetchCreateApprMst(params);
      document
        .getElementsByClassName("loading_wrap")[0]
        .classList.remove("show");
      await router.push({ name: "RiskAssmnMain" });
    },
  });
};

/**
 * 결재라인 저장
 */
const saveApprMst = async (opnnData) => {
  // 유효성 체크
  if (opnnData.apprGbn === "rej") {
    let otherIdChk = false;

    gridApi.value.forEachNode((item) => {
      if (item.data.userId === props.userInfo.userId) {
        otherIdChk = true;
      }
    });

    if (otherIdChk && prevApprOver.value.userId != crntApprOver.value.userId) {
      dialogStore.openAlertDialog(
        "현재 결재자가 등록한 정보가 있어 반려할 수 없습니다."
      );
      return;
    }
  }

  // dataList : 이미 결재한 사람은 제외한 list (가공 데이터)
  const dataList = apprUserList.value;

  // 결재 하지 않은 사람
  const filteredData = dataList.filter(
    (item) =>
      !item.statsCd ||
      item.statsCd === "" ||
      item.statsCd === "T1004" ||
      item.statsCd === "T1005"
  );

  // 결재한 사람
  const filteredData2 = dataList.filter(
    (item) =>
      // 기안
      item.statsCd === "T1001" ||
      // 검토
      item.statsCd === "T1002"
  );

  // 결재한 사람중 마지막 순서
  const fileLastSeq = filteredData2.length;

  // 전체 결재라인의 마지막 순서
  const endSeq = apprUserList.value.length;

  // 결재 안한 사람중
  filteredData.forEach((item, index) => {
    // 마지막 사람
    if (index === 0) {
      if (opnnData.apprGbn === "appr") {
        // 상신(T1001), 검토(T1002), 승인(T1003)일 때
        if (item.apprSeq === 1) {
          item.statsCd = "T1001";
          item.tmplCd = "003";
        } else if (item.apprSeq === endSeq) {
          item.statsCd = "T1003";
          item.tmplCd = "004";
        } else {
          item.statsCd = "T1002";
          item.tmplCd = "003";
        }
      } else if (opnnData.apprGbn === "rej") {
        // 반려(T1004)일 때
        item.statsCd = "T1004";
        item.tmplCd = "005";
      }
    } else {
      item.statsCd = "";
    }
  });

  // 결재 한 사람중
  filteredData2.forEach((item, index) => {
    // 첫번째 사람
    if (index === fileLastSeq - 1) {
      if (opnnData.apprGbn === "appr") {
        item.statsCd = "T1003";
        item.tmplCd = "004";
      } else if (opnnData.apprGbn === "rej") {
        // 반려(T1004)일 때
        item.statsCd = "T1004";
        item.tmplCd = "005";
      }
    } else {
      item.statsCd = "";
    }
  });

  // 결재안한사람 중 첫번째 (apprInfo에 들어갈 데이터)
  const firstApprUser = filteredData[0];

  // 결재 한 사람 중 첫번째 (apprInfo에 들어갈 데이터)
  const firstApprUser2 = filteredData2[0];

  const apprInfo = {
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    apprKey: basicInfo.evalTblApprKey,
    apprNm: `위험성평가 표 결재_${basicInfo.evalType}_${basicInfo.evalSeq}`,
    statsCd: firstApprUser.statsCd,
    userId: firstApprUser.userId,
  };

  const arrpDtlList = filteredData.map((apprUser, index) => ({
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    apprSeq: apprUser.apprSeq,
    apprKey: basicInfo.evalTblApprKey,
    userId: apprUser.userId,
    statsCd: apprUser.statsCd,
    apprOpnn: index === 0 ? opnnData.apprOpnn : "",
  }));

  const arrpDtlList2 = filteredData2.map((apprUser, index) => ({
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    apprSeq: apprUser.apprSeq,
    apprKey: basicInfo.evalTblApprKey,
    userId: apprUser.userId,
    statsCd: apprUser.statsCd,
    apprOpnn: index === 0 ? opnnData.apprOpnn : "",
  }));
  let pushAlertParam = "";

  // 결재 버튼 값
  const apprBtn = opnnData.apprBtn;
  // 상신, 검토
  if (apprBtn == "상신" || apprBtn == "검토") {
    // 템플릿 코드
    let gubunTmplCd = firstApprUser.tmplCd;
    // tmpPram
    let tmpParam = firstApprUser.tmplCd;

    // 승인 요청
    if (gubunTmplCd == "003") {
      tmpParam = basicInfo.mtNm;
      // 승인 완료
    } else if (gubunTmplCd == "004") {
      tmpParam = basicInfo.mtNm + "#" + findContyNm;
      // 승인 반려
    } else {
      tmpParam = basicInfo.mtNm + "#" + findContyNm;
    }

    pushAlertParam = {
      vendrCd: firstApprUser.vendrCd,
      siteCd: firstApprUser.siteCd,
      userId: firstApprUser.userId,
      receiverId: firstApprUser.apprSeq === endSeq ? "" : arrpDtlList[1].userId, // 결재라인 다음 결재자
      tmplCd: firstApprUser.tmplCd,
      tmpParam: tmpParam,
    };
    // 승인, 반려
  } else {
    // 템플릿 코드
    let gubunTmplCd = firstApprUser2.tmplCd;
    // tmpPram
    let tmpParam = firstApprUser2.tmplCd;

    // 승인 요청
    if (gubunTmplCd == "003") {
      tmpParam = basicInfo.mtNm;
      // 승인 완료
    } else if (gubunTmplCd == "004") {
      tmpParam = basicInfo.mtNm + "#" + findContyNm;
      // 승인 반려
    } else {
      tmpParam = basicInfo.mtNm + "#" + findContyNm;
    }

    pushAlertParam = {
      vendrCd: firstApprUser.vendrCd,
      siteCd: firstApprUser.siteCd,
      userId: firstApprUser.userId,
      receiverId: arrpDtlList2[fileLastSeq - 1].userId, // 결재라인 다음 결재자
      tmplCd: firstApprUser.tmplCd,
      tmpParam: tmpParam,
      //"tmpParam": basicInfo.mtNm,
    };
  }

  const params = {
    apprInfo,
    arrpDtlList,
  };

  await apprStore.fetchCreateApprMst(params);

  // push, 알림톡
  apprPushAlert(pushAlertParam);

  await saveRiskAssmn2();

  await router.push({ name: "RiskAssmnMain" });
};

async function apprPushAlert(param) {
  // 알림톡
  try {
    const send1res = await loginAuthService.sendNotificationTalk(param);

    if (send1res.status == 200) {
      console.log("알림톡 정상처리");
    } else {
      dialogStore.openAlertDialog(send1res.data.message);
      return;
    }
  } catch (err) {
    console.log(
      "popResetPassword.vue > sendCertNum() > sendNotificationTalk err : ",
      err
    );
    throw err;
  }

  // push알림
  try {
    const send2res = await loginAuthService.sendPush(param);

    if (send2res.status == 200) {
      console.log("push 정상처리");
    } else {
      dialogStore.openAlertDialog(send2res.data.message);
      return;
    }
  } catch (err) {
    console.log("popResetPassword.vue >  sendPush err : ", err);
    throw err;
  }
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
}

// 저장시 결재라인 생성
async function createApprLine() {
  const firstApprUser = apprUserList.value[0]; // 결재안한사람 중 첫번째 (apprInfo에 들어갈 데이터)

  const apprInfo = {
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    apprKey: basicInfo.evalTblApprKey,
    apprNm: `위험성평가 표 결재_${basicInfo.evalType}_${basicInfo.evalSeq}`,
    statsCd: "",
    userId:
      apprUserList.value.length > 0
        ? firstApprUser.userId
        : props.userInfo.userId,
  };

  let arrpDtlList = [];
  if (apprUserList.value.length > 0) {
    arrpDtlList = apprUserList.value.map((apprUser) => ({
      vendrCd: basicInfo.vendrCd,
      siteCd: basicInfo.siteCd,
      apprSeq: apprUser.apprSeq,
      apprKey: basicInfo.evalTblApprKey,
      userId: apprUser.userId,
      statsCd: apprUser.statsCd,
      apprOpnn: "",
    }));
  } else {
    // 결재 최초 저장시
    arrpDtlList = [
      {
        vendrCd: basicInfo.vendrCd,
        siteCd: basicInfo.siteCd,
        apprSeq: 1,
        apprKey: basicInfo.evalTblApprKey,
        userId: props.userInfo.userId,
        statsCd: "",
        apprOpnn: "",
      },
    ];
  }

  const params = {
    apprInfo,
    arrpDtlList,
  };

  await apprStore.fetchCreateApprMst(params);
}

const chkEditable = (params) => {
  if (pageMode.value === "reg") {
    params.data.isEditable = true;
  }

  return params.data.isEditable;
};

function getContyNm(contyCd) {
  const findContyCd = props.contyCdList.find(
    (item) => item.contyCd === contyCd
  );
  findContyNm = !findContyCd ? "" : findContyCd.contyCdNm;
  return !findContyCd ? "" : findContyCd.contyCdNm;
}

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
      gridRowData.value = rowDataExpanded;
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

function validation() {
  let targetIdx = 0;

  try {
    if (!gridApi.value.getModel().getRowCount()) {
      throw {
        message: "데이터를 입력한 후 저장해 주세요.",
      };
    }

    gridApi.value.forEachNode((obj, idx) => {
      targetIdx = idx;

      // 위험요인 체크
      if (!obj.data.rskFctr) {
        throw {
          field: "rskFctr",
          message: "위험요인을 입력해 주세요.",
        };
      }

      if (props.siteExeRuleStd.riskLvlJdgmntCd !== "T0501") {
        // 빈도 체크
        if (!obj.data.freq) {
          throw {
            field: "freq",
            message: "빈도를 선택해 주세요.",
          };
        }

        // 강도 체크
        if (!obj.data.strngth) {
          throw {
            field: "strngth",
            message: "강도를 선택해 주세요.",
          };
        }
      }

      // 결과 체크
      if (!obj.data.rst) {
        throw {
          field: "rst",
          message: "결과를 선택해 주세요.",
        };
      }

      // 재해형태 체크
      if (!obj.data.dsstrStleCd) {
        throw {
          field: "dsstrStleCd",
          message: "재해형태를 선택해 주세요.",
        };
      }

      // 감소대책 체크
      if (!obj.data.rskMsr) {
        throw {
          field: "rskMsr",
          message: "감소대책을 입력해 주세요.",
        };
      }

      const foundMngLvl = props.riskLvlList.find((item) => {
        return item.risk === obj.data.riskPrsmpGrd;
      });
    });
  } catch (error) {
    if (error.field) {
      gridApi.value.setFocusedCell(targetIdx, error.field, null);
    }
    dialogStore.openAlertDialog(error.message);
    return true;
  }

  return false;
}

function checkChildMismatch(params, dynamicTextAlign = "center") {
  const baseStyle = {
    justifyContent: dynamicTextAlign,
    alignItems: "baseline",
  };

  if (pageMode.value === "mod") {
    const fieldName = params.colDef.field;
    const { childrens, childrenYn } = params.data;

    if (
      childrens.length > 0 &&
      !childrenYn &&
      params.value !== childrens[0][fieldName]
    ) {
      return { ...baseStyle, color: "red" };
    }
  }

  return baseStyle;
}

const apprUserChk = () => {
  let apprUserChk = false;

  if (apprUserList.value.length > 0) {
    apprUserList.value.forEach((item) => {
      if (item.userId === props.userInfo.userId) {
        apprUserChk = true;
      }
    });
  }

  isWritableUser.value =
    basicInfo.evalTblWrtrId === props.userInfo.userId || apprUserChk;
};

watchEffect(() => {
  if (apprUserList.value.length > 0) {
    apprUserChk();
  }
});

// 중점점검활동 조치 팝업 열기
function inspectionAction(params) {
  const getRow = params;
  sftAtvtActParams.value = getRow;

  openApprModal();
}

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
.grid_default2 {
  height: calc(100% - 40px);
}

.appr_grid {
  height: calc(100% - 20px);
  transition: height 0.3s;
}
.appr_grid.show {
  height: calc(100% - 200px);
  transition: height 0.3s;
}

button.del {
  background-color: #ff0000;
}

.add_factor_standard {
  width: 80%;
  height: 95%;
}

.search_user {
  width: 80%;
  height: 80%;
}

.appr_opnn {
  width: 40%;
  height: 35%;
}

.pop_detail_view {
  width: 60%;
  height: 60%;
}

.page_content_area {
  overflow: hidden;
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
</style>
