export default [
  // 현장등록
  // views/siteReg/SiteReg.vue
  {
    path: "/SITE_REG/siteReg",
    name: "siteReg",
    component: () => import("@/views/siteReg/SiteReg.vue"),
    meta: {
      menuId: "5001000",
    },
  },
  {
    path: "/SITE_REG/siteRegDetail",
    name: "siteRegDetail",
    component: () => import("@/views/siteReg/SiteRegDetail.vue"),
    meta: {
      menuId: "5001000",
    },
  },
];
