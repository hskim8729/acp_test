import { defineStore } from 'pinia';
import menuAuthUserService from '@/api/common/menu-auth-user-service';

export const useMenuAuthUserStore = defineStore('menuAuthUserStore', {
  id : 'menuAuthUserStore',
  
  state : () => ({
    UserList : true
  }),
  getters: {
    getListst: (state, value) => {
      return state.UserList;
    }
  },
  actions: {
    // 메뉴 권한에 따른 사용자 조회
    async selectMenuAuthUserList(params) {
      try {
        const res = await menuAuthUserService.selectMenuAuthUserList(params);
        const UserList = res.data.selectPopMenuAuthUserList;

        this.$patch({
          UserList
        });

        return UserList;

      } catch (err) {
        console.log('menuAuthUserStore > selectMenuAuthUserList > error : ', err);
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
