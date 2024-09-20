<template>
  <div class="dash_pop_default dash_pop_alam_list">
    <div class="title">알람 목록</div>
    <div class="content">
      <div class="item" v-for="(item, index) in alarmList" :key="index">
        {{ item.dtl }} <span class="date">{{ formatDate(item.lastDate) }}</span>
      </div>
      <!-- <div class="item">
        알람 내용알람 내용알람 내용알람 내용알람 내용알람 내용알람 내용알람
        내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div>
      <div class="item">
        알람 내용<span class="date">2024/01/01 13:45:15</span>
      </div> -->
    </div>

    <div class="bottom_btn">
      <button class="close" @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainSiteStore } from "../../stores/common/main-site-store";

const loginAuth = useLoginAuthStore();
const SiteStore = useMainSiteStore();
const alarmList = ref([]);

function close(event) {
  event.target.parentElement.parentElement.classList.remove("show");
}

// 날짜 포멧 변경 함수
const formatDate = (item) => {
  const year = item.slice(0, 4);
  const month = item.slice(4, 6);
  const day = item.slice(6, 8);
  const hh = item.slice(8, 10);
  const mm = item.slice(10, 12);
  const dd = item.slice(12, 14);
  return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + dd;
};

// 알람 조회 함수
const searchAlarmList = async () => {
  const vendrCd = loginAuth.$state.siteInfo.vendrCd;
  const siteCd = loginAuth.$state.siteInfo.siteCd;
  const userId = loginAuth.$state.userInfo.userId;

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
  };

  const res = await SiteStore.selectAlarmTalkList(param);

  alarmList.value = res;
  console.log("알람 리스트 alarmList.value : " + alarmList.value);
};

onMounted(() => {
  searchAlarmList();
});
</script>

<style scoped>
.item {
  cursor: pointer;
}
</style>
