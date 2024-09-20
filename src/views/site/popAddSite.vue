<!-- 현장등록/현장등록/팝업-현장등록 -->

<template>
  <div class="popup add_site">
    <div class="popup_title">
      <span>현장 등록</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="content_box">
        <div class="item_wrap w66p">
          <span class="title">현장명</span>
          <input type="text" v-model="siteRegInfo.siteNm" id="idSiteNm" />
        </div>
        <div class="item_wrap w33p">
          <span class="title">현장코드</span>
          <!-- <input type="text" v-model="siteRegInfo.siteCd" :disabled="true"> -->
          <input type="text" v-model="newSiteCd" :disabled="true" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">공사기간</span>
          <input type="date" v-model="siteRegInfo.constStDt" id="fromTbmDt" />
          <span> ~ </span>
          <input type="date" v-model="siteRegInfo.constEnDt" id="toTbmDt" />
        </div>

        <div class="item_wrap w33p">
          <span class="title">공사유형</span>
          <select v-model="siteRegInfo.constType">
            <option value="">{{ "[필수선택]" }}</option>
            <option v-for="option in constTypeCode" :value="option.comCd">
              {{ option.comCdNm }}
            </option>
          </select>
        </div>
        <div class="item_wrap w33p">
          <span class="title">공사구분</span>
          <select v-model="siteRegInfo.constCls">
            <option value="">{{ "[필수선택]" }}</option>
            <option v-for="option in constClsCode" :value="option.comCd">
              {{ option.comCdNm }}
            </option>
          </select>
        </div>
        <div class="item_wrap w33p">
          <span class="title">지역</span>
          <select v-model="siteRegInfo.area">
            <option value="">{{ "[필수선택]" }}</option>
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
            v-model="mngUserNm"
            :disabled="true"
            id="idMngUser" />
          <button class="search_btn" @click="addMgmtUser"></button>
        </div>

        <div class="item_wrap w50p">
          <span class="title">발주처</span>
          <input type="text" v-model="siteRegInfo.odr" id="idOdr" />
        </div>
        <div class="item_wrap w100p">
          <span class="title">공사금액</span>
          <input
            type="text"
            v-model="siteRegInfo.constAmt"
            id="idConstAmt"
            style="text-align: right"
            @input="cUtil.onInputCommaNum($event)" />
        </div>

        <div class="item_wrap w33p">
          <span class="title">현장주소</span>
          <input
            type="text"
            class="search_input"
            v-model="siteRegInfo.siteZip"
            id="idAddr"
            placeholder="우편번호"
            :disabled="true" />
          <button class="search_btn" @click="execDaumPostcode"></button>
        </div>
        <div class="item_wrap w66p">
          <input
            type="text"
            class="address_road"
            v-model="siteRegInfo.siteRoadNm"
            :disabled="true" />
        </div>
        <!-- <div class="item_wrap w100p">
          <input
            type="text"
            class="address"
            v-model="siteRegInfo.siteLnm"
            placeholder="지번"
            :disabled="true"
          />
        </div> -->
        <div class="item_wrap w100p">
          <input
            type="text"
            class="address"
            v-model="siteRegInfo.siteDaddr"
            placeholder="상세주소" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">전화번호</span>
          <input
            type="text"
            v-model="siteRegInfo.crryTelNo"
            id="idCrryTelNo"
            @input="cUtil.regexType($event, 'localTelNo')"
            @blur="cUtil.chkCrryTelNo($event)"
            maxlength="13"
            placeholder="현장 대표 전화번호를 입력하세요" />
        </div>

        <div class="item_wrap w100p">
          <span class="title">현장개요</span>
          <textarea v-model="siteRegInfo.siteDsc" id="idSiteDsc"></textarea>
        </div>

        <!-- <div class="item_wrap w100p">
          <span class="title">현장사진</span>
          <div class="photo" id="photoPreview">
            <input type="file" multiple class="w100p" name ="file" @change="fileList">
          </div>
        </div> -->

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
              :disabled="isEditMode"
              accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
              hidden />
            <button
              @click="onClickUpload"
              v-if="!isEditMode"
              class="file_attach">
              파일 첨부
            </button>
          </div>
        </div>

        <div class="item_wrap w100p">
          <span class="title">사용유무</span>
          <div class="switch on">
            <div class="click_area" @click="switchItem"></div>
            <input v-model="siteRegInfo.useYn" />
            <div class="dot"></div>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="popup_button">
      <button @click="onSaveCheckedButton">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>

  <!-- 안전관리자 등록 팝업 -->
  <popMngtUser @check="getUserNmData"></popMngtUser>
</template>

<script setup>
import { reactive, ref, onBeforeMount, defineProps } from "vue";
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteRegStore } from "@/stores/site/site-reg-store";
import dayjs from "dayjs";
import commonUtil from "@/utils/common-utils";

import popMngtUser from "@/views/site/popMngtUser.vue"; // 안전관리자 팝업

const loginStore = useLoginAuthStore();
const siteRegStore = useSiteRegStore();
const cdMgmtStore = useCdMgmtStore();

const cUtil = commonUtil;

const vendrCd = loginStore.$state.vendrInfo.vendrCd;
const userId = loginStore.$state.userInfo.userId;
const psitnVendrCd = loginStore.$state.userInfo.vendrCd;

const constTypeCode = ref([]); //공사유형
const constClsCode = ref([]); //공사구분
const areaCode = ref([]); //지역

let isEditMode = ref(false);
let upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;

const newSiteCd = ref("");

const props = defineProps(["doSearch"]);

//현장등록 데이터 객체
var siteRegInfo = reactive({
  mode: "",
  userId: userId,
  vendrCd: vendrCd,
  psitnVendrCd: psitnVendrCd,
  siteNm: "",
  siteDsc: "",
  constStDt: "",
  constEnDt: "",
  constType: "",
  constCls: "",
  area: "",
  odr: "",
  constAmt: "",
  siteZip: "",
  siteRoadNm: "",
  siteLnm: "",
  siteDaddr: "",
  crryTelNo: "",
  siteMngr: "",
  useYn: "Y",
  siteMngrNm: "",
});

let mngUserNm = ref("");
let mngUserObj = ref({});

// 파일 목록을 저장할 ref 변수
// const fileList = ref([]);

const formData = new FormData();
const fetchParams = reactive({
  vendrCd: vendrCd,
});

onBeforeMount(() => {
  doSearch();
});

async function doSearch() {
  // 새 현장코드 불러오기
  const res = await siteRegStore.fetchselectSiteOpenList(fetchParams);
  if (res.newSiteCd != "" || res.newSiteCd != null)
    newSiteCd.value = res.newSiteCd;

  // 공통코드 불러오기
  await siteRegStore.comCodesList();
  constTypeCode.value = siteRegStore.$state.constTypeList; //공사유형
  constClsCode.value = siteRegStore.$state.constclsList; //공사구분
  areaCode.value = siteRegStore.$state.areaList; //지역
}

//주소 팝업
function execDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      if (siteRegInfo.siteDaddr !== "") {
        siteRegInfo.siteDaddr = "";
      }

      // 도로명
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        siteRegInfo.siteRoadNm = data.roadAddress;
        // 지번
      } else {
        siteRegInfo.siteRoadNm = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      // if (data.userSelectedType === "R") {
      //   // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      //   // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      //   if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
      //     siteRegInfo.siteDaddr += data.bname;
      //   }
      //   // 건물명이 있고, 공동주택일 경우 추가한다.
      //   if (data.buildingName !== "" && data.apartment === "Y") {
      //     siteRegInfo.siteDaddr +=
      //       siteRegInfo.siteDaddr !== ""
      //         ? `, ${data.buildingName}`
      //         : data.buildingName;
      //   }
      //   // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      //   if (siteRegInfo.siteDaddr !== "") {
      //     siteRegInfo.siteDaddr = `(${siteRegInfo.siteDaddr})`;
      //   }
      // } else {
      //   siteRegInfo.siteDaddr = "";
      // }
      // 우편번호를 입력한다.
      siteRegInfo.siteZip = data.zonecode;
    },
  }).open();
}

// 사용여부
function switchItem(event) {
  if (event.target.parentElement.classList.contains("on")) {
    event.target.parentElement.classList.replace("on", "off");
    siteRegInfo.useYn = "N";
  } else {
    event.target.parentElement.classList.replace("off", "on");
    siteRegInfo.useYn = "Y";
  }
}

//안전관리자 팝업
function addMgmtUser() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("popup mgmt_user")[0].classList.add("show");
}

//안전관리자 팝업화면에서 가져온 데이터
function getUserNmData(data) {
  mngUserObj.value = data;

  if (Object.keys(mngUserObj.value).length > 0) {
    mngUserNm.value = mngUserObj.value.userNm;
    siteRegInfo.siteMngr = mngUserObj.value.userId; //안전관리자
  }
}

// 첨부파일 START >>
// 첨부파일> 파일 버튼 실행
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
        let span = document.createElement("span");
        let button = document.createElement("button");
        let div = document.createElement("div");
        div.setAttribute("id", "siteDivFileI_" + file.name);
        img.setAttribute("src", e.target.result);
        img.setAttribute("id", "siteImgFileI_" + file.name);
        span.textContent = "다운로드";
        span.setAttribute("id", "siteSpanFileI_" + file.name);
        button.setAttribute("class", "del");
        button.setAttribute("id", "siteBtnFileI_" + file.name);
        button.onclick = function () {
          saveDeleteFile(file);
        };

        document.getElementById("sitePhotoPreview").appendChild(div);
        div.appendChild(button);
        div.appendChild(span);
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

  const spanElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteSpanFileI"]');

  const btnElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteBtnFileI"]');

  const divElement = document
    .getElementById("sitePhotoPreview")
    .querySelectorAll('[id*="siteDivFileI"]');

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

  try {
    if (toTbmDt < fromTbmDt) {
      throw {
        message: "시작일자가 종료일자보다 클 수 없습니다.",
      };
    }

    // 현장명 체크
    if (!siteRegInfo.siteNm) {
      throw {
        field: "idSiteNm",
        message: "현장명을 입력해 주세요.",
      };
    }

    // 공사 시작기간 체크
    if (!fromTbmDt) {
      throw {
        field: "fromTbmDt",
        message: "공사 시작기간을 입력해 주세요.",
      };
    }

    // 공사 시작기간 체크
    if (!toTbmDt) {
      throw {
        field: "toTbmDt",
        message: "공사 종료기간을 입력해 주세요.",
      };
    }

    // 공사유형 체크
    if (!siteRegInfo.constType) {
      throw {
        message: "공사유형을 선택해 주세요.",
      };
    }

    // 공사구분 체크
    if (!siteRegInfo.constCls) {
      throw {
        message: "공사구분을 선택해 주세요.",
      };
    }

    // 지역 체크
    if (!siteRegInfo.area) {
      throw {
        message: "지역을 선택해 주세요.",
      };
    }

    // 안전관리자 체크
    if (Object.keys(mngUserObj.value).length == 0) {
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

    // 발주처 체크
    // if (!siteRegInfo.odr) {
    //   throw {
    //     field: "idOdr",
    //     message: "발주처를 입력해 주세요.",
    //   };
    // }

    // 공사금액 체크
    // if (!siteRegInfo.constAmt) {
    //   throw {
    //     field: "idConstAmt",
    //     message: "공사금액을 입력해 주세요.",
    //   };
    // }

    // 현장주소 체크
    if (!siteRegInfo.siteZip) {
      throw {
        field: "idAddr",
        message: "현장주소를 입력해 주세요.",
      };
    }

    // 전화번호 체크
    // if (!siteRegInfo.crryTelNo) {
    //   throw {
    //     field: "idCrryTelNo",
    //     message: "현장 대표 전화번호를 입력하세요.",
    //   };
    // }

    // 현장개요 체크
    // if (!siteRegInfo.siteDsc) {
    //   throw {
    //     field: "idSiteDsc",
    //     message: "현장 개요를 입력해 주세요.",
    //   };
    // }
  } catch (error) {
    if (error.field) {
      document.getElementById(error.field).focus();
    }
    alert(error.message);
    return true;
  }

  return false;
}

// 저장> 현장 등록 저장
const onSaveCheckedButton = async () => {
  if (validation()) return;

  //현장 등록 폼 데이터
  const params = createFormData();

  if (!confirm("저장하시겠습니까?")) return;
  try {
    const res = await siteRegStore.fetchSiteSave(params);

    if (res.data == "OK") {
      alert("정상적으로 처리하였습니다.");
      popupClose();
      reset();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  popupClose();
};

// 저장> 현장 등록 폼 데이터
const createFormData = () => {
  siteRegInfo.mode = "I";

  siteRegInfo.constAmt = siteRegInfo.constAmt.split(",").join("");
  siteRegInfo.siteMngrNm = mngUserNm.value;

  const params = { ...siteRegInfo };

  // 테스트 데이터 삽입 end
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

const reset = () => {
  siteRegInfo.siteNm = "";
  siteRegInfo.siteDsc = reactive("");
  siteRegInfo.constStDt = reactive("");
  siteRegInfo.constEnDt = reactive("");
  siteRegInfo.constType = reactive("");
  siteRegInfo.constCls = reactive("");
  siteRegInfo.area = reactive("");
  siteRegInfo.odr = reactive("");
  siteRegInfo.constAmt = reactive("");
  siteRegInfo.siteZip = reactive("");
  siteRegInfo.siteRoadNm = reactive("");
  siteRegInfo.siteLnm = reactive("");
  siteRegInfo.siteDaddr = reactive("");
  siteRegInfo.crryTelNo = reactive("");
  siteRegInfo.siteMngr = reactive("");
  siteRegInfo.useYn = reactive("Y");
  siteRegInfo.mngUserNm = reactive("");
  mngUserNm.value = JSON.stringify();
  // mngUserObj.value.userId = ref("");
  // mngUserObj.value.userNm = ref("");
};

// 입력 데이터 초기화 & 팝업 닫기
function popupClose() {
  props.doSearch();
  doSearch();
  reset();

  document.getElementById("siteFile").value = "";
  upLoadFileList.value = "";

  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("popup add_site")[0].classList.remove("show");
}
</script>

<style scoped>
.popup.add_site {
  width: 800px;
  height: 700px;
}
.content_box {
  height: 100%;
  margin-bottom: 0px;
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.item_wrap input[type="date"] {
  width: 150px;
}
.item_wrap input,
.item_wrap select,
.item_wrap textarea {
  width: calc(100% - 110px);
}

.item_wrap .photo {
  display: inline-block;
  width: calc(100% - 110px);
  vertical-align: middle;
}

.item_wrap .photo img {
  width: 100px;
  margin-bottom: 10px;
  border-radius: 6px;
}
.item_wrap button.file_attach {
  margin-left: 0px;
}
.item_wrap .address {
  margin-left: 100px;
}
.item_wrap .address_road {
  width: calc(100% - 10px);
}
.switch {
  margin: 4px 0px;
}
</style>
