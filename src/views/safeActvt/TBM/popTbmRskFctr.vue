<!-- 안전활동 -> TBM 등록 -> 위험요인 추가 팝업-->
<template>
  <comp-modal
    style="min-width: 1200px"
    class="bg-background"
    modal-title="위험요인 검색"
    @close="emit('closeModal')"
    @modal-action="modalAction"
    isActions
    actionBtnText="선택 완료"
    maxModalWidth="1000px">
    <v-sheet class="d-flex py-3 px-3 ma-3" rounded>
      <div class="d-flex pa-0 align-center w-100 justify-space-between">
        <div class="search-input d-flex flex-row">
          <formText label="작업명" width="40" class="mr-2 mt-2">
            <div class="d-flex flex-row">
              <comp-input @enter-function="getRskFctr" v-model="wrkNm" />
            </div>
          </formText>
        </div>

        <comp-button
          text="조회"
          size="large"
          class="mx-3"
          @click="getRskFctr" />
      </div>
    </v-sheet>

    <v-sheet class="ma-3" style="height: calc(100% - 120px)" rounded>
      <comp-ag-grid
        class="pa-3"
        :rowData="RskFctrList"
        :columnDefs="colDefs"
        rowSelection="multiple"
        @getGridApi="onGetGridApi" />
    </v-sheet>
  </comp-modal>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 컴포넌트
import formText from "@/components/form/formText.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compModal from "@/components/modal/compModal.vue";
// 스토어
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
// 서비스
// import commonService from "@/api/common-service.js";

const loginStore = useLoginAuthStore();
const { siteInfo, userInfo, authInfo } = storeToRefs(loginStore);

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const { RskFctrList } = storeToRefs(toolBoxRegiStore);

const emit = defineEmits(["closeModal", "getSelectedRskFctr"]);

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetGridApi = (params) => {
  gridApi = params.api;
};

const modalAction = () => {
  const selected = gridApi.getSelectedRows();
  emit("getSelectedRskFctr", selected);
  emit("closeModal");
};

/**
 * 위험성평가 데이터 불러옴
 */
const wrkNm = ref("");
const getRskFctr = async () => {
  // 본사 및 현장 구분
  const authCd = authInfo.value.authCd;
  const param = {
    vendrCd: siteInfo.value.vendrCd,
    siteCd: siteInfo.value.siteCd,
    userId: userInfo.value.userId,
    psitnVendrCd: userInfo.value.vendrCd,
    division:
      authCd == "2000" || authCd == "3000" || authCd == "4000" ? "true" : "",
    wrkNm: wrkNm.value,
  };
  await toolBoxRegiStore.searchRskFctr(param);
};

await getRskFctr();

/**
 * 현장 유저 컬럼 정의
 */
const colDefs = [
  {
    headerName: "공종",
    field: "contyCdNm",
    flex: 1,
    checkboxSelection: true,
    cellStyle: { textAlign: "center" },
    headerCheckboxSelection: true,
  },
  {
    headerName: "작업 명",
    field: "wrkNm",
    flex: 1,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    flex: 1,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "대책",
    field: "rskMsr",
    flex: 1,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "중점/일상",
    field: "pntInsp",
    width: 120,
    maxWidth: 120,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "위험도",
    field: "risk",
    width: 100,
    maxWidth: 100,
    cellStyle: { textAlign: "center" },
  },
];
</script>

<style lang="scss" scoped>
.search-input {
  width: 400px;
  .v-input {
    background-color: white;
  }
}
</style>
