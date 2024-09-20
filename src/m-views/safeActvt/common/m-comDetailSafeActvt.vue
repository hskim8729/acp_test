<!-- 중점/일상점검 목록 공통 카드 컴포넌트 -->

<template>
  <div class="item_wrap w100p">
    <span class="p_title">공종</span><br />
    <input type="text" v-model="detailParam.contyCdNm" readonly />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">작업명</span><br />
    <input
      type="text"
      class="search_input"
      v-model="detailParam.wrkNm"
      readonly />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위치/장소</span><br />
    <input type="text" v-model="detailParam.wrkLoc" readonly />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위험물</span><br />
    <input type="text" v-model="detailParam.hrmrskMtr" readonly />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">위험요인</span><br />
    <textarea type="text" v-model="detailParam.rskFctr" readonly></textarea>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">감소대책</span><br />
    <textarea type="text" v-model="detailParam.rskMsr" readonly></textarea>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">점검일자</span><br />
    <datepicker v-model="formattedInspDt" disabled />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title">점검의견</span><br />
    <textarea v-model="detailParam.inspDtl" :disabled="isDisabled"></textarea>
  </div>

  <div class="item_wrap w100p inst-rst">
    <span class="p_title">점검결과</span>
    <v-radio-group
      v-model="detailParam.inspRst"
      :disabled="isDisabled"
      hide-details
      @change="inspRstChange"
      inline>
      <v-radio label="양호" value="0001"></v-radio>
      <v-radio label="조치요청" value="0002"></v-radio>
    </v-radio-group>
  </div>

  <div class="item_wrap w100p">
    <span class="p_title mb-0">점검결과 첨부</span>
    <slot name="instFileSlot"> </slot>
  </div>

  <div v-show="detailParam.inspRst === '0002'">
    <div class="item_wrap w100p">
      <span class="p_title">조치예정일</span><br />
      <datepicker
        v-model="formattedActExptDt"
        :key="actExptDtKey"
        :disabled="isDisabled"
        @closed="actExptDtKey++" />
    </div>
    <div class="item_wrap w100p">
      <span class="p_title">조치요구</span><br />
      <textarea
        v-model="detailParam.actDemandDtl"
        :disabled="isDisabled"></textarea>
    </div>

    <div class="item_wrap w50p pb-3">
      <span class="p_title">조치담당자</span>
      <input
        type="text"
        class="search_input"
        v-model="detailParam.actMngrNm"
        readonly />
      <button
        class="search_btn"
        @click="openPopSearchUser"
        v-show="!isDisabled"></button>
    </div>

    <!-- 조치 이후 화면은 조치내용과 조치일자도 조회 -->
    <!-- 수정은 조치 화면만 가능 -->
    <div class="item_wrap w100p" v-show="menuType !== 'insp'">
      <span class="p_title">조치내용</span><br />
      <textarea
        v-model="detailParam.actDtl"
        :readonly="
          menuType !== 'action' || detailInfo.authMode == 'U'
        "></textarea>
    </div>
    <div class="item_wrap w100p" v-show="menuType !== 'insp'">
      <span class="p_title">조치일자</span><br />
      <datepicker
        id="actDtId"
        v-model="formattedActDt"
        :key="actDtKey"
        :disabled="menuType !== 'action' || detailInfo.authMode == 'U'"
        @closed="actDtKey++" />
    </div>

    <div v-if="$slots.actFileSlot" class="item_wrap w100p pb-3">
      <span class="p_title">조치결과 첨부</span>
      <slot name="actFileSlot"> </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import datepicker from "vue3-datepicker";
import commonUtil from "@/utils/common-utils";

const cUtil = commonUtil;

const emits = defineEmits(["openPopSearchUser", "updateData"]);
const props = defineProps({
  // 메뉴 타입
  // insp: 활동 / action: 조치 / appr: 승인
  menuType: {
    type: String,
    default: "insp",
  },
  // 상세정보
  detailInfo: {
    type: Object,
    default: [],
  },
  // 기본정보 읽기모드 여부
  isDisabled: {
    type: Boolean,
    default: false,
  },
  // 조치정보 읽기모드 여부
  isActDisabled: {
    type: Boolean,
    default: false,
  },
  // 조치정보 조회 여부
  isActInfo: {
    type: Boolean,
    default: false,
  },
});

const detailParam = ref({});
let actExptDtKey = ref(0);
let actDtKey = ref(0);

const openPopSearchUser = () => {
  emits("openPopSearchUser");
};

// 점검결과 수정
const inspRstChange = () => {
  // 양호 선택하면 input값을 빈값처리
  if (detailParam.value.inspRst === "0001") {
    detailParam.value.actDemandDtl = "";
    detailParam.value.actExptDt = "";
    detailParam.value.actMngr = "";
    detailParam.value.actMngrNm = "";
  }
};

// 점검일 포맷팅
const formattedInspDt = computed({
  get: () => {
    return cUtil.formatDate(detailParam.value.inspDt);
  },
  set: (value) => {
    detailParam.value.inspDt = cUtil.convertDate(value);
  },
});

// 조치예정일 포맷팅
const formattedActExptDt = computed({
  get: () => {
    return cUtil.formatDate(detailParam.value.actExptDt);
  },
  set: (value) => {
    detailParam.value.actExptDt = cUtil.convertDate(value);
  },
});

// 조치일 포맷팅
const formattedActDt = computed({
  get: () => {
    return cUtil.formatDate(detailParam.value.actDt);
  },
  set: (value) => {
    detailParam.value.actDt = cUtil.convertDate(value);
  },
});

/** 부모에서 데이터 변경 시 detailParam에 적용 */
watch(
  () => props.detailInfo,
  (newValue) => {
    if (
      newValue.contyCdNm &&
      JSON.stringify(newValue) !== JSON.stringify(detailParam.value)
    ) {
      detailParam.value = { ...newValue };
    }
  },
  { deep: true }
);

/** 데이터 변경 시 부모에게 데이터 전달 */
watch(
  () => detailParam.value,
  (newValue) => {
    if (emits) {
      emits("updateData", newValue);
    }
  },
  { deep: true }
);
</script>
<style scoped>
.item_wrap input[type="text"],
.item_wrap input[type="date"],
.item_wrap input[type="time"],
.item_wrap select {
  width: 100%;
}
.m_subtitle {
  margin-top: 50px;
}
.inst-rst {
  display: flex;
}
.inst-rst span {
  align-content: center;
  align-self: center;
}
.inst-rst .v-radio-group {
  grid-template-columns: 0;
}
</style>
