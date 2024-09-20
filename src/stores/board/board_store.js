import { defineStore } from "pinia";
import boardService from "@/api/services/board/board-service";
import { reactive } from "vue";

export const useBoardStore = defineStore("boardStore", {
  id: "boardStore",
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
    // 게시판 조회
    async boardSelectList(param) {
      try {
        const res = await boardService.boardSelectList(param);
        const searchList = res.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          searchList,
        });

        // 결과 리턴
        console.log("searchList : " + searchList);
        return searchList;
      } catch (err) {
        console.log("useBoardStore > boardSelectList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 게시판 저장
    async saveBoardList(param) {
      try {
        await boardService.saveBoardList(param);
      } catch (err) {
        console.log("useBoardStore > boardSelectList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 게시판 상세조회
    async boardDetailSearch(param) {
      try {
        const res = await boardService.boardDetailSearch(param);
        const detailList = res.data;
        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          detailList,
        });

        return detailList;
      } catch (err) {
        console.log("useBoardStore > boardDetailSearch > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 게시판 파일 삭제
    async boardDeleteFile(param) {
      try {
        await boardService.boardDeleteFile(param);
      } catch (err) {
        console.log("useBoardStore > boardDeleteFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 게시판 리스트 삭제
    async deleteList(param) {
      try {
        await boardService.deleteList(param);
      } catch (err) {
        console.log("useBoardStore > deleteList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
    // 알림소식 조회
    async getNotifyNewsList(param) {
      try {
        const res = await boardService.getNotifyNewsList(param);
        const searchList = res.data;

        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          searchList,
        });

        // 결과 리턴
        return searchList;
      } catch (err) {
        // 에러 리턴
        throw err;
      }
    },
    // 알림소식 상세조회
    async getNotifyNewsInfo(param) {
      try {
        const res = await boardService.getNotifyNewsInfo(param);
        const detailList = res.data;
        // 스토어에 있는 state값을 넣어준다.
        this.$patch({
          detailList,
        });

        return detailList;
      } catch (err) {
        // 에러 리턴
        throw err;
      }
    },
  },
});
