<template>
  <comm-safe-duty :page-title="commSafeDutyParams.pageTitle">
    <template #toolbarBody>
      <comp-button text="저장" class="mr-2"></comp-button>
      <report-view-button />
    </template>
    <template #infoBody>
      <p>
        현장에 <span class="font-weight-bold text-red">안전업무 담당자</span>를
        지정하고 <span class="font-weight-bold">권한과 예산을 부여</span>하세요.
      </p>
      <comp-button
        type="detailView"
        text="자세히 보기"
        class="mt-2"
        @click="isOpenImageViewer = true" />
    </template>
    <template #contents>
      <!-- 본문영역 -->
      <div class="d-flex flex-row">
        <!-- <div class="text-subtitle-4">{{ title }}</div>
        <v-spacer></v-spacer> -->
        <comp-button
          type="add"
          icon="mdi-plus"
          class="mr-2"
          @click="isAddModalOpen = true" />

        <comp-button
          text="삭제"
          variant="outlined"
          icon="mdi-delete-outline"
          @click="deleteRow" />
      </div>
      <v-sheet height="calc(100% - 32px)">
        <comp-ag-grid
          type="addDelete"
          :columnDefs="columnDefs"
          :rowData="selectEmpList"
          @get-grid-api="onGetParams" />
      </v-sheet>

      <!-- 사용자 추가 팝업 -->
      <pop-select-user
        v-if="isAddModalOpen"
        type="VENDR"
        rowSelection="multiple"
        admAcctYn="N"
        :selectedUsers="selectEmpList"
        @close-modal="isAddModalOpen = false"
        @get-selected-users="onAddUsers" />
    </template>
  </comm-safe-duty>
  <image-viewer
    title="현장인력 정보"
    width="640px"
    height="465px"
    :fileArr="fileArr"
    :readOnly="true"
    v-if="isOpenImageViewer"
    @close="isOpenImageViewer = !isOpenImageViewer">
  </image-viewer>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import reportViewButton from "@/components/button/reportViewButton.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
import commSafeDuty from "@/views/common/commSafeDuty.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";
import imageViewer from "@/components/file/imageViewer.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";
import { useSiteRegStore } from "@/stores/site/site-reg-store";

const loginStore = useLoginAuthStore();
const siteRegDetailStore = useSiteRegDetailStore();
const siteRegStore = useSiteRegStore();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const dialogStore = useDialogStore();

const { userInfo, siteInfo } = storeToRefs(loginStore);

// 정보 조회
const fchParams = {
  vendrCd: siteInfo.value.vendrCd,
  siteCd: siteInfo.value.siteCd,
  userId: userInfo.value.userId,
};

const doSearch = async () => {
  await siteRegDetailStore.fetchselectEmpList(fchParams); // 직원목록
  await siteRegDetailStore.selectJbttlCdList(); // 직책
  await siteRegDetailStore.selectAuthList(fchParams); // 권한
};
await doSearch();
const { selectEmpList, jbttlCdList, authList, upperAuthList, lowerAuthList } =
  storeToRefs(siteRegDetailStore);

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetParams = (params) => {
  gridApi = params.api;
};

/**
 * 현장 인력 추가
 */
const isAddModalOpen = ref(false); // 담당자 선택 팝업 열기
const onAddUsers = (selected) => {
  if (selected.length === 0) {
    return;
  }
  selectEmpList.value = [...selectEmpList.value, ...selected];
};

/**
 * 현장 인력 선택 행 삭제
 */
const deleteRow = async () => {
  const seletedRows = gridApi.getSelectedRows();
  if (!seletedRows.length) {
    dialogStore.openAlertDialog("삭제할 항목을 선택해주세요.");
    return;
  }
  await siteRegDetailStore.deleteEmpListRow(seletedRows);
};

// 셀 클릭 핸들러 함수
const onSelectCell = (params) => {
  if (gridApi) {
    const isSelected = params.node.isSelected();
    // 클릭된 상태 토글
    params.node.setSelected(!isSelected);
  }
};

const columnDefs = [
  {
    headerName: "회사명",
    field: "vendrNm",
    minWidth: 150,
    flex: 2,
    onCellClicked: onSelectCell,
  },
  {
    headerName: "성명",
    field: "userNm",
    minWidth: 100,
    flex: 1,
    onCellClicked: onSelectCell,
  },
  {
    headerName: "직위",
    field: "workNm",
    minWidth: 80,
    flex: 1,
    onCellClicked: onSelectCell,
  },
  {
    headerName: "연락처",
    field: "crryTelNo",
    minWidth: 150,
    flex: 2,
    type: ["phoneNumber"],
    onCellClicked: onSelectCell,
  },
  {
    headerName: "이메일",
    field: "userId",
    minWidth: 220,
    flex: 3,
    onCellClicked: onSelectCell,
  },
  {
    headerName: "*직책",
    field: "jbttlCd",
    type: "placeholder",
    minWidth: 120,
    flex: 1,
    filter: true,
    editable: true,
    singleClickEdit: true,
    cellEditor: "agSelectCellEditor",
    onCellValueChanged: (params) => {
      console.log("change", params);
    },
    cellEditorParams: (params) => {
      return {
        values: jbttlCdList.value.map((item) => item.comCd),
      };
    },
    valueFormatter: (params) => {
      const jbttl = jbttlCdList.value.find(
        (item) => item.comCd === params.value
      );
      return jbttl ? jbttl.comCdNm : "";
    },
    valueParser: (params) => {
      const jbttl = jbttlCdList.value.find(
        (item) => item.comCd === params.newValue
      );
      return jbttl ? jbttl.comCdNm : "";
    },
    cellStyle: {
      color: "blue", // 파란색 텍스트
      cursor: "pointer", // 마우스 커서를 pointer로 변경
    },
    type: "placeholder",
    cellRendererParams: {
      placeholder: "필수 입력", // placeholder 텍스트 설정
    },
  },
  {
    headerName: "*메뉴권한",
    field: "authCd",
    minWidth: 120,
    flex: 1,
    editable: true,
    singleClickEdit: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      // 본사 직원의 경우
      if (params.data.vendrCd === params.data.psitnVendrCd) {
        return {
          values: upperAuthList.value.map((item) => item.authCd),
        };
      } else {
        return {
          values: lowerAuthList.value.map((item) => item.authCd),
        };
      }
    },
    valueFormatter: (params) => {
      const auth = authList.value.find((item) => item.authCd === params.value);
      return auth ? auth.authNm : "";
    },
    valueParser: (params) => {
      const auth = authList.value.find(
        (item) => item.authCd === params.newValue
      );
      return auth ? auth.authNm : "";
    },
    cellStyle: {
      color: "blue", // 파란색 텍스트
      cursor: "pointer", // 마우스 커서를 pointer로 변경
    },
    type: "placeholder",
    cellRendererParams: {
      placeholder: "필수 입력", // placeholder 텍스트 설정
    },
  },
];

const commSafeDutyParams = {
  pageTitle: "현장 인력 정보",
};

const isOpenImageViewer = ref(false); // 이미지뷰어 팝업
const fileArr = computed(() => {
  const imgUrl = "/img/safe_man_power_guide.jpeg";

  let urlArr = [];
  urlArr.push({ src: new URL(imgUrl, import.meta.env.VITE_APP_DOMAIN_URL) });

  return urlArr;
});
</script>

<style lang="scss" scoped></style>
