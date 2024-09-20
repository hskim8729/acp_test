<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage">
    <!-- 버튼 영역 -->
    <template #toolbarBody>
      <comp-button
        type="save"
        text="저장"
        class="mr-1"
        @click="clickSave"></comp-button>
      <comp-button type="print" text="출력" class="ml-1"></comp-button>
    </template>
    <template #infoBody>
      <div class="text-body-5 text-gray400 py-1">
        <p>
          ※ 전담조직 설치 대상 : 산업안전보건법에 따른 전문인력(안전관리자,
          보건관리자, 산업보건의)을 총 3명 이상(위탁인력 포함) 두어야 하면서,
          상시근로자수 500인 이상(또는 건설 시공능력 순위 상위 200위 이내)인
          사업 또는 사업장
        </p>
      </div>
      <v-divider class="my-2" />
      <div class="d-flex align-center">
        <div class="text-subtitle-6 pr-5">
          상시근로자 50인 미만 기업이신가요?
        </div>
        <v-radio-group
          v-model="condition"
          hide-details="auto"
          inline
          density="compact">
          <v-radio label="예" :value="true"></v-radio>
          <v-radio label="아니요" :value="false" class="ml-2"></v-radio>
        </v-radio-group>
      </div>
    </template>
    <!-- 본문 영역 -->
    <template #contents v-if="condition">
      <comp-add-delete-grid
        :columnDefs="columnDefs"
        :rowData="safeEvalItemList" />
    </template>
    <template #pageCard v-if="!condition"></template>
  </comm-safe-duty>
</template>

<script setup>
import { onMounted, ref } from "vue";

import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";

import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();
const commSafeDutyParams = {
  pageTitle: "안전보건 전담조직 설치",
  infoMessage: `<span class="text-red font-weight-bold">상시근로자 50인 미만 기업</span>의 경우, 중대재해처벌법상 전담조직 설치 의무가 없습니다.`,
};
const condition = ref(true);

const columnDefs = [
  {
    headerName: "직무",
    field: "actClsNm",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 1,
    editable: true,
  },
  {
    headerName: "업무분장",
    field: "actProcedure",
    singleClickEdit: true,
    cellEditor: "agLargeTextCellEditor",
    cellStyle: { textAlign: "left" },
    flex: 5,
    editable: true,
  },
];

const safeEvalItemList = ref([
  {
    actClsNm: "대표이사",
    actProcedure: `가. 안전보건경영방침의 제정 및 승인
나. 안전보건경영목표 및 세부추진계획의 승인
다. 안전보건경영시스템 이행여부 확인
라. 시스템의 실행을 위한 인적, 기술적, 재정적 자원 제공 마. 안전보건경영매뉴얼 승인
바. 경영자 검토 및 승인
사. 비상사태에 대한 대책 수립 승인`,
  },
  {
    actClsNm: "안전보건관리임원",
    actProcedure: `가. 회사 안전보건경영시스템이 원청회사의 요구사항에 따라 수립, 실 행 및 유지되도록 보장 
나. 회사의 안전보건경영 실적에 대한 결과내용 검토 다. 안전보건경영시스템의 주기적 점검과 교육 라. 위험성 평가 이행에 관련된 사항 확인 마. 비상사태에 대한 대책 수립 검토`,
  },
]);

// const emptyData = {
//   safeEvalItemNm: "내용을 입력해주세요",
//   // safeEvalStandard: "기준을 입력해주세요",
//   point: 0,
// };

/**
 *  조회
 */
const query = ref({ historySeq: "", historyNm: "" });
const safeInfo = ref({ policy: "", objective: "" });
const historyList = ref([]);

const doSearch = () => {};

/**
 * 저장
 */
const clickSave = () => {
  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      doSave();
    },
  });
};

const doSave = () => {
  // TODO axios 호출
};

onMounted(() => {
  //doSearch();
});
</script>
<style></style>
