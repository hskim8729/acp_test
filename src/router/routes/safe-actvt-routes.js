export default [
  //ToolBoxMeeting
  {
    path: "/SAFE_ACTVT/toolBoxMeeting",
    name: "toolBoxMeeting",
    component: () => import("@/views/safeActvt/toolBoxMeeting.vue"),
    meta: {
      menuId: "3001000",
    },
  },
  //ToolBoxMeetingRegist
  {
    path: "/SAFE_ACTVT/toolBoxMeetingRegist/:tbmDt/:mode/:psitnVendrCd",
    name: "toolBoxMeetingRegist",
    component: () => import("@/views/safeActvt/toolBoxMeetingRegist.vue"),
    meta: {
      menuId: "3001000",
    },
  },

  // 중점점검활동
  {
    path: "/SAFE_ACTVT/majorInspectionActivity",
    name: "majorInspectionActivity",
    component: () => import("@/views/safeActvt/MajorInspectionActivity.vue"),
    meta: {
      menuId: "3002000",
    },
  },

  // 중점조치활동
  {
    path: "/SAFE_ACTVT/majorActionActivity",
    name: "majorActionActivity",
    component: () => import("@/views/safeActvt/MajorActionActivity.vue"),
    meta: {
      menuId: "3003000",
    },
  },

  // 중점조치승인
  {
    path: "/SAFE_ACTVT/majorActionApprove",
    name: "majorActionApprove",
    component: () => import("@/views/safeActvt/MajorActionApprove.vue"),
    meta: {
      menuId: "3004000",
    },
  },

  // 중점점검현황
  {
    path: "/SAFE_ACTVT/majorInspectionState",
    name: "majorInspectionState",
    component: () => import("@/views/safeActvt/MajorInspectionState.vue"),
    meta: {
      menuId: "3005000",
    },
  },

  // 일상점검활동
  {
    path: "/SAFE_ACTVT/dailyInspectionActivity",
    name: "dailyInspectionActivity",
    component: () => import("@/views/safeActvt/DailyInspectionActivity.vue"),
    meta: {
      menuId: "3006000",
    },
  },

  // 일상조치활동
  {
    path: "/SAFE_ACTVT/dailyActionActivity",
    name: "dailyActionActivity",
    component: () => import("@/views/safeActvt/DailyActionActivity.vue"),
    meta: {
      menuId: "3007000",
    },
  },

  // 일상조치승인
  {
    path: "/SAFE_ACTVT/dailyActionApprove",
    name: "dailyActionApprove",
    component: () => import("@/views/safeActvt/DailyActionApprove.vue"),
    meta: {
      menuId: "3008000",
    },
  },

  // 일상점검현황
  {
    path: "/SAFE_ACTVT/dailyInspectionState",
    name: "dailyInspectionState",
    component: () => import("@/views/safeActvt/DailyInspectionState.vue"),
    meta: {
      menuId: "3009000",
    },
  },

  // TBM 모바일
  //ToolBoxMeeting mobile
  {
    path: "/SAFE_ACTVT/m-toolBoxMeeting",
    name: "m-toolBoxMeeting",
    component: () => import("@/m-views/safeActvt/m-toolBoxMeeting.vue"),
    meta: {
      menuId: "300000",
    },
  },
  //toolBoxMeetingDetail mobile
  {
    path: "/SAFE_ACTVT/m-toolBoxMeetingDetail",
    name: "m-toolBoxMeetingDetail",
    component: () => import("@/m-views/safeActvt/m-toolBoxMeetingDetail.vue"),
    meta: {
      menuId: "3001000",
    },
  },
  //toolBoxMeetingDetail2 mobile (로그인없이 근로자용 화면)
  {
    path: "/SAFE_ACTVT/m-toolBoxMeetingDetail2/:param",
    name: "m-toolBoxMeetingDetail2",
    component: () => import("@/m-views/safeActvt/m-toolBoxMeetingDetail2.vue"),
    meta: {
      menuId: "3001000",
    },
  },

  // 중점점검활동 모바일
  // 중점점검활동 리스트
  {
    path: "/SAFE_ACTVT/m-majorInspectionActivity",
    name: "m-majorInspectionActivity",
    component: () =>
      import("@/m-views/safeActvt/m-majorInspectionActivity.vue"),
    meta: {
      menuId: "3002000",
    },
  },

  // 중점조치활동 리스트
  {
    path: "/SAFE_ACTVT/m-majorActionActivity",
    name: "m-majorActionActivity",
    component: () => import("@/m-views/safeActvt/m-majorActionActivity.vue"),
    meta: {
      menuId: "3003000",
    },
  },
  // 중점조치승인 리스트
  {
    path: "/SAFE_ACTVT/m-majorActionApprove",
    name: "m-majorActionApprove",
    component: () => import("@/m-views/safeActvt/m-majorActionApprove.vue"),
    meta: {
      menuId: "3004000",
    },
  },

  // 일상점검활동 모바일
  // 일상점검활동 리스트
  {
    path: "/SAFE_ACTVT/m-dailyInspectionActivity",
    name: "m-dailyInspectionActivity",
    component: () =>
      import("@/m-views/safeActvt/m-dailyInspectionActivity.vue"),
    meta: {
      menuId: "3006000",
    },
  },
  // 일상점검조치 리스트
  {
    path: "/SAFE_ACTVT/m-dailyActionActivity",
    name: "m-dailyActionActivity",
    component: () => import("@/m-views/safeActvt/m-dailyActionActivity.vue"),
    meta: {
      menuId: "3007000",
    },
  },
  // 일상점검승인 리스트
  {
    path: "/SAFE_ACTVT/m-dailyActionApprove",
    name: "m-dailyActionApprove",
    component: () => import("@/m-views/safeActvt/m-dailyActionApprove.vue"),
    meta: {
      menuId: "3008000",
    },
  },
];
