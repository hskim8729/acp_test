import { axiosApiDEV } from '@/api';

export default {
  // === 실시규정 포준(전사) 관리 ===
  // 1.실시규정 리스트 조회
  searchList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    // 실시규정 리스트 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectStdMgMtStdImpRgltList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2.실시규정 표준 저장
  saveStdMgMtStdImpRglt(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveStdMgMtStdImpRglt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

};
