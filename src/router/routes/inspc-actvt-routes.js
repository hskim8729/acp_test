export default [
  // 안전점검활동 > 위험성평가 회의 목록
  {
    path: "/INSPC_ACTVT/riskAssmnCnfrnMain",
    name: "RiskAssmnCnfrnMain",
    component: () => import("@/views/inspcActvt/riskAssmnCnfrnMain.vue"),
    meta: {
      menuId: "2001000",
      isRequiredPayPlcy: true,
    },
  },

  // 안전점검활동 > 위험성평가 회의 상세
  {
    path: "/INSPC_ACTVT/riskAssmnCnfrnDetail",
    name: "RiskAssmnCnfrnDetail",
    component: () => import("@/views/inspcActvt/riskAssmnCnfrnDetail.vue"),
    meta: {
      menuId: "2001000",
      isRequiredPayPlcy: true,
    },
  },

  // 안전점검활동 > 위험성평가 목록
  {
    path: "/INSPC_ACTVT/riskAssmnMain",
    name: "RiskAssmnMain",
    component: () => import("@/views/inspcActvt/riskAssmnMain.vue"),
    meta: {
      menuId: "2001100",
      isRequiredPayPlcy: true,
    },
  },

  // 안전점검활동 > 위험성평가 등록 및 검토/승인
  {
    path: "/INSPC_ACTVT/riskAssmn",
    name: "RiskAssmn",
    component: () => import("@/views/inspcActvt/riskAssmn.vue"),
    meta: {
      menuId: "2001100",
      isRequiredPayPlcy: true,
    },
  },

  // 안전점검활동 > 위험성평가 회의
  {
    path: "/INSPC_ACTVT/riskAssmnCnfrn",
    name: "RiskAssmnCnfrn",
    component: () => import("@/views/inspcActvt/riskAssmnCnfrn.vue"),
    meta: {
      menuId: "2001000",
      isRequiredPayPlcy: true,
    },
  },

  // 합동안전점검
  {
    path: "/INSPC_ACTVT/ActivitySafetyInspectionPage",
    name: "AactivitySafetyInspection",
    component: () =>
      import("@/views/inspcActvt/ActivitySafetyInspectionPage.vue"),
    meta: {
      menuId: "2002000",
      isRequiredPayPlcy: true,
    },
  },

  // 합동안전점검 Detail
  {
    path: "/INSPC_ACTVT/ActivitySafetyInspectionDetailPage",
    name: "ActivitySafetyInspectionDetail",
    component: () =>
      import("@/views/inspcActvt/ActivitySafetyInspectionDetailPage.vue"),
    meta: {
      menuId: "2002000",
      isRequiredPayPlcy: true,
    },
  },

  // 표준추가
  {
    path: "/INSPC_ACTVT/popRiskFactorStandard",
    name: "popRiskFactorStandard",
    component: () =>
      import("@/views/inspcActvt/popup/popRiskFactorStandard.vue"),
    meta: {
      menuId: "2002000",
      isRequiredPayPlcy: true,
    },
  },
];
