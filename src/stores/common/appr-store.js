import { defineStore } from "pinia";
import apprService from "@/api/common/appr-service";

export const useApprStore = defineStore("apprStore", {
  id: "appr",

  state: () => ({}),

  getters: {},

  actions: {
    // 결재현황 조회
    async fetchApprStatusList(params) {
      try {
        const res = await apprService.retrieveApprStatusList(params);
        const apprStatusList = res.data.selectApprStatusList;

        // 결과 리턴
        return apprStatusList;
      } catch (err) {
        console.log("ApprStore > fetchApprStatusList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 현재 결재자 조회
    async fetchApprover(params) {
      try {
        const res = await apprService.retrieveApprover(params);
        const approver = res.data.selectApprover;

        // 결과 리턴
        return approver;
      } catch (err) {
        console.log("ApprStore > fetchApprover > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 사용자 사인 여부 조회
    async fetchUserAcctSignYn(params) {
      try {
        const res = await apprService.retrieveUserAcctSignYn(params);
        const userAcctSignYn = res.data;

        // 결과 리턴
        return userAcctSignYn;
      } catch (err) {
        console.log("ApprStore > fetchUserAcctSignYn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 결재선 저장
    async fetchCreateApprMst(params) {
      try {
        const res = await apprService.createApprMst(params);
        const userAcctSignYn = res.data;

        // 결과 리턴
        return userAcctSignYn;
      } catch (err) {
        console.log("ApprStore > fetchCreateApprMst > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 이전 결재자 조회
    async fetchPrevApprOver(params) {
      try {
        const res = await apprService.retrievePrevApprOver(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log("ApprStore > fetchPrevApprOver > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 결재 이력 현황 조회
    async fetchApprStatusHistList(params) {
      try {
        const res = await apprService.retrieveApprStatusHistList(params);

        // 결과 리턴
        return res.data.selectApprStatusHistList;
      } catch (err) {
        console.log("ApprStore > fetchApprStatusHistList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  // persist: {
  //   storage: sessionStorage,
  // },
});
