<template>
  <div class="d-flex flex-row">
    <div class="text-subtitle-4">{{ title }}</div>
    <v-spacer></v-spacer>
    <comp-button
      type="add"
      icon="mdi-plus"
      class="mr-2"
      @click="addRow"></comp-button>
    <comp-button
      text="삭제"
      variant="outlined"
      icon="mdi-delete-outline"
      @click="deleteRow"></comp-button>
  </div>
  <v-sheet :height="height">
    <compAgGrid
      type="addDelete"
      :columnDefs="columnDefs"
      :rowData="array"
      @get-grid-api="onGetParams" />
  </v-sheet>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import compButton from "@/components/button/compButton.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useSafeExpertsStore } from "@/stores/safeConfirmDuty/safe-experts-store.js";

const props = defineProps({
  expType: {
    type: String,
    default: "career",
  },
  title: {
    type: String,
    default: "career",
  },
});

const height = computed(() => {
  let baseValue = 160;
  const length = array.value.length;
  if (length === 0 || length === 1) {
    return baseValue;
  } else {
    return baseValue - 16 + (length - 1) * 62; // length가 2부터 시작하므로 length-1을 사용
  }
});

const dialogStore = useDialogStore();
const safeExpertsStore = useSafeExpertsStore();
const { selectedExpert } = storeToRefs(safeExpertsStore);

const array = computed({
  get: () => {
    return props.expType === "career"
      ? selectedExpert.value.career
      : selectedExpert.value.education;
  },
  set: (value) => {
    if (props.expType === "career") {
      selectedExpert.value.career = value;
    } else {
      selectedExpert.value.education = value;
    }
  },
});

/**
 * 조치 결과 컬럼 정의
 */
const columnDefs = [
  {
    headerName: props.expType === "career" ? "기관명" : "학교",
    field: "organization",
    flex: 2,
    type: ["textEditor", "placeholder"],
  },
  {
    headerName: "시작일자",
    field: "from",
    flex: 1,
    type: ["dateEditor"],
    hide: props.expType !== "career",
  },
  {
    headerName: "종료일자",
    field: "to",
    flex: 1,
    type: ["dateEditor"],
    hide: props.expType !== "career",
  },
  {
    headerName: "내역",
    field: "detail",
    flex: 2,
    type: ["textEditor", "placeholder"],
    cellRendererParams: {
      placeholder: "내용을 입력해주세요(선택)",
    },
    hide: props.expType === "career",
  },
];

const addRow = async () => {
  await safeExpertsStore.addRow(props.expType);
  gridApi.setRowData(array.value);
};

const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await safeExpertsStore.deleteRow(seletedRows, props.expType);
  // gridApi.setRowData(budgets.value);
};

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
  gridApi.setRowData(array.value);
};
</script>

<style lang="scss" scoped></style>
