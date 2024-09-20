<template>
  <m-site-imp-table
    header-title="현장 직무"
    header-content="역할"
    :data-list="list"
    isEnter
    isHeaderCenter />
  <div class="text-body-5">* 지정 담당자는 시스템 권한에 따름</div>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import mSiteImpTable from "./mSiteImpTable.vue";
// store
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

const list = computed(() => {
  // console.log("???????", stdOrgRoleList.value);
  return stdOrgRoleList.value.map((item) => ({
    title: role.value[item.siteWorkCd],
    content: item.role,
  }));
});

const siteImpStore = useSiteImpRegulationStore();
const { role, stdOrgRoleList } = storeToRefs(siteImpStore);
</script>

<style lang="scss" scoped></style>
