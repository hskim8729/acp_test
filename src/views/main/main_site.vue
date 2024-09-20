<template>
  <!-- 현장사용자 팝업 -->
  <mainPopUserList v-if="isMounted"></mainPopUserList>
  <!-- 나의 할일 팝업 -->
  <mainPopMyWork
    @myWorkTotalCnt="myWorkTotalCnt"
    v-if="isMounted"></mainPopMyWork>
  <!-- 알람목록 팝업 -->
  <mainPopAlamList v-if="isMounted"></mainPopAlamList>

  <div class="dash_top_area">
    <button @click="alamList" class="alam"></button>
    <button @click="myWork">
      나의 할일<span class="count">{{ workTotal }}</span>
    </button>
    <router-link to="/SITE/siteRegDetail">
      <button>현장정보</button>
    </router-link>
    <router-link to="/SITE/siteImpRegulation">
      <button>실시규정</button>
    </router-link>
    <button @click="userList">현장 사용자</button>
  </div>
  <div class="dash_wrap">
    <div class="dash_content">
      <!-- 공지사항 -->
      <div class="dash_notice">
        <div class="title">
          공지사항
          <div class="right_btn">
            <!-- <button @click="noticeWriteBtn">신규등록</button> -->
            <router-link to="/BOARD/notice">
              <button>공지사항 바로가기</button>
            </router-link>
          </div>
        </div>
        <div class="content">
          <div class="dash_board_list">
            <ul>
              <li
                v-for="(item, index) in dashBoardSiteList"
                :key="index"
                @click="detailNoticeView(item)">
                <span :class="item.bbsStyleNm">{{ item.bbsClsNm }} </span>
                <span :class="{ icon_new: item.newYn == 'Y' }"></span>
                {{ item.ttl }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 안전보건 자료실 -->
      <div class="dash_data">
        <div class="title">안전보건 자료실</div>
        <div class="content">
          <div class="dash_board_list">
            <ul>
              <li
                v-for="(item, index) in sftyHlthBbsList"
                :key="index"
                @click="detailDataView(item)">
                {{ item.ttl
                }}<span :class="{ icon_file: item.atchFileKey != null }"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 안전신호등 -->
      <div class="dash_safety_signal">
        <div class="title">우리현장 안전신호등</div>
        <div class="content">
          <div class="item">위험성평가 점수 ({{ riskRate }}%)</div>
          <div class="item_point">
            <span class="point">{{ riskScore }}</span
            >점
          </div>
          <div class="item">안전점검조치 ({{ inspRate }}%)</div>
          <div class="item_point">
            <span class="point">{{ inspScore }}</span
            >점
          </div>
          <div :class="getSignal(color)">
            <!-- green / yellow / red class로 색상변경 -->
            <div class="point">
              {{ score }}
            </div>
          </div>
        </div>
      </div>

      <!-- 안전점검/조치 -->
      <div class="dash_chart">
        <div class="title">안전점검/조치</div>
        <div class="content">
          <div class="chart_left">
            <apexchart
              width="100%"
              height="190"
              :options="options"
              :series="series"></apexchart>
            <!-- bar chart -->
          </div>
          <div class="chart_right">
            <apexchart
              width="100%"
              height="200"
              :options="donut_options"
              :series="donut_series"></apexchart>
            <!-- donut chart -->
          </div>
        </div>
      </div>

      <!-- 위험성평가/주간합동점검 -->
      <div class="dash_risk site_board">
        <div class="title">
          <ul>
            <li @click="siteRiskMeeting" class="active">위험성평가회의</li>
            <li @click="siteWeeklyMeeting">주간합동점검회의</li>
            <li
              @click="siteTbm"
              v-show="loginAuth.$state.authInfo.authClsCd == 'T2203'">
              TBM
            </li>
          </ul>
        </div>

        <div class="content">
          <div class="dash_board_list site_board_risk show">
            <div class="tab_btn right_btn">
              <!-- <button>신규등록</button> -->
              <router-link to="/INSPC_ACTVT/riskAssmnCnfrnMain">
                <button>위험성평가회의 바로가기</button>
              </router-link>
            </div>
            <ul>
              <li
                v-for="(item, index) in evalMtBsInfoList"
                :key="index"
                @click="riskMovePage(item)">
                {{ item.mtNm
                }}<span :class="{ icon_new: item.newYn == 'Y' }"></span>
              </li>
            </ul>
          </div>
          <div class="dash_board_list site_board_weekly">
            <div class="tab_btn right_btn">
              <!-- <button>신규등록</button> -->
              <router-link to="/INSPC_ACTVT/ActivitySafetyInspectionPage">
                <button>주간합동점검회의 바로가기</button>
              </router-link>
            </div>
            <ul>
              <li
                v-for="(item, index) in activitySafetyInspectionList"
                :key="index"
                @click="activityMovePage(item)">
                {{ item.mtNm
                }}<span :class="{ icon_new: item.newYn == 'Y' }"></span>
              </li>
            </ul>
          </div>
          <div class="dash_board_list site_board_tbm">
            <div class="tab_btn right_btn">
              <!-- <button>신규등록</button> -->
              <router-link to="/SAFE_ACTVT/toolBoxMeeting">
                <button>TBM 바로가기</button>
              </router-link>
            </div>
            <ul>
              <li
                v-for="(item, index) in dashboardTbmList"
                :key="index"
                @click="tbmMovePage(item)">
                {{ item.tbmNm
                }}<span :class="{ icon_new: item.newYn == 'Y' }"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 안전보건 포스터 -->
      <div class="dash_poster">
        <div class="title">안전보건 포스터</div>
        <div class="contnet">
          <sliderSite :fromHeadFile="mainSlider"></sliderSite>
        </div>
      </div>

      <!-- 경영목표 -->
      <div class="dash_goal">
        <div class="title">
          현장 안전보건 경영목표
          <div class="right_btn">
            <button
              @click="popupSiteFileAttach"
              v-if="
                (loginAuth.$state.authInfo.authCd == '2000' &&
                  loginAuth.$state.authInfo.authClsCd == 'T2202') ||
                (loginAuth.$state.authInfo.authCd == '3000' &&
                  loginAuth.$state.authInfo.authClsCd == 'T2202') ||
                (loginAuth.$state.authInfo.authCd == '4000' &&
                  loginAuth.$state.authInfo.authClsCd == 'T2202')
              ">
              파일첨부
            </button>
          </div>
        </div>
        <div class="contnet">
          <div class="img_wrap">
            <div class="photo" id="mngTrgtPhotoPreview"></div>
          </div>
        </div>
      </div>

      <!-- 추가위험 점검 -->
      <div class="dash_additioanl">
        <div class="title">
          추가위험 점검
          <div class="right_btn">
            <router-link to="/ADTN_RISK/additionalRiskDiscovery">
              <button>추가위험 점검 바로가기</button>
            </router-link>
            <!-- <button>신규등록</button> -->
          </div>
        </div>
        <div class="contnet">
          <div class="card_wrap">
            <div class="card">
              <div class="card_title">순회점검</div>
              <div class="card_item1">
                실시<span class="count">{{ addRskDscvCircuitReceipt }}</span
                >회
              </div>
              <div class="card_item2">
                등록<span class="count">{{ addRskDscvCircuitRegist }}</span
                >건
              </div>
            </div>
            <div class="card">
              <div class="card_title">아차사고</div>
              <div class="card_item1">
                접수<span class="count">{{ addRskDscvAchReceipt }}</span
                >건
              </div>
              <div class="card_item2">
                등록<span class="count">{{ addRskDscvAchRegist }}</span
                >건
              </div>
            </div>
            <div class="card">
              <div class="card_title">근로자 제보</div>
              <div class="card_item1">
                접수<span class="count">{{ addRskDscvWrkReceipt }}</span
                >건
              </div>
              <div class="card_item2">
                등록<span class="count">{{ addRskDscvWrkRegist }}</span
                >건
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 파일 첨부 팝업 -->
  <mainPopSiteFileAttach
    :bbsSeq="bbsSeq"
    @searchSiteList="searchSiteList"></mainPopSiteFileAttach>

  <!-- 공지사항 글보기 팝업 -->
  <popNoticeView ref="dashSiteNotice"></popNoticeView>

  <!-- 자료실 글보기 팝업 -->
  <popDataView ref="dashSiteData"></popDataView>
</template>

<script setup>
import { defineComponent } from "vue";
import sliderSite from "@/components/editor/slider.vue";
// 대쉬보드 팝업
import mainPopUserList from "@/views/main/mainPopUserList.vue";
import mainPopMyWork from "@/views/main/mainPopMyWork.vue";
import mainPopAlamList from "@/views/main/mainPopAlamList.vue";
import mainPopSiteFileAttach from "@/views/main/mainPopSiteFileAttach.vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainSiteStore } from "../../stores/common/main-site-store";
import {
  ref,
  onBeforeUpdate,
  onBeforeMount,
  onMounted,
  watch,
  reactive,
} from "vue";
import popNoticeView from "@/views/main/popNoticeView.vue";
import popDataView from "@/views/main/popDataView.vue";
import { useBoardStore } from "../../stores/board/board_store";
import { useRouter } from "vue-router";
import { useActivitySafetyIspStore } from "@/stores/inspcActvt/activity-safety-inspection-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import commonUtil from "@/utils/common-utils";

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

const dashSiteData = ref("");
const dashSiteNotice = ref("");
const loginAuth = useLoginAuthStore();
const SiteStore = useMainSiteStore();
const store = useActivitySafetyIspStore();
const standReglStore = useStandReglStore();
const mainSlider = ref([]);
const siteCd = ref("");
const vendrCd = ref("");
const cUtil = commonUtil;

const dashBoardSiteList = ref([]);
const sftyHlthBbsList = ref([]);
const sftyHlthPstrBbsList = ref([]);
const mngTrgtList = ref([]);
const evalMtBsInfoList = ref([]);
const activitySafetyInspectionList = ref([]);
const dashboardTbmList = ref([]);
let siteExeRuleStd = ref([]);
let riskLvlList = ref([]);

const addRskDscvCircuitReceipt = ref(0);
const addRskDscvCircuitRegist = ref(0);
const addRskDscvAchReceipt = ref(0);
const addRskDscvAchRegist = ref(0);
const addRskDscvWrkReceipt = ref(0);
const addRskDscvWrkRegist = ref(0);
const boardStore = useBoardStore();
let color = ref("");
let score = ref(0);
let riskRate = ref(0);
let riskScore = ref(0);
let inspRate = ref(0);
let inspScore = ref(0);
const router = useRouter();
let apprUserParams = ref();
let workTotal = ref(0);
let dashBoardIconName = ref("");
let bbsSeq = ref(0);

let url = import.meta.env.VITE_APP_API_DEV_URL;

// 나의 할일 총 갯수
const myWorkTotalCnt = (item) => {
  workTotal.value = item;
};

// 현장 전체 조회
const searchSiteList = async () => {
  const param = {
    vendrCd: loginAuth.$state.siteInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    userId: loginAuth.$state.userInfo.userId,
    psitnVendrCd: loginAuth.$state.vendrInfo.vendrCd,
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
    await SiteStore.selectSiteRiskEvalMajorIsp(param); // 위험성 평가 / 중점점검조치
    color.value = SiteStore.$state.sftAtvtInspList[0].color; // 신호등 컬러
    score.value = SiteStore.$state.sftAtvtInspList[0].score; // 신호등 안전점수
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

    // 만약 위험성평가, 안전점검조치 점수가 0점일 경우 안전신호등 점수도 0점으로
    // if (inspScore.value == 0 && riskScore.value == 0) {
    //   score.value = 0;
    //   color.value = "N";
    // }

    dashBoardSiteList.value = SiteStore.$state.dashBoardSiteList; // 공지사항
    sftyHlthBbsList.value = SiteStore.$state.sftyHlthBbsList; // 자료실
    evalMtBsInfoList.value = SiteStore.$state.evalMtBsInfoList; // 위험성평가회의
    activitySafetyInspectionList.value =
      SiteStore.$state.activitySafetyInspectionList; // 주간합동점검회의
    mngTrgtList.value = SiteStore.$state.mngTrgtList; // 경영목표 파일리스트
    sftyHlthPstrBbsList.value = SiteStore.$state.sftyHlthPstrBbsList; //포스터(첨부파일 이미지)
    dashboardTbmList.value = SiteStore.$state.dashboardTbmList; //포스터(첨부파일 이미지)

    // 추가위험 점검
    // 순회점검
    addRskDscvCircuitReceipt.value =
      SiteStore.$state.addRskDscvCircuitReceipt == undefined
        ? 0
        : SiteStore.$state.addRskDscvCircuitReceipt;
    addRskDscvCircuitRegist.value =
      SiteStore.$state.addRskDscvCircuitRegist == undefined
        ? 0
        : SiteStore.$state.addRskDscvCircuitRegist;

    // 아차사고
    addRskDscvAchReceipt.value =
      SiteStore.$state.addRskDscvAchReceipt == undefined
        ? 0
        : SiteStore.$state.addRskDscvAchReceipt;
    addRskDscvAchRegist.value =
      SiteStore.$state.addRskDscvAchRegist == undefined
        ? 0
        : SiteStore.$state.addRskDscvAchRegist;

    // 근로자 제보
    addRskDscvWrkReceipt.value =
      SiteStore.$state.addRskDscvWrkReceipt == undefined
        ? 0
        : SiteStore.$state.addRskDscvWrkReceipt;
    addRskDscvWrkRegist.value =
      SiteStore.$state.addRskDscvWrkRegist == undefined
        ? 0
        : SiteStore.$state.addRskDscvWrkRegist;

    handleMainFileList(sftyHlthPstrBbsList.value);
    if (mngTrgtList.value != "") {
      detailPreview(mngTrgtList.value);
      bbsSeq.value = mngTrgtList.value[0].bbsSeq;
    }

    siteChartDraw();
  }
};

// 위험성 평가회의 이동 함수
const riskMovePage = (item) => {
  router.push({
    name: "RiskAssmnCnfrnDetail",
    state: item,
  });
};

// 주간함동점검회의 이동 함수
const activityMovePage = (item) => {
  item.mode = "U";
  store.$state.searchList = item;
  apprUserParams.value = "";
  siteExeRuleStd.value = "";
  riskLvlList.value = "";

  // 합동안전점검 이동을 위한 변수 저장
  activityValue();

  apprUserParams.value = {
    vendrCd: item.vendrCd,
    siteCd: item.siteCd,
    apprKey: item.mtApprKey,
    userId: loginAuth.$state.userInfo.userId,
    userNm: loginAuth.$state.userInfo.userNm,
    jbttlNm: loginAuth.$state.siteInfo.jbttlNm,
    workNm: loginAuth.$state.userInfo.workNm,
    menuId: "2002000",
  };
  store.$state.searchList.mode = "U";
  store.$state.searchList.view = "V";
  router.push({
    name: "ActivitySafetyInspectionDetail",
    params: {
      mode: "V", //detail
      prevPageParams: event,
      apprUserParams: apprUserParams,
    },
    state: {
      siteExeRuleStd: JSON.stringify(siteExeRuleStd.value),
      riskLvlList: JSON.stringify(riskLvlList.value),
    },
  });
};

// 합동안전점검 이동을 위한 변수 저장
const activityValue = async () => {
  const fchParam = reactive({
    // vendrCd: $loginStore.$state.siteInfo.vendrCd,
    vendrCd:
      loginAuth.$state.vendrInfo.ptnrYn === "Y"
        ? loginAuth.$state.vendrInfo.vendrUpperCd
        : loginAuth.$state.vendrInfo.vendrCd,
    siteCd: loginAuth.$state.siteInfo.siteCd,
    userId: loginAuth.$state.userInfo.userId,
    division: "S",
  });

  siteExeRuleStd.value = await standReglStore.standReglSearchList(fchParam);
  riskLvlList.value = await standReglStore.riskLvlList(fchParam);
};

// TBM 이동 함수
const tbmMovePage = (item) => {
  router.push({
    name: "toolBoxMeetingRegist",
    params: {
      mode: "U",
      tbmDt: item.tbmDt,
      psitnVendrCd: item.psitnVendrCd,
    },
  });
};

// 안전신호등 색상 함수
const getSignal = (color) => {
  switch (color) {
    case "R":
      return "signal_light red";
    case "G":
      return "signal_light green";
    case "Y":
      return "signal_light yellow";
    case "N":
      return "signal_light none";
    case "":
      return "signal_light none";
    default:
      return "signal_light none";
  }
};

// 현장 차트 그리기 함수
const siteChartDraw = () => {
  if (SiteStore.$state.riskEvalBbsList[0] != undefined) {
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
  console.log(
    "SiteStore.$state.majorIspBbsList[0] : ",
    SiteStore.$state.majorIspBbsList[0]
  );
  if (SiteStore.$state.majorIspBbsList[0] != undefined) {
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

// 포스터 랜덤 함수
const shuffleArray = (data) => {
  return data.sort(() => Math.random() - 0.5);
};

// 현장 전사 포스터 함수
const handleMainFileList = (data) => {
  if (Array.isArray(data) && data.length > 1) {
    data = shuffleArray(data);
  }
  mainSlider.value = data;
};

// 상세조회 사진 미리보기
const detailPreview = (param) => {
  document.getElementById("mngTrgtPhotoPreview").innerHTML = "";
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      // let span = document.createElement("span");
      // let button = document.createElement("button");
      let div = document.createElement("div");
      // div.setAttribute("id", "mngTrgtDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "mngTrgtImgFileU_" + count.fileNm);

      document.getElementById("mngTrgtPhotoPreview").appendChild(div);
      // div.appendChild(button);
      // div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 현장 파일첨부 관리 팝업
function popupSiteFileAttach() {
  document.getElementsByClassName("main_site_popup")[0].classList.add("show");
  document.getElementsByClassName("popup_bg2")[0].classList.add("show");
}

function userList() {
  let userListClass = document.getElementsByClassName("dash_pop_user_list")[0];
  let dashPopupClass = document.querySelectorAll(".dash_pop_default");

  if (!userListClass) {
    return false;
  }

  if (userListClass.classList.contains("show")) {
    userListClass.classList.remove("show");
  } else {
    dashPopupClass.forEach((dashPopupClose) => {
      dashPopupClose.classList.remove("show");
    });
    userListClass.classList.add("show");
  }
}
function myWork() {
  let userListClass = document.getElementsByClassName("dash_pop_my_work")[0];
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

function alamList() {
  let userListClass = document.getElementsByClassName("dash_pop_alam_list")[0];
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
function siteRiskMeeting(event) {
  siteMeetingTabClick(event);

  document.getElementsByClassName("site_board_risk")[0].classList.add("show");
  document
    .getElementsByClassName("site_board_weekly")[0]
    .classList.remove("show");
  document.getElementsByClassName("site_board_tbm")[0].classList.remove("show");
}
// 주간합동점검회의 show
function siteWeeklyMeeting(event) {
  siteMeetingTabClick(event);

  document
    .getElementsByClassName("site_board_risk")[0]
    .classList.remove("show");
  document.getElementsByClassName("site_board_weekly")[0].classList.add("show");
  document.getElementsByClassName("site_board_tbm")[0].classList.remove("show");
}
// TBM show
function siteTbm(event) {
  siteMeetingTabClick(event);

  document
    .getElementsByClassName("site_board_risk")[0]
    .classList.remove("show");
  document
    .getElementsByClassName("site_board_weekly")[0]
    .classList.remove("show");
  document.getElementsByClassName("site_board_tbm")[0].classList.add("show");
}

// 탭 클릭
function siteMeetingTabClick(event) {
  let meetingTab = document.querySelectorAll(".site_board li");

  meetingTab.forEach((meetingTabInactive) => {
    meetingTabInactive.classList.remove("active");
  });

  event.target.classList.add("active");
}

// 공지사항 상세보기 -- 수정은 안됨
const detailNoticeView = async (item) => {
  const param = { bbsSeq: item.bbsSeq };
  const detailBoard = await boardStore.boardDetailSearch(param);
  dashSiteNotice.value.updateInfo(detailBoard);
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
  dashSiteData.value.updateInfo(detailBoard);
  dataViewBtn();
};

// 자료실 글보기 팝업
function dataViewBtn(params) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("data_view")[0].classList.add("show");
}

onBeforeMount(() => {
  //searchSiteList();
});

// 팝업들이 로그인 스토어보다 먼저 마운트 되는 문제 막기위해 임시로 처리
const isMounted = ref(false);
onMounted(() => {
  console.log("loginAuth 문제???", loginAuth);
  if (loginAuth.$state.siteInfo.siteCd) {
    console.log("=== mainSite mounted", loginAuth.$state.siteInfo.siteCd);
    searchSiteList();
    isMounted.value = true;
  }
});

onBeforeUpdate(() => {});
</script>

<style scoped>
.chart_left {
  width: calc(100% - 310px);
}
.chart_right {
  left: calc(100% - 310px);
  width: 320px;
}
</style>
