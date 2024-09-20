import { axiosApiDEV } from "@/api";
import commonService from "@/api/common-service.js";

export default {
  // 추가위험발굴
  // 1. 추가위험발굴 관리 조회
  searchList(commonParam) {
    return commonService.axiosCall(
      "/v1/adtnRisk/selectAdtnRiskDiscoveryList",
      commonParam
    );
  },

  // 추가위험발굴
  // 2. 추가위험발굴 리스트 삭제,등록,수정
  saveList(param) {
    return commonService.axiosCall("/v1/adtnRisk/saveAdtnRiskDiscovery", param);
  },

  // 추가위험발굴
  // 3. 추가위험발굴 파일 삭제
  deleteFile(param) {
    return commonService.axiosCall(
      "/v1/adtnRisk/deleteFileAdtnRiskDiscovery",
      param
    );
  },

  // 추가위험발굴
  // 4. 공종코드 조회
  TappMgmtList(param) {
    return commonService.axiosCall(
      "/v1/sys/selectTappMgmtListAndMyTapp",
      param
    );
  },

  // 추가위험발굴
  // 5. 추가위험 발굴 상세 조회
  searchDetailList(param) {
    return commonService.axiosCall(
      "/v1/adtnRisk/selectDetatilAdtnRiskDiscovery",
      param
    );
  },

  // 추가위험발굴
  // 6. 추가위험 위험성 조회
  adtnRiskSiteRuleList(param) {
    return commonService.axiosCall("/v1/adtnRisk/selectSiteExeRuleStd", param);
  },

  // 추가위험발굴
  // 7. 모바일 추가위험 저장,업데이트,삭제
  mobileSaveList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/adtnRisk/appSaveAdtnRiskDiscovery", param)
        .then((res) => {
          console.log(
            "모바일 추가위험 리스트 삭제,등록,수정 요청받음 >>>>>> ",
            res
          );
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 추가위험발굴
  // 8. 모바일 TEMP 파일 업데이트
  appTempFileUpdate(param) {
    return new Promise((resolve, reject) => {
      console.log("param Service : ", param);
      axiosApiDEV
        .post("/v1/adtnRisk/appTempFileUpdate", param)
        .then((res) => {
          console.log("모바일 TMEP 파일 업데이트 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 추가위험발굴
  // 9. 모바일 TEMP 파일 삭제
  appTempFileDelete(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/adtnRisk/appTempFileDelete", param)
        .then((res) => {
          console.log("모바일 TMEP 파일 삭제 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 추가위험발굴
  // 10. 순회점검 담당자 조회
  selectSiteOverviewUserInfoList(param) {
    return commonService.axiosCall(
      "/v1/adtnRisk/selectSiteOverviewUserInfoList",
      param
    );
  },
  // 추가위험발굴
  // 11. 추가위험발굴 리스트 삭제 전 조회
  deleteSearch(param) {
    return commonService.axiosCall(
      "/v1/adtnRisk/selectAdtnRiskDiscovery",
      param
    );
  },
};
