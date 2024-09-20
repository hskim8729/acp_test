import {defineStore} from "pinia";
import comRiskFactorStandardService from "../../api/services/inspcActvt/com-risk-factor-standard-service";
import {ref} from "vue";
import {useLoginAuthStore} from "../common/login-auth-store";

export const useComRiskFactorStandardStore = defineStore(
    "comRiskFactorStandardStore",
    {
        id: "comRiskFactorStandard",
        state: ()=> ({
            lgCatCd: {} ,
            lgCatNm: {} ,
            mdCatCd: {} ,
            mdCatNm: {} ,
            wrkNmCd: {} ,
            wrkNm: {} ,
            rskFctrSeq: {} ,
            rskFctr: {} ,
            rskMsrSeq: {} ,
            rskMsr:{},
            // 공종코드 목록
            contyCdList: [],
            contyCdData: ref(),
            // 대분류 목록
            lgCatList: [],
            lgCatData: ref(),
            // 중분류 목록
            mdCatList: [],
            mdCatData: ref(),
            // 작업명 목록
            wrkList: [],
            wrkData: ref(),
            // 위험요인 목록
            rskFctrList: [],
            rskFctrData: ref(),
            // 위험대책 목록
            rskMsrList: [],
            rskMsrData: ref(),
        }),
        getters: {
            getContyCdList: (state, value) => {
                return state.contyCdList;
            },
        },
        actions: {
            // 1. 대분류 조회
            async fetchLgCatList(params) {
                try {
                    const res = await comRiskFactorStandardService.getLgCatList(params);
                    const lgCatList = res.data;
                    const lgCatData = res.data;

                    this.$patch({
                        lgCatList,
                        lgCatData,
                        lgCatCd: params.lgCatCd,
                        lgCatNm: params.lgCatNm,
                    });

                    return lgCatList;
                } catch (err) {
                    console.log("riskFactorStandardStore > fetchLgCatList > error : ",err);
                    throw err;
                }
            },
            // 2. 중분류 조회
            async fetchMdCatList(params,index) {
                try {
                    let res = await comRiskFactorStandardService.getMdCatList(params);
                    let mdCatList = res.data;
                    let mdCatData = res.data;
                    mdCatList.index = index

                    this.$patch({
                        mdCatList,
                        mdCatData,
                        lgCatCd: params.lgCatCd,
                        lgCatNm: params.lgCatNm,
                        mdCatCd: params.mdCatCd,
                        mdCatNm: params.mdCatNm,
                    });

                    return mdCatList;
                } catch (err) {
                    console.log("riskFactorStandardStore > fetchMdCatList > error : ",err);
                    throw err;
                }
            },
            // 3. 작업목록 조회
            async fetchWrkList(params, index) {
                try {
                    let res = await comRiskFactorStandardService.getWrkCatList(params);
                    let wrkList = res.data;
                    let wrkData = res.data;
                    wrkList.index = index

                    this.$patch({
                        wrkList,
                        wrkData,
                        lgCatCd: params.lgCatCd,
                        lgCatNm: params.lgCatNm,
                        mdCatCd: params.mdCatCd,
                        mdCatNm: params.mdCatNm,
                        wrkNmCd: params.wrkNmCd,
                        wrkNm: params.wrkNm,
                    });

                    return wrkList;
                } catch (err) {
                    console.log("riskFactorStandardStore > fetchWrkList > error : ", err);
                    throw err;
                }
            },
            // 4. 위험요인 조회
            async fetchRskFctrList(params, index) {
                try {
                    let res = await comRiskFactorStandardService.getRfsFctrRskList(params);
                    let rskFctrList = res.data;
                    let rskFctrData = res.data;
                    rskFctrList.index = index

                    this.$patch({
                        rskFctrList,
                        rskFctrData,
                        lgCatCd: params.lgCatCd,
                        lgCatNm: params.lgCatNm,
                        mdCatCd: params.mdCatCd,
                        mdCatNm: params.mdCatNm,
                        wrkNmCd: params.wrkNmCd,
                        wrkNm: params.wrkNm,
                        rskFctrSeq : params.rskFctrSeq,
                        rskFctr : params.rskFctr
                    });

                    return rskFctrList;
                } catch (err) {
                    console.log("riskFactorStandardStore > fetchWrkList > error : ", err);
                    throw err;
                }
            },
            // 5. 감소대책 조회
            async fetchRskMsrList(params, index) {
                //getRfsFctrMsrRskList
                try {
                    let res = await comRiskFactorStandardService.getRfsFctrMsrRskList(params);
                    let rskMsrList = res.data;
                    let rskMsrData = res.data;
                    rskMsrList.index = index

                    this.$patch({
                        rskMsrList,
                        rskMsrData,
                        lgCatCd: params.lgCatCd,
                        lgCatNm: params.lgCatNm,
                        mdCatCd: params.mdCatCd,
                        mdCatNm: params.mdCatNm,
                        wrkNmCd: params.wrkNmCd,
                        wrkNm: params.wrkNm,
                        rskFctrSeq : params.rskFctrSeq,
                        rskFctr : params.rskFctr,
                        rskMsrSeq : params.rskMsrSeq,
                        rskMsr : params.rskMsr,
                    });

                    return rskMsrList;
                } catch (err) {
                    console.log("riskFactorStandardStore > fetchWrkList > error : ", err);
                    throw err;
                }
            },

            // 6. 공사종류 코드목록 조회
            async fetchContyCdList(params) {
                try {
                    const res = await comRiskFactorStandardService.searchContyCdList(params);
                    const contyCdList = res.data;
                    const contyCdData = res.data;

                    this.$patch({
                        contyCdList,
                        contyCdData
                    });

                    return contyCdList;
                } catch (err) {
                    console.log("RiskAssessmentStore > fetchContyCdList > error : ", err);
                    // 에러 리턴
                    throw err;
                }
            },

            // 7. 표준추가 검색
            async fetchRiskSearchResult(params) {
                try {
                    const res = await comRiskFactorStandardService.searchRiskStandardResult(params);
                    const contyCdList = res.data;
                    const contyCdData = res.data;

                    this.$patch({
                        contyCdList,
                        contyCdData
                    });

                    return contyCdList;
                } catch (err) {
                    console.log("RiskAssessmentStore > fetchContyCdList > error : ", err);
                    // 에러 리턴
                    throw err;
                }
            },

        },
    }
);
