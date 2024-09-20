import { axiosApiDEV } from "@/api";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

export default {
  // 1-1. post방식 호출
  async axiosCall(url, params = {}, headers = {}) {
    //const params = this.setParamSession(param);

    if (!url) {
      throw new Error("URL이 없습니다.");
    }

    // console.log(`호출 url: ${url} / param: `, params);
    return await axiosApiDEV
      .post(url, params, { headers })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error: ", error);
        throw error;
      });
  },

  // 1-2. get방식 호출
  axiosCallGet(url, params, headers) {
    if (!url) {
      throw new Error("url is required");
    }

    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .get(url, params, { headers })
        .then((res) => {
          // console.log(`url: ${url} / param,result: `, params, res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  setParamSession(param) {
    // 이거는 필요시..? 논의해보고
    const loginStore = useLoginAuthStore();

    // 로그인정보, 현장정보 세션 정보로 세팅
    const userInfo = loginStore.$state.userInfo;
    if (userInfo) {
      Object.assign(param, userInfo);
    }

    const siteInfo = loginStore.$state.siteInfo;
    if (siteInfo) {
      Object.assign(param, siteInfo);
    }

    return param;
  },

  /** SSE(Server Sent Event) 생성  */
  createEventSorce(url, params = {}) {
    const headerData = {
      "Content-Type": "text/event-stream",
      aiToken: `Bearer ${sessionStorage.getItem("aiToken")}`,
    };

    const token = sessionStorage.getItem("aiToken");
    const requestUrl = import.meta.env.VITE_APP_API_DEV_URL + url;
    const urlParams = new URLSearchParams(params);
    const fullUrl = `${requestUrl}?${urlParams.toString()}`;

    return new EventSource(fullUrl, {
      headers: headerData,
      withCredentials: true,
    });
  },
};
