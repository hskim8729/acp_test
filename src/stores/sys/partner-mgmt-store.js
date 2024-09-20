import { defineStore } from 'pinia';
import partnerMgmtService from '@/api/services/sys/partner-mgmt-service';
import { ref, reactive } from 'vue';

export const usePartnerMgmtStore = defineStore('partnerMgmtStore', {
  id: 'partnerMgmt',

  state: () => ({// 유저인포값이랑 토큰이랑 같이 넘길예정
    // 협력업체 리스트 관리
    searchList: reactive([]),
  }),
  getters: {
    getList: (state, value) => {
      return state.searchList;
    }
  },
  actions: {
    // 협력업체 리스트 조회
    async partnerSearchList(params) {
      try {
        const res = await partnerMgmtService.searchList(params);
        const searchList = res.data;

        this.$patch({
          searchList
        });

        // 결과 리턴
        return searchList;

      } catch (err) {
        console.log('PartnerMgmtStore > partnerSearchList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

  },
});
