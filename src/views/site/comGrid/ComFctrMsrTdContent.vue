<template>
  <div class="parent">
    <textarea
        v-model="fctrOrMsr"
        :ref="(el) => {fctrMsrItem.textareaRef = el;}"
        @input="updateItem(fctrMsrItem, $event)"
        @keyup.enter.prevent="onEnter(fctrMsrItem)"
        :placeholder="placeholderTxt"
        spellcheck="false"
        :class="{ 'add_txt': fctrMsrItem.isTextarea, 'no_scroll':true }"
    >
    </textarea>

    <template v-if="fctrMsrItem.isTextarea">
      <button class="cell_btn" @click="onAddBtnClick" tabindex="-1" v-if="isChanged">추가</button>
    </template>
    <template v-else>
      <button class="cell_btn" @click="onUpdateBtnClick" tabindex="-1" v-if="isChanged">수정</button>
    </template>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import {useRiskFactorStandardStore} from "@/stores/stdMgmt/risk-factor-standard-store";

const {fctrMsrItem} = defineProps(["fctrMsrItem"]);
const riskFactorStandardStore = useRiskFactorStandardStore();

//   fctrOrMsr를 변경했을 때만 수정 버튼이 보이게 하려고 이 값을 변경했는지 추적
const isChanged = ref(false)

const fctrOrMsr = computed({
  get: () =>
      fctrMsrItem.isRskFctr ? fctrMsrItem.rskFctr : fctrMsrItem.rskMsr,
  set: (value) => {
    if (fctrMsrItem.isRskFctr) {
      fctrMsrItem.rskFctr = value;
    } else {
      fctrMsrItem.rskMsr = value;
    }
  },
});

const placeholderTxt = computed({
  get: () => fctrMsrItem.isRskFctr ? "해당 작업의 위험요인을 입력해주세요" : "위험요인의 표준 감소 대책을 입력해주세요"
})

// 위험요소와 감소대책 분기처리
const updateItem = (fctrMsrItem, event) => {
  isChanged.value = true;
  if (fctrMsrItem.isRskFctr) {
    fctrMsrItem.rskFctr = event.target.value;
    nextTick(() => resizeTextArea(fctrMsrItem.textareaRef));
  } else {
    fctrMsrItem.rskMsr = event.target.value;
    nextTick(() => resizeTextArea(fctrMsrItem.textareaRef));
  }
};

// 컴포넌트가 마운트된 직후에 resizeTextArea 함수가 실행되어 해당 textarea의 높이를 조절
// 최소 height를 넘는 text도 스크롤바X
onMounted(() => {
  resizeTextArea(fctrMsrItem.textareaRef);
});

// textarea 스크롤 안생기고 길어지게 함
const resizeTextArea = (element) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

const onEnter = (fctrMsrItem) => {
  if (isChanged.value) {
    if (fctrMsrItem.isTextarea) {
      onAddBtnClick()
    } else {
      onUpdateBtnClick()
    }
  }
}

const onAddBtnClick = () => {
  if (fctrMsrItem.isRskFctr) {
    const params = {
      mode: "I",
      rskFctr: fctrMsrItem.rskFctr
    }
    riskFactorStandardStore.fetchRskFctr(params)
        .then(() => {
          fctrMsrItem.rskFctr = ''
        })
  } else {
    const params = {
      mode: "I",
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
      rskMsr: fctrMsrItem.rskMsr
    }
    riskFactorStandardStore.fetchRskFctrMsr(params)
  }
}

const onUpdateBtnClick = () => {
  if (fctrMsrItem.isRskFctr) {
    const params = {
      mode: "U",
      rskFctr: fctrMsrItem.rskFctr,
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
    }
    riskFactorStandardStore.fetchRskFctr(params).then(isChanged.value = false)
  } else {
    const params = {
      mode: "U",
      rskFctrSeq: fctrMsrItem.rskFctrSeq,
      rskMsr: fctrMsrItem.rskMsr,
      rskMsrSeq: fctrMsrItem.rskMsrSeq
    }
    riskFactorStandardStore.fetchRskFctrMsr(params).then(isChanged.value = false)
  }
}
</script>

<style scoped>
.parent {
  display: flex;
}

textarea {
  min-height: 1rem;
  flex: auto;
  border: none;
  background-color: transparent;
  padding: 0;
  resize: none;
  box-sizing: border-box
}

.add_txt {
  background-color: white;;
  padding: 1rem;
}

.no_scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.no_scroll::-webkit-scrollbar {
  display: none;
}
</style>
