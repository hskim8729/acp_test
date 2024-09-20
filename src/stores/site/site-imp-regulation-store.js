import siteImpRegulationService from "@/api/services/site/site-imp-regulation-service";
import cdMgmtService from "@/api/services/sys/cd-mgmt-service";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { defineStore } from "pinia";

export const useSiteImpRegulationStore = defineStore("siteImpRegulationStore", {
  id: "siteImpRegulation",

  state: () => ({
    siteRegApprCnt: -1, // 현장별 실시규정 승인여부
    regCnt: -1, // 현장별 실시규정 존재 여부
    siteRiskMstCnt: -1, // 현장별 위험요인 존재 여부
    //공통코드 - 위험성평가 기준
    riskLvlJdgMntList: [],
    //공통코드 - 위험성 평가 방식
    riskEvalMthdList: [],
    //공통코드 - 평가절차
    evalProcList: [],
    //공통코드 - 관리수준
    mngLvlList: [],
    // 실시규정 표준
    searchList: { cnt: 0 },
    riskLvlList: [],
    evalMthdList: [],
    stdOrgRoleList: [],
  }),
  getters: {
    commonParam: (state, value) => {
      const loginAuth = useLoginAuthStore();
      return {
        vendrCd: loginAuth.$state.siteInfo.vendrCd,
        siteCd: loginAuth.$state.siteInfo.siteCd,
        userId: loginAuth.$state.userInfo.userId,
        mode: state.searchList.cnt === 0 ? "I" : "U",
        division: "S", // 전사, 현장 구분 값(A:전사, S:현장)
      };
    },
    mngLv: (state, value) => {
      return state.mngLvlList.reduce((acc, item) => {
        acc[item.comCd] = item.comCdNm;
        return acc;
      }, {});
    },
    role: () => {
      // prettier 자동 저장때문에 대괄호 표기법 사용
      return {
        ["1000"]: "안전보건관리 책임자",
        ["2000"]: "위험성평가 담당자",
        ["3000"]: "관리감독자",
        ["4000"]: "일반근로자",
      };
    },
    evalProc: (state, value) => {
      // 공통코드 평가절차 리스트 객체로 변환
      return state.evalProcList.reduce((acc, item) => {
        acc[item.comCd] = item.comCdNm;
        return acc;
      }, {});
    },
  },
  actions: {
    // 공통코드 조회
    async comCodesList() {
      try {
        // 위험성 수준> 위험성평가 기준 (상중하, 빈도강도법(3*3), 빈도강도법(5*5))
        const res1 = await cdMgmtService.retrieveComCodeDetail({
          comCd: "T05",
        });
        // 위험성 수준> 위험성 평가 방식(수시평가,상시평가)
        const res2 = await cdMgmtService.retrieveComCodeDetail({
          comCd: "T04",
        });
        // 평가절차 및 방법> 평가절차 (사전준비, 유해.위험요인 파악, 위험성결정 등등)
        const res3 = await cdMgmtService.retrieveComCodeDetail({
          comCd: "T07",
        });
        // 위험성 수준> 관리수준 MNG_LV
        const res4 = await cdMgmtService.retrieveComCodeDetail({
          comCd: "T02",
        });

        this.$patch({
          riskLvlJdgMntList: res1.data,
          riskEvalMthdList: res2.data,
          evalProcList: res3.data,
          mngLvlList: res4.data,
        });
      } catch (err) {
        console.log("CdMgmtStore > fetchComCodes > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 실시규정 표준 조회
    async standReglSearchList(params) {
      try {
        const res = await siteImpRegulationService.searchList({
          ...this.commonParam,
          ...params,
        });
        const searchList = res.data.selectStdMgMtStdImpRgltList;

        this.$patch({
          searchList: searchList,
          riskLvlList: res.data.selectStdMgMtStdImpRgltList?.riskLvlList
            ? res.data.selectStdMgMtStdImpRgltList.riskLvlList
            : [],
          evalMthdList: res.data.selectStdMgMtStdImpRgltList?.evalMthdList
            ? res.data.selectStdMgMtStdImpRgltList.evalMthdList
            : [],
          stdOrgRoleList: res.data.selectStdMgMtStdImpRgltList?.stdOrgRoleList
            ? res.data.selectStdMgMtStdImpRgltList.stdOrgRoleList
            : [],
        });

        // 결과 리턴
        return res.data.selectStdMgMtStdImpRgltList;
      } catch (err) {
        console.log(
          "siteImpRegulationStore > standReglSearchList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장실시규정 저장
    async saveSiteImpRegulation(params) {
      try {
        const res = await siteImpRegulationService.saveSiteImpRegulation(
          params
        );

        this.$patch({});

        return res;
      } catch (err) {
        console.log(
          "siteImpRegulationStore > saveSiteImpRegulation > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장실시규정 결재(상신, 승인)
    async apprSiteImpRegulation(params) {
      try {
        const res = await siteImpRegulationService.apprSiteImpRegulation(
          params
        );

        this.$patch({});

        return res;
      } catch (err) {
        console.log(
          "siteImpRegulationStore > apprSiteImpRegulation > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장인력 동의여부
    async updateAgreYn() {
      try {
        const res = await siteImpRegulationService.updateAgreYn(
          this.commonParam
        );

        this.$patch({});

        return res;
      } catch (err) {
        console.log("siteImpRegulationStore > updateAgreYn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 현장별 실시규정 존재 여부 조회
    async selectSiteStdMgMtStdImpRgltCnt(params) {
      try {
        const res =
          await siteImpRegulationService.selectSiteStdMgMtStdImpRgltCnt({
            ...this.commonParam,
            ...params,
          });
        const regCnt = res.data.cnt;

        this.$patch({ regCnt });

        return regCnt;
      } catch (err) {
        console.log(
          "siteImpRegulationStore > selectSiteStdMgMtStdImpRgltCnt > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장별 위험요인 존재 여부 조회
    async selectSiteRiskMstCnt(params) {
      try {
        const res = await siteImpRegulationService.selectSiteRiskMstCnt(params);
        const siteRiskMstCnt = res.data.cnt;

        this.$patch({ siteRiskMstCnt });

        return siteRiskMstCnt;
      } catch (err) {
        console.log(
          "siteImpRegulationStore > selectSiteRiskMstCnt > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // 현장별 실시규정 승인여부 조회
    async siteApprCnt(params) {
      try {
        const res = await siteImpRegulationService.siteApprCnt({
          ...this.commonParam,
          ...params,
        });
        const siteRegApprCnt = res.data.cnt;

        this.$patch({
          siteRegApprCnt,
        });

        return siteRegApprCnt;
      } catch (err) {
        console.log("siteImpRegulationStore > siteApprCnt > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
  },
});
