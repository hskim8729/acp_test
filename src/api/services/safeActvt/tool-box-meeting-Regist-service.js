import { axiosApiDEV } from "@/api";

export default {
  // 안전활동 TBM 등록
  // 1. 안전활동 TBM 등록 소속회사 조회
  searchVenderInfo(param) {
    // 소속회사 조회 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/selectVendrInfoList", param)
        .then((res) => {
          console.log("안전활동 TBM 등록 소속회사 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  searchRskFctrInfo(param) {
    // 위험요인 조회 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/selectPopRiskEvaltblMstList", param)
        .then((res) => {
          console.log("안전활동 TBM 등록 위험요인 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  saveToolBoxRegi(param) {
    // 위험요인 저장
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/saveToolBoxMeetingList", param, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("안전활동 TBM 등록 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  detailSearchToolBox(param) {
    // 상세조회
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/selectDetailToolBoxMeetingList", param)
        .then((res) => {
          console.log("안전활동 TBM 상세조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fileDelete(param) {
    // 파일 삭제
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/deleteFileToolBoxMeeting", param)
        .then((res) => {
          console.log("안전활동 TBM 파일삭제 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fileDownload(param) {
    // 파일 다운로드
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/file/download", param, {
          responseType: "blob",
        })
        .then((res) => {
          console.log("다운로드 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fileDownloadForExtern(param) {
    // 파일 다운로드 (외부용, 권한체크X)
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/file/downloadForExtern", param, {
          responseType: "blob",
        })
        .then((res) => {
          console.log("다운로드 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // TBM (모바일)
  // 번역언어 list 조회
  transLanguageList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/transLanguageList", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 1. TBM 번역
  translateTbmList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/translateTbmList", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2. TBM 참석자 등록
  saveTbmAttnd(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/saveTbmAttnd", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
   // TBM 일자 valid 
   tbmValidCheck(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/tbmValidCheck", param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
