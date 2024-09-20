import { defineStore } from 'pinia';
import usrMgmtService from '@/api/services/sys/usr-mgmt-service';
import { reactive } from 'vue';

export const useUsrMgmtStore = defineStore('usrMgmtStore', {
  id: 'usrMgmt',

  state: () => ({
    // 사용자 정보를 관리
    usrInfo: reactive([]),

  }),
  getters: {
    getUsrInfo: (state, value) => {
      return state.usrInfo;
    }
  },
  actions: {
    // 사용자 정보 조회
    async selectUsrInfo(params) {
      try {
        const res = await usrMgmtService.selectUsrInfo(params);
        const usrInfo = res.data;

        this.$patch({
          usrInfo
        });
        
        // 결과 리턴
        return res;
      } catch (err) {
        console.log('UsrMgmtStore > selectUsrInfo > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 사용자 상세정보 조회
    async selectUsrDetail(params) {
      try {
        const res = await usrMgmtService.selectUsrDetail(params);
        const usrInfo = res.data;

        this.$patch({
          usrInfo
        });
        
        // 결과 리턴
        return usrInfo;
      } catch (err) {
        console.log('UsrMgmtStore > selectUsrDetail > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 사용자 등록 팝업 소속회사 조회
    async getPartnerList(params) {
      try {
        const res = await usrMgmtService.getPartnerList(params);
        const list = res.data;

        this.$patch({
          list
        });
        
        // 결과 리턴
        return list;
      } catch (err) {
        console.log('UsrMgmtStore > getPartnerList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 사용자 정보 수정
    async saveUserInfo(params) {
      try {
        const res = await usrMgmtService.saveUserInfo(params);

        if (res.status === 200) { 
          
        }

        this.$patch({
        });
        
        // 결과 리턴
        return res;
      } catch (err) {
        console.log('UsrMgmtStore > saveUserInfo > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 마이플두 개인정보 수집 동의
    async updateRcvAgreInfo(params) {
      try {
        const res = await usrMgmtService.updateRcvAgreInfo(params);

        if (res.status === 200) { 
          
        }

        this.$patch({
        });
        
        // 결과 리턴
        return res;
      } catch (err) {
        console.log('UsrMgmtStore > updateRcvAgreInfo > error : ', err);
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
