import { axiosApiDEV } from '@/api';

export default {
  // === 권한 관리 서비스 ===

  // 1-1. 회원사 메뉴 - (슈퍼바이저) 전체 메뉴 목록
  selectAllMenuList() {
    var menuUrl = '/v1/sys/selectAllMenuList';
    
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .get(menuUrl)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 1-2. 회원사 메뉴 - 회원사 리스트
  selectCompanyList() {
    var menuUrl = '/v1/sys/selectCompanyList';
    
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .get(menuUrl)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 1-3. 회원사 메뉴 - 회원사 선택에 따른 회원사 권한 메뉴 목록
  selectComMenuList(vendrCd) {
    var menuUrl = '/v1/sys/selectComMenuList';
    
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(menuUrl, vendrCd)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },
  // 1-4. 회원사 메뉴 - 회원사 메뉴 추가
  addMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/addComMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 1-5. 회원사 메뉴 - 회원사 메뉴 삭제
  delMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/delComMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 2-1 메뉴 - 전체 메뉴 목록
  selectMenuList(params) {
    
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/selectMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2-2 메뉴 - 권한 리스트
  getMenuAuthList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/getMenuAuthList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2-3 메뉴 - 권한 선택에 따른 메뉴 리스트
  selectAuthMenuList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/selectAuthMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2-4. 메뉴 - 권한 메뉴 추가
  addAuthMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/addAuthMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 2-5. 메뉴 - 권한 메뉴 쓰기 여부 수정
  updateAuthMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/updateAuthMenu`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 2-6. 메뉴 - 권한 메뉴 삭제
  delAuthMenu(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/delAuthMenuList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 2-7. 메뉴 - 권한 추가, 수정, 삭제
  updateAuth(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/updateAuth`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

  // 3-1 사용자 - 회사 코드에 따른 전체 사용자 리스트
  getUserList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/getUserList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 3-2 사용자 - 권한 선택에 따른 사용자 리스트
  getUserAuthList(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/getUserAuthList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 3-3 사용자 - 추가, 삭제
  updateUserAuth(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/updateUserAuth`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

};
