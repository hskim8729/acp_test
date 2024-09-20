import { axiosApiDEV } from '@/api';

export default {
  // === 코드 관리 서비스 ===
  // 1.전체 공통코드 조회
  retrieveAllComCodes(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    // 코드관리 정보를 리턴
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
  

};
