<template>
  <v-select
    bg-color="gray100"
    v-model="selected"
    density="compact"
    :items="riskLvlJdgMntList"
    item-title="comCdNm"
    item-value="comCd"
    disabled
    variant="outlined"
    hide-details="auto"
    class="pb-2" />
  <m-site-imp-table
    v-for="item in list"
    :key="item.headerTitle + item.hederContent"
    :header-title="item.headerTitle"
    :header-content="item.hederContent"
    :data-list="item.dataList"
    :color="getColor(item.riskDcsCls)" />
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

const siteImpStore = useSiteImpRegulationStore();
const { searchList, riskLvlList, mngLv, riskLvlJdgMntList } =
  storeToRefs(siteImpStore);

// 빈도강도, 상중하법 등 방법 계산
const selected = computed({
  get: () => searchList.value.riskLvlJdgmntCd,
});

// 테이블 헤더 컬러
const getColor = (riskDcsCls) => {
  let color;
  switch (riskDcsCls) {
    case "3":
      color = "error";
      break;
    case "2":
      color = "warning";
      break;
    case "1":
      color = "success";
      break;
    default:
      color = "";
      break;
  }
  return color;
};

// 테이블 데이터 Prop에 맞게 계산
const list = computed(() => {
  return riskLvlList.value.map((item) => ({
    headerTitle: "위험성",
    hederContent: item.risk,
    riskDcsCls: item.riskDcsCls,
    dataList: [
      { title: "판단기준", content: item.dcsCrtr },
      {
        title: "위험성 추정",
        content:
          selected.value === "T0501"
            ? item.riskPrsmpGrd
            : item.riskPrsmpFqinSt + " ~ " + item.riskPrsmpFqinEn,
      },
      {
        title: "허용 가능 여부",
        content: item.permPsbltyYn === "Y" ? "허용 가능" : "허용 불가능",
      },
      { title: "관리수준", content: mngLv.value[item.mngLvl] },
    ],
  }));
});
</script>

<style lang="scss" scoped></style>
