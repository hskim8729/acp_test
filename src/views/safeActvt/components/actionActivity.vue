<!-- 중점/일상 조치 -->

<template>
  <compPage :title="`${inspClsNm} 조치`">
    <compPageCard isFillPage :isSearchBtn="true" @clickSearchBtn="doSearch">
      <template #queryArea>
        <v-col>
          <span class="title">기준년월</span>
          <input type="month" v-model="crtrDt" />
        </v-col>
        <v-col>
          <span class="title">조치상태</span>
          <select v-model="inspRstSel">
            <option value="">전체</option>
            <option value="0002">조치요청</option>
            <option value="0003">조치완료</option>
          </select>
        </v-col>
      </template>
      <template #subTitle>
        <span class="title">{{ inspClsNm }} 목록</span>
      </template>
      <template #default>
        <comp-ag-grid
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="grid1RowData"
          :gridOptions="grid1Options"
          :singleClickEdit="true"
          @get-grid-api="getGridApi">
        </comp-ag-grid>
      </template>
    </compPageCard>
  </compPage>

  <!-- 점검 조치 팝업 -->
  <popActivityAction
    v-if="isPopActivityAction"
    @close="closePopActivityAction"
    :title="`${inspClsNm} 조치`"
    :rowParams="rowParams">
  </popActivityAction>
</template>

<script setup>
import { onMounted, ref, defineProps } from "vue";
import dayjs from "dayjs";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import popActivityAction from "@/views/safeActvt/popActivityAction.vue";
import {
  defaultColumnSafeActvt,
  defaultGridOptionSafeActvt,
} from "@/views/safeActvt/common/comGridSafeActvt.vue";

import commonService from "@/api/common-service.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";

// Store Data
const loginStore = useLoginAuthStore();
const store = useMajorStore();
const dialogStore = useDialogStore();

const props = defineProps({
  inspClsCd: {
    type: String,
    default: "T0201",
  },
});

const today = dayjs().format("YYYY-MM");
const crtrDt = ref(today);
const inspRstSel = ref("");
const inspClsNm = ref(props.inspClsCd === "T0201" ? "중점점검" : "일상점검");

/**
 * 그리드 설정
 */
const gridApi = ref();
const getGridApi = (params) => {
  gridApi.value = params.api;
};

const grid1RowData = ref([]);
const grid1Options = { ...defaultGridOptionSafeActvt };
const columnDefs = [
  ...defaultColumnSafeActvt, // 중점/일상 그리드 공통 컬럼 불러오기
  {
    headerName: "조치예정일",
    field: "actExptDt",
    cellStyle: (params) => {
      const dt = params.data.actExptDt;
      const today = dayjs().format("YYYYMMDD");
      if (dt == today) {
        return { textAlign: "center", color: "blue" };
      } else if (dt < today) {
        return { textAlign: "center", color: "red" };
      }
    },
    width: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actExptDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "조치일",
    field: "actDt",
    cellStyle: { textAlign: "center" },
    width: 120,
    maxWidth: 120,
    cellRenderer: (params) => {
      const dt = dayjs(params.data.actDt);
      return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
    },
  },
  {
    headerName: "상세보기",
    field: "confirmStatus",
    pinned: "right",
    cellStyle: { textAlign: "center" },
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        openPopActivityAction(params.data);
      },
      type: "modify",
    }),
  },
];

/**
 * 조회
 */
const doSearch = async () => {
  let inspRst = inspRstSel.value;

  const params = {
    vendrCd: loginStore.siteInfo.vendrCd,
    siteCd: loginStore.siteInfo.siteCd,
    crtrDt: crtrDt.value.replaceAll("-", ""),
    userId: loginStore.userInfo.userId,
    inspCls: props.inspClsCd, //T0201: 중점 / T0202: 일상
    inspRst: inspRst || "",
  };

  await commonService
    .axiosCall("/v1/safeActvt/actActv", params)
    .then((result) => {
      if (result.status === 200) {
        grid1RowData.value = result.data;
      } else {
        dialogStore.openAlertDialog(res.data.message);
      }
    });
};

onMounted(() => {
  doSearch();
});

/**
 * 중점/일상점검 조치 Modal
 */
let rowParams = ref({});

const isPopActivityAction = ref(false);

const openPopActivityAction = async (data) => {
  rowParams.value = data;

  isPopActivityAction.value = true;
};

const closePopActivityAction = (isReload) => {
  isPopActivityAction.value = false;

  if (isReload) {
    doSearch();
  }
};
</script>

<style scoped></style>
