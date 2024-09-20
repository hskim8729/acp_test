import { axiosApiDEV } from "@/api";
import commonService from "@/api/common-service.js";

export default {
  // == 위험요인 표준(전사) 관리 ==
  // 1. 위험요인 템플릿
  // 1-1. 조회
  getTemplateList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectRiskFactorStandardTemplateList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 1-2. 수정삭제
  saveTemplate(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardTemplate`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 1-3. 엑셀 템플릿 다운로드
  downloadExcelTemplate() {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(
          `/v1/stdMgmt/stdMgmtRiskFactorStandardExcelTmpDownload`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 1-4. 엑셀 업로드
  // 엑셀 로딩 중 컴포넌트를 만들기 위해 프로미스 반환하도록 코드 수정
  // then() 실행 후 isLoading 변경 가능
  uploadExcelTemplate(formData) {
    const headers = { "Content-Type": "multipart/form-data" };
    return commonService.axiosCall(
      "/v1/stdMgmt/stdMgmtRiskFactorStandardExcelUpload",
      formData,
      headers
    );
  },
  // 2. 대분류
  // 2-1. 조회
  getLgCatList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectRiskFactorStandardLgCat`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 2-2. 추가, 수정, 삭제
  saveLgCat(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardLgCat`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 3. 중분류
  // 3-1. 조회
  getMdCatList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectRiskFactorStandardMdCat`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 3-2. 추가, 수정, 삭제
  saveMdCat(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardMdCat`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 4. 작업 목록
  // 4-1. 전체 목록 조회
  getWrkList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectRiskFactorStandardWrkList`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 4-2. 추가, 수정, 삭제
  saveWrk(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardWrk`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5. 위험 요인 및 대책
  // 5-1. 전체 목록 조회
  getRskFctrMsrList(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectRiskFactorStandardRskFctrMsr`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5-2. 대책 생성, 수정, 삭제
  saveRskFctrMsr(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardRskFctrMsr`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 5-3. 위험요인 생성, 수정, 삭제
  saveRskFctr(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/saveRiskFactorStandardRskFctr`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 6. 검색
  fetchSearchResult(params) {
    if (params === undefined || params === "") {
      params = {};
    }

    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/stdMgmt/selectSearchResult`, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
