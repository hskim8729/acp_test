import { defineStore } from 'pinia';
import comCodeService from '@/api/common/com-code-service';

export const useComCodeStore = defineStore('comCodeStore', {
  id : 'comCodeStore',
  
  state : () => ({
    comCodes : [],
    isFirst : true
  }),
  getters: {
    getIsFirst: (state, value) => {
      return state.isFirst;
    }
  },
  actions: {
    // 공통코드 찾기
    findComCd(params) {
      let comCodeData = [];

      this.comCodes.forEach((code) => {
        if (code.comCdUpperId === params.comCdUpperId) {
          comCodeData.push(code);
        }
      });

      return comCodeData;
    },
    // 전체 공통코드 조회
    async fetchAllComCode(params) {
      try {
        const res = await comCodeService.retrieveAllComCodes(params);
        const comCodes = res.data;
        var isFirst = false;
        // const { userInfo: me, menus, auths } = resultInfo;

        // 스토어에 저장
        this.$patch({
          comCodes,
          isFirst
        });

        // 결과 리턴
        // return comCodes;
      } catch (err) {
        console.log('ComCodeStore > selectAllComCode > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  persist: {
    storage: sessionStorage,
  },
});
