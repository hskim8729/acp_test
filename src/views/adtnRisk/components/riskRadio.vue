<template>
  <form-text :label="radioLabel" width="42px">
    <div class="d-inline-flex justify-start">
      <v-radio-group
        v-for="option in options"
        v-model="computedData"
        :disabled="readOnly"
        hide-details="auto">
        <v-radio :label="option.label" :value="option.value"></v-radio>
      </v-radio-group>
    </div>
  </form-text>
</template>

<script setup>
import formText from "@/components/form/formText.vue";
import { computed } from "vue";

// const data = ref(null);
const emit = defineEmits(["update:data"]);
// watch(
//   () => data.value,
//   (newValue) => {
//     emit("update:data", newValue);
//   }
// );
const computedData = computed({
  get: () => props.data,
  set: (val) => emit("update:data", val),
});

const props = defineProps({
  data: {
    type: Number,
    default: 0,
  },
  radioLabel: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: [
      { label: "상", value: 3 },
      { label: "중", value: 2 },
      { label: "하", value: 1 },
    ],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
