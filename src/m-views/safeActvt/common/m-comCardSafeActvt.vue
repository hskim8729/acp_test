<!-- 중점/일상점검 목록 공통 카드 컴포넌트 -->

<template>
  <div class="grid_card">
    <ul>
      <li v-for="(item, index) in searchGridData" :key="index">
        <div class="card_wrap">
          <div class="card_item">
            <div class="title">공종</div>
            <div class="data">{{ item.contyNm }}</div>
          </div>
          <div class="card_item">
            <div class="title">작업위치/인원</div>
            <div class="data">{{ item.wrkLocPsnNum }}</div>
          </div>
          <div class="card_item">
            <div class="title">작업명</div>
            <div class="data">{{ item.wrkNm }}</div>
          </div>
          <div class="card_item">
            <div class="title">위험물</div>
            <div class="data">{{ item.hrmrskMtr }}</div>
          </div>
          <div class="card_item">
            <div class="title">위험요인</div>
            <div class="data">{{ item.rskFctr }}</div>
          </div>
          <div class="card_item">
            <div class="title">감소대책</div>
            <div class="data" style="white-space: pre-line">
              {{ item.rskMsr }}
            </div>
          </div>
          <div class="card_item">
            <div class="title">점검자</div>
            <div class="data">{{ item.inspNm }}</div>
          </div>
          <div class="card_item">
            <div class="title">점검일</div>
            <div class="data">{{ dateFormat(item.inspDt) }}</div>
          </div>
          <div class="card_item">
            <div class="title">조치예정일</div>
            <div class="data">{{ dateFormat(item.actExptDt) }}</div>
          </div>
          <div class="card_item">
            <div class="title">조치 일자</div>
            <div class="data">{{ dateFormat(item.actDt) }}</div>
          </div>
          <!-- 조치요청 이후 단계에만 결재상태 보여줌 -->
          <div class="card_item" v-show="menuType != 'insp'">
            <div class="title">결재상태</div>
            <div class="data">{{ item.statsNm }}</div>
          </div>
          <!-- 점검승인 화면은 조치상태 뱃지 안보임 -->
          <div :class="stateColor(item.inspRst)" v-show="menuType != 'appr'">
            {{ item.inspRstNm }}
          </div>
          <slot name="buttonSlot" :item="item"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  // 메뉴 타입
  // insp: 활동 / action: 조치 / appr: 승인
  menuType: {
    type: String,
    default: "insp",
  },
  searchGridData: {
    type: Array,
    default: [],
  },
});

// 날짜 포맷 함수
const dateFormat = (item) => {
  const dt = dayjs(item);
  return dt.isValid() ? dt.format("YYYY-MM-DD") : "";
};

// 상태 컬러 함수
const stateColor = (item) => {
  switch (item) {
    case "0001":
      return "card_status blue";
    case "0002":
      return "card_status gray";
    case "0003":
      return "card_status green";
    case "0004":
      return "card_status violet";
    default:
      return "card_status red";
  }
};
</script>
<style scoped>
.m_subtitle {
  margin-top: 20px;
}

/* grid card set */
.grid_card {
  height: calc(100% - 160px);
}
.grid_card .card_wrap {
  position: relative;
  height: auto;
}
.grid_card .card_item {
  position: static;
  display: inline-block;
  margin-bottom: 15px;
  height: auto;
}

.grid_card .card_item:nth-child(1),
.grid_card .card_item:nth-child(2),
.grid_card .card_item:nth-child(7),
.grid_card .card_item:nth-child(8),
.grid_card .card_item:nth-child(9),
.grid_card .card_item:nth-child(10) {
  width: 50%;
}
.grid_card .card_item:nth-child(3),
.grid_card .card_item:nth-child(4),
.grid_card .card_item:nth-child(5),
.grid_card .card_item:nth-child(6) {
  width: 100%;
}
.grid_card .card_item:nth-child(9) .data,
.grid_card .card_item:nth-child(10) .data {
  display: inline-block;
}
.m_content_top_btn_area button {
  width: calc(33.33% - (20px / 3));
}
</style>
