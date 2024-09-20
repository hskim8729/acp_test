import { axiosApiDEV } from "@/api";

export default {
  // == 위험요인 표준(현장) 관리 ==
  // 1. 현장위험요인 템플릿 조회
  // 만약 이값이 없다면 현장위험요인이 없기때문에 전사템플릿띄우기 
  getTemplateList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteStdMgmtRiskFactorStandardList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2. 대분류
  getLgCatList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskLgCatCdList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 3. 중분류
  getMdCatList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskMdCatCdList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4. 작업명 조회
  getWrkList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskWrkNmList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5. 위험 요인, 감소대책 조회
  getRskFctrMsrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskFctrMsrList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5-1. 위험 요인 조회
  getRskFctrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskFctrList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5-2. 감소대책 조회
  getRskMsrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskMsrList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 6. 현장 표준 위험요인 등록
  saveSiteStdMgmtRiskFactorStandardList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteStdMgmtRiskFactorStandardList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 7. 현장 대분류 표시여부 저장
  saveSiteRiskLgCatCdList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteRiskLgCatCdList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 8. 현장 중분류 표시여부 저장
  saveSiteRiskMdCatCdList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteRiskMdCatCdList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 9. 현장 작업명 표시여부 저장
  saveSiteRiskWrkNmList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteRiskWrkNmList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 10. 현장 위험요인 표시여부 저장
  saveSiteRiskFctrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteRiskFctrList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  
  // 11. 현장 감소대책 표시여부 저장
  saveSiteRiskMsrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveSiteRiskMsrList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },



};
