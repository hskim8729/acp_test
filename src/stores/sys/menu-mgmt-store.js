import { defineStore } from 'pinia';
import menuMgmtService from '@/api/services/sys/menu-mgmt-service';

export const useMenuMgmtStore = defineStore('menuMgmtStore', {
  id: 'menuMgmt',

  state: () => ({
    // 메뉴 정보를 관리
    menus: [],

  }),
  getters: {
    getMenus: (state, value) => {
      return state.menus;
    }
  },
  actions: {
    // 메뉴 조회
    async fetchMenus(params) {
      try {
        const res = await menuMgmtService.retrieveMenus(params);
        const menus = res.data;

        this.$patch({
          menus
        });
        
        // 결과 리턴
        return menus;
      } catch (err) {
        console.log('MenuMgmtStore > fetchMenus > error : ', err);
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
