import { axiosApiDEV } from "@/api";

const baseURL = "/v1/common";

export default {
  // === 결재 서비스 ===

  // 공통적으로 사용할 API 호출 함수
  callApi(endpoint, params = {}, headers = {}) {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }

    const fullEndpoint = `${baseURL}/${endpoint}`;

    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(fullEndpoint, params, { headers })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 결재현황 조회
  retrieveApprStatusList(params) {
    return this.callApi(`selectApprStatusList`, params);
  },

  // 현재 결재자 조회
  retrieveApprover(params) {
    return this.callApi(`selectApprover`, params);
  },

  // 이전 결재자 조회
  retrievePrevApprOver(params) {
    return this.callApi(`selectPrevApprOver`, params);
  },

  // 사용자 사인 여부 조회
  retrieveUserAcctSignYn(params) {
    return this.callApi(`selectUserAcctSignYn`, params);
  },

  // 결재선 저장
  createApprMst(params) {
    return this.callApi(`saveApprMst`, params);
  },

  // 결재 이력 현황 조회
  retrieveApprStatusHistList(params) {
    return this.callApi(`selectApprStatusHistList`, params);
  },
};
