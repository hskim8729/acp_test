import { defineStore } from 'pinia';
import cdMgmtService from '@/api/services/sys/cd-mgmt-service';
import { reactive } from 'vue';

export const useCdMgmtStore = defineStore('cdMgmtStore', {
  id: 'cdMgmt',

  state: () => ({
    // 공통코드 정보를 관리
    comCodes: reactive([]),
    comCodeList: reactive([]),

  }),
  getters: {
    getComCodes: (state, value) => {
      return state.comCodes;
    }
  },
  actions: {
    // 공통코드 조회
    async fetchComCodes(params) {
      try {
        const res = await cdMgmtService.retrieveComCodes(params);
        const comCodes = res.data;

        this.$patch({
          comCodes
        });
        
        // 결과 리턴
        return comCodes;
      } catch (err) {
        console.log('CdMgmtStore > fetchComCodes > error : ', err);
        // 에러 리턴
        throw err;
      }
    },
    // 공통코드 상세조회
    async fetchComCodeList(params) {
      try {
        const res = await cdMgmtService.retrieveComCodeDetail(params);
        const comCodeList = res.data;

        this.$patch({
          comCodeList
        });
        
        // 결과 리턴
        return comCodeList;
      } catch (err) {
        console.log('CdMgmtStore > fetchComCodes > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  // persist: {
  //   storage: sessionStorage,
  // },
});
