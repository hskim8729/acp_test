import { axiosApiDEV } from "@/api";
export default {
  // 대시보드(현장)
  // 1. 현장 전체 조회
  searchSiteList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectDashBoardSiteList", param)
        .then((res) => {
          console.log("대시보드 현장 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2. 현장 포스터 등록
  saveSitePostFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/saveDashboardFile", param)
        .then((res) => {
          console.log("대시보드 현장 포스터 등록 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 3. 추가위험 점검
  selectAddRskDscv(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectAddRskDscv", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4. 현장 / 협력사 안전신호등 조회
  selectSafeTfclghtscrStngList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectSafeTfclghtscrStngList", param)
        .then((res) => {
          console.log("대시보드 현장 / 협력사 안전신호등 조회 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5. 안전점검 / 조치 조회
  selectSiteRiskEvalMajorIsp(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectSiteRiskEvalMajorIsp", param)
        .then((res) => {
          console.log("대시보드 안전점검 / 조치 조회 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 대시보드(협력회사)
  // 1. 협력회사 전체 조회
  selectDashBoardPartnerList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectDashBoardPartnerList", param)
        .then((res) => {
          console.log("대시보드 협력회사 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2. 추가위험 점검 조회
  selectPartnerAddRisk(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectPartnerAddRisk", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 현장 사용자 정보 팝업
  selectMainPopUserList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectMainPopUserList", param)
        .then((res) => {
          console.log("현장 사용자 정보 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 나의 할일 조회
  selectMyWorkSearch(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/main/selectMyWorkSearch", param)
        .then((res) => {
          console.log("나의 할일 정보 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 알람 리스트 조회
  selectAlarmTalkList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectAlarmTalkList", param)
        .then((res) => {
          console.log("알람 리스트 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 현장 안전보건 경영목표 삭제
  deleteSitePostFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/deleteDashboardFile", param)
        .then((res) => {
          console.log("현장 안전보건 경영목표 삭제 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
