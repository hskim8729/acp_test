import commonService from "@/api/common-service.js";

export default {
  // 현장 개요 조회
  selectSiteOverview(params) {
    return commonService.axiosCall("/v1/site/selectSiteOverview", params);
  },

  // 사용자 조회
  selectSiteOverviewUserInfoList(params) {
    return commonService.axiosCall(
      "/v1/site/selectSiteOverviewUserInfoList",
      params
    );
  },

  // 현장개요, 직원정보 저장
  saveSiteOverview(params) {
    const headers = { "Content-Type": "multipart/form-data" };
    return commonService.axiosCall(
      "/v1/site/saveSiteOverview",
      params,
      headers
    );
  },

  // 현장 직원 정보 저장 시 권한코드 list
  selectAuthList(params) {
    return commonService.axiosCall("/v1/site/selectUserAuthList", params);
  },

  // 직원정보 삭제
  deleteSiteOverview(params) {
    return commonService.axiosCall("/v1/site/deleteSiteUser", params);
  },

  // 첨부파일삭제
  deleteFileSiteOverview(params) {
    return commonService.axiosCall("/v1/site/deleteFileSiteOverview", params);
  },
};
