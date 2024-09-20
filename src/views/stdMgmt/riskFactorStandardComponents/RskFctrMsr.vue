<template>
  <div class="subtitle_area" v-if="selectedLgCatCd && selectedWrkNmCd">
    <div class="title">{{ selectedWrkNm }}</div>
  </div>
  <div class="content_box">
    <table class="grid_default2">
      <thead>
        <tr>
          <th>위험요인</th>
          <th>표준 감소 대책</th>
        </tr>
      </thead>
      <tbody
        v-for="msrList in rskFctrList.slice(0, FIRST_LOADING)"
        :key="msrList">
        <tr>
          <td :rowspan="msrList[0].cnt + 1" class="td-align-top">
            <fctr-msr-td-content :fctrMsrItem="msrList[0]" />
          </td>
          <td>
            <fctr-msr-td-content :fctrMsrItem="msrList[1]" />
          </td>
        </tr>
        <tr
          v-if="selectedVenderCd === '0000'"
          v-for="msr in msrList.slice(2, -1)"
          :key="msr.rskMsrSeq">
          <td>
            <fctr-msr-td-content :fctrMsrItem="msr" />
          </td>
        </tr>
        <tr v-else v-for="msr in msrList.slice(2)" :key="msr.rskMsrSeq + 1">
          <td>
            <fctr-msr-td-content :fctrMsrItem="msr" />
          </td>
        </tr>
      </tbody>
      <tr v-if="rskFctrList.length > FIRST_LOADING && !isAllDataVisible">
        <td colspan="2" class="show-all">
          나머지 위험요인 {{ rskFctrList.length - FIRST_LOADING }}개 불러오는 중
        </td>
      </tr>
      <template v-else>
        <tbody
          v-for="msrList in rskFctrList.slice(FIRST_LOADING)"
          :key="msrList">
          <tr>
            <td :rowspan="msrList[0].cnt + 1" class="td-align-top">
              <fctr-msr-td-content :fctrMsrItem="msrList[0]" />
            </td>
            <td>
              <fctr-msr-td-content :fctrMsrItem="msrList[1]" />
            </td>
          </tr>
          <tr
            v-if="selectedVenderCd === '0000'"
            v-for="msr in msrList.slice(2, -1)"
            :key="msr.rskMsrSeq">
            <td>
              <fctr-msr-td-content :fctrMsrItem="msr" />
            </td>
          </tr>
          <tr v-else v-for="msr in msrList.slice(2)" :key="msr.rskMsrSeq + 1">
            <td>
              <fctr-msr-td-content :fctrMsrItem="msr" />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr v-if="selectedVenderCd !== '0000'">
            <td><fctr-msr-td-content :fctrMsrItem="rskFctrText" /></td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </table>
  </div>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";
import FctrMsrTdContent from "./FctrMsrTdContent.vue";

const store = useRiskFactorStandardStore();

const { defaultColDef, localeText, isAllDataVisible } = defineProps([
  "defaultColDef",
  "localeText",
  "isAllDataVisible",
]);

const emit = defineEmits(["hide"]);
const FIRST_LOADING = 5;

const {
  rskFctrList,
  selectedVenderCd,
  selectedHrmrskFctrMstSeq,
  selectedLgCatCd,
  selectedMdCatCd,
  selectedWrkNmCd,
  selectedWrkNm,
} = storeToRefs(store);

const rskFctrText = ref({
  isRskFctr: true,
  isTextarea: true,
  rskFctr: "",
  rskFctrSeq: -1,
  rskMsr: "",
  rskMsrSeq: -1,
});

const fetchRskFctrMsrListDebounced = debounce(async () => {
  if (selectedWrkNmCd.value) {
    const params = {
      vendrCd: selectedVenderCd.value,
      hrmrskFctrMstSeq: selectedHrmrskFctrMstSeq.value,
      lgCatCd: selectedLgCatCd.value,
      mdCatCd: selectedMdCatCd.value,
      wrkNmCd: selectedWrkNmCd.value,
    };
    await store.fetchRskFctrMsrList(params, selectedWrkNm.value);
  }
}, 50);

watch(
  [
    selectedVenderCd,
    selectedHrmrskFctrMstSeq,
    selectedLgCatCd,
    selectedMdCatCd,
    selectedWrkNmCd,
  ],
  () => {
    emit("hide");
    fetchRskFctrMsrListDebounced();
  },
  { immediate: true }
);
</script>

<style scoped>
.content_box {
  padding: 10px;
}
.grid_default2 {
  width: 100%;
  box-shadow: none;
}
.subtitle_area {
  float: left;
  margin-top: 30px;
}
.td-align-top {
  padding-top: 15px;
  vertical-align: top;
}

.show-all {
  font-size: 1.2rem; /* 글씨 크기 */
  padding: 1rem; /* 내부 여백 */
  text-align: center;
  vertical-align: middle;
}

.disabled-textarea {
  min-height: 40px;
  background-color: transparent;
}
</style>
