<template>
  <v-container class="py-2">
    <v-row no-gutters class="flex-wrap" align="center">
      <v-col cols="2" class="mr-5 label_box"
        ><div class="label font-weight-bold">{{ label }}</div></v-col
      >
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
    default: "인 풋 라 벨",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.label_box {
  min-width: 84px;
  max-width: 100px;
}

// label 값을 쓸때 띄어쓰기를 쓰면 자동으로 가장자리 정렬 해줌
.label {
  text-align: justify;
  line-height: 0;
}

.label:after {
  content: "";
  display: inline-block;
  width: 100%;
}

.label:before {
  content: "";
  display: inline-block;
  width: 100%;
}
</style>
