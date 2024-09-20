<template>
  <div class="d-flex flex-row">
    <v-card
      class="text-gray900 w-100"
      elevation="0"
      variant="flat"
      rounded="lg"
      border>
      <v-card-text class="pa-4 d-flex flex-row">
        <div class="text-subtitle-5 pl-2 text-error" style="width: 100px">
          위험요인
        </div>
        <div>{{ data.rskFctr }}</div>
      </v-card-text>
      <v-divider />
      <v-card-text class="pa-4 d-flex flex-row">
        <div class="text-subtitle-5 pl-2" style="width: 100px">감소대책</div>
        <div>{{ data.dcrsMsr }}</div>
      </v-card-text>
    </v-card>
    <v-btn
      style="height: 50px !important"
      variant="flat"
      class="ma-2 text-error"
      icon="mdi-close"
      density="comfortable"></v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: {
      rskFctr: "",
      dcrsMsr: "",
    },
  },
});
</script>

<style lang="scss" scoped></style>
