import {axiosApiDEV} from "@/api";

export default {
    // 1. 대분류 조회
    getLgCatList(params) {
        if (params === undefined || params === "") {
            params = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/rfsLgCategorySearchList`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 2. 중분류 조회
    getMdCatList(params) {
        if (params === undefined || params === "") {
            params = {};
        }

        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/rfsMdCategorySearchList`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 3. 작업 명 조회
    getWrkCatList(params) {
        if (params === undefined || params === "") {
            params = {};
        }

        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/rfsWrkCategorySearchList`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 4. 위험요인 조회
    getRfsFctrRskList(params) {
        if (params === undefined || params === "") {
            params = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/rfsFctrCategorySearchList`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 5. 감소대책 조회
    getRfsFctrMsrRskList(params) {
        if (params === undefined || params === "") {
            params = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/rfsFctrMsrCategorySearchList`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 6.공종대상 조회
    searchContyCdList(param){
        if(param === undefined || param === ""){
            param = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspContyCdSearchList`, param)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 7. 표준추가 검색
    searchRiskStandardResult(params) {
        if (params === undefined || params === "") {
            params = {};
        }

        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/rfs/selectSearchStandardResult`, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },


}