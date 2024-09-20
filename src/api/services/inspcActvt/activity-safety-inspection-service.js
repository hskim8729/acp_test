import { axiosApiDEV } from '@/api';

const baseURL = "/v1/ais";
const headers = { "Content-Type": "multipart/form-data" };

export default {
    // === 활동안전점검 서비스 ===

    // 공통적으로 사용할 API 호출 함수
    callApi(endpoint, params = {}, headers = {}) {
        if (!endpoint) {
        throw new Error("Endpoint is required");
        }

        const fullEndpoint = `${baseURL}/${endpoint}`;

        if (params === undefined || params === "") {
        params = {};
        }

        return new Promise((resolve, reject) => {
        axiosApiDEV
            .post(fullEndpoint, params, { headers })
            .then((res) => {
            resolve(res);
            })
            .catch((error) => {
            reject(error);
            });
        });
    },
    // 1.안전점검 List
    searchList(param){
        if(param === undefined || param === ""){
            param = {};
        }
        // 협력업체 리스트
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspSerch`, param)
                .then((res) => {
                    console.log("합동점검 요청받음 >>>>>> ", res)
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    // 2.상세정보 List
    dtlSearchList(param) {
        if(param === undefined || param === ""){
            param = {};
        }
        // 협력업체 상세 리스트
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspDetailSerch`, param)
                .then((res) => {
                    console.log("합동점검 요청받음 >>>>>> ", res)
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    // 3.안전점검 transaction
    activitySafetyIspTransaction(param){
        if(param === undefined || param === ""){
            param = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspTransaction`, param)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },
    // 4.안전점검 참석자 리스트
    searchAttendList(param){
        if(param === undefined || param === ""){
            param = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspAttendList`, param)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },
    // 5.안전점검 참석자 Transaction
    attendsTransaction(param){ // activitySafetyIsp
        if(param === undefined || param === ""){
            param = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspAttendsTransaction`, param)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },
    // 6.안전점검 상세내역 Transaction
    activitySafetyIspDtlTransaction(param){ // activitySafetyIsp
        if(param === undefined || param === ""){
            param = {};
        }
        return new Promise((resolve, reject) => {
            axiosApiDEV
                .post(`/v1/ais/actSafeIspDetailTransaction`, param)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });

    },
    // 7. 합동안전점검 회의 상태값 수정/결재자 생성
    activitySafetyIspApprovalTransaction(params) {
        return this.callApi(`actSafeIspEvalApproval`, params);
    },
    // 8. 합동안전점검 회의 종료 후 마스터 정보 등록
    createActSafeIsp(params) {
        return this.callApi(`insertactSafeIspMst`, params);
    },
    // 회의 결재용 안전관리자, 현장소장 조회
    retrieveAuthUserList(params) {
        return this.callApi(`selectSafeAuthUserList`, params);
    },
    // 반려시 결재내역 삭제
    deleteSafeIspEvalApprovalDtl(params) {
        return this.callApi(`deleteSafeIspEvalApprovalDtl`, params);
    },

}