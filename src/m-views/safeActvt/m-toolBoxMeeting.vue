<template>
  <div class="item_wrap w100p">
    <span class="p_title">TBM 기간</span><br />
    <datepicker v-model="fromTbmDt" id="fromTbmDt" format="yyyy-MM-dd" class="fromTo" :key="fromKey"></datepicker>
    <span class="space"> ~ </span>
    <datepicker v-model="toTbmDt" id="toTbmDt" format="yyyy-MM-dd" class="fromTo" :key="toKey"></datepicker>
    <!--
    <input type="date" id="fromTbmDt" />
    <span class="space"> ~ </span>
    <input type="date" id="toTbmDt" />
    -->
  </div>
  <button class="m_search" @click="tbmDateSearch">조회</button>

  <div class="m_subtitle">TBM 목록</div>

  <div class="grid_card">
    <ul>
      <li v-for="(item, index) in tbmList.value" :key="index">
        <!-- <router-link to="/SAFE_ACTVT/m-toolBoxMeetingDetail" -->
        <router-link
          :to="{
            path: '/SAFE_ACTVT/m-toolBoxMeetingDetail',
            name: 'm-toolBoxMeetingDetail',
            params: {
              tbmDt: `${item.tbmDt}`,
              regId: `${item.regId}`,
              psitnVendrCd : `${item.psitnVendrCd}`,
            },
          }"
        >
          <div class="card_wrap">
            <div class="card_item">
              <div class="title">TBM 명</div>
              <div class="data">{{ item.tbmNm }}</div>
            </div>
            <div class="card_item">
              <div class="title">TBM 일자</div>
              <div class="data">{{ item.tbmDt }}</div>
            </div>
            <div class="card_item">
              <div class="title">TBM 시간</div>
              <div class="data">{{ item.tbmTime }}</div>
            </div>
            <div class="card_item">
              <div class="title">업체명</div>
              <div class="data">{{ item.vendrNm }}</div>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useToolBoxMeetingStore } from "../../stores/safeActvt/tool-box-meeting-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { reactive, ref, onBeforeMount, watch, onMounted } from "vue";
import dayjs from "dayjs";
import datepicker from "vue3-datepicker";
import commonUtil from "@/utils/common-utils";

const cUtils = commonUtil;
const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "TBM"; // 페이지 타이틀 입력

const toolBoxStore = useToolBoxMeetingStore();
const LoginAuthStore = useLoginAuthStore();

const vendrCd = LoginAuthStore.$state.siteInfo.vendrCd;
const siteCd = LoginAuthStore.$state.siteInfo.siteCd;
const userId = LoginAuthStore.$state.userInfo.userId;
const psitnVendrCd = LoginAuthStore.$state.userInfo.vendrCd;
let now= new Date();
const fromTbmDt = ref(new Date());
const toTbmDt = ref(new Date(now.setDate(now.getDate() + 1)));
let today = new Date();

let fromKey = ref(0);
let toKey = ref(0);

watch(fromTbmDt,()=>{
  fromKey.value++;
});

watch(toTbmDt,()=>{
  toKey.value++;
});

const tbmList = reactive([]);

onMounted(() => {
  searchList();
});

// TBM 조회 함수
const searchList = async () => {
  const from = cUtils.pickerToString(fromTbmDt.value);
  const to = cUtils.pickerToString(toTbmDt.value);

  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    fromTbmDt: from,
    toTbmDt: to,
    userId: userId,
    psitnVendrCd: psitnVendrCd,
  };

  tbmList.value = await toolBoxStore.toolBoxSearchList(params);
};


// 날짜 유효성 검사
const validDate = (from, to) => {
  const fromDate = cUtils.stringToPicker(from);
  const toDate = cUtils.stringToPicker(to);
  if (to < from) {
     fromTbmDt.value = toDate;
     toTbmDt.value = fromDate;
    return true;
  } else {
    return true;
  }
};

// 기간 검색
const tbmDateSearch = async () => {
  let fdate = new Date(fromTbmDt.value);
  let tdate = new Date(toTbmDt.value);

  let fromDt = cUtils.pickerToString(fdate);
  let toDt = cUtils.pickerToString(tdate);

  if (!validDate(fromDt, toDt)) {
    return;
  }
 
  const params = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    fromTbmDt: cUtils.pickerToString(fromTbmDt.value),
    toTbmDt: cUtils.pickerToString(toTbmDt.value),
    psitnVendrCd: psitnVendrCd,
    userId: userId,
  });
  tbmList.value = await toolBoxStore.toolBoxSearchList(params);
};

</script>

<style scoped>
.item_wrap input {
  width: calc(50% - 10px);
}
.item_wrap .space {
  display: inline-block;
  width: 20px;
  text-align: center;
}
.m_subtitle {
  margin-top: 20px;
}

/* grid card set */
.grid_card {
  height: calc(100% - 170px);
}
.grid_card .card_wrap {
  height: 140px;
}
.grid_card .card_item:nth-child(1) {
  top: 0px;
  left: 0px;
  width: 100%;
}
.grid_card .card_item:nth-child(2) {
  top: 50px;
  left: 0px;
  width: 50%;
}
.grid_card .card_item:nth-child(3) {
  top: 50px;
  left: 50%;
  width: 50%;
}
.grid_card .card_item:nth-child(4) {
  top: 100px;
  left: 0px;
  width: 100%;
}
</style>
