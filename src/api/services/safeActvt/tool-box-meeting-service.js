import { axiosApiDEV } from "@/api";

export default {
  // 안전활동 TBM
  // 1. 안전활동 TBM 조회
  searchList(param) {
    // 협력업체 리스트 리턴
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post("/v1/safeActvt/selectToolBoxMeetingList", param)
        .then((res) => {
          console.log("안전활동 TBM 조회 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2. 안전활동 TBM 삭제
  toolBoxDeleteList(param) {
    return new Promise((resolve, reject) => {
      console.log("삭제 서비스 진입");
      axiosApiDEV
        .post("/v1/safeActvt/saveToolBoxMeetingList", param, {
          Headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("안전활동 TBM 삭제 요청받음 >>>>>> ", res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
