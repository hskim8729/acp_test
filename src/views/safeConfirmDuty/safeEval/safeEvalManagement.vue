<template>
  <compPageCard isFillPage>
    <template #multiCard="{ height }">
      <v-row dense>
        <v-col xxl="5" xl="5" lg="5" md="10" sm="10" xs="10">
          <comp-card :height="height">
            <template #defaultCard>
              <comp-ag-grid
                class="ag-theme-alpine"
                :columnDefs="userGridColDefs"
                :rowData="userGridRowData"
                :gridOptions="gridOptions2"
                @row-clicked="selectUserEvalList"
                @get-grid-api="getGridApi">
              </comp-ag-grid>
            </template>
          </comp-card>
        </v-col>
        <v-col>
          <comp-card :height="height">
            <template #defaultCard>
              <comp-ag-grid
                class="ag-theme-alpine"
                :columnDefs="evalGridColumnDefs"
                :rowData="evalGridRowData"
                :gridOptions="gridOptions2"
                @get-grid-api="getGridApi">
              </comp-ag-grid>
            </template>
          </comp-card>
        </v-col>
      </v-row>
    </template>
  </compPageCard>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compCard from "@/components/layout/compCard.vue";
import compPageCard from "@/components/layout/compPageCard.vue";

const { lgAndUp } = useDisplay();

/**
 * 평가대상 그리드
 */
//const userGridRowData = ref([]);
const userGridColDefs = [
  {
    headerName: "회사명",
    field: "vendrNm",
    flex: 3,
  },
  {
    headerName: "성명",
    field: "userNm",
    flex: 1,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "직위",
    field: "jbttlNm",
    flex: 1,
  },
  {
    headerName: "이메일",
    field: "email",
    flex: 3,
  },
  {
    headerName: "평가일자",
    field: "evalDt",
    flex: 2,
  },
];

const userGridRowData = ref([
  {
    vendrNm: "아시아나IDT",
    userNm: "김안전",
    jbttlNm: "부장",
    email: "test1@asianidt.com",
    evalDt: "미실시",
  },
  {
    vendrNm: "아시아나IDT",
    userNm: "최안전",
    jbttlNm: "과장",
    email: "test2@asianidt.com",
    evalDt: "2024-01-02",
  },
  {
    vendrNm: "아시아나IDT",
    userNm: "최안전",
    jbttlNm: "과장",
    email: "test3@asianidt.com",
    evalDt: "미실시",
  },
]);

/**
 * 평가 그리드
 */
//const evalGridRowData = ref([]);
const gridApi = ref();
// const gridColumnApi = ref();
const localeText = { noRowsToShow: "조회 결과가 없습니다." };

function getGridApi(params) {
  gridApi.value = params.api;
  // gridColumnApi.value = params.columnApi;
}

const gridOptions2 = ref({
  headerHeight: 40,
  rowHeight: 53,
  //defaultColDef: defaultColDef,
  localeText: localeText,
  rowSelection: "single",
});

const defaultColDef = {
  editable: false,
  sortable: true,
  flex: 2,
  minWidth: 50,
  filter: false,
  resizable: false,
  headerClass: "centered",
  cellClass: "centered",
};

const evalGridColumnDefs = [
  {
    headerName: "평가 항목",
    field: "safeEvalItemNm",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 5,
    //editable: true,
  },
  {
    headerName: "평가 기준",
    field: "safeEvalStandard",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 5,
  },
  {
    headerName: "배점",
    field: "point",
    flex: 1,
  },
  {
    headerName: "결과",
    field: "score",
    singleClickEdit: true,
    editable: true,
    flex: 1,
  },
];

const evalGridRowData = ref([
  {
    safeEvalId: 0,
    safeEvalItemSeq: 1,
    safeEvalItemNm:
      "작업장 안전관리 점검 평가(기계·기구·설비, 정리정돈 통로확보 등)",
    safeEvalStandard: "양호 : 법령에 따른 업보를 적정하게 수행함",
    jbttlCd: "T0101",
    point: 10,
  },
  {
    safeEvalId: 0,
    safeEvalItemSeq: 1,
    safeEvalItemNm: "산업재해 재발방지 조치",
    safeEvalStandard: "경영방침에 부합한 산업재해 예방계획이 수립되었는지",
    jbttlCd: "T0101",
    point: 10,
  },
]);

const emptyData = {
  safeEvalItemNm: "항목을 입력해주세요",
  safeEvalStandard: "기준을 입력해주세요",
  point: 0,
};

const selectUserEvalList = (row) => {
  row.node.setSelected(true);
  console.log("사용자별 평가 조회 + ", row);
  console.log("사용자별 평가 조회 + ", row.data);
};
</script>

<style></style>
