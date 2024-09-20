import { axiosApiDEV } from '@/api';

export default {
  // 메뉴권한에 따른 사용자 조회
  selectMySignMgmt(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/main/selectMySignMgmt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // ---------- 서명 파일 등록 -------------------
  saveMySignMgmt(params) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/main/saveMySignMgmt`, params, {
           headers: {
              'content-type': 'multipart/form-data'
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
  

};
