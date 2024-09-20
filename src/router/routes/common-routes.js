export default [
  // 메인
  {
    path: "/main",
    name: "main",
    component: () => import("@/views/main/main.vue"),
    meta: {
      menuId: 0,
    },
  },

  // 모바일
  {
    path: "/m-main",
    name: "m-main",
    component: () => import("@/m-views/m-main.vue"),
    meta: {
      menuId: 0,
    },
  },
  {
    path: "/m-myInfo",
    name: "m-myInfo",
    component: () => import("@/m-views/myInfo/m-myInfo.vue"),
    meta: {
      menuId: 0,
    },
  },
];
