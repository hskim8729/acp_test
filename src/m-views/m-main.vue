<template>
  <div class="m_main_top">
    <section class="section_auth_ho">
      <div class="top_bar">
        <span class="name">{{ userNm }}</span>
        <span class="company">{{ vendrNm }}</span>
        <span class="grade">{{ vendrJbttlNm }}</span>
      </div>
    </section>
    <section class="section_auth_site section_auth_partner">
      <div class="top_bar">
        <div class="info_area">
          <span class="name">{{ userNm }}</span>
          <span class="company">{{ vendrNm }}</span>
        </div>
        <span class="grade">{{ vendrJbttlNm }}</span>

        <button class="alam_btn" @click="alamList"></button>
      </div>
    </section>
  </div>
  <div class="m_main_wrap">
    <!-- 현장/협력사 : 신호등 -->
    <section class="section_auth_site section_auth_partner">
      <div class="m_main_box">
        <div class="m_signal_title">우리현장 위험신호등</div>
        <div :class="getSignal(color)">
          <div class="point">{{ score }}</div>
        </div>
        <div class="clear"></div>
      </div>
    </section>

    <!-- 본사 : 차트 -->
    <section class="section_auth_ho">
      <div class="m_main_box">
        <apexchart
          width="100%"
          height="350"
          :options="ho_options"
          :series="ho_series"></apexchart>
      </div>
    </section>

    <!-- 현장/협력사 : 차트 -->
    <section class="section_auth_site section_auth_partner">
      <div class="m_main_box chart">
        <div class="left">
          <apexchart
            width="100%"
            height="190"
            :options="options"
            :series="series"></apexchart>
        </div>
        <div class="right">
          <apexchart
            width="100%"
            height="190"
            :options="donut_options"
            :series="donut_series"></apexchart>
          <!-- donut chart -->
        </div>
      </div>
    </section>

    <!-- 본사 : 현장신호등 -->
    <section class="section_auth_ho">
      <div class="m_main_box">
        <button @click="hoSignalShow" class="m_signal_btn">
          현장안전 신호등
        </button>
        <ul class="m_signal_list">
          <li v-for="(item, index) in siteBbsList" :key="index">
            <div class="m_signal_title">{{ item.siteNm }}</div>
            <div
              :class="{
                'm_signal_bg red': item.color == 'R',
                'm_signal_bg green': item.color == 'G',
                'm_signal_bg yellow': item.color == 'Y',
                'm_signal_bg none': item.color == 'N',
              }">
              <div class="point">{{ item.score }}</div>
            </div>
            <!-- <div :class="getSignal(item.color)">
              <div class="point">{{ item.score }}</div>
            </div> -->
          </li>
        </ul>
      </div>
    </section>

    <!-- 현장 : 안전점검/조치승인 -->
    <section class="section_auth_site">
      <div class="half_box">
        <div class="m_main_box">
          <div class="title">안전점검</div>
          <div class="item">
            점검 <span class="count">{{ mtotal }}</span
            >/<span>{{ total }}</span>
          </div>
        </div>
        <div class="m_main_box">
          <div class="title">조치승인</div>
          <div class="item">
            승인 <span class="count">{{ appmtotal }}</span
            >/<span>{{ apptotal }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 협력사 : 조치등록/TBM -->
    <section class="section_auth_partner">
      <div class="half_box">
        <div class="m_main_box">
          <div class="title">조치등록</div>
          <div class="item">
            조치 <span class="count">{{ actmtotal }}</span
            >/<span>{{ acttotal }}</span>
          </div>
        </div>
        <div class="m_main_box">
          <div class="title">TBM</div>
          <div class="item">
            등록 <span class="count">{{ tbmmtotal }}</span
            >/<span>{{ tbmtotal }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 현장/협력사 : 현장인원 -->
    <section class="section_auth_site section_auth_partner">
      <div class="m_main_box">
        <button @click="workerListShow" class="m_worker_btn">
          현장인원 보기
        </button>

        <ul class="m_worker_list">
          <li v-for="(item, index) in mainPopUserList" :key="index">
            <div>{{ item.userNm }}</div>
            <div>
              <span>{{ item.jbttlNm }}</span>
              <span>{{ item.vendrNm }}</span>
            </div>
            <!-- <div>{{ item.telNo }}</div> -->
            <div>
              <a :href="item.telNo != '' ? 'tel:' + item.telNo : '#'">{{
                item.telNo
              }}</a>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 본사 공지사항 -->
    <section class="section_auth_ho">
      <div class="m_main_title">공지사항</div>
      <div class="m_main_box">
        <ul class="m_notice">
          <li
            v-for="(item, index) in dashboardNoti"
            :key="index"
            @click="detailNoticeView(item)">
            <span :class="item.bbsStyleNm">{{ item.bbsClsNm }} </span>
            <!-- <span >{{
              dashBoardIconName
            }}</span
            > -->
            {{ item.ttl }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 현장/협력사 공지사항 -->
    <section class="section_auth_site section_auth_partner">
      <div class="m_main_title">공지사항</div>
      <div class="m_main_box">
        <ul class="m_notice">
          <li
            v-for="(item, index) in dashBoardSiteList"
            :key="index"
            @click="detailNoticeView(item)">
            <span :class="item.bbsStyleNm">{{ item.bbsClsNm }} </span>
            <!-- <span>{{
              dashBoardIconName
            }}</span
            > -->
            {{ item.ttl }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 알람목록 팝업 -->
    <div class="popup alam_list_popup">
      <div class="popup_title">
        알람 목록
        <button class="popup_close" @click="popupClose"></button>
      </div>
      <div class="popup_content">
        <ul>
          <li class="item" v-for="(item, index) in alarmList" :key="index">
            <span class="text">{{ item.dtl }} </span>
            <span class="date">{{ formatDate(item.lastDate) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 공지 글보기 팝업 -->
    <div class="popup notice_view_popup">
      <div class="popup_title">
        {{ popNm }} 공지
        <button class="popup_close" @click="popupClose"></button>
      </div>
      <div class="popup_content">
        <div class="top">
          <div class="writer">{{ writeNm }}</div>
          <div class="date">{{ modDate }}</div>
        </div>
        <div class="subject">{{ ttl }}</div>
        <div class="content">
          <textarea class="txtarea" v-model="dtl" readonly></textarea>
        </div>
        <div class="file">
          <ul id="ulMainDataList"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const pageTitle = document.getElementsByClassName("m_page_title")[0];
    pageTitle.innerText = "Plan2Do 안전보건 플랫폼"; // 페이지 타이틀 입력
  },
};
</script>

<script setup>
import { useBoardStore } from "@/stores/board/board_store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainHeadStore } from "@/stores/common/main-head-store";
import { useMainSiteStore } from "@/stores/common/main-site-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import commonUtil from "@/utils/common-utils";
import { onBeforeMount, onMounted, ref, watch } from "vue";

// 현장/협력사 상중하차트
const options = {
  theme: {
    palette: "palette3",
  },
  chart: {
    type: "bar",
    height: 10,
    width: 10,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      horizontal: false,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#555555"],
    },
  },
  xaxis: {
    categories: ["상", "중", "하"],
    labels: {
      show: true,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
  },
};

let series = ref([
  {
    name: "",
    data: [0, 0, 0],
  },
]);

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

const cUtil = commonUtil;
const dashBoardSiteList = ref([]);
const boardStore = useBoardStore();
const loginAuth = useLoginAuthStore();
const SiteStore = useMainSiteStore();
const mainPost = useMainHeadStore();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const dashboardNoti = ref([]);
const detailBoard = ref([]);
const siteBbsList = ref([]);
const authClsCd = ref("");
const authClsNm = ref("");
const evalMtBsInfoList = ref([]);
const mainPopUserList = ref([]);
const alarmList = ref([]);
const riskGrd = ref("");
let siteCd = ref("");
const siteNm = ref();
const color = ref("");
const score = ref(0);
const riskRate = ref(0);
const riskScore = ref(0);
const inspRate = ref(0);
const inspScore = ref(0);

const vendrJbttlNm = ref();
const vendrNm = ref();
const userNm = ref();
const total = ref();
const mtotal = ref();
const apptotal = ref();
const appmtotal = ref();
const acttotal = ref();
const actmtotal = ref();
const tbmtotal = ref();
const tbmmtotal = ref();

const writeNm = ref();
const modDate = ref();
const ttl = ref();
const popNm = ref();
const dtl = ref();
const fileNm = ref();
const url = import.meta.env.VITE_APP_API_DEV_URL;

let dashBoardIconName = ref("");

// 현장인원 열기/닫기
function workerListShow() {
  let workerList = document.getElementsByClassName("m_worker_list")[0];

  if (workerList.classList.contains("show") == false) {
    workerList.classList.add("show");
    workerList.previousElementSibling.innerText = "현장인원 닫기";
  } else {
    workerList.classList.remove("show");
    workerList.previousElementSibling.innerText = "현장인원 보기";
  }
}

// 본사 신호등 열기/닫기
function hoSignalShow() {
  let signalList = document.getElementsByClassName("m_signal_list")[0];

  if (signalList.classList.contains("show") == false) {
    signalList.classList.add("show");
    signalList.previousElementSibling.innerText = "현장안전 신호등 닫기";
  } else {
    signalList.classList.remove("show");
    signalList.previousElementSibling.innerText = "현장안전 신호등";
  }
}

// 알람 목록 팝업
function alamList() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("alam_list_popup")[0].classList.add("show");
}
// 공지 팝업
function noticeView() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("notice_view_popup")[0].classList.add("show");
}
//공지 팝업 닫기
function popupClose(event) {
  const file = document.getElementById("ulMainDataList");
  file.innerHTML = "";

  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  event.target.parentElement.parentElement.classList.remove("show");
}

// 알람 조회
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
};

watch(
  () => loginAuth.$state.siteInfo.siteCd,
  (oldValue, newValue) => {
    pageTitle();
  }
);

// 초기 값 셋팅
const pageTitle = () => {
  setTimeout(() => {
    let sessionSiteNm = !!loginAuth.$state.siteInfo.siteNm
      ? loginAuth.$state.siteInfo.siteNm
      : "현장없음";
    userNm.value = loginAuth.$state.userInfo.userNm;
    vendrJbttlNm.value = loginAuth.$state.authInfo.authNm;
    siteNm.value = sessionSiteNm;
    vendrNm.value = loginAuth.$state.vendrInfo.vendrNm;

    authClsCd.value = loginAuth.$state.authInfo.authClsCd;
    authClsNm.value = loginAuth.$state.authInfo.authClsNm;
    // 상단 타이틀
    const pageTitle = document.getElementsByClassName("m_page_title")[0];
    //pageTitle.innerText = "Plan2Do " + authClsNm.value + " 대쉬보드";
    //pageTitle.innerText = loginAuth.$state.siteInfo.siteNm;

    // 본사/현장/협력사 노출 세팅
    switch (authClsCd.value) {
      // 본사
      case "T2201":
        let sectionClassHo = document.querySelectorAll(".section_auth_ho");

        pageTitle.innerText = sessionSiteNm;
        sectionClassHo.forEach((sectionShow) => {
          sectionShow.classList.add("show");
        });
        // 본사 대시보드 조회
        searchMainDashBoard();
        // 전현장 위험요인 검색
        FctrBbsList();
        break;

      // 현장
      case "T2202":
        let sectionClassSite = document.querySelectorAll(".section_auth_site");

        pageTitle.innerText = sessionSiteNm;
        sectionClassSite.forEach((sectionShow) => {
          sectionShow.classList.add("show");
        });
        // 현장 조회
        searchSiteList();
        // 현장인원조회
        userData();
        // 알람 조회
        searchAlarmList();
        break;

      // 협력사
      case "T2203":
        let sectionClassPartner = document.querySelectorAll(
          ".section_auth_partner"
        );

        pageTitle.innerText = sessionSiteNm;
        sectionClassPartner.forEach((sectionShow) => {
          sectionShow.classList.add("show");
        });
        // 현장 조회
        searchSiteList();
        // 현장인원조회
        userData();
        // 알람 조회
        searchAlarmList();
        break;
    }
  }, 200);
};

onMounted(() => {
  pageTitle();
});

onBeforeMount(() => {});

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
  siteBbsList.value = mainPost.$state.siteBbsList; // 전사 현장 목록
  siteCd.value =
    mainPost.$state.siteBbsList.length > 0
      ? mainPost.$state.siteBbsList[0].siteCd
      : "";
};

// 현장 전체 조회
const searchSiteList = async () => {
  const param = {
    vendrCd: loginAuth.$state.siteInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    userId: loginAuth.$state.userInfo.userId,
    // vendrUpperCd: loginAuth.$state.vendrInfo.vendrUpperCd,
  };
  siteCd.value = loginAuth.$state.siteInfo.siteCd;

  if (siteCd.value) {
    if (
      loginAuth.$state.authInfo.authClsCd == "T2202" ||
      loginAuth.$state.authInfo.authClsCd == "T2201"
    ) {
      await SiteStore.searchSiteList(param);
      await SiteStore.selectAddRskDscv(param);
    } else {
      await SiteStore.selectDashBoardPartnerList(param);
      await SiteStore.selectPartnerAddRisk(param);
    }

    await SiteStore.selectSafeTfclghtscrStngList(param); // 안전 신호등
    await SiteStore.selectSiteRiskEvalMajorIsp(param); // 위험성 평가 / 중점점검조치 / 중점건수 / TBM

    color.value = SiteStore.$state.sftAtvtInspList[0].color; // 신호등 컬러
    score.value = SiteStore.$state.sftAtvtInspList[0].score; // 신호등 안전점수
    total.value = SiteStore.$state.majorIspBbsCnt[0].total; // 중점점검 전체건수
    mtotal.value = SiteStore.$state.majorIspBbsCnt[0].mtotal; // 중점점검 미점검 건수
    apptotal.value = SiteStore.$state.majorIspAppCnt[0].apptotal; // 중점점검 승인 건수
    appmtotal.value = SiteStore.$state.majorIspAppCnt[0].appmtotal; // 중점점검 승인 건수

    acttotal.value = SiteStore.$state.majorIspActCnt[0].acttotal; // 중점점검 전체건수
    actmtotal.value = SiteStore.$state.majorIspActCnt[0].actmtotal; // 중점점검 조치 건수
    tbmtotal.value = SiteStore.$state.majorIspTbmCnt[0].tbmtotal; // TBM 전체 건수
    tbmmtotal.value = SiteStore.$state.majorIspTbmCnt[0].tbmmtotal; // TBM 등록 건수

    SiteStore.$state.safeTfclghtscrStngList.forEach((item) => {
      // 값이 null이면 0으로 대입
      if (cUtil.nullCheck(item.scoreRate)) {
        item.scoreRate = 0;
      }
      if (cUtil.nullCheck(item.score)) {
        item.score = 0;
      }

      if (item.gubun == "A") {
        // 안전점검조치
        inspRate.value = item.scoreRate;
        inspScore.value =
          100 - (parseInt(item.score) == 0 ? 100 : parseInt(item.score));
      } else if (item.gubun == "B") {
        // 위험성 평가
        riskRate.value = item.scoreRate;
        riskScore.value =
          100 - (parseInt(item.score) == 0 ? 100 : parseInt(item.score));
      }

      if (inspRate.value == 0) {
        inspRate.value = 100 - parseInt(riskRate.value);
      } else if (riskRate.value == 0) {
        riskRate.value = 100 - parseInt(inspRate.value);
      }
    });

    dashBoardSiteList.value = SiteStore.$state.dashBoardSiteList; // 공지사항
    evalMtBsInfoList.value = SiteStore.$state.evalMtBsInfoList; // 위험성평가회의

    siteChartDraw();
  }
};

//현장인원 조회
async function userData() {
  const param = {
    vendrCd: loginAuth.$state.vendrInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    userId: loginAuth.$state.userInfo.userId,
  };

  try {
    await SiteStore.selectMainPopUserList(param);
    mainPopUserList.value = SiteStore.$state.mainPopUserList;
  } catch (err) {
    throw err;
  }
}

// 전현장 위험요인 조회
const FctrBbsList = async () => {
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

  await mainPost.selectDsstrTypeRiskFctrBbsList(param);

  if (mainPost.$state.dsstrTypeRiskFctrBbsList[0] != undefined) {
    ho_series.value = [
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
    ho_series.value = [0, 0, 0, 0, 0, 0, 0, 0];
  }
};

// 현장 차트 그리기 함수
const siteChartDraw = () => {
  if (SiteStore.$state.riskEvalBbsList[0] !== undefined) {
    series.value = [
      {
        name: "",
        data: [
          parseInt(SiteStore.$state.riskEvalBbsList[0].data1),
          parseInt(SiteStore.$state.riskEvalBbsList[0].data2),
          parseInt(SiteStore.$state.riskEvalBbsList[0].data3),
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

  if (SiteStore.$state.majorIspBbsList[0] !== undefined) {
    donut_series.value = [
      parseInt(SiteStore.$state.majorIspBbsList[0].data1),
      parseInt(SiteStore.$state.majorIspBbsList[0].data4),
      parseInt(SiteStore.$state.majorIspBbsList[0].data3),
      parseInt(SiteStore.$state.majorIspBbsList[0].data2),
    ];
  } else {
    donut_series.value = [0, 0, 0, 0];
  }
};

// 본사 차트
const ho_options = {
  theme: {
    palette: "palette3",
  },
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      horizontal: true,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 20,
    style: {
      fontSize: "12px",
      colors: ["#555555"],
    },
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
    labels: {
      show: false,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
  },
};

let ho_series = ref([
  {
    name: "",
    data: [0, 0, 0, 0, 0, 0, 0, 0],
  },
]);

// 파이 차트
const donut_options = {
  chart: {
    id: "pieChart",
    type: "pie",
  },
  labels: ["양호", "조치중", "조치지연", "미점검"],

  colors: ["#36cc72", "#ddd23f", "#dd893f", "#dd3f81"],
};
let donut_series = ref([0, 0, 0, 0]);
//[44, 55, 41, 17];

// 현장 목록 안전 신호등
const getSignal = (color) => {
  switch (color) {
    case "R":
      return "m_signal_bg red";
    case "G":
      return "m_signal_bg green";
    case "Y":
      return "m_signal_bg yellow";
    case "N":
      return "m_signal_bg none";
    default:
      return "";
  }
};

// 공지사항 상세보기 -- 수정은 안됨
const detailNoticeView = async (item) => {
  if (item.bbsClsCd === "T2301") {
    popNm.value = "본사";
  } else if (item.bbsClsCd === "T2302") {
    popNm.value = "현장";
  } else if (item.bbsClsCd === "T2303") {
    popNm.value = "협력사";
  } else if (item.bbsClsCd === "T2307") {
    popNm.value = "시스템";
  }
  const param = { bbsSeq: item.bbsSeq };
  await boardStore.boardDetailSearch(param);
  detailBoard.value = boardStore.$state.detailList[0];

  writeNm.value = detailBoard.value.writeNm;
  modDate.value = detailBoard.value.modDate;
  ttl.value = detailBoard.value.ttl;
  dtl.value = detailBoard.value.dtl;
  fileNm.value = detailBoard.value.fileNm;

  const Fparam = await boardStore.boardDetailSearch(param);

  detailFile(Fparam);

  noticeView();
};

// 상세보기 파일 리스트
const detailFile = (param) => {
  const file = document.getElementById("ulMainDataList");
  for (let count of param) {
    if (count.filePath) {
      const li = document.createElement("li");
      li.innerHTML = count.fileNm;
      li.setAttribute("id", "liUploadFileU_" + count.fileNm);
      li.addEventListener("click", async function () {
        try {
          let link = document.createElement("a");
          let downloadUrl =
            url +
            "/v1/common/getImage?param1=" +
            count.filePath +
            "&param2=" +
            count.fileNm;
          link.href = downloadUrl;
          link.download = count.fileNm;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(link);
        } catch (error) {
          console.error(error);
        }
      });

      file.appendChild(li);
    }
  }
};
</script>

<style scoped lang="scss">
.m_content_area {
  padding: 0px !important;
}

.chart {
  position: relative;
  height: 200px;
}

.chart .left {
  float: left;
  width: 30%;
  margin-left: -20px;
}

.chart .right {
  float: right;
  width: calc(70% + 30px);
  max-width: 280px;
  margin-top: 10px;
  margin-right: -10px;
}

.apexcharts-pie {
  margin-top: 30px;
}

.half_box {
  display: flex;
  justify-content: space-between;
}

.half_box .m_main_box {
  width: calc(50% - 10px);
}

.alam_list_popup {
  width: 80%;
  height: 500px;
}

.notice_view_popup {
  width: 90%;
  height: 500px;
  max-height: 500px;
}

.alam_list_popup .popup_content {
  height: calc(100% - 60px);
}

.notice_view_popup .popup_content {
  height: calc(100% - 60px);
  max-height: 440px;
  overflow: auto;
}
.notice_view_popup .content {
  height: calc(90% - 100px);
}

.txtarea {
  height: 100%;
}
</style>
