<template>
  <div class="notify_news_view">
    <notifyNewsList v-if="!isShowDetail" @change-detail="changeDetail" :bbs-cls-cd="bbsClsCd" ref="notifyNewsListRef"></notifyNewsList>
    <NotifyNewsDetail
      v-if="isShowDetail"
      @go-back="changeDetail"
      :notify-news-info="notifyNewsInfo"
      :bbs-cls-cd="bbsClsCd"
      ></NotifyNewsDetail>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, watch, nextTick } from "vue";
import NotifyNewsDetail from "./notifyNewsDetail.vue";
import notifyNewsList from "./notifyNewsList.vue";

const isShowDetail = ref(false);
const notifyNewsInfo = ref();
const notifyNewsListRef = ref(null);
const bbsClsCd = ref('T2308');

const viewId = defineProps(["viewId"]);
const emit = defineEmits(['togglePopup'])

watch (viewId, (newValue) => {
  setClsCd(newValue.viewId);
})

const changeDetail = (params) => {
  if (params) {
    // detail로 넘어갈 때 파라미터 세팅
    notifyNewsInfo.value = {...params.data};
  }
  isShowDetail.value = !isShowDetail.value;
}

const setClsCd = (clsCd) => {
  switch (clsCd) {
    case "notifyNews":  // 공지사항
      bbsClsCd.value = "T2308" ;
      break;
    case "promoMeterial": // 홍보자료
      bbsClsCd.value = "T2309" ;
      break;
  }

  selectList();
}

const selectList = () => {
  // detail화면에 있으면 List로 돌아간 후 재조회
  if (isShowDetail.value) {
    changeDetail();
  }
  
  nextTick(() => notifyNewsListRef.value.selectCategory(bbsClsCd.value));
  ;
}

onMounted(() => {
  setClsCd(viewId.viewId);
})
</script>

<style scoped>
.viewer_default {
  height: calc(100% - 25px);
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
}

.content_box {
  height: 100%;
}

.content_view {
  height: calc(90% - 180px);
}

</style>
  
  