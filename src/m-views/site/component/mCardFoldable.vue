<template>
  <v-card
    class="mx-auto"
    :class="noMargin ? 'mb-0' : 'mb-3'"
    variant="flat"
    rounded="lg"
    width="100%">
    <v-card-actions>
      <v-card-title class="text-subtitle-2"> {{ title }} </v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-card-text
          class="pt-0 pb-5 text-body-1"
          style="white-space: pre-line">
          <slot name="default"> 디폴트 슬롯 입니다. 텍스트를 입력하세요 </slot>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const show = ref(true);

const props = defineProps({
  title: {
    type: String,
    default: "title=제목 형태로 사용",
  },
  noMargin: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
