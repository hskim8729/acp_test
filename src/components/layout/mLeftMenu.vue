<!-- layout/LayoutLeft.vue -->

<template>
  <div class="m_left_menu">
    <div class="top_area">
      <button class="setting" @click="appSettingBtn">앱 설정</button>
      <button class="close" @click="mMenuClose"></button>
    </div>
    <div class="user_info">
      <div class="name">
        <span class="roll" v-html="vendrJbttlNm"></span>
        <span v-html="userNm"></span>

        <select
          @change="getSiteInfo($event.target.selectedIndex)"
          class="text-white">
          <option
            class="text-black"
            v-for="(item, idx) in authSite"
            :key="idx"
            :value="item.siteCd">
            {{ item.siteNm }}
          </option>
        </select>
      </div>

      <router-link to="/m-myInfo">
        <button @click="mMenuClose">내정보 수정</button>
      </router-link>
    </div>

    <m-left-menu-list v-if="loginStore.isFirstOpenMenu"> </m-left-menu-list>

    <button class="m_logout" @click="logoutConfirm()">로그아웃</button>
  </div>

  <!-- 비밀번호 재설정 -->
  <div class="popup set_password">
    <div class="popup_title">
      <span>비밀번호 재설정</span>
    </div>
    <div class="popup_content">
      <popSetPassword ref="passwordInfo"></popSetPassword>
    </div>
    <div class="popup_button">
      <button @click="changePw">변경</button>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { onBeforeMount, onMounted, ref } from "vue";
import VueCookies from "vue-cookies";

import popSetPassword from "../../views/common/popSetPassword.vue";
import mLeftMenuList from "@/components/layout/mLeftMenuList.vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

// loginStore 전역변수
const passwordInfo = ref(null);
const loginStore = useLoginAuthStore();
const siteStore = useSiteImpRegulationStore();
const dialogStore = useDialogStore();

const vendrJbttlNm = ref();
const userNm = ref();
const siteNm = ref();
const authSite = ref();
const admAcctYn = ref();
const pwIntlYn = ref();
const isVisible = ref(false);

function openMenu(e) {
  if (isVisible.value == false) {
    isVisible.value = true;
  } else if (isVisible.value == true) {
    isVisible.value = false;
  }
}

async function getSiteInfo(idx) {
  router.push({
    path: "/m-main",
    name: "m-main",
  });
  console.log("idx : ", idx);
  loginStore.$patch({ siteIndex: idx });
  if (loginStore.$state.vendrInfo.vendrCd != "0000") {
    getSiteMnpwrInfo(loginStore.$state.siteIndex);
  }
  document.getElementsByClassName("user_info")[0].classList.remove("open");

  mMenuClose();
  //document.getElementsByClassName("site_list")[0].style.display = "none";
}

// 앱 설정 버튼
const appSettingBtn = () => {
  console.log("앱 설정 버튼");
  location.href = "tapp://setting";
};

// 로그아웃
function logoutConfirm() {
  dialogStore.openConfirmDialog("로그아웃 하시겠습니까?", {
    confirmCallback: async () => {
      logout();
    },
  });
}
function logout() {
  // 로그아웃 클릭 시 localStorage 삭제 (id, pw)
  window.localStorage.removeItem("mUserId");
  window.localStorage.removeItem("mUserPw");
  window.localStorage.removeItem("mExprTime");

  VueCookies.remove("AT");
  window.sessionStorage.clear();

  location.href = "/m-login";
  //$loginStore.logout();
}

// 탑 메뉴에서 현장 변경 시 siteMnpwrInfo 정보 변경
async function getSiteMnpwrInfo(siteIndex) {
  if (loginStore.siteList != null) {
    let siteCdVal = await loginStore.siteList[siteIndex].siteCd;

    const ptnrYn = loginStore.$state.vendrInfo.ptnrYn;
    const params = {
      vendrCd: loginStore.$state.userInfo.vendrCd,
      userId: loginStore.$state.userInfo.userId,
      division: "S",
      siteCd: siteCdVal,
      ptnrYn: ptnrYn,
    };
    console.log("admAcctYn : ", admAcctYn);
    if (admAcctYn.value === "Y") {
      const param = {
        userId: loginStore.userInfo.userId,
        vendrCd: loginStore.userInfo.vendrCd,
        siteCd: siteCdVal,
        siteNm: loginStore.siteList[siteIndex].siteNm,
        authCd: "1000",
        jbttlCd: "",
        jbttlNm: "",
        agreYn: "Y", // 관리자의 경우 현장실시규정 동의 체크 없이 동의로 간주
      };
      console.log("Y 일경우 param : ", param);
      loginStore.$patch({ siteInfo: param });
    } else {
      try {
        const res = await loginStore.getSiteMnpwrInfo(params);
        if (res.data != null && res.status === 200) {
          params.vendrCd = loginStore.$state.siteInfo.vendrCd;
          params.authCd = loginStore.$state.siteInfo.authCd;

          try {
            const res = await loginStore.userAuthInfo(params);
            if ((res.data != "") & (res.status === 200)) {
              vendrJbttlNm.value = loginStore.$state.authInfo.authNm;
            }
          } catch (err) {
            console.log(
              "TopHeader.vue > getSiteMnpwrInfo.userAuthInfo > err : ",
              err
            );
          }

          if (admAcctYn.value != "Y") {
            // 현장 실시규정 표준 최종 승인여부
            const cnt = await siteStore.siteApprCnt(params);

            if (loginStore.$state.siteInfo.agreYn != "Y" && cnt > 0) {
              router.push({
                path: "/SITE/m-siteImpRegulation",
                replace: true,
              });
            }
          }
          //vendrJbttlNm.value = loginStore.$state.siteInfo.jbttlNm;
        } else {
          if (admAcctYn.value != "Y") {
            dialogStore.openAlertDialog("현장 인력으로 등록되지 않았습니다.");
            return;
          }
        }
      } catch (err) {
        console.log("TopHeader.vue > getSiteMnpwrInfo > err : ", err);
        throw err;
      }
    }
  } else {
    dialogStore.openAlertDialog("등록된 현장이 없습니다.");
    return;
  }

  userNm.value = loginStore.$state.userInfo.userNm;
  authSite.value = loginStore.$state.siteList;
  siteNm.value = loginStore.$state.siteInfo.siteNm;
  //debugger;
}

async function Info() {
  if (loginStore.isAuthorized) {
    const adminYn = loginStore.$state.userInfo.admAcctYn;

    pwIntlYn.value = await loginStore.$state.userInfo.pwIntlYn;
    if (pwIntlYn.value === "Y") {
      dialogStore.openAlertDialog(
        "비밀번호가 초기화되어 재설정이 필요합니다.",
        {
          callback: () => {
            popSetupPassword();
          },
        }
      );
    }

    if (loginStore.$state.userInfo.vendrCd === "0000") {
      vendrJbttlNm.value = "슈퍼바이저";
      userNm.value = loginStore.$state.userInfo.userNm;
      siteNm.value = "슈퍼바이저";
      authSite.value = [
        {
          siteNm: "슈퍼바이저",
        },
      ];

      const params = {};
      params.vendrCd = loginStore.$state.userInfo.vendrCd;
    } else if (adminYn === "Y") {
      const params = {};
      params.vendrCd = loginStore.$state.userInfo.vendrCd;
      params.authCd = "1000";

      siteNm.value = "관리자";
      // authSite.value = [{
      //     "siteNm": "관리자"
      // }];

      try {
        const res = await loginStore.userAuthInfo(params);
        if (res.data != "" && res.status === 200) {
          userNm.value = loginStore.$state.userInfo.userNm;
          vendrJbttlNm.value = loginStore.$state.authInfo.authNm;
        } else {
          dialogStore.openAlertDialog(res.data.message, { type: "error" });
        }
      } catch (err) {
        console.log("TopHeader.vue > info() > userAuthInfo err : ", err);
        throw err;
      }

      const param = {};
      param.vendrCd = loginStore.$state.userInfo.vendrCd;
      param.userId = loginStore.$state.userInfo.userId;
      param.admAcctYn = loginStore.$state.userInfo.admAcctYn;

      try {
        const res = await loginStore.siteBsInfo(param);

        if (res.data.length > 0) {
          if (res.data != "" && res.status === 200) {
            authSite.value = loginStore.$state.siteList;
            console.log("res.data.length authSite : ", authSite.value);
            //getSiteMnpwrInfo(siteCd.value);
            getSiteInfo(loginStore.siteIndex);
          } else {
            dialogStore.openAlertDialog(res.data.message, { type: "error" });
          }
        }
      } catch (err) {
        console.log("TopHeader.vue > Info().siteBsInfo > err : ", err);
        throw err;
      }
    } else {
      const params = {};
      params.vendrCd = loginStore.$state.userInfo.vendrCd;
      params.userId = loginStore.$state.userInfo.userId;
      params.admAcctYn = loginStore.$state.userInfo.admAcctYn;

      try {
        const res = await loginStore.siteBsInfo(params);

        if (res.data.length > 0) {
          if (res.data != "" && res.status === 200) {
            //getSiteMnpwrInfo(siteCd.value);
            getSiteInfo(loginStore.siteIndex);
          } else {
            dialogStore.openAlertDialog(res.data.message, { type: "error" });
          }
        } else {
          // 여기에 소속현장 없어서 로그인 막기
          dialogStore.openAlertDialog(
            "소속된 현장이 없습니다. <br>관리자가 현장을 지정한 후 사용할 수 있습니다.",
            {
              callback: () => {
                logout();
              },
            }
          );
          vendrJbttlNm.value = "권한 없음";
          userNm.value = loginStore.$state.userInfo.userNm;
          siteNm.value = "현장 없음";
        }
      } catch (err) {
        console.log("TopHeader.vue > Info().siteBsInfo > err : ", err);
        throw err;
      }
    }
  }
  admAcctYn.value = loginStore.$state.userInfo.admAcctYn;
}

onBeforeMount(() => {
  //Info();
});

onMounted(() => {
  Info();
});

function mMenuClose() {
  isVisible.value = false;
  document.getElementsByClassName("m_left_menu")[0].classList.remove("open");
  document.getElementsByClassName("m_menu_bg")[0].classList.remove("show");
}

function popSetupPassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("set_password")[0].classList.add("show");
}

// 팝업창 닫기
function popupClose() {
  //alert("")
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("set_password")[0].classList.remove("show");
}

// 대문자, 소문자, 숫자 포함 여부를 확인하는 정규식
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return regex.test(password);
}

async function changePw() {
  const pwInfo = passwordInfo.value.updateInfo();
  const passwordCheck = pwInfo.userPw;
  const passwordCheck2 = pwInfo.chkPw;

  if (!validatePassword(passwordCheck) || !validatePassword(passwordCheck2)) {
    dialogStore.openAlertDialog(
      "최소 6자리 이상,<br>최소 1개 이상의 숫자, 대문자, 소문자를 <br>모두 포함해야 합니다."
    );
    return;
  }

  if (pwInfo.userPw != pwInfo.chkPw) {
    dialogStore.openAlertDialog("비밀번호 확인이 일치하지 않습니다.");
    return;
  } else {
    dialogStore.openConfirmDialog("비밀번호를 변경하시겠습니까?", {
      confirmCallback: async () => {
        const params = {
          userId: loginStore.$state.userInfo.userId,
          userPw: pwInfo.userPw,
          crryTelNo: loginStore.$state.userInfo.crryTelNo,
          pwIntlYn: "Y",
        };

        try {
          const res = await loginStore.updateRstUserPw(params);
          if (res.data == "OK") {
            dialogStore.openAlertDialog(
              "정상적으로 변경되었습니다. <br>변경된 비밀번호는 로그인 시 적용됩니다.",
              {
                callback: () => {
                  popupClose();
                  location.reload();
                },
              }
            );
            loginStore.$state.userInfo.pwIntlYn = "N";
          } else {
            dialogStore.openAlertDialog(res.data.message, { type: "error" });
          }
        } catch (err) {
          console.log("TopHeader.vue > changePw() > err : ", err);
          throw err;
        }
      },
    });
  }
}
</script>

<style>
.popup.set_password {
  width: 400px;
  height: 350px;
}

/* header/bottom height: 260px */
.m_menu_list {
  height: calc(100% - 260px);
  overflow: auto;
}
</style>
