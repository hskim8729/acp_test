import loginAuthService from "@/api/common/login-auth-service";
import { defineStore } from "pinia";
import VueCookies from "vue-cookies";

export const useLoginAuthStore = defineStore("loginAuthStore", {
  id: "loginAuth",

  state: () => ({
    // 최초 메뉴 오픈 여부
    isFirstOpenMenu: false,
    // 현재 로그인한 사용자의 AccessToken, info 정보를 관리
    // accessToken 변수는 참조의 편리를 위해 토큰을 저장하고 실제로는
    // 쿠키에 저장된 토큰이 실제 요청 시나 체크 시에 사용됨
    // 사용자 ID와 PW를 통한 토큰생성
    accessToken: "",
    // 로그인 시 ID 저장 체크박스 버튼 활성화 유무(웹)
    idSave: false,
    // 자동 로그인 [로그인 시 ID 저장 체크박스 버튼 활성화 유무(모바일)]
    keepLogin: false,
    // 웹, 모바일 구분 값 [ 웹(W), 모바일(M) ]
    gubun: "",
    // 사용자정보
    userInfo: {},
    // 회사 정보
    vendrInfo: {},
    // 권한 정보
    authInfo: {},
    // 메뉴 정보
    menuInfo: {},
    // 현장 정보 ( 인력 정보 )
    siteInfo: {},
    // 현장이 1곳 이상 시 리스트에 담기
    siteList: {},
    // 현장 리스트 index
    siteIndex: 0,
    // 목록에서 선택한 상세정보
    selectSiteInfo: {},
  }),

  getters: {
    // 인증(토큰+내정보)여부 리턴
    isAuthorized: (state) => {
      return (
        state.accessToken.length > 0 &&
        !!VueCookies.get(state.userInfo.userId + "_AT")
      );
    },
    isSiteAgreYn: (state) => {
      return state.siteInfo.agreYn === "Y" ? true : false;
    },
  },

  actions: {
    // 중복 로그인 확인
    async checkDuplicated(params) {
      try {
        const res = await loginAuthService.login(params);
        return res;
      } catch (err) {
        console.log("LoginAuthStore > checkDuplicated > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 처리
    async login(params) {
      try {
        //로그인 정보
        const res = await loginAuthService.vendrLogin(params);
        console.log("login-auth-store res =====", res);
        // 로그인 상태의 토큰 정보는 interceptors에서도 스토어와 쿠키에 저장 처리

        const userInfo = res.data.userInfo;
        const vendrInfo = res.data.vendrInfo;

        if (res.status === 200) {
          const accessToken = res.headers.authorization;

          // 쿠키 만료기간 설정(설정 시점 기준 accessToken:60분)
          const atExpTime =
            import.meta.env.VITE_APP_COOKIE_EXPIRE_TIME_AT || "7d";

          // AccessToken을 쿠키에 저장
          VueCookies.set(userInfo.userId + "_AT", accessToken, atExpTime);

          if (this.gubun === "W") {
            // 이메일 저장 체크(웹)
            if (this.idSave) {
              //debugger;
              sessionStorage.setItem("userId", params.userId);
              sessionStorage.setItem("userPw", userInfo.userPw);
              sessionStorage.setItem("accessToken", accessToken);

              // localStorage에 사용자 id, pw 저장
              localStorage.setItem("wUserId", params.userId);
            } else {
              // 로그아웃 클릭 시 localStorage 삭제 (id)
              window.localStorage.removeItem("wUserId");
            }
          }

          // 모바일
          if (this.gubun === "M") {
            // 이메일 저장 체크(모바일)
            if (this.keepLogin) {
              //debugger;
              sessionStorage.setItem("userId", params.userId);
              sessionStorage.setItem("userPw", userInfo.userPw);
              sessionStorage.setItem("accessToken", accessToken);

              // localStorage에 사용자 id, pw 저장
              window.localStorage.setItem("mUserId", params.userId);

              var userPw = userInfo.userPw;
              // 자동로그인인 비밀번호 저장
              if (userPw.indexOf("==") > -1) {
                localStorage.setItem("mUserPw", userInfo.userPw);
              }
            }
          }

          // AccessToken과 사용자관련 정보를 스토어에 저장
          this.$patch({
            accessToken,
          });
          this.$patch({
            userInfo,
            vendrInfo,
          });
        }
        return res;
      } catch (err) {
        //console.log("LoginAuthStore > login > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 사용자 로그인 처리
    async pubLogin(pubLoginParams) {
      try {
        //로그인 정보
        const res = await loginAuthService.pubLogin(pubLoginParams);
        console.log("login-auth-store res =====", res);
        // 로그인 상태의 토큰 정보는 interceptors에서도 스토어와 쿠키에 저장 처리

        const userInfo = res.data.userInfo;
        const vendrInfo = res.data.vendrInfo;

        if (res.status === 200) {
          const accessToken = res.headers.authorization;

          // 쿠키 만료기간 설정(설정 시점 기준 accessToken:60분)
          const atExpTime =
            import.meta.env.VITE_APP_COOKIE_EXPIRE_TIME_AT || "7d";

          // AccessToken을 쿠키에 저장
          VueCookies.set(userInfo.userId + "_AT", accessToken, atExpTime);

          // AccessToken과 사용자관련 정보를 스토어에 저장
          this.$patch({
            accessToken,
          });
          this.$patch({
            userInfo,
            vendrInfo,
          });
        }
        return res;
      } catch (err) {
        //console.log("LoginAuthStore > login > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 후 권한 정보
    async userAuthInfo(params) {
      try {
        const res = await loginAuthService.userAuthInfo(params);
        console.log("login-auth-store userAuthInfo res =====", res);
        const authInfo = res.data;

        this.$patch({
          authInfo,
        });

        return res;
      } catch (err) {
        console.log("LoginAuthStore > userAuthInfo > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 후 메뉴 정보
    async vendrMenuInfo(params) {
      try {
        const res = await loginAuthService.vendrMenuInfo(params);
        console.log("login-auth-store vendrMenuInfo res =====", res);
        const menuInfo = res.data;

        this.$patch({
          menuInfo,
        });

        return res;
      } catch (err) {
        console.log("LoginAuthStore > vendrMenuInfo > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 후 현장 목록정보
    async siteBsInfo(params) {
      try {
        const res = await loginAuthService.siteBsInfo(params);
        console.log("login-auth-store siteBsInfo res =====", res);
        const siteList = res.data;

        this.$patch({
          siteList,
        });

        return res;
      } catch (err) {
        console.log("LoginAuthStore > siteBsInfo > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 후 현장 선택에 따른 현장 인력 정보
    async getSiteMnpwrInfo(params) {
      try {
        const res = await loginAuthService.getSiteMnpwrInfo(params);
        console.log("login-auth-store getSiteMnpwrInfo res =====", res);
        const siteInfo = res.data;

        this.$patch({
          siteInfo,
        });

        return res;
      } catch (err) {
        console.log("LoginAuthStore > getSiteMnpwrInfo > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 비밀번호 재설정
    async updateRstUserPw(params) {
      try {
        const res = await loginAuthService.updateRstUserPw(params);
        return res;
      } catch (err) {
        console.log("LoginAuthStore > setPassword > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로그인 후 메뉴 정보
    async selectUserLogin(vendrParams) {
      try {
        const res = await loginAuthService.selectUserLogin(vendrParams);
        console.log("login-auth-store selectUserLogin res =====", res);
        const userLoginInfo = res.data;

        this.$patch({
          userLoginInfo,
        });

        return userLoginInfo;
      } catch (err) {
        console.log("LoginAuthStore > selectUserLogin > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 로컬 로그아웃 처리
    // 저장된 토큰 및 사용자관련 정보를 모두 초기화하고 로그아웃
    logout() {
      this.initStore();
      this.initStorage();

      location.href = "/login";
      // location.reload();   // 권한이 걸려있을때만 동작
    },

    initStore() {
      // request header의 AT(AccessToken) 토큰 삭제
      VueCookies.remove("AT");

      this.$reset();
    },

    initStorage() {
      // 로그인 페이지 처음 표시할 때 storage 초기화
      // 로그아웃할때 처리하면 로그인 페이지가 마운트될때 초기화되는 건지 알 수 없지만
      // 값이 없는 키가 표시되어 보기 좋지 않기 때문
      // piniaPluginPersistedstate clear
      // window.localStorage.clear();
      window.sessionStorage.clear();
      console.log("loginAuthStore > initStorage() executed...!!!");
    },
  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  persist: {
    enabled: true,
    storage: sessionStorage,
  },
});
