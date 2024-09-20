import { axiosApiDEV } from '@/api';

export default {
  // === 코드 관리 서비스 ===
  // 1.공통코드 조회
  retrieveComCodes(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/selectCdMgmtList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },
  // 2.공통 코드 관리 상세 조회
  retrieveComCodeDetail(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/selectCdMgmtDetailList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },
  // 3.공통코드 master 저장
  saveComCodes(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/saveCdMgmtList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4.공통코드 detail 저장
  saveComCodesDtl(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    // 코드관리 정보를 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/saveCdMgmtDetailList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

};
