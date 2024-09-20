import { defineStore } from 'pinia';
import siteRegService from '@/api/services/site/site-reg-service';
import cdMgmtService from '@/api/services/sys/cd-mgmt-service';
import { ref, reactive } from 'vue';

export const useSiteRegStore = defineStore('siteRegStore', {
  id: 'siteReg',

  state: () => ({
    // 공통코드 - 공사유형 조회
    constTypeList : [],
    // 공통코드 - 공사구분 조회
    constclsList : [],
    // 공통코드 - 지역 조회
    areaList : [],

    // 현장 목록
    siteOpenList: [],
    // 신규등록시 회사 코드
    newSiteCd: "",
  }),
  getters: {
  },
  actions: {

    // 공통코드 조회
    async comCodesList() {
      try {
        
        const res1 = await cdMgmtService.retrieveComCodeDetail({"comCd": "T15"});
        const constTypeList = res1.data;

        const res2 = await cdMgmtService.retrieveComCodeDetail({"comCd": "T16"});
        const constclsList = res2.data;

        const res3 = await cdMgmtService.retrieveComCodeDetail({"comCd": "T17"});
        const areaList = res3.data;

        this.$patch({
          constTypeList,
          constclsList,
          areaList
        });
        
        // 결과 리턴
        return {
          constTypeList, 
          constclsList, 
          areaList
        };
      } catch (err) {
        console.log('CdMgmtStore > fetchComCodes > error : ', err);
        // 에러 리턴
        throw err;
      }
    },
    
    //현장 목록 조회
    async fetchselectSiteOpenList(params) {
      try {
        const res = await siteRegService.selectSiteOpenList(params);
        const siteOpenList = res.data.selectSiteOpenList;
        
        let newSiteCd = "";

        if(siteOpenList.length>0) newSiteCd = siteOpenList[0].newSiteCd;

        this.$patch({
          siteOpenList, 
          newSiteCd,
        });
        
        // 결과 리턴
        return{
          siteOpenList, 
          newSiteCd
        };

      } catch (err) {
        console.log('siteRegStore > fetchselectSiteOpenList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 현장코드 조회
    async fetchSiteCd(params) {
      try {
        const res = await siteRegService.selectSiteOpenList(params);

        let newSiteCd = null;
        if(res.status == 200) {
          if(res.data.selectSiteOpenList.length > 0) newSiteCd = res.data.selectSiteOpenList[0].newSiteCd;
          else newSiteCd = "";
        }
        
        this.$patch({
          newSiteCd,
        });
        // 결과 리턴
        return newSiteCd;

      } catch (err) {
        console.log('siteRegStore > newSiteCd > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 신규 현장 등록
    async fetchSiteSave(params) {
      try{
          const res = await siteRegService.saveSiteOpenList(params);

          this.$patch({
          });

          return res;
      } catch (err) {
          console.log('RiskAssessmentStore > fetchCreateRiskAssmnCnfrn > error : ', err);
          // 에러 리턴
          throw err;
        }
    },

    // 첨부파일 삭제
    async fetchDeleteFileSiteOpen(params) {
      try{
          const res = await siteRegService.deleteFileSiteOpen(params);

          this.$patch({
          });

          return res;
      } catch (err) {
          console.log('RiskAssessmentStore > fetchCreateRiskAssmnCnfrn > error : ', err);
          // 에러 리턴
          throw err;
        }
    },
       // 현장 등록 체크 ( 추후 개발: 고객 가입 여부에 따른 현장 등록 수 체크)
    async selectSiteOpenChk(params) {
      try{
          const res = await siteRegService.selectSiteOpenChk(params);
        
          this.$patch({
           
          });

          return res;
      } catch (err) {
          console.log('siteRegStore > selectSiteOpenChk > error : ', err);
          // 에러 리턴
          throw err;
      }
    },

  },


});
