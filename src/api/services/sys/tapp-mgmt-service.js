import { axiosApiDEV } from '@/api';

export default {
  // === 공종코드 관리 ===
  // 1.공종코드 리스트 조회
  searchList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    // 공종코드 리스트 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        // .post(`/v1/sys/selectCdMgmtList`, params)
        .post(`/v1/sys/selectTappMgmtList`, params) 
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });  
    });

  },

};
