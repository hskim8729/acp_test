<template>
  <v-table density="compact" class="my-2 border border-e-0 border-s-0">
    <!-- 제목행 -->
    <thead class="bg-gray700 border-gray200">
      <tr>
        <th class="text-center border-e-sm" width="200px">현장 직무</th>
        <th class="text-center border-e-sm">역할</th>
      </tr>
    </thead>
    <!-- 바디 -->
    <tbody>
      <tr v-for="data in searchList.stdOrgRoleList" :key="data.siteWorkCd">
        <td class="border-e-sm text-center">
          {{ role[data.siteWorkCd] }}
        </td>
        <td>
          <div>
            <v-textarea
              v-model="data.role"
              :rules="[required]"
              variant="outlined"
              hide-details="auto"
              rows="2"
              auto-grow />
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
  <div class="text-body-5">* 지정 담당자는 시스템 권한에 따름</div>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
// 외부 변수 및 함수
// 컴포넌트
// store
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

const siteImpStore = useSiteImpRegulationStore();
const { role, searchList } = storeToRefs(siteImpStore);

// 저장 전 폼 체크할 룰
const required = (val) => {
  return val ? true : "필수 입력 값입니다.";
};
</script>

<style lang="scss" scoped></style>
