export default [
  // 표준관리 > 실시규정 표준
  // views/stdMgmt/standardslmRegulation.vue
  {
    path: "/STD_MGMT/standardslmRegulation",
    name: "standardslmRegulation",
    component: () => import("@/views/stdMgmt/standardslmRegulation.vue"),
    meta: {
      menuId: "6002000",
    },
  },

  // 표준관리 > 위험요인 표준
  // views/stdMgmt/riskFactorStandard.vue
  {
    path: "/STD_MGMT/riskFactorStandard",
    name: "riskFactorStandard",
    component: () => import("@/views/stdMgmt/riskFactorStandard.vue"),
    meta: {
      menuId: "6001000",
    },
  },
];
