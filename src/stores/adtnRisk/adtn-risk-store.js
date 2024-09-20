import adtnRiskService from "@/api/services/adtnRisk/additional-risk-discovery-service.js";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { defineStore } from "pinia";

export const useAdtnRiskStore = defineStore("adtnRiskStore", {
  id: "adtnRiskStore",
  state: () => ({
    searchList: [], // 추가위험발굴 리스트
    TappMgmtList: [], // 공종 코드
    detailList: [], // 게시글 상세 조회
    detailFiles: [], // detailList 안의 파일목록
    siteRuleList: [],
    deleteSearchList: [],
  }),
  getters: {
    commonParam: (state, value) => {
      const loginAuth = useLoginAuthStore();
      console.log(loginAuth.$state.userInfo.userId);
      return {
        vendrCd: loginAuth.$state.siteInfo.vendrCd,
        siteCd: loginAuth.$state.siteInfo.siteCd,
        userId: loginAuth.$state.userInfo.userId,
        psitnVendrCd: loginAuth.$state.userInfo.vendrCd,
      };
    },
    getList: (state, value) => {
      return state.searchList;
    },
    getTappMgmtList: (state, value) => {
      return state.TappMgmtList;
    },
    getDetailList: (state, value) => {
      return state.detailList;
    },
    getSiteRuleList: (state, value) => {
      return state.siteRuleList;
    },
  },
  actions: {
    // 추가위험발굴 리스트 조회
    async adtnRiskSerchList(param) {
      const combinedParams = {
        ...this.commonParam,
        ...param,
      };
      const res = await adtnRiskService.searchList(combinedParams);
      const searchList = res.data;
      // 스토어 추가위험발굴 리스트값 업데이트 .
      this.$patch({
        searchList,
      });
      return searchList;
    },
    // 추가위험발굴 리스트 삭제 전 조회
    async adtnRiskDeleteSearch(param) {
      try {
        const res = await adtnRiskService.deleteSearch(param);
        const deleteSearchList = res.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          deleteSearchList,
        });

        // 결과 리턴
        return deleteSearchList;
      } catch (err) {
        console.log("useAdtnRiskStore > adtnRiskDeleteSearch > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 추가위험발굴 리스트 삭제, 등록, 수정
    async adtnRiskDeleteList(param) {
      // const combinedParams = {
      //   ...this.commonParam,
      //   ...param,
      // };
      const res = await adtnRiskService.saveList(param);
      if (res.status === 200) {
        this.adtnRiskSerchList();
      }
    },

    // 추가위험발굴 리스트 삭제 첨부파일
    async adtnRiskDeleteFile(param) {
      try {
        await adtnRiskService.deleteFile(param);

        // 결과 리턴
        //console.log("res : " + res);
      } catch (err) {
        console.log("useAdtnRiskStore > adtnRiskDeleteFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 공종 코드 조회
    async adtnRiskTappMgmtList() {
      const res = await adtnRiskService.TappMgmtList(this.commonParam);

      if (res.status === 200) {
        const TappMgmtList = res.data;
        this.$patch({
          TappMgmtList,
        });
        return res.status;
      } else {
        return res.status;
      }
    },

    // 추가위험 발굴 상세 조회
    async searchDetailList(param) {
      try {
        const res = await adtnRiskService.searchDetailList(param);
        const detailList = res.data;

        const files = detailList.map((item) => {
          if (item.filePath) {
            return {
              filePath: item.filePath,
              fileNm: item.fileNm,
              fileSeq: item.fileSeq,
              atchFileKey: item.atchFileKey,
            };
          }
        });

        this.$patch({
          detailList,
          detailFiles: files,
        });

        // 결과 리턴
        console.log("res : " + res);
        return detailList;
      } catch (err) {
        console.log("useAdtnRiskStore > detailList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 추가위험 위험성 조회
    async adtnRiskSiteRuleList() {
      const res = await adtnRiskService.adtnRiskSiteRuleList(this.commonParam);

      if (res.status === 200) {
        const siteRuleList = res.data;
        this.$patch({
          siteRuleList,
        });
        return res.status;
      } else {
        return res.status;
      }
    },

    // 추가위험 모바일 저장
    async mobileSaveList(param) {
      try {
        await adtnRiskService.mobileSaveList(param);
      } catch (err) {
        console.log("useAdtnRiskStore > mobileSaveList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 추가위험 모바일 TEMP 파일 업데이트
    async appTempFileUpdate(param) {
      try {
        console.log("param Store : ", param);
        await adtnRiskService.appTempFileUpdate(param);
      } catch (err) {
        console.log("useAdtnRiskStore > appTempFileUpdate > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 추가위험 모바일 TEMP 파일 업데이트
    async appTempFileDelete(param) {
      try {
        await adtnRiskService.appTempFileDelete(param);
      } catch (err) {
        console.log("useAdtnRiskStore > appTempFileDelete > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 순회점검 담당자 조회
    async selectSiteOverviewUserInfoList(param) {
      try {
        const res = await adtnRiskService.selectSiteOverviewUserInfoList(param);
        return res.data;
      } catch (err) {
        console.log(
          "useAdtnRiskStore > selectSiteOverviewUserInfoList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
  },
});
