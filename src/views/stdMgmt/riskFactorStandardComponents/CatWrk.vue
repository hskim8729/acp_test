<template>
  <div class="cat-work-container">
    <ag-grid-vue
      style="width: 100%; height: calc(100% - 70px); margin-right: 20px"
      class="ag-theme-alpine"
      :headerHeight="40"
      :rowHeight="53"
      :columnDefs="columnStdList"
      :rowData="datalist"
      :defaultColDef="defaultColDef"
      :undoRedoCellEditing="true"
      :undoRedoCellEditingLimit="20"
      :localeText="localeText"
      @grid-ready="onGridReady"
      @modelUpdated="handleModelUpdated"
      row-selection="single"
      :stopEditingWhenCellsLoseFocus="true">
    </ag-grid-vue>
    <AddCatWrk
      v-if="selectedVenderCd == vendrCd"
      :grid-api="gridApi"
      :type="type"
      @scroll="handleScroll" />
  </div>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";
import AddCatWrk from "./AddCatWrk.vue";

const store = useRiskFactorStandardStore();

const {
  defaultColDef,
  localeText,
  cntFormatter,
  cntParser,
  type,
  datalist,
  handleScroll,
} = defineProps([
  "defaultColDef",
  "localeText",
  "cntFormatter",
  "cntParser",
  "type",
  "datalist",
  "handleScroll",
]);

const {
  vendrCd,
  selectedVenderCd,
  selectedHrmrskFctrMstSeq,
  selectedLgCatCd,
  selectedLgCatNm,
  selectedMdCatCd,
  selectedMdCatNm,
  selectedWrkNmCd,
  selectedWrkNm,
  lgCatList,
  mdCatList,
  wrkList,
} = storeToRefs(store);

let headerName;
let name;
let code;

switch (type) {
  case "lg":
    headerName = "대분류";
    name = "lgCatNm";
    code = "lgCatCd";
    break;
  case "md":
    headerName = "중분류";
    name = "mdCatNm";
    code = "mdCatCd";
    break;
  case "wrk":
    headerName = "작업명";
    name = "wrkNm";
    code = "wrkNmCd";
    break;
  default:
    headerName = "기본값"; // type이 'lg', 'md', 'wrk'가 아닌 경우를 대비한 기본값
}

// ag-grid 조작
const gridApi = ref();
const onGridReady = (params) => {
  gridApi.value = params.api;
};

const selectRowByCode = (gridApi, cd) => {
  gridApi.value.forEachLeafNode((node) => {
    if (node.data[code] === cd) {
      node.setSelected(true);
      gridApi.value.ensureIndexVisible(node.rowIndex);
    }
  });
};

const handleModelUpdated = () => {
  // 그리드가 재렌더링 될 때 실행, fetch 완료 후 선택되도록 setTimeout
  setTimeout(() => {
    if (type === "lg" && selectedLgCatCd.value != "") {
      selectRowByCode(gridApi, selectedLgCatCd.value);
    } else if (type === "md" && selectedMdCatCd.value != "") {
      selectRowByCode(gridApi, selectedMdCatCd.value);
    } else if (type === "wrk" && selectedWrkNmCd.value != "") {
      selectRowByCode(gridApi, selectedWrkNmCd.value);
    }
  }, 50);
};

const fetchMdListDebounced = debounce(async () => {
  // watch가 3가지 변수를 보고있어서 일정 시간동안 한번만 작동하도록 변경
  const watchParam = {
    vendrCd: selectedVenderCd.value,
    hrmrskFctrMstSeq: selectedHrmrskFctrMstSeq.value,
    lgCatCd: selectedLgCatCd.value,
  };
  await store.fetchMdCatList(watchParam).then((list) => {
    // 불러오는 중분류 목록의 lgCatCd와 mdCatCd가 현재 선택한것과 같으면 행 선택만 함
    const exist = mdCatList.value.find(
      (data) =>
        data.lgCatCd === selectedLgCatCd.value &&
        data.mdCatCd === selectedMdCatCd.value
    );
    if (exist) {
      handleModelUpdated();
    } else {
      selectedMdCatCd.value = list.length == 0 ? "" : list[0][code];
      selectedMdCatNm.value = list.length == 0 ? "" : list[0][name];
    }
  });
  // }
}, 50);

const fetchWrkListDebounced = debounce(async () => {
  // watch가 4가지 변수를 보고있어서 일정 시간동안 한번만 작동하도록 변경
  const watchParam = {
    vendrCd: selectedVenderCd.value,
    hrmrskFctrMstSeq: selectedHrmrskFctrMstSeq.value,
    lgCatCd: selectedLgCatCd.value,
    mdCatCd: selectedMdCatCd.value,
  };
  await store.fetchWrkList(watchParam).then((list) => {
    const exist = wrkList.value.find(
      (data) =>
        data.lgCatCd === selectedLgCatCd.value &&
        data.mdCatCd === selectedMdCatCd.value &&
        data.wrkNmCd === selectedWrkNmCd.value
    );
    if (exist) {
      handleModelUpdated();
    } else {
      selectedWrkNmCd.value = list.length == 0 ? "" : list[0][code];
      selectedWrkNm.value = list.length == 0 ? "" : list[0][name];
    }
  });
  // }
}, 100);

if (type === "lg") {
  watch(
    [selectedVenderCd, selectedHrmrskFctrMstSeq],
    async () => {
      if (
        selectedVenderCd.value != "" &&
        selectedHrmrskFctrMstSeq.value != ""
      ) {
        const watchParam = {
          vendrCd: selectedVenderCd.value,
          hrmrskFctrMstSeq: selectedHrmrskFctrMstSeq.value,
        };
        // 대분류 리스트 불러옴
        await store.fetchLgCatList(watchParam).then((list) => {
          selectedLgCatCd.value = list.length == 0 ? "" : list[0][code];
          selectedLgCatNm.value = list.length == 0 ? "" : list[0][name];
        });
      }
    },
    { immediate: true }
  );
  watch(selectedLgCatCd, () => {
    selectRowByCode(gridApi, selectedLgCatCd.value);
  });
} else if (type === "md") {
  watch(
    [selectedVenderCd, selectedHrmrskFctrMstSeq, selectedLgCatCd],
    fetchMdListDebounced
  );
  watch(selectedMdCatCd, () => {
    selectRowByCode(gridApi, selectedMdCatCd.value);
  });
} else if (type === "wrk") {
  watch(
    [
      selectedVenderCd,
      selectedHrmrskFctrMstSeq,
      selectedLgCatCd,
      selectedMdCatCd,
    ],
    fetchWrkListDebounced
  );
  watch(selectedWrkNmCd, () => {
    selectRowByCode(gridApi, selectedWrkNmCd.value);
  });
}

const columnStdList = ref([
  {
    headerName: headerName,
    field: name,
    valueFormatter: cntFormatter,
    valueParser: cntParser,
    cellStyle: { textAlign: "left" },
    editable: () => selectedVenderCd.value === vendrCd.value,
    onCellClicked: onClicked,
    onCellValueChanged: onCellValueChanged,
    width: 200,
    maxWidth: 600,
    resizable: false,
  },
  {
    headerName: "",
    field: "del",
    cellStyle: { textAlign: "center" },
    editable: false,
    sortable: false,
    resizable: false,
    width: 60,
    maxWidth: 60,
    onCellClicked: onDelClicked,
    cellRenderer: (params) => {
      if (selectedVenderCd.value === vendrCd.value) {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="del"></button>';
        return eDiv;
      }
    },
  },
]);

// type에 따라 호출할 함수를 설정하는 매핑 객체
const storeFectchFunctions = {
  lg: store.fetchLgCat,
  md: store.fetchMdCat,
  wrk: store.fetchWrk,
};

// 셀 클릭
const emit = defineEmits(["scroll"]);

async function onClicked(event) {
  event.node.setSelected(true);
  if (type === "lg") {
    selectedLgCatCd.value = event.data[code];
    selectedLgCatNm.value = event.data[name];
  } else if (type === "md") {
    selectedMdCatCd.value = event.data[code];
    selectedMdCatNm.value = event.data[name];
  } else if (type === "wrk") {
    selectedWrkNmCd.value = event.data[code];
    selectedWrkNm.value = event.data[name];
    emit("scroll");
  }
}

// 셀 내용 수정
async function onCellValueChanged(event) {
  if (vendrCd.value === selectedVenderCd.value) {
    // type에 해당하는 함수를 가져옵니다.
    const fetchFunc = storeFectchFunctions[type];
    let duplicatedItemCnt = -1;
    if (type == "lg") {
      duplicatedItemCnt = lgCatList.value.filter(
        (data) => data[name] === event.newValue
      ).length;
    } else if (type == "md") {
      duplicatedItemCnt = mdCatList.value.filter(
        (data) => data[name] === event.newValue
      ).length;
    } else {
      duplicatedItemCnt = wrkList.value.filter(
        (data) => data[name] === event.newValue
      ).length;
    }

    if (duplicatedItemCnt >= 2) {
      alert(event.newValue + "은 이미 존재합니다.");
      const colId = event.column.colId;
      const rowNode = gridApi.value.getRowNode(event.node.id);
      rowNode.setDataValue(colId, event.oldValue);
    } else if (!event.newValue) {
      alert("빈칸을 입력할 수 없습니다.");
      const colId = event.column.colId;
      const rowNode = gridApi.value.getRowNode(event.node.id);
      rowNode.setDataValue(colId, event.oldValue);
    } else {
      const params = {};
      params["mode"] = "U";
      params[name] = event.newValue;
      params[code] = event.data[code];
      if (fetchFunc) {
        // 함수가 존재하는지 확인
        await fetchFunc(params).then(() => {
          if (type == "lg") {
            selectedLgCatCd.value = lgCatList.value.find(
              (lg) => lg.lgCatNm == event.newValue
            ).lgCatCd;
            selectedLgCatNm.value = event.newValue;
          } else if (type == "md") {
            selectedMdCatCd.value = mdCatList.value.find(
              (md) => md.mdCatNm == event.newValue
            ).mdCatCd;
            selectedMdCatNm.value = event.newValue;
          } else {
            selectedWrkNmCd.value = wrkList.value.find(
              (wrk) => wrk.wrkNm == event.newValue
            ).wrkNmCd;
            selectedWrkNm.value = event.newValue;
          }
        });
        // for (let i = 0; i < newList.length; i++) {
        //   if (newList[i][name] === event.newValue) {
        //     newCode = newList[i][code]
        //   }
        // }
      } else {
        console.error(`Invalid type: ${type}`);
      }
    }
  } else {
    onClicked(event);
  }
}

// 삭제
async function onDelClicked(event) {
  if (selectedVenderCd.value === vendrCd.value) {
    if (confirm("삭제 하시겠습니까?") === true) {
      // type에 해당하는 함수를 가져옵니다.
      const fetchFunc = storeFectchFunctions[type];

      const params = {};
      params["mode"] = "D";
      params[code] = event.data[code];
      let isEmpty = true;
      if (fetchFunc) {
        // 함수가 존재하는지 확인
        await fetchFunc(params).then((list) => {
          gridApi.value.forEachLeafNode((node) => {
            if (node.id === "0") {
              node.setSelected(true);
              gridApi.value.ensureIndexVisible(node.rowIndex);
              isEmpty = false;
            }
          });

          if (type == "lg") {
            selectedLgCatCd.value = isEmpty ? "" : lgCatList.value[0].lgCatCd;
            selectedLgCatNm.value = isEmpty ? "" : lgCatList.value[0].lgCatNm;
          } else if (type == "md") {
            selectedMdCatCd.value = isEmpty ? "" : mdCatList.value[0].mdCatCd;
            selectedMdCatNm.value = isEmpty ? "" : mdCatList.value[0].mdCatCd;
          } else if (type == "wrk") {
            selectedWrkNmCd.value = isEmpty ? "" : wrkList.value[0].wrkNmCd;
            selectedWrkNm.value = isEmpty ? "" : wrkList.value[0].wrkNm;
          }
        });
      } else {
        console.error(`Invalid type: ${type}`);
      }
    }
  }
}

// const changeCnt = (num) => {
//   if (type === 'md') {
//     const item = lgCatList.value.find((item) => item.lgCatCd === selectedLgCatCd.value);
//     console.log("체인지", num, item)
//     if (item) item.cnt += num;
//   } else if (type === 'wrk') {
//     const item = mdCatList.value.find((item) => item.mdCatCd === selectedMdCatCd.value);
//     console.log("체인지", num, item)
//     if (item) item.cnt += num;
//   }
// }
</script>

<style scoped>
.ag-theme-alpine {
  float: left;
}

.cat-work-container {
  height: 100%;
  width: calc(32%);
}
</style>
