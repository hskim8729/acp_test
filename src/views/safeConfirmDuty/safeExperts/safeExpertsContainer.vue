<template>
  <comp-page-card isFillPage>
    <template #multiCard="{ height }">
      <v-row dense style="overflow: hidden">
        <v-col
          class="transitioning-col"
          :xxl="selectedExpert !== null ? 6 : 12"
          :xl="selectedExpert !== null ? 6 : 12"
          :lg="selectedExpert !== null ? 6 : 12"
          md="12"
          sm="12"
          xs="12">
          <comp-card :height="height">
            <template #defaultCard>
              <safe-experts-list />
            </template>
          </comp-card>
        </v-col>

        <v-divider
          v-if="!lgAndUp && selectedExpert !== null"
          class="mt-5 mb-3" />

        <transition name="slide-right" mode="out-in">
          <v-col v-if="selectedExpert !== null">
            <comp-card :height="height">
              <template #defaultCard>
                <safe-experts-detail />
              </template>
            </comp-card>
          </v-col>
        </transition>
      </v-row>
    </template>
  </comp-page-card>
</template>

<script setup>
// node_modules
import { storeToRefs } from "pinia";
import { defineProps, ref, watch } from "vue";
import { useDisplay } from "vuetify";

// 컴포넌트
import compCard from "@/components/layout/compCard.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import safeExpertsDetail from "@/views/safeConfirmDuty/safeExperts/safeExpertsDetail.vue";
import safeExpertsList from "@/views/safeConfirmDuty/safeExperts/safeExpertsList.vue";

// store
import { useSafeExpertsStore } from "@/stores/safeConfirmDuty/safe-experts-store.js";

const safeExpertsStore = useSafeExpertsStore();
const { selectedExpert } = storeToRefs(safeExpertsStore);

const { lgAndUp } = useDisplay(); // 화면 크기 따라 가로/세로배치 바뀜

const props = defineProps({
  params: {
    type: Object,
    default: {},
  },
});

watch(
  () => props.params.value,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await safeExpertsStore.getExpertsList(newVal);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.transitioning-col {
  transition: all 0.5s ease-in-out;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
