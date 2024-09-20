<template>
  <div class="item_wrap w100p">
    <span class="p_title">기간 조회</span><br />
    <!-- <input type="date" id="fromModDate" max="9999-12-31" /> -->
    <datepicker
      v-model="fromModDate"
      id="fromModDate"
      format="yyyy-MM-dd"
      class="fromTo"
      :key="fromKey"></datepicker>
    <span class="space"> ~ </span>
    <!-- <input type="date" id="toModDate" max="9999-12-31" /> -->
    <datepicker
      v-model="toModDate"
      id="toModDate"
      format="yyyy-MM-dd"
      class="fromTo"
      :key="toKey"></datepicker>
  </div>
  <button class="m_search" @click="adtnDateSearch">조회</button>

  <div class="m_content_top_btn_area">
    <button @click="routeTour">순회점검 등록</button>
    <button @click="routeWorker">근로자 제보</button>
    <button @click="routeAccident">아차사고 등록</button>
  </div>

  <div class="grid_card">
    <ul id="riskUl"></ul>
  </div>
</template>

<script setup>
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import commonUtil from "@/utils/common-utils";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import datepicker from "vue3-datepicker";

const router = useRouter();
const route = useRoute();
const pageTitle = document.getElementsByClassName("m_page_title")[0];
pageTitle.innerText = "추가위험발굴"; // 페이지 타이틀 입력
const cUtils = commonUtil;

const useLoginAuth = useLoginAuthStore();
const adtnStore = useAdtnRiskStore();
const gridData = ref();
const tourDetailInfo = ref(null); // 순회점검 상세
const workDetailInfo = ref(null); // 근로자제안 상세
const acciDetailInfo = ref(null); // 아차사고 상세
let fromModDate = ref();
let toModDate = ref();

let fromKey = ref(0);
let toKey = ref(0);

watch(fromModDate, () => {
  fromKey.value++;
});

watch(toModDate, () => {
  toKey.value++;
});

const routeTour = () => {
  router.push({
    path: "/ADTN_RISK/m-additionalRiskTour",
    name: "m-additionalRiskTour",
    params: {
      mode: "I",
    },
  });
};
const routeWorker = () => {
  router.push({
    path: "/ADTN_RISK/m-additionalRiskWorker",
    name: "m-additionalRiskWorker",
    params: {
      mode: "I",
    },
  });
};
const routeAccident = () => {
  router.push({
    path: "/ADTN_RISK/m-additionalRiskAccident",
    name: "m-additionalRiskAccident",
    params: {
      mode: "I",
      param: "none",
    },
  });
};

onMounted(() => {
  searchList();
  // 공종코드 조회
  TappMgmtList();

  // 순회점검 위험성 조회
  SiteExeRuleList();

  // TEMP 파일 삭제
  tempFileDelete();
});

// TEMP 파일 삭제 함수
const tempFileDelete = async () => {
  const vendrCd = useLoginAuth.$state.siteInfo.vendrCd;
  const userId = useLoginAuth.$state.userInfo.userId;
  const param = {
    vendrCd: vendrCd,
    userId: userId,
  };
  await adtnStore.appTempFileDelete(param);
};

// 위험성 조회 함수
const SiteExeRuleList = async () => {
  await adtnStore.adtnRiskSiteRuleList();
};

// 공종코드 조회 함수
const TappMgmtList = async () => {
  await adtnStore.adtnRiskTappMgmtList();
};

// 그리드 초기화 함수
const delGridDraw = () => {
  const li = document.getElementById("riskUl").querySelectorAll("li");
  li.forEach((item) => {
    item.remove();
  });
};

// 리스트 조회 함수
const searchList = async (param) => {
  const vendrCd = useLoginAuth.$state.siteInfo.vendrCd;
  const siteCd = useLoginAuth.$state.siteInfo.siteCd;
  const userId = useLoginAuth.$state.userInfo.userId;
  const psitnVendrCd = useLoginAuth.$state.userInfo.vendrCd;
  const params = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    fromModDate: "",
    toModDate: "",
    psitnVendrCd: psitnVendrCd,
  });

  const adtnList = await adtnStore.adtnRiskSerchList(params);

  console.log("모바일 추가발굴 조회 >>>>>>>>>>>>>>  ", adtnList.length);
  delGridDraw();
  gridDraw(adtnList);
};

// 기간 검색
const adtnDateSearch = async () => {
  const vendrCd = useLoginAuth.$state.siteInfo.vendrCd;
  const siteCd = useLoginAuth.$state.siteInfo.siteCd;
  const userId = useLoginAuth.$state.userInfo.userId;
  const psitnVendrCd = useLoginAuth.$state.userInfo.vendrCd;

  let from = cUtils.pickerToString(fromModDate.value);
  let to = cUtils.pickerToString(toModDate.value);

  if (!validDate(from, to)) {
    return;
  }

  const params = reactive({
    vendrCd: vendrCd,
    siteCd: siteCd,
    userId: userId,
    fromModDate: from,
    toModDate: to,
    psitnVendrCd: psitnVendrCd,
  });

  console.log("날짜 서치 param : ", params);
  const adtnList = await adtnStore.adtnRiskSerchList(params);
  delGridDraw();
  gridDraw(adtnList);
};

// 날짜 유효성 검사
const validDate = (fromModDate, toModDate) => {
  if (cUtils.nullCheck(fromModDate)) {
    alert("시작일이 비어있습니다.");
    return false;
  } else if (cUtils.nullCheck(toModDate)) {
    alert("종료일이 비어있습니다.");
    return false;
  } else if (toModDate < fromModDate) {
    alert("시작일이 종료일보다 클 수 없습니다.");
    return false;
  } else {
    return true;
  }
};

const gridDraw = (data) => {
  const mappings = {
    구분: "dscvTypeNm",
    등록일: "modDate",
    작성자: "userNm",
    업체명: "vendrNm",
    공종: "contyCdNm",
    "위치/장소": "wrkLoc",
    작업명: "wrkNm",
    위험요인: "rskFctr",
  };

  const riskUl = document.getElementById("riskUl");

  data.forEach((item) => {
    const listItem = document.createElement("li");
    const cardWrap = document.createElement("div");
    cardWrap.setAttribute("style", " position: relative;height: auto");
    cardWrap.setAttribute("class", "card_wrap");

    Object.keys(mappings).forEach((title, index) => {
      const key = mappings[title];
      const cardItem = document.createElement("div");
      if (index === 0) {
        cardItem.setAttribute(
          "style",
          "position: static;display: inline-block;margin-bottom: 15px;height: auto; width:35%"
        );
      } else if (index === 1) {
        cardItem.setAttribute(
          "style",
          " position: static;display: inline-block;margin-bottom: 15px;height: auto;width:50%"
        );
      } else if (index === 2) {
        cardItem.setAttribute(
          "style",
          " position: static;display: inline-block;margin-bottom: 15px;height: auto;width:35%"
        );
      } else if (index === 3) {
        cardItem.setAttribute(
          "style",
          " position: static;display: inline-block;margin-bottom: 15px;height: auto;width:50%"
        );
      } else if (index >= 4 && index <= 7) {
        cardItem.setAttribute(
          "style",
          "position: static;display: inline-block;margin-bottom: 15px;height: auto; width:100%"
        );
      }

      cardItem.setAttribute("class", "card_item");

      const titleElement = document.createElement("div");
      titleElement.setAttribute("class", "title");
      titleElement.textContent = title;

      const dataElement = document.createElement("div");
      dataElement.setAttribute("class", "data");
      dataElement.textContent = item[key];

      cardItem.appendChild(titleElement);
      cardItem.appendChild(dataElement);
      cardWrap.appendChild(cardItem);
    });

    // 상세조회 버튼 생성 및 추가
    const cardStatus = document.createElement("div");
    cardStatus.setAttribute("class", "card_status red");
    cardStatus.textContent = "편집";

    const cardDel = document.createElement("div");
    const cardDelBtn = document.createElement("button");
    const imageUrl = "/src/assets/img/grid_del_icon.png";
    cardDel.setAttribute("class", "cell_center");
    cardDel.setAttribute(
      "style",
      "position: absolute; right:20px; bottom:20px;"
    );
    cardDelBtn.setAttribute(
      "style",
      `
      background-image: url('${imageUrl}');
      width: 30px;
      height: 30px;
      border: 0px;
      background-color: transparent;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    `
    );
    cardDelBtn.setAttribute("class", "del");

    cardDel.appendChild(cardDelBtn);

    // 상세조회 버튼
    cardStatus.addEventListener("click", () => {
      detailInfo(item);
    });

    // 삭제 버튼
    cardDelBtn.addEventListener("click", () => {
      if (confirm("삭제 하시겠습니까?")) {
        deleteList(item);
      }
    });

    cardWrap.appendChild(cardDel);
    cardWrap.appendChild(cardStatus);
    listItem.appendChild(cardWrap);
    riskUl.appendChild(listItem);
  });
};

// 게시글 삭제 함수
const deleteList = async (params) => {
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
  const userId = useLoginAuth.$state.userInfo.userId;
  if (params.regId != userId) {
    alert("작성자만 게시글 삭제할 수 있습니다.");
    return;
  }

  const formData = new FormData(); // 파일

  // 삭제 파라미터 추가
  params.mode = "D";
  // 추후 세션 값 사용예정
  params.userId = userId;

  formData.append(
    "param",
    new Blob([JSON.stringify(params)], { type: "application/json" })
  );

  // 게시글 삭제
  await adtnStore.mobileSaveList(formData);

  // 파일 삭제
  await adtnStore.adtnRiskDeleteFile(params);

  searchList();
  document.getElementsByClassName("loading_wrap")[0].classList.remove("show");
};

const detailInfo = async (data) => {
  const detailDscvTypeCd = data.dscvTypeCd; // 구분 가져오기
  const param = {
    vendrCd: data.vendrCd,
    siteCd: data.siteCd,
    dscvTypeCd: data.dscvTypeCd,
    dscvSeq: data.dscvSeq,
    contyCd: data.contyCd,
    lgCatCd: data.lgCatCd,
    mdCatCd: data.mdCatCd,
    wrkNmCd: data.wrkNmCd,
  };
  const adtnDetailinfo = await adtnStore.searchDetailList(param);
  if (detailDscvTypeCd == "T1101") {
    // 순회점검
    adtnDetailinfo[0].pageFlag = "tourDetail";
    tourDetailInfo.value = adtnDetailinfo; // 상세조회 값 저장
    router.push({
      path: "/ADTN_RISK/m-additionalRiskTour",
      name: "m-additionalRiskTour",
      params: {
        mode: "U",
        param: JSON.stringify(param),
      },
    });
  } else if (detailDscvTypeCd == "T1102") {
    // 근로자 제안
    adtnDetailinfo[0].pageFlag = "workDetail";
    workDetailInfo.value = adtnDetailinfo;
    router.push({
      path: "/ADTN_RISK/m-additionalRiskWorker",
      name: "m-additionalRiskWorker",
      params: {
        mode: "U",
        param: JSON.stringify(param),
      },
    });
  } else {
    //아차 사고
    adtnDetailinfo[0].pageFlag = "acciDetail";
    acciDetailInfo.value = adtnDetailinfo;
    router.push({
      path: "/ADTN_RISK/m-additionalRiskAccident",
      name: "m-additionalRiskAccident",
      params: {
        mode: "U",
        param: JSON.stringify(param),
      },
    });
  }
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
  height: calc(100% - 200px);
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
.grid_card .card_item:nth-child(1) {
  width: 35%;
}
.grid_card .card_item:nth-child(2) {
  width: 50%;
}
.grid_card .card_item:nth-child(3),
.grid_card .card_item:nth-child(4),
.grid_card .card_item:nth-child(5),
.grid_card .card_item:nth-child(6) {
  width: 100%;
}
.m_content_top_btn_area button {
  width: calc(33.33% - (20px / 3));
}
</style>
