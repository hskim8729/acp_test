<template>
  <v-text-field
    v-model="internalValue"
    density="compact"
    variant="outlined"
    hide-details="auto"
    :counter="props.maxLength"
    :maxlength="props.maxLength"
    :id="props.id"
    :type="props.type"
    :class="computedClass"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :rules="computedRules"
    :suffix="props.suffix"
    :persistent-placeholder="props.suffix ? true : false"
    validate-on="blur"
    ref="compInputRef"
    @input="emits('update:value', internalValue)"
    @keypress.enter="emits('enterFunction')">
  </v-text-field>
</template>
<script setup>
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
  ref,
} from "vue";

const emits = defineEmits(["update:value", "enterFunction"]);
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: null,
  },
  placeholder: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
  requiredAuth: {
    type: Boolean,
    default: false,
  },
  suffix: {
    type: String,
    default: "",
  },
});

const internalValue = ref("");
const isFocus = ref(false);

// class 설정
const computedClass = computed(() => {
  let inputClass = props.class;

  switch (props.type) {
    // 현재 width를 하드코딩한 곳이 많아서, v-text-field에 type을 date로 줄 경우 width는 기본 150px로 고정
    // 추후 레이아웃에서 width 잡도록 작업하면 될듯
    case "date":
      inputClass = inputClass + " date-width";
      break;
    default:
      inputClass = props.color;
      break;
  }
  return inputClass;
});

// pattern 설정, 적용이 안돼서 나중에 다시 할것
// const computedPattern = () => {
//   switch (props.type) {
//     case "telno":
//       return /^\d{2,3}-\d{3,4}-\d{4}$/;
//     case "busno":
//       return /^\d{3}-\d{2}-\d{5}$/;
//     default:
//       return "";
//   }
// };

const computedRules = computed(() => {
  const validRules = [...props.rules];

  // 필수값 체크
  if (props.required) {
    const requiredRule = (value) =>
      !!value || `${props.name}은(는) 필수입니다.`;
    validRules.unshift(requiredRule);
  }

  // 최대 길이 체크
  if (props.maxLength) {
    const maxLengthRule = (value) =>
      value.length <= props.maxLength ||
      `최대 길이 : ${props.maxLength} / 입력 길이 : ${value.length}`;
    validRules.push(maxLengthRule);
  }

  // email 형식 체크
  if (props.type === "email") {
    const emailRules = (value) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || "e-mail 형식을 확인해주세요.";
    };
    validRules.push(emailRules);
  }

  // 전화번호 형식 체크
  if (props.type === "telno") {
    const telnoRules = (value) => {
      const pattern =
        /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
      return pattern.test(value) || `${props.name} 형식을 확인하세요.`;
    };
    validRules.push(telnoRules);
  }

  // 사업자번호 형식 체크 (청,서코드(3) + 개인/법인 구분코드(2) + 일련번호(4) + 검증번호 (1))
  if (props.type === "busno") {
    const busnoRules = (value) => {
      const replaceValue = value.replace(/-/gi, "");
      const valueMap = replaceValue.split("").map(function (item) {
        return parseInt(item, 10);
      });

      const keyArr = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
      let chkSum = 0;

      for (var i = 0; i < keyArr.length; ++i) {
        chkSum += keyArr[i] * valueMap[i];
      }

      chkSum += parseInt((keyArr[8] * valueMap[8]) / 10, 10);

      return (
        (replaceValue.length == 10 &&
          Math.floor(valueMap[9]) === (10 - (chkSum % 10)) % 10) ||
        `${props.name} 형식을 확인하세요.`
      );
    };
    validRules.push(busnoRules);
  }

  return validRules;
});

const initData = () => {
  setInputAuth(); // 권한체크
};

const setInputAuth = () => {
  // input에는 각자 권한처리 파라미터를 주기 힘들어서 추후에 form에 감싸는 방식으로 처리할 예정
  if (props.requiredAuth) {
    return true;
  }
};

const compInputRef = ref(null);
const focus = () => {
  compInputRef.value.focus();
};

onMounted(() => {
  initData();
});

defineExpose({
  focus,
});
</script>
<style scoped></style>
