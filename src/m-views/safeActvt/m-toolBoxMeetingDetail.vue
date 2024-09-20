<template>
  <div class="m_page_top_btn">
    <!-- <select v-model="language" style="margin-right: 5px;" @change="onChangeLanguage($event.target.value)">
			<option :value="0">== Translate ==</option>
			<option v-for="option in languageCode" :value="option.comCd">
				{{ option.comCdNm }}
			</option>  
		</select> -->
    <router-link to="/SAFE_ACTVT/m-toolBoxMeeting"
      ><button>목록</button></router-link
    >
  </div>

  <div class="item_wrap w100p mt30">
    <span class="p_title" v-html="tbmTranslateInfo.tbmNmTitle"></span><br />
    <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.tbmNm" />
  </div>

  <div class="item_wrap w50p">
    <span class="p_title" v-html="tbmTranslateInfo.tbmDtTitle"></span><br />
    <input type="date" :readonly="isEditMode" v-model="tbmDetailMap.tbmDt" />
  </div>

  <div class="item_wrap w50p no_margin">
    <span class="p_title" v-html="tbmTranslateInfo.tbmTimeTitle"></span><br />
    <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.tbmTime" />
  </div>

  <div class="item_wrap w100p">
    <span class="p_title" v-html="tbmTranslateInfo.tbmOrgnsId"></span><br />
    <input
      type="text"
      :readonly="isEditMode"
      v-model="tbmDetailMap.tbmOrgnsId" />
  </div>
  <div class="clear"></div>

  <div class="num_subtitle" v-html="tbmTranslateInfo.subTitle1"></div>

  <div class="m_content">
    <div class="item_wrap w100p">
      <span class="p_title" v-html="tbmTranslateInfo.wrkNmTitle"></span><br />
      <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.wrkNm" />
    </div>
    <div class="item_wrap w100p">
      <span class="p_title" v-html="tbmTranslateInfo.wrkLocTitle"></span><br />
      <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.wrkLoc" />
    </div>
    <div class="item_wrap w100p">
      <span class="p_title" v-html="tbmTranslateInfo.wrkDtlTitle"></span><br />
      <!-- <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.wrkDtl" /> -->
      <textarea :readonly="isEditMode" v-model="tbmDetailMap.wrkDtl"></textarea>
    </div>
    <div class="item_wrap w100p">
      <span class="p_title" v-html="tbmTranslateInfo.sftEduTitle"></span><br />
      <!-- <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.sftEdu" /> -->
      <textarea :readonly="isEditMode" v-model="tbmDetailMap.sftEdu"></textarea>
    </div>
    <div class="item_wrap w50p">
      <span class="p_title" v-html="tbmTranslateInfo.inptPsnTitle"></span><br />
      <input
        type="text"
        :readonly="isEditMode"
        v-model="tbmDetailMap.inptPsn" />
    </div>
    <div class="item_wrap w50p no_margin">
      <span class="p_title" v-html="tbmTranslateInfo.inptEqmntTitle"></span
      ><br />
      <input
        type="text"
        :readonly="isEditMode"
        v-model="tbmDetailMap.inptEqmnt" />
    </div>
  </div>

  <div class="num_subtitle" v-html="tbmTranslateInfo.subTitle2"></div>

  <div class="risk_card" v-show="tbmRskDsrsList != null">
    <ul>
      <table>
        <li v-for="(item, index) in tbmRskDsrsList" :key="index">
          <tr>
            <th v-text="tbmTranslateInfo.rskFctrTitle"></th>
            <td style="white-space: pre-line">
              {{ item.rskFctr }}
            </td>
          </tr>
          <tr>
            <th v-text="tbmTranslateInfo.rskMsrTitle"></th>
            <td style="white-space: pre-line">
              {{ item.dcrsMsr }}
            </td>
          </tr>
        </li>
      </table>
      <!-- <li>
        <table v-for="(item, index) in tbmRskDsrsList" :key="index">
          <tr>
            <th v-text="tbmTranslateInfo.rskFctrTitle"></th>
            <td>
              {{ item.dcrsMsr }}
            </td>
          </tr>
          <tr>
            <th v-text="tbmTranslateInfo.rskMsrTitle"></th>
            <td>
              {{ item.rskFctr }}
            </td>
          </tr>
        </table>
      </li> -->
    </ul>
  </div>

  <div class="num_subtitle" v-html="tbmTranslateInfo.subTitle3"></div>
  <div class="m_file_attach">
    <ul id="tbmPhotoPreview">
      <!-- <li id="tbmPhotoPreview"></li> -->
      <li v-for="file in imgList">
        <img
          :src="
            url +
            '/v1/common/getImage?param1=' +
            file.filePath +
            '&param2=' +
            file.fileNm
          " />
        <div class="file_name" @click="onClickDownload(file)">다운로드</div>
      </li>
    </ul>
  </div>
  <div class="num_subtitle" v-html="tbmTranslateInfo.subTitle4"></div>
  <div class="attend_btn_group">
    <button class="attend_button second" @click="qrPopup" v-if="isTbmToday">
      {{ tbmTranslateInfo.qrBtnTitle }}
    </button>
    <button
      class="attend_button first"
      @click="onAttdBtn"
      v-if="isTbmToday && !isUserAttending">
      {{ tbmTranslateInfo.attendBtnTitle }}
    </button>
  </div>
  <div class="m_tbm_join_list">
    <div class="header">
      <span>No.</span>
      <span v-html="tbmTranslateInfo.userNmTitle"></span>
      <span v-html="tbmTranslateInfo.regDateTitle"></span>
    </div>
    <ul>
      <li v-for="(item, index) in tbmAttndList" :key="index">
        <span>{{ index + 1 }}</span>
        <span>{{ item.userNm }}</span>
        <span>{{ formatDate(item.tbmDt) }}</span>
      </li>
    </ul>
  </div>
  <!-- QR 팝업 -->
  <div class="popup join_qr">
    <div class="popup_title">
      <span>참석 QR 코드</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="">
        <div class="content_box qr_center">
          <!-- value="http://dev.plan2do.co.kr/SAFE_ACTVT/m-toolBoxMeetingDetail2" -->
          <!-- value="http://localhost:4000/SAFE_ACTVT/m-toolBoxMeetingDetail2" -->
          <vue-qrcode
            v-bind:value="qrValue"
            :options="{
              // color: {
              // 	dark: '#0074d9',
              // 	light: '#7fdbff',
              // },
              // class: { qr_code },
            }" />
          <!--  <button @click="testQrCode">개발테스트</button> -->
        </div>
      </div>
    </div>
    <div class="popup_button">
      <button @click="popupClose">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import commonUtil from "@/utils/common-utils";
import { onMounted, ref } from "vue";
import VueQrcode from "vue-qrcode";
import { useToolBoxMeetingRegistStore } from "../../stores/safeActvt/tool-box-meeting-Regist-store";
import { useToolBoxMeetingStore } from "../../stores/safeActvt/tool-box-meeting-store";

import dayjs from "dayjs";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "TBM 상세보기"; // 페이지 타이틀 입력

const toolBoxStore = useToolBoxMeetingStore();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const LoginAuthStore = useLoginAuthStore();
const route = useRoute();
const router = useRouter();
const cUtil = commonUtil;
const dataUrl = ref(null);

const url = import.meta.env.VITE_APP_API_DEV_URL;
const domain = import.meta.env.VITE_APP_DOMAIN_URL;

const vendrCd = LoginAuthStore.$state.siteInfo.vendrCd;
const siteCd = LoginAuthStore.$state.siteInfo.siteCd;
const userId = LoginAuthStore.$state.userInfo.userId;
const userNm = LoginAuthStore.$state.userInfo.userNm;
const psitnVendrCd = LoginAuthStore.$state.userInfo.vendrCd;

const qrValue = ref("");

// 뒤로가기 시 팝업 화면
onBeforeRouteLeave(() => {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
});

// tbm title명
const tbmTranslateInfo = ref({
  // 메인 타이틀(TBM 상세보기)
  mainTitle: pageTitle.innerText,
  // tbm 기본정보
  tbmNmTitle: "TBM 명",
  tbmDtTitle: "TBM 일자",
  tbmTimeTitle: "TBM 시간",
  tbmOrgnsId: "주최자",

  // 1. 작업 및 안전교육
  subTitle1: "1. 작업 및 안전교육",
  wrkNmTitle: "작업명",
  wrkLocTitle: "작업위치",
  wrkDtlTitle: "작업내용",
  sftEduTitle: "안전교육",
  inptPsnTitle: "투입인원",
  inptEqmntTitle: "투입장비/공도구",

  // 2. 위험요인 & 감소대책
  subTitle2: "2. 위험요인 & 감소대책",
  rskFctrTitle: "위험요인",
  rskMsrTitle: "감소대책",

  // 3. TBM 첨부파일
  subTitle3: "3. TBM 첨부파일",

  // 4. 참석자
  subTitle4: "4. 참석자",
  qrBtnTitle: "비회원 QR참석",
  attendBtnTitle: "TBM 참석확인",
  userNmTitle: "참석자명",
  regDateTitle: "참석확인일자",
});

let isEditMode = ref(true);
let language = ref("0");

const languageCode = ref([]); //번역언어

var tbmDetailMap = ref({});
// 참석자 list
const tbmAttndList = ref([]);
// 위험요인 & 감소대책 list
const tbmRskDsrsList = ref([]);

// tbm 화면에서 받아온 tbm일자 파라메타
const paramTbmDt = route.params.tbmDt;
const paramRegId = route.params.regId;
const tbmDt = paramTbmDt.split("-").join("");

onMounted(() => {
  //공통코드 불러오기
  // languageCode.value = await toolBoxRegiStore.transLanguageList();  //번역언어

  // 상세 조회
  searchList();

  // qr코드 url 생성
  createQrParams();
});

// 날짜 포멧 변경 함수
const formatDate = (item) => {
  const year = item.slice(0, 4);
  const month = item.slice(4, 6);
  const day = item.slice(6, 8);
  return year + "-" + month + "-" + day;
};

// qr코드 url 생성
function createQrParams() {
  let qrParams =
    "/p=" +
    vendrCd +
    "&" +
    siteCd +
    "&" +
    tbmDt +
    "&" +
    route.params.psitnVendrCd;

  // #TODO : 운영일때 수정
  // qrValue.value = "https://www.naver.com" + qrParams;
  qrValue.value = domain + "SAFE_ACTVT/m-toolBoxMeetingDetail2" + qrParams;
  console.log(
    "domain url",
    domain + "SAFE_ACTVT/m-toolBoxMeetingDetail2" + qrParams
  );
  //   "http://dev.plan2do.co.kr/SAFE_ACTVT/m-toolBoxMeetingDetail2" + qrParams;
}

// #TODO: 개발 테스트를 위함
function testQrCode() {
  let qrParams =
    "p=" + vendrCd + "&" + siteCd + "&" + tbmDt + "&" + psitnVendrCd;

  router.push({
    name: "m-toolBoxMeetingDetail2",
    params: {
      param: qrParams,
    },
    state: {
      prop: {
        vendrCd: vendrCd,
        siteCd: siteCd,
        tbmDt: tbmDt,
        psitnVendrCd: psitnVendrCd,
        userId: userId,
        regId: paramRegId,
      },
    },
  });
  popupClose();
}

// 로그인한 사용자 참석
async function onAttdBtn() {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    tbmDt: tbmDt,
    psitnVendrCd: route.params.psitnVendrCd,
    userId: paramRegId, // tbm 등록자
    userNm: userNm, // Name input값
    attendId: userId,
  };

  const res = await toolBoxRegiStore.saveTbmAttnd(params);
  if (res.data == "OK") {
    searchList(); // 참석 후 참석자 목록 재조회
  } else {
    alert(res.data.message);
  }
}

// 오늘 날짜와 tbm 작성된 날짜가 맞는지 체크
const isTbmToday = ref(false);
const checkTbmDay = (tbmDate) => {
  if (!tbmDate) return;
  const todayMD = dayjs().format("YYYYMMDD");
  if (tbmDate === todayMD) {
    isTbmToday.value = true;
  }
};

// TBM 조회 함수
const isUserAttending = ref(false);
const searchList = async () => {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    tbmDt: tbmDt,
    userId: userId,
    psitnVendrCd: route.params.psitnVendrCd,
  };

  const res = await toolBoxRegiStore.detailSearchToolBox(params);
  tbmDetailMap.value = res;

  // 참석체크시 오늘인지 아닌지 체크
  checkTbmDay(res.tbmDt);

  tbmAttndList.value = tbmDetailMap.value.tbmAttndList;
  // 참석자 목록에서 로그인한 사람이 참석했는지 확인해서 버튼 비활성화 처리
  tbmAttndList.value?.forEach((item) => {
    if (item.attendId == userId) {
      isUserAttending.value = true;
    }
  });
  tbmRskDsrsList.value = tbmDetailMap.value.tbmRskDsrsList;

  tbmDetailMap.value.tbmDt = dayjs(tbmDetailMap.value.tbmDt).format(
    "YYYY-MM-DD"
  );
  tbmDetailMap.value.tbmTime = dayjs(tbmDetailMap.value.tbmTime, "HHmm").format(
    "HH:mm"
  );

  // 첨부파일 정보가 있을때
  if (!cUtil.nullCheck(tbmDetailMap.value.tbmAtchFileList)) {
    imgList.value = tbmDetailMap.value.tbmAtchFileList;
  }
};

const imgList = ref([]);
const onClickDownload = (file) => {
  let link = document.createElement("a");
  let downloadUrl =
    url +
    "/v1/common/getImage?param1=" +
    file.filePath +
    "&param2=" +
    file.fileNm;
  link.href = downloadUrl;
  link.setAttribute("download", file.fileNm);

  // link.download = file.fileNm;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(link);
};

async function onChangeLanguage(langValue) {
  // 선택한 번역언어
  tbmTranslateInfo.value.language = langValue;

  // tbm 정보, 1 작업 및 안전교육
  tbmTranslateInfo.value.tbmNm = tbmDetailMap.value.tbmNm;
  tbmTranslateInfo.value.tbmOrgnsId = tbmDetailMap.value.tbmOrgnsId;
  // tbmTranslateInfo.value.tbmTime = tbmDetailMap.value.tbmTime;

  tbmTranslateInfo.value.wrkNm = tbmDetailMap.value.wrkNm;
  tbmTranslateInfo.value.wrkLoc = tbmDetailMap.value.wrkLoc;
  tbmTranslateInfo.value.wrkDtl = tbmDetailMap.value.wrkDtl;
  tbmTranslateInfo.value.sftEdu = tbmDetailMap.value.sftEdu;
  tbmTranslateInfo.value.inptPsn = tbmDetailMap.value.inptPsn;
  tbmTranslateInfo.value.inptEqmnt = tbmDetailMap.value.inptEqmnt;

  const saveListMap = {
    tbmTranslateInfo: tbmTranslateInfo.value,
    tbmTranslateRskDsrsList: [], //위험대책&감소대책 리스트 {rskFctr: "", dcrsMsr: ""}
    tbmTranslateAttndList: [], //TBM 참석자 리스트 {userNm: ""}
  };

  translateLanguage(saveListMap);
}

// 번역
async function translateLanguage(param) {
  const res = await toolBoxRegiStore.translateTbmList(param);

  // 메인타이틀
  pageTitle.innerText = tbmTranslateInfo.value.mainTitle;
  // tbm 정보
  tbmTranslateInfo.value = res.tbmTranslateInfo;
  tbmDetailMap.value = res.tbmTranslateInfo;

  tbmDetailMap.value.tbmDt = dayjs(tbmDetailMap.value.tbmDt).format(
    "YYYY-MM-DD"
  );
  // tbmDetailMap.value.tbmTime = dayjs(tbmDetailMap.value.tbmTime, "HHmm").format("HH:mm");
}

function popupClose(event) {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("join_qr")[0].classList.remove("show");
}

function qrPopup(event) {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("join_qr")[0].classList.add("show");
}
</script>

<style scoped>
.item_wrap input[type="text"],
.item_wrap input[type="date"],
.item_wrap input[type="time"] {
  width: 100%;
}
.item_wrap.w50p {
  width: calc(50% - 5px);
  margin-right: 10px;
}
.item_wrap.w50p.no_margin {
  margin-right: 0px;
}
.num_subtitle {
  margin-top: 50px;
}
.m_content {
  margin-bottom: 0px;
}
.join_qr {
  width: 300px;
}

.attend_btn_group {
  padding-bottom: 8px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.attend_button {
  width: 100%;
  top: 0px;
  right: 0px;
  height: 32px;
  padding: 0px 20px;
  border: 0px;
  border-radius: 20px;
  font-family: "Pretendard-B";
  font-size: 13px;
  color: #ffffff;
}
.first {
  background-color: #2d3b4b;
  margin-left: 4px;
}

.second {
  background-color: #698ea7;
  margin-right: 4px;
}
</style>
