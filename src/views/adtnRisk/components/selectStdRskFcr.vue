<template>
  <!-- 공종/작업명은 작성(I)일때만 수정가능 -->
  <v-text-field
    v-model="showingText"
    maxlength="200"
    placeholder="작업명을 검색해주세요"
    @click="isModalOpen = true"
    density="compact"
    variant="outlined"
    hide-details="auto"
    :append-inner-icon="readOnly ? null : 'mdi-magnify'" />
  <!-- 표준추가 팝업 -->
  <compModal
    v-if="isModalOpen"
    @close="closeModal"
    @modal-action="modalAction"
    isActions
    modalTitle="표준추가"
    actionBtnText="저장하기"
    modalWidth="1200px"
    maxModalWidth="1200px"
    height="auto">
    <div class="pa-3 d-flex flex-row justify-space-between">
      <div class="std_sort_step1">
        <div class="sort_grid_title_area">
          <span>대분류</span>
        </div>
        <div class="grid_sort">
          <table>
            <tr v-for="(item, index) in lgCatList" :key="index">
              <td
                @click="selectFetchMdCatList(item, index)"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                {{ item.lgCatNm }}
                <span
                  :class="{
                    selectedCheck: index === selectdIdx.lg,
                  }"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="std_sort_step2">
        <div class="sort_grid_title_area">
          <span>중분류</span>
        </div>
        <div class="grid_sort">
          <table>
            <tr v-for="(item, index) in mdCatList" :key="index">
              <td
                @click="selectFetchWrkCatList(item, index)"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                {{ item.mdCatNm }}
                <span
                  :class="{
                    selectedCheck: index === selectdIdx.md,
                  }"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="std_sort_step3">
        <div class="sort_grid_title_area">
          <span>작업명</span>
        </div>
        <div class="grid_sort">
          <table>
            <tr v-for="(item, index) in wrkList" :key="index">
              <td
                @click="selectFetchrsfRmmCatList(item, index)"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                {{ item.wrkNm }}
                <span
                  :class="{
                    selectedCheck: index === selectdIdx.wrk,
                  }"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </compModal>
</template>

<script setup>
// node_modules
import { computed, onBeforeMount, ref } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import compModal from "@/components/modal/compModal.vue";
// store
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store";
import { storeToRefs } from "pinia";

const rskFctr = ref({});
const selectdIdx = ref({
  lg: null,
  md: null,
  wrk: null,
});

const loginAuthStore = useLoginAuthStore();
const { siteInfo } = storeToRefs(loginAuthStore);
// 대분류 조회
onBeforeMount(async () => {
  const lgCatListParam = {
    vendrCd: siteInfo.value.vendrCd,
    siteCd: siteInfo.value.siteCd,
  };
  await store.fetchLgCatList(lgCatListParam);
  await selectFetchMdCatList(lgCatList.value[0], 0); // 첫 대분류 선택
});

const store = useComRiskFactorStandardStore();
const { lgCatList, mdCatList, wrkList } = storeToRefs(store);

// 대분류 클릭 시 중분류 검색
async function selectFetchMdCatList(item, index) {
  await store.fetchMdCatList(item); // 중분류 조회
  selectdIdx.value.lg = index; // 선택한 대분류에 css로 체크 넣음
  rskFctr.value = item;
  // 해당 대분류의 첫번째 중분류 선택하여 검색
  rskFctr.value.mdCatCd = mdCatList.value[0].mdCatCd;
  rskFctr.value.mdCatNm = mdCatList.value[0].mdCatNm;
  await selectFetchWrkCatList(rskFctr.value, 0);
}

// 중분류 클릭 시 작업명 검색
async function selectFetchWrkCatList(item, index) {
  rskFctr.value.mdCatCd = item.mdCatCd;
  rskFctr.value.mdCat = item.mdCatl;
  await store.fetchWrkList(rskFctr.value);
  selectdIdx.value.md = index; // 선택한 중분류에 css로 체크 넣음
  // 해당 중분류의 첫번째 작업명 선택하여 검색
  rskFctr.value.wrkNmCd = wrkList.value[0]?.wrkNmCd;
  rskFctr.value.wrkNm = wrkList.value[0]?.wrkNm;
  await selectFetchrsfRmmCatList(rskFctr.value, 0);
}

// 작업명 클릭 시
async function selectFetchrsfRmmCatList(item, index) {
  selectdIdx.value.wrk = index;
  rskFctr.value.wrkNmCd = item.wrkNmCd;
  rskFctr.value.wrkNm = item.wrkNm;
}

/**
 * 모달 관련 함수
 */
const isModalOpen = ref(false);
const closeModal = () => {
  isModalOpen.value = false;
};
const emit = defineEmits(["update:data"]);
const modalAction = () => {
  const updateKey = [
    "wrkNm",
    "lgCatCd",
    "mdCatCd",
    "wrkNmCd",
    "lgCatNm",
    "mdCatNm",
  ];
  const updatingData = {};

  updateKey.forEach((item) => {
    updatingData[item] = rskFctr.value[item];
  });

  // prop으로 받은 data를 선택한 대분류,중분류,작업명으로 업데이트
  emit("update:data", { ...props.data, ...updatingData });
  closeModal();
};

const showingText = computed(() => {
  if (props.data.wrkNm) {
    return (
      props.data.lgCatNm + " / " + props.data.mdCatNm + " / " + props.data.wrkNm
    );
  }
  return "";
});
const props = defineProps({
  data: {
    type: Object,
    default: {
      contyCd: "",
      wrkNm: "",
      wrkNmCd: "",
      wrkLoc: "",
      hrmrskMtr: "",
      rskFctr: "",
      rskMsr: "",
      actMngr: "",
      lgCatCd: "",
      mdCatCd: "",
      wrkNmCd: "",
      lgCatNm: "",
      mdCatNm: "",
    },
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.content_box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px;
}
.content_box:nth-child(3) {
  margin: 0px;
}

.add_factor_standardAcci {
  width: 1200px;
  height: auto;
}

.selectedCheck {
  background-image: url("@/assets/img/price_check_violet.png");
  display: inline-block;
  width: 22px;
  height: 20px;
}
</style>
