<template>
  <div class="d-inline-flex justify-start">
    <v-radio-group
      v-for="option in riskLvlJdgMntList"
      v-model="searchList.riskLvlJdgmntCd"
      hide-details="auto">
      <v-radio :label="option.comCdNm" :value="option.comCd"></v-radio>
    </v-radio-group>
  </div>
  <!-- main.scss input의 border때문에 v-if 사용 -->
  <!-- <v-select
    v-if="searchList.riskLvlJdgmntCd"
    v-model="searchList.riskLvlJdgmntCd"
    density="compact"
    :items="riskLvlJdgMntList"
    item-title="comCdNm"
    item-value="comCd"
    variant="outlined"
    hide-details="auto"
    class="pb-2" /> -->
  <v-table density="compact" class="my-2">
    <thead>
      <tr class="bg-gray700">
        <th
          v-for="item in headers"
          class="text-center border-e-sm border-gray200">
          {{ item }}
        </th>
      </tr>
    </thead>
    <tbody class="text-center">
      <tr
        v-for="(item, idx) in searchList.riskLvlList"
        :class="'bg-' + getColor(item.riskDcsCls) + '_bg'">
        <!-- 위험성 -->
        <td
          :class="'text-' + getColor(item.riskDcsCls)"
          class="border-gray700 border-e-sm"
          width="80px">
          {{ item.risk }}
        </td>
        <!-- 판단기준 -->
        <td class="border-gray700 border-e-sm">
          <comp-input v-model="item.dcsCrtr" name="판단기준" required />
        </td>
        <!-- 위험성추정 -->
        <td class="border-gray700 border-e-sm" width="160px">
          <!-- 상중하 -->
          <template v-if="searchList.riskLvlJdgmntCd === 'T0501'">
            {{ item.riskPrsmpGrd }}
          </template>
          <!-- 3*3 / 5*5 -->
          <template v-else>
            <div v-if="idx === 0">{{ end + 1 }} ~ {{ score.max }}</div>
            <div v-if="idx === 1" class="d-flex flex-row">
              <v-text-field
                v-model="start"
                max-width="50px"
                variant="outlined"
                hide-details
                density="compact"></v-text-field>
              <div class="px-2 text-justify">~</div>
              <v-text-field
                v-model="end"
                max-width="50px"
                variant="outlined"
                hide-details
                density="compact"></v-text-field>
            </div>
            <div v-if="idx === 2">1 ~ {{ start - 1 }}</div>
          </template>
        </td>
        <!-- 허용 가능 여부 -->
        <td width="200px" class="border-gray700 border-e-sm">
          <v-radio-group
            class="d-inline-flex justify-start"
            v-for="option in mngLvlList"
            v-model="item.mngLvl"
            hide-details="auto">
            <v-radio
              :label="option.comCd === 'T0201' ? '불가능' : '가능'"
              :value="option.comCd" />
          </v-radio-group>
          <!-- {{ item.mngLvl === "T0201" ? "허용 불가능" : "허용 가능" }} -->
        </td>
        <!-- 관리수준 -->
        <td width="120px" class="border-gray700">
          {{ mngLv[item.mngLvl] }}
          <!-- <v-select
            v-model="item.mngLvl"
            :items="mngLvlList"
            item-title="comCdNm"
            item-value="comCd"
            density="compact"
            variant="outlined"
            hide-details="auto" /> -->
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
// 외부 변수 및 함수
// 컴포넌트
// store
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { parseInt } from "lodash";

const siteImpStore = useSiteImpRegulationStore();
const { searchList, mngLv, mngLvlList, riskLvlJdgMntList } =
  storeToRefs(siteImpStore);

let score = computed(() => {
  const result = {
    max: 0,
    defaultStart: 0,
    defaultEnd: 0,
  };
  switch (riskType.value) {
    case "T0502":
      // 3*3 : 위험성 보통의 위험성 추정 시작값 4~6
      result.max = 9;
      result.defaultStart = 4;
      result.defaultEnd = 6;
      break;
    case "T0503":
      // 5*5 위험성 보통의 위험성 추정 시작값 8~18
      result.max = 25;
      result.defaultStart = 8;
      result.defaultEnd = 18;
      break;
    default:
      alert("잘못된 코드입니다", riskType.value);
      break;
  }
  return result;
});

// 판단 방법 변환시 기본 값 변경
const riskType = computed(() => searchList.value.riskLvlJdgmntCd);
watch(riskType, (newVal, oldVal) => {
  // 상중하법으로 바뀌는 경우를 제외하고
  if (!oldVal || newVal === "T0501") return;
  searchList.value.riskLvlList[0].riskPrsmpFqinSt = score.value.defaultEnd + 1;
  searchList.value.riskLvlList[0].riskPrsmpFqinEn = score.value.max;
  searchList.value.riskLvlList[1].riskPrsmpFqinSt = score.value.defaultStart;
  searchList.value.riskLvlList[1].riskPrsmpFqinEn = score.value.defaultEnd;
  searchList.value.riskLvlList[2].riskPrsmpFqinSt = 1;
  searchList.value.riskLvlList[2].riskPrsmpFqinEn =
    score.value.defaultStart - 1;
});

const start = computed({
  get: () => {
    const num = parseInt(searchList.value.riskLvlList[1].riskPrsmpFqinSt);
    // 값이 정해지지 않았거나 숫자가 아니면기본 세팅
    if (!Number.isInteger(num) || num <= 0) {
      return score.value.defaultStart;
    }
    return num;
  },
  set: (val) => {
    const num = parseInt(val);
    if (!Number.isInteger(num) || num <= 1 || num >= score.value.max) {
      // 숫자가 아니거나 min, max 범위 안에 들지 않으면 return
      return;
    } else if (end.value < num) {
      // start의 새로 입력된 값이 end 값보다 크면 end도 늘림
      searchList.value.riskLvlList[1].riskPrsmpFqinEn = num;
      searchList.value.riskLvlList[0].riskPrsmpFqinSt = num + 1;
    }
    searchList.value.riskLvlList[1].riskPrsmpFqinSt = num;
    searchList.value.riskLvlList[2].riskPrsmpFqinEn = num - 1;
  },
});

const end = computed({
  get: () => {
    // 3*3 은 위험성 보통의 위험성 추정 끝이 7, 5*5은 18로 기본세팅
    const num = parseInt(searchList.value.riskLvlList[1].riskPrsmpFqinEn);
    if (!Number.isInteger(num) || num <= 0) {
      return score.value.defaultEnd;
    }

    return num;
  },
  set: (val) => {
    const num = parseInt(val);
    if (!Number.isInteger(num) || num <= 1 || num >= score.value.max) {
      // 숫자가 아니거나 min, max 범위 안에 들지 않으면 return
      return;
    } else if (start.value > num) {
      // end 새로 입력된 값이 start 값보다 작으면 start도 줄임
      searchList.value.riskLvlList[1].riskPrsmpFqinSt = num;
      searchList.value.riskLvlList[2].riskPrsmpFqinEn = num - 1;
    }
    searchList.value.riskLvlList[1].riskPrsmpFqinEn = num;
    searchList.value.riskLvlList[0].riskPrsmpFqinSt = num + 1;
  },
});

const headers = [
  "위험성",
  "판단기준",
  "위험성추정",
  "허용 가능 여부",
  "관리 수준",
];

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
</script>

<style lang="scss" scoped></style>
