import tappMgmtService from '@/api/services/sys/tapp-mgmt-service';

export const useTappMgmtStore = defineStore('tappMgmtStore', {
  id: 'tappMgmt',

  state: () => ({
    // 공종코드 리스트 관리
    searchList: [],

  }),
  getters: {
    getList: (state, value) => {
      return state.searchList;
    }
  },
  actions: {
    // 공종코드 리스트 조회
    async tappSearchList(params) {
      try {
        const res = await tappMgmtService.searchList(params);
        const resultInfo = res.data;

        const searchList = resultInfo;

        this.$patch({
          searchList
        });
        
        // 결과 리턴
        return searchList;
      } catch (err) {
        console.log('tappMgmtStore > tappSearchList > error : ', err);
        // 에러 리턴
        throw err;
      }  
    },

  },

});
