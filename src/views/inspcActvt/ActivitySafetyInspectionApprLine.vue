<template>
  <div class="appr_wrap">
    <div class="title">결재라인</div>
    <button v-if="apprStatusHistList.length > 0 && props.apprUserParams.mode !== 'I'" class="appr_status" @click="apprStatus">
      결재현황 보기
    </button>
    <div class="right_approval_list">
      <ul>
        <span v-for="(item, index) in apprUserList" :key="index">
          <li :class="{ na: isCrntApprOver(item, index) }">
            <div class="sign">
              <img v-if="item.fileNm && item.statsCd && item.statsCd !== 'T1004' && props.apprUserParams.mode !== 'I'" :src="getSignature(item)"
                alt="Signature" />
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
import { ref, onBeforeMount, getCurrentInstance } from "vue";
import { useApprStore } from "@/stores/common/appr-store";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import activitySafetyInspectionService from "@/api/services/inspcActvt/activity-safety-inspection-service";
import popApprStatus from "@/views/common/popApprStatus.vue";

const props = defineProps(["apprUserParams"]);
const emits = defineEmits(["apprUserList", "crntApprOver"]);
const store = useActivitySafetyIspStore();
const apprStore = useApprStore();
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const apprUserList = ref([]);
const crntApprOver = ref({});
const apprStatusHistList = ref([]);
let Params = ref();
let listData = ([]);

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
  if (props.apprUserParams.mode === "U" && listData.value[0].stats === "T0901" && index === 0 && $loginStore.$state.siteInfo.jbttlCd === "T0102") {
    return true;
  } else if (props.apprUserParams.mode === "U" && listData.value[0].stats === "T0902" && index === 1 && $loginStore.$state.siteInfo.jbttlCd === "T0101") {
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

  let evalData = store.$state.searchList;
  Params.value = {
    vendrCd: $loginStore.$state.siteInfo.vendrCd,
    siteCd: $loginStore.$state.siteInfo.siteCd,
    evalSeq: evalData.evalSeq,
  };

  let list = await activitySafetyInspectionService.searchList(Params.value);
  listData.value = list.data;

  // 회의 결재용 안전관리자, 현장소장 조회
  const cnfrnApprList = await store.fetchSafeAuthUserList(props.apprUserParams);

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

  if (status == true) {
    event.target.parentElement.classList.remove("show");
    event.target.classList.remove("close");
  } else {
    event.target.parentElement.classList.add("show");
    event.target.classList.add("close");
  }
}


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

.appr_wrap {
  margin-bottom: 0px;
}
</style>
