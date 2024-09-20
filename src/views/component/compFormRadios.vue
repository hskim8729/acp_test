<template>
  <compFormInput :label="label">
    <v-row no-gutters>
      <v-radio-group
        v-for="option in options"
        v-model="data"
        inline
        hide-details="auto"
        class="justify-start">
        <v-radio :label="option.label" :value="option.value"></v-radio>
      </v-radio-group>
    </v-row>
  </compFormInput>
</template>

<script setup>
import { ref } from "vue";
import compFormInput from "@/views/component/compFormInput.vue";

const data = ref(null);

const props = defineProps({
  label: {
    type: String,
    default: "인풋라벨",
  },
  options: {
    type: Array,
    default: [
      { label: "가", value: "a" },
      { label: "나", value: "b" },
      { label: "다", value: "c" },
    ],
  },
});
</script>

<style lang="scss" scoped></style>
