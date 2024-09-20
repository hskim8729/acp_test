<template>
  <v-select
    v-model="selected"
    density="compact"
    :items="dataList"
    :item-title="titleKey"
    :item-value="dataKey"
    :disabled="readOnly"
    variant="outlined"
    hide-details="auto"
    @update:modelValue="emit('update:data', selected)" />
</template>

<script setup>
// node_modules
import { ref } from "vue";
// 외부 변수 및 함수
// 컴포넌트
// store

const props = defineProps({
  placeholder: {
    type: String,
    default: "선택해주세요",
  },
  dataList: {
    type: Array,
    default: ["a", "b", "c"],
  },
  data: {
    // 선택된 항목
    default: null,
  },
  titleKey: {
    // dataList가 object일때 화면에 보여줄 항목의 키값
    default: null,
  },
  dataKey: {
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:data"]);

const selected = ref(null);
// 선택된 데이터가 없는 경우 플레이스 홀더 보여줌
if (!props.data) {
  selected.value = props.placeholder;
} else {
  selected.value = props.data;
}
</script>

<style lang="scss" scoped></style>
