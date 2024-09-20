<template>
  <compFormInput :label="label">
    <v-select
      v-model="selected"
      density="compact"
      :items="dataList"
      :item-title="title"
      variant="outlined"
      hide-details="auto"
      @update:modelValue="emit('update-data', selected)">
    </v-select>
  </compFormInput>
</template>

<script setup>
import { ref } from "vue";
import compFormInput from "@/views/component/compFormInput.vue";
const props = defineProps({
  label: {
    type: String,
    default: "인풋라벨",
  },
  placeholder: {
    type: String,
    default: "선택해주세요",
  },
  dataList: {
    type: Array,
    default: ["a", "b", "c"],
  },
  data: {
    default: null,
  },
  title: {
    // dataList가 object일때 화면에 보여줄 항목의 키값
    default: null,
  },
});

const emit = defineEmits(["update-data"]);

const selected = ref(null);
// 선택된 데이터가 없는 경우 플레이스 홀더 보여줌
if (!props.data) {
  selected.value = props.placeholder;
} else {
  selected.value = props.data;
}
</script>

<style lang="scss" scoped></style>
