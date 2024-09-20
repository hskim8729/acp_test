import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import VueCookies from "vue-cookies";

function onLoading(isLoading) {
  const dialogStore = useDialogStore();
  dialogStore.isLoadingDialog = isLoading;
}

export function setApiInterceptors(axiosApi) {
  // ====================================================================
  //  api 공통 설정
  // ====================================================================

  axiosApi.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
  axiosApi.defaults.withCredentials = true;

  // ====================================================================
  //  http 요청을 서버로 보내기 바로 전 처리
  // ====================================================================
  axiosApi.interceptors.request.use(
    async function (config) {
      onLoading(true);

      // Do something before request is sent
      const loginStore = useLoginAuthStore();

      // req 요청 시 AT가 유효하면 headers에 추가해서 요청
      const cookieAT = VueCookies.get(
        loginStore.$state.userInfo.userId + "_AT"
      );
      config.headers.Authorization = cookieAT;
      return config;
    },

    function (error) {
      // Do something with request error
      onLoading(false);
      return Promise.reject(error);
    }
  );

  // ====================================================================
  //  http 응답을 서비스로 리턴하기 전 처리
  // ====================================================================
  axiosApi.interceptors.response.use(
    async function (response) {
      // ====== 서버와 통신이 정상인 경우 ======
      // === 요청에 대한 응답을 컴포넌트 단에 넘겨주기 전 처리를 수행 ===
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data

      // === 파일 다운로드일 경우 바로 리턴하여 뒷 처리를 bypass ===
      if (
        response.headers["content-type"] &&
        response.headers["content-type"] === "application/octet-stream"
      ) {
        // bypass
        onLoading(false);
        return response;
      }

      // 로그인 인증 토큰 헤더에 담기
      //response.headers.Authorization = cookieAT;

      // response.data에 존재하는 서버에서 보낸 status, message, result를 추출
      if (response.data) {
        // response 객체에 svr 프리픽스로 상태 정보를 설정하고 data는 result로 overwrite
        response.svrStatus = response.data.status;
        response.svrMessage = response.data.message;
      } else {
        //console.log('=== axiosApi.interceptors > response.data null');
        response.svrCode = "";
        response.svrMessage = "";
        response.data = null;
      }

      /*console.log('======= axiosApi.interceptor.response log start =======');
      console.log('> api-interceptors res      ===!!=> ', response);
      console.log('> api-interceptors res.reqUrl      => ', response.config.url);
      console.log('> api-interceptors res.status      => ', response.status);
      console.log('> api-interceptors res.statusText  => ', response.statusText);
      console.log('> api-interceptors res.svrStatus   => ', response.svrStatus);
      console.log('> api-interceptors res.svrMessage  => ', response.svrMessage);
      console.log('> api-interceptors res.data        => ', response.data);
      console.log('> api-interceptors res.error        => ', response.error);
      console.log("> api-interceptors res.headers.authorization    => ", response.headers.authorization);
      
      console.log('======= axiosApi.interceptor.response log end =======');*/

      // --- 로그인 상태인 경우 토큰 처리 ---
      // === 로그인 상태이고 응답에 accessToken이 있으면 스토어와 쿠키에 저장 처리 ===
      // 로그인 응답이 경우는 뒤의 로그인 처리에서 아래 처리가 수행되므로 상관없음
      onLoading(false);
      return response;
    },

    async function (error) {
      // ====== 서버와 통신에 오류가 발생한 경우 ======
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // Axios는 API에서 300, 400, 500번대 응답이 오면 에러로 판단해 Promise.reject(AxiosError)를 반환
      // 상기 에러는 WAS서버 자체 에러와 서버의 프레임워크에서 throw한 에러도 포함된다.
      // 예를 들어, 401의 경우 인증이 안된 경우 error로 내려옴
      // 즉, 서버에서 오류를 던진 것도 내려오므로 필요한 처리 필요

      // response 에러 발생 시 서비스 단으로 보내기 전 error 처리
      error.httpStatus = error.response.status;
      error.statusText = error.response.statusText;

      if (error.response.data) {
        // error.response.svrStatus = error.response.data.error.status;
        if (
          error.response.data.error !== undefined &&
          error.response.data.error !== ""
        ) {
          // 에러메시지 관련 강인수 추가 231024
          error.svrCode = error.response.data.error.code;
          error.svrMessage = error.response.data.error.message;
        } else {
          error.svrCode = error.response.status;
          error.svrMessage = error.response.statusText;
        }
      } else {
        // error.response.svrStatus = null;
        error.svrCode = null;
        error.svrMessage = null;
      }

      /*console.log('=== axiosApi.interceptors.error -> ', error);

      console.log('======= axiosApi.interceptor.error log start =======');
      console.log('$$$ error.httpStatus =>', error.httpStatus);
      console.log('$$$ error.statusText =>', error.statusText);
      // console.log('$$$ error.svrStatus =>', error.svrStatus);
      console.log('$$$ error.svrCode =>', error.svrCode);
      console.log('$$$ error.svrMessage =>', error.svrMessage);
      console.log('======= axiosApi.interceptor.error log end =======');*/

      // 에러 메시지 alert
      // 로그인 및 비밀번호 변경은 auth관련이므로 httpStatus를 401로 처리
      if (error.httpStatus === 401) {
        error.svrMessage = "로그인 인증에 실패하였습니다.";

        VueCookies.remove("AT");
        window.sessionStorage.clear();

        // 로그아웃 후 이동할 경로 설정 (예: 로그인 페이지)
        location.href = "/login";

        // 로컬 logout action 호출하면 서비스의 then으로 내려가고 res도 undefined로
        // 내려가므로 여기서 처리하지 말고 종단인 LoginPage에서 처리 필요
      } else if (error.httpStauts === 409) {
        error.svrMessage = "비밀번호가 일치하지 않습니다.";
      } else {
        error.svrMessage = "요청에 실패하였습니다. 관리자에게 문의하세요";
      }

      const dialogStore = useDialogStore();
      dialogStore.openAlertDialog(error.svrMessage, { type: "error" });

      onLoading(false);

      return Promise.reject(error);
    }
  );

  return axiosApi;
}

export function setApiInterceptorsAI(axiosApiAI) {
  axiosApiAI.interceptors.request.use(
    async function (config) {
      const loginStore = useLoginAuthStore();
      if (config.url == "login") {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";

        const urlSearchParams = new URLSearchParams();
        for (const key in config.data) {
          urlSearchParams.append(key, config.data[key]);
        }
        config.data = urlSearchParams.toString();
      } else {
        config.headers["Content-Type"] = "application/json";
      }
      config.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
        "aiToken"
      )}`;

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosApiAI.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response) {
        // 서버 에러 발생
        console.error("HTTP Error", error.response.status, error.response.data);
      } else if (error.request) {
        // 요청 미전송
        console.error("Request Error", error.request);
      } else {
        console.error("Error", error.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosApiAI;
}
