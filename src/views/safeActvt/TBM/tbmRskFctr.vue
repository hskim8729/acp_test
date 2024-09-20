<!-- 안전활동 -> TBM 등록 -> 위험성 평가 내용-->
<template>
  <comp-card-foldable title="2. 위험성 평가 내용" isFlat>
    <template #button>
      <comp-button
        text="위험요인 추가"
        v-if="!readonly"
        @click="isPopRskFatr = true" />
    </template>
    <pop-tbm-rsk-fctr
      @get-selected-rsk-fctr="getSelectedRskFctr"
      @close-modal="isPopRskFatr = false"
      v-if="isPopRskFatr" />

    <div class="grid-height">
      <comp-ag-grid
        :row-data="computedTbmRskFctr"
        :columnDefs="colDefs"
        pagination />
    </div>
  </comp-card-foldable>
</template>

<script setup>
// 모듈
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 컴포넌트
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compGridButton from "@/components/grid/compGridButton.vue";
import compCardFoldable from "@/components/layout/compCardFoldable.vue";
import popTbmRskFctr from "./popTbmRskFctr.vue";
// 스토어
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const { computedTbmRskFctr } = storeToRefs(toolBoxRegiStore);

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
});

const colDefs = [
  {
    headerName: "No.",
    valueGetter: (params) => params.node.rowIndex + 1,
    width: 100,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "위험요인",
    field: "rskFctr",
    flex: 1,
    cellStyle: { textAlign: "left", whiteSpace: "pre-wrap" },
    minWidth: 300,
  },
  {
    headerName: "감소대책",
    field: "dcrsMsr",
    flex: 1,
    cellStyle: { textAlign: "left" },
    minWidth: 300,
  },
  {
    headerName: "삭제",
    field: "delBtn",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    cellRenderer: compGridButton,
    cellRendererParams: (params) => ({
      onClick: async () => {
        await toolBoxRegiStore.deleteTbmRskFctr(params.rowIndex);
      },
      type: "del",
      visible: true,
      isNotRequiredAuth: true,
    }),
    hide: props.readonly,
  },
];

// 위험요인 검색 팝업 생성
const isPopRskFatr = ref(false);
const getSelectedRskFctr = async (selected) => {
  console.log(selected);
  await toolBoxRegiStore.addTbmRskFctr(selected);
};
</script>

<style lang="scss" scoped>
.grid-height {
  height: 500px;
  width: 100%;
}
</style>
