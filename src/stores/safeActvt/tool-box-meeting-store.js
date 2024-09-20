import { defineStore } from "pinia";
import toolBoxMeetingService from "../../api/services/safeActvt/tool-box-meeting-service";
import { reactive } from "vue";

export const useToolBoxMeetingStore = defineStore("toolBoxMeetingStore", {
  id: "toolBoxMeetingStore",
  state: () => ({
    searchList: reactive([]),
  }),
  getters: {
    getSearchList: (state, value) => {
      return state.searchList;
    },
  },
  actions: {
    async toolBoxSearchList(params) {
      try {
        const res = await toolBoxMeetingService.searchList(params);
        const searchList = res.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          searchList,
        });

        // 결과 리턴
        console.log("searchList : " + searchList);
        return searchList;
      } catch (err) {
        console.log(
          "useToolBoxMeetingStore > toolBoxSearchList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
    // TBM 게시글 삭제
    async toolBoxDeleteList(params) {
      try {
        await toolBoxMeetingService.toolBoxDeleteList(params);
      } catch (err) {
        console.log(
          "useToolBoxMeetingStore > toolBoxDeleteList > error : ",
          err
        );
        // 에러 리턴
        throw err;
      }
    },
  },
});
