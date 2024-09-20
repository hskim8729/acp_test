<template>
  <div class="popup add_msr">
    <div class="popup_title">
      <span>감소대책 편집</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <div class="grid_sort3">
        <table>
          <tr v-for="(item, index) in msrList.value" :key="index">
            <td>
              <input
                type="checkbox"
                :name="rskMsr"
                :id="item.rskMsrSeq"
                :value="item.rskMsrSeq"
                @change="selectedItem($event, index)"
                :checked="checked(item.rskMsrMarkYn)" />
              {{ item.rskMsr }}
            </td>
            <!-- <td>{{ item.rskMsrMarkYn }}</td> -->
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

const cUtil = commonUtil;

const userId = loginStore.$state.userInfo.userId;
const vendrCd =
  loginStore.$state.vendrInfo.ptnrYn == "Y"
    ? loginStore.$state.vendrInfo.vendrUpperCd
    : loginStore.$state.vendrInfo.vendrCd;
const siteCd = loginStore.$state.siteInfo.siteCd;
let siteHrmrskFctrMstSeq = siteStore.$state.siteHrmrskFctrMstSeq;

let msrList = reactive([]); // 감소대책
let saveParams = [];

const props = defineProps(["codeParams", "doSearch"]);

onBeforeMount(async () => {
  const params = {
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: props.codeParams.lgCatCd,
    mdCatCd: props.codeParams.mdCatCd,
    wrkNmCd: props.codeParams.wrkNmCd,
    rskFctrSeq: props.codeParams.rskFctrSeq,
  };

  // 위험요인 값이있을때
  if (!cUtil.nullCheck(props.codeParams.rskFctrSeq)) {
    // 감소대책 조회
    msrList.value = await siteStore.fetchRskMsrList(params);
  }
});

function checked(target) {
  return target == "Y" ? true : false;
}

// 위험요인 체크했을 때
function selectedItem(event, index) {
  const dataList = msrList.value.filter((item, idx) => idx === index);

  const saveList = dataList.map((item) => ({
    vendrCd: vendrCd,
    siteCd: siteCd,
    siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
    lgCatCd: props.codeParams.lgCatCd,
    mdCatCd: props.codeParams.mdCatCd,
    wrkNmCd: props.codeParams.wrkNmCd,
    rskFctrSeq: props.codeParams.rskFctrSeq,
    rskMsrSeq: item.rskMsrSeq,
    userId: userId,
    rskMsrMarkYn: item.rskMsrMarkYn == "N" ? "Y" : "N",
  }));

  saveParams.push({ ...saveList[0] });
}

async function addMarkYn() {
  if (!confirm("선택하신 내용을 등록하시겠습니까?")) return;

  // 감소대책 표시여부 변경
  const res = await siteStore.fetchSaveSiteRiskMsrList(saveParams);

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
  document.getElementsByClassName("popup add_msr")[0].classList.remove("show");
}
</script>

<style scoped></style>
