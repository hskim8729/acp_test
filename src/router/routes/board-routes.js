export default [
  // 게시판 > 공지사항
  // views/publish/SYS/cdMgmt.vue
  {
    path: "/BOARD/notice",
    name: "NoticePage",
    component: () => import("@/views/board/notice.vue"),
    meta: {
      menuId: "8001000",
    },
  },
  {
    path: "/BOARD/noticeWrite",
    name: "NoticeWritePage",
    component: () => import("@/views/board/noticeWrite.vue"),
    meta: {
      menuId: "8001000",
    },
  },

  // 게시판 < 자료실
  // views/publish/SYS/menuMgmt.vue
  {
    path: "/BOARD/data",
    name: "dataPage",
    component: () => import("@/views/board/data.vue"),
    meta: {
      menuId: "8002000",
    },
  },

  // 게시판 < 알림소식
  {
    path: "/BOARD/notifyNews",
    name: "notifyNewsPage",
    component: () => import("@/views/board/notifyNews.vue"),
    meta: {
      menuId: "8004000",
    },
  },

  // 게시판 < 운영정책
  {
    path: "/BOARD/policy",
    name: "policyPage",
    component: () => import("@/views/board/policyPage.vue"),
    meta: {
      menuId: "8006000",
    },
  },
];
