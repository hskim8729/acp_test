import { defineStore } from 'pinia';
import myInfoService from '@/api/common/myInfo-service';

export const myInfoStore = defineStore('myInfoStore', {
  id : 'myInfoStore',
  
  state : () => ({
    signInfo: [],
    myInfo: {},
  }),
  getters: {
    
  },
  actions: {
    // 서명 파일 정보
    async selectMySignMgmt(params) {
      try {
        const res = await myInfoService.selectMySignMgmt(params);
        const signInfo = res.data;

        this.$patch({
          signInfo
        });

        return signInfo;

      } catch (err) {
        console.log('myInfoStore > selectMySignMgmt > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 서명 등록
    async saveMySignMgmt(params) {
      try {

        const res = await myInfoService.saveMySignMgmt(params);
        return res;

      } catch (err) {
        console.log('myInfoStore > selectMySignMgmt > error : ', err);
        // 에러 리턴
        throw err;
      }
    }

  },

  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  persist: {
    storage: sessionStorage,
  },
});
