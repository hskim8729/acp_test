import { axiosApiDEV } from "@/api";

export default {
  // === 협력업체 관리 ===
  // 1. 협력업체 리스트 조회
  searchList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    // 협력업체 리스트 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/selectPartnerMgmtList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 2. 협력업체 사업자 번호 중복 검사
  savePartnerMgmtChk(params) {
    if (params === undefined || params === "") {
      params = {};
    }
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/savePartnerMgmtChk`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 3. 협력업체 master 저장
  saveMap(params) {
    if (params === undefined || params === "") {
      params = {};
    }
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/savepartnerMap`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4. 협력업체에 사용자가 있는지 확인
  getCompanyMemberCnt(params) {
    if (params === undefined || params === "") {
      params = {};
    }
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/sys/getCompanyMemberCnt`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
