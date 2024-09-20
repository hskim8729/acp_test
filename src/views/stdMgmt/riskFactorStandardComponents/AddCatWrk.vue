<template>
  <div class="container py-3">
    <v-text-field
      class="read-only-style-none"
      hide-details="auto"
      density="compact"
      variant="outlined"
      spellcheck="false"
      :maxlength="maxlength"
      :counter="maxlength"
      v-model="inputValue"
      type="text"
      @keyup.enter="onEnterAdd"
      :placeholder="placeholder"
      :disabled="disabled" />
    <button @click="onAdd" style="height: 40px" class="cell_btn ms-1">
      추가
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";

const maxlength = 50;

const store = useRiskFactorStandardStore();
const emit = defineEmits(["scroll"]);
const { gridApi, type } = defineProps(["grid-api", "type"]);

const {
  selectedLgCatNm,
  selectedLgCatCd,
  selectedMdCatNm,
  selectedMdCatCd,
  selectedWrkNmCd,
  selectedWrkNm,
  lgCatList,
  mdCatList,
  wrkList,
} = storeToRefs(store);

const inputValue = ref("");

const name = {
  lg: "대분류",
  md: "중분류",
  wrk: "작업",
};

const disabled = ref(false);

watch([selectedLgCatNm, selectedMdCatNm], () => {
  const disableObj = {
    lg: false,
    md: selectedLgCatNm.value === "" ? true : false,
    wrk: selectedMdCatNm.value === "" ? true : false,
  };
  disabled.value = disableObj[type];
});

const placeholder = "추가할 " + name[type] + "명을 입력해주세요";

const storeFectchFunctions = {
  lg: store.fetchLgCat,
  md: store.fetchMdCat,
  wrk: store.fetchWrk,
};

const storeNm = {
  lg: "lgCatNm",
  md: "mdCatNm",
  wrk: "wrkNm",
};

function onEnterAdd(event) {
  if (!event.isComposing && event.keyCode !== 229 && event.key === "Enter") {
    onAdd();
  }
}

// 대분류, 소분류, 작업명 추가
async function onAdd() {
  if (inputValue.value) {
    let duplicatedItemCnt;
    if (type === "lg") {
      duplicatedItemCnt = lgCatList.value.filter(
        (data) => data.lgCatNm === inputValue.value
      ).length;
    } else if (type === "md") {
      duplicatedItemCnt = mdCatList.value.filter(
        (data) => data.mdCatNm === inputValue.value
      ).length;
    } else if (type === "wrk") {
      duplicatedItemCnt = wrkList.value.filter(
        (data) => data.wrkNm === inputValue.value
      ).length;
    }
    if (duplicatedItemCnt >= 1) {
      alert(inputValue.value + "은 이미 존재하는 " + name[type] + "명입니다.");
    } else {
      // type에 해당하는 함수를 가져옵니다.
      const fetchFunc = storeFectchFunctions[type];
      const newNm = inputValue.value;
      const params = {};
      params["mode"] = "I";
      params[storeNm[type]] = newNm;
      if (fetchFunc) {
        // 함수가 존재하는지 확인
        await fetchFunc(params).then((list) => {
          const nm = storeNm[type];
          let idx = list.findIndex((data) => data[nm] == newNm);
          if (type === "lg") {
            selectedLgCatNm.value = list[idx].lgCatNm;
            selectedLgCatCd.value = list[idx].lgCatCd;
          } else if (type === "md") {
            selectedMdCatNm.value = list[idx].mdCatNm;
            selectedMdCatCd.value = list[idx].mdCatCd;
          } else if (type === "wrk") {
            selectedWrkNm.value = list[idx].wrkNm;
            selectedWrkNmCd.value = list[idx].wrkNmCd;
            // rsk-fctr-msr 컴포넌트 로딩 시간 필요
            setTimeout(() => {
              emit("scroll");
            }, 50);
          }
          inputValue.value = "";
        });
      } else {
        console.error(`Invalid type: ${type}`);
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

input {
  flex-grow: 1;
  margin-right: 20px;
}
</style>
