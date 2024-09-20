<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage"
    :tabList="tabList"
    isTabPage>
    <template #toolbarBody>
      <comp-button
        type="save"
        text="저장"
        class="mr-1"
        @click="clickSave"></comp-button>
    </template>
    <template #betweenTab>
      <v-select
        v-model="query.jbttlCd"
        :items="jbttlList"
        item-title="comCdNm"
        item-value="comCd"
        variant="outlined"
        hide-details="auto"
        max-width="200px"
        density="compact"
        class="my-3" />
    </template>
    <!-- contents -->
  </comm-safe-duty>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, markRaw } from "vue";

import compButton from "@/components/button/compButton.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import safeTabPage from "@/views/safeConfirmDuty/components/safeTabPage.vue";
import safeEvalManagement from "@/views/safeConfirmDuty/safeEval/safeEvalManagement.vue";
import safeEvalStandard from "@/views/safeConfirmDuty/safeEval/safeEvalStandard.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";

const siteRegDetailStore = useSiteRegDetailStore();
const dialogStore = useDialogStore();

const commSafeDutyParams = {
  pageTitle: "업무수행 평가",
  infoMessage: `사업주는 위험성평가를 토대로 관리감독자가 
  <span class="font-weight-bold">충실히 업무를 수행할 수 있도록 <span class="text-red">권한과 예산</span>을 주고, 중간관리자를 통해 <span class="text-red">평가·관리</span></span>해야 합니다.<br>
평가·관리는 <span class="font-weight-bold text-red">반기 1회 이상</span> 실시합니다.`,
};

const tabList = ref([
  {
    value: "standard",
    name: "평가기준",
    component: markRaw(safeEvalStandard),
  },
  {
    value: "eval",
    name: "평가하기",
    component: markRaw(safeEvalManagement),
  },
]);

/**
 * 탭 조회
 */
const tabs = ref("standard");
// const tabClsCd = ref("standard");
// // 게시판 리스트
// const tabClsList = [
//   { tabClsCd: "standard", tabClsNm: "평가기준" },
//   { tabClsCd: "management", tabClsNm: "평가하기" },
// ];

// TODO 임시 데이터, 추후 쿼리 조회로 변경
/**
 * 연도별 예산 컬럼 정의
 */
// safeEvalId: 0,
// safeEvalItemSeq: 1,
// safeEvalItemNm:
//   "작업장 안전관리 점검 평가(기계·기구·설비, 정리정돈 통로확보 등)",
// safeEvalStandard: "양호 : 법령에 따른 업보를 적정하게 수행함",
// jbttlCd: "T0101",
// point: 10,
const columnDefs = [
  {
    headerName: "평가 항목",
    field: "safeEvalItemNm",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 3,
    editable: true,
  },
  {
    headerName: "평가 기준",
    field: "safeEvalStandard",
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
    flex: 3,
    editable: true,
  },
  {
    headerName: "배점",
    field: "point",
    flex: 1,
  },
];

const safeEvalItemList = ref([
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

/**
 *  조회
 */
const query = ref({ jbttlCd: "", jbttlNm: "" });
const jbttlList = ref([]);

const doSearch = () => {
  // TODO axios 호출
  query.value.jbttlCd = "T0101";
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

const getJbttlCdList = async () => {
  await siteRegDetailStore.selectJbttlCdList();

  jbttlList.value = siteRegDetailStore.getJbttlCdList;
};

onBeforeMount(() => {
  getJbttlCdList();
});

onMounted(() => {
  doSearch();
});

const isPopSafeEval = ref(false);
const openPopSafeEval = () => {
  isPopSafeEval.value = true;
};
</script>

<style scoped></style>
