export default [
  // 추가위험 발굴 > 추가위험발굴관리
  // views/adtnRisk/additionalRiskDiscovery.vue
  {
    path: "/ADTN_RISK/additionalRiskDiscovery",
    name: "AdditionalRiskDiscovery",
    component: () => import("@/views/adtnRisk/additionalRiskDiscovery.vue"),
    meta: {
      menuId: "4001000",
    },
  },

  // 추가위험 발굴 모바일 > 추가위험발굴관리
  {
    path: "/ADTN_RISK/m-additionalRisk",
    name: "m-additionalRisk",
    component: () => import("@/m-views/adtnRisk/m-additionalRisk.vue"),
    meta: {
      menuId: "4001000",
    },
  },

  // 추가위험 발굴 모바일 > 순회점검 등록
  {
    path: "/ADTN_RISK/m-additionalRiskTour",
    name: "m-additionalRiskTour",
    component: () => import("@/m-views/adtnRisk/m-additionalRisk_tour.vue"),
    //test용 임시 import
    // component: () =>
    //   import("@/m-views/adtnRisk/m-additionalRisk_tour_test.vue"),
    meta: {
      menuId: "4001000",
    },
  },
  // 추가위험 발굴 모바일 > 근로자제안 등록
  {
    path: "/ADTN_RISK/m-additionalRiskWorker",
    name: "m-additionalRiskWorker",
    component: () => import("@/m-views/adtnRisk/m-additionalRisk_worker.vue"),
    meta: {
      menuId: "4001000",
    },
  },
  // 추가위험 발굴 모바일 > 아차사고 등록
  {
    path: "/ADTN_RISK/m-additionalRiskAccident",
    name: "m-additionalRiskAccident",
    component: () => import("@/m-views/adtnRisk/m-additionalRisk_accident.vue"),
    meta: {
      menuId: "4001000",
    },
  },
];
