<template>
  <comp-modal
    class="bg-background"
    :modal-title="title"
    @close="emits('close')"
    :modal-width="width"
    :isActions="false">
    <v-card class="text-center">
      <img v-for="file in fileArr" :key="file.src" :src="file.src" />
    </v-card>
  </comp-modal>
</template>

<script setup>
import { ref } from "vue";

import compModal from "@/components/modal/compModal.vue";
import fileViews from "@/components/file/fileViews.vue";

const emits = defineEmits(["close"]);
const props = defineProps({
  fileArr: {
    type: Array,
    default: [],
  },
  isDownload: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "자세히 보기",
  },
  width: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped></style>
