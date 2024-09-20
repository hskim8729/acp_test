<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage">
    <template #toolbarBody>
      <comp-button
        type="save"
        text="저장"
        class="mr-1"
        @click="clickSave"></comp-button>
    </template>
    <template #contents>
      <comp-add-delete-grid
        :columnDefs="columnDefs"
        :rowData="safeEvalItemList"
        :empty-data="emptyData" />
    </template>
  </comm-safe-duty>
</template>

<script setup>
import { onMounted, ref } from "vue";

import compAddDeleteGrid from "@/components/grid/compAddDeleteGrid.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";

import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const commSafeDutyParams = {
  pageTitle: "재해대응 매뉴얼",
  infoMessage: `매뉴얼은 모든 구성원이 쉽게 이해하고 신속하게 실천할 수 있도록 <span class="text-red font-weight-bold">단순·명확하게 작성</span>하는 것이 좋습니다.<br>
    <span class="font-weight-bold">상황별 구체적인 행동</span>, 연락처는 <span class="font-weight-bold">대상을 특정하고 전화번호를 기입</span>하면 좋습니다.<br>
    효과적인 비상상황 대응을 위한 대응훈련(시뮬레이션) 실시를 권장합니다.<br>
    매뉴얼에 따른 조치 여부를 주기적으로 점검하고, 점검결과에 따라 필요한 조치를 합니다.`,
};

const columnDefs = [
  {
    headerName: "구분",
    field: "actClsNm",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 1,
    editable: true,
  },
  {
    headerName: "행동 및 조치절차",
    field: "actProcedure",
    singleClickEdit: true,
    cellEditor: "agLargeTextCellEditor",
    cellStyle: { textAlign: "left" },
    flex: 5,
    editable: true,
  },
  {
    headerName: "업무수행",
    field: "performer",
    flex: 1,
    editable: true,
  },
];

const safeEvalItemList = ref([
  {
    actClsNm: "중대산업재해 발생",
    actProcedure:
      "▶  발생 즉시 해당 작업을 중지하여 추가 피해를 방지한다. \n" +
      "▶  최초 발견자는 휴대폰, 무전기, 유선 이용해서 발생장소 및 환자상태를 소속 관리감독자(부서장)에게 신속히 연락한다. \n" +
      "▶  인명피해, 화재 등 경우 119등에 즉시 신고한다.",
    performer: "최초발견자",
  },
  {
    actClsNm: "응급조치",
    actProcedure:
      "▶  지혈장비를 이용하여 부상부위를 심장보다 높게 유지하는 등 환자의 상태에 따라서 적절하게 조치를 취한다.",
    performer: "관리감독자, 작업자",
  },
  {
    actClsNm: "사고현장처리",
    actProcedure:
      "▶  사고현장은 최대한 조사가 이루어지기 까지 그대로 보존한다.  \n" +
      "▶  2차 재해 등의 우려가 있을 경우 작업자 대피 등 위험원을 보호 조치하고, 관계자 외에는 출입을 통제한다.",
    performer: "관리감독자",
  },
  {
    actClsNm: "이송",
    actProcedure:
      "▶  재해자는 즉시 이송한다. \n" +
      "▶  구급차가 필요한 경우 119등에 요청하여 환자를 이송한다.",
    performer: "관리감독자",
  },
  {
    actClsNm: "사후관리",
    actProcedure:
      "▶  보고대상인 경우 관계기관 사고발생 보고(고용노동부 등).  \n" +
      "▶  사고대책반, 재해원인 조사 및 재발방지 대책 수립 \n" +
      "▶  사고원인 및 보완사항 안전교육  \n" +
      "▶  개인별 임무숙지, 응급처치의 적절성 보완 등",
    performer: "관리감독자",
  },
]);

const emptyData = {
  safeEvalItemNm: "항목을 입력해주세요",
  safeEvalStandard: "기준을 입력해주세요",
  point: 0,
};

/**
 *  조회
 */
const query = ref({ historySeq: "", historyNm: "" });
const safeInfo = ref({ policy: "", objective: "" });
const historyList = ref([]);

const doSearch = () => {
  // TODO : axios 호출
  historyList.value.push({ historySeq: "1", historyNm: "2024-08-07 현재" });
  query.value.historySeq = "1";
};

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
