import { axiosApiDEV } from "@/api";

export default {
  // 1. 현장 표준 멤버쉽 조회
  selectSitePayPlcyList(param) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/common/selectSitePayPlcyList", param)
        .then((res) => {
          console.log("표준 멤버쉽 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
