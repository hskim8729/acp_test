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
        @click="saveRiskAssmnDetail"
        type="save"
        text="저장"
        v-if="isVisible"
        requiredAuth></comp-button>
      <router-link to="/INSPC_ACTVT/riskAssmnCnfrnMain">
        <comp-button type="list" text="목록"></comp-button>
      </router-link>
    </div>
  </div>

  <div class="page_content_area">
    <div class="subtitle_area">
      <span class="title">위험성평가 회의 상세</span>
      <div class="right_btn">
        <comp-button
          @click="onGoRiskAssmnDetail"
          text="위험성평가 회의"></comp-button>
      </div>
    </div>
    <div class="content_box">
      <div class="item_wrap w20p">
        <span class="title">회의명</span>
        <input
          type="text"
          id="mtNm"
          ref="mtNmRef"
          v-model="formData.mtNm"
          placeholder="회의명을 입력해주세요."
          :readonly="!isVisible" />
      </div>
      <div class="item_wrap w25p">
        <span class="title">관리기간</span>
        <input
          type="date"
          id="evalStDt"
          ref="evalStDtRef"
          style="width: 130px"
          v-model="formData.evalStDt"
          max="9999-12-31"
          :readonly="!isVisible" />
        <span> ~ </span>
        <input
          type="date"
          id="evalEnDt"
          ref="evalEnDtRef"
          style="width: 130px"
          v-model="formData.evalEnDt"
          max="9999-12-31"
          :readonly="!isVisible" />
      </div>
      <div class="item_wrap w25p">
        <span class="title">회의일시</span>
        <input
          type="date"
          id="mtTm"
          ref="mtTmRef"
          style="width: 130px"
          v-model="formData.mtTm"
          max="9999-12-31"
          :readonly="!isVisible" />&nbsp;
        <input type="time" v-model="formData.mtTime" />
      </div>
      <div class="item_wrap w15p">
        <span class="title">회의장소</span>
        <input
          type="text"
          id="plac"
          ref="placRef"
          style="width: 150px"
          v-model="formData.plac"
          placeholder="회의장소를 입력해주세요."
          :readonly="!isVisible" />
      </div>

      <div class="item_wrap w15p">
        <span class="title">파일첨부</span>
        <button class="file_list_btn" @click="openPopFileAttach">
          파일추가<label>{{ saveFileCnt }}</label>
        </button>
      </div>
    </div>

    <div class="subtitle_area">
      <span class="title">대상공종</span>
      <div class="left_btn">
        <comp-button
          v-if="isVisible"
          @click="popupContyCdMgmt"
          text="공종편집"></comp-button>
      </div>
      <div class="right_btn">
        <comp-button
          v-if="isVisible"
          @click="addNewRow"
          text="추가"
          requiredAuth></comp-button>
      </div>
    </div>
    <div class="grid_default" id="grid01">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :gridOptions="gridOptions"
        :rowData="gridRowData">
      </ag-grid-vue>
    </div>
  </div>

  <!-- 평가담당자 팝업 -->
  <pop-search-user
    @selectedUser="updateRow"
    :userParams="userParams"
    :is-popup-bg="true"
    v-show="isPopSearchUser"
    @close="closePopSearchUser"></pop-search-user>

  <!-- 파일 제어 팝업 -->
  <pop-file-attach
    :sendData="formData"
    :key="formData"
    :isWriteAuth="isVisible"
    @saveFileCnt="getSaveFileCnt"
    @sendSelectedFiles="getSelectedFiles"
    v-show="isPopFileAttach"
    @close="closePopFileAttach">
  </pop-file-attach>

  <!-- 공사종류 관리 팝업 -->
  <popContyCdMgmt
    :siteInfo="siteInfo"
    :userInfo="userInfo"
    @close="closePopupContyCdMgmt"
    :isPopContyCd="isPopContyCd"
    :contyList="gridRowData"
    v-if="isPopContyCd">
  </popContyCdMgmt>

  <popRiskAssmnTbl
    :siteInfo="siteInfo"
    :popRiskAssmnTblParams="popRiskAssmnTblParams"
    :isPopRiskAssmnTbl="isPopRiskAssmnTbl"
    v-if="isPopRiskAssmnTbl"
    @close="closePopRiskAssmnTbl"></popRiskAssmnTbl>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import dayjs from "dayjs";
import { getCurrentInstance, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import compGridButton from "@/components/grid/compGridButton.vue";
import popFileAttach from "@/views/common/popFileAttach.vue";
import popContyCdMgmt from "@/views/inspcActvt/popup/popContyCdMgmt.vue";
import popRiskAssmnTbl from "@/views/inspcActvt/popup/popRiskAssmnTbl.vue";
import popSearchUser from "@/views/inspcActvt/popup/popSearchUser.vue";

import commonUtils from "@/utils/common-utils";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const router = useRouter();
const route = useRoute();
const store = useRiskAssessmentStore();
const dialogStore = useDialogStore();

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const siteInfo = $loginStore.$state.siteInfo;
const userInfo = $loginStore.$state.userInfo;
const menuInfo = $loginStore.$state.menuInfo;
const vendrInfo = $loginStore.$state.vendrInfo;

const userParams = ref();
const gridApi = ref();

const isVisible = ref(false);
const isPopContyCd = ref(false);

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const { vendrCd, siteCd, evalType, evalSeq, stats } = history.state;

const formData = ref({
  mtNm: "",
  evalStDt: "",
  evalEnDt: "",
  mtTm: "",
  mtTime: "",
  plac: "",
  evalType: "",
  stats: "",
});

const fileList = ref([]);
const saveFileCnt = ref(0);
const contyCdList = ref([]);
const gridRowData = ref([]);

function extractKeys(mappings) {
  return Object.keys(mappings);
}

function lookupValue(mappings, key) {
  return mappings[key];
}

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs = [
  {
    headerName: "번호",
    field: "id",
    cellStyle: { textAlign: "center" },
    editable: false,
    maxWidth: 80,
  },
  {
    headerName: "공종명",
    field: "contyCd",
    cellStyle: (params) => {
      // 값이 빈 문자열("")인 경우에는 placeholder 스타일 적용
      if (params.value === "") {
        return { textAlign: "center", color: "#a0a0a0" };
      } else {
        // 다른 경우에는 기본 스타일 유지
        return { textAlign: "center", color: "#181D1F" };
      }
    },
    editable: () => {
      return isVisible.value;
    },
    cellEditor: "agSelectCellEditor",
    cellEditorParams: () => {
      return {
        values: extractKeys(contyCdList.value),
      };
    },
    valueFormatter: (params) => {
      return lookupValue(contyCdList.value, params.value);
    },
  },
  {
    headerName: "공종담당자",
    field: "evalTblWrtr",
    editable: false,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");

      if (
        (formData.value.stats === "T0901" &&
          ["T1305", "T1306"].includes(params.data.statsCd)) ||
        !params.data.evalTblApprKey
      ) {
        eDiv.innerHTML = `
          <span style="${!params.value ? "color: #a0a0a0;" : ""}">${
          !params.value ? "공종담당자를 선택해 주세요." : params.value
        }</span>
          ${
            isVisible.value
              ? "<button class='search_btn' style='float: right;'></button>"
              : ""
          }
        `;

        // 쓰기 권한 있을 때만 공종담당자 검색 버튼 활성화
        if (isVisible.value) {
          const eButton = eDiv.querySelectorAll(".search_btn")[0];

          eButton.onclick = function () {
            openPopSearchUser();
          };
        }
      } else {
        eDiv.innerHTML = `
          <span style="${!params.value ? "color: #a0a0a0;" : ""}">${
          !params.value ? "공종담당자를 선택해 주세요." : params.value
        }</span>`;
      }

      return eDiv;
    },
  },
  {
    headerName: "회사명",
    field: "vendrNm",
    cellStyle: { textAlign: "center" },
    editable: false,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.innerHTML = `
        <span style="${!params.value ? "color: #a0a0a0;" : ""}">${
        !params.value
          ? "공종담당자를 선택하면 회사명이 입력됩니다."
          : params.value
      }</span>
      `;

      return eDiv;
    },
  },
  {
    headerName: "상태",
    field: "statsCdNm",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "상세보기",
    cellStyle: { justifyContent: "center" },
    sortable: false,
    editable: false,
    maxWidth: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => detailRow(params),
      type: "modify",
    }),
  },
  {
    headerName: "삭제",
    cellStyle: { justifyContent: "center" },
    sortable: false,
    editable: false,
    maxWidth: 80,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => removeRow(params),
      type: "del",
    }),
  },
];

const defaultColDef = {
  editable: true,
  sortable: true,
  flex: 1,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
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
  suppressCellFocus: true,
  onGridReady: onGridReady,
  onCellValueChanged: (event) => {
    gridApi.value.forEachNode((item) => {
      if (item.data.id !== event.data.id) {
        if (item.data.contyCd === event.value) {
          dialogStore.openAlertDialog("이미 선택된 공종명 입니다.");

          event.data.contyCd = "";
          gridApi.value.refreshCells({ rowNodes: [event.node] });
        }
      }
    });
  },
};

const refresh = async () => {
  document.getElementsByClassName("loading_wrap")[0].classList.add("show");

  const isWritable = commonUtils.$hasWritePermission(
    route.meta.menuId,
    menuInfo
  );

  // 현재 화면의 쓰기권한이 있는지 없는지 체크
  if (isWritable) {
    // 쓰기권한 있음
    // 상태값 대기(T0901)
    if (stats === "T0901") {
      isVisible.value = true;
    }
  } else {
    // 쓰기권한 없음
    // 상태값 진행(T0902), 완료(T0903)
    if (["T0902", "T0903"].includes(stats)) {
      isVisible.value = false;
    }
  }

  userParams.value = {
    vendrCd,
    siteCd,
    userId: userInfo.userId,
    userNm: userInfo.userNm,
    workNm: userInfo.workNm,
    menuId: "2001100", // 위험성평가 표 목록 권한을 가진 유저를 조회하기 위해서
  };

  const param = {
    vendrCd,
    siteCd,
    evalType,
    evalSeq,
  };

  // 위험성평가 회의 상세 조회
  formData.value = await store.fetchRiskAssmnCnfrnDetail(param);

  const mtDayTime = formData.value.mtTm;

  formData.value.mtTm = dayjs(mtDayTime.substring(0, 8)).format("YYYY-MM-DD");
  formData.value.mtTime = dayjs(mtDayTime.substring(8, 12), "HHmm").format(
    "HH:mm"
  );

  // 대상공종 목록 조회
  const tblInfoList = await store.fetchRiskAssmnCnfrnDetailContyList(param);
  tblInfoList.forEach((item, idx) => {
    item.id = tblInfoList.length - idx;
  });

  gridRowData.value = tblInfoList;

  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

onBeforeMount(() => {
  refresh();
});

onMounted(() => {
  contyCdList.value = store.$state.contyCdList
    .filter((item) => item.useYn === "Y")
    .reduce(
      (acc, item) => {
        acc[item.contyCd] = item.contyCdNm;
        return acc;
      },
      { "": "[ 공종 선택 ]" }
    );
});

const saveRiskAssmnDetail = async () => {
  if (validation()) return;

  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      const data = new FormData();

      const mttm = formData.value.mtTm + formData.value.mtTime;
      formData.value.mtTm = dayjs(mttm).format("YYYYMMDDHHmm");

      // 위험성평가 상세정보
      const bsInfo = {
        ...formData.value,
        userId: userInfo.userId,
      };

      let tblInfo = [];

      // 평가담당자(대상공종) 정보
      gridApi.value.forEachNode((obj) => {
        tblInfo.push({
          ...obj.data,
          userId: userInfo.userId,
        });
      });

      const params = {
        bsInfo,
        tblInfo,
      };

      // 첨부파일 FormData 추가
      fileList.value.forEach((file) => {
        data.append(`files`, file);
      });

      // 위험성평가 회의 등록정보 FormData 추가
      data.append(
        "params",
        new Blob([JSON.stringify(params)], { type: "application/json" })
      );

      await store.fetchCreateRiskAssmnCnfrn(data);

      await refresh();

      dialogStore.openToastDialog("저장이 완료되었습니다.");
    },
  });
};

const addNewRow = () => {
  const objList = Object.keys(contyCdList.value);
  const fliteredList = objList.filter((item) => {
    return item;
  });

  if (!fliteredList.length) {
    dialogStore.openAlertDialog(
      "등록된 공종이 없거나 사용여부가 활성화된 공종이 없습니다.\r\n공종편집을 확인해 주세요."
    );
    return;
  }
  const cnt = gridApi.value.getDisplayedRowCount() + 1;

  const newItems = {
    id: cnt,
    vendrCd,
    siteCd,
    evalType,
    evalSeq,
    delYn: "N",
    statsCdNm: "-",
    contyCd: "",
  };

  gridRowData.value.unshift(newItems);
  setGridIdx();
};

const detailRow = (params) => {
  popupRiskAssmnTbl(params);
};

const removeRow = async (params) => {
  if (params.data.statsCd) {
    if (params.data.statsCd !== "T1305") {
      dialogStore.openAlertDialog(
        "상태 값이 미작성인 경우에만 삭제할 수 있습니다."
      );
      return;
    }
  }

  if (formData.value.stats !== "T0901") {
    dialogStore.openAlertDialog(
      "회의 상태 값이 대기인 경우에만 삭제할 수 있습니다."
    );
    return;
  }

  dialogStore.openConfirmDialog("삭제 하시겠습니까?", {
    confirmCallback: async () => {
      if (params.data.evalTblApprKey) {
        await store.deleteEvalMtEvalTblWrtr(params.data);
      }

      gridRowData.value.splice(params.rowIndex, 1);

      dialogStore.openToastDialog("삭제를 완료하였습니다.");

      searchContyCdList();
      setGridIdx();
    },
  });
};

const searchContyCdList = () => {
  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 공사종류 코드목록 조회
  store.fetchContyCdList(param);
};

const setGridIdx = () => {
  // 그리드 행 번호 설정
  gridRowData.value.forEach((el, index) => {
    el.id = gridRowData.value.length - index;
  });

  // 그리드 refresh
  gridOptions.api.setRowData(gridOptions.rowData);
};

const updateRow = (params) => {
  const cell = gridApi.value.getFocusedCell();
  const row = gridApi.value.getDisplayedRowAtIndex(cell.rowIndex);

  row.data.evalTblWrtrId = params.userId;
  row.data.evalTblWrtr = params.userNm;
  row.data.vendrNm = params.vendrNm;

  gridApi.value.applyTransaction({
    update: [row.data],
  });
};

function onGoRiskAssmnDetail() {
  try {
    // 대상공종 상태 값 승인완료(T1303) 유무 체크
    gridApi.value.forEachNode((obj) => {
      if (obj.data.statsCd !== "T1303") {
        throw "대상공종 상태값중 승인 완료되지 않은 공종이 있습니다.";
      }
    });
  } catch (error) {
    dialogStore.openAlertDialog(error, { type: "error" });
    return;
  }

  const params = {
    vendrCd,
    siteCd,
    evalType,
    evalSeq,
    pageFlag: "cnfrn",
    mtApprKey: formData.value.mtApprKey,
    rvwOpnn: formData.value.rvwOpnn === "null" ? "" : formData.value.rvwOpnn,
  };

  // 위험성평가 회의 상세화면 이동
  router.push({
    name: "RiskAssmnCnfrn",
    state: params,
  });
}

const getSelectedFiles = (files) => {
  fileList.value = files;
};

const getSaveFileCnt = (cnt) => {
  saveFileCnt.value = cnt;
};

/**
 * 담당자 선택 팝업 호출
 */
const isPopSearchUser = ref(false);
const openPopSearchUser = () => {
  isPopSearchUser.value = true;
};
const closePopSearchUser = () => {
  isPopSearchUser.value = false;
};

// 공사종류 관리 팝업
function popupContyCdMgmt() {
  isPopContyCd.value = true;
}
// 공종편집 팝업
function closePopupContyCdMgmt() {
  isPopContyCd.value = false;
}

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

// 위험성평가 표 팝업
const isPopRiskAssmnTbl = ref(false);
const popRiskAssmnTblParams = ref(null);
const popupRiskAssmnTbl = (params) => {
  params.data.stats = formData.value.stats;
  popRiskAssmnTblParams.value = params;

  isPopRiskAssmnTbl.value = true;
};
const closePopRiskAssmnTbl = () => {
  isPopRiskAssmnTbl.value = false;
};

const mtNmRef = ref(null);
const evalStDtRef = ref(null);
const evalEnDtRef = ref(null);
const mtTmRef = ref(null);
const placRef = ref(null);

function validation() {
  if (formData.value.mtNm === "") {
    dialogStore.openAlertDialog("회의명을 입력해 주세요.", {
      callback: () => {
        mtNmRef.value.focus();
      },
    });
    return true;
  }

  if (formData.value.evalStDt === "") {
    dialogStore.openAlertDialog("관리기간 시작일을 입력해 주세요.", {
      callback: () => {
        evalStDtRef.value.focus();
      },
    });
    return true;
  }

  if (formData.value.evalEnDt === "") {
    dialogStore.openAlertDialog("관리기간 종료일을 입력해 주세요.", {
      callback: () => {
        evalEnDtRef.value.focus();
      },
    });
    return true;
  }

  if (formData.value.mtTm === "") {
    dialogStore.openAlertDialog("회의일시를 입력해 주세요.", {
      callback: () => {
        mtTmRef.value.focus();
      },
    });
    return true;
  }

  if (formData.value.plac === "") {
    dialogStore.openAlertDialog("회의장소를 입력해 주세요.", {
      callback: () => {
        placRef.value.focus();
      },
    });
    return true;
  }

  const totalRowCount = gridApi.value.getDisplayedRowCount();
  if (!totalRowCount) {
    dialogStore.openAlertDialog("대상공종은 한건 이상 등록하셔야 합니다.");
    return true;
  }

  try {
    gridApi.value.forEachNode((obj) => {
      if (!obj.data.contyCd) {
        throw `[${obj.data.id}]번 공종명을 선택해 주세요.`;
      }
      if (!obj.data.evalTblWrtrId) {
        throw `[${obj.data.id}]번 평가담당자를 선택해 주세요.`;
      }
    });
  } catch (error) {
    dialogStore.openAlertDialog(error, { type: "error" });
    return true;
  }

  // 그리드 결재 상태 값 체크
  try {
    gridApi.value.forEachNode(() => {
      // if (obj.data.statsCd !== "T1305" && obj.data.statsCd) {
      //   throw `상태 값이 없거나 미작성인 경우에만 저장할 수 있습니다.`;
      // }
    });
  } catch (error) {
    dialogStore.openAlertDialog(error, { type: "error" });
    return true;
  }

  return false;
}

watch(
  () => {
    return store.$state.contyCdList; // 변경을 감지할 스토어의 값
  },
  (newValue) => {
    contyCdList.value = newValue
      .filter((item) => item.useYn === "Y")
      .reduce(
        (acc, item) => {
          acc[item.contyCd] = item.contyCdNm;
          return acc;
        },
        { "": "[ 공종 선택 ]" }
      );
  }
);
</script>

<style scoped>
.content_box {
  margin-bottom: 30px;
}

#grid01 {
  height: calc(100% - 180px);
}

.left_btn {
  float: left;
}
</style>
