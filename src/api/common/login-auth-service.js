import { axiosApiDEV } from "@/api";
import commonService from "@/api/common-service.js";

export default {
  // === 로그인 서비스 ===

  // 1.tapp 로컬 로그인 ()
  login(userInfo) {
    // 인증이 완료되면 AccessToken, 사용자 정보(회사코드, 사용자 ID, 사용자 비밀번호)
    // 정보를 리턴
    return commonService.axiosCall("/v1/common/login", userInfo);
  },

  // 1.tapp 로컬 로그인 ()
  pubLogin(userInfo) {
    // 인증이 완료되면 AccessToken, 사용자 정보(회사코드, 사용자 ID, 사용자 비밀번호)
    // 정보를 리턴
    return commonService.axiosCall("/v1/common/pubLogin", userInfo);
  },

  // 로그인 후 권한 정보 조회
  userAuthInfo(param) {
    return commonService.axiosCall("/v1/common/userAuthInfo", param);
  },

  // 로그인 후 메뉴 정보 조회
  vendrMenuInfo(param) {
    return commonService.axiosCall("/v1/common/vendrMenuInfo", param);
  },

  // 로그인 후 현장 목록 조회
  siteBsInfo(param) {
    return commonService.axiosCall("/v1/common/siteBsInfo", param);
  },

  // 로그인 후 현장 인력 정보 조회
  getSiteMnpwrInfo(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/getSiteMnpwrInfo`, param)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // ID가 중복일 시 회원사 선택 후 재로그인
  vendrLogin(userInfo) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/vendrLogin`, userInfo)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 회원사 무료가입
  join(params) {
    return commonService.axiosCall("/v1/main/saveJoinService", params);
  },

  // 로그인 정보의 메뉴권한
  authMenu(userInfo) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/authMenu`, userInfo)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //비밀번호 재설정
  updateRstUserPw(params) {
    return commonService.axiosCall("/v1/common/updateRstUserPw", params);
  },

  //비밀번호 초기화
  updateUserTempPw(params) {
    return commonService.axiosCall("/v1/common/updateUserTempPw", params);
  },

  // 비밀번호 초기화 시 사용자 정보 인증
  isValidUser(params) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/isValidUser`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 휴대폰 인증번호 발송
  sendNotificationTalk(params) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/sendNotificationTalk`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // push 알림
  sendPush(params) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/sendPush`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 사용자 로그인 화면 조회
  selectUserLogin(vendrParams) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/common/selectUserLogin`, vendrParams)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 산업구분 공통코드 조회
  selectIndstClsCdList() {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/main/selectIndstClsCdList`)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
