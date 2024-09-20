export default [
  // 시스템 > 코드관리
  // views/publish/SYS/cdMgmt.vue
  {
    path: "/SYS/cdMgmt",
    name: "CdMgmt",
    component: () => import("@/views/sys/CdMgmt.vue"),
    meta: {
      menuId: "7001000",
    },
  },

  // 시스템 < 메뉴관리
  // views/publish/SYS/menuMgmt.vue
  {
    path: "/SYS/menuMgmt",
    name: "MenuMgmt",
    component: () => import("@/views/sys/MenuMgmt.vue"),
    meta: {
      menuId: "7002000",
    },
  },

  // 시스템 < 권한관리
  // views/publish/SYS/authMgmt.vue
  {
    path: "/SYS/authMgmt",
    name: "AuthMgmt",
    component: () => import("@/views/sys/authMgmt/AuthMgmt.vue"),
    meta: {
      menuId: "7003000",
    },
  },

  // 시스템 < 사용자관리
  //views/publish/SYS/usrMgmt.vue
  {
    path: "/SYS/usrMgmt",
    name: "UsrMgmt",
    component: () => import("@/views/sys/usrMgmt/UsrMgmt.vue"),
    meta: {
      menuId: "7004000",
    },
  },

  // 시스템 < 협력업체 관리
  // views/publish/SYS/partnerMgmt.vue
  {
    path: "/SYS/partnerMgmt",
    name: "PartnerMgmt",
    component: () => import("@/views/sys/PartnerMgmt.vue"),
    meta: {
      menuId: "7005000",
    },
  },

  // 시스템 < 사용자 로그인
  // views/publish/SYS/userLogin.vue
  {
    path: "/SYS/userLogin",
    name: "UserLoginPage",
    component: () => import("@/views/sys/UserLoginPage.vue"),
    meta: {
      menuId: "7006000",
    },
  },
];
