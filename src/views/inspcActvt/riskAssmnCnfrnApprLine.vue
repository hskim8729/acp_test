<template>
  <div class="appr_wrap" @mouseenter="slideDown" @mouseleave="slideUp">
    <div class="title">결재라인</div>
    <button
      v-if="apprStatusHistList.length > 0"
      class="appr_status"
      @click="apprStatus"
    >
      결재현황 보기
    </button>
    <div class="right_approval_list">
      <ul>
        <span v-for="(item, index) in apprUserList" :key="index">
          <li :class="{ na: isCrntApprOver(item, index) }">
            <div class="sign">
              <img
                v-if="item.fileNm && item.statsCd && item.statsCd !== 'T1004'"
                :src="getSignature(item)"
                alt="Signature"
              />
            </div>
            <div class="roll">{{ item.jbttlNm }}</div>
            <div class="name">{{ item.userNm }} {{ item.workNm }}</div>
          </li>
        </span>
      </ul>
    </div>
    <button class="appr_open_btn" @click="apprOpen"></button>
  </div>

  <!-- 결재 현황 팝업 -->
  <popApprStatus :apprStatusHistList="apprStatusHistList"></popApprStatus>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useApprStore } from "@/stores/common/appr-store";
import { useRiskAssessmentStore } from "@/stores/inspcActvt/risk-assessment-store";
import popApprStatus from "@/views/common/popApprStatus.vue";

const props = defineProps(["apprUserParams"]);
const emits = defineEmits(["apprUserList", "crntApprOver"]);
const store = useRiskAssessmentStore();
const apprStore = useApprStore();

const apprUserList = ref([]);
const crntApprOver = ref({});
const apprStatusHistList = ref([]);

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

// 현재 결재자 class 활성화
function isCrntApprOver(item, index) {
  // 현재 결재자 class 활성화
  if (crntApprOver.value) {
    if (item.userId === crntApprOver.value.userId) {
      return true;
    }
  }

  // 결제선 목록의 상태값이 비어있고 제일 앞에 있는 경우
  if (!item.statsCd && index === 0) {
    return true;
  }

  return false;
}

// 업데이트된 apprUserList를 부모 컴포넌트로 전달.
const updateApprUserList = () => {
  emits("apprUserList", apprUserList.value);
  emits("crntApprOver", crntApprOver.value);
};

onBeforeMount(async () => {
  // 현재 결재자 조회
  crntApprOver.value = await apprStore.fetchApprover(props.apprUserParams);

  // 결재선 조회
  const apprStatusList = await apprStore.fetchApprStatusList(
    props.apprUserParams
  );

  // 회의 결재용 안전관리자, 현장소장 조회
  const cnfrnApprList = await store.fetchAuthUserList(props.apprUserParams);

  if (apprStatusList.length > 0) {
    apprUserList.value.push(...apprStatusList);
    apprUserList.value.gbn = "apprStatus";
  } else {
    apprUserList.value.push(...cnfrnApprList);

    apprUserList.value.forEach((apprUser, index) => {
      apprUser.apprSeq = index + 1;
    });
    apprUserList.value.gbn = "cnfrnAppr";
  }

  updateApprUserList();

  apprStatusHistList.value = await apprStore.fetchApprStatusHistList(
    props.apprUserParams
  );
});



// 결제자 목록 열기/닫기
function apprOpen(event) {
  const status = event.target.parentElement.classList.contains("show");

  if(status == true) {
    event.target.parentElement.classList.remove("show");
    event.target.classList.remove("close");
  } else {
    event.target.parentElement.classList.add("show");
    event.target.classList.add("close");
  }
}

// function slideDown(event) {
//   event.target.classList.add("show");
// }
// function slideUp(event) {
//   event.target.classList.remove("show");
// }

// 결재 현황 팝업
function apprStatus() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("appr_status_pop")[0].classList.add("show");
}
</script>

<style scoped>
.approval_margin {
  height: 140px;
}

.appr_status_pop {
  width: 75%;
}
</style>
