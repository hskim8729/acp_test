export default [
  // 현장
  // views/site/SiteReg.vue
  {
    path: "/SITE/siteReg",
    name: "siteRegPage",
    component: () => import("@/views/site/siteRegPage.vue"),
    meta: {
      menuId: "5001000",
    },
  },
  //현장> 현장개요
  {
    path: "/SITE/siteRegDetail",
    name: "siteRegDetailPage",
    component: () => import("@/views/site/siteRegDetail.vue"),
    meta: {
      menuId: "5002000",
    },
  },
  //현장>현장개설 실시규정
  {
    path: "/SITE/siteImpRegulation",
    name: "siteImpRegulation",
    component: () => import("@/views/site/siteImpRegulationPage.vue"),
    meta: {
      menuId: "5003000",
    },
  },
  // 현장 > 현장 실시규정 모바일
  {
    path: "/SITE/m-siteImpRegulation",
    name: "m-siteImpRegulation",
    component: () => import("@/m-views/site/m-siteImpRegulationPage.vue"),
    meta: {
      menuId: "5003000",
      isDisabledAdminMenu: true,
    },
  },
  //현장>현장위험요인
  {
    path: "/SITE/siteRiskFactorRegulation",
    name: "siteRiskFactorRegulation",
    component: () => import("@/views/site/siteRiskFactorRegulation.vue"),
    meta: {
      menuId: "5004000",
    },
  },
  // 현장 > 신규현장등록
  {
    path: "/SITE/addSite",
    name: "siteDetailPage",
    component: () => import("@/views/site/SiteDetailPage.vue"),
    meta: {
      menuId: "5005000",
    },
  },
];
