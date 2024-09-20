<template>
  <div class="popup_background">
    <div class="popup_area popup notify_news_write show">
      <div class="popup_title">
        <span>API 테스트입니다.</span>
        <button class="popup_close" @click="close"></button>
      </div>
      <div class="popup_content">
        <div class="item_wrap w100p">
          <span class="title">apiURI</span>
          <input type="text" v-model="apiURI">
        </div>
        <div class="item_wrap w100p">
          <span class="title">vendrCd</span>
          <input type="text" v-model="apiParam.vendrCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">siteCd</span>
          <input type="text" v-model="apiParam.siteCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">userId</span>
          <input type="text" v-model="apiParam.userId">
        </div>
        <div class="item_wrap w100p">
          <span class="title">userNm</span>
          <input type="text" v-model="apiParam.userNm">
        </div>
        <div class="item_wrap w100p">
          <span class="title">crryTelNo</span>
          <input type="text" v-model="apiParam.crryTelNo">
        </div><div class="item_wrap w100p">
          <span class="title">apiPrdCd</span>
          <input type="text" v-model="apiParam.apiPrdCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">apiPriceCd</span>
          <input type="text" v-model="apiParam.apiPriceCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">payInfoCd</span>
          <input type="text" v-model="apiParam.payInfoCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">payInfoCd</span>
          <input type="text" v-model="apiParam.payInfoCd">
        </div>
        <div class="item_wrap w100p">
          <span class="title">subscrStDt</span>
          <input type="text" v-model="apiParam.subscrStDt">
        </div>
        <div class="item_wrap w100p">
          <span class="title">subscrEndDt</span>
          <input type="text" v-model="apiParam.subscrEndDt">
        </div>
        <div class="item_wrap w100p">
          <span class="title">apiSubscrId</span>
          <input type="text" v-model="apiParam.apiSubscrId">
        </div>
        <div class="item_wrap w100p">
          <span class="title">apiSubscrItemId</span>
          <input type="text" v-model="apiParam.apiSubscrItemId">
        </div>
      </div>
      <div class="popup_button">
        <button @click="sendAPI">테스트</button>
        <button @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, onMounted } from "vue";
import commonService from "@/api/common-service.js";

const emits = defineEmits(["close"]);

// 팝업창 Close
const close = () => {
  emits('close');
}

const apiURI = ref("");
const apiParam = ref({
});

const sendAPI = () => {
  let uri = `/v1/common/${apiURI.value}`
  if (!confirm(`${uri}를 호출하겠습니까?`)) {
    return false;
  }

  commonService.axiosCall(uri, apiParam.value).then((result) => {
    if (result.data.errYn === "Y") {
      alert(result.data.errMsg);
      return false;
    } else {
      alert("성공");
    }
  });
}

</script>
<style scoped>
.popup_background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(30, 50, 100, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.2s, height 0.2s 0.2s;
  animation: popupFade 0.1s ease-in-out forwards;
}
@keyframes popupFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.notify_news_write {
  width: 30%;
  height: calc(100% - 100px);
}
.notify_news_write .pointer{
  cursor: pointer;
}
</style>
