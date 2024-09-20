<!-- views/riskFactroStandardPage -->
<template>
  <comm-safe-duty
    :page-title="commSafeDutyParams.pageTitle"
    :info-message="commSafeDutyParams.infoMessage"
    isTabPage
    :tabList="tabList">
    <!-- 버튼 영역 -->
    <template #toolbarBody>
      <comp-button
        type="save"
        text="저장"
        class="mr-1"
        @click="clickSave"></comp-button>
      <pop-appr-opnn
        :apprUserList="apprUserList"
        :crntApprOver="crntApprOver"
        :apprBtnNm="apprBtnNm"
        :key="apprUserList"
        @apprOpnn="saveApprMst"
        @validCheck="validCheck"
        ref="apprOpnn"></pop-appr-opnn>
      <comp-button type="print" text="출력" class="ml-1"></comp-button>
    </template>
    <!-- 조회조건, 결재영역 -->
    <template #cardTop>
      <div class="d-flex mr-1 mt-4 mb-2">
        <label class="mr-2 align-content-center font-weight-bold"> 이력 </label>
        <v-select
          v-model="query.historySeq"
          variant="outlined"
          hide-details="auto"
          :items="historyList"
          item-title="historyNm"
          item-value="historySeq"
          min-width="200px"
          max-width="200px"
          density="compact">
          <!-- <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :subtitle="item.historyNm"></v-list-item>
        </template> -->
        </v-select>
      </div>
      <apprLine
        :apprUserParams="apprUserParams"
        :key="apprUserParams"
        @apprUserList="getApprUserList"
        @crntApprOver="getCrntApprOver"
        class="mb-1"
        ref="apprLineRef"
        v-if="apprUserParams != null"></apprLine>
    </template>
  </comm-safe-duty>
</template>

<script setup>
import { ref, onMounted, markRaw } from "vue";
import { useRouter } from "vue-router";

import commSafeDuty from "@/views/common/commSafeDuty.vue";
import apprLine from "@/views/common/apprLine.vue";
import popApprOpnn from "@/views/common/popApprOpnn.vue";
import safeManagementPolicyWrite from "@/views/safeConfirmDuty/managementPolicy/safeManagementPolicyWrite.vue";
import safeManagementPolicyDoc from "@/views/safeConfirmDuty/managementPolicy/safeManagementPolicyDoc.vue";

import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();

const commSafeDutyParams = {
  pageTitle: "안전보건 경영방침 및 목표",
  infoMessage: `경영방침은 <span class="text-red font-weight-bold">간결하고 명확하게</span>, 목표는 <span class="text-red font-weight-bold">구체적으로</span> 작성해보세요.<br>
  목표는 위험성평가를 통해 <span class="font-weight-bold">지속적으로 수정/보완</span>하시면 좋습니다.`,
};

const tabList = ref([
  {
    value: "write",
    name: "직접 입력",
    component: markRaw(safeManagementPolicyWrite),
  },
  {
    value: "doc",
    name: "문서 업로드",
    component: markRaw(safeManagementPolicyDoc),
  },
]);

/**
 *  조회
 */
const query = ref({ historySeq: "", historyNm: "" });
const safeInfo = ref({ policy: "", objective: "" });
const historyList = ref([]);
const tabs = ref("write");

const doSearch = () => {
  // TODO : axios 호출
  historyList.value.push({
    historySeq: "1",
    historyNm: "2024.08.01 14:23",
  });
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

/**
 * 결재
 */
const apprUserParams = ref({});
const apprUserList = ref([]);
const crntApprOver = ref([]);
const apprBtnNm = ref("상신");

apprUserParams.value = {
  isApprAddUser: true,
  userNm: "김안전관리자",
  jbttlNm: "안전관리자",
};

const getApprUserList = () => {};

const getCrntApprOver = () => {
  crntApprOver.value = { ASIDflag: "Y" };
  apprBtnNm.value = "상신";
};

const validCheck = () => {};

const saveApprMst = () => {};

onMounted(() => {
  doSearch();
});
</script>
<style></style>
