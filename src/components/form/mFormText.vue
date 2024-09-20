<template>
  <div>
    <span>{{ label }}</span>
    <span v-if="optional">(선택)</span>
    <span v-else class="text-error">*</span>
    <div :class="slotClass">
      <slot> '슬롯 안에 인풋 넣어 사용' </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "인풋라벨",
  },
  optional: {
    type: Boolean,
    default: false,
  },
  slotClass: {
    type: String,
    default: "d-flex pt-1 ",
  },
});
</script>

<style lang="scss" scoped></style>
