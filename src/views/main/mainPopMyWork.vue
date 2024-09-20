<template>
  <div class="dash_pop_default dash_pop_my_work">
    <div class="title">나의 할일</div>
    <div class="content">
      <div class="box">
        <div class="subtitle">
          결재함<span class="count">{{ apprTotalCnt }}</span>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/INSPC_ACTVT/riskAssmnMain',
              name: 'RiskAssmnMain',
            }"
          >
          위험성평가 검토<span class="count">{{ riskAssmnCnt }}</span>
        </router-link>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/SITE/siteImpRegulation',
              name: 'siteImpRegulation',
            }"
          >
          실시규정<span class="count">{{ stdMgMtStdImpRgltCnt }}</span>
        </router-link>
        </div>
      </div>

      <div class="box">
        <div class="subtitle">
          위험성평가<span class="count">{{ riskTotalCnt }}</span>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/INSPC_ACTVT/riskAssmnMain',
              name: 'RiskAssmnMain',
            }"
          >
          위험성평가표 작성<span class="count">{{ riskWtCnt }}</span>
          </router-link>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/INSPC_ACTVT/riskAssmnCnfrnMain',
              name: 'RiskAssmnCnfrnMain',
            }"
          >
          위험성평가회의 승인<span class="count">{{ actMngrRiskAssmnCnt }}</span>
          </router-link>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/INSPC_ACTVT/ActivitySafetyInspectionPage',
              name: 'AactivitySafetyInspection',
            }"
          >
          주간합동점검회의 승인<span class="count">{{ weekAssmnCnt }}</span>
          </router-link>
        </div>
      </div>

      <div class="box">
        <div class="subtitle">
          중점점검<span class="count">{{ pntTotalCnt }}</span>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/SAFE_ACTVT/m-majorActionActivity',
              name: 'm-majorActionActivity',
            }"
          >
          조치요청<span class="count">{{ pntActCnt }}</span>
          </router-link>
        </div>
        <div class="item">
          <router-link
            :to="{
              path: '/SAFE_ACTVT/m-majorActionApprove',
              name: 'm-majorActionApprove',
            }"
          >
          조치승인<span class="count">{{ pntActApproveCnt }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="bottom_btn">
      <button class="close" @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainSiteStore } from "../../stores/common/main-site-store";

const loginAuth = useLoginAuthStore();
const SiteStore = useMainSiteStore();
const riskAssmnCnt = ref(0); // 위험성결재평가 검토 개수
const stdMgMtStdImpRgltCnt = ref(0); // 실시규정 개수
const riskWtCnt = ref(0); // 위험성평가 작성 개수
const actMngrRiskAssmnCnt = ref(0); // 위험성평가회의 승인 개수
const weekAssmnCnt = ref(0); // 주간합동점검회의 승인 개수
const pntActCnt = ref(0); // 중감점검 조치진행 개수
const pntActApproveCnt = ref(0); // 중감점검 조치승인 개수
const myWorkTotalCnt = ref(0); // 총개수
const apprTotalCnt = ref(0); // 결재함 총개수
const riskTotalCnt = ref(0); // 위험성평가 총개수
const pntTotalCnt = ref(0); // 중감점검 총개수
const emits = defineEmits(["myWorkTotalCnt"]);

function close(event) {
  event.target.parentElement.parentElement.classList.remove("show");
}

// 나의 할일 조회
const searchList = async () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
  };

  const res = await SiteStore.selectMyWorkSearch(param);
  actMngrRiskAssmnCnt.value = res.actMngrRiskAssmnCnt;
  apprTotalCnt.value = res.apprTotalCnt;
  myWorkTotalCnt.value = res.myWorkTotalCnt;
  pntActApproveCnt.value = res.pntActApproveCnt;
  pntActCnt.value = res.pntActCnt;
  pntTotalCnt.value = res.pntTotalCnt;
  riskAssmnCnt.value = res.riskAssmnCnt;
  riskTotalCnt.value = res.riskTotalCnt;
  riskWtCnt.value = res.riskWtCnt;
  stdMgMtStdImpRgltCnt.value = res.stdMgMtStdImpRgltCnt;
  weekAssmnCnt.value = res.weekAssmnCnt;

  emits("myWorkTotalCnt", myWorkTotalCnt.value);
};

onMounted(() => {
  searchList();
});
</script>

<style scoped>
.item {
  cursor: pointer;
}
</style>
