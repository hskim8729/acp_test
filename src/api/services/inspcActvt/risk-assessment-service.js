import { axiosApiDEV } from "@/api";
import commonService from "@/api/common-service.js";

const baseURL = "/v1/inspcActvt";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // === 안전점검활동 서비스 ===

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

  // 위험성평가 회의 목록 조회
  retrieveRiskAssmnCnfrnList(params) {
    return commonService.axiosCall(
      "/v1/inspcActvt/selectRiskAssmnCnfrnList",
      params
    );
  },

  // 위험성평가 회의 상세 조회
  retrieveRiskAssmnCnfrnDetail(params) {
    return this.callApi(`selectRiskAssmnCnfrnDetail`, params);
  },

  // 위험성평가 회의 상세 대상공종 조회
  retrieveRiskAssmnCnfrnDetailContyList(params) {
    return this.callApi(`selectRiskAssmnCnfrnDetailContyList`, params);
  },

  // 위험성평가 회의 등록
  createRiskAssmnCnfrn(params) {
    return commonService.axiosCall(
      "/v1/inspcActvt/insertRiskAssmnCnfrn",
      params,
      headers
    );
  },

  // 위험성평가 회의 삭제
  deleteRiskAssmnCnfrn(params) {
    return commonService.axiosCall(
      "/v1/inspcActvt/deleteRiskAssmnCnfrn",
      params
    );
  },

  // 평가 회의 평가 표 작성자 삭제
  deleteEvalMtEvalTblWrtr(params) {
    return commonService.axiosCall(
      "/v1/inspcActvt/deleteEvalMtEvalTblWrtr",
      params
    );
  },

  // 위험성평가 회의 상태값 수정
  modifyRiskAssmnCnfrnStats(params) {
    return this.callApi(`updateRiskAssmnCnfrnStats`, params);
  },

  // 위험성평가 목록 조회
  retrieveRiskAssmnList(params) {
    return this.callApi(`selectRiskAssmnList`, params);
  },

  // 위험성평가 표 마스터 목록 조회
  retrieveRiskAssmnTblMstList(params) {
    return this.callApi(`selectRiskAssmnTblMstList`, params);
  },

  // 위험성평가 회의 등록
  createRiskAssmn(params) {
    return this.callApi(`insertRiskAssmn`, params, headers);
  },

  // 공사종류 코드목록 조회
  retrieveContyCdList(params) {
    return this.callApi(`selectContyCdList`, params);
  },

  // 공사종류 등록 및 수정
  modifyContyCd(params) {
    return this.callApi(`modifyContyCd`, params);
  },

  // 공사종류 등록 및 수정
  deleteContyCd(params) {
    return this.callApi(`deleteContyCd`, params);
  },

  // 위험성평가 표 목록 조회
  retrieveRiskAssmnTblList(params) {
    return this.callApi(`selectRiskAssmnTblList`, params);
  },

  // 회의 결재용 안전관리자, 현장소장 조회
  retrieveAuthUserList(params) {
    return this.callApi(`selectAuthUserList`, params);
  },

  // 위험성평가 회의 종료 후 마스터 정보 등록
  createRiskAssmnMst(params) {
    return this.callApi(`insertRiskAssmnMst`, params);
  },

  // 위험성평가 표 삭제
  deleteRiskEvalTbl(params) {
    return this.callApi(`deleteRiskEvalTbl`, params);
  },
};
