<!-- views/stdThreat -->

<template>
  <div class="page_title_area">
    <div class="title">현장 </div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 현장 > 현장 위험요인
    </nav>
  </div>

  <!-- 전사 템플릿 팝업 -->
  <popTemplateSelection
    :doSearch="doSearch"
  ></popTemplateSelection>

  <div class="page_content_area">
    <div class="subtitle_area">
      <div class="title">1. 표준 위험요인</div>
      <button @click="addReg">표준 위험요인 가져오기</button>
    </div>

    <div>
      <site-risk-factors-grid-1
          :defaultColDef="defaultColDef"
          :localeText="localeText"
          :templateList="templateList" :key="templateList"/>
    </div>
    <div class="subtitle_area">
      <div class="title">2. 표준공종 / 위험요인</div>
    </div>
    <site-risk-factors-grid-2
        :defaultColDef="defaultColDef"
        :localeText="localeText"
        :siteHrmrskFctrMstSeq="siteHrmrskFctrMstSeq" :key="siteHrmrskFctrMstSeq"
    /> 
    <!-- <div class="subtitle_area">
      <div class="title">3. 위험요인 및 감소대책</div>
    </div>
    <site-risk-factors-grid-3
        :defaultColDef="defaultColDef"
        :localeText="localeText"
        :siteHrmrskFctrMstSeq="siteHrmrskFctrMstSeq"
        :codeParams="codeParams" :key="codeParams"
        
    /> -->

  </div>

</template>

<script setup>
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import {reactive, ref, onBeforeMount} from 'vue';
import { useSiteRiskFactorRegulationStore } from "@/stores/site/site-risk-factor-regulation-store";
import popTemplateSelection from '@/views/site/comPopup/popTemplateSelection.vue';
import { storeToRefs } from "pinia";
import siteRiskFactorsGrid1 from '@/views/site/comGrid/siteRiskFactorsGrid1.vue';
import siteRiskFactorsGrid2 from '@/views/site/comGrid/siteRiskFactorsGrid2.vue';
// import siteRiskFactorsGrid3 from '@/views/site/comGrid/siteRiskFactorsGrid3.vue';
import { useLoginAuthStore } from '@/stores/common/login-auth-store';
  
  
  // 로그인 세션값
  const loginStore = useLoginAuthStore();
  const siteStore = useSiteRiskFactorRegulationStore();

  const userId = loginStore.$state.userInfo.userId;
  const vendrCd = loginStore.$state.vendrInfo.ptnrYn == "Y" ? loginStore.$state.vendrInfo.vendrUpperCd : loginStore.$state.vendrInfo.vendrCd;
  const siteCd = loginStore.$state.siteInfo.siteCd;

  const codeParams = ref({});

  const {
      templateList,
      siteHrmrskFctrMstSeq,
  } = storeToRefs(siteStore);
  
  const defaultColDef = {
    editable: true,
    sortable: true,
    flex: 2,
    minWidth: 50,
    filter: false,
    resizable: false,
    headerClass: "centered",
    cellClass: "centered"
  };

  const localeText = {noRowsToShow: "조회 결과가 없습니다."};

  let siteDataChk = "N";

  onBeforeMount(async () => {
    doSearch();
  });

  // 템플릿 조회
  async function doSearch(){
    const param = {
      "vendrCd": vendrCd,
      "siteCd": siteCd,
    }
    
    // 현장 위험요인 데이터 존재여부 체크
    await siteStore.fetchTemplateList(param);
    
    if(siteHrmrskFctrMstSeq.value>0){
      siteDataChk = "Y";
    }else{
      alert("현장 표준 위험요인을 등록 후 이용해주세요.");
      // 전사 템플릿 팝업
      popupTemplateSelection();
      return;
    }
  }

   // // 등록 버튼 클릭 시 
   function addReg() {

    // siteDataChk: Y => 현장 표준위험요인 등록 되어있음
    // siteDataChk: N => 현장 표준위험요인 등록 데이터없음
    // 현장 표준 위험요인이 없을때 전사 템플릿 팝업 확인 하라고 표시
    if(siteDataChk == "Y") {
      if(!confirm("이미 작성된 현장 위험요인이 존재합니다. 새로 등록하시겠습니까?")) return;
      else popupTemplateSelection();
    }
    // 전사 템플릿 팝업
    popupTemplateSelection();

  }

  //팝업 - 템플릿 선택
  function popupTemplateSelection() {
      document.getElementsByClassName("popup risk_factor_reg")[0].classList.add("show");
  }

</script>

<style scoped>
.subtitle_area {
  float: left;
}

.subtitle_area input {
  height: 32px;
}

#grid01 {
  float: left;
  width: 100%;
  height: 120px;
  margin-bottom: 30px;
}

#grid02 {
  float: left;
  width: calc(50% - 10px);
  height: calc(100% - 340px);
  margin-right: 20px;
}

#grid03 {
  float: left;
  width: calc(50% - 10px);
  height: calc(100% - 340px);
}

.ag-theme-alpine {
  float: left;
}

.popup.risk_factor_reg {
  width:1000px;
  height:400px;
}


</style>
