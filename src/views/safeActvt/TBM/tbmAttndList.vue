<template>
  <comp-card-foldable title="3. 참석자" isFlat>
    <template #button>
      <comp-button
        :text="isUserAttending ? '출석완료' : '출석체크'"
        v-if="userInfo.admAcctYn === 'N' && isTbmToday"
        :disabled="isUserAttending"
        @click="onAttdBtn" />
      <comp-button
        text="인원 추가"
        @click="isAddModalOpen = true"
        v-if="userInfo.admAcctYn === 'Y'" />

      <pop-select-user
        v-if="isAddModalOpen"
        @close-modal="isAddModalOpen = false"
        @get-selected-users="onAddUsers" />
    </template>
    <div class="grid-height">
      <comp-ag-grid :columnDefs="colDefs" :rowData="attendList" pagination />
    </div>
  </comp-card-foldable>
</template>

<script setup>
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compCardFoldable from "@/components/layout/compCardFoldable.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const { isUserAttending, isTbmToday, detailInfo } =
  storeToRefs(toolBoxRegiStore);

const props = defineProps({
  attendList: {
    type: Array,
    default: [
      { userNm: "a", tbmDt: "20110101" },
      { userNm: "b", tbmDt: "20110101" },
    ],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const loginStore = useLoginAuthStore();
const { siteInfo, userInfo } = storeToRefs(loginStore);

const dialogStore = useDialogStore();

const colDefs = [
  {
    headerName: "No.",
    valueGetter: (params) => params.node.rowIndex + 1,
    width: 100,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "참석자명",
    field: "userNm",
    flex: 1,
    cellStyle: { textAlign: "center" },
    minWidth: 300,
    valueFormatter: (params) => {
      const attendId = params.data.attendId ? params.data.attendId : "비회원";
      return params.data.userNm + " / " + attendId;
    },
  },
  {
    headerName: "참석 확인 일자",
    field: "tbmDt",
    valueFormatter: (params) =>
      dayjs(params.data.tbmDt, "YYYYMMDD").format("YYYY-MM-DD"),
    flex: 1,
    cellStyle: { textAlign: "center" },
    minWidth: 300,
  },
  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: () => {
        deleteAttend(params.data);
      },
      type: "del",
      visible: true,
      isNotRequiredAuth: true,
    }),
    hide: userInfo.value.admAcctYn !== "Y",
  },
];

// 로그인한 사용자 참석 버튼 함수
async function onAttdBtn() {
  // onAddUsers([{ userId: userInfo.value.userId }]);
  const data = await attendTbm();
  if (data == "OK") {
    emit("detailSearch"); // 참석 후 참석자 목록 재조회
  } else {
    dialogStore.openAlertDialog(data.message);
  }
}

// 관리자 사용자 등록 함수
const isAddModalOpen = ref(false);
const onAddUsers = async (userList) => {
  const successfulUsers = []; // 성공한 유저를 저장할 배열
  for (const user of userList) {
    if (isUserIdExists(user.userId)) {
      continue; // 출석한 경우 추가하지 않음
    }
    try {
      const result = await attendTbm(user.userId, user.userNm);
      if (result) {
        // 성공적으로 실행된 경우
        successfulUsers.push(user.userNm); // 성공한 유저를 배열에 추가
      }
    } catch (error) {
      console.error(`User ${user.userNm} attendance failed:`, error); // 실패한 경우 에러 로그
    }
  }

  dialogStore.openAlertDialog(successfulUsers.join(","), {
    title: "출석 등록 성공",
  });
  emit("detailSearch"); // 참석자 목록 재조회
};

function isUserIdExists(userId) {
  // 이미 출석한 유저인지 검사
  return props.attendList.some((user) => user.attendId === userId);
}

// 사용자 참석 등록 함수
async function attendTbm(attdUserId = "", attdUserNm = "") {
  const params = {
    vendrCd: detailInfo.value.vendrCd,
    siteCd: detailInfo.value.siteCd,
    tbmDt: detailInfo.value.tbmDt,
    psitnVendrCd: detailInfo.value.psitnVendrCd, // tbm에 등록된 psitnVendrCd
    userId: userInfo.value.userId, // tbm 참석 등록자
    userNm: attdUserNm ? attdUserNm : userInfo.value.userNm, // 저장될 userNm
    attendId: attdUserId ? attdUserId : userInfo.value.userId, // 저장될 userId
  };
  const res = await toolBoxRegiStore.saveTbmAttnd(params);
  return res.data;
}

async function deleteAttend(user) {
  const params = {
    vendrCd: user.vendrCd,
    siteCd: user.siteCd,
    tbmDt: user.tbmDt,
    psitnVendrCd: user.psitnVendrCd,
    attndSeq: Number(user.attndSeq),
  };

  const res = await toolBoxRegiStore.deleteTbmAttnd(params);
  dialogStore.openAlertDialog(user.userNm, {
    title: "출석 삭제 성공",
  });
  emit("detailSearch"); // 참석자 목록 재조회
}

const emit = defineEmits(["detailSearch"]);
</script>

<style lang="scss" scoped>
.grid-height {
  height: 620px;
}
</style>
