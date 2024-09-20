<template>
  <v-container class="py-1">
    <v-row no-gutters class="flex-wrap">
      <div
        :style="{ width: props.width }"
        class="d-flex justify-start"
        :class="labelClass">
        <div class="text-subtitle-5">{{ label }}</div>
        <div v-if="isOption" class="pt-1 mr-1 text-caption-3">(선택)</div>
      </div>
      <v-col>
        <slot>
          <v-text-field
            density="compact"
            :placeholder="placeholder"
            variant="outlined"
            hide-details="auto">
          </v-text-field>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "인풋라벨",
  },
  placeholder: {
    type: String,
    default: "이 양식으로 사용",
  },
  width: {
    type: String,
    default: "84px",
  },
  isOption: {
    type: Boolean,
    default: false,
  },
  labelClass: {
    type: String,
    default: "mr-5 pt-2",
  },
});
</script>

<style lang="scss" scoped></style>
