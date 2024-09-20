<template>
  <div class="popup add_lg_cat">
    <div class="popup_title">
      <span>대분류 편집</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_sort3">
        <table>
          <tr v-for="(item, index) in lgCateList.value" :key="index">
            <td>
              <input
                type="checkbox"
                :id="item.lgCatCd"
                :value="item.lgCatCd"
                @change="selectedItem($event, index)"
                :checked="checked(item.lgCatMarkYn)" />
              {{ item.lgCatNm }}
            </td>
            <!-- <td>{{ item.lgCatMarkYn }}</td> -->
          </tr>
        </table>
      </div>
    </div>

    <div class="popup_button">
      <button @click="addMarkYn">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted, defineProps } from "vue";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import { storeToRefs } from "pinia";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const siteStore = useSiteRiskFactorRegulationStore();
const loginStore = useLoginAuthStore();

const props = defineProps(["doSearch"]);

const userId = loginStore.$state.userInfo.userId;
const vendrCd =
  loginStore.$state.vendrInfo.ptnrYn == "Y"
    ? loginStore.$state.vendrInfo.vendrUpperCd
    : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
let siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;

let lgCateList = reactive([]); // 대분류
let saveParams = [];

onMounted(() => {
  searchList();
});

async function searchList() {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
  };

  // 대분류 조회
  lgCateList.value = await siteStore.selectLgCatList(params);
}

function checked(target) {
  return target == "Y" ? true : false;
}

// 대분류 체크박스 change
function selectedItem(event, index) {
  // 체크박스가 수정된 데이터 index => index
  // updData: 수정된 데이터
  const updData = lgCateList.value.filter((item, idx) => idx === index);

  const saveList = updData.map((item) => ({
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: item.lgCatCd,
    userId: userId,
    lgCatMarkYn: item.lgCatMarkYn == "N" ? "Y" : "N",
  }));

  saveParams.push({ ...saveList[0] });
}

async function addMarkYn() {
  if (!confirm("선택하신 내용을 등록하시겠습니까?")) return;

  // 대분류 표시여부 변경
  const res = await siteStore.fetchSaveSiteLgMarkYn(saveParams);

  if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
    alert("정상적으로 처리하였습니다.");
    props.doSearch();
    popupClose();
  } else {
    if (!res.svrMessage) alert(res.svrMessage);
    else alert(res.data.message);
  }
}

// 팝업창 닫기
function popupClose() {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document
    .getElementsByClassName("popup add_lg_cat")[0]
    .classList.remove("show");
}
</script>

<style scoped></style>
