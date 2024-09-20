<template>
  <template v-for="(file, idx) in fileArr" :key="file">
    <v-img :src="file" :style="{ borderRadius: '10px' }">
      <input
        v-if="!props.readOnly"
        type="button"
        class="del"
        @click="() => emit('delete-file', idx)" />
      <div class="file_name" @click="() => emit('download-file', idx)">
        다운로드
      </div>
    </v-img>
    <v-container fluid class="px-0 pt-0 pb-2"></v-container>
  </template>
</template>

<script setup>
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
});

const emit = defineEmits(["download-file", "delete-file"]);
</script>

<style lang="scss" scoped></style>
