import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import activitySafetyInspectionService from "@/api/services/inspcActvt/activity-safety-inspection-service";
import riskFactorStandardService from "../../api/services/stdMgmt/risk-factor-standard-service";

export const useActivitySafetyIspStore = defineStore('activitySafetyIspStore', {
    id: 'activitySafetyIsp',

    state: () => ({ // 실질적인 데이터를 가지고있는 구간
        // 합동안전점검 리스트 관리(주 테이블 : 평가회의)
        dataList :{},
        searchList: reactive([]),
        // 합동안전점검 상세 리스트 관리(주 테이블 : 위험요인)
        atvtDtlDataList:[],
        actvtdtlSearchList: reactive([]),
        //합동안전점검 참석자 리스트 관리(주 테이블 : 참석자)
        attendList:[],
        searchAttendList: reactive([]),
        //공사종류 리스트 관리(주 테이블 : 공사종류, 공통코드)
        contyList:[],
        searchContyList: reactive([]),
        //승인 데이터
        evalApproval: {},
        evalApprovalData: ref({})
    }),

    getters: { // computed 구간이라 데이터를 쏴주기만함
        getList: (state, value) => {
            return state.searchList;
        },
        getDetailList: (state, value) => {
            return state.actvtdtlSearchList;
        },
    },

    actions: { // Fcuntion 기능을 하는 구간
        // 1. 합동안전점검 리스트 조회
        async serchListActivitySafetyIsp(params) {
            try {
                const res = await activitySafetyInspectionService.searchList(params);
                const dataList = res.data;
                const searchList = res.data;

                this.$patch({
                    dataList,
                    searchList
                });

                // 결과 리턴
                return res;

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                // 에러 리턴
                throw err;
            }
        },
        // 1-1. 합동안전점검 삭제
        async deleteActivitySafetyIsp(params) {
            try {
                console.log('deleteActivitySafetyIsp : ' , params)
                await activitySafetyInspectionService.activitySafetyIspTransaction(params);

                // 결과 리턴
                return '삭제가 완료되었습니다.';

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                alert('삭제중 문제가 발생하였습니다 관리자에게 문의해주세요.')
                // 에러 리턴
                throw err;
            }
        },

        // 2. 합동안전점검 상세리스트 조회
        async serchListActivitySafetyIspDetail(params) {
            try {
                const res = await activitySafetyInspectionService.dtlSearchList(params);
                const atvtDtlDataList = res.data;
                const actvtdtlSearchList = res.data;

                this.$patch({
                    atvtDtlDataList,
                    actvtdtlSearchList
                });

                // 결과 리턴
                return res;

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                // 에러 리턴
                throw err;
            }
        },
        // 2-1. 합동안전점검 상세내역 삭제
        async deleteActivitySafetyIspDetail(params) {
            try {
                console.log('deleteActivitySafetyIsp : ' , params)
                await activitySafetyInspectionService.activitySafetyIspDtlTransaction(params);

                // 결과 리턴
                return '삭제가 완료되었습니다.';

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                alert('삭제중 문제가 발생하였습니다 관리자에게 문의해주세요.')
                // 에러 리턴
                throw err;
            }
        },
        // 3. 합동안전점검 참석자 조회
        async searchAttendList(params) {
            try {
                const res = await activitySafetyInspectionService.searchAttendList(params);
                const attendList = res.data;
                const searchAttendList = res.data;

                this.$patch({
                    attendList,
                    searchAttendList
                });

                // 결과 리턴
                return res;

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                // 에러 리턴
                throw err;
            }
        },

        // 4. 합동안전점검 공종대상 조회
        async searchContyCdList(params) {
            try {
                const res = await activitySafetyInspectionService.searchContyCdList(params);
                const contyList = res.data;
                const searchContyList = res.data;

                this.$patch({
                    contyList,
                    searchContyList
                });

                // 결과 리턴
                return res;

            } catch (err) {
                console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
                // 에러 리턴
                throw err;
            }
        },

        // 5. 회의 승인
        async actSafeIspEvalApproval(params){
            try {
            const res = await activitySafetyInspectionService.activitySafetyIspApprovalTransaction(params);
            } catch (err) {
                console.log("activitySafetyIspApprovalTransaction > error : ",err);
                // 에러 리턴
                throw err;
            }
        },
        // 위험성평가 회의 종료 후 마스터 정보 등록
        async fetchCreateActSafeIsp(params) {
            try {
                await activitySafetyInspectionService.createActSafeIsp(params);
            } catch (err) {
                console.log(
                "createActSafeIsp > error : ",err);
                // 에러 리턴
                throw err;
            }
        },
        // 회의 결재용 안전관리자, 현장소장 조회
        async fetchSafeAuthUserList(params) {
        try {
            const res = await activitySafetyInspectionService.retrieveAuthUserList(params);

            // 결과 리턴
            return res.data.selectSafeAuthUserList;
        } catch (err) {
            console.log("fetchSafeAuthUserList > error : ", err);
            // 에러 리턴
            throw err;
        }
        },
        // 반려 결제MST 삭제
        async deleteSafeIspEvalApprovalDtl(params){
            try {
            const res = await activitySafetyInspectionService.deleteSafeIspEvalApprovalDtl(params);
            } catch (err) {
                console.log("deleteSafeIspEvalApprovalDtl > error : ",err);
                // 에러 리턴
                throw err;
            }
        },
    },
    persist: {
      // storage: sessionStorage,
        enabled: true,
        strategies: [{ storage: localStorage }],
    },
});