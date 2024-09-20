<!-- 시스템/권한관리/메뉴 -->

<template>
  <div class="content_box">
    <div class="item_wrap">
      <span class="title">권한</span>
      <select v-model="menuAuth" @change="changeAuth">
        <option :value="0">== 선택하세요 ==</option>
        <option
          v-for="list in authList"
          :key="list.authCd"
          :value="list.authCd">
          {{ list.authNm }}
        </option>
      </select>
      <button @click="authModify">권한편집</button>
    </div>
  </div>
  <div class="left_side">
    <div class="subtitle_area">
      <div class="title">전체 메뉴 목록</div>
    </div>
    <div class="tree_wrap">
      <Tree
        :nodes="allMenu"
        :use-icon="false"
        :use-checkbox="true"
        show-child-count
        @update:nodes="onUpdateAllMenu" />
    </div>
  </div>

  <div class="move_btn_area">
    <div class="position">
      <button class="add" @click="addMenuAuth">추가</button>
      <button class="del" @click="delMenuAuth">삭제</button>
    </div>
  </div>
  <div class="right_side">
    <div class="subtitle_area">
      <div class="title">그룹 메뉴</div>
      <span class="notice">※ 쓰기여부를 수정하려면 더블클릭해주세요.</span>
    </div>

    <div class="tree_wrap switchTree">
      <Tree
        :nodes="selectMenu"
        :use-icon="false"
        :use-checkbox="true"
        :key="selectMenu"
        show-child-count
        @update:nodes="onUpdateSelectMenu"
        @nodeClick="onNodeClickRight" />
    </div>
  </div>

  <!-- 권한 수정 팝업 -->
  <div class="popup auth_modify">
    <div class="popup_title">
      <span>권한편집</span>
      <button class="popup_close" @click="popupClose"></button>
    </div>
    <div class="popup_content">
      <popAuthModify
        :authList="authList"
        :key="authList"
        ref="gridValue"></popAuthModify>
    </div>
    <div class="popup_button">
      <button @click="onSaveCheckedRowGrid">저장</button>
      <button @click="popupClose">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthMgmtStore } from "@/stores/sys/auth-mgmt-store";
import authMgmtService from "@/api/services/sys/auth-mgmt-service";
import { ref, onBeforeMount, getCurrentInstance, VueElement } from "vue";

// 팝업 권한편집
import popAuthModify from "./PopAuthModifyPage.vue";

// TREE
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";
import loginAuthService from "../../../api/common/login-auth-service";

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

const store = useAuthMgmtStore();

//전체 메뉴 (로그인 계정 회원사의 메뉴)
const allMenu = ref([]);
// 전체 메뉴의 선택한 메뉴
const checkAllMenu = ref([]);
const topLevel = "0";

// 그룹 메뉴의 전체 메뉴
const selectMenu = ref([]);
// 그룹 메뉴의 전체 메뉴
const checkDupMenu = ref([]);
// 그룹 메뉴의 선택 메뉴
const checkSelMenu = ref([]);

// 회원사에서 설정한 권한 리스트
const authList = ref([]);
const menuAuth = ref();
const lastClickTime = ref(0);
const gridValue = ref(null);

//var useYn = reactive("Y");

const onUpdateAllMenu = (nodes) => {
  //console.log("AuthCompaneyOnUpdateAllMenu nodes:", nodes);
  checkAllMenu.value = setDataObj(nodes);
};

const onUpdateSelectMenu = (nodes) => {
  //console.log("onUpdateSelectMenu nodes:", nodes);
  checkSelMenu.value = setDataObj(nodes);
};

// const onNodeClickLeft = async (node) => {

// }
const onNodeClickRight = async (node) => {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - lastClickTime.value;

  // 클릭과 더블클릭 사이의 시간 간격을 확인하여 구분
  if (elapsedTime > 0 && elapsedTime <= 300) {
    if (node.menuUpperId != "0") {
      if (node.wrtYn == "Y") {
        node.wrtYn = "N";
      } else {
        node.wrtYn = "Y";
      }

      if (confirm("쓰기 권한을 수정하시겠습니까?")) {
        const params = {
          vendrCd: $loginStore.$state.userInfo.vendrCd,
          authCd: menuAuth.value,
          menuId: node.menuId,
          wrtYn: node.wrtYn,
          modId: $loginStore.$state.userInfo.userId,
        };

        try {
          const res = await authMgmtService.updateAuthMenu(params);
          if (res.status == 200) {
            changeAuth();
          }
        } catch (err) {
          console.log("AuthMgmtMenuPage.vue > onNodeClick > err : ", err);
          throw err;
        }

        console.log("params-======", params);
      } else {
        if (node.wrtYn == "Y") {
          node.wrtYn = "N";
        } else {
          node.wrtYn = "Y";
        }
      }

      console.log("node ==", node);
    }
  }

  lastClickTime.value = currentTime;
};

//clickMenu.value = node;

//추가 버튼
function addMenuAuth() {
  if (checkAllMenu.value == "") {
    alert("추가할 메뉴가 없습니다. 전체 메뉴에서 추가할 메뉴를 선택하세요.");
    return false;
  } else {
    if (menuAuth.value === "0") {
      alert("권한을 선택하세요.");
      return false;
    }
    if (selectMenu.value == "") {
      alert("권한을 선택하세요.");
      return false;
    } else {
      if (checkDupMenu.value != "") {
        const checkVal = checkDup(checkAllMenu.value, checkDupMenu.value);
        if (checkVal != null) {
          addMenu("D", checkVal);
        }
      } else {
        const cVal = [];
        checkAllMenu.value.forEach((item) => {
          const node = {};

          node.vendrCd = $loginStore.$state.userInfo.vendrCd;
          node.authCd = menuAuth.value;
          node.menuId = item.menuId;
          node.wrtYn = "Y";
          node.useYn = "Y";
          node.regId = $loginStore.$state.userInfo.userId;
          node.modId = $loginStore.$state.userInfo.userId;
          cVal.push(node);
        });

        addMenu("N", cVal);
      }
    }
  }
}

//삭제버튼
function delMenuAuth() {
  const checkVal = checkSelMenu.value;
  const selComId = $loginStore.$state.userInfo.vendrCd;
  if (checkVal != "") {
    const cVal = [];

    checkVal.forEach((item) => {
      const node = {};

      node.vendrCd = selComId;
      node.authCd = menuAuth.value;
      node.menuId = item.id;

      cVal.push(node);
    });
    delMenu(cVal);
  } else {
    alert("삭제할 메뉴가 없습니다. 회원사 메뉴에서 삭제할 메뉴를 선택하세요.");
    return;
  }
}

//선택한 메뉴 배열담기 ( nodes 객체가 object일 때)
function setDataObj(nodes) {
  const selMenu = [];
  if (nodes != "") {
    nodes[0].nodes.forEach((item) => {
      if (item.checked) {
        const node = {};
        node.id = item.menuId;
        node.label = item.menuNm;
        node.menuId = item.menuId;
        node.menuNm = item.menuNm;
        node.menuUpperId = item.menuUpperId;
        node.menuSeq = item.menuSeq;
        node.menuPath = item.menuPath;
        node.wrtYn = item.wrtYn;

        selMenu.push(node);

        item.nodes.forEach((sItem) => {
          const node = {};
          node.id = sItem.menuId;
          node.label = sItem.menuNm;
          node.menuId = sItem.menuId;
          node.menuNm = sItem.menuNm;
          node.menuUpperId = sItem.menuUpperId;
          node.menuSeq = sItem.menuSeq;
          node.menuPath = sItem.menuPath;
          node.wrtYn = sItem.wrtYn;

          selMenu.push(node);
        });
      } else {
        item.nodes.forEach((sItem) => {
          const node = {};
          if (sItem.checked) {
            node.id = sItem.menuId;
            node.label = sItem.menuNm;
            node.menuId = sItem.menuId;
            node.menuNm = sItem.menuNm;
            node.menuUpperId = sItem.menuUpperId;
            node.menuSeq = sItem.menuSeq;
            node.menuPath = sItem.menuPath;
            node.wrtYn = sItem.wrtYn;

            selMenu.push(node);
          }
        });
      }
    });
  }
  return selMenu;
}

//메뉴 추가 시 중복메뉴 체크 validate
function checkDup(ANode, CNode) {
  var selComId = $loginStore.$state.userInfo.vendrCd;
  const cVal = [];
  ANode.filter((item) => {
    if (!CNode.some((other) => other.menuId === item.id)) {
      const node = {};

      node.vendrCd = selComId;
      node.authCd = menuAuth.value;
      node.menuId = item.id;
      node.wrtYn = "Y";
      node.useYn = "Y";
      node.regId = $loginStore.$state.userInfo.userId;
      node.modId = $loginStore.$state.userInfo.userId;

      cVal.push(node);
    }
  });

  if (cVal == "") {
    alert("중복메뉴가 선택되었습니다.");
    return null;
  } else {
    return cVal;
  }
}

// 선택 메뉴 추가 api
async function addMenu(type, val) {
  let cVal = [];
  if (type === "N") {
    allMenu.value[0].nodes.filter((item) => {
      if (item.indeterminate && !item.checked) {
        const node = {};
        node.vendrCd = $loginStore.$state.userInfo.vendrCd;
        node.authCd = menuAuth.value;
        node.menuId = item.menuId;
        node.wrtYn = "Y";
        node.useYn = "Y";
        node.regId = $loginStore.$state.userInfo.userId;
        node.modId = $loginStore.$state.userInfo.userId;

        val.push(node);
      }
    });
    const sVal = selectMenu.value;
    if (sVal.length > 0) {
      checkAllMenu.value.filter((item, index) => {
        if (sVal[0].nodes.some((other) => item.menuId === other.menuId)) {
        } else {
          const node = {};
          node.vendrCd = $loginStore.$state.userInfo.vendrCd;
          node.authCd = menuAuth.value;
          node.menuId = item.menuId;
          node.wrtYn = "Y";
          node.useYn = "Y";
          node.regId = $loginStore.$state.userInfo.userId;
          node.modId = $loginStore.$state.userInfo.userId;

          cVal.push(node);
        }
      });
    } else {
      cVal = val;
    }
  } else {
    cVal = val;
  }

  const params = JSON.stringify(cVal);
  //const params = cVal;
  try {
    const res = await authMgmtService.addAuthMenu(params);
    if (res.data == "OK") {
      changeAuth();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 회원사 선택 메뉴 삭제 api
async function delMenu(value) {
  const params = JSON.stringify(value);

  try {
    const res = await authMgmtService.delAuthMenu(params);
    if (res.data == "OK") {
      changeAuth();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 권한 selectBox 선택 시 메뉴 목록
async function changeAuth() {
  var params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
  };

  const treeTopAll = [
    {
      id: "0000000",
      label: "MENU",
      expanded: true,
      nodes: [],
    },
  ];
  const treeTopCom = [
    {
      id: "0000000",
      label: "MENU",
      expanded: true,
      nodes: [],
    },
  ];

  try {
    //const menus = await JSON.parse(JSON.stringify($loginStore.$state.menuInfo));
    const menus = await authMgmtService.selectMenuList(params);

    //서버 데이터 트리 구조로 변경
    menus.data.forEach((item) => {
      if (item.menuUpperId === topLevel) {
        const node = {};
        node.id = item.menuId;
        node.label = item.menuNm;
        node.menuId = item.menuId;
        node.menuNm = item.menuNm;
        node.menuUpperId = item.menuUpperId;
        node.menuSeq = item.menuSeq;
        node.menuPath = item.menuPath;
        node.useYn = item.useYn;
        node.wrtYn = "Y";
        node.nodes = makeNode(menus.data, 1, item.menuId, "N");
        treeTopAll[0].nodes.push(node);
      }
    });

    allMenu.value = treeTopAll;
    //allMenu.value[0].nodes.forEach(item => item.expanded = true);
    checkAllMenu.value = [];

    if (menuAuth.value != "") {
      params.authCd = menuAuth.value;
      const selMenus = await store.selectAuthMenuList(JSON.stringify(params));
      if (selMenus.length > 0) {
        //서버 데이터 트리 구조로 변경
        selMenus.forEach((item) => {
          if (item.menuUpperId === topLevel) {
            const node = {};
            node.id = item.menuId;
            node.label = item.menuNm;
            node.menuId = item.menuId;
            node.menuNm = item.menuNm;
            node.menuUpperId = item.menuUpperId;
            node.menuSeq = item.menuSeq;
            node.menuPath = item.menuPath;
            node.wrtYn = item.wrtYn;
            node.nodes = makeNode(selMenus, 1, item.menuId, "Y");
            treeTopCom[0].nodes.push(node);
            // if (node.wrtYn == "Y") {
            //   debugger
            // }
          }
        });
      }
      selectMenu.value = treeTopCom;
      //selectMenu.value[0].nodes.forEach(item => item.expanded = true);
      checkDupMenu.value = selMenus;
      checkSelMenu.value = [];
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 서버 데이터 트리 하위 메뉴 구조 설정
function makeNode(array, depthLevel, parentId, viewWrtYn) {
  const childNodes = [];

  array.forEach((item) => {
    if (Number(item.level) === depthLevel && item.menuUpperId === parentId) {
      const node = {};
      node.id = item.menuId;
      if (viewWrtYn === "Y") {
        node.label = item.menuNm + " (쓰기여부 : " + item.wrtYn + ")";
      } else {
        node.label = item.menuNm;
      }

      node.menuId = item.menuId;
      node.menuNm = item.menuNm;
      node.menuUpperId = item.menuUpperId;
      node.menuSeq = item.menuSeq;
      node.menuPath = item.menuPath;
      node.wrtYn = item.wrtYn;
      childNodes.push(node);
    }
  });
  return childNodes;
}

//메뉴 사용기능
function switchItem(event) {
  if (event.target.parentElement.classList.contains("on")) {
    event.target.parentElement.classList.replace("on", "off");
  } else {
    event.target.parentElement.classList.replace("off", "on");
  }
}

//권한 편집 버튼
async function authModify() {
  document.getElementsByClassName("popup_bg")[0].classList.add("show");
  document.getElementsByClassName("auth_modify")[0].classList.add("show");
}

// 권한 편집 저장 버튼
async function onSaveCheckedRowGrid() {
  const gridData = ref([]);
  gridData.value = gridValue.value.gridData();
  if (gridData.value.length > 0) {
    try {
      const params = JSON.stringify(gridData.value);
      const res = await authMgmtService.updateAuth(params);
      if (res.data == "OK") {
        popupClose();
        getAuthList();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  } else {
    alert("데이터가 없습니다.");
    return;
  }
}

//팝업 닫기
function popupClose() {
  document.getElementsByClassName("popup_bg")[0].classList.remove("show");
  document.getElementsByClassName("auth_modify")[0].classList.remove("show");
}

// 권한 리스트
async function getAuthList() {
  const params = {
    vendrCd: $loginStore.$state.userInfo.vendrCd,
  };
  authList.value = await store.getMenuAuthList(JSON.stringify(params));
}

onBeforeMount(() => {
  changeAuth();
  getAuthList();
  menuAuth.value = "0";
});
</script>

<style scoped>
.left_side {
  float: left;
  width: calc(50% - 80px);
  height: calc(100% - 90px);
}
.right_side {
  float: left;
  width: calc(50% - 80px);
  height: calc(100% - 90px);
}
.move_btn_area {
  float: left;
  width: 160px;
  height: calc(100% - 90px);
  padding: 20px;
}
.tree_wrap {
  height: calc(100% - 40px);
}
.item_wrap .title {
  display: inline-block;
  width: 60px;
}

.popup.auth_modify {
  width: 600px;
  height: 500px;
}

.notice {
  float: left;
  margin-left: 15px;
  padding-top: 7px;
}
</style>
