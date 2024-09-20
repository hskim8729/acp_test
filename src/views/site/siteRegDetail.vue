<!-- 현장등록/현장등록 -->

<template>
  <div class="page_title_area">
    <div class="title">현장정보</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 현장관리 > 현장정보
    </nav>
  </div>

  <div class="page_content_area site_reg_detail">
    <div class="left_side">
      <div class="subtitle_area">
        <span class="title">현장 개요</span>
      </div>

      <div class="content_box" v-if="siteRegDetailInfo">
        <div class="item_wrap w100p pt-3 pb-3 pay_plan_border">
          <v-row>
            <v-col cols="9" class="pt-5">
              <span class="title">구독 멤버쉽</span>
              <span class="pay_plan_icon pr-3" v-if="isSubscr">
                <span :class="payPlanInfo.payInfoDcToLow">{{
                  payPlanInfo.payInfoNm
                }}</span>
              </span>
              <span :class="`${isFailPay ? 'text-red' : ''} font-preM`"
                >{{ payPlanInfo.payInfoNmKor }}
                {{
                  siteRegDetailInfo.subscrType === "T2503"
                    ? ` (~${dayjs(siteRegDetailInfo.subscrEndDt).format(
                        "YYYY.MM.DD"
                      )})`
                    : ""
                }}</span
              >
            </v-col>
            <v-col cols="3">
              <comp-button
                text="구독"
                @click="clickPayPlan('C')"
                class="right_btn"
                density="default"
                v-show="showSubscr && isAdmin()">
              </comp-button>
              <comp-button
                text="멤버쉽 관리"
                @click="clickPayPlan('R')"
                class="right_btn btn_default"
                density="default"
                v-show="showMgmPayPlan && isAdmin()">
              </comp-button>
            </v-col>
          </v-row>
        </div>
        <div class="item_wrap w100p">
          <span class="title">현장명</span>
          <input type="text" v-model="siteRegDetailInfo.siteNm" id="idSiteNm" />
        </div>
        <div class="item_wrap w33p">
          <span class="title">현장코드</span>
          <input
            type="text"
            v-model="siteRegDetailInfo.siteCd"
            :disabled="true" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">공사기간</span>
          <input
            type="date"
            v-model="siteRegDetailInfo.constStDt"
            id="fromTbmDt" />
          <span> ~ </span>
          <input
            type="date"
            v-model="siteRegDetailInfo.constEnDt"
            id="toTbmDt" />
        </div>

        <div class="item_wrap w33p">
          <span class="title">공사유형</span>
          <select v-model="siteRegDetailInfo.constType">
            <option v-for="option in constTypeCode" v-bind:value="option.comCd">
              {{ option.comCdNm }}
            </option>
          </select>
        </div>
        <div class="item_wrap w33p">
          <span class="title">공사구분</span>
          <select v-model="siteRegDetailInfo.constCls">
            <option v-for="option in constClsCode" :value="option.comCd">
              {{ option.comCdNm }}
            </option>
          </select>
        </div>
        <div class="item_wrap w33p">
          <span class="title">지역</span>
          <select v-model="siteRegDetailInfo.area">
            <option v-for="option in areaCode" :value="option.comCd">
              {{ option.comCdNm }}
            </option>
          </select>
        </div>

        <div class="item_wrap w50p">
          <span class="title">안전관리자</span>
          <input
            type="text"
            class="search_input"
            v-model="siteRegDetailInfo.mngUserNm"
            :disabled="true" />
          <!-- <button class="search_btn" @click="addMgmtUser"></button> -->
        </div>

        <div class="item_wrap w50p">
          <span class="title">발주처</span>
          <input type="text" v-model="siteRegDetailInfo.odr" />
        </div>
        <div class="item_wrap w100p">
          <span class="title">공사금액</span>
          <input
            type="text"
            v-model="siteRegDetailInfo.constAmt"
            style="text-align: right"
            @input="cUtil.onInputCommaNum($event)" />
        </div>

        <div class="item_wrap w33p">
          <span class="title">현장주소</span>
          <input
            type="text"
            class="search_input"
            v-model="siteRegDetailInfo.siteZip"
            placeholder="우편번호"
            :disabled="true" />
          <button class="search_btn" @click="execDaumPostcode()"></button>
        </div>
        <div class="item_wrap w66p">
          <input
            type="text"
            class="address_road"
            v-model="siteRegDetailInfo.siteRoadNm"
            placeholder="도로명"
            :disabled="true" />
        </div>
        <!-- <div class="item_wrap w100p">
          <input
            type="text"
            class="address"
            v-model="siteRegDetailInfo.siteLnm"
            placeholder="지번"
            :disabled="true"
          />
        </div> -->
        <div class="item_wrap w100p">
          <input
            type="text"
            class="address"
            v-model="siteRegDetailInfo.siteDaddr"
            placeholder="상세주소" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">전화번호</span>
          <input
            type="text"
            v-model="siteRegDetailInfo.crryTelNo"
            @input="cUtil.regexType($event, 'localTelNo')"
            @blur="cUtil.chkCrryTelNo($event)"
            maxlength="13"
            placeholder="현장 대표 전화번호를 입력하세요" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">현장개요</span>
          <textarea v-model="siteRegDetailInfo.siteDsc"></textarea>
        </div>

        <div class="item_wrap w100p">
          <span class="title">현장사진</span>
          <div class="photo" id="sitePhotoPreview">
            <input
              id="siteFile"
              type="file"
              multiple
              class="w100p"
              name="file"
              @change="fileList"
              accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
              hidden />
            <button @click="onClickUpload" class="file_attach">
              파일 첨부
            </button>
          </div>
        </div>

        <div class="item_wrap w100p">
          <span class="title">진행여부</span>
          <div
            :class="
              siteRegDetailInfo.useYn == 'N' ? 'switch off' : 'switch on'
            ">
            <div class="click_area" @click="switchItem"></div>
            <div class="dot"></div>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="right_side">
      <div class="subtitle_area">
        <span class="title">현장 인력 정보</span>
        <div class="right_btn">
          <comp-button
            @click="popupSearchUser()"
            type="add"
            requiredAuth></comp-button>
          <comp-button
            @click="onSaveCheckedButton()"
            type="save"
            requiredAuth></comp-button>
          <router-link to="/SITE/siteReg">
            <comp-button v-if="isAdmin()" type="list"></comp-button>
          </router-link>
        </div>
      </div>

      <div class="grid_default3" id="grid01">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :headerHeight="40"
          :rowHeight="53"
          :columnDefs="columnDefs1"
          :rowData="grid1RowData"
          :defaultColDef="defaultColDef"
          :singleClickEdit="true"
          :undoRedoCellEditing="true"
          :undoRedoCellEditingLimit="20"
          :localeText="localeText"
          @grid-ready="onGridReady"
          :stopEditingWhenCellsLoseFocus="true">
        </ag-grid-vue>
      </div>
    </div>
  </div>

  <!-- 안전관리자 등록 팝업 -->
  <popMngtUser @check="getUserNmData"></popMngtUser>

  <!-- 직원정보 사용자등록 팝업 -->
  <popSearchUser
    :selectEmpList="selectEmpList"
    @userInfo="getUserData"></popSearchUser>

  <!-- 멤버쉽 팝업 -->
  <popPayPlan
    :siteInfo="siteRegDetailInfo"
    :isPopPayPlan="isPopPayPlan"
    @close="closePopPayPlan"
    v-if="isPopPayPlan">
  </popPayPlan>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { ref, onBeforeMount, onMounted, onErrorCaptured } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import dayjs from "dayjs";

import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

import popPayPlan from "@/views/payPlan/popPayPlan.vue";
import popSearchUser from "@/views/siteReg/popSearchUser.vue"; // 직원정보 추가 팝업
import popMngtUser from "@/views/site/popMngtUser.vue"; // 안전관리자 팝업

import commonUtil from "@/utils/common-utils";
import siteRegDetailService from "@/api/services/site/site-reg-detail-service";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteRegStore } from "@/stores/site/site-reg-store";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import { usePayPlanStore } from "@/stores/payPlan/pay-plan-store";

const loginStore = useLoginAuthStore();
const siteRegDetailStore = useSiteRegDetailStore();
const siteRegStore = useSiteRegStore();
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const payPlanStore = usePayPlanStore();
const dialogStore = useDialogStore();

const cUtil = commonUtil;

// 현장 목록에서 받아온 회사코드, 현장코드
const { dataObj } = history.state;

const constTypeCode = ref([]); //공사유형
const constClsCode = ref([]); //공사구분
const areaCode = ref([]); //지역

// 직원정보 > 직책, 권한 코드 list
const jbttlCdList = ref({ "0000": "[선택필수]" });
const lowerjbttlCdList = ref({ "0000": "[선택필수]" });
const lowerJbttlCd = ["T0104", "T0105"];
const authSeqList = ref({ "0000": "[선택필수]" });
const lowerAuthSeqList = ref({ "0000": "[선택필수]" });
const lowerAuthSeq = ["5000", "6000"];

const gridApi = ref();
const grid1RowData = ref([]);
const localeText = { noRowsToShow: "조회 결과가 없습니다." };

const showMgmPayPlan = ref(false);
const showSubscr = ref(false);
const isSubscr = ref(false);
const isFailPay = ref(false);

const selectEmpList = ref([]);

var siteRegDetailInfo = ref({});

let formData = new FormData();

const mngUserNm = ref("");
const mngUserObj = ref({});

const route = useRoute();

const userData = ref([]);
var fchParams = {};
let upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;

if (dataObj && dataObj.vendrCd) {
  fchParams = {
    vendrCd: dataObj.vendrCd,
    siteCd: dataObj.siteCd,
    userId: loginStore.$state.userInfo.userId,
  };

  loginStore.$patch({ selectSiteInfo: fchParams });
} else if (
  loginStore.$state.selectSiteInfo &&
  loginStore.$state.selectSiteInfo.vendrCd
) {
  fchParams = {
    vendrCd: loginStore.$state.selectSiteInfo.vendrCd,
    siteCd: loginStore.$state.selectSiteInfo.siteCd,
    userId: loginStore.$state.selectSiteInfo.userId,
  };
} else {
  fchParams = {
    vendrCd: loginStore.$state.siteInfo.vendrCd,
    siteCd: loginStore.$state.siteInfo.siteCd,
    userId: loginStore.$state.userInfo.userId,
  };
}

onBeforeMount(async () => {
  // 공통코드 불러오기
  await siteRegStore.comCodesList();
  constTypeCode.value = siteRegStore.$state.constTypeList; //공사유형
  constClsCode.value = siteRegStore.$state.constclsList; //공사구분
  areaCode.value = siteRegStore.$state.areaList; //지역

  // 직책코드
  await siteRegDetailStore.selectJbttlCdList();
  const getJbttlCdList = siteRegDetailStore.getJbttlCdList;
  getJbttlCdList.forEach((item) => {
    if (lowerJbttlCd.includes(item.comCd)) {
      // 협력사 직원 작책 코드 리스트
      lowerjbttlCdList.value[item.comCd] = item.comCdNm;
    }
    // 모회사 직원 직책 코드 리스트
    jbttlCdList.value[item.comCd] = item.comCdNm;
  });

  // 권한코드
  await siteRegDetailStore.selectAuthList({ vendrCd: fchParams.vendrCd });
  const getAuthSeqList = siteRegDetailStore.getAuthList;
  getAuthSeqList.forEach((item) => {
    if (lowerAuthSeq.includes(item.authId)) {
      // 협력사 직원 권한 코드 리스트
      lowerAuthSeqList.value[item.authId] = item.authNm;
    }
    // 모회사 직원 권한 코드 리스트
    authSeqList.value[item.authId] = item.authNm;
  });

  if (route.query.status) {
    // 멤버쉽 가입 후처리
    await afterPay();
  }

  doSearch();
});

const isAdmin = () => {
  // 구독/멤버쉽관리/목록 버튼은 관리자만 조회
  return loginStore.$state.userInfo.admAcctYn == "Y";
};

onMounted(() => {});

onErrorCaptured((error, vm, info) => {
  console.log("===========에러발생==========");
  console.log(error);
  console.log(vm);
  console.log(info);
  return false;
});

const isPopPayPlan = ref(false);

// 구독 팝업 호출
const clickPayPlan = async (status) => {
  // 구독 webhook이 늦게 들어와서 데이터 동기화를 위해 현장정보 조회
  await searchSiteOverview();
  const siteInfo = siteRegDetailInfo.value;

  let isTrialSite = siteInfo.payInfoDc === "TRIAL";
  let isCustomSite = siteInfo.payInfoDc === "CUSTOM";
  let isChange = false;
  let isCancel = false;

  // 관리화면은 구독ID가 있는지 체크
  if (
    status === "R" &&
    !isTrialSite &&
    !isCustomSite &&
    !siteInfo.apiSubscrId
  ) {
    dialogStore.openAlertDialog(
      "구독이 생성중입니다. 잠시 후 다시 시도해주세요."
    );
    return false;
  }

  // 멤버쉽 변경 해지 상태 조회
  switch (siteInfo.subscrType) {
    case "T2502": // 변경
      isChange = !isTrialSite ? true : false;
      break;
    case "T2503": // 해지
      isCancel = true;
      break;
  }

  siteInfo.subscrStatus = status;
  siteInfo.isSubscrChange = isChange;
  siteInfo.isSubscrCancel = isCancel;

  isPopPayPlan.value = true;
};

// 구독 팝업 닫기
const closePopPayPlan = (isReload, msg) => {
  isPopPayPlan.value = false;

  if (msg) {
    dialogStore.openToastDialog(msg);
  }

  if (isReload) {
    searchSiteOverview();
  }
};

// STEP PAY 결제 후 처리
const afterPay = async () => {
  const status = route.query.status;
  const orderId = route.query.order_id;

  // 결과 전송
  if (status == "success") {
    dialogStore.openToastDialog("멤버쉽 등록에 성공하였습니다.");
  } else {
    dialogStore.openAlertDialog(
      `멤버쉽 등록에 실패하였습니다<br>관리자에게 문의하세요.<br><br>주문 ID : ${orderId}`,
      {
        type: "error",
        callback: () => {
          router.push({
            name: "siteRegDetailPage",
          });
        },
      }
    );
  }
};

async function doSearch() {
  const siteOverview = await searchSiteOverview();

  //직원정보 조회
  selectEmpList.value = await siteRegDetailStore.fetchselectEmpList(fchParams);
  grid1RowData.value = selectEmpList.value;

  const atchFileKey = siteOverview.selectSiteOverview.atchFileKey;

  // 첨부파일이 있을때
  if (!cUtil.nullCheck(atchFileKey)) {
    const atchFileList = siteOverview.selectSiteOverview.atchFileList;
    detailPreview(atchFileList);
  }
}

const searchSiteOverview = async () => {
  //현장 목록 상세 조회
  const siteOverview = await siteRegDetailStore.fetchselectSiteOverview(
    fchParams
  );

  //등록 된 현장이 없는 경우 -> 메인화면으로 이동
  if (siteOverview.selectSiteOverview == null) {
    dialogStore.openAlertDialog("등록된 현장이 없습니다.", {
      callback: () => {
        router.push({
          path: "/main",
        });
      },
    });
    return false;
  }

  siteRegDetailInfo.value = siteOverview.selectSiteOverview;

  // 공사금액 콤마포함 조회
  siteRegDetailInfo.value.constAmt = cUtil.comma(
    siteRegDetailInfo.value.constAmt
  );
  siteRegDetailInfo.value.crryTelNo = siteRegDetailInfo.value.crryTelNo
    .replaceAll("-", "")
    .replace(/(^02|^0504|^0505|^0\d{2})(\d+)?(\d{4})$/, "$1-$2-$3")
    .replace(/(\-{1,2})$/g, "");

  mngUserNm.value = siteRegDetailInfo.value.siteMngr;

  // 멤버쉽 관련 처리
  await setPayPlan();

  return siteOverview;
};

const payPlanInfo = ref({});
const setPayPlan = async () => {
  // 표준 멤버쉽 조회 (store 저장용)
  await payPlanStore.selectSitePayPlcyList(fchParams);

  const payInfoDc = siteRegDetailInfo.value.payInfoDc;
  const payInfoNm = siteRegDetailInfo.value.payInfoNm;
  const payStatus = siteRegDetailInfo.value.payStatus; // 결제 성공 여부 (FAILED: 실패, COMPLETE: 성공)
  const subscrUseYn = siteRegDetailInfo.value.subscrUseYn; // 구독여부 (Y: 구독생성, N: 구독생성실패)

  // 버튼 초기화
  isSubscr.value = false;
  isFailPay.value = false;
  showSubscr.value = false;
  showMgmPayPlan.value = false;

  let payInfoNmKor = "";

  if (!payInfoDc) {
    payInfoNmKor = "구독중인 멤버쉽이 없습니다.";
    showSubscr.value = true;
  } else {
    payPlanInfo.value.payInfoDc = payInfoDc;
    payPlanInfo.value.payInfoNm = payInfoNm;
    payPlanInfo.value.payInfoDcToLow = payInfoDc.toLowerCase();

    payInfoNmKor = commonUtil.getPayInfoNmKor(payInfoDc);

    // 구독중
    if (subscrUseYn === "Y") {
      isSubscr.value = true;
      payInfoNmKor = `${payInfoNmKor} 멤버쉽`;
      showMgmPayPlan.value = true;
    }
    // 구독 결제 진행 중 완료하지 않고 팝업 닫은 경우(미구독)
    else if (!payStatus || payStatus === "") {
      payInfoNmKor = "구독중인 멤버쉽이 없습니다.";
      showSubscr.value = true;
    }
    // 결제실패
    else if (payStatus === "FAIL") {
      payInfoNmKor = `${payInfoNmKor} 멤버쉽 결제에 실패하였습니다. 관리자에게 문의하세요.`;
      isFailPay.value = true;
    }
    // 구독생성 중 원인모를 실패
    else {
      payInfoNmKor = `구독 생성에 실패하였습니다. 관리자에게 문의하세요.`;
      isFailPay.value = true;
    }
  }

  payPlanInfo.value.payInfoNmKor = payInfoNmKor;
};

// 주소검색
function execDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      if (siteRegDetailInfo.value.siteDaddr !== "") {
        siteRegDetailInfo.value.siteDaddr = "";
      }

      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        siteRegDetailInfo.value.siteRoadNm = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        siteRegDetailInfo.value.siteRoadNm = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      // if (data.userSelectedType === "R") {
      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      // if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
      //   siteRegDetailInfo.value.siteDaddr += data.bname;
      // }
      // // 건물명이 있고, 공동주택일 경우 추가한다.
      // if (data.buildingName !== "" && data.apartment === "Y") {
      //   siteRegDetailInfo.value.siteDaddr +=
      //     siteRegDetailInfo.value.siteDaddr !== ""
      //       ? `, ${data.buildingName}`
      //       : data.buildingName;
      // }
      // // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      // if (siteRegDetailInfo.value.siteDaddr !== "") {
      //   siteRegDetailInfo.value.siteDaddr = `(${siteRegDetailInfo.value.siteDaddr})`;
      // }
      // } else {
      //   this.siteRegDetailInfo.siteDaddr = "";
      // }
      // 우편번호를 입력한다.
      siteRegDetailInfo.value.siteZip = data.zonecode;
    },
  }).open();
}

// 사용여부
function switchItem(event) {
  if (event.target.parentElement.classList.contains("on")) {
    event.target.parentElement.classList.replace("on", "off");
    siteRegDetailInfo.value.useYn = "N";
  } else {
    event.target.parentElement.classList.replace("off", "on");
    siteRegDetailInfo.value.useYn = "Y";
  }
}

// 첨부파일 START >>
// 첨부파일> 파일 버튼 실행
// 상세조회 사진 미리보기
const detailPreview = (param) => {
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      let button = document.createElement("button");
      let div = document.createElement("div");
      div.setAttribute("id", "siteDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "siteImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "siteSpanFileU_" + count.fileNm);
      span.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await toolBoxRegiStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      button.setAttribute("class", "del");
      button.setAttribute("id", "siteBtnFileU_" + count.fileNm);
      button.onclick = function () {
        dialogStore.openConfirmDialog("삭제하시겠습니까?", {
          confirmCallback: () => {
            detailDeleteFile(count);
          },
        });
      };

      document.getElementById("sitePhotoPreview").appendChild(div);
      div.appendChild(button);
      div.appendChild(span);
      div.appendChild(img);

      //upLoadFileList.value = [...upLoadFileList.value, count];
    }
  }
};

// 상세보기 파일 삭제
const detailDeleteFile = async (data) => {
  const imgToDelete = document.getElementById("siteImgFileU_" + data.fileNm);
  const spanToDelete = document.getElementById("siteSpanFileU_" + data.fileNm);
  const buttonToDelete = document.getElementById("siteBtnFileU_" + data.fileNm);
  const divToDelete = document.getElementById("siteDivFileU_" + data.fileNm);

  if (imgToDelete) {
    imgToDelete.remove();
  }
  if (spanToDelete) {
    spanToDelete.remove();
  }
  if (buttonToDelete) {
    buttonToDelete.remove();
  }
  if (divToDelete) {
    divToDelete.remove();
  }

  const param = {
    vendrCd: fchParams.vendrCd,
    atchFileKey: data.atchFileKey,
    fileSeq: data.fileSeq,
    fileNm: data.fileNm,
    filePath: data.filePath,
    userId: fchParams.userId,
  };

  // 첨부파일 삭제
  await siteRegDetailStore.deleteFileSiteOverview(param);

  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
};

// 첨부파일> 첨부파일 등록
const onClickUpload = () => {
  let myInput = document.getElementById("siteFile");
  myInput.click();
};

// 첨부파일> 파일 저장 함수
const fileList = (e) => {
  const files = [...e.target.files];
  upLoadFileList.value = [...upLoadFileList.value, ...files];
  e.target.value = "";
  drawPreview(upLoadFileList.value);
};

// 첨부파일> 파일 프리뷰 함수
const drawPreview = (files) => {
  deletePreview();
  files.forEach((file) => {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        let img = document.createElement("img");
        let button = document.createElement("button");
        let div = document.createElement("div");
        div.setAttribute("id", "siteDivFileI_" + file.name);
        img.setAttribute("src", e.target.result);
        img.setAttribute("id", "siteImgFileI_" + file.name);
        button.setAttribute("class", "del");
        button.setAttribute("id", "siteBtnFileI_" + file.name);
        button.onclick = function () {
          saveDeleteFile(file);
        };

        document.getElementById("sitePhotoPreview").appendChild(div);
        div.appendChild(button);
        div.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
    // 파일 formData 저장
  });
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = (data) => {
  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  deletePreview();
  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
  drawPreview(upLoadFileList.value);
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview = () => {
  const imgElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteImgFileI"]');

  const btnElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteBtnFileI"]');

  const divElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteDivFileI"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 첨부파일 이미지 새로고침
const refreshPreview = () => {
  const imgElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteImgFileU"]');

  const spanElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteSpanFileU"]');

  const btnElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteBtnFileU"]');

  const divElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteDivFileU"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  spanElement.forEach((span) => {
    span.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};
// << 첨부파일 END

// 유효성 체크
function validation() {
  // 날짜 유효성 체크를 위함
  const fromTbmDt = document
    .getElementById("fromTbmDt")
    .value.split("-")
    .join("");
  const toTbmDt = document.getElementById("toTbmDt").value.split("-").join("");

  let targetIdx = 0;
  let jbttlCd1Cnt = 0;
  let jbttlCd2Cnt = 0;
  let authCd1Cnt = 0;
  let authCd2Cnt = 0;

  try {
    // 현장 등록 수정 유효성 검사
    // if (!isSubscr.value) {
    //   throw {
    //     message: "멤버쉽 구독 후 저장이 가능합니다.",
    //     check: "site",
    //   };
    // }
    //시작일자>종료일자 체크
    if (toTbmDt < fromTbmDt) {
      throw {
        message: "시작일자가 종료일자보다 클 수 없습니다.",
        check: "site",
      };
    }

    // 현장명 체크
    if (!siteRegDetailInfo.value.siteNm) {
      throw {
        field: "idSiteNm",
        message: "현장명을 입력해 주세요.",
        check: "site",
      };
    }

    // 공사 시작기간 체크
    if (!fromTbmDt) {
      throw {
        field: "fromTbmDt",
        message: "공사 시작기간을 입력해 주세요.",
        check: "site",
      };
    }

    // 공사 종료기간 체크
    if (!toTbmDt) {
      throw {
        field: "toTbmDt",
        message: "공사 종료기간을 입력해 주세요.",
        check: "site",
      };
    }

    // 안전관리자 체크
    if (!siteRegDetailInfo.value.siteMngr) {
      throw {
        message: "안전관리자를 추가 해주세요.",
      };
    }

    let totalFileSize = 0;
    if (
      Array.isArray(upLoadFileList.value) &&
      upLoadFileList.value.length > 0
    ) {
      for (let file of upLoadFileList.value) {
        totalFileSize += file.size;
        if (1024 * 1024 * 10 < totalFileSize) {
          throw {
            message: "10MB 사이즈 미만만 업로드가 가능합니다.",
          };
        }
      }
    }

    // 직원정보 유효성 검사
    gridApi.value.forEachNode((obj, idx) => {
      targetIdx = idx;

      // 권한 체크
      if (obj.data.authCd == "0000") {
        throw {
          field: "authCd",
          message: "권한을 입력해 주세요.",
          check: "emp",
        };
      }

      // 직책 체크
      if (obj.data.jbttlCd == "0000") {
        throw {
          field: "jbttlCd",
          message: "직책을 입력해 주세요.",
          check: "emp",
        };
      }

      // 현장소장 체크
      if (obj.data.jbttlCd == "T0101") {
        jbttlCd1Cnt++;
        if (jbttlCd1Cnt > 1) {
          throw {
            field: "jbttlCd",
            message: "현장소장을 한명만 선택해 주세요.",
            check: "emp",
          };
        }
      }
      if (obj.data.authCd == "2000") {
        authCd1Cnt++;
        if (authCd1Cnt > 1) {
          throw {
            field: "authCd",
            message: "현장소장을 한명만 선택해 주세요.",
            check: "emp",
          };
        }
      }

      // 안전관리자 체크
      if (obj.data.jbttlCd == "T0102") {
        jbttlCd2Cnt++;
        if (jbttlCd2Cnt > 1) {
          throw {
            field: "jbttlCd",
            message: "안전관리자를 한명만 선택해 주세요.",
            check: "emp",
          };
        }
      }
      if (obj.data.authCd == "3000") {
        authCd2Cnt++;
        if (authCd2Cnt > 1) {
          throw {
            field: "authCd",
            message: "안전관리자를 한명만 선택해 주세요.",
            check: "emp",
          };
        }
      }
      if (obj.data.authCd == "3000" && obj.data.jbttlCd != "T0102") {
        throw {
          message:
            "안전관리자 등록 시 직책과 메뉴권한을 동일하게 입력해주세요.",
        };
      }
      if (obj.data.authCd != "3000" && obj.data.jbttlCd == "T0102") {
        throw {
          message:
            "안전관리자 등록 시 직책과 메뉴권한을 동일하게 입력해주세요.",
        };
      }
    });
  } catch (error) {
    if (error.field) {
      if (error.check == "emp")
        gridApi.value.setFocusedCell(targetIdx, error.field, null);
      if (error.check == "site") document.getElementById(error.field).focus();
    }
    dialogStore.openAlertDialog(error.message, { type: "error" });

    return true;
  }

  return false;
}

// 저장> 현장등록, 직원등록 저장
const onSaveCheckedButton = async () => {
  if (validation()) return;

  const params = createFormData();

  dialogStore.openConfirmDialog("저장하시겠습니까?", {
    confirmCallback: async () => {
      try {
        const res = await siteRegDetailStore.fetchSiteDetailSave(params);
        if (res.data == "OK") {
          dialogStore.openToastDialog("정상적으로 처리하였습니다.");
          doSearch();
          deleteInput();
        } else {
          dialogStore.openAlertDialog(res.data.message, { type: "error" });
          doSearch();
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });
};

// 저장> 저장 정보
const createFormData = () => {
  siteRegDetailInfo.value.userId = fchParams.userId;
  siteRegDetailInfo.value.siteCd = fchParams.siteCd;

  siteRegDetailInfo.value.constAmt = siteRegDetailInfo.value.constAmt
    .split(",")
    .join("");

  let newEmpList = [];
  let mode = "";

  // 직원 정보
  gridApi.value.forEachNode((obj, idx) => {
    if (obj.data.mode != "I") mode = "U";
    else mode = "I";

    let empInfo = {
      mode: mode,
      vendrCd: fchParams.vendrCd,
      psitnVendrCd: obj.data.psitnVendrCd,
      siteCd: fchParams.siteCd,
      userId: obj.data.userId,
      userNm: obj.data.userNm,
      authCd: obj.data.authCd,
      jbttlCd: obj.data.jbttlCd,
      actvStDt: dayjs(siteRegDetailInfo.value.constStDt).format("YYYYMMDD"),
      actvEnDt: dayjs(siteRegDetailInfo.value.constEnDt).format("YYYYMMDD"),
    };

    newEmpList.push(empInfo);
  });

  const params = {
    siteOpenInfo: { ...siteRegDetailInfo.value },
    empList: newEmpList,
  };

  newEmpList.forEach((item) => {
    if (item.authCd == "3000" && item.jbttlCd == "T0102") {
      params.siteOpenInfo.mngUserNm = item.userNm;
      params.siteOpenInfo.siteMngr = item.userId;
    }
  });

  // 현장 등록 FormData 추가
  formData.append(
    "params",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  // 첨부파일 FormData 추가
  if (Array.isArray(upLoadFileList.value) && upLoadFileList.value.length > 0) {
    upLoadFileList.value.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  return formData;
};

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  document.getElementById("siteFile").value = "";
  upLoadFileList.value = "";

  const imgElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll("img");

  const spanElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll("span");

  const btnElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteBtnFile"]');

  const divElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll("div");

  imgElement.forEach((img) => {
    img.remove();
  });
  spanElement.forEach((span) => {
    span.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
}

const onGridReady = (params) => {
  gridApi.value = params.api;
};

function extractKeys(mappings) {
  return Object.keys(mappings);
}
function lookupValue(mappings, key) {
  return mappings[key];
}

const columnDefs1 = [
  {
    headerName: "회사명",
    field: "vendrNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 150,
    maxWidth: 200,
  },
  {
    headerName: "성명",
    field: "userNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 100,
    maxWidth: 180,
  },
  {
    headerName: "직위",
    field: "workNm",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
  },
  {
    headerName: "연락처",
    field: "crryTelNo",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 150,
    maxWidth: 200,
  },
  {
    headerName: "이메일",
    field: "userId",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 220,
    maxWidth: 500,
  },
  {
    headerName: "*직책",
    field: "jbttlCd",
    width: "110px",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      let isLower = true;
      if (
        params.data.psitnVendrCd === params.data.vendrCd ||
        params.data.psitnVendrCd === fchParams.vendrCd
      ) {
        isLower = false;
      }
      return {
        values: isLower
          ? extractKeys(lowerjbttlCdList.value)
          : extractKeys(jbttlCdList.value),
        defaultValue: "0000",
      };
    },
    filterParams: {
      valueFormatter: (params) => {
        return lookupValue(jbttlCdList.value, params.value);
      },
    },
    valueFormatter: (params) => {
      return lookupValue(jbttlCdList.value, params.value);
    },
  },
  {
    headerName: "*메뉴권한",
    field: "authCd",
    width: "120px",
    filter: true,
    cellStyle: { textAlign: "center" },
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => {
      let isLower = true;
      if (
        params.data.psitnVendrCd === params.data.vendrCd ||
        params.data.psitnVendrCd === fchParams.vendrCd
      ) {
        isLower = false;
      }
      return {
        values: isLower
          ? extractKeys(lowerAuthSeqList.value)
          : extractKeys(authSeqList.value),
        defaultValue: "0000",
      };
    },
    filterParams: {
      valueFormatter: (params) => {
        return lookupValue(authSeqList.value, params.value);
      },
    },
    valueFormatter: (params) => {
      return lookupValue(authSeqList.value, params.value);
    },
  },
  {
    headerName: "삭제",
    field: "del",
    filter: false,
    cellStyle: { textAlign: "center" },
    editable: false,
    width: 80,
    maxWidth: 80,
    cellRenderer: (params) => {
      const eDiv = document.createElement("div");
      eDiv.classList.add("cell_center");
      eDiv.innerHTML = '<button class="del"></button>';
      const eButton = eDiv.querySelectorAll(".del")[0];

      eButton.onclick = function () {
        removeRow(params);
      };

      return eDiv;
    },
  },
];

const defaultColDef = {
  editable: true,
  sortable: true,
  minWidth: 50,
  filter: false,
  resizable: true,
  headerClass: "centered",
  cellClass: "centered",
};

//안전관리자 팝업에서 가져온 데이터
async function getUserNmData(data) {
  mngUserObj.value = data;
  siteRegDetailInfo.value.mngUserNm = mngUserObj.value.userNm;
  siteRegDetailInfo.value.siteMngr = mngUserObj.value.userId;
}

// 직원 조회 팝업에서 받아온 데이터
function getUserData(data) {
  userData.value = data;

  userData.value.forEach((item, index) => {
    let chk = false;
    // 직원정보 리스트에서 중복된 데이터 체크
    gridApi.value.forEachNode((obj) => {
      if (obj.data.userId == item.userId && obj.data.userNm == item.userNm) {
        chk = true;
        return chk;
      }
    });

    if (!chk) {
      const newItems = [
        {
          mode: "I",
          psitnVendrCd: item.vendrCd,
          vendrNm: item.vendrNm,
          userId: item.userId,
          userNm: item.userNm,
          workNm: item.workNm,
          crryTelNo: item.crryTelNo,
          jbttlCd: "0000",
          authCd: "0000",
        },
      ];
      gridApi.value.applyTransaction({
        add: newItems,
        addIndex: index,
      });
    }
  });
}

//안전관리자 팝업
function addMgmtUser() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("popup mgmt_user")[0].classList.add("show");
}

// 직원정보 추가 -담당자 선택 팝업
function popupSearchUser() {
  if (!isSubscr.value) {
    dialogStore.openAlertDialog("멤버쉽 구독 후 인력 추가가 가능합니다.");
    return false;
  }
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("popup search_user")[0].classList.add("show");
}

// 직원정보 삭제
async function removeRow(params) {
  const selectedData = [params.data];

  if (selectedData[0].mode == "I") {
    gridApi.value.applyTransaction({ remove: selectedData });
  } else {
    dialogStore.openConfirmDialog("삭제하시겠습니까?", {
      confirmCallback: async () => {
        try {
          selectedData[0].mode = "D";
          const res = await siteRegDetailService.deleteSiteOverview(
            selectedData[0]
          );

          if (res.data == "OK") {
            dialogStore.openToastDialog("정상적으로 처리하였습니다.");
            doSearch();
            deleteInput();
          } else {
            dialogStore.openAlertDialog(res.data.message, { type: "error" });
          }
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    });
  }
}
</script>

<style scoped>
.left_side {
  float: left;
  width: 760px;
  height: 100%;
  margin-right: 40px;
}
.right_side {
  float: left;
  width: calc(100% - 800px);
  height: 100%;
}
#grid01 {
  height: calc(100% - 40px);
}
.content_box {
  height: calc(100% - 40px);
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.item_wrap input[type="date"] {
  width: 150px;
}
.item_wrap .address {
  margin-left: 100px;
}
.item_wrap .photo {
  display: inline-block;
  width: calc(100% - 100px);
  vertical-align: middle;
}

.item_wrap .reviewPhoto img {
  width: 300px;
  height: 200px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.item_wrap .photo img {
  width: 100px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.item_wrap input,
.item_wrap select,
.item_wrap textarea {
  width: calc(100% - 100px);
}
.item_wrap button.file_attach {
  margin-left: 0px;
}
.switch {
  margin: 4px 0px;
}
.mgmt_user {
  width: 520px;
  height: 585px;
}
.item_wrap input.address_road {
  width: calc(100% - 10px);
  margin-left: 10px;
}
.popup.search_user {
  width: 50%;
  height: 50%;
}
</style>
