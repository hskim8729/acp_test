<template>
  <div class="page w-100">
    <m-card-foldable title="1. 위험성평가 목적">
      {{ searchList.riskEvalPrps }}
    </m-card-foldable>

    <m-card-foldable title="2. 위험성 수준 판단 방법 및 기준">
      <m-site-imp-standard />
    </m-card-foldable>

    <m-card-foldable title="3. 위험성평가 방식">
      <m-site-imp-way />
    </m-card-foldable>

    <m-card-foldable title="4. 조직 및 역할">
      <m-site-imp-role />
    </m-card-foldable>

    <m-card-foldable title="5. 평가절차 및 방법">
      <m-site-imp-procedure />
    </m-card-foldable>

    <m-card-foldable no-margin title="6. 기록 보존">
      {{ searchList.rcdKeep }}
    </m-card-foldable>
  </div>

  <div class="bg-background-bl w-100 bottom-btn-bg">
    <comp-button
      class="h-100"
      @click="onAgrCheckedButton"
      :text="isSiteAgreYn ? '확인완료' : '확인합니다'"
      block
      :disabled="isSiteAgreYn ? true : false" />
  </div>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import mCardFoldable from "./component/mCardFoldable.vue";
import mSiteImpProcedure from "./component/mSiteImpProcedure.vue";
import mSiteImpRole from "./component/mSiteImpRole.vue";
import mSiteImpStandard from "./component/mSiteImpStandard.vue";
import mSiteImpWay from "./component/mSiteImpWay.vue";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

const dialogStore = useDialogStore();
const siteImpStore = useSiteImpRegulationStore();
const { searchList, commonParam } = storeToRefs(siteImpStore);

onBeforeMount(async () => {
  if (!isSiteAgreYn.value)
    dialogStore.openAlertDialog(
      "위험성평가를 효과적으로 실시하기 위하여 <br/>다음 실시규정의 내용을 확인 바랍니다."
    );
  await siteImpStore.comCodesList(); // 공통코드 조회
  await siteImpStore.standReglSearchList(); // 실시규정 표준 조회
});

const loginStore = useLoginAuthStore();
const { isSiteAgreYn, userInfo } = storeToRefs(loginStore);

async function onAgrCheckedButton() {
  const res = await siteImpStore.updateAgreYn();
  if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
    // dialogStore.openToastDialog("현장 실시규정 동의 완료", isSiteAgreYn.value);
    // 동의 버튼 숨김 처리를 위해 siteInfo.agreYn 업데이트
    const params = {
      ...commonParam.value,
      vendrCd: userInfo.value.vendrCd, // commonParam의 vendrCd가 본사 기준이어서 협력사 직원의 경우에러남
      ptnrYn: loginStore.$state.vendrInfo.ptnrYn,
    };
    await loginStore.getSiteMnpwrInfo(params);
  } else {
    if (!res.svrMessage) alert(res.svrMessage);
    else alert(res.data.message);
  }
}

// 페이지 타이틀 입력
const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "현장 실시규정 표준";
</script>

<style lang="scss" scoped>
.page {
  height: calc(100% - 60px);
  overflow: auto;
  -ms-overflow-style: none;
}
.page::-webkit-scrollbar {
  display: none;
}
.bottom-btn-bg {
  padding: 12px 10px 16px 10px;
  width: 100%;
  height: 72px;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
