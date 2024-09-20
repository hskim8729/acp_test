import { defineStore } from "pinia";
import riskAssessmentService from "@/api/services/inspcActvt/risk-assessment-service";

export const useRiskAssessmentStore = defineStore("riskAssessmentStore", {
  id: "riskAssessment",

  state: () => ({
    // 위험성평가 회의 대상공종 목록
    riskAssmnCnfrnDetailContyList: [],
    // 공종코드 목록
    contyCdList: [],
    // 평가 표 회의 공종코드 목록
    cnfrnContyCdList: [],
    // 평가 회의
    selectMtNm : "",

  }),

  getters: {
    getRiskAssmnCnfrnDetailContyList: (state, value) => {
      return state.riskAssmnCnfrnDetailContyList;
    },
    getContyCdList: (state, value) => {
      return state.contyCdList;
    },
    getCnfrnContyCdList: (state, value) => {
      return state.cnfrnContyCdList;
    },
  },

  actions: {
    // 위험성평가 회의 목록 조회
    async fetchRiskAssmnCnfrnList(params) {
      try {
        const res = await riskAssessmentService.retrieveRiskAssmnCnfrnList(
          params
        );

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchRiskAssmnCnfrnList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 상세 조회
    async fetchRiskAssmnCnfrnDetail(params) {
      try {
        const res = await riskAssessmentService.retrieveRiskAssmnCnfrnDetail(
          params
        );

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchRiskAssmnCnfrnDetail > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 상태값 수정
    async modifyRiskAssmnCnfrnStats(params) {
      try {
        const res = await riskAssessmentService.modifyRiskAssmnCnfrnStats(
          params
        );
      } catch (err) {
        console.log(
          "RiskAssessmentStore > modifyRiskAssmnCnfrnStats > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 상세 대상공종 조회
    async fetchRiskAssmnCnfrnDetailContyList(params) {
      try {
        const res =
          await riskAssessmentService.retrieveRiskAssmnCnfrnDetailContyList(
            params
          );
        const riskAssmnCnfrnDetailContyList = res.data;

        this.$patch({
          riskAssmnCnfrnDetailContyList,
        });

        // 결과 리턴
        return riskAssmnCnfrnDetailContyList;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchRiskAssmnCnfrnDetailContyList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 등록
    async fetchCreateRiskAssmnCnfrn(params) {
      try {
        await riskAssessmentService.createRiskAssmnCnfrn(params);
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchCreateRiskAssmnCnfrn > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 삭제
    async deleteRiskAssmnCnfrn(params) {
      try {
        const res = await riskAssessmentService.deleteRiskAssmnCnfrn(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > deleteRiskAssmnCnfrn > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 평가 회의 평가 표 작성자 삭제
    async deleteEvalMtEvalTblWrtr(params) {
      try {
        const res = await riskAssessmentService.deleteEvalMtEvalTblWrtr(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > deleteEvalMtEvalTblWrtr > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 목록 조회
    async fetchRiskAssmnList(params) {
      try {
        const res = await riskAssessmentService.retrieveRiskAssmnList(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log("RiskAssessmentStore > fetchRiskAssmnList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 표 마스터 목록 조회
    async fetchRiskAssmnTblMstList(params) {
      try {
        const res = await riskAssessmentService.retrieveRiskAssmnTblMstList(
          params
        );

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchRiskAssmnTblMstList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 등록
    async fetchCreateRiskAssmn(params) {
      try {
        await riskAssessmentService.createRiskAssmn(params);
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchCreateRiskAssmn > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 공사종류 코드목록 조회
    async fetchContyCdList(params) {
      try {
        const res = await riskAssessmentService.retrieveContyCdList(params);
        const contyCdList = res.data;

        this.$patch({
          contyCdList,
        });

        // 결과 리턴
        return contyCdList;
      } catch (err) {
        console.log("RiskAssessmentStore > fetchContyCdList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 공사종류 등록 및 수정
    async modifyContyCd(params) {
      try {
        // 등록
        await riskAssessmentService.modifyContyCd(params);

        // 등록 후 재조회
        const res = await riskAssessmentService.retrieveContyCdList(params[0]);
        const contyCdList = res.data;

        this.$patch({
          contyCdList,
        });
      } catch (err) {
        console.log("RiskAssessmentStore > modifyContyCd > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 공종코드 삭제
    async deleteContyCd(params) {
      try {
        // 삭제
        const delInfo = await riskAssessmentService.deleteContyCd(params);

        if (delInfo.data.cnt === 0) {
          // 삭제 후 재조회
          const res = await riskAssessmentService.retrieveContyCdList(params);
          const contyCdList = res.data;

          this.$patch({
            contyCdList,
          });
        }

        return delInfo.data;
      } catch (err) {
        console.log("RiskAssessmentStore > deleteContyCd > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 표 목록 조회
    async fetchRiskAssmnTblList(params) {
      try {
        const res = await riskAssessmentService.retrieveRiskAssmnTblList(
          params
        );
        const riskAssmnList = res.data.riskAssmnTblList;
        const cnfrnContyCdList = res.data.cnfrnContyCdList;
        const selectMtNm = res.data.selectMtNm;


        this.$patch({
          cnfrnContyCdList,
          selectMtNm,
        });

        // 결과 리턴
        return riskAssmnList;
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchRiskAssmnTblList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 회의 결재용 안전관리자, 현장소장 조회
    async fetchAuthUserList(params) {
      try {
        const res = await riskAssessmentService.retrieveAuthUserList(params);

        // 결과 리턴
        return res.data.selectAuthUserList;
      } catch (err) {
        console.log("RiskAssessmentStore > fetchAuthUserList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 회의 종료 후 마스터 정보 등록
    async fetchCreateRiskAssmnMst(params) {
      try {
        await riskAssessmentService.createRiskAssmnMst(params);
      } catch (err) {
        console.log(
          "RiskAssessmentStore > fetchCreateRiskAssmnMst > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 위험성평가 표 삭제
    async deleteRiskEvalTbl(params) {
      try {
        await riskAssessmentService.deleteRiskEvalTbl(params);
      } catch (err) {
        console.log("RiskAssessmentStore > deleteRiskEvalTbl > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    initStore() {
      this.$reset();
    },
  },

  initStorage() {
    // 로그인 페이지 처음 표시할 때 storage 초기화
    // 로그아웃할때 처리하면 로그인 페이지가 마운트될때 초기화되는 건지 알 수 없지만
    // 값이 없는 키가 표시되어 보기 좋지 않기 때문
    // piniaPluginPersistedstate clear
    // window.localStorage.clear();
    window.sessionStorage.clear();
    console.log("loginAuthStore > initStorage() executed...!!!");
  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  persist: {
    storage: sessionStorage,
  },
});
