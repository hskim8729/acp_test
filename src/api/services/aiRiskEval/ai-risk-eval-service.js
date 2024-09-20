import { axiosApiAI } from "@/api";
import { useDialogStore } from "@/stores/common/dialog-store";

export default {
  // 1-1. post방식 호출
  async axiosCallAI(url, params = {}, headers = {}) {
    const dialogStore = useDialogStore();

    if (!url) {
      throw new Error("URL이 없습니다.");
    }
    // console.log(`호출 url: ${url} / param: `, params);
    return await axiosApiAI
      .post(url, params, { headers })
      .then((response) => {
        const errorCode = response.data.statusCode;
        let errorMsg = "";

        switch (errorCode) {
          case 401:
            errorMsg += "세션이 종료되었습니다.<br> 새창으로 시도해주세요.";
            break;
          case 422:
            errorMsg += "메시지 형식이 잘못되었습니다.";
            break;
        }
        if (errorMsg) {
          dialogStore.openAlertDialog(
            `에러코드 : ${errorCode}<br><br>${errorMsg}`,
            { type: "error" }
          );
          return;
          //throw error;
        }

        return response;
      })
      .catch((error) => {
        throw error;
      });
  },
  // 1-1. post방식 호출
  async axiosCallAIFile(url, params, headers = {}) {
    const dialogStore = useDialogStore();

    if (!url) {
      throw new Error("URL이 없습니다.");
    }
    // console.log(`호출 url: ${url} / param: `, params);
    return await axiosApiAI
      .post(url, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const errorCode = response.data.statusCode;
        let errorMsg = "";

        switch (errorCode) {
          case 401:
            errorMsg += "세션이 종료되었습니다.<br> 새창으로 시도해주세요.";
            break;
          case 422:
            errorMsg += "메시지 형식이 잘못되었습니다.";
            break;
        }
        if (errorMsg) {
          dialogStore.openAlertDialog(
            `에러코드 : ${errorCode}<br><br>${errorMsg}`,
            { type: "error" }
          );
          return;
          //throw error;
        }

        return response;
      })
      .catch((error) => {
        throw error;
      });
  },
};
