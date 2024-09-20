<template>
  <!-- 신호등 설정 팝업 -->
  <mainPopSignalSet></mainPopSignalSet>

  <div class="dash_top_area">
    <button @click="signalSet">안전신호등 점수 설정</button>
  </div>
  <div class="dash_wrap">
    <div class="dash_content">
      <!-- 공지사항 -->
      <div class="dash_notice">
        <div class="title">
          공지사항
          <div class="right_btn">
            <!-- <button @click="noticeWriteBtn">신규등록</button> -->
            <button @click="goNoticeList">공지사항 바로가기</button>
          </div>
        </div>
        <div class="content">
          <div class="dash_board_list board_head_office show">
            <ul>
              <li
                v-for="(item, index) in dashboardNoti"
                :key="index"
                @click="detailNoticeView(item)">
                <span :class="item.bbsStyleNm">{{ item.bbsClsNm }} </span>
                <span class="icon_new" v-if="item.newYn == 'Y'"></span>
                <!-- <span :class="dashBoardIconClass(item)">{{
                  dashBoardIconName
                }}</span> -->
                {{ item.ttl }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 안전보건 자료실 -->
      <div class="dash_data">
        <div class="title">
          안전보건 자료실
          <div class="right_btn">
            <!-- <button @click="dataWriteBtn">신규등록</button> -->
            <button @click="goDataList">자료실 바로가기</button>
          </div>
        </div>
        <div class="content">
          <div class="dash_board_list">
            <ul>
              <li
                v-for="(item, index) in sftyHlthBbsList"
                :key="index"
                @click="detailDataView(item)">
                {{ item.ttl }}
                <span class="icon_file" v-if="item.atchFileKey != null"></span>
              </li>
              <!-- <li @click="dataViewBtn">
                안전보건 자료실 게시글<span class="icon_file"></span>
              </li>
              <li>안전보건 자료실 게시글</li>
              <li>안전보건 자료실 게시글<span class="icon_file"></span></li>
              <li>안전보건 자료실 게시글<span class="icon_file"></span></li>
              <li>안전보건 자료실 게시글</li> -->
            </ul>
          </div>
        </div>
      </div>

      <!-- 현장목록 -->
      <div class="dash_site_list">
        <div class="title">
          현장 목록
          <div class="right_btn">
            <!-- <button>현장개설</button> -->
            <button @click="goSiteList">현장목록 바로가기</button>
          </div>
        </div>
        <div class="content no-padding">
          <div class="dash_site_header">
            <span>구분</span>
            <span>현장명</span>
            <span>현장소장</span>
            <span>안전관리자</span>
            <span>안전점수</span>
            <span>안전신호등</span>
          </div>
          <div class="dash_site_body">
            <ul>
              <li
                v-for="(item, index) in siteBbsList"
                :key="index"
                @click="searchRiskEval(item)">
                <span>{{ item.constTypeNm }}</span>
                <span>{{ item.siteNm }}</span>
                <span>{{ item.pstHdchNm }}</span>
                <span>{{ item.mngUserNm }}</span>
                <span>{{ item.score }}</span>
                <span>
                  <div
                    :class="{
                      signal_red: item.color == 'R',
                      signal_green: item.color == 'G',
                      signal_yellow: item.color == 'Y',
                      signal_none: item.color == 'N',
                    }"></div>
                  <!-- <div :class="getSignal(item.color)"></div> -->
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 현장안전모니터 -->
      <div class="dash_safety_monitor">
        <div class="title">
          현장 안전 모니터
          <span class="subtitle">{{ siteNm }}</span>
        </div>
        <div class="content">
          <div class="chart_left">
            <apexchart
              width="100%"
              height="190"
              :options="options"
              :series="series"
              ref="realtimeChart"></apexchart>
            <!-- bar chart -->
          </div>
          <div class="chart_right">
            <apexchart
              width="100%"
              height="190"
              :options="donut_options"
              :series="donut_series"></apexchart>
            <!-- donut chart -->
          </div>
        </div>
      </div>

      <!-- 전현장 재해유형별 위험요인 -->
      <div class="dash_risk_factor">
        <div class="title">전현장 재해유형별 위험요인</div>
        <div class="content">
          <div class="chart_risk">
            <apexchart
              width="100%"
              height="160"
              :options="bottom_options"
              :series="bottom_series"></apexchart>
            <!-- bar chart -->
          </div>

          <div class="risk_sort">
            <div class="radio_title">위험도</div>
            <input
              type="radio"
              name="riskSort"
              id="riskSort01"
              value="상"
              @click="FctrBbsList"
              checked /><label for="riskSort01">상</label><br />
            <input
              type="radio"
              name="riskSort"
              id="riskSort02"
              value="중"
              @click="FctrBbsList" /><label for="riskSort02">중</label><br />
            <input
              type="radio"
              name="riskSort"
              id="riskSort03"
              value="하"
              @click="FctrBbsList" /><label for="riskSort03">하</label>
          </div>
        </div>
      </div>

      <!-- 안전보건 포스터 -->
      <div class="dash_poster">
        <div class="title">
          안전보건 포스터
          <div class="right_btn">
            <button
              @click="popupFileAttach"
              v-if="
                loginAuth.$state.authInfo.authCd == '1000' &&
                loginAuth.$state.authInfo.authClsCd == 'T2201'
              ">
              파일첨부
            </button>
          </div>
        </div>
        <div class="contnet">
          <sliderSite :fromHeadFile="mainSlider"></sliderSite>
        </div>
      </div>
    </div>
  </div>

  <!-- 공지사항 글보기 팝업 -->
  <popNoticeView ref="dashMainNotice"></popNoticeView>

  <!-- 자료실 글보기 팝업 -->
  <popDataView ref="dashMainData"></popDataView>

  <!-- 파일 첨부 팝업 -->
  <mainPopHeadFileAttach
    @mainFileList="handleMainFileList"></mainPopHeadFileAttach>
</template>

<script setup>
// 대쉬보드 팝업
import { ref, onMounted } from "vue";
import mainPopSignalSet from "@/views/main/mainPopSignalSet.vue";
import sliderSite from "@/components/editor/slider.vue";
import mainPopHeadFileAttach from "@/views/main/mainPopHeadFileAttach.vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainHeadStore } from "@/stores/common/main-head-store";
import { useRouter } from "vue-router";
import { defineProps } from "vue";
import { useBoardStore } from "../../stores/board/board_store";
import popNoticeView from "@/views/main/popNoticeView.vue";
import popDataView from "@/views/main/popDataView.vue";

// 바 차트
const options = {
  chart: {
    id: "vuechart-example",
    height: 100,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: 0,
    style: {
      fontSize: "12px",
      colors: ["#ffffff"],
    },
  },
  theme: {
    palette: "palette2",
  },
  xaxis: {
    categories: ["상", "중", "하"],
    position: "top",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  title: {
    text: "위험성 평가",
    floating: true,
    offsetY: 170,
    align: "center",
    style: {
      font: "Pretendard-EB",
      color: "#444",
    },
  },

  colors: ["#8c87f1"],
};
let series = ref([
  {
    name: "",
    data: [0, 0, 0],
  },
]);

// 파이 차트
const donut_options = {
  chart: {
    id: "pieChart",
    type: "pie",
  },
  labels: ["양호", "조치중", "조치지연", "미점검"],
  title: {
    text: "중점점검조치",
    floating: true,
    offsetY: 170,
    offsetX: 80,
    align: "center",
    style: {
      fontSize: "14px",
      fontFamity: "Pretendard-EB",
      color: "#444",
    },
  },
  colors: ["#36cc72", "#ddd23f", "#dd893f", "#dd3f81"],
};
let donut_series = ref([0, 0, 0, 0]);
//[44, 55, 41, 17];

// 하단 차트
const bottom_options = {
  chart: {
    id: "bottom_chart",
    type: "bar",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 300,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 100,
      },
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: 0,
    style: {
      fontSize: "12px",
      colors: ["#ffffff"],
    },
  },
  theme: {
    palette: "palette3",
  },
  xaxis: {
    categories: [
      "유해물 접촉",
      "중독",
      "질식",
      "깔림",
      "감전",
      "전도",
      "부딪힘",
      "추락",
    ],
    position: "bottom",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
};

let bottom_series = ref([
  {
    name: "",
    data: [0, 0, 0, 0, 0, 0, 0, 0],
  },
]);

const router = useRouter();
const loginAuth = useLoginAuthStore();
const mainSlider = ref([]);
const mainPost = useMainHeadStore();
const dashboardNoti = ref([]);
const sftyHlthBbsList = ref([]);
const siteBbsList = ref([]);
const riskGrd = ref("");
let siteCd = ref("");
const boardStore = useBoardStore();
const dashMainNotice = ref("");
const dashMainData = ref("");
let siteNm = ref("");
let dashBoardIconName = ref("");

// 현장 목록 안전 신호등
const getSignal = (color) => {
  switch (color) {
    case "R":
      return "signal_red";
    case "G":
      return "signal_green";
    case "Y":
      return "signal_yellow";
    case "N":
      return "signal_none";
    default:
      return "";
  }
};

// 포스터 랜덤 함수`
const shuffleArray = (data) => {
  return data.sort(() => Math.random() - 0.5);
};

// 전사 포스터 슬라이더 컴포넌트 전달
const handleMainFileList = (data) => {
  if (Array.isArray(data) && data.length > 1) {
    data = shuffleArray(data);
  }
  mainSlider.value = data;
};

// 파일첨부 관리 팝업
function popupFileAttach() {
  document.getElementsByClassName("main_head_popup")[0].classList.add("show");
  document.getElementsByClassName("popup_bg2")[0].classList.add("show");
}

function signalSet() {
  let userListClass = document.getElementsByClassName("dash_pop_signal_set")[0];
  let dashPopupClass = document.querySelectorAll(".dash_pop_default");

  if (userListClass.classList.contains("show")) {
    userListClass.classList.remove("show");
  } else {
    dashPopupClass.forEach((dashPopupClose) => {
      dashPopupClose.classList.remove("show");
    });
    userListClass.classList.add("show");
  }
}

// 위험성평가 탭
// 위험성평가회의 show
function riskMeeting(event) {
  meetingTabClick(event);

  document.getElementsByClassName("board_risk")[0].classList.add("show");
  document.getElementsByClassName("board_weekly")[0].classList.remove("show");
}
// 주간합동점검회의 show
function weeklyMeeting(event) {
  meetingTabClick(event);

  document.getElementsByClassName("board_risk")[0].classList.remove("show");
  document.getElementsByClassName("board_weekly")[0].classList.add("show");
}

// 탭 클릭
function meetingTabClick(event) {
  let meetingTab = document.querySelectorAll(".dash_risk li");

  meetingTab.forEach((meetingTabInactive) => {
    meetingTabInactive.classList.remove("active");
  });

  event.target.classList.add("active");
}

// 현장목록 클릭 시 표시
function siteListSelected(event) {
  let siteList = document.querySelectorAll(".dash_site_body li");

  siteList.forEach((siteListInactive) => {
    siteListInactive.classList.remove("active");
  });
  event.target.parentElement.classList.add("active");
}

// 공지사항 상세보기 -- 수정은 안됨
const detailNoticeView = async (item) => {
  const param = { bbsSeq: item.bbsSeq };
  const detailBoard = await boardStore.boardDetailSearch(param);
  dashMainNotice.value.updateInfo(detailBoard);
  noticeViewBtn();
};

// 공지사항 글보기 팝업
const noticeViewBtn = () => {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("notice_view")[0].classList.add("show");
};

// 자료실 상세보기 -- 수정은 안됨
const detailDataView = async (item) => {
  const param = { bbsSeq: item.bbsSeq };
  const detailBoard = await boardStore.boardDetailSearch(param);
  dashMainData.value.updateInfo(detailBoard);
  dataViewBtn();
};

// 자료실 글보기 팝업
function dataViewBtn(params) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("data_view")[0].classList.add("show");
}

// 공지사항 바로가기
const goNoticeList = () => {
  router.push({
    name: "NoticePage",
  });
};

// 자료실 바로가기
const goDataList = () => {
  router.push({
    name: "dataPage",
  });
};

// 현장목록 바로가기
const goSiteList = () => {
  router.push({
    name: "siteRegPage",
  });
};

// 전사 대시보드 조회
const searchMainDashBoard = async () => {
  let ptnrYn = loginAuth.$state.vendrInfo.ptnrYn;
  let vendrCd = "";

  if (ptnrYn === "N") {
    vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  } else {
    vendrCd = loginAuth.$state.vendrInfo.vendrUpperCd;
  }

  const param = {
    vendrCd: vendrCd,
  };
  await mainPost.selectDashBoardAdmList(param);
  dashboardNoti.value = mainPost.$state.dashBoardAdmList; // 전사 공지사항 저장
  sftyHlthBbsList.value = mainPost.$state.sftyHlthBbsList; // 전사 안전보건 자료실
  siteBbsList.value = mainPost.$state.siteBbsList; // 전사 현장 목록
  siteCd.value = mainPost.$state.siteBbsList[0].siteCd;

  searchRiskEval();
};

// 현장 안전 모니터 조회
const searchRiskEval = async (data) => {
  let ptnrYn = loginAuth.$state.vendrInfo.ptnrYn;
  let vendrCd = "";

  if (ptnrYn === "N") {
    vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  } else {
    vendrCd = loginAuth.$state.vendrInfo.vendrUpperCd;
  }

  if (data != undefined) {
    siteCd.value = data.siteCd;
  } else {
    siteCd.value = siteBbsList.value[0].siteCd;
    data = siteBbsList.value[0];
  }

  const param = {
    vendrCd: vendrCd,
    siteCd: siteCd.value,
  };

  await mainPost.selectSiteRiskEvalMajorIsp(param);

  siteChartDraw(data);

  siteNm.value = data.siteNm; // 현장 안전 모니터 현장명
};

// 현장 모니터 차트 함수
const siteChartDraw = (data) => {
  siteNm.value = data.siteNm; // 현장 안전 모니터 현장명

  if (mainPost.$state.riskEvalBbsList[0] != undefined) {
    series.value = [
      {
        name: "",
        data: [
          parseInt(mainPost.$state.riskEvalBbsList[0].data1),
          parseInt(mainPost.$state.riskEvalBbsList[0].data2),
          parseInt(mainPost.$state.riskEvalBbsList[0].data3),
        ],
      },
    ];
  } else {
    series.value = [
      {
        name: "",
        data: [0, 0, 0],
      },
    ];
  }

  if (mainPost.$state.majorIspBbsList[0] != undefined) {
    donut_series.value = [
      parseInt(mainPost.$state.majorIspBbsList[0].data1),
      parseInt(mainPost.$state.majorIspBbsList[0].data4),
      parseInt(mainPost.$state.majorIspBbsList[0].data3),
      parseInt(mainPost.$state.majorIspBbsList[0].data2),
    ];
  } else {
    donut_series.value = [0, 0, 0, 0];
  }
  // mainPost.$state.riskEvalBbsList[0];
};

// 전현장 위험요인 조회
const FctrBbsList = async () => {
  riskGrd.value = document.querySelector(
    "input[type='radio'][name='riskSort']:checked"
  ).value;

  let ptnrYn = loginAuth.$state.vendrInfo.ptnrYn;
  let vendrCd = "";

  if (ptnrYn === "N") {
    vendrCd = loginAuth.$state.vendrInfo.vendrCd;
  } else {
    vendrCd = loginAuth.$state.vendrInfo.vendrUpperCd;
  }

  const param = {
    vendrCd: vendrCd,
    riskGrd: riskGrd.value,
  };

  await mainPost.selectDsstrTypeRiskFctrBbsList(param);
  if (mainPost.$state.dsstrTypeRiskFctrBbsList[0] != undefined) {
    bottom_series.value = [
      {
        name: "",
        data: [
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data1),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data2),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data3),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data4),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data5),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data6),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data7),
          parseInt(mainPost.$state.dsstrTypeRiskFctrBbsList[0].data8),
        ],
      },
    ];
  } else {
    bottom_series.value = [0, 0, 0, 0, 0, 0, 0, 0];
  }
};

onMounted(() => {
  // 전사 대시보드 조회
  searchMainDashBoard();

  // 전현장 위험요인 조회
  FctrBbsList();
});
</script>

<style scoped></style>
