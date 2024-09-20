<template>
  <div class="d-flex flex-column">
    <!-- 상중하 -->
    <template v-if="code === 'T0501'">
      <risk-radio
        radioLabel="상중하"
        :options="options.rst"
        v-model:data="computedRst"
        :readOnly="readOnly" />
    </template>

    <!-- 빈도강도법-->
    <template v-else>
      <risk-radio
        radioLabel="빈도"
        :options="options.freq"
        v-model:data="computedFreq"
        :readOnly="readOnly" />

      <risk-radio
        radioLabel="강도"
        :options="options.strngth"
        v-model:data="computedStrngth"
        :readOnly="readOnly" />

      <form-text label="결과" width="42px">
        <div class="d-flex align-center pr-1 pt-1 h-100">
          {{ computedRst ? computedRst : "빈도와 강도를 모두 선택해주세요" }}
        </div>
      </form-text>
    </template>
  </div>
</template>

<script setup>
// node_modules
import { computed } from "vue";
// 컴포넌트
import formText from "@/components/form/formText.vue";
import riskRadio from "./riskRadio.vue";

// 결과
const computedRst = computed({
  get: () => {
    let result;
    switch (props.code) {
      case "T0501":
        result = props.rst;
        break;
      case "T0502":
      case "T0503":
        result =
          computedFreq.value && computedStrngth.value
            ? computedFreq.value * computedStrngth.value
            : 0;
        break;
      default:
        result = null; // 기본값 추가
    }
    return result;
  },
  set: (val) => {
    if (Number.isInteger(val)) {
      emit("update:rst", val);
    }
  },
});

// 상중하 값
const computedFreq = computed({
  get: () => props.freq,
  set: (val) => {
    emit("update:freq", val);
    if (computedStrngth.value) {
      emit("update:rst", computedRst);
    }
  },
}); // 빈도

const computedStrngth = computed({
  get: () => props.strngth,
  set: (val) => {
    emit("update:strngth", val);
    if (computedFreq.value) {
      emit("update:rst", computedRst);
    }
  },
}); // 강도

// 코드에 따라서 위험성 평가 옵션 다르게 줌
const options = computed(() => {
  let result;
  switch (props.code) {
    case "T0501":
      result = {
        rst: [
          { label: "상", value: 3 },
          { label: "중", value: 2 },
          { label: "하", value: 1 },
        ],
      };
      break;
    case "T0502":
      result = {
        freq: createObjectArray(3),
        strngth: createObjectArray(3),
        rst: 0,
      };
      break;
    case "T0503":
      result = {
        freq: createObjectArray(5),
        strngth: createObjectArray(5),
        rst: 0,
      };
      break;

    default:
      alert(props.code, ">>>> 잘못된 코드입니다");
      break;
  }
  return result;
});

const emit = defineEmits(["update:rst", "update:freq", "update:strngth"]);
const props = defineProps({
  code: {
    type: String,
    default: "T",
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  rst: {
    type: Number,
    default: 0,
  },
  freq: {
    type: Number,
    default: 0,
  },
  strngth: {
    type: Number,
    default: 0,
  },
});

// onBeforeMount(() => {
//   rst.value = props.rst;
//   freq.value = props.freq;
//   strngth.value = props.strngth;
// });

function createObjectArray(num) {
  const result = [];
  for (let i = 1; i <= num; i++) {
    result.push({ label: String(i), value: i });
  }
  return result;
}
</script>

<style lang="scss" scoped></style>
