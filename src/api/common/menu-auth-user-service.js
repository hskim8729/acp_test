import { axiosApiDEV } from '@/api';

export default {
  // 메뉴권한에 따른 사용자 조회
  selectMenuAuthUserList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/selectPopMenuAuthUserList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },
  

};
