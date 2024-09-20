<!-- 시스템/권한관리/팝업-사용자등록 -->

<template>
  <div class="pop_in_pop search_user">
    <div class="popup_title">
      <span>직원 조회</span>
      <button class="popup_close" @click="popInPopClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_card">
        <ul id="riskUl"></ul>
      </div>
    </div>
    <div class="popup_button">
      <!-- <button @click="selectedUser">선택</button> -->
      <button @click="popInPopClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, defineEmits } from "vue";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const siteRegDetailStore = useSiteRegDetailStore();

const emit = defineEmits(["userInfo"]);

const loginStore = useLoginAuthStore();
const vendrCd = loginStore.$state.userInfo.vendrCd;

const popInPopClose = () => {
  document.getElementsByClassName("popup_bg2")[0].classList.remove("show");
  document.getElementsByClassName("search_user")[0].classList.remove("show");
};

const drawGrid = (item) => {
  const mappings = {
    사용자ID: "userId",
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
      detailInfo(data);
    });

    cardWrap.appendChild(cardStatus);
    listItem.appendChild(cardWrap);
    riskUl.appendChild(listItem);
  });
};

const detailInfo = (item) => {
  emit("userInfo", item);
  popInPopClose();
};

onBeforeMount(async () => {
  //사용자 조회
  const userInfoList = await siteRegDetailStore.selectSiteOverviewUserInfoList({
    vendrCd: vendrCd,
  });
  drawGrid(userInfoList);
});
</script>

<style scoped>
#grid02 {
  display: flex;
  height: calc(100%);
}

.search_user {
  width: 100%;
  height: 70%;
}
</style>
