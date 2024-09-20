export default [
  // 안전 보건 확보 의무
  // views/safeConfirmDuty/safeCheckList.vue
  {
    path: "/SAFE_CONFIRM_DUTY/safeCheckList",
    name: "safeCheckList",
    component: () => import("@/views/safeConfirmDuty/safeCheckList.vue"),
    meta: {
      menuId: "9001000",
    },
  },

  // views/safeConfirmDuty/safeManagementPolicy.vue
  // 안전보건 경영방침
  {
    path: "/SAFE_CONFIRM_DUTY/safeManagementPolicy",
    name: "safeManagementPolicy",
    component: () => import("@/views/safeConfirmDuty/safeManagementPolicy.vue"),
    meta: {
      menuId: "9001100",
    },
  },

  // views/safeConfirmDuty/safeManagementPolicyPublication.vue
  // 안전보건 경영방침 및 목표 공개
  {
    path: "/SAFE_CONFIRM_DUTY/safeManagementPolicyPublication",
    name: "safeManagementPolicyPublication",
    component: () =>
      import("@/views/safeConfirmDuty/safeManagementPolicyPublication.vue"),
    meta: {
      menuId: "9001200",
    },
  },

  // views/safeConfirmDuty/safeOrganization.vue
  // 안전보건 전담조직 설치
  {
    path: "/SAFE_CONFIRM_DUTY/safeOrganization",
    name: "safeOrganization",
    component: () => import("@/views/safeConfirmDuty/safeOrganization.vue"),
    meta: {
      menuId: "9001300",
    },
  },

  // views/safeConfirmDuty/safeRiskAssmnReport.vue
  // 위험성평가 결과 보고
  {
    path: "/SAFE_CONFIRM_DUTY/safeRiskAssmnReport",
    name: "safeRiskAssmnReport",
    component: () => import("@/views/safeConfirmDuty/safeRiskAssmnReport.vue"),
    meta: {
      menuId: "9001600",
    },
  },

  // views/safeConfirmDuty/safeActionStatus.vue
  // 위험성평가 조치현황
  {
    path: "/SAFE_CONFIRM_DUTY/safeActionStatus",
    name: "safeActionStatus",
    component: () => import("@/views/safeConfirmDuty/safeActionStatus.vue"),
    meta: {
      menuId: "9001800",
    },
  },

  // views/safeConfirmDuty/budget.vue
  // 예산 편성 및 집행
  {
    path: "/SAFE_CONFIRM_DUTY/safeBudget",
    name: "safeBudget",
    component: () => import("@/views/safeConfirmDuty/safeBudget.vue"),
    meta: {
      menuId: "9001900",
    },
  },

  // views/safeConfirmDuty/siteManPower.vue
  // 현장 인력 정보
  {
    path: "/SAFE_CONFIRM_DUTY/siteManPower",
    name: "siteManPower",
    component: () => import("@/views/safeConfirmDuty/siteManPower.vue"),
    meta: {
      menuId: "9002000",
    },
  },

  // views/safeConfirmDuty/safeEvalPage.vue
  // 업무수행 평가
  {
    path: "/SAFE_CONFIRM_DUTY/safeEvalPage",
    name: "safeEvalPage",
    component: () => import("@/views/safeConfirmDuty/safeEvalPage.vue"),
    meta: {
      menuId: "9002100",
    },
  },

  // views/safeConfirmDuty/safeEmergencyManual.vue
  // 재해대응 매뉴얼
  {
    path: "/SAFE_CONFIRM_DUTY/safeEmergencyManual",
    name: "safeEmergencyManual",
    component: () => import("@/views/safeConfirmDuty/safeEmergencyManual.vue"),
    meta: {
      menuId: "9002200",
    },
  },

  // views/SAFE_CONFIRM_DUTY/safeEmergencyManualCheck
  // 재해대응 메뉴얼 조치 점검
  {
    path: "/SAFE_CONFIRM_DUTY/safeEmergencyManualCheck",
    name: "safeEmergencyManualCheck",
    component: () =>
      import("@/views/safeConfirmDuty/safeEmergencyManualCheck.vue"),
    meta: {
      menuId: "9002250",
    },
  },

  // views/safeConfirmDuty/safeExperts.vue
  // 전문인력 선임
  {
    path: "/SAFE_CONFIRM_DUTY/safeExperts",
    name: "safeExperts",
    component: () => import("@/views/safeConfirmDuty/safeExperts.vue"),
    meta: {
      menuId: "9002300",
    },
  },

  // views/SAFE_CONFIRM_DUTY/safeAgencyCheckReport
  // 위탁기관 점검 결과
  {
    path: "/SAFE_CONFIRM_DUTY/safeAgencyCheckReport",
    name: "safeAgencyCheckReport",
    component: () =>
      import("@/views/safeConfirmDuty/safeAgencyCheckReport.vue"),
    meta: {
      menuId: "9002400",
    },
  },

  // views/SAFE_CONFIRM_DUTY/riskAssmnCnfrnWithAdtnRisk
  // 추가위험 개선방안 이행
  {
    path: "/SAFE_CONFIRM_DUTY/riskAssmnCnfrnWithAdtnRisk",
    name: "riskAssmnCnfrnWithAdtnRisk",
    component: () =>
      import("@/views/safeConfirmDuty/riskAssmnCnfrnWithAdtnRisk.vue"),
    meta: {
      menuId: "9002500",
    },
  },

  // views/SAFE_CONFIRM_DUTY/serviceProviderEvaluationReport
  // 수급업체 평가 점검
  {
    path: "/SAFE_CONFIRM_DUTY/serviceProviderEvaluationReport",
    name: "serviceProviderEvaluationReport",
    component: () =>
      import("@/views/safeConfirmDuty/serviceProviderEvaluationReport.vue"),
    meta: {
      menuId: "9002600",
    },
  },

  // views/SAFE_CONFIRM_DUTY/selectionVenderStandard
  // 적격업체 선정 기준/절차
  {
    path: "/SAFE_CONFIRM_DUTY/selectionVenderStandard",
    name: "selectionVenderStandard",
    component: () =>
      import("@/views/safeConfirmDuty/selectionVenderStandard.vue"),
    meta: {
      menuId: "9002800",
    },
  },
];
