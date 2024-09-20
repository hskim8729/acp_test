import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import majorService from "@/api/services/safeActvt/major-service";

export const useMajorStore = defineStore("majorStore", {
  id: "major",

  state: () => ({
    // 실질적인 데이터를 가지고있는 구간
    // 중점점검 리스트 관리(주 테이블 : )
    searchList: reactive([]),
    // 중점점검 상세리스트 관리(주 테이블 : )
    searchDetail: reactive([]),
  }),

  getters: {
    // computed 구간이라 데이터를 쏴주기만함
    getList: (state, value) => {
      return state.searchList;
    },
    getDetailList: (state, value) => {
      return state.majorDtlSearchList;
    },
  },

  actions: {
    // Function 기능을 하는 구간
    // 중점 점검 활동 리스트 조회
    async searchListMajorIspActvt(params) {
      try {
        const res = await majorService.searchListMajorIspActvt(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > searchListMajorIspActvt > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 중점 조치 활동 리스트 조회
    async searchListMajorActActvt(params) {
      try {
        const res = await majorService.searchListMajorActActvt(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > searchListMajorActActvt > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 중점 조치 승인 리스트 조회
    async searchListMajorActApprove(params) {
      try {
        const res = await majorService.searchListMajorActApprove(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return res;
      } catch (err) {
        console.log(
          "useMajorStore > searchListMajorActApprove > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 중점 점검 현황
    async selectPntInspDsctnSttusList(params) {
      try {
        const res = await majorService.selectPntInspDsctnSttusList(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return res;
      } catch (err) {
        console.log(
          "useMajorStore > selectPntInspDsctnSttusList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 안전활동 점검내역 조회
    async selectPntInspDsctn(params) {
      try {
        const res = await majorService.selectPntInspDsctn(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return searchList;
      } catch (err) {
        console.log("useMajorStore > selectPntInspDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 안전활동 점검내역 등록
    async savePntInspDsctn(params) {
      try {
        const res = await majorService.savePntInspDsctn(params);

        this.$patch({});

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > savePntInspDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 모바일 안전활동 점검내역 등록
    async saveAppPntInspDsctn(params) {
      try {
        const res = await majorService.saveAppPntInspDsctn(params);

        this.$patch({});

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > saveAppPntInspDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 조치자 현장 직원 정보 조회(조치자 검색 팝업)
    async selectPntActDsctnEmpInfoList(params) {
      try {
        const res = await majorService.selectPntActDsctnEmpInfoList(params);
        const searchList = res.data;

        this.$patch({
          searchList,
        });

        // 결과 리턴
        return searchList;
      } catch (err) {
        console.log(
          "useMajorStore > selectPntActDsctnEmpInfoList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },

    // 안전활동 DATA 생성
    async insertPntInspDsctn(params) {
      try {
        const res = await majorService.insertPntInspDsctn(params);

        this.$patch({});

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > insertPntInspDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 안전활동 조치내역 결재
    async pntActDsctnApprMst(params) {
      try {
        const res = await majorService.pntActDsctnApprMst(params);

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > pntActDsctnApprMst > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 중점조치활동 상세조회
    async selectPntActDsctn(params) {
      try {
        const res = await majorService.selectPntActDsctn(params);

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > selectPntActDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 안전활동 조치사항 입력 여부 조회
    async selectPntActDsctnCnt(params) {
      try {
        const res = await majorService.selectPntActDsctnCnt(params);
        const cnt = res.data;

        // 결과 리턴
        return cnt;
      } catch (err) {
        console.log("useMajorStore > selectPntActDsctnCnt > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 중점조치활동 저장
    async savePntActDsctn(params) {
      try {
        const res = await majorService.savePntActDsctn(params);
        return res;
      } catch (err) {
        console.log("useMajorStore > savePntActDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 모바일 중점조치활동 저장
    async saveAppPntActDsctn(params) {
      try {
        const res = await majorService.saveAppPntActDsctn(params);
        return res;
      } catch (err) {
        console.log("useMajorStore > saveAppPntActDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 중점조치활동 결재
    async pntActDsctnApprMst(params) {
      try {
        const res = await majorService.pntActDsctnApprMst(params);
        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > pntActDsctnApprMst > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    //  모바일 중점조치활동 결재
    async pntAppActDsctnApprMst(params) {
      try {
        const res = await majorService.pntAppActDsctnApprMst(params);
        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > pntAppActDsctnApprMst > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 안전활동 조치사항 입력 여부 조회
    async selectPntActDsctnCnt(params) {
      try {
        const res = await majorService.selectPntActDsctnCnt(params);
        const cnt = res.data;

        // 결과 리턴
        return cnt;
      } catch (err) {
        console.log("useMajorStore > selectPntActDsctnCnt > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 안전활동 점검내역 첨부파일 삭제
    async deleteFilePntInspDsctn(params) {
      try {
        const res = await majorService.deleteFilePntInspDsctn(params);

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > deleteFilePntInspDsctn > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 안전활동 조치내역 첨부파일 삭제
    async deleteFilePntActDsctn(params) {
      try {
        const res = await majorService.deleteFilePntActDsctn(params);

        // 결과 리턴
        return res;
      } catch (err) {
        console.log("useMajorStore > deleteFilePntActDsctn > error : ", err);
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
