import { axiosApiDEV } from '@/api';

export default {
  // === 메뉴 관리 서비스 ===
  // 1.메뉴 조회
  retrieveMenus(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        // .get(`/treeMenu`, params) //json-server Test
        .post(`/v1/sys/selectMenuMgmtList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2.메뉴 저장
  saveCurMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/saveMenuMgmtList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

};
