<template>
  <div class="popup add_wrk">
    <div class="popup_title">
      <span>작업명 편집</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_sort3">
        <table>
          <tr v-for="(item, index) in wrkCateList.value" :key="index">
            <td>
              <input
                type="checkbox"
                :name="wrkNm"
                :id="item.wrkNmCd"
                :value="item.wrkNmCd"
                @change="selectedItem($event, index)"
                :checked="checked(item.wrkNmMarkYn)" />
              {{ item.wrkNm }}
            </td>
            <!-- <td>{{ item.wrkNmMarkYn }}</td> -->
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
import commonUtil from "@/utils/common-utils";
import { reactive, ref, onBeforeMount, onMounted, defineProps } from "vue";
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import { storeToRefs } from "pinia";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const siteStore = useSiteRiskFactorRegulationStore();
const loginStore = useLoginAuthStore();

const userId = loginStore.$state.userInfo.userId;
const vendrCd =
  loginStore.$state.vendrInfo.ptnrYn == "Y"
    ? loginStore.$state.vendrInfo.vendrUpperCd
    : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
let siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;

let wrkCateList = reactive([]); // 작업명
let saveParams = [];

const cUtil = commonUtil;

const props = defineProps(["codeParams", "doSearch"]);

onBeforeMount(async () => {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: props.codeParams.lgCatCd,
    mdCatCd: props.codeParams.mdCatCd,
  };

  // 중분류값이 있을때
  if (!cUtil.nullCheck(props.codeParams.mdCatCd)) {
    // 작업명 조회
    wrkCateList.value = await siteStore.selectWrkCatList(params);
  }
});

function checked(target) {
  return target == "Y" ? true : false;
}

// 작업명 체크했을 때
function selectedItem(event, index) {
  const dataList = wrkCateList.value.filter((item, idx) => idx === index);

  const saveList = dataList.map((item) => ({
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: props.codeParams.lgCatCd,
    mdCatCd: props.codeParams.mdCatCd,
    wrkNmCd: item.wrkNmCd,
    userId: userId,
    wrkNmMarkYn: item.wrkNmMarkYn == "N" ? "Y" : "N",
  }));

  saveParams.push({ ...saveList[0] });
}

async function addMarkYn() {
  if (!confirm("선택하신 내용을 등록하시겠습니까?")) return;

  // 작업명 표시여부 변경
  const res = await siteStore.fetchSaveSiteRiskWrkNmList(saveParams);

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
  document.getElementsByClassName("popup add_wrk")[0].classList.remove("show");
}
</script>

<style scoped></style>
