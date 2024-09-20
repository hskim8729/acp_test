import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { createRouter, createWebHistory } from "vue-router";

import AgGridPage from "@/views/AgGridPage.vue";
import LoginPage from "@/views/common/LoginPage.vue";
import LogoutPage from "@/views/common/LogoutPage.vue";
import NotFoundPage from "@/views/common/NotFoundPage.vue";
import mIndexPage from "@/views/common/mIndexPage.vue";
import mLoginPage from "@/views/common/mLoginPage.vue";
import AdthRiskroutes from "./routes/adtn-risk-routes";
import boardRoutes from "./routes/board-routes";
import commonRoutes from "./routes/common-routes";
import incidentRoutes from "./routes/incident-routes";
import inspcActvtRoutes from "./routes/inspc-actvt-routes";
import safeActvtRoutes from "./routes/safe-actvt-routes";
import safeConfirmDutyRoutes from "./routes/safe-confirm-duty-routes";
import siteRoutes from "./routes/site-routes";
import stdMgmtRoutes from "./routes/std-mgmt-routes";
import systemRoutes from "./routes/sys-routes";
const routes = [
  {
    // root url로 접속하면 로그인 페이지로 이동
    path: "/",
    //redirect: '/login',
    redirect: (to) => {
      if (to.meta.isMobiled) {
        return {
          name: "mLoginPage",
          status: 301,
        };
      } else {
        return {
          name: "LoginPage",
          status: 301,
        };
      }
    },
  },
  {
    // Web 로그인
    //path: '/login',
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
    // props: true,
    meta: {
      isMobiled: false,
      userId: "",
      userPw: "",
      menuId: 0,
    },
  },
  {
    // Mobile 로그인
    //path: '/login',
    path: "/m-login",
    name: "mLoginPage",
    component: mLoginPage,
    // props: true,
    meta: {
      isMobiled: true,
      userId: "",
      userPw: "",
      menuId: 0,
    },
  },
  {
    // Mobile 랜딩페이지
    path: "/m-index",
    name: "mIndexPage",
    component: mIndexPage,
    //props: true,
    meta: {
      isMobiled: true,
      userId: "",
      userPw: "",
      menuId: 0,
    },
  },
  {
    // 로그아웃
    path: "/logout",
    name: "LogoutPage",
    component: LogoutPage,
    menuId: 0,
  },

  // 업무관련 라우트
  ...incidentRoutes, // 장애관리

  ...systemRoutes, // 시스템

  ...commonRoutes, // 공통

  ...inspcActvtRoutes, // 안전점검활동

  ...stdMgmtRoutes, // 표준관리

  ...siteRoutes, // 현장등록

  ...AdthRiskroutes, // 추가위험발굴

  ...safeActvtRoutes, // 안전활동

  ...boardRoutes, // 게시판

  ...safeConfirmDutyRoutes, // 안전보건확인의무

  {
    // 존재하지 않는 페이지를 접근할 때
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
  {
    path: "/ag-grid",
    component: AgGridPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // BASE_URL : '/'
  routes,
});

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function isMobileBrowser() {
  if (navigator.userAgent.indexOf("TApp") > -1) {
    return false;
  } else {
    return true;
  }
}

// 메뉴 이동 시 권한 체크
router.beforeEach((to, from, next) => {
  const loginStore = useLoginAuthStore();
  const siteStore = useSiteImpRegulationStore();
  const dialogStore = useDialogStore();
  const isMobiled = isMobile();
  const menu = loginStore.$state.menuInfo;

  // 팝업 배경 제거
  const popups = document.querySelectorAll(".popup_bg, .popup_bg2");
  popups.forEach((popup) => {
    popup.classList.remove("show");
  });

  // 로그인 없이 페이지 이동이 있을 경우
  if (isMobiled) {
    let mobileBrowserChk = isMobileBrowser();
    if (
      to.fullPath !== "/m-login" &&
      !loginStore.isAuthorized &&
      to.fullPath !== "/m-index"
    ) {
      if (to.fullPath.includes("/SAFE_ACTVT/m-toolBoxMeetingDetail2")) {
        next();
      } else {
        if (mobileBrowserChk) {
          next("/m-index");
        } else {
          next("/m-login");
        }
      }
    } else if (to.fullPath == "/m-login" && loginStore.isAuthorized) {
      if (to.fullPath == "/ADTN_RISK/m-additionalRiskAccident") {
        next();
      } else {
        next("/m-myInfo");
      }
    } else if (!to.fullPath.includes("m-")) {
      const fPath = to.fullPath.substring(
        to.fullPath.lastIndexOf("/"),
        to.fullPath.lastIndexOf("/") + 1
      );
      const sPath = to.fullPath.substring(to.fullPath.lastIndexOf("/") + 1);
      const url = fPath + "m-" + sPath;
      next(url);
    } else {
      // 현장 실시규정 동의하지 않은 상태에서는 main, 내정보 수정, 현장실시규정만 갈 수 있음.
      const withoutSiteAgreList = [
        "/m-login", // 로그아웃은 할수 있어야함
        "/m-index",
        "/m-main",
        "/m-myInfo",
        "/SITE/m-siteImpRegulation",
      ];
      if (
        loginStore.isSiteAgreYn ||
        withoutSiteAgreList.includes(to.fullPath)
      ) {
        // 현장등록 안된 상태에서는 m-main과 현장 실시규정만 갈 수 있음
        next();
      } else {
        dialogStore.openToastDialog(
          "현장 실시규정에 동의 후 사용할 수 있는 기능입니다."
        );
      }
    }
  } else {
    // Web일 경우

    // 현장 동의 여부
    let argeYn = "";

    if (to.fullPath != "/main") {
      if (loginStore.$state.userInfo.admAcctYn != "Y") {
        // 현장 실시규정 표준 최종 승인여부
        if (
          loginStore.$state.siteInfo.agreYn != "Y" &&
          siteStore.$state.cnt > 0
        ) {
          alert(
            "현장 인력 동의가 필요합니다. \n현장 실시규정 화면으로 넘어갑니다."
          );
          argeYn = "/SITE/siteImpRegulation";
          location.href = "/SITE/siteImpRegulation";
        }
      }
    }

    if (
      to.fullPath !== "/login" &&
      to.fullPath !== "/terms" &&
      to.fullPath !== "/notifyNewsView" &&
      !loginStore.isAuthorized
    ) {
      //alert("로그인이 필요합니다.");
      next("/login");
    } else if (to.fullPath == "/login" && loginStore.isAuthorized) {
      next("/main");
    } else if (to.fullPath.includes("m-")) {
      const url = to.fullPath.replaceAll("m-", "");
      next(url);
    } else {
      if (menu != "") {
        if (
          menu.length > 0 &&
          to.fullPath != "/login" &&
          to.fullPath != "/main" &&
          loginStore.isAuthorized
        ) {
          if (menu.some((item) => item.menuId === to.meta.menuId)) {
            if (
              (to.fullPath.includes("/INSPC_ACTVT/") ||
                to.fullPath.includes("/SAFE_ACTVT/") ||
                to.fullPath.includes("/ADTN_RISK/") ||
                to.fullPath.includes("/SITE/")) &&
              loginStore.$state.siteList.length == 0
            ) {
              if (
                to.fullPath === "/SITE/siteReg" ||
                to.fullPath === "/SITE/siteRegDetail"
              ) {
                // 시스템 관리자는 현장이 없어도 등록은 할 수 있다.
                next();
              } else {
                alert("등록된 현장이 없습니다.");
                next(from);
              }
            } else {
              next();
            }
          } else {
            alert("메뉴 권한이 없습니다.");
            next(from);
          }
        }
      } else {
        alert("메뉴 권한이 없습니다. \n 시스템 관리자에게 문의하세요.");
        loginStore.logout();
      }

      if (argeYn == "") {
        next();
      }
    }
  }
});

export default router;
