import { axiosApiDEV } from "@/api";

const baseURL = "/v1/safeActvt";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // === 중점점검 서비스 ===

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

  // 1. 중점점검활동 List
  searchListMajorIspActvt(params) {
    return this.callApi(`inspActv`, params);
  },

  // 2. 중점조치활동 List
  searchListMajorActActvt(params) {
    return this.callApi(`actActv`, params);
  },

  // 3. 중점조치승인 List
  searchListMajorActApprove(params) {
    return this.callApi(`actAprv`, params);
  },

  // 4. 중점점검현황
  selectPntInspDsctnSttusList(params) {
    return this.callApi(`selectPntInspDsctnSttusList`, params);
  },

  // 5. 안전활동 점검내역 조회
  selectPntInspDsctn(params) {
    return this.callApi(`selectPntInspDsctn`, params);
  },

  // 6. 안전활동 점검내역 등록
  savePntInspDsctn(params) {
    return this.callApi(`savePntInspDsctn`, params, headers);
  },

  // 6-1. 모바일 안전활동 점검내역 등록
  saveAppPntInspDsctn(params) {
    return this.callApi(`saveAppPntInspDsctn`, params, headers);
  },

  // 7. 조치자 현장 직원 정보 조회 (조치자 검색 팝업)
  selectPntActDsctnEmpInfoList(params) {
    return this.callApi(`selectPntActDsctnEmpInfoList`, params);
  },

  // 8. 안전활동 DATA 생성
  insertPntInspDsctn(params) {
    return this.callApi(`insertPntInspDsctn`, params);
  },

  // 9. 안전활동 조치내역 결재
  pntActDsctnApprMst(params) {
    return this.callApi(`pntActDsctnApprMst`, params);
  },

  // 10. 중점조치활동 상세 조회
  selectPntActDsctn(params) {
    return this.callApi(`selectPntActDsctn`, params);
  },
  // 11. 안전활동 조치사항 입력 여부 조회
  selectPntActDsctnCnt(params) {
    return this.callApi(`selectPntActDsctnCnt`, params);
  },
  // 12. 안전활동 조치사항 저장
  savePntActDsctn(params) {
    return this.callApi(`savePntActDsctn`, params);
  },
  // 12-1. 안전활동 조치사항 저장
  saveAppPntActDsctn(params) {
    return this.callApi(`saveAppPntActDsctn`, params);
  },
  // 13. 안전활동 조치사항 결재
  pntActDsctnApprMst(params) {
    return this.callApi(`pntActDsctnApprMst`, params);
  },
  // 13-1. 안전활동 조치사항 결재
  pntAppActDsctnApprMst(params) {
    return this.callApi(`pntAppActDsctnApprMst`, params);
  },
  // 13. 안전활동 점검내역 첨부파일 삭제
  deleteFilePntInspDsctn(params) {
    return this.callApi(`deleteFilePntInspDsctn`, params);
  },
  // 13. 안전활동 조치내역 첨부파일 삭제
  deleteFilePntActDsctn(params) {
    return this.callApi(`deleteFilePntActDsctn`, params);
  },
};
