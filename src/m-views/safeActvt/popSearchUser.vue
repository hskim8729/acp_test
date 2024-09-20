<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="pop_in_pop search_user show">
    <div class="popup_title">
      <span>직원 조회</span>
      <button class="popup_close" @click="close"></button>
    </div>
    <div class="popup_content">
      <div class="grid_card">
        <ul id="riskUl"></ul>
      </div>
    </div>
    <!-- <div class="popup_content">
      <div class="content_box">
        <div class="item_wrap w50p">
          <span for="vendrNm" class="title">사용자명</span>
          <input type="text" v-model="userNm" />
        </div>
        <button class="search" @click="onSearch">조회</button>
      </div>
      <div class="grid_default" id="grid02">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :gridOptions="gridOptions2"
          :rowData="gridRowData2"
        >
        </ag-grid-vue>
      </div>
    </div> -->
    <div class="popup_button">
      <button @click="close">취소</button>
    </div>
  </div>
</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import { reactive, ref, onBeforeMount, defineEmits, onMounted } from "vue";
import { useMajorStore } from "@/stores/safeActvt/major-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const emit = defineEmits(["close"]);

const loginStore = useLoginAuthStore();
const store = useMajorStore();
const vendrCd = loginStore.$state.siteInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
const userId = loginStore.$state.userInfo.userId;
const userNm = ref("");

const selectedUser = (params) => {
  close(params);
};

const close = (param) => {
  emit("close", param);
};

onMounted(() => {
  onSearch();
});

// 사용자 그리기 함수
const drawGrid = (item) => {
  const mappings = {
    회사명: "vendrNm",
    사용자명: "userNm",
    직위명: "workNm",
    휴대전화: "crryTelNo",
  };
  const riskUl = document.getElementById("riskUl");
  item.forEach((data) => {
    const listItem = document.createElement("li");
    const cardWrap = document.createElement("div");
    cardWrap.setAttribute("style", " position: relative;height: auto");
    cardWrap.setAttribute("class", "card_wrap");

    Object.keys(mappings).forEach((title, index) => {
      const key = mappings[title];
      const cardItem = document.createElement("div");
      cardItem.setAttribute(
        "style",
        "position: static;display: inline-block;margin-bottom: 15px;height: auto; width:50%"
      );

      cardItem.setAttribute("class", "card_item");

      const titleElement = document.createElement("div");
      titleElement.setAttribute("class", "title");
      titleElement.textContent = title;

      const dataElement = document.createElement("div");
      dataElement.setAttribute("class", "data");
      dataElement.textContent = data[key];

      cardItem.appendChild(titleElement);
      cardItem.appendChild(dataElement);
      cardWrap.appendChild(cardItem);
    });
    // 상세조회 버튼 생성 및 추가
    const cardStatus = document.createElement("div");
    cardStatus.setAttribute("class", "card_status red");
    cardStatus.textContent = "선택";

    // 상세조회 버튼
    cardStatus.addEventListener("click", () => {
      close(data);
    });

    cardWrap.appendChild(cardStatus);
    listItem.appendChild(cardWrap);
    riskUl.appendChild(listItem);
  });
};

// 조회
async function onSearch() {
  const params = {
    userNm: userNm.value,
    vendrCd: vendrCd,
    siteCd: siteCd,
  };

  //사용자 조회
  const userInfoList = await store.selectPntActDsctnEmpInfoList(params);
  if (userInfoList) {
    drawGrid(userInfoList);
    //gridRowData2.value = userInfoList;
  } else {
    alert("조회된 데이터가 없습니다.");
  }
}
</script>

<style scoped>
#grid02 {
  height: calc(100% - 100px);
}

.search_user {
  width: 100%;
  height: 600px;
}
</style>
