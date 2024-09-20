import { axiosApiDEV } from "@/api";

export default {
  // 공지사항
  // 1. 공지사항 조회
  boardSelectList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/selectBbsList", param)
        .then((res) => {
          console.log("공지사항 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 공지사항
  // 2. 공지사항 저장
  saveBoardList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/saveBbs", param)
        .then((res) => {
          console.log("공지사항 저장 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 공지사항
  // 3. 공지사항 상세조회
  boardDetailSearch(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/selectBbsDetail", param)
        .then((res) => {
          console.log("공지사항 상세조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 공지사항
  // 4. 공지사항 파일 삭제
  boardDeleteFile(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/deleteFileBbs", param)
        .then((res) => {
          console.log("공지사항 파일 삭제 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 공지사항
  // 4. 공지사항 리스트 삭제
  deleteList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/saveBbs", param)
        .then((res) => {
          console.log("공지사항 리스트 삭제 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 알림소식
  // 4. 알림소식 리스트 조회
  getNotifyNewsList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/getNotifyNewsList", param)
        .then((res) => {
          console.log("알림소식 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 알림소식
  // 6. 알림소식 상세조회
  getNotifyNewsInfo(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/getNotifyNewsInfo", param)
        .then((res) => {
          console.log("알림소식 상세조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
