import { defineStore } from 'pinia';
import authMgmtService from '@/api/services/sys/auth-mgmt-service';

export const useAuthMgmtStore = defineStore('authMgmtStore', {
  id: 'authMgmt',

  state: () => ({
    // 메뉴 담기
    menu: [],
    
  }),
  getters: {
    
  },
  actions: {
    // 1-1. 회원사 메뉴 - 전체 메뉴 목록 (슈퍼바이저)
    async selectAllMenuList() {
      try {
        const res = await authMgmtService.selectAllMenuList();
        const menuList = res.data;
        
        // 결과 리턴
        return menuList;
      } catch (err) {
        console.log('AuthMgmtStore > selectAllMenuList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 1-2. 회원사 메뉴 - 회원사 리스트
    async selectCompanyList() {
      try {
        const res = await authMgmtService.selectCompanyList();
        const comList = res.data;

        this.$patch({
          comList
        });
        
        // 결과 리턴
        return comList;
      } catch (err) {
        console.log('AuthMgmtStore > selectCompanyList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 1-3. 회원사 메뉴 - 회원사 선택에 따른 회원사 권한 메뉴 목록
    async selectComMenuList(vendrCd) {
      try {
        const res = await authMgmtService.selectComMenuList(vendrCd);
        const menuList = res.data;

        this.$patch({
          menuList
        });
        
        // 결과 리턴
        return menuList;
      } catch (err) {
        console.log('AuthMgmtStore > selectComMenuList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 2-1. 메뉴 - 전체 메뉴 목록 (시스템 관리자)
    async selectMenuList(params) {
      try {
        const res = await authMgmtService.selectMenuList(params);
        const menuList = res.data;
        
        // 결과 리턴
        return menuList;
      } catch (err) {
        console.log('AuthMgmtStore > selectAllMenuList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 2-2. 메뉴 - 권한 리스트
    async getMenuAuthList(params) {
      try {
        const res = await authMgmtService.getMenuAuthList(params);
        const authList = res.data;

        this.$patch({
          authList
        });
        return authList;

      } catch (err) {
        console.log('AuthMgmtStore > getMenuAuthList > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 2-3. 메뉴 - 권한 선택에 따른 메뉴 리스트
    async selectAuthMenuList(params) {
      try {
        const res = await authMgmtService.selectAuthMenuList(params);
        const menuList = res.data;

        this.$patch({
          menuList
        });
        
        // 결과 리턴
        return menuList;
      } catch (err) {
        console.log('AuthMgmtStore > fetchAllUsr > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 3-1. 사용자 - 전체 사용자 
    async getUserList(params){
      try {
        const res = await authMgmtService.getUserList(params);
        const userList = res.data;

        this.$patch({
          userList
        });
        
        // 결과 리턴
        return userList;
      } catch (err) {
        console.log('AuthMgmtStore > fetchAllUsr > error : ', err);
        // 에러 리턴
        throw err;
      }
    },

    // 3-2. 사용자 - 권한 선택에 따른 사용자 리스트
    async getUserAuthList(params) {
      try {
        const res = await authMgmtService.getUserAuthList(params);
        const userList = res.data;

        this.$patch({
          userList
        });
        
        // 결과 리턴
        return userList;
      } catch (err) {
        console.log('AuthMgmtStore > fetchAllUsr > error : ', err);
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
