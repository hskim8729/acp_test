import { axiosApiDEV } from "@/api";

export default {
  // 대시보드
  // 1. 전사 포스터 조회
  searchPostFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectDashBoardPoster", param)
        .then((res) => {
          console.log("대시보드 전사 포스터 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 2. 전사 포스터 저장
  savePostFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/saveDashBoardPoster", param)
        .then((res) => {
          console.log("대시보드 전사 포스터 저장 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 3. 전사 포스터 첨부파일 삭제
  deletePostFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/deleteDashBoardPoster", param)
        .then((res) => {
          console.log(
            "대시보드 전사 포스터 첨부파일 삭제 요청받음 >>>>>> ",
            res
          );
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 4. 전사 대시보드 조회
  selectDashBoardAdmList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectDashBoardAdmList", param)
        .then((res) => {
          console.log("대시보드 전사 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 5. 안전신호등 등록
  saveSafeTfclghtscrStng(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/saveSafeTfclghtscrStng", param)
        .then((res) => {
          console.log("안전신호등 등록 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 6. 안전신호등 조회
  selectSafeTfclghtscrStng(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectSafeTfclghtscrStng", param)
        .then((res) => {
          console.log("안전신호등 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 7. 현장모니터 조회
  selectSiteRiskEvalMajorIsp(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectSiteRiskEvalMajorIsp", param)
        .then((res) => {
          console.log("현장모니터 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 대시보드
  // 8. 전현장 위험요인 조회
  selectDsstrTypeRiskFctrBbsList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/dashboard/selectDsstrTypeRiskFctrBbsList", param)
        .then((res) => {
          console.log("전현장 위험요인 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
