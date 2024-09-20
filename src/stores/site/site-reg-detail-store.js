import siteRegDetailService from "@/api/services/site/site-reg-detail-service";
import cdMgmtService from "@/api/services/sys/cd-mgmt-service";
import { defineStore } from "pinia";

export const useSiteRegDetailStore = defineStore("siteRegDetailStore", {
  id: "siteRegDetail",

  state: () => ({
    // 현장 등록 상세 목록
    selectSiteOverview: [],
    // 직원정보
    selectEmpList: [],
    // 직책코드 목록
    jbttlCdList: [],
    // 권한코드 목록
    authList: [],
    // 협력사 직원 코드 목록,
    lowerAuth: ["5000", "6000"],
  }),
  getters: {
    getJbttlCdList: (state, value) => {
      return state.jbttlCdList;
    },
    getAuthList: (state, value) => {
      return state.authList;
    },
    upperAuthList: (state) => {
      // 본사 직원 코드 목록
      const upper = state.authList.filter((item) => item.authClsCd === "T2202");
      return upper;
    },
    lowerAuthList: (state) => {
      // 본사 직원 코드 목록
      const lower = state.authList.filter((item) => item.authClsCd === "T2203");
      return lower;
    },
    matchedJbttlCd: (state) => {
      const matched = {
        1000: "T0100", // 관리자
        2000: "T0101", // 현장소장
        3000: "T0102", // 안전관리자
        4000: "T0103", // 관리감독자
        5000: "T0104", // 협력사 소장
        6000: "T0105", // 협력사 직원
      };
      return (authCd) => matched[authCd];
    },
  },
  actions: {
    // 현장 등록 상세 조회
    async fetchselectSiteOverview(params) {
      try {
        const res = await siteRegDetailService.selectSiteOverview(params);
        const selectSiteOverview = res.data;

        this.$patch({
          selectSiteOverview,
        });

        // 결과 리턴
        return selectSiteOverview;
      } catch (err) {
        console.log(
          "siteRegDetailStore > fetchselectSiteOverview > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장 등록 상세 조회
    async fetchselectEmpList(params) {
      try {
        const res = await siteRegDetailService.selectSiteOverview(params);
        const selectEmpList = res.data.selectSiteOverview.empList;

        this.$patch({
          selectEmpList,
        });

        // 결과 리턴
        return selectEmpList;
      } catch (err) {
        console.log("siteRegDetailStore > selectEmpList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 현장 인력 정보 선택된 데이터 삭제(로컬)
    async deleteEmpListRow(selectedRows) {
      // Set을 사용하여 선택된 행의 userId 값을 수집
      const selectedUserIds = new Set(selectedRows.map((row) => row.userId));
      // filter를 통해 원본 배열에서 선택된 항목을 제거
      this.selectEmpList = this.selectEmpList.filter(
        (data) => !selectedUserIds.has(data.userId)
      );
    },

    // 사용자 조회
    async selectSiteOverviewUserInfoList(params) {
      try {
        const res = await siteRegDetailService.selectSiteOverviewUserInfoList(
          params
        );
        const userInfoList = res.data;

        this.$patch({
          userInfoList,
        });

        // 결과 리턴
        return userInfoList;
      } catch (err) {
        console.log("siteRegDetailStore > userInfoList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 현장 개요, 직원정보 저장
    async fetchSiteDetailSave(params) {
      try {
        const res = await siteRegDetailService.saveSiteOverview(params);

        this.$patch({});

        return res;
      } catch (err) {
        console.log("siteRegDetailStore > fetchSiteDetailSave > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 직책 코드 조회
    async selectJbttlCdList() {
      try {
        const res = await cdMgmtService.retrieveComCodeDetail({ comCd: "T01" });
        const jbttlCdList = res.data.filter((item) => item.comCd !== "T0100");

        this.$patch({
          jbttlCdList,
        });

        // 결과 리턴
        return jbttlCdList;
      } catch (err) {
        console.log("siteRegDetailStore > selectJbttlCdList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 권한 조회
    async selectAuthList(params) {
      try {
        const res = await siteRegDetailService.selectAuthList(params);
        const authList = res.data;

        this.$patch({
          authList,
        });

        // 결과 리턴
        return authList;
      } catch (err) {
        console.log("siteRegDetailStore > selectAuthList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 첨부퍄일 삭제
    async deleteFileSiteOverview(params) {
      try {
        const res = await siteRegDetailService.deleteFileSiteOverview(params);

        this.$patch({});

        // 결과 리턴
        return res;
      } catch (err) {
        console.log(
          "siteRegDetailStore > deleteFileSiteOverview > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    setPopupElement(element) {
      this.popupElement = element;
    },
  },
});
