<template>
  <div class="top_wrap">
    <button @click="leftMenuControl" id="leftMenuBtn" class="menu_open">
      <div class="line1"></div>
      <div class="line2"></div>
      <div class="line3"></div>
    </button>

    <router-link to="/main" class="top_logo_wrap"></router-link>
    <div class="top_site">
      <div class="site_name" @click="sitePopChange">
        {{ siteNm }}
        <button
          class="change_site_btn"
          v-if="loginStore.$state.siteList.length > 0"></button>
      </div>

      <div class="site_list" v-if="isSiteOpen" @mouseleave="sitePopChange">
        <ul>
          <li
            v-for="(item, idx) in authSite"
            @click="changeSiteInfo(idx)"
            :key="loginStore.siteIndex">
            {{ item.siteNm }}
          </li>
        </ul>
      </div>
    </div>

    <div class="menu_top_bg"></div>

    <div class="top_right_content">
      <div class="user_info_wrap">
        <div class="user_info">
          <span class="grade" v-html="vendrJbttlNm"></span>
          <span class="name" v-html="userNm"></span>
          <span class="site" v-html="vendrNm"></span>
        </div>
      </div>
      <button class="myPldo_btn" @click="openPopMyPldo">
        <div class="icon"></div>
      </button>
      <router-link to="/main">
        <button class="home_btn"><div class="icon"></div></button>
      </router-link>
      <button
        class="system_menu_btn"
        @click="isSysMenu = true"
        v-if="admMenuList.length > 0"></button>
      <button class="help_btn" @click="openHelp"></button>
      <button class="logout_btn" @click="logoutConfirm()">로그아웃</button>
    </div>
  </div>

  <div class="sys_menu" @mouseleave="sysMenuClose" v-if="isSysMenu">
    <ul @click="isSysMenu = false">
      <li v-for="list in admMenuList" :key="list.menuId">
        <router-link :to="`${list.menuPath}`">{{ list.menuNm }}</router-link>
      </li>
    </ul>
  </div>

  <!-- 비밀번호 재설정 -->
  <div class="popup set_password">
    <div class="popup_title">
      <span>비밀번호 재설정</span>
      <!-- <button class="popup_close" @click="popupClose($event)"></button> -->
    </div>
    <div class="popup_content">
      <popSetPassword ref="passwordInfo" @changePw="changePw"></popSetPassword>
    </div>
    <div class="popup_button">
      <button @click="changePw">변경</button>
      <!-- <button @click="popupClose($event)">취소</button> -->
    </div>
  </div>

  <!-- 회원정보 수정 -->
  <div class="popup myPldo">
    <my-pldo v-if="isPopMyPldo" @close="isPopMyPldo = false" />
  </div>
</template>

<script setup>
import router from "@/router";
import {
  onBeforeMount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  ref,
  toRefs,
  watch,
} from "vue";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { myInfoStore } from "@/stores/common/myinfo-store";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";

import myPldo from "@/views/common/MyPldo.vue";
import popSetPassword from "../../views/common/popSetPassword.vue";

// loginStore 전역변수
//const app = getCurrentInstance();
//const $loginStore = app.appContext.config.globalProperties.$loginStore;

const loginStore = useLoginAuthStore();
const siteStore = useSiteImpRegulationStore();
const userInfoStore = myInfoStore();
const dialogStore = useDialogStore();

const vendrJbttlNm = ref();
const vendrNm = ref();
const userNm = ref();
const siteNm = ref();
const authSite = ref();
const admAcctYn = ref();
const admMenuList = ref([]);
const pwIntlYn = ref();
const signFile = ref(null);
const signInfo = ref();

const { userInfo } = toRefs(loginStore);

const isSysMenu = ref(false);

const passwordInfo = ref(null);
const isPopMyPldo = ref(false);
const openPopMyPldo = () => {
  isPopMyPldo.value = true;
};

function leftMenuControl() {
  var MenuStatus = document.getElementById("leftMenuBtn");

  if (MenuStatus.classList.contains("menu_open")) {
    MenuStatus.classList.replace("menu_open", "menu_close");
    document.getElementsByClassName("left_wrap")[0].classList.add("open");
    document.getElementsByClassName("content_wrap")[0].classList.add("open");
  } else {
    MenuStatus.classList.replace("menu_close", "menu_open");
    document.getElementsByClassName("left_wrap")[0].classList.remove("open");
    document.getElementsByClassName("content_wrap")[0].classList.remove("open");
  }
}

const isSiteOpen = ref(false);
function sitePopChange() {
  isSiteOpen.value = !isSiteOpen.value;
}

function openHelp() {
  // 새 탭이 아니고 새창으로 열기위해 "width=800,height=600,noopener,noreferrer"옵션
  window.open(
    "https://plan2do.craft.me/help",
    "_blank",
    "width=1000,height=800,noopener,noreferrer"
  );
}

function logoutConfirm() {
  dialogStore.openConfirmDialog("로그아웃 하시겠습니까?", {
    confirmCallback: async () => {
      logout();
    },
  });
}

function logout() {
  window.localStorage.removeItem("wUserId");
  loginStore.logout();
}

function changeSiteInfo(idx) {
  //현장정보 변경 후 메인으로 보내기
  router.push({
    path: "/main",
  });
  getSiteInfo(idx);
}
async function getSiteInfo(idx) {
  loginStore.$patch({ siteIndex: idx });
  if (loginStore.$state.vendrInfo.vendrCd != "0000") {
    getSiteMnpwrInfo(loginStore.$state.siteIndex);
  }
  isSiteOpen.value = false;
}

async function changePw() {
  const pwInfo = passwordInfo.value.updateInfo();
  const passwordCheck = pwInfo.userPw;
  const passwordCheck2 = pwInfo.chkPw;

  if (!validatePassword(passwordCheck)) {
    dialogStore.openAlertDialog(
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다."
    );
    return;
  }
  if (!validatePassword(passwordCheck2)) {
    dialogStore.openAlertDialog(
      "최소 6자리 이상, 최소 1개 이상의 숫자, 대문자, 소문자를 모두 포함해야 합니다."
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
              "정상적으로 변경되었습니다. \n 변경된 비밀번호는 로그인 시 적용됩니다."
            );
            loginStore.$state.userInfo.pwIntlYn = "N";
            popupClose();
            location.reload();
          } else {
            dialogStore.openAlertDialog(res.data.message);
          }
        } catch (err) {
          console.log("TopHeader.vue > changePw() > err : ", err);
          throw err;
        }
      },
    });
  }
}

// 팝업창 닫기
function popupClose() {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("set_password")[0].classList.remove("show");
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
              vendrNm.value = loginStore.$state.vendrInfo.vendrNm;
              try {
                const res = await loginStore.vendrMenuInfo(params);
                if (res.data != "" && res.status === 200) {
                  const list = loginStore.$state.menuInfo;
                  const mList = [];
                  list.forEach((item) => {
                    if (item.menuUpperId === "7000000") {
                      mList.push(item);
                    }
                  });
                  admMenuList.value = mList;
                } else {
                  dialogStore.openAlertDialog(res.data.message);
                }
              } catch (err) {
                console.log(
                  "TopHeader.vue > getSiteMnpwrInfo.vendrMenuInfo > err : ",
                  err
                );
                throw err;
              }
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
              console.log("현장 인력 동의여부 체크 확인");
              // alert(
              //   "현장 인력 동의가 필요합니다. \n현장 실시규정 화면으로 넘어갑니다."
              // );
              router.push("/SITE/siteImpRegulation");
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
      //alert("비밀번호가 초기화되어 재설정이 필요합니다.");
      popSetupPassword();
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

      try {
        const res = await loginStore.vendrMenuInfo(params);
        if (res.data != "" && res.status === 200) {
          const list = loginStore.$state.menuInfo;
          const mList = [];
          list.forEach((item) => {
            if (item.menuUpperId === "7000000") {
              mList.push(item);
            }
          });
          admMenuList.value = mList;
        } else {
          dialogStore.openAlertDialog(res.data.message);
        }
      } catch (err) {
        console.log("TopHeader.vue > Info().vendrMenuInfo() > err : ", err);
        throw err;
      }
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
          vendrNm.value = loginStore.$state.vendrInfo.vendrNm;
          try {
            const res = await loginStore.vendrMenuInfo(params);
            if (res.data != "" && res.status === 200) {
              const list = loginStore.$state.menuInfo;
              const mList = [];
              list.forEach((item) => {
                if (item.menuUpperId === "7000000") {
                  mList.push(item);
                }
              });
              admMenuList.value = mList;
            } else {
              dialogStore.openAlertDialog(res.data.message);
            }
          } catch (err) {
            console.log("TopHeader.vue > Info().vendrMenuInfo() > err : ", err);
            throw err;
          }

          const list = loginStore.$state.menuInfo;
          const mList = [];
          list.forEach((item) => {
            if (item.menuUpperId === "7000000") {
              mList.push(item);
            }
          });
          admMenuList.value = mList;
        } else {
          dialogStore.openAlertDialog(res.data.message);
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
            //getSiteMnpwrInfo(siteCd.value);
            getSiteInfo(loginStore.siteIndex);
          } else {
            dialogStore.openAlertDialog(res.data.message);
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
            getSiteInfo(loginStore.siteIndex);
          } else {
            dialogStore.openAlertDialog(res.data.message);
          }
        } else {
          // 여기에 소속 현장 없다고 로그인 막기
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

function popSetupPassword() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("set_password")[0].classList.add("show");
}

// 대문자, 소문자, 숫자 포함 여부를 확인하는 정규식
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  return regex.test(password);
}

watch(
  async () => loginStore.siteIndex,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      setTimeout(() => {
        location.reload();
      }, 100);
    }
  },
  { deep: true }
);

watch(
  () => userInfo.value.userNm,
  (newUserNm, oldUserNm) => {
    if (newUserNm !== oldUserNm) {
      userNm.value = loginStore.$state.userInfo.userNm;
    }
  },
  { deep: true }
);

onBeforeMount(() => {});

onMounted(() => {
  Info();
});

onUpdated(() => {});

onBeforeUpdate(() => {});
</script>

<style>
.popup.set_password {
  width: 450px;
  height: 300px;
}
.myPldo {
  width: 1400px;
  height: 700px;
}
</style>
