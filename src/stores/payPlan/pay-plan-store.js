import { defineStore } from "pinia";
import { reactive } from "vue";
import commonService from "@/api/common-service.js";

export const usePayPlanStore = defineStore("payPlanStore", {
  id: "payPlanStore",
  state: () => ({
    searchList: reactive([]),
    detailList: reactive([]),
  }),
  getters: {
    getSearchList: (state, value) => {
      return state.searchList;
    },
    getDetailList: (state, value) => {
      return state.detailList;
    },
  },
  actions: {
    // 표준 멤버쉽 조회
    async selectSitePayPlcyList(param) {
      commonService.axiosCall("/v1/common/selectSitePayPlcyList", param).then((result) => {
        const searchList = result.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          searchList,
        });

        // 결과 리턴
        return searchList;
      });
    }
  }
});
