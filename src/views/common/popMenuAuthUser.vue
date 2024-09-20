<!-- 팝업-사용자 등록(결재관리 시 필요한 사용자 선택) -->
<template>
  <comp-modal
    modalTitle="사용자 조회"
    actionBtnText="선택"
    @modal-action="selectedUser"
    @close="$emit('close')"
    height="400px"
    isActions>
    <v-card class="pa-3 ma-3">
      <v-row>
        <v-col>
          <v-label class="font-weight-bold text-subtitle-2 mr-5"
            >사용자명</v-label
          >
          <comp-input v-model="userNm"></comp-input>
        </v-col>
        <v-col cols="2" class="d-flex justify-end">
          <comp-button text="조회" @click="onSearch"> </comp-button>
        </v-col>
      </v-row>
    </v-card>

    <comp-ag-grid
      :rowData="gridRowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
      :localeText="localeText">
    </comp-ag-grid>
  </comp-modal>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compModal from "@/components/modal/compModal.vue";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import { useMenuAuthUserStore } from "@/stores/common/menu-auth-user-store";

const menuAuthUserStore = useMenuAuthUserStore();
const userNm = ref("");
const gridRowData = ref([]);
const gridApi = ref();
const emits = defineEmits(["userInfo", "close"]);
const props = defineProps({
  apprUserParams: {
    type: Object,
    default: null,
  },
  apprUserList: {
    type: Object,
    default: null,
  },
});

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const columnDefs = [
  {
    headerName: "소속",
    field: "vendrNm",
    minWidth: 300,
    maxWidth: 400,
    cellStyle: { textAlign: "left" },
    checkboxSelection: true,
  },
  {
    headerName: "직책",
    field: "jbttlNm",
    minWidth: 120,
    maxWidth: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "성명",
    field: "userNm",
    minWidth: 120,
    maxWidth: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "직위",
    field: "workNm",
    minWidth: 100,
    maxWidth: 120,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "휴대전화",
    field: "crryTelNo",
    width: 110,
  },
];

const defaultColDef = {
  editable: false,
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
};

// 선택

const selectedUser = () => {
  const getRow = gridOptions.api.getSelectedRows()[0];

  emits("userInfo", getRow);
  emits("close");
};

onBeforeMount(() => {
  onSearch();
});

// 조회
async function onSearch() {
  const params = {
    ...props.apprUserParams,
    userNm: userNm.value,
  };

  //사용자 조회
  const userInfoList = await menuAuthUserStore.selectMenuAuthUserList(params);

  if (userInfoList) {
    gridRowData.value = userInfoList;
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}
</script>

<style scoped></style>
