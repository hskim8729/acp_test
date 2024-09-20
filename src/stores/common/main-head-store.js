import { defineStore } from "pinia";
import { reactive } from "vue";
import mainHeadService from "@/api/common/main-head-service";

export const useMainHeadStore = defineStore("mainHeadStore", {
  id: "mainHeadStore",
  state: () => ({
    mainSearchPostList: reactive([]), // 전사 포스터
    dashBoardAdmList: reactive([]), // 전사 공지사항
    sftyHlthBbsList: reactive([]), // 전사 안전보건 자료실
    siteBbsList: reactive([]), // 전사 현장목록
    dsstrTypeRiskFctrBbsList: reactive([]), // 전 현장 재해유형별 위험요인
    safeTfclghtscrStng: reactive([]), // 안전 신호등
    riskEvalBbsList: reactive([]), // 위험성 평가
    majorIspBbsList: reactive([]), // 중점점검 조치
  }),
  getters: {
    getMainSearchPostList: (state, value) => {
      return state.mainSearchPostList;
    },
    getDashBoardAdmList: (state, value) => {
      return state.dashBoardAdmList;
    },
    getSftyHlthBbsList: (state, value) => {
      return state.sftyHlthBbsList;
    },
    getSiteBbsList: (state, value) => {
      return state.siteBbsList;
    },
    getDsstrTypeRiskFctrBbsList: (state, value) => {
      return state.dsstrTypeRiskFctrBbsList;
    },
    getSafeTfclghtscrStng: (state, value) => {
      return state.safeTfclghtscrStng;
    },
    getRiskEvalBbsList: (state, value) => {
      return state.riskEvalBbsList;
    },
    getMajorIspBbsList: (state, value) => {
      return state.majorIspBbsList;
    },
  },
  actions: {
    // 전사 포스터 조회
    async searchPostFile(params) {
      try {
        const res = await mainHeadService.searchPostFile(params);
        const mainSearchPostList = res.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          mainSearchPostList,
        });

        // 결과 리턴
        console.log("mainSearchPostList : " + mainSearchPostList);
        return mainSearchPostList;
      } catch (err) {
        console.log("useMainHeadStore > mainSearchPostList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 전사 포스터 저장
    async savePostFile(params) {
      try {
        await mainHeadService.savePostFile(params);
      } catch (err) {
        console.log("useMainHeadStore > savePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 전사 포스터 첨부파일 삭제
    async deletePostFile(params) {
      try {
        await mainHeadService.deletePostFile(params);
      } catch (err) {
        console.log("useMainHeadStore > deletePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 전사 대시보드 조회 삭제
    async selectDashBoardAdmList(params) {
      try {
        const res = await mainHeadService.selectDashBoardAdmList(params);
        const dashBoardAdmList = res.data.selectDashBoardAdmList;
        const sftyHlthBbsList = res.data.selectSftyHlthBbsList;
        const siteBbsList = res.data.selectSiteBbsList;
        const dsstrTypeRiskFctrBbsList =
          res.data.selectDsstrTypeRiskFctrBbsList;

        this.$patch({
          dashBoardAdmList,
          sftyHlthBbsList,
          siteBbsList,
          dsstrTypeRiskFctrBbsList,
        });
      } catch (err) {
        console.log(
          "useMainHeadStore > selectDashBoardAdmList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // 전사 안전신호등 등록
    async saveSafeTfclghtscrStng(params) {
      try {
        await mainHeadService.saveSafeTfclghtscrStng(params);
      } catch (err) {
        console.log(
          "useMainHeadStore > saveSafeTfclghtscrStng > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // 전사 안전신호등 조회
    async selectSafeTfclghtscrStng(params) {
      try {
        const res = await mainHeadService.selectSafeTfclghtscrStng(params);
        const safeTfclghtscrStng = res.data.selectSafeTfclghtscrStng;

        this.$patch({
          safeTfclghtscrStng,
        });

        return safeTfclghtscrStng;
      } catch (err) {
        console.log(
          "useMainHeadStore > selectSafeTfclghtscrStng > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // 전사 현장모니터 조회
    async selectSiteRiskEvalMajorIsp(params) {
      try {
        const res = await mainHeadService.selectSiteRiskEvalMajorIsp(params);
        const riskEvalBbsList = res.data.selectRiskEvalBbsList;
        const majorIspBbsList = res.data.selectMajorIspBbsList;

        this.$patch({
          riskEvalBbsList,
          majorIspBbsList,
        });
      } catch (err) {
        console.log(
          "useMainHeadStore > selectSiteRiskEvalMajorIsp > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // 전사 현장모니터 조회
    async selectDsstrTypeRiskFctrBbsList(params) {
      try {
        const res = await mainHeadService.selectDsstrTypeRiskFctrBbsList(
          params
        );
        const dsstrTypeRiskFctrBbsList =
          res.data.selectDsstrTypeRiskFctrBbsList;

        this.$patch({
          dsstrTypeRiskFctrBbsList,
        });
      } catch (err) {
        console.log(
          "useMainHeadStore > selectDsstrTypeRiskFctrBbsList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
  },
});
