import standardslmRegulationService from "@/api/services/stdMgmt/standardslm-regulation-service";
import { defineStore } from "pinia";

export const useStandReglStore = defineStore("standReglStore", {
  id: "standardslmRegulation",

  state: () => ({
    // 실시규정 표준
    searchList: [],
    riskLvlList: [],
    evalMthdList: [],
    stdOrgRoleList: [],
  }),
  getters: {},
  actions: {
    // 실시규정 표준 조회
    async standReglSearchList(params) {
      try {
        const res = await standardslmRegulationService.searchList(params);
        const searchList = res.data.selectStdMgMtStdImpRgltList;

        this.$patch({
          searchList,
        });
        // 결과 리턴
        return searchList;
      } catch (err) {
        console.log("standReglStore > standReglSearchList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 위험성 수준 판단 방법 및 기준 조회
    async riskLvlList(params) {
      try {
        const res = await standardslmRegulationService.searchList(params);
        const riskLvlList = res.data.selectStdMgMtStdImpRgltList.riskLvlList;

        this.$patch({
          riskLvlList,
        });
        // 결과 리턴
        return riskLvlList;
      } catch (err) {
        console.log("standReglStore > riskLvlList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 평가절차 및 방법 조회
    async evalMthdList(params) {
      try {
        const res = await standardslmRegulationService.searchList(params);
        const evalMthdList = res.data.selectStdMgMtStdImpRgltList.evalMthdList;

        this.$patch({
          evalMthdList,
        });
        // 결과 리턴
        return evalMthdList;
      } catch (err) {
        console.log("standReglStore > evalMthdList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 조직 및 역할 조회
    async stdOrgRoleList(params) {
      try {
        const res = await standardslmRegulationService.searchList(params);
        const stdOrgRoleList =
          res.data.selectStdMgMtStdImpRgltList.stdOrgRoleList;

        this.$patch({
          stdOrgRoleList,
        });
        // 결과 리턴
        return stdOrgRoleList;
      } catch (err) {
        console.log("standReglStore > stdOrgRoleList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
  },
});
