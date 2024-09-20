import { axiosApiDEV } from "@/api";
import commonService from "@/api/common-service.js";

const baseURL = "/v1/file";
const headers = { "Content-Type": "multipart/form-data" };
const blobHeaders = { responseType: "blob" };

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
        .post(fullEndpoint, params, headers)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 파일다운로드
  fileDownload(params) {
    return this.callApi(`download`, params, blobHeaders);
  },
  // 파일 삭제
  removeFile(params) {
    return this.callApi(`removeFile`, params);
  },
  // 첨부파일 목록 조회
  retrieveAtchFileList(params) {
    return commonService.axiosCall(baseURL + "/selectAtchFile", params);
  },
  // 첨부파일 삭제
  deleteAtchFile(params) {
    return commonService.axiosCall(baseURL + "/deleteAtchFile", params);
  },
};
