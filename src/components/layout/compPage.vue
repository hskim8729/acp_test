<template>
  <v-card class="ma-0" height="100%" :min-width="minWidth">
    <v-toolbar density="compact" class="pl-2 pr-4" color="white">
      <v-toolbar-title class="pt-2 font-weight-black">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="toolbarBody"></slot>
    </v-toolbar>

    <v-divider />

    <v-card-text class="bg-background py-3 px-3 main">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "페이지 제목",
  },
  minWidth: {
    type: [String, Number],
    default: "1000px",
  },
});
</script>

<style scoped>
.main {
  overflow-y: auto;
  height: calc(100% - 48px);
}
</style>
