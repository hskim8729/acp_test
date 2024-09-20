<template>
  <div class="popup_background" @click="closePopup">
    <div class="content" @click.stop>
      <div class="subtitle_area search_pop_input">
        <input
            type="text"
            class="search_input"
            v-model="insideSearchQuery"
            placeholder="분류 및 작업 검색"
            ref="searchInput"
            @keyup.enter.prevent="doSearch" />
        <button class="search_btn" @click="doSearch"></button>
      </div>

      <div class="grid_search_result" id="search_grid">
        <div class="subtitle_area">
          <div class="title">검색어 : <span class="search_word">{{insideSearchQuery}}</span></div>
          <button class="search_close" @click="closePopup">닫기</button>
        </div>

        <div class="table_head">
          <ul>
            <li>대분류</li>
            <li>중분류</li>
            <li>작업명</li>
          </ul>
        </div>
        <div class="table_body">
          <table>
            <tbody>
            <tr
                v-for="row in searchResult"
                @click="onRowClicked(row)"
                :key="row.lgCatCd + row.mdCatCd + row.wrkNmCd">
              <td class="result_td">{{ row.lgCatNm }}</td>
              <td class="result_td">{{ row.mdCatNm }}</td>
              <td class="result_td">{{ row.wrkNm }}</td>
            </tr>
            <tr class="nodata">
              <td colspan="3">검색결과가 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import riskFactorStandardService from "../../../api/services/stdMgmt/risk-factor-standard-service.js";
// import { useRiskFactorStandardStore } from "../../../stores/stdMgmt/risk-factor-standard-store.js";
import comRiskFactorStandardService from "@/api/services/inspcActvt/com-risk-factor-standard-service.js";
import { useComRiskFactorStandardStore } from "@/stores/inspcActvt/com-risk-factor-standard-store.js";
import { storeToRefs } from "pinia";
import { ref, onMounted } from 'vue';
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";

const { defaultColDef, localeText, vendrCd, siteCd, siteHrmrskFctrMstSeq, isOpenPopup, searchQuery } = defineProps([
  "defaultColDef",
  "localeText",
  "vendrCd",
  "siteCd",
  "siteHrmrskFctrMstSeq",
  "isOpenPopup",
  "searchQuery"
]);

const store = useComRiskFactorStandardStore();

const {
  lgCatCd,
  lgCatNm,
  mdCatCd,
  mdCatNm,
  wrkNmCd,
  wrkNm,
} = storeToRefs(store);
let emitData = ref({});

const closePopup = () => {
  insideSearchQuery.value = '';
  searchResult.value = '';
  emitData.vendrCd = vendrCd;
  emitData.siteCd = siteCd;
  emitData.siteHrmrskFctrMstSeq = siteHrmrskFctrMstSeq;
  emitData.searchQuery = insideSearchQuery.value;

 // console.log("emitData팝업==>", emitData);

  emit('togglePopup',emitData)
  emitData = null;
};

const emit = defineEmits(['togglePopup'])

let insideSearchQuery = ref('')
let searchResult = ref([]);

// // 팝업이 열릴 때마다 입력 요소에 포커스를 맞추는 역할
onMounted(async () => {
  insideSearchQuery.value = searchQuery
  searchInput.value.focus();
  await doSearch();
});
let searchInput = ref(null);

const doSearch = async() => {
  if (insideSearchQuery.value !== '') {
    const params = {
      vendrCd: vendrCd,
      siteCd: siteCd,
      siteHrmrskFctrMstSeq: siteHrmrskFctrMstSeq,
      searchQuery: insideSearchQuery.value
    }
    const res = await comRiskFactorStandardService.searchRiskStandardResult(params)
    searchResult.value = res.data
  }

  // 검색어 하이라이트 처리
  const parent = await document.getElementById("search_grid");
  const resultTd = parent.querySelectorAll(".result_td");
  const resultRowCount = parent.querySelectorAll("#search_grid tr").length;

  resultTd.forEach(function(el, i){
    const originalText = el.innerText;
    const replacedText = originalText.replace(insideSearchQuery.value, "<mark>" + insideSearchQuery.value + "</mark>");
    el.innerHTML = replacedText;
  });

  // 검색결과 없는 경우 출력
  if(resultRowCount <= 1) {
    document.getElementsByClassName("nodata")[0].classList.add("show");
  } else {
    document.getElementsByClassName("nodata")[0].classList.remove("show");
  }
};

async function onRowClicked(row) {
  
  //console.log('Row클릭시 값 확인 : ',row);

  lgCatCd.value = row.lgCatCd
  lgCatNm.value = row.lgCatNm
  mdCatCd.value = row.mdCatCd
  mdCatNm.value = row.mdCatNm
  wrkNmCd.value = row.wrkNmCd
  wrkNm.value = row.wrkNm
  emitData = row
  closePopup();

  // // 중분류 , 작업명 null 아닌 경우
  // if (row.mdCatCd === '' && row.wrkNmCd === '') {
  //   mdCatCd.value = ''
  //   mdCatNm.value = ''
  //   wrkNmCd.value = ''
  //   wrkNm.value = ''

  //   lgCatCd.value = row.lgCatCd
  //   lgCatNm.value = row.lgCatNm
  //   emitData = row
  //   closePopup()
  
  // // 작업명 null 아닌 경우
  // } else if (row.wrkNmCd === '') {
  //   wrkNmCd.value = ''
  //   wrkNm.value = ''

  //   lgCatCd.value = row.lgCatCd
  //   lgCatNm.value = row.lgCatNm
  //   mdCatCd.value = row.mdCatCd
  //   mdCatNm.value = row.mdCatNm
  //   emitData = row
  //   closePopup()
  // } else {
  //   lgCatCd.value = row.lgCatCd
  //   lgCatNm.value = row.lgCatNm
  //   mdCatCd.value = row.mdCatCd
  //   mdCatNm.value = row.mdCatNm
  //   wrkNmCd.value = row.wrkNmCd
  //   wrkNm.value = row.wrkNm
  //   emitData = row
  //   closePopup()
  // }
}
</script>

<style scoped>
.popup_background {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 1000px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.content {
  width: 100%;
  height:100%;
  border-radius: 10px;
}

.search_bar {
  display: flex;
}
.search_input {
  width:201px;
  height:32px;
}

.ag-theme-alpine {
  float: left;
}
</style>
