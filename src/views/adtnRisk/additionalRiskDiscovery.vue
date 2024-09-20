<!-- 추가위험발굴 -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage">
    <template #contentTitle> 추가위험발굴 목록 </template>
    <template #contentButton>
      <div v-if="statusText" class="text-body-4">
        {{ statusText }}
      </div>

      <template v-else>
        <!-- 추가위험 발굴 팝업-->
        <adtn-risk-modal
          v-if="isTourModalOpen"
          :mode="popUpMode"
          :type="popUptype"
          @close="closeTourModal" />

        <comp-button
          class="mr-2"
          text="순회점검 등록"
          @click="openModal('I', 'T1101')"
          density="comfortable"
          requiredAuth />

        <comp-button
          class="mr-2"
          text="근로자 제보 등록"
          @click="openModal('I', 'T1102')"
          density="comfortable"
          requiredAuth />

        <comp-button
          text="아차사고 제보"
          @click="openModal('I', 'T1103')"
          density="comfortable"
          requiredAuth />
      </template>
    </template>

    <template #contents>
      <compAgGrid :columnDefs="columnDefs" :rowData="searchList" />
    </template>
  </comm-safe-duty>
</template>

<script setup>
// 모듈
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import adtnRiskModal from "./adtnRiskModal.vue";
// 스토어
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const dialogStore = useDialogStore();
const adtnStore = useAdtnRiskStore();
const { searchList, TappMgmtList, siteRuleList } = storeToRefs(adtnStore);

onBeforeMount(async () => {
  // 추가위험발굴 조회
  await adtnStore.adtnRiskSerchList();
  // 공종코드 조회
  await adtnStore.adtnRiskTappMgmtList();
  // 순회점검 위험성 조회
  await adtnStore.adtnRiskSiteRuleList();
});

const commSafeDutyParams = {
  pageTitle: "추가위험발굴",
  infoMessage: `<span class="text-red font-weight-bold">현장의 위험요인과 개선사항 발굴을</span> 종사자에게 권장하세요.<br>
발굴된 사항은 <span class="font-weight-bold">위험성평가에 반영</span>되니, 재해 예방을 위해 <span class="text-red font-weight-bold">개선방안을 마련하고 조치</span>하는 것이 중요합니다.`,
};

/**
 * 팝업 제어
 */
const popUpMode = ref("I"); // I : 작성, U: 업데이트, R: 읽기
const popUptype = ref("");

//순회점검 팝업
const isTourModalOpen = ref(false);
function openModal(mode = "I", detailDscvTypeCd) {
  popUpMode.value = mode;
  popUptype.value = detailDscvTypeCd;
  isTourModalOpen.value = true;
}
function closeTourModal() {
  isTourModalOpen.value = false;
}

// 그리드 더블클릭 상세조회
const onRowClicked = async (event) => {
  await adtnStore.searchDetailList(event.data); // 상세조회
  const detailDscvTypeCd = event.data.dscvTypeCd; // 구분 가져오기
  const userId = loginAuth.$state.userInfo.userId;
  const mode = userId === event.data.regId ? "U" : "R";
  openModal(mode, detailDscvTypeCd);
};

const deleteList = async (params) => {
  const userId = loginAuth.$state.userInfo.userId;
  if (params.regId != userId) {
    dialogStore.openAlertDialog("작성자만 게시글 삭제할 수 있습니다.");
    return;
  }

  const formData = new FormData(); // 파일

  // 삭제 파라미터 추가
  params.mode = "D";
  // 추후 세션 값 사용예정
  params.userId = userId;

  formData.append(
    "param",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  // 삭제 전 위험성평가 조회
  const List = await adtnStore.adtnRiskDeleteSearch(params);
  if (List.length > 0) {
    dialogStore.openAlertDialog(
      "위험성평가표에 저장된 추가위험 요인은 삭제가 불가능합니다."
    );
  } else {
    // 게시글 삭제
    await adtnStore.adtnRiskDeleteList(formData);
    // 파일 삭제
    await adtnStore.adtnRiskDeleteFile(params);
  }
};

const loginAuth = useLoginAuthStore();

const columnDefs = [
  {
    headerName: "구분",
    field: "dscvTypeNm",
    wrapText: true,
    width: 120,
    maxWidth: 120,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "등록일",
    field: "modDate",
    wrapText: true,
    width: 130,
    maxWidth: 130,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "공종",
    field: "contyCdNm",
    wrapText: true,
    width: 100,
    maxWidth: 150,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "작업명",
    field: "wrkNm",
    cellStyle: { textAlign: "left" },
    wrapText: true,
    flex: 1,
    minWidth: 200,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "장소",
    field: "wrkLoc",
    wrapText: true,
    width: 100,
    maxWidth: 200,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    cellStyle: { textAlign: "left" },
    wrapText: true,
    flex: 2,
    minWidth: 300,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "업체명",
    field: "vendrNm",
    wrapText: true,
    width: 200,
    maxWidth: 200,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "작성자",
    field: "userNm",
    wrapText: true,
    width: 100,
    maxWidth: 100,
    onCellClicked: (params) => onRowClicked(params),
  },
  {
    headerName: "상세보기",
    field: "detailBtn",
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        onRowClicked(params);
      },
      type: "modify",
      visible: true,
    }),
  },
  {
    headerName: "삭제",
    field: "delBtn",
    cellStyle: { textAlign: "center" },
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        dialogStore.openConfirmDialog("삭제하시겠습니까?", {
          confirmCallback: async () => {
            deleteList(params.data);
          },
        });
      },
      type: "del",
    }),
  },
];

const statusText = computed(() => {
  if (!siteRuleList.value) {
    // 추가위험 위험성 방식이 없는 경우
    return "현장 실시규정 등록을 완료한 뒤에 추가위험발굴을 등록할 수 있습니다.";
  }
  if (TappMgmtList.value?.length === 0) {
    // 공종코드가 없는 경우
    return "최초 위험성평가를 완료한 뒤에 추가위험발굴을 등록할 수 있습니다.";
  }
  return "";
});
</script>
<style scoped></style>
