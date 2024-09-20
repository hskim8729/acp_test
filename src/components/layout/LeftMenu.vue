<!-- layout/LayoutLeft.vue -->

<template>
  <div id="left" class="left_wrap">
    <div class="left_menu" v-if="menuList.length > 0">
      <!-- <ul v-if="$loginStore.$state.userInfo.vendrCd === '0000'">
				<li v-for="topMenu in menuList.filter((c)=>(c.level === '0' && c.menuId === '7000000') || (c.level === '0' && c.menuId === '8000000'))" :key="topMenu.menuId">
					<span @click="openMenu($event)">{{ topMenu.menuNm }}</span>
					<ul class="close">
						<li v-for="subMenu in menuList.filter((d)=>d.level === '1' && (d.menuUpperId === topMenu.menuId))" :key="subMenu.menuPath" @click="activeMenu($event)">
							<router-link :to="`${subMenu.menuPath}`"  >{{ subMenu.menuNm }}</router-link>
						</li>
					</ul>
				</li>
			</ul>
			<ul v-else-if="$loginStore.$state.userInfo.vendrCd != '0000' && $loginStore.$state.userInfo.admAcctYn === 'Y'">
					<li v-for="topMenu in menuList.filter((c) => c.level === '0')" :key="topMenu.menuId">
						<span @click="openMenu($event)">{{ topMenu.menuNm }}</span>
						<ul class="close">
							<li v-for="subMenu in menuList.filter((d) => d.level === '1' && (d.menuUpperId === topMenu.menuId) && d.menuId != '7001000' && d.menuId != '7002000')" :key="subMenu.menuPath" @click="activeMenu($event)">
								<router-link :to="`${subMenu.menuPath}`"  >{{ subMenu.menuNm }}</router-link>
							</li>
						</ul>
					</li>
				</ul>
			<ul v-else>
				<li v-for="topMenu in menuList.filter((c) => c.level === '0')" :key="topMenu.menuId">
					<span @click="openMenu($event)">{{ topMenu.menuNm }}</span>
					<ul class="close">
						<li v-for="subMenu in menuList.filter((d) => d.level === '1' && (d.menuUpperId === topMenu.menuId))" :key="subMenu.menuPath" @click="activeMenu($event)">
							<router-link :to="`${subMenu.menuPath}`"  >{{ subMenu.menuNm }}</router-link>
						</li>
					</ul>
				</li>
			</ul> -->
      <ul>
        <li
          v-for="topMenu in menuList.filter((c) => c.level === '0')"
          :key="topMenu.menuId">
          <span @click="openMenu($event)">{{ topMenu.menuNm }}</span>
          <ul class="close">
            <li
              v-for="subMenu in menuList.filter(
                (d) => d.level === '1' && d.menuUpperId === topMenu.menuId
              )"
              :key="subMenu.menuPath"
              @click="activeMenu($event, subMenu.menuPath)">
              <router-link
                :to="`${subMenu.menuPath}`"
                :class="{
                  active: router.currentRoute.value.path === subMenu.menuPath,
                }"
                >{{ subMenu.menuNm }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="left_menu" v-else>
      <ul>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, getCurrentInstance, onMounted } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import router from "@/router";

let loginStore = useLoginAuthStore();

let menuList = ref([]);
let actUrl = ref("");

function openMenu(e) {
  var subMenuClass = e.target.nextElementSibling;

  if (subMenuClass.classList.contains("close")) {
    const subMenu = document.querySelectorAll(".left_menu li > ul");

    subMenu.forEach(function (el, index) {
      el.classList.replace("open", "close");
      el.parentElement.classList.remove("active");
    });

    subMenuClass.classList.replace("close", "open");
    subMenuClass.parentElement.classList.add("active");
  } else {
    subMenuClass.classList.replace("open", "close");
    subMenuClass.parentElement.classList.remove("active");
  }
}

async function activeMenu(e, subMenu) {
  //await e.target.classList.add('active');
  // 메뉴 클릭하면 좌측메뉴 닫기
  setTimeout(() => {
    var MenuStatus = document.getElementById("leftMenuBtn");

    MenuStatus.classList.replace("menu_close", "menu_open");
    document.getElementsByClassName("left_wrap")[0].classList.remove("open");
    document.getElementsByClassName("content_wrap")[0].classList.remove("open");
  }, 50);

  const status = e.target.classList.contains("active");

  // 현장정보 클릭 시 선택된 현장 정보 session값으로 update
  if (subMenu === "/SITE/siteRegDetail") {
    const selectSite = {
      vendrCd: loginStore.$state.siteInfo.vendrCd,
      siteCd: loginStore.$state.siteInfo.siteCd,
      userId: loginStore.$state.userInfo.userId,
    };

    loginStore.$patch({ selectSiteInfo: selectSite });
  }

  if (status) {
    router.go(0);
  }
}

async function mList() {
  menuList.value = await loginStore.$state.menuInfo;
  actUrl.value = router.currentRoute.value.path;
}

onBeforeMount(() => {});

onMounted(() => {
  mList();
});
</script>

<style>
.left_menu {
  width: calc(100% - 30px);
  height: 100%;
  padding-top: 30px;
  margin-left: 20px;
}
.left_menu > ul > li {
  width: 100%;
  margin-bottom: 10px;
  font-family: "Pretendard-B";
  font-size: 16px;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.5s;
}
.left_menu > ul > li > span {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  color: #677987;
  transition: color 0.5s;
}
.left_menu > ul > li:hover > span {
  color: #252525;
  transition: color 0.2s;
}
.left_menu > ul > li:hover,
.left_menu > ul > li.active {
  background-color: #ffffff;
  border-radius: 20px;
  transition: background-color 0.2s;
}
.left_menu > ul > li.active span {
  color: #252525;
}
.left_menu > ul > li > ul {
  margin-left: 20px;
  margin-bottom: 10px;
  overflow: hidden;
}
.left_menu > ul > li > ul.close {
  margin-top: 0px;
  height: 0px;
  transition: all 0.2s;
}
.left_menu > ul > li > ul.close > li {
  height: 0px;
  transition: all 0.2s;
}
.left_menu > ul > li > ul.open {
  margin-top: 10px;
  height: auto;
  transition: all 0.2s;
}
.left_menu > ul > li > ul.open > li {
  height: 30px;
  transition: all 0.2s;
}
.left_menu > ul > li > ul > li > a {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #666666;
}
.left_menu > ul > li > ul > li > a:hover {
  color: #252525;
  transition: all 0.2s;
}
.left_menu > ul > li > ul > li > a.active {
  color: #5da6b2;
  transition: all 0.2s;
}
.left_menu > ul > li > ul > li > a:before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  padding-top: 8px;
  margin-right: 8px;
  border-radius: 3px;
  background-color: #b3c2c8;
  transition: background-color 0.2s;
}
.left_menu > ul > li > ul > li:hover > a:before,
.left_menu > ul > li > ul > li > a.active:before {
  background-color: #5da6b2;
  transition: background-color 0.2s;
}

.na {
  font-family: "Pretendard-B";
  color: #ff6600;
  text-align: center;
}
</style>
