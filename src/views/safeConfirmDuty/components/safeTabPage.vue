<template>
  <v-tabs
    v-model="activeTab"
    density="compact"
    color="#111827"
    slider-color="#3A6486"
    class="mt-3 mb-2 text-gray500 text-subtitle-2 border-only-bottom">
    <v-tab v-for="tab in tabList" :key="tab.value" :value="tab.value">
      {{ tab.name }}
    </v-tab>
  </v-tabs>
  <slot name="betweenTab"></slot>
  <v-tabs-window v-model="activeTab">
    <v-tabs-window-item
      v-for="tab in tabList"
      :key="tab.value"
      :value="tab.value">
      <!-- tabList 파라미터로 component 전달 -->
      <component
        v-if="!$slots.tabItem && tab.value === activeTab"
        :is="tabComponent"
        :key="activeTab"
        v-bind="computedAttrs(tab)"></component>

      <!-- slot으로 tab-item 전달 -->
      <slot name="tabItem"> </slot>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { ref, defineProps, inject, onBeforeMount, watch } from "vue";
import compPageCard from "@/components/layout/compPageCard.vue";

const props = defineProps({
  isFillPage: {
    type: Boolean,
    default: false,
  },
  tabList: {
    type: Array,
    default: [
      {
        value: "", // tab key
        name: "", // 화면에 보여질 tab 텍스트
        component: null, // tab-item에 랜더링시킬 컴포넌트 / tabItem slot이용가능
      },
    ],
  },
});

/**
 * 랜더링시킬 component
 */
const tabComponent = ref(null);

const changeTab = (item) => {
  tabComponent.value = item.component;
};

const computedAttrs = (tab) => {
  const attrs = {};
  //if (activeTab.value) attrs.tabs = activeTab.value;
  if (tab.params) attrs.params = tab.params;
  return attrs;
};

/**
 * 탭 변경 이벤트
 */
const activeTab = ref("");

watch(activeTab, (newTabValue) => {
  const selectedTab = props.tabList.find((tab) => tab.value === newTabValue);

  if (selectedTab) {
    changeTab(selectedTab);
  }
});

onBeforeMount(() => {
  if (props.tabList.length > 0) {
    changeTab(props.tabList[0]);
  }
});
</script>

<style lang="scss" scoped></style>
