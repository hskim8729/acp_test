<template>
  <div v-show="tbmBeforeRegShow">
    <div class="item_wrap w100p">
      <span class="p_title">Name</span>
      <input type="text" v-model="userNm" id="idUserNm" />
    </div>
    <div class="item_wrap w100p">
      <span class="p_title">Translate</span>
      <select
        class="w100p"
        v-model="language"
        @change="onChangeLanguage($event.target.value)">
        <option :value="0">== Translate ==</option>
        <option v-for="option in languageCode" :value="option.comCd">
          {{ option.comCdNm }}
        </option>
      </select>
    </div>

    <button class="m_search" @click="onBeforeReg">Go</button>
  </div>

  <!-- (이름,국적 등록 후) TBM 상세보기 START -->
  <div v-show="tbmDetailShow">
    <div class="item_wrap w100p mt30">
      <span class="p_title" v-html="tbmTranslateInfo.tbmNmTitle"></span><br />
      <input type="text" :readonly="isEditMode" v-model="tbmDetailMap.tbmNm" />
    </div>

    <div class="item_wrap w50p">
      <span class="p_title" v-html="tbmTranslateInfo.tbmDtTitle"></span><br />
      <input type="date" :readonly="isEditMode" v-model="formatTbmDt" />
    </div>

    <div class="item_wrap w50p no_margin">
      <span class="p_title" v-html="tbmTranslateInfo.tbmTimeTitle"></span><br />
      <input type="text" :readonly="isEditMode" v-model="formatTbmTime" />
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
        <textarea
          :readonly="isEditMode"
          v-model="tbmDetailMap.wrkNm"></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="p_title" v-html="tbmTranslateInfo.wrkLocTitle"></span
        ><br />
        <textarea
          :readonly="isEditMode"
          v-model="tbmDetailMap.wrkLoc"></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="p_title" v-html="tbmTranslateInfo.wrkDtlTitle"></span
        ><br />
        <textarea
          :readonly="isEditMode"
          v-model="tbmDetailMap.wrkDtl"></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="p_title" v-html="tbmTranslateInfo.sftEduTitle"></span
        ><br />
        <textarea
          :readonly="isEditMode"
          v-model="tbmDetailMap.sftEdu"></textarea>
      </div>
      <div class="item_wrap w50p">
        <span class="p_title" v-html="tbmTranslateInfo.inptPsnTitle"></span
        ><br />
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
      </ul>
      <!-- <ul>
        <li>
          <table v-for="(item, index) in tbmRskDsrsList" :key="index">
            <tr>
              <th v-text="tbmTranslateInfo.rskFctrTitle"></th>
              <td>
                {{ item.rskFctr }}
              </td>
            </tr>
            <tr>
              <th v-text="tbmTranslateInfo.rskMsrTitle"></th>
              <td>
                {{ item.dcrsMsr }}
              </td>
            </tr>
          </table>
        </li>
      </ul> -->
    </div>

    <div class="num_subtitle" v-html="tbmTranslateInfo.subTitle3"></div>
    <div class="m_file_attach">
      <ul>
        <li id="tbmPhotoPreview"></li>
      </ul>
    </div>
  </div>

  <div class="m_page_top_btn" v-show="tbmAttdShow">
    <button @click="onAttdBtn" v-show="attdBtn">Attend</button>
  </div>
</template>

<script setup>
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import commonUtil from "@/utils/common-utils";
import { onMounted, reactive, ref } from "vue";

import dayjs from "dayjs";
import { useRoute } from "vue-router";

const pageTitle = document.getElementsByClassName("m_page_title")[0];
const m_top_menu_btn = document.getElementsByClassName("m_top_menu_btn")[0];
const m_top_home_btn = document.getElementsByClassName("m_top_home_btn")[0];
pageTitle.innerText = "TBM Detail"; // 페이지 타이틀 입력
m_top_menu_btn.remove();
m_top_home_btn.remove();

const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const route = useRoute();

const url = import.meta.env.VITE_APP_API_DEV_URL;

const cUtil = commonUtil;

let tbmBeforeRegShow = ref(true);
let tbmDetailShow = ref(false);
let tbmAttdShow = ref(false);
let attdBtn = ref(true);

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

  // // 4. 참석자
  // "subTitle4": "4. 참석자",
  // "userNmTitle": "참석자명",
  // "regDateTitle": "참석확인일자",
});

const userNm = ref("");

let isEditMode = ref(true);
let language = ref("0");

const languageCode = ref([]); //번역언어

var tbmDetailMap = ref({});
// 참석자 list
const tbmAttndList = ref([]);
// 위험요인 & 감소대책 list
const tbmRskDsrsList = ref([]);

let formatTbmDt = ref("");
let formatTbmTime = ref("");

const propParam = reactive({});

onMounted(async () => {
  // ruter
  const startIdx = route.path.indexOf("=") + 1;
  const splitParam = route.path.substring(startIdx);

  let words = splitParam.split("&");

  propParam.value = {
    vendrCd: words[0],
    siteCd: words[1],
    tbmDt: words[2],
    psitnVendrCd: words[3],
  };

  //공통코드 불러오기
  languageCode.value = await toolBoxRegiStore.transLanguageList(); //번역언어
});

function onBeforeReg() {
  // 이름, 번역 선택 유효성체크
  if (userNm.value == "" || !userNm.value) {
    alert("Please input your name");
    document.getElementById("idUserNm").focus();
    return;
  }

  if (language.value == 0) {
    alert("Please select a language");
    return;
  }

  searchList();
}

// TBM 조회 함수
const searchList = async () => {
  tbmBeforeRegShow.value = false;
  tbmDetailShow.value = true;
  tbmAttdShow.value = true;

  const params = {
    vendrCd: propParam.value.vendrCd,
    siteCd: propParam.value.siteCd,
    tbmDt: propParam.value.tbmDt,
    psitnVendrCd: propParam.value.psitnVendrCd,
  };

  const res = await toolBoxRegiStore.detailSearchToolBox(params);
  tbmDetailMap.value = res;
  tbmAttndList.value = tbmDetailMap.value.tbmAttndList;
  tbmRskDsrsList.value = tbmDetailMap.value.tbmRskDsrsList;

  // 등록자
  propParam.value.userId = tbmDetailMap.value.regId;

  formatTbmDt.value = dayjs(tbmDetailMap.value.tbmDt).format("YYYY-MM-DD");
  formatTbmTime.value = dayjs(tbmDetailMap.value.tbmTime, "HHmm").format(
    "HH:mm"
  );

  // 첨부파일 정보가 있을때
  if (!cUtil.nullCheck(tbmDetailMap.value.tbmAtchFileList)) {
    const atchFileList = tbmDetailMap.value.tbmAtchFileList;
    await detailPreview(atchFileList);
  }

  // 번역
  if (tbmTranslateInfo.value.language != "ko") translateLanguage();
};

// 상세조회 사진 미리보기
const detailPreview = (param) => {
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let div = document.createElement("div");
      let li = document.createElement("li");
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "tbmImgFileU_" + count.fileNm);
      div.textContent = "다운로드";
      div.setAttribute("id", "tbmDivFileU_" + count.fileNm);
      div.setAttribute("class", "file_name");
      div.addEventListener("click", async function () {
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
      });

      document.getElementById("tbmPhotoPreview").appendChild(li);
      li.appendChild(div);
      li.appendChild(img);
    }
  }
};

async function onChangeLanguage(langValue) {
  // 선택한 번역언어
  tbmTranslateInfo.value.language = langValue;
}

// 번역
async function translateLanguage() {
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
    tbmTranslateRskDsrsList: tbmRskDsrsList.value,
  };

  // 번역
  const res = await toolBoxRegiStore.translateTbmList(saveListMap);

  // 메인타이틀
  pageTitle.innerText = tbmTranslateInfo.value.mainTitle;
  // tbm 정보
  tbmTranslateInfo.value = res.tbmTranslateInfo;
  tbmDetailMap.value = res.tbmTranslateInfo;
  tbmRskDsrsList.value = res.tbmTranslateRskDsrsList;
}

async function onAttdBtn() {
  if (!confirm("Would you like to register?")) return;

  const params = {
    vendrCd: propParam.value.vendrCd,
    siteCd: propParam.value.siteCd,
    tbmDt: propParam.value.tbmDt,
    psitnVendrCd: propParam.value.psitnVendrCd,
    userId: propParam.value.userId, // tbm 등록자
    userNm: userNm.value, // Name input값
    // #TODO: 언어코드 칼럼 추가예정?
  };

  const res = await toolBoxRegiStore.saveTbmAttnd(params);
  if (res.data == "OK") {
    alert("success.");
    attdBtn.value = false; // 참석 후 참석버튼 숨기기
  } else {
    alert(res.data.message);
  }
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
</style>
