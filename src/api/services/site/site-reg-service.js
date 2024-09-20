import { axiosApiDEV } from '@/api';

export default {
  // === 현장 > 현장등록 ===

  // 현장 목록 조회
  selectSiteOpenList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/site/selectSiteOpenList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 안전관리자 목록 조회
  selectMgmtUser(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/site/selectMgmtUser`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 현장등록 저장 또는 삭제
  saveSiteOpenList(params) {
    if(params === undefined || params === ""){
      params = {};
    }
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/site/saveSiteOpenList`, params, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 첨부파일 삭제
  deleteFileSiteOpen(params) {
    if(params === undefined || params === ""){
      params = {};
    }
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/site/deleteFileSiteOpen`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

   // 현장 등록 체크 ( 추후 개발: 고객 가입 여부에 따른 현장 등록 수 체크)
   selectSiteOpenChk(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/site/selectSiteOpenChk`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

};
