<template>
  <div class="appr_wrap" :class="{ show: isGridShow }">
    <div class="title">결재라인</div>
    <!-- 결재 현황 팝업 -->
    <appr-line-appr-status :apprStatusHistList="apprStatusHistList">
    </appr-line-appr-status>
    <div class="right_approval_list">
      <ul>
        <span v-for="(item, index) in apprUserList" :key="index">
          <li :class="{ na: isCrntApprOver(item, index) }">
            <div class="sign">
              <img
                v-if="
                  item.fileNm &&
                  item.statsCd &&
                  item.statsCd !== 'T1004' &&
                  item.statsCd !== 'T1005'
                "
                :src="getSignature(item)"
                alt="Signature" />
            </div>
            <div class="roll">{{ item.jbttlNm }}</div>
            <div class="name">{{ item.userNm }} {{ item.workNm }}</div>
            <button
              class="del"
              @click="removeUserInfo(index)"
              v-if="
                isRemoveBtn(item, index) && props.apprUserParams.isApprAddUser
              "></button>
          </li>
          <li
            class="add"
            @click="openPopSelectUser(index)"
            v-if="isAddBtn(item, index) && props.apprUserParams.isApprAddUser">
            <div class="add_icon1"></div>
            <div class="add_icon2"></div>
            <!-- 결재자 검색 팝업 -->
            <pop-select-user
              v-if="isPopSelectUser"
              :menuId="props.apprUserParams.menuId"
              @close-modal="isPopSelectUser = false"
              @get-selected-users="addUserInfo" />
          </li>
        </span>
      </ul>
    </div>
    <button
      class="appr_open_btn"
      @click="apprOpen"
      :class="{ close: isGridShow }"></button>
  </div>
</template>

<script setup>
import { defineExpose, onBeforeMount, ref } from "vue";

import apprLineApprStatus from "@/views/common/popApprStatus.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";

import { useApprStore } from "@/stores/common/appr-store";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
const safetyIspStore = useActivitySafetyIspStore();
const store = useApprStore();
const riskStore = useRiskAssessmentStore();

const props = defineProps(["apprUserParams"]);
const emits = defineEmits(["apprUserList", "crntApprOver", "prevApprOver"]);
const lineIndex = ref();
const apprUserList = ref([]);
const apprStatusList = ref([]);
const apprStatusHistList = ref([]);
const crntApprOver = ref();
const prevApprOver = ref();
const isMenuAuthUser = ref(false);
const isGridShow = ref(false);

// 현재 결재자 class 활성화
function isCrntApprOver(item, index) {
  // 현재 결재자 class 활성화
  if (crntApprOver.value) {
    if (
      item.userId === crntApprOver.value.userId &&
      item.apprSeq == crntApprOver.value.apprSeq
    ) {
      return true;
    }
  }

  // 결제선 목록의 상태값이 비어있고 제일 앞에 있는 경우
  if (!item.statsCd && index === 0) {
    return true;
  }

  return false;
}

// 결재자 삭제버튼 활성화
function isRemoveBtn(item) {
  if (crntApprOver.value) {
    // 현재 결재자
    if (props.apprUserParams.userId === crntApprOver.value.userId) {
      // if 현재결재자 시퀀스로 3이상부턴 다 return true;
      // crntApprOver.value.apprSeq
      if (item.apprSeq > crntApprOver.value.apprSeq) return true;
    }
  } else if (item.statsCd == null && item.apprSeq != 1) {
    return true;
  }

  return false;
}

// 결재자 추가 버튼 활성화
function isAddBtn(item) {
  if (crntApprOver.value) {
    // 현재 결재자
    if (props.apprUserParams.userId === crntApprOver.value.userId) {
      // if 현재결재자 시퀀스로 3이상부턴 다 return true;
      if (item.apprSeq >= crntApprOver.value.apprSeq) return true;
    }
  } else if (item.statsCd == null) {
    // 무조건 상신일때만
    return true;
  }

  return false;
}

// 서명 이미지 가져오기
const getSignature = (item) => {
  const url = import.meta.env.VITE_APP_API_DEV_URL;
  return (
    url +
    "/v1/common/getImage?param1=" +
    item.filePath +
    "&param2=" +
    item.fileNm
  );
};

// 업데이트된 apprUserList를 부모 컴포넌트로 전달.
const updateApprUserList = () => {
  apprUserList.value.forEach((apprUser, index) => {
    apprUser.apprSeq = index + 1;

    if (!apprUser.apprKey) {
      apprUser.apprKey = props.apprUserParams.apprKey;
    }
  });

  emits("apprUserList", apprUserList.value);
  emits("crntApprOver", crntApprOver.value);
  emits("prevApprOver", prevApprOver.value);
};

// 결재자 추가
const addUserInfo = (userInfo) => {
  apprUserList.value = [...apprUserList.value, ...userInfo];
  updateApprUserList();
};

// 결재자 삭제
const removeUserInfo = (index) => {
  apprUserList.value.splice(index, 1);
  updateApprUserList();
};

const onSearch = async () => {
  // 현재 결재자 조회
  crntApprOver.value = await store.fetchApprover(props.apprUserParams);
  if (crntApprOver.value && crntApprOver.value.apprSeq > 0) {
    const params = {
      vendrCd: props.apprUserParams.vendrCd,
      siteCd: props.apprUserParams.siteCd,
      apprKey: props.apprUserParams.apprKey,
      apprSeq: crntApprOver.value.apprSeq - 1,
    };

    // 이전 결재자 조회
    prevApprOver.value = await store.fetchPrevApprOver(params);
  }

  // 결재선 조회
  apprStatusList.value = await store.fetchApprStatusList(props.apprUserParams);

  let evalData = safetyIspStore.$state.searchList;

  if (apprStatusList.value.length > 0) {
    apprUserList.value = [...apprStatusList.value];
    apprUserList.value.gbn = "apprStatus";
  } else {
    // 사용자 추가 불가능일 경우 회의 결재용 로그인사용자, 현장소장 조회
    if (!props.apprUserParams.isApprAddUser) {
      // 회의 결재용 로그인사용자, 현장소장 조회
      const cnfrnApprList = await riskStore.fetchAuthUserList(
        props.apprUserParams
      );

      apprUserList.value.push(...cnfrnApprList);

      apprUserList.value.forEach((apprUser, index) => {
        apprUser.apprSeq = index + 1;
      });
      apprUserList.value.gbn = "cnfrnAppr";
    } else {
      // 최초 작성시 상신자 설정
      const nowUser = {
        vendrCd: props.apprUserParams.vendrCd,
        siteCd: props.apprUserParams.siteCd,
        apprSeq: 1, // 최초작성이므로 1로 설정
        userId: props.apprUserParams.userId,
        userNm: props.apprUserParams.userNm,
        jbttlNm: props.apprUserParams.jbttlNm,
        workNm: props.apprUserParams.workNm,
      };

      apprUserList.value.push(nowUser);
    }
  }

  updateApprUserList();

  apprStatusHistList.value = await store.fetchApprStatusHistList(
    props.apprUserParams
  );
};

onBeforeMount(() => {
  onSearch();
});

defineExpose({
  onSearch,
});

// 결재라인 목록 열기/닫기
function apprOpen() {
  isGridShow.value = !isGridShow.value;
}

/**
 * 사용자 검색 팝업 호출
 */
const isPopSelectUser = ref(false);
const openPopSelectUser = (index) => {
  if (index >= 0) {
    lineIndex.value = index;
  }

  isPopSelectUser.value = true;
};
</script>

<style scoped></style>
