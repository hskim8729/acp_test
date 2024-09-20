<template>
  <v-container>
    <div class="text-subtitle-4">정보 입력</div>
  </v-container>

  <v-container class="d-flex flex-row pa-0">
    <form-text label="성명">
      <comp-input
        v-model="selectedExpert.name"
        placeholder="성명을 입력해주세요"
        name="성명" />
    </form-text>
    <form-text label="소속 기관">
      <comp-input
        v-model="selectedExpert.vendrNm"
        placeholder="소속된 기관명을 입력해주세요"
        name="소속 기관" />
    </form-text>
  </v-container>

  <v-container class="d-flex flex-row pa-0">
    <formText label="전화번호">
      <comp-input
        v-model="selectedExpert.crryTelNo"
        placeholder="전화번호를 입력해주세요"
        name="전화번호" />
    </formText>

    <formText label="선임 일자">
      <div class="d-flex flex-row">
        <comp-input
          type="date"
          v-model="formedAssignedDate"
          placeholder="선임된 날짜를 입력해주세요"
          name="선임일자" />
      </div>
    </formText>
  </v-container>

  <v-container class="d-flex flex-row pa-0">
    <formText label="생년월일">
      <div class="d-flex flex-row">
        <comp-input type="date" v-model="formedBirthDate" name="생년월일" />
      </div>
    </formText>
    <form-text label="자격 번호">
      <comp-input
        v-model="selectedExpert.certificateNo"
        placeholder="자격 및 면허 번호를 입력해주세요"
        name="자격/면허 번호" />
    </form-text>
  </v-container>

  <v-container class="d-flex flex-row pa-0">
    <form-text label="이메일">
      <comp-input
        v-model="selectedExpert.email"
        placeholder="이메일을 입력해주세요"
        name="이메일" />
    </form-text>

    <form-text label="전담겸임 구분">
      <div class="d-inline-flex justify-start">
        <v-radio-group
          v-for="option in options"
          v-model="selectedExpert.roleType"
          hide-details="auto">
          <v-radio :label="option.label" :value="option.value"></v-radio>
        </v-radio-group>
      </div>
    </form-text>
  </v-container>

  <v-container>
    <v-divider class="pt-2 pb-5 mb-2" />
    <experts-experiences expType="career" title="경력" />
    <v-divider class="pt-2 pb-5 mb-2" />
    <experts-experiences expType="education" title="학력" />
  </v-container>
</template>

<script setup>
// node_modules
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed } from "vue";
// 컴포넌트
import formText from "@/components/form/formText.vue";
import expertsExperiences from "@/views/safeConfirmDuty/safeExperts/expertsExperiences.vue";
// 스토어
import { useSafeExpertsStore } from "@/stores/safeConfirmDuty/safe-experts-store.js";

const options = [
  { label: "전담", value: "single" },
  { label: "겸임", value: "multi" },
];

const safeExpertsStore = useSafeExpertsStore();
const { selectedExpert } = storeToRefs(safeExpertsStore);

const formedBirthDate = computed({
  get: () => {
    if (selectedExpert.value.birthDate) {
      return dayjs(selectedExpert.value.birthDate, "YYYYMMDD").format(
        "YYYY-MM-DD"
      );
    } else {
      return "";
    }
  },
  set: (val) => {
    if (val) {
      selectedExpert.value.birthDate = val.split("-").join("");
    }
  },
});

const formedAssignedDate = computed({
  get: () => {
    if (selectedExpert.value.assignedDate) {
      return dayjs(selectedExpert.value.assignedDate, "YYYYMMDD").format(
        "YYYY-MM-DD"
      );
    } else {
      return "";
    }
  },
  set: (val) => {
    if (val) {
      selectedExpert.value.assignedDate = val.split("-").join("");
    }
  },
});
</script>

<style lang="scss" scoped></style>
