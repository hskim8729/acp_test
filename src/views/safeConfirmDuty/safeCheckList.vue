<!-- views/riskFactroStandardPage -->
<template>
  <compPage title="안전보건 확보 의무 체크리스트" class="safe_duty">
    <template #default>
      <div class="safe_duty_table">
        <v-data-table
          :headers="headers"
          :items="safeDutyList"
          item-value="title"
          :items-per-page="safeDutyList.length"
          :footer-props="{ itemsPerPageOptions: [] }"
          class="elevation-1">
          <template #headers="{ columns }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  v-if="column.title"
                  :colspan="column.colspan || 1"
                  :class="`text-${column.align}`">
                  {{ column.title }}
                </th>
              </template>
            </tr>
          </template>
          <template #item="{ item }">
            <tr>
              <td
                :rowspan="item.rowspan || 1"
                class="text-center"
                v-if="item.rowspan">
                {{ item.safetyCheckMasterNm }}
              </td>
              <td>
                <span
                  text
                  @click="goPage(item.link)"
                  :class="`${item.link ? 'link' : ''}`">
                  {{ item.safetyCheckDetailNm }}
                </span>
              </td>
              <td class="text-center safe_check_yn">
                <span v-if="item.checkedYn === 'Y'" class="success">
                  완료
                </span>
                <span v-else-if="item.checkedYn === 'X'" class="none">
                  해당없음
                </span>
                <span v-else class="fail">미완료</span>
              </td>
              <td class="text-center">
                <span>{{
                  dayjs(item.confirmDate).isValid()
                    ? dayjs(item.confirmDate).format("YYYY-MM-DD")
                    : ""
                }}</span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </template>
  </compPage>
</template>

<script setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import compPage from "@/components/layout/compPage.vue";

const router = useRouter();
const headers = [
  {
    title: "안전보건관리체계 구축 및 이행에 관한 조치",
    value: "safetyCheckMasterNm",
    align: "center",
    colspan: 2,
  },
  {
    title: "",
    value: "safetyCheckDetailNm",
    align: "left",
    colspan: 2,
  },
  { title: "점검결과", align: "center", value: "checkedYn" },
  { title: "확보일자", align: "center", value: "confirmDate" },
];

const safeDutyList = ref([]);

const goPage = (link) => {
  if (!link) {
    return;
  }

  router.push({ name: link, params: { isMoveCheckList: true } });
};

const doSearch = () => {
  // TODO axios 호출
  safeDutyList.value = items;
  safeDutyList.value.forEach((element) => {});
};

onMounted(() => {
  doSearch();
});

// TODO 임시 데이터, 추후 쿼리 조회로 변경
const items = [
  {
    safetyCheckMasterId: 0,
    safetyCheckMasterNm: "안전보건 목표, 경영방침 설정",
    safetyCheckDetailId: 1,
    safetyCheckDetailNm:
      "회사(사업장)의 안전보건에 관한 목표와 경영방침이 설정되어 있다.",
    checkedYn: "Y",
    confirmDate: "20240801",
    link: "safeManagementPolicy",
    rowspan: 3,
  },
  {
    safetyCheckMasterId: 0,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 2,
    safetyCheckDetailNm:
      "안전보건 목표와 경영방침을 모든 구성원과 이해관계자가 알 수 있도록 게시판 등을 통해 공개하고 있다.",
    checkedYn: "N",
    confirmDate: "",
    link: "safeManagementPolicyPublication",
  },
  {
    safetyCheckMasterId: 0,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 3,
    safetyCheckDetailNm:
      "안전보건 목표와 경영방침을 주기적으로 검토하고 있다. (반기 1회 검토 권장)",
    checkedYn: "Y",
    confirmDate: "20240819",
    link: "",
  },
  {
    safetyCheckMasterId: 2,
    safetyCheckMasterNm: "안전보건 전담조직 설치",
    safetyCheckDetailId: 4,
    safetyCheckDetailNm:
      "안전보건확보 의무를 총괄·관리하는 전담조직이 구성되어 있다.",
    checkedYn: "Y",
    confirmDate: "20240812",
    link: "safeOrganization",
    rowspan: 1,
  },
  {
    safetyCheckMasterId: 3,
    safetyCheckMasterNm: "위험성평가 절차 마련 및 실시",
    safetyCheckDetailId: 5,
    safetyCheckDetailNm:
      "사업장내 유해·위험요인을 확인하고 개선하는 업무 절차가 마련되어 있다.",
    checkedYn: "Y",
    confirmDate: "20240812",
    link: "siteImpRegulation",
    rowspan: 4,
  },
  {
    safetyCheckMasterId: 4,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 6,
    safetyCheckDetailNm:
      "업무 절차에 따라 유해·위험요인 확인과 개선이 이루어지는지 반기 1회 이상 점검한다.",
    checkedYn: "",
    confirmDate: "",
    link: "RiskAssmnCnfrnMain",
  },
  {
    safetyCheckMasterId: 4,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 7,
    safetyCheckDetailNm: "위험성평가 결과를 경영책임자에게 보고하고 있다.",
    checkedYn: "Y",
    confirmDate: "2024-09-02",
    link: "safeRiskAssmnReport",
  },
  {
    safetyCheckMasterId: 4,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 8,
    safetyCheckDetailNm: "위험성평가에 따라 필요한 조치를 하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "safeActionStatus",
  },
  {
    safetyCheckMasterId: 5,
    safetyCheckMasterNm: "안전보건 예산 편성 및 집행",
    safetyCheckDetailId: 9,
    safetyCheckDetailNm:
      "안전보건인력·시설·장비구비 및 유해·위험요인 개선에 필요한 예산을 편성했다.",
    checkedYn: "Y",
    confirmDate: "20240810",
    link: "safeBudget",
    rowspan: 2,
  },
  {
    safetyCheckMasterId: 5,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 10,
    safetyCheckDetailNm: "편성된 예산이 용도에 맞게 집행되고 있는지 확인한다.",
    checkedYn: "Y",
    confirmDate: "20240810",
    link: "safeBudget",
  },
  {
    safetyCheckMasterId: 6,
    safetyCheckMasterNm: "충실한 안전보건 업무수행 지원",
    safetyCheckDetailId: 11,
    safetyCheckDetailNm:
      "안전보건관리책임자, 관리감독자, 안전보건총괄책임자 등에게 권한과 예산을 부여 하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "siteManPower",
    rowspan: 3,
  },
  {
    safetyCheckMasterId: 6,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 12,
    safetyCheckDetailNm: "업무수행의 충실성을 평가하는 기준이 마련되어 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "safeEvalPage",
  },
  {
    safetyCheckMasterId: 6,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 13,
    safetyCheckDetailNm:
      "평가기준에 따라 업무수행의 충실성 여부를 반기 1회이상 평가·관리하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "safeEvalPage",
  },
  {
    safetyCheckMasterId: 7,
    safetyCheckMasterNm: "안전보건 전문인력 배치",
    safetyCheckDetailId: 14,
    safetyCheckDetailNm:
      "산업안전보건법에따라 안전보건 전문인력을 배치하거나, 전문기관에 위탁 하고 업무 수행시간을 보장하고 있다.",
    checkedYn: "Y",
    confirmDate: "20240825",
    link: "safeExperts",
    rowspan: 2,
  },
  {
    safetyCheckMasterId: 7,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 15,
    safetyCheckDetailNm:
      "전문기관 위탁시, 전문기관의 조언을 충실하게 이행했는지 확인하고 있다.",
    checkedYn: "Y",
    confirmDate: "20240825",
    link: "safeAgencyCheckReport",
  },
  {
    safetyCheckMasterId: 8,
    safetyCheckMasterNm: "종사자 의견 청취 및 개선방안 이행",
    safetyCheckDetailId: 16,
    safetyCheckDetailNm:
      "안전보건에 관한 사항에 대해 종사자의 의견을 듣는 절차가 마련되어 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "siteImpRegulation",
    rowspan: 3,
  },
  {
    safetyCheckMasterId: 8,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 17,
    safetyCheckDetailNm:
      "마련된 절차에 따라 종사자의 의견을 청취하고 개선방안을 마련하여 이행하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "AdditionalRiskDiscovery",
  },
  {
    safetyCheckMasterId: 8,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 18,
    safetyCheckDetailNm:
      "개선방안 이행 여부를 반기 1회 이상 점검하고 필요한 조치를 하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "riskAssmnCnfrnWithAdtnRisk",
  },
  {
    safetyCheckMasterId: 9,
    safetyCheckMasterNm: "재해대응 매뉴얼 마련 및 조치 점검",
    safetyCheckDetailId: 19,
    safetyCheckDetailNm:
      "작업 중지/근로자 대피/위험요인 제거 등 대응조치, 재해자 구호조치, 추가 피해방지 조치가 포함된 대응 매뉴얼이 마련되어 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "safeEmergencyManual",
    rowspan: 2,
  },
  {
    safetyCheckMasterId: 9,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 20,
    safetyCheckDetailNm:
      "매뉴얼에 따라 조치하는지 반기 1회 이상 점검하고 있다.",
    checkedYn: "",
    confirmDate: "",
    link: "safeEmergencyManualCheck",
  },
  {
    safetyCheckMasterId: 10,
    safetyCheckMasterNm: "수급업체 평가기준·절차 마련 및 점검",
    safetyCheckDetailId: 21,
    safetyCheckDetailNm:
      "도급, 용역, 위탁을 받는 자의 산업재해 예방조치 능력과 기술을 평가하는 기준·절차가 마련되어 있다.(관리비용, 공사/건조 기간 포함)",
    checkedYn: "",
    confirmDate: "",
    link: "selectionVenderStandard",
    rowspan: 2,
  },
  {
    safetyCheckMasterId: 10,
    safetyCheckMasterNm: "",
    safetyCheckDetailId: 22,
    safetyCheckDetailNm:
      "마련된 기준·절차에 따라 도급, 용역, 위탁이 이루어지는지 반기 1회 이상 점검 하고 있다.",
    checkedYn: "Y",
    confirmDate: "2024-08-05",
    link: "serviceProviderEvaluationReport",
  },
];
</script>

<style scope></style>
