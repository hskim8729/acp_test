<!-- 안전점검활동/위험성평가/팝업-위험성평가 회의 등록 -->

<template>
  <div class="popup add_risk_assmn_cnfrn show">
    <div class="popup_title">
      <span>위험성평가 회의 등록</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="subtitle_area">
        <span class="title">위험성평가 상세</span>
      </div>
      <div class="content_box">
        <div class="grid_item">
          <table>
            <colgroup>
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="70%" />
            </colgroup>
            <thead>
              <tr>
                <th>선택</th>
                <th :colspan="2">구분</th>
                <th>평가 시기</th>
              </tr>
            </thead>
            <tbody class="ta_c">
              <tr>
                <td>
                  <input
                    type="radio"
                    id="evalType01"
                    value="T0801"
                    @change="getValue($event.target.value)"
                    v-model="formData.evalType"
                    :checked="true" /><label for="evalType01">최초</label>
                </td>
                <td :colspan="2">최초평가</td>
                <td style="text-align: left">{{ siteExeRuleStd.intEval }}</td>
              </tr>
              <tr v-if="siteExeRuleStd.riskEvalMthdCd === 'T0401'">
                <td>
                  <input
                    type="radio"
                    id="evalType02"
                    value="T0805"
                    @change="getValue($event.target.value)"
                    v-model="formData.evalType" /><label for="evalType02"
                    >정기</label
                  >
                </td>
                <td :colspan="2">정기평가</td>
                <td style="text-align: left">{{ siteExeRuleStd.rglr }}</td>
              </tr>
              <tr v-if="siteExeRuleStd.riskEvalMthdCd === 'T0401'">
                <td>
                  <input
                    type="radio"
                    id="evalType02"
                    value="T0802"
                    @change="getValue($event.target.value)"
                    v-model="formData.evalType" /><label for="evalType02"
                    >수시</label
                  >
                </td>
                <td :colspan="2">수시평가</td>
                <td style="text-align: left">{{ siteExeRuleStd.occs }}</td>
              </tr>
              <tr v-if="siteExeRuleStd.riskEvalMthdCd === 'T0402'">
                <td :rowspan="2">
                  <input
                    type="radio"
                    id="evalType02"
                    value="T0803"
                    v-model="formData.evalType" /><label for="evalType02"
                    >상시</label
                  >
                </td>
                <td :rowspan="2">상시평가</td>
                <td>월</td>
                <td style="text-align: left">{{ siteExeRuleStd.mon }}</td>
              </tr>
              <!-- <tr v-if="siteExeRuleStd.riskEvalMthdCd === 'T0402'">
                <td>주</td>
                <td style="text-align: left">{{ siteExeRuleStd.week }}</td>
              </tr> -->
            </tbody>
          </table>
        </div>
        <div class="item_wrap w20p">
          <span class="title">회의명</span>
          <input
            type="text"
            class="w230"
            id="mtNm"
            v-model="formData.mtNm"
            placeholder="회의명을 입력해주세요." />
        </div>

        <div class="item_wrap w30p">
          <span class="title">관리기간</span>
          <input
            type="date"
            id="evalStDt"
            style="width: 150px"
            v-model="formData.evalStDt"
            max="9999-12-31" />
          <span> ~ </span>
          <input
            type="date"
            id="evalEnDt"
            style="width: 150px"
            v-model="formData.evalEnDt"
            max="9999-12-31" />
        </div>

        <div class="item_wrap w25p">
          <span class="title">회의일시</span>
          <input
            type="date"
            id="mtTm"
            style="width: 140px"
            v-model="formData.mtTm"
            max="9999-12-31" />&nbsp;
          <input
            type="time"
            id="mtTime"
            style="width: 120px"
            v-model="formData.mtTime" />
        </div>

        <div class="item_wrap w25p">
          <span class="title">회의장소</span>
          <input
            type="text"
            id="plac"
            v-model="formData.plac"
            placeholder="회의장소를 입력해주세요." />
        </div>

        <div class="item_wrap w50p">
          <span class="title">파일첨부</span>
          <button class="file_list_btn" @click="openPopFileAttach">
            파일추가<label>{{ saveFileCnt }}</label>
          </button>
        </div>
      </div>

      <div class="subtitle_area">
        <span class="title">대상공종</span>
        <div class="left_btn">
          <button @click="popupContyCdMgmt">공종편집</button>
        </div>
        <div class="right_btn">
          <button @click="addNewRow">추가</button>
        </div>
      </div>
      <div class="grid_default" id="grid">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions"
          :rowData="gridRowData">
        </ag-grid-vue>
      </div>
    </div>
    <div class="popup_button">
      <button @click="saveRiskAssmnDetail">등록</button>
      <button @click="popupClose">취소</button>
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
    @saveFileCnt="getSaveFileCnt"
    @sendSelectedFiles="getSelectedFiles"
    v-show="isPopFileAttach"
    @close="closePopFileAttach"></pop-file-attach>

  <!-- 공사종류 관리 팝업 -->
  <popContyCdMgmt
    :siteInfo="siteInfo"
    :userInfo="userInfo"
    @close="closePopupContyCdMgmt"
    :isPopContyCd="isPopContyCd"
    :contyList="gridRowData"
    v-if="isPopContyCd">
  </popContyCdMgmt>
</template>

<script setup>
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import popFileAttach from "@/views/common/popFileAttach.vue";
import popContyCdMgmt from "@/views/inspcActvt/popup/popContyCdMgmt.vue";
import popSearchUser from "@/views/inspcActvt/popup/popSearchUser.vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import dayjs from "dayjs";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  siteExeRuleStd: {},
  siteInfo: {},
  userInfo: {},
  cnt: {
    type: Number,
    default: 0,
  },
  isPopAddRiskAssessment: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);
const { vendrCd, siteCd } = props.siteInfo;
const { userId, userNm, workNm } = props.userInfo;
const store = useRiskAssessmentStore();

// 팝업 상태 변수
const isPopContyCd = ref(false);

const userParams = ref();

const gridApi = ref();

const formData = ref({
  mtNm: "",
  evalStDt: "",
  evalEnDt: "",
  mtTm: "",
  mtTime: "",
  plac: "",
  evalType: "T0801",
});

const fileList = ref([]);
const saveFileCnt = ref(0);
const gridRowData = ref([]);
const contyCdList = ref([]);

// 첨부파일 사이즈
let maxFileSize = 0;

const onGridReady = (params) => {
  gridApi.value = params.api;
};

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
    editable: true,
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
      eDiv.innerHTML = `
        <span style="${!params.value ? "color: #a0a0a0;" : ""}">${
        !params.value ? "공종담당자를 선택해 주세요." : params.value
      }</span>
        <button class="search_btn" style="float: right;"></button>
      `;

      const eButton = eDiv.querySelectorAll(".search_btn")[0];

      eButton.onclick = function () {
        openPopSearchUser();
      };

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
    headerName: "삭제",
    field: "stdBtn",
    cellStyle: { textAlign: "center" },
    sortable: false,
    editable: false,
    maxWidth: 80,
    cellRenderer: () => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="del"></button>';

      return eDiv;
    },
    onCellClicked: (params) => {
      if (confirm("삭제하시겠습니까?")) {
        removeRow(params);
      }
    },
  },
];

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
          alert("이미 선택된 공종명 입니다.");

          event.data.contyCd = "";
          gridApi.value.refreshCells({ rowNodes: [event.node] });
        }
      }
    });
  },
};

const saveRiskAssmnDetail = async () => {
  if (validation()) return;

  const data = new FormData();

  const bsParams = {
    vendrCd,
    siteCd,
    userId,
    evalType: formData.value.evalType,
  };

  // 위험성평가 상세정보
  const bsInfo = {
    ...bsParams,
    mtNm: formData.value.mtNm,
    evalStDt: formData.value.evalStDt,
    evalEnDt: formData.value.evalEnDt,
    mtTm:
      formData.value.mtTm.split("-").join("") +
      formData.value.mtTime.split(":").join(""),
    plac: formData.value.plac,
    stats: "T0901",
  };

  let tblInfoList = [];

  // 평가담당자(대상공종) 정보
  gridApi.value.forEachNode((obj, idx) => {
    let tblInfo = {
      ...bsParams,
      contyCd: obj.data.contyCd,
      evalTblWrtrId: obj.data.evalTblWrtrId,
      delYn: "N",
    };

    tblInfoList.push(tblInfo);
  });

  const params = {
    bsInfo,
    tblInfo: tblInfoList,
  };

  // 첨부파일 FormData 추가
  fileList.value.forEach((file, index) => {
    data.append(`files`, file);
  });

  // 위험성평가 회의 등록정보 FormData 추가
  data.append(
    "params",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  if (!confirm("저장하시겠습니까?")) return;

  await store.fetchCreateRiskAssmnCnfrn(data);

  popupClose(true);
  alert("저장이 완료되었습니다.");
};

const addNewRow = () => {
  const objList = Object.keys(contyCdList.value);
  const fliteredList = objList.filter((item) => {
    return item;
  });

  if (!fliteredList.length) {
    alert(
      "등록된 공종이 없거나 사용여부가 활성화된 공종이 없습니다.\r\n공종편집을 확인해 주세요."
    );
    return;
  }
  const cnt = gridApi.value.getDisplayedRowCount() + 1;
  const newItems = { id: cnt, contyCd: "" };
  gridRowData.value.unshift(newItems);
  setGridIdx();
};

const removeRow = (params) => {
  gridRowData.value.splice(params.rowIndex, 1);
  setGridIdx();
};

const getValue = async (typeValue) => {
  // T0802(수시), T0805(정기)
  if (typeValue != "T0801") {
    const params = {
      vendrCd,
      siteCd,
    };

    // 이전 회차 회의의 공종목록 조회 (수시, 상시, 정시만)
    const tblInfoList = await store.fetchRiskAssmnCnfrnDetailContyList(params);
    tblInfoList.forEach((item, idx) => {
      item.id = tblInfoList.length - idx;
    });
    gridRowData.value = tblInfoList;
  } else {
    gridRowData.value = [];
  }
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

const popupClose = (isReload) => {
  formData.value = {
    mtNm: "",
    evalStDt: "",
    evalEnDt: "",
    mtTm: "",
    plac: "",
    evalType: "T0801",
  };

  gridRowData.value = [];

  emits("close", isReload);
};

const getSelectedFiles = (files) => {
  maxFileSize = 0;
  // 첨부파일 사이즈 체크 용도
  files.forEach((file, index) => {
    maxFileSize += file.size;
  });

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

// 공종편집 팝업
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

function validation() {
  if (formData.value.mtNm === "") {
    alert("회의명을 입력해 주세요.");
    document.getElementById("mtNm").focus();
    return true;
  }

  if (formData.value.evalStDt === "") {
    alert("관리기간 시작일을 입력해 주세요.");
    document.getElementById("evalStDt").focus();
    return true;
  }

  if (formData.value.evalEnDt === "") {
    alert("관리기간 종료일을 입력해 주세요.");
    document.getElementById("evalEnDt").focus();
    return true;
  }

  if (formData.value.mtTm === "") {
    alert("회의일자를 입력해 주세요.");
    document.getElementById("mtTm").focus();
    return true;
  }

  if (formData.value.mtTime === "") {
    alert("회의시간를 입력해 주세요.");
    document.getElementById("mtTime").focus();
    return true;
  }

  if (formData.value.plac === "") {
    alert("회의장소를 입력해 주세요.");
    document.getElementById("plac").focus();
    return true;
  }

  const totalRowCount = gridApi.value.getDisplayedRowCount();
  if (!totalRowCount) {
    alert("대상공종은 한건 이상 등록하셔야 합니다.");
    return true;
  }

  if (1024 * 1024 * 10 < maxFileSize) {
    alert("10MB 사이즈 미만만 업로드가 가능합니다.");
    return true;
  }

  // let totalFileSize = 0;
  // // 첨부파일 크기 valid
  // addfiles.forEach((file, index) => {
  //   totalFileSize += file.size;
  //   if(1024*1024*10 < totalFileSize){
  //    alert('10MB 사이즈 미만만 업로드가 가능합니다.');
  //    validChk = false;
  //   }
  // });

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
    alert(error);
    return true;
  }
  return false;
}

onMounted(async () => {
  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
  };

  // 공사종류 코드목록 조회
  let ar = store.fetchContyCdList(param);

  contyCdList.value = store.$state.contyCdList
    .filter((item) => item.useYn === "Y")
    .reduce(
      (acc, item) => {
        acc[item.contyCd] = item.contyCdNm;
        return acc;
      },
      { "": "[ 공종 선택 ]" }
    );

  userParams.value = {
    vendrCd,
    siteCd,
    userId,
    userNm,
    workNm,
    menuId: "2001100", // 위험성평가 표 목록 권한을 가진 유저를 조회하기 위해서
  };

  if (props.cnt === 0) {
    formData.value.evalStDt = dayjs(props.siteInfo.actvStDt).format(
      "YYYY-MM-DD"
    );
    formData.value.evalEnDt = dayjs(props.siteInfo.actvEnDt).format(
      "YYYY-MM-DD"
    );
  }
});

watch(
  () => {
    return store.$state.contyCdList; // 변경을 감지할 스토어의 값
  },
  (newValue, oldValue) => {
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
.grid_item {
  margin-bottom: 10px;
}
#grid {
  height: calc(100% - 431px);
}
.left_btn {
  float: left;
  margin-left: 10px;
  vertical-align: middle;
}
.right_btn {
  vertical-align: middle;
}

.add_risk_assmn_cnfrn {
  width: 90%;
  height: 95%;
}

.item_wrap .title {
  width: 55px;
  text-align: right;
}
.file_list_btn {
  margin-left: 0px;
}
.subtitle_area .title {
  vertical-align: middle;
}
</style>
