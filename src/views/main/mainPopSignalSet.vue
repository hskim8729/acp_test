<template>
  <div class="dash_pop_default dash_pop_signal_set">
    <div class="title">안전신호등 점수 설정</div>
    <div class="content">
      <div class="box">
        <div class="subtitle">
          위험성평가
          <input type="text" v-model="riskEvalRt" @input="changeRiskEvalRt" />%
        </div>
        <div class="item">
          위험등급 '상' 1개당
          <input
            type="text"
            v-model="rskGrdTpDdctScr"
            @input="cUtil.regexTypeNumber($event)"
          />점 차감
        </div>
        <div class="item">
          위험등급 '중' 1개당
          <input
            type="text"
            v-model="rskGrdMdDdctScr"
            @input="cUtil.regexTypeNumber($event)"
          />점 차감
        </div>
        <div class="item">
          위험등급 '하' 1개당
          <input
            type="text"
            v-model="rskGrdLwrDdctScr"
            @input="cUtil.regexTypeNumber($event)"
          />점 차감
        </div>
      </div>

      <div class="box">
        <div class="subtitle">
          안전점검조치
          <input
            type="text"
            v-model="sftInspActRt"
            @input="cUtil.regexTypeNumber($event)"
            readonly
          />%
        </div>
        <div class="item">
          조치 지연 1건당
          <input
            type="text"
            v-model="actDelayCsDdctScr"
            @input="cUtil.regexTypeNumber($event)"
          />점 차감
        </div>
        <div class="item">
          중점위험 미점검 1건당
          <input
            type="text"
            v-model="pntRskUnchCsDdctScr"
            @input="cUtil.regexTypeNumber($event)"
          />점 차감
        </div>
      </div>

      <div class="box">
        <div class="subtitle">안전점수 기준</div>
        <span class="icon_red"></span
        ><input
          type="text"
          v-model="sftScrCrtrRed"
          @input="cUtil.regexTypeNumber($event)"
        />점 <span class="icon_yellow"></span
        ><input
          type="text"
          v-model="sftScrCrtrYellow"
          @input="cUtil.regexTypeNumber($event)"
        />점
        <span class="icon_green"></span>
      </div>
    </div>

    <div class="bottom_btn">
      <button @click="signalSave">저장</button>
      <button @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainHeadStore } from "@/stores/common/main-head-store";
import commonUtil from "@/utils/common-utils";

const cUtil = commonUtil;
const loginAuth = useLoginAuthStore();
let riskEvalRt = ref(""); // 위험성 평가 비율
let rskGrdTpDdctScr = ref(""); // 위험 등급 상 차감 점수
let rskGrdMdDdctScr = ref(""); // 위험 등급 중 차감 점수
let rskGrdLwrDdctScr = ref(""); // 위험 등급 하 차감 점수
let sftInspActRt = ref(""); // 안전 점검 조치 비율
let actDelayCsDdctScr = ref(""); // 조치 지연 건별 차감 점수
let pntRskUnchCsDdctScr = ref(""); // 중점 위험 미점검 건별 차감 점수
let sftScrCrtrRed = ref(""); // 안전 점수 기준 빨강
let sftScrCrtrYellow = ref(""); // 안전 점수 기준 노랑
const mainPost = useMainHeadStore();

// 안전신호등 비율 자동 대입 함수
const changeRiskEvalRt = (event) => {
  const regex = /[^0-9]/g;
  if (regex.test(event.target.value)) {
    event.target.value = event.target.value.replace(regex, ""); // 숫자만 입력 가능
    console.log("type of : " + typeof event.target.value);

    //riskEvalRt.value = event.target.value;
  }
  let numeric = event.target.value;
  numeric = Math.min(Math.max(0, numeric), 100); // 0 이상 100 이하 숫자만 입력

  riskEvalRt.value = numeric;
  sftInspActRt.value = 100 - riskEvalRt.value;
};

// 안전신호등 점수 저장
const signalSave = async (e) => {
  const vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  const userId = loginAuth.$state.userInfo.userId;
  const param = {
    riskEvalRt: riskEvalRt.value,
    rskGrdTpDdctScr: rskGrdTpDdctScr.value,
    rskGrdMdDdctScr: rskGrdMdDdctScr.value,
    rskGrdLwrDdctScr: rskGrdLwrDdctScr.value,
    sftInspActRt: sftInspActRt.value,
    actDelayCsDdctScr: actDelayCsDdctScr.value,
    pntRskUnchCsDdctScr: pntRskUnchCsDdctScr.value,
    sftScrCrtrRed: sftScrCrtrRed.value,
    sftScrCrtrYellow: sftScrCrtrYellow.value,
    vendrCd: vendrCd,
    userId: userId,
  };
  console.log("안전 신호등 param : ", param);
  await mainPost.saveSafeTfclghtscrStng(param);

  close(e);

  selectSignalSet();
};

function close(event) {
  event.target.parentElement.parentElement.classList.remove("show");
}

// 안전신호등 값 대입
const inputSignal = (data) => {
  console.log("data 값 대입 : ", data);
  if (data) {
    riskEvalRt.value = data.riskEvalRt;
    rskGrdTpDdctScr.value = data.rskGrdTpDdctScr;
    rskGrdMdDdctScr.value = data.rskGrdMdDdctScr;
    rskGrdLwrDdctScr.value = data.rskGrdLwrDdctScr;
    sftInspActRt.value = data.sftInspActRt;
    actDelayCsDdctScr.value = data.actDelayCsDdctScr;
    pntRskUnchCsDdctScr.value = data.pntRskUnchCsDdctScr;
    sftScrCrtrRed.value = data.sftScrCrtrRed;
    sftScrCrtrYellow.value = data.sftScrCrtrYellow;
  }
};

// 안전신호등 조회
const selectSignalSet = async () => {
  const vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  const param = {
    vendrCd: vendrCd,
  };
  const result = await mainPost.selectSafeTfclghtscrStng(param);
  console.log("result : ", result);

  // 값 넣어주기
  inputSignal(result[0]);
};

onMounted(() => {
  // 안전 신호등 조회
  selectSignalSet();
});
</script>

<style scoped></style>
