<template>
  <template v-for="(file, idx) in fileArr" :key="file">
    <v-img :src="file"></v-img>
    <v-container fluid class="px-0 pt-0 pb-2">
      <v-row no-gutters>
        <v-col v-if="!props.readOnly">
          <compButton
            class="ma-0"
            @click="() => emit('delete-file', idx)"
            :block="true"
            text="삭제"
            font-color="var(--default-btn-color)"
            variant="outlined"
            type="button"
            rounded="0">
          </compButton>
        </v-col>
        <v-col v-if="isDownload">
          <compButton
            class="ma-0"
            @click="() => emit('download-file', idx)"
            :block="true"
            text="다운로드"
            type="button"
            rounded="0">
          </compButton>
        </v-col>
      </v-row>
    </v-container>
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
