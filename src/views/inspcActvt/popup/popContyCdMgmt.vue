<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="pop_in_pop conty_cd_mgmt popup_bg2 show">
    <div class="popup_title">
      <span>공사종류 관리</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="subtitle_area">
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
      <button @click="saveContyCd">저장</button>
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ref, onMounted } from "vue";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import { AgGridVue } from "ag-grid-vue3";

const props = defineProps(["siteInfo", "userInfo", "contyList"]);
const emits = defineEmits(["close"]);
const store = useRiskAssessmentStore();

const gridRowData = ref([]);
const gridApi = ref();
const gridColumnApi = ref();

const onGridReady = (params) => {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs = [
  {
    headerName: "공종 명",
    field: "contyCdNm",
    width: 80,
    editable: (params) => isGridEditable(params),
    cellStyle: (params) => {
      return { backgroundColor: gridEditColor(params) };
    },
  },
  {
    headerName: "공종 설명",
    field: "contyCdDc",
    width: 100,
    editable: (params) => isGridEditable(params),
    cellStyle: (params) => {
      return { backgroundColor: gridEditColor(params) };
    },
  },
  {
    headerName: "사용 여부",
    field: "useYn",
    editable: false,
    minWidth: 100,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      if (params.data.useYn == "N")
        eDiv.innerHTML =
          '<div class="switch off"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      else
        eDiv.innerHTML =
          '<div class="switch on"><div class="click_area"></div><div class="dot"></div><span></span></div>';
      const eButton = eDiv.querySelectorAll(".click_area")[0];

      if (isGridEditable(params)) {
        if (params.data.mode != "I") {
          eButton.onclick = function (event) {
            params.data.modified = true;
            if (event.target.parentElement.classList.contains("on")) {
              event.target.parentElement.classList.replace("on", "off");
              params.data.useYn = "N";
            } else {
              event.target.parentElement.classList.replace("off", "on");
              params.data.useYn = "Y";
            }
          };
        }
      }

      return eDiv;
    },
    cellStyle: (params) => {
      return { backgroundColor: gridEditColor(params) };
    },
  },
  {
    headerName: "삭제",
    field: "stdBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    minWidth: 80,
    cellRenderer: (params) => {
      if (isGridEditable(params)) {
        const eDiv = document.createElement("div");
        eDiv.classList.add("cell_center");
        eDiv.innerHTML = '<button class="del"></button>';
        const eButton = eDiv.querySelectorAll(".del")[0];

        eButton.onclick = function () {
          if (confirm("삭제하시겠습니까?")) {
            removeRow(params);
          }
        };

        return eDiv;
      }
    },
    cellStyle: (params) => {
      return { backgroundColor: gridEditColor(params) };
    },
  },
  {
    headerName: "Modified",
    field: "modified",
    hide: true,
    valueGetter: () => false,
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
  cellStyle: { textAlign: "center" },
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
  rowSelection: "single",
  onGridReady: onGridReady,
  onCellValueChanged: onCellValueChanged,
};

const popupClose = () => {
  emits("close");
};

const saveContyCd = async (params) => {
  let contyCdList = [];
  let hasEmptyContyCdNm = false;

  gridApi.value.forEachNodeAfterFilter((node) => {
    // 빈 값이 있는 경우에 대한 처리
    if (!node.data.contyCdNm) {
      hasEmptyContyCdNm = true;
    }

    // 여기에서 필터링된 노드에 대한 작업 수행
    if (node.data.modified) {
      let contyCd = {
        ...node.data,
        vendrCd: props.siteInfo.vendrCd,
        siteCd: props.siteInfo.siteCd,
        userId: props.userInfo.userId,
      };
      contyCdList.push(contyCd);
    }
  });

  if (hasEmptyContyCdNm) {
    alert("작성되지 않은 공종 명이 있습니다.");
  } else if (contyCdList.length > 0) {
    await store.modifyContyCd(contyCdList);
    await onSearch();
  } else {
    alert("변경사항이 없습니다.");
  }
};

const addNewRow = () => {
  let totalRowCount = gridApi.value.getDisplayedRowCount();
  const newItems = [
    {
      sortOrdr: totalRowCount + 1,
      useYn: "Y",
      contyCd: "",
      modified: true,
      isEditable: true,
    },
  ];

  gridApi.value.applyTransaction({
    add: newItems,
    addIndex: 0,
  });
};

const removeRow = async (params) => {
  const selectedData = [params.data];

  if (params.data.contyCd) {
    const delInfo = await store.deleteContyCd(params.data);

    if (delInfo.cnt === 0) {
      gridApi.value.applyTransaction({ remove: selectedData });
    }

    if (delInfo.msg) {
      alert(delInfo.msg);
    }
  } else {
    gridApi.value.applyTransaction({ remove: selectedData });
  }
};

function onCellValueChanged(event) {
  // 셀 값이 변경되면 modified 플래그를 true로 설정(변경된 값만 서버로 보내기 위해)
  event.data.modified = true;
}

const onSearch = async () => {
  gridRowData.value = await store.$state.contyCdList;
  setGridEditable();
};

const setGridEditable = () => {
  // 현재 사용중인 공종은 수정/삭제 불가능.
  gridRowData.value.forEach((gridEl) => {
    let isEditable = true;

    props.contyList.forEach((contyEl) => {
      if (contyEl.contyCd === gridEl.contyCd) {
        isEditable = false;
        return false;
      }
    });

    gridEl.isEditable = gridEl.contyCnt < 1 && isEditable;
  });
};

const isGridEditable = (params) => {
  return params.data.isEditable;
};

const gridEditColor = (params) => {
  if (!isGridEditable(params)) {
    return "#f4f4f4";
  }
};

onMounted(() => {
  onSearch();
});
</script>

<style scoped>
#grid {
  height: calc(100% - 40px);
}
.conty_cd_mgmt {
  width: 50%;
  height: 90%;
}
</style>
