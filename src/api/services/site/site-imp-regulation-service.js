import { axiosApiDEV } from '@/api';

export default {
  // === 실시규정 표준(현장) 관리 ===
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
  saveSiteImpRegulation(params) {
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

  // 3. 현장 실시규정 표준 결재
  apprSiteImpRegulation(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/stdMgMtStdImpRgltApprMst`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4. 현장인력 동의
  updateAgreYn(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/updateAgreYn`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 현장별 실시규정 존재 여부 조회
  selectSiteStdMgMtStdImpRgltCnt(params) {
    if(params === undefined || params === ""){
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteStdMgMtStdImpRgltCnt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 현장별 위험요인 존재 여부 조회
  selectSiteRiskMstCnt(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSiteRiskMstCnt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 현장별 실시규정 최종승인 여부 조회
  siteApprCnt(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/siteApprCnt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },



};
