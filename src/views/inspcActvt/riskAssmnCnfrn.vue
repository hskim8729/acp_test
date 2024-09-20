<!-- 안전점검활동/위험성평가 -->

<template>
  <div class="page_title_area">
    <div class="title">위험성평가</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 안전점검활동 >
      위험성평가
    </nav>
    <div class="top_btn_area">
      <comp-button
        type="save"
        text="저장"
        v-if="isShownBtn && !isApprIng"
        @click="saveRiskAssmn"
        requiredAuth>
      </comp-button>

      <!-- 결재의견 팝업 -->
      <pop-appr-opnn
        :apprUserList="apprUserList"
        :crntApprOver="crntApprOver"
        :apprBtnNm="apprBtnNm"
        :key="apprUserList"
        @apprOpnn="saveApprMst"
        @validCheck="validCheck"
        ref="apprOpnn"
        v-if="isShownBtn && isGridReady"></pop-appr-opnn>

      <comp-button
        type="list"
        text="목록"
        @click="$router.go(-1)"></comp-button>
    </div>
  </div>

  <div class="page_content_area">
    <!-- 결재라인 컴포넌트 -->
    <apprLine
      v-if="isGridReady"
      :apprUserParams="apprUserParams"
      @apprUserList="getApprUserList"
      @crntApprOver="getCrntApprOver"></apprLine>

    <!-- 위험성평가 회의 -->
    <div class="subtitle_area">
      <span class="title">위험성평가 회의</span>
      <div class="right_btn">
        <select class="mr10" @change="handleSelectChange">
          <option value="">전체공종</option>
          <option
            v-for="value in cnfrnContyCdList"
            :key="value.contyCd"
            :value="value.contyCd">
            {{ value.contyCdNm }}
          </option>
        </select>
        <!--
        <input type="checkbox" id="sort" /><label for="sort" @change="sort">공종</label>
        <input type="checkbox" id="place" /><label for="place">작업위치/인원</label>
        <input type="checkbox" id="material" /><label for="material">위험물</label>
        <input type="checkbox" id="form" /><label for="form">재해형태</label>
        <input type="checkbox" id="writer" /><label for="writer">작성자</label>
        -->
        <comp-button
          text="추가"
          v-if="isShownBtn && !isApprIng"
          @click="popupFactorStandard"
          requiredAuth>
        </comp-button>
        <comp-button type="print" text="출력" @click="reportView"></comp-button>
      </div>
    </div>

    <div class="grid_default2" id="grid">
      <ag-grid-vue
        v-if="isGridReady"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :gridOptions="gridOptions"
        :rowData="gridRowData">
      </ag-grid-vue>
    </div>

    <div class="subtitle_area">
      <span class="title">회의록</span>
    </div>
    <div class="content_box">
      <textarea v-model="basicInfo.rvwOpnn" :readonly="!isShownBtn"></textarea>
    </div>
  </div>

  <!-- 평가담당자 팝업 -->
  <pop-search-user
    :is-popup-bg="true"
    :userParams="apprUserParams"
    @selectedUser="getUserInfo"
    v-show="isPopSearchUser"
    @close="closePopSearchUser"></pop-search-user>

  <!-- 표준추가 팝업 -->
  <popFactorStandard
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    @applyParam="addNewRow"
    ref="emitMethod"></popFactorStandard>

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
import { AgGridVue } from "ag-grid-vue3";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import apprLine from "@/views/common/apprLine.vue";
import popApprOpnn from "@/views/common/popApprOpnn.vue";
import popDetailView from "@/views/inspcActvt/popup/popDetailView.vue";
import popFactorStandard from "@/views/inspcActvt/popup/popRiskFactorStandard.vue";
import popSearchUser from "@/views/inspcActvt/popup/popSearchUser.vue";
import popInspectionAppr from "@/views/safeActvt/popInspectionAppr.vue";

import commonUtils from "@/utils/common-utils";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import loginAuthService from "@/api/common/login-auth-service";
import { useApprStore } from "@/stores/common/appr-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";

const reportUrl = import.meta.env.VITE_APP_REPORT_DEV_URL;
const fileDiv = import.meta.env.VITE_APP_ENV_FILE_NAME;

const store = useRiskAssessmentStore();
const apprStore = useApprStore();
const router = useRouter();
const route = useRoute();
const basicInfo = history.state;
const loginStore = useLoginAuthStore();
const standReglStore = useStandReglStore();
const cdMgmtStore = useCdMgmtStore();

const gridApi = ref();
const gridColumnApi = ref();

const apprUserParams = ref();
const sftAtvtActParams = ref({});
const apprUserList = ref([]);
const crntApprOver = ref([]);
const cnfrnContyCdList = ref();
const apprOpnn = ref();
const isShownBtn = ref(false);
const apprBtnNm = ref("상신");
const popDetailViewRef = ref(null);

const emitMethod = ref(null);

// 평가 회의명
const mtNm = ref();

const siteInfo = loginStore.$state.siteInfo;
const userInfo = loginStore.$state.userInfo;
const menuInfo = loginStore.$state.menuInfo;
const riskLvlList = ref([]);
const siteExeRuleStd = ref([]);
const dsstrStleCdList = ref([]);

let columnDefs = [];
let riskPrsmpGrdIdx = null;

const setGrid = () => {
  columnDefs = [
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
      editable: (params) => chkEditable(params) && !params.data.evalTblHistSeq,
      minWidth: 120,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        const codes = {};
        cnfrnContyCdList.value.forEach((item) => {
          codes[item.contyCd] = item.contyCdNm;
        });

        return { values: extractKeys(codes) };
      },
      valueFormatter: (params) => {
        const codes = {};
        cnfrnContyCdList.value.forEach((item) => {
          codes[item.contyCd] = item.contyCdNm;
        });

        return lookupValue(codes, params.value);
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
        dsstrStleCdList.value.forEach((item) => {
          codes[item.comCd] = item.comCdNm;
        });

        return { values: extractKeys(codes), valueListMaxWidth: 150 };
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
      cellRenderer: (params) => {
        const eDiv = document.createElement("div");
        const actMngrNm = !params.data.actMngrNm ? "" : params.data.actMngrNm;

        if (isShownBtn.value && !params.data.childrenYn) {
          eDiv.innerHTML = `
            <span>${actMngrNm}</span>
            <button class="search_btn" style="float: right;"></button>
          `;

          const eButton = eDiv.querySelectorAll(".search_btn")[0];

          eButton.onclick = function () {
            openPopSearchUser();
          };
        } else {
          eDiv.innerHTML = `<span>${actMngrNm}</span>`;
        }

        return eDiv;
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
      cellRenderer: (params) => {
        const eDiv = document.createElement("div");
        if (!params.data.childrenYn) {
          eDiv.classList.add("cell_center");
          eDiv.innerHTML = '<button class="modify"></button>';
        }
        return eDiv;
      },
      onCellClicked: (params) => {
        if (!params.data.childrenYn) {
          params.data.mode = "U";
          params.data.beforeUserId = params.data.userId;
          params.data.isEditable = true;

          const selectedRowNode = gridApi.value.getDisplayedRowAtIndex(
            params.rowIndex
          );
          selectedRowNode.setDataValue("isEditable", true);
          gridApi.value.refreshCells({ rowNodes: [selectedRowNode] });
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
      cellRenderer: (params) => {
        const eDiv = document.createElement("div");
        if (!params.data.childrenYn) {
          eDiv.classList.add("cell_center");
          eDiv.innerHTML = '<button class="del"></button>';
        }
        return eDiv;
      },
      onCellClicked: (params) => {
        if (!params.data.childrenYn) {
          removeSelectedRow(params.data);
        }
      },
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

  riskPrsmpGrdIdx = columnDefs.findIndex(
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
};

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
  setGrid();
  onSearch();
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;

  // 위험성평가 목록의 상태값이 미작성, 작성중인 경우 검토의견 컬럼 hide
  if (["T1305", "T1306", "T1307"].includes(basicInfo.statsCd)) {
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
  resizable: true,
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
  onGridReady: onGridReady,
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

      const foundRiskLvl = riskLvlList.value.find((item) => {
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
    const foundRiskLvl = riskLvlList.value.find((item) => {
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

const gridRowData = ref([]);
const riskAssmnTblList = ref([]);

const initData = async () => {
  apprUserParams.value = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    apprKey: basicInfo.mtApprKey,
    userId: userInfo.userId,
    userNm: userInfo.userNm,
    jbttlNm: siteInfo.jbttlNm,
    workNm: userInfo.workNm,
    menuId: route.meta.menuId, // 위험성평가 표 목록 권한을 가진 유저를 조회하기 위해서
    isApprAddUser: false, // 결재라인 사용자 추가 가능
  };

  const params = {
    vendrCd: siteInfo.vendrCd,
    siteCd: siteInfo.siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 현장 실시 규정 표준 평가 절차 방법 조회
  riskLvlList.value = await standReglStore.riskLvlList(params);

  // 실시규정 표준 조회
  siteExeRuleStd.value = await standReglStore.standReglSearchList(params);

  // 재해형태 공통코드 조회
  dsstrStleCdList.value = await cdMgmtStore.fetchComCodeList({ comCd: "T20" });
};

const onSearch = async () => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  const params = {
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    evalType: basicInfo.evalType,
    evalSeq: basicInfo.evalSeq,
  };

  // 위험성평가 목록 조회
  riskAssmnTblList.value = await store.fetchRiskAssmnTblList(params);
  // 현재 회의에 등록된 공사 종류 코드 조회
  mtNm.value = store.$state.selectMtNm.mtNm;

  // 현재 회의에 등록된 공사 종류 코드 조회
  cnfrnContyCdList.value = store.$state.cnfrnContyCdList;

  gridRowData.value = riskAssmnTblList.value;

  gridRowData.value.forEach((row) => {
    row.riskEvalMthdCd = siteExeRuleStd.value.riskEvalMthdCd;
    row.riskLvlJdgmntCd = siteExeRuleStd.value.riskLvlJdgmntCd;
  });

  initTreeCellRenderer(gridRowData.value);

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

const isGridReady = ref(false);
onBeforeMount(async () => {
  await initData();
  isGridReady.value = true;
});

onMounted(() => {});

const saveRiskAssmn = async () => {
  if (validation()) return;

  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  const data = new FormData();

  let allRowData = [];

  // 위험성평가 저장 목록 생성
  gridApi.value.forEachNode((obj) => {
    // 수정버튼을 클릭 후 수정사항이 없을 경우 목록에서 제외
    if (obj.data.isEditable && !obj.data.isModified) {
      return;
    }

    obj.data.vendrCd = basicInfo.vendrCd;
    obj.data.siteCd = basicInfo.siteCd;
    obj.data.evalType = basicInfo.evalType;
    obj.data.evalSeq = basicInfo.evalSeq;
    obj.data.evalTblApprKey = basicInfo.evalTblApprKey;
    obj.data.userId = userInfo.userId;
    obj.data.corprBzentyCd = userInfo.vendrCd;

    allRowData.push(obj.data);
  });

  // 회의록 FormData 추가
  data.append("rvwOpnn", basicInfo.rvwOpnn);

  // 위험성평가 FormData 추가
  data.append(
    "params",
    new Blob([JSON.stringify(allRowData)], { type: "application/json" })
  );

  console.log("위험성평가 저장 목록 생성 -> ", allRowData);
  await store.fetchCreateRiskAssmn(data);

  await onSearch();
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

// 특정 행에 'isEditable' 속성을 추가하고 값을 설정하는 함수
const setIsEditableForRow = (rowNode) => {
  if (rowNode) {
    rowNode.setDataValue("isEditable", true);
    rowNode.setDataValue("isModified", true);
    gridApi.value.refreshCells({ rowNodes: [rowNode] });
  }
};

// 새로운 열을 추가하는 함수
const addNewRow = (param) => {
  console.log("수정 param===>", param);

  let paramList = [];

  let newItems = [
    {
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
    },
  ];

  param.forEach((e, i) => {
    newItems.contyCd = basicInfo.contyCd;
    newItems.userId = userInfo.userId;
    newItems.userNm = userInfo.userNm;
    newItems.lgCatCd = e.lgCatCd;
    newItems.mdCatCd = e.mdCatCd;
    newItems.wrkNmCd = e.wrkNmCd;
    newItems.lgCatNm = e.lgCatNm;
    newItems.mdCatNm = e.mdCatNm;
    newItems.wrkNm = e.wrkNm;
    newItems.rskFctr = e.rskFctr;
    newItems.rskMsr = e.rskMsr;
    newItems.lastRfltTrgt = "Y";
    newItems.childrens = [];
    newItems.mode = "I";

    paramList.push({ ...newItems });
  });

  console.log("최종 newItems==>", newItems);
  console.log("최종 paramList==>", paramList);

  gridApi.value.applyTransaction({
    add: paramList,
  });

  const lastRowIndex = gridApi.value.getDisplayedRowCount() - 1;

  if (lastRowIndex >= 0) {
    const lastRowNode = gridApi.value.getDisplayedRowAtIndex(lastRowIndex);
    setIsEditableForRow(lastRowNode);
  }

  const displayedRowCount = gridApi.value.getDisplayedRowCount();
  const displayedRowsData = [];

  for (let i = 0; i < displayedRowCount; i++) {
    const displayedRow = gridApi.value.getDisplayedRowAtIndex(i);

    if (!displayedRow.data.childrenYn) {
      displayedRowsData.push(displayedRow.data);
    }
  }

  initTreeCellRenderer(displayedRowsData);
  gridOptions.api.redrawRows();
};

async function removeSelectedRow(data) {
  try {
    if (data.userId && data.userId !== userInfo.userId) {
      throw `작성자가 일치하지 않습니다.`;
    }
  } catch (error) {
    alert(error);
    return;
  }

  if (!confirm("삭제 하시겠습니까?")) return;

  if (data.evalTblSeq && data.evalTblHistSeq) {
    await store.deleteRiskEvalTbl([data]);
    await onSearch();
  }

  gridApi.value.applyTransaction({ remove: [data] });
}

const getUserInfo = (params) => {
  const cell = gridApi.value.getFocusedCell();
  const row = gridApi.value.getDisplayedRowAtIndex(cell.rowIndex);

  row.data.actMngr = params.userId;
  row.data.actMngrNm = params.userNm;

  gridApi.value.applyTransaction({
    update: [row.data],
  });
};

// 팝업 - 표준 추가
function popupFactorStandard() {
  // 담겨있는 값  초기화
  emitMethod.value.dataReset();

  document
    .getElementsByClassName("add_factor_standard")[0]
    .classList.add("show");
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
}

const isPopSearchUser = ref(false);
const openPopSearchUser = () => {
  isPopSearchUser.value = true;
};
const closePopSearchUser = () => {
  isPopSearchUser.value = false;
};
// 팝업 - 결재의견 추가
async function validCheck({ resolve }) {
  if (
    loginStore.$state.siteInfo.jbttlCd === "T0102" &&
    apprUserList.value.length < 2
  ) {
    alert("현장소장이 없으면 상신이 불가능합니다.");
    return;
  }

  resolve(true); // 결재의견 open
}

/**
 * 특정 셀 크게보기 팝업 호출
 */
const isPopDetailView = ref(false);
const openPopDetailView = () => {
  isPopDetailView.value = true;
};
const closePopDetailView = (param) => {
  isPopDetailView.value = false;
};

const isApprIng = ref(false);
const isLastApprUser = ref(false);
const getApprUserList = (list) => {
  apprUserList.value = list;

  const firstApprUser = apprUserList.value[0];
  const lastApprUserIdx = apprUserList.value.length - 1;
  const lastApprUser = apprUserList.value[lastApprUserIdx];
  isLastApprUser.value =
    lastApprUser.userId === userInfo.userId && lastApprUser.apprSeq > 1;

  // 상신, 검토 승인일 때 저장버튼 비활성화
  if (["T1001", "T1002", "T1003"].includes(firstApprUser.statsCd)) {
    isApprIng.value = true;
  }

  // 마지막 결재자 여부
  // 결재 버튼명 처리, 마지막일 때만 승인버튼
  apprBtnNm.value = isApprIng.value && isLastApprUser.value ? "승인" : "상신";
};

const getCrntApprOver = (value) => {
  crntApprOver.value = value;

  // 결재라인 없는 경우 or 결재선이 있고 본인차례일 때
  if (
    apprUserList.value.gbn === "cnfrnAppr" ||
    (value && value.userId === userInfo.userId)
  ) {
    isShownBtn.value = true;
  }

  const isWritable = commonUtils.$hasWritePermission(
    route.meta.menuId,
    menuInfo
  );

  isShownBtn.value = isShownBtn.value && isWritable;

  columnDefs.forEach((item) => {
    if (["deleteBtn", "modifyBtn"].includes(item.field)) {
      item.hide = !isShownBtn.value;
    }
  });

  gridApi.value.setColumnDefs(columnDefs);
};

const saveApprMst = async (opnnData) => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  // dataList : 이미 결재한 사람은 제외한 list (가공 데이터)
  const dataList = apprUserList.value;

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

  if (!filteredData.length) {
    alert("이미 승인이 완료되었습니다.");
  } else {
    filteredData.forEach((item, index) => {
      if (index === 0) {
        if (opnnData.apprGbn === "appr") {
          // 상신(T1001), 검토(T1002), 승인(T1003)일 때
          if (item.apprSeq === 1) {
            item.statsCd = "T1001";
            item.tmplCd = "006";
          } else if (item.apprSeq === endSeq) {
            item.statsCd = "T1003";
            item.tmplCd = "007";
          } else {
            item.statsCd = "T1002";
            item.tmplCd = "006";
          }
        } else if (opnnData.apprGbn === "rej") {
          // 반려(T1004)일 때
          item.statsCd = "T1004";
          item.tmplCd = "008";
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
          item.tmplCd = "006";
        } else if (opnnData.apprGbn === "rej") {
          // 반려(T1004)일 때
          item.statsCd = "T1004";
          item.tmplCd = "007";
        }
      } else {
        item.statsCd = "";
      }
    });

    //결재안한사람 중 첫번째 (apprInfo에 들어갈 데이터)
    const firstApprUser = filteredData[0];

    const apprInfo = {
      vendrCd: basicInfo.vendrCd,
      siteCd: basicInfo.siteCd,
      apprKey: basicInfo.mtApprKey,
      apprNm: `위험성평가 회의 결재_${basicInfo.evalType}_${basicInfo.evalSeq}`,
      statsCd: firstApprUser.statsCd,
      userId: firstApprUser.userId,
    };

    const arrpDtlList = filteredData.map((apprUser, index) => ({
      vendrCd: basicInfo.vendrCd,
      siteCd: basicInfo.siteCd,
      apprSeq: apprUser.apprSeq,
      apprKey: basicInfo.mtApprKey,
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
      console.log("상신,검토");
      // 템플릿 코드
      let tmpParam = mtNm.value;

      pushAlertParam = {
        vendrCd: firstApprUser.vendrCd,
        siteCd: firstApprUser.siteCd,
        userId: firstApprUser.userId,
        receiverId:
          firstApprUser.apprSeq === endSeq ? "" : arrpDtlList[1].userId, // 결재라인 다음 결재자
        tmplCd: firstApprUser.tmplCd,
        tmpParam: tmpParam,
      };
      // 승인, 반려
    } else {
      console.log("승인,반려");
      let tmpParam = mtNm.value;

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

    console.log("알람 최종 값===>", pushAlertParam);

    const params = {
      apprInfo,
      arrpDtlList,
    };

    await apprStore.fetchCreateApprMst(params);
    // push, 알림톡
    apprPushAlert(pushAlertParam);

    await saveRiskAssmn();

    const param = {
      vendrCd: basicInfo.vendrCd,
      siteCd: basicInfo.siteCd,
      evalType: basicInfo.evalType,
      evalSeq: basicInfo.evalSeq,
      userId: userInfo.userId,
    };

    // 최종 결재인 경우 위험성평가 마스터 저장
    if (isApprIng.value && isLastApprUser.value) {
      // 반려인 경우는 저장하지 않아야 한다.
      if (opnnData.apprGbn !== "rej") {
        await store.fetchCreateRiskAssmnMst(param);
      }

      // 반려인 경우 진행중
      if (opnnData.apprGbn === "rej") {
        // 현장 소장의 경우 평가 회의 기본 정보 상태값 진행(T0902)으로 수정
        await store.modifyRiskAssmnCnfrnStats({ ...param, stats: "T0902" });
        // 반려아닌 경우 완료
      } else {
        // 현장 소장의 경우 평가 회의 기본 정보 상태값 완료(T0902)으로 수정
        await store.modifyRiskAssmnCnfrnStats({ ...param, stats: "T0903" });
      }
    } else {
      // 안전 관리자의 경우 평가 회의 기본 정보 상태값 진행(T0902)으로 수정
      await store.modifyRiskAssmnCnfrnStats({ ...param, stats: "T0902" });
    }

    document.getElementsByClassName("popup_bg")[0].classList.remove("show");
    document.getElementsByClassName("loading_wrap")[0].classList.remove("show");

    await router.push({ name: "RiskAssmnCnfrnMain" });
  }
};

async function apprPushAlert(param) {
  // 알림톡
  try {
    const send1res = await loginAuthService.sendNotificationTalk(param);

    if (send1res.status == 200) {
      console.log("알림톡 정상처리");
    } else {
      alert(send1res.data.message);
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
      alert(send2res.data.message);
      return;
    }
  } catch (err) {
    console.log("popResetPassword.vue >  sendPush err : ", err);
    throw err;
  }
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
}

const chkEditable = (params) => {
  return params.data.isEditable;
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
    } else {
      this.eGui.innerHTML = "";
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

      // 공사 종류 체크
      if (!obj.data.contyCd) {
        throw {
          field: "contyCd",
          message: "공사종류를 선택해 주세요.",
        };
      }

      // 위험요인 체크
      if (!obj.data.rskFctr) {
        throw {
          field: "rskFctr",
          message: "위험요인을 입력해 주세요.",
        };
      }

      if (siteExeRuleStd.value.riskLvlJdgmntCd !== "T0501") {
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

      // const foundMngLvl = riskLvlList.value.find((item) => {
      //   return item.risk === obj.data.riskPrsmpGrd;
      // });

      // 현장 관리수준이 중점관리(T0201)인 경우
      // 2024-02-16 필수 제거
      // if (foundMngLvl.mngLvl === "T0201") {
      //   // 조치예정일 체크
      //   if (!obj.data.actExptDt) {
      //     throw {
      //       field: "actExptDt",
      //       message: `위험등급 "${foundMngLvl.risk}"은 중점관리 대상이기 때문에 조치예정일은 필수입니다.`,
      //     };
      //   }

      //   // 조치담당자 체크
      //   if (!obj.data.actMngr) {
      //     throw {
      //       field: "actMngr",
      //       message: `위험등급 "${foundMngLvl.risk}"은 중점관리 대상이기 때문에 조치담당자는 필수입니다.`,
      //     };
      //   }
      // }
    });
  } catch (error) {
    if (error.field) {
      gridApi.value.setFocusedCell(targetIdx, error.field, null);
    }
    alert(error.message);
    return true;
  }

  return false;
}

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
    return { ...baseStyle, color: "red" };
  }

  return baseStyle;
}

const sectionClose = (event) => {
  var sectionStatus = event.target.parentElement.parentElement.classList;

  if (sectionStatus.contains("close")) {
    sectionStatus.remove("close");
  } else {
    sectionStatus.add("close");
  }
};

// 이전 선택값을 저장할 변수
const previousContyCd = ref("");

const handleSelectChange = async (event) => {
  try {
    gridApi.value.forEachNode((obj) => {
      if (obj.data.isModified) {
        throw "수정중인 데이터가 존재합니다.";
      }
    });
  } catch (error) {
    // 이전 값으로 선택을 되돌림
    event.target.value = previousContyCd.value;
    alert(error);
    return;
  }

  previousContyCd.value = event.target.value;

  const params = {
    vendrCd: basicInfo.vendrCd,
    siteCd: basicInfo.siteCd,
    contyCd: event.target.value,
    evalType: basicInfo.evalType,
    evalSeq: basicInfo.evalSeq,
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

// 중점점검활동 조치 팝업 열기
function inspectionAction(params) {
  const getRow = params;
  sftAtvtActParams.value = getRow;

  openApprModal();
}

// 레포트 출력 함수
const reportView = () => {
  let link = document.createElement("a");
  let url = reportUrl + "/view/report1.jsp?";
  let param =
    "crfName=" +
    "inspcActvt/riskAssmnCnfrn" +
    "&vendrCd=" +
    basicInfo.vendrCd +
    "&siteCd=" +
    basicInfo.siteCd +
    "&evalType=" +
    basicInfo.evalType +
    "&evalSeq=" +
    basicInfo.evalSeq +
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
  height: calc(100% - 40px);
  margin-bottom: 30px;
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
