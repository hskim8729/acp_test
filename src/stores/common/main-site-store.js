import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import mainSiteService from "@/api/common/main-site-service";

export const useMainSiteStore = defineStore("mainSiteStore", {
  id: "mainSiteStore",
  state: () => ({
    // 대시보드(현장)
    dashBoardSiteList: reactive([]), // 현장 공지사항
    sftyHlthBbsList: reactive([]), // 현장 자료실
    sftyHlthPstrBbsList: reactive([]), // 현장 전사 포스터
    mngTrgtList: reactive([]), // 현장 안전보건 경영목표 포스터
    evalMtBsInfoList: reactive([]), // 현장 위험성 평가
    activitySafetyInspectionList: reactive([]), // 현장 안전 점검 조치
    dashboardTbmList: reactive([]), //tbm
    mainPopUserList: reactive([]), //사용자정보
    sftAtvtInspList: reactive([]), // 안전신호등 안전점수 조회
    safeTfclghtscrStngList: reactive([]), // 안전신호등 위험성 점검조치 조회
    riskEvalBbsList: reactive([]), // 위험성 조회
    majorIspBbsList: reactive([]), // 중점점검 조회
    MyWorkList: reactive([]),
    alarmTalkList: reactive([]),
    majorIspBbsCnt: reactive([]), // 중점점검 건수
    majorIspAppCnt: reactive([]), // 중점점검 승인 건수
    majorIspActCnt: reactive([]), // 중점점검 조치 건수
    majorIspTbmCnt: reactive([]), // TBM 건수

    addRskDscvCircuitReceipt: ref(0), // 순회점검 접수
    addRskDscvCircuitRegist: ref(0), // 순회점검 등록
    addRskDscvAchReceipt: ref(0), // 아차사고 접수
    addRskDscvAchRegist: ref(0), // 아차사고 등록
    addRskDscvWrkReceipt: ref(0), // 근로자제보 접수
    addRskDscvWrkRegist: ref(0), // 근로자제보 등록

    // 대시보드(협력회사)
    dashboardTbmList: reactive([]),
  }),
  getters: {
    getSiteSearchPostList: (state, value) => {
      return state.siteSearchPostList;
    },
  },
  actions: {
    // 현장 전체 조회
    async searchSiteList(params) {
      try {
        const res = await mainSiteService.searchSiteList(params);
        const dashBoardSiteList = res.data.selectDashBoardSiteList; // 공지사항
        const sftyHlthBbsList = res.data.selectSftyHlthBbsList; // 자료실
        const sftyHlthPstrBbsList = res.data.selectSftyHlthPstrBbsList; //포스터(첨부파일 이미지)
        const mngTrgtList = res.data.selectMngTrgtList; //경영목표(첨부파일 이미지)
        const evalMtBsInfoList = res.data.selectEvalMtBsInfoList; //위험성평가 회의 목록
        const activitySafetyInspectionList =
          res.data.selectActivitySafetyInspectionList; // 주간합동점검회의 목록
        const sftAtvtInspList = res.data.selectSftAtvtInspList; // 현장 안전신호등

        this.$patch({
          dashBoardSiteList,
          sftyHlthBbsList,
          sftyHlthPstrBbsList,
          mngTrgtList,
          evalMtBsInfoList,
          activitySafetyInspectionList,
          sftAtvtInspList,
        });
      } catch (err) {
        console.log("useMainSiteStore > saveSitePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 현장 포스터 저장
    async saveSitePostFile(params) {
      try {
        await mainSiteService.saveSitePostFile(params);
      } catch (err) {
        console.log("useMainSiteStore > saveSitePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 현장 안전보건 경영목표 삭제
    async deleteSitePostFile(params) {
      try {
        await mainSiteService.deleteSitePostFile(params);
      } catch (err) {
        console.log("useMainSiteStore > deleteSitePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },  
    // 현장 / 협력사 안전신호등 조회
    async selectSafeTfclghtscrStngList(params) {
      try {
        const res = await mainSiteService.selectSafeTfclghtscrStngList(params);
        console.log("안전신호등 res : ", res.data);
        const safeTfclghtscrStngList = res.data;

        this.$patch({
          safeTfclghtscrStngList,
        });
      } catch (err) {
        console.log(
          "useMainSiteStore > selectSafeTfclghtscrStngList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 안전점검 / 조치 차트 조회
    async selectSiteRiskEvalMajorIsp(params) {
      try {
        const res = await mainSiteService.selectSiteRiskEvalMajorIsp(params);
        const riskEvalBbsList = res.data.selectRiskEvalBbsList;
        const majorIspBbsList = res.data.selectMajorIspBbsList;
        const majorIspBbsCnt = res.data.selectMajorIspBbsCnt;
        const majorIspActCnt = res.data.selectMajorIspActCnt;
        const majorIspAppCnt = res.data.selectMajorIspAppCnt;
        const majorIspTbmCnt = res.data.selectMajorIspTbmCnt;

        this.$patch({
          riskEvalBbsList,
          majorIspBbsList,
          majorIspBbsCnt,
          majorIspActCnt,
          majorIspAppCnt,
          majorIspTbmCnt,
        });
      } catch (err) {
        console.log(
          "useMainSiteStore > selectSiteRiskEvalMajorIsp > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 현장 추가위험 점검
    async selectAddRskDscv(params) {
      try {
        const res = await mainSiteService.selectAddRskDscv(params);
        const addRskDscvCircuitReceipt =
          res.data.selectAddRskDscvCircuitReceipt; // 순회점검 접수
        const addRskDscvCircuitRegist = res.data.selectAddRskDscvCircuitRegist; // 순회점검 등록
        const addRskDscvAchReceipt = res.data.selectAddRskDscvAchReceipt; // 아차사고 접수
        const addRskDscvAchRegist = res.data.selectAddRskDscvAchRegist; //아차사고 등록
        const addRskDscvWrkReceipt = res.data.selectAddRskDscvWrkReceipt; // 근로자제보 접수
        const addRskDscvWrkRegist = res.data.selectAddRskDscvWrkRegist; // 근로자제보 등록

        this.$patch({
          addRskDscvCircuitReceipt,
          addRskDscvCircuitRegist,
          addRskDscvAchReceipt,
          addRskDscvAchRegist,
          addRskDscvWrkReceipt,
          addRskDscvWrkRegist,
        });
      } catch (err) {
        console.log("useMainSiteStore > selectAddRskDscv > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 협력사 전체 조회
    async selectDashBoardPartnerList(params) {
      try {
        const res = await mainSiteService.selectDashBoardPartnerList(params);
        const dashBoardSiteList = res.data.selectDashBoardPartnerList; // 공지사항
        const sftyHlthBbsList = res.data.selectSftyHlthBbsList; // 자료실
        const sftyHlthPstrBbsList = res.data.selectSftyHlthPstrBbsList; //포스터(첨부파일 이미지)
        const mngTrgtList = res.data.selectMngTrgtList; //경영목표(첨부파일 이미지)
        const evalMtBsInfoList = res.data.selectEvalMtBsInfoList; //위험성평가 회의 목록
        const activitySafetyInspectionList =
          res.data.selectActivitySafetyInspectionList; // 주간합동점검회의 목록
        const dashboardTbmList = res.data.selectDashboardTbmList; // TBM 목록
        const sftAtvtInspList = res.data.selectSftAtvtInspList; // 협력사 안전신호등

        this.$patch({
          dashBoardSiteList,
          sftyHlthBbsList,
          sftyHlthPstrBbsList,
          mngTrgtList,
          evalMtBsInfoList,
          activitySafetyInspectionList,
          dashboardTbmList,
          sftAtvtInspList,
        });
      } catch (err) {
        console.log("useMainSiteStore > saveSitePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 현장 포스터 저장
    async saveSitePostFile(params) {
      try {
        await mainSiteService.saveSitePostFile(params);
      } catch (err) {
        console.log("useMainSiteStore > saveSitePostFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 협력사 추가위험 점검
    async selectPartnerAddRisk(params) {
      try {
        const res = await mainSiteService.selectAddRskDscv(params);
        const addRskDscvCircuitReceipt = res.data.selectPartnerCircuitReceipt; // 순회점검 접수
        const addRskDscvCircuitRegist = res.data.selectPartnerCircuitRegist; // 순회점검 등록
        const addRskDscvAchReceipt = res.data.selectPartnerAchReceipt; // 아차사고 접수
        const addRskDscvAchRegist = res.data.selectPartnerAchRegist; //아차사고 등록
        const addRskDscvWrkReceipt = res.data.selectPartnerWrkReceipt; // 근로자제보 접수
        const addRskDscvWrkRegist = res.data.selectPartnerWrkRegist; // 근로자제보 등록

        this.$patch({
          addRskDscvCircuitReceipt,
          addRskDscvCircuitRegist,
          addRskDscvAchReceipt,
          addRskDscvAchRegist,
          addRskDscvWrkReceipt,
          addRskDscvWrkRegist,
        });
      } catch (err) {
        console.log("useMainSiteStore > selectPartnerAddRisk > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 메인 사용자 정보 팝업
    async selectMainPopUserList(params) {
      try {
        const res = await mainSiteService.selectMainPopUserList(params);
        const mainPopUserList = res.data.selectMainPopUserList;

        this.$patch({
          mainPopUserList,
        });
      } catch (err) {
        console.log("useMainSiteStore > selectMainPopUserList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 나의 할일 조회
    async selectMyWorkSearch(params) {
      try {
        const res = await mainSiteService.selectMyWorkSearch(params);
        const MyWorkList = res.data;

        this.$patch({
          MyWorkList,
        });

        return MyWorkList;
      } catch (err) {
        console.log("useMainSiteStore > selectMyWorkSearch > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 알람 리스트 조회
    async selectAlarmTalkList(params) {
      try {
        const res = await mainSiteService.selectAlarmTalkList(params);
        const alarmTalkList = res.data;

        this.$patch({
          alarmTalkList,
        });

        return alarmTalkList;
      } catch (err) {
        console.log("useMainSiteStore > selectAlarmTalkList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
  },
});
