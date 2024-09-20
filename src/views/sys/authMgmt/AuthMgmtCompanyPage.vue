<!-- 시스템/권한관리/회원사메뉴 -->

<template>
  <div class="content_box">
    <div class="item_wrap w25p">
      <span class="title">회원사</span>
      <select @change="changeCompany" v-model="selCompany">
        <option :value="0">== 선택하세요 ==</option>
        <option v-for="list in companyList" :value="list.vendrCd">
          {{ list.vendrNm }}
        </option>
      </select>
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
      <button class="add" @click="addCompanyAuth()">추가</button>
      <button class="del" @click="delCompanyAuth()">삭제</button>
    </div>
  </div>
  <div class="right_side">
    <div class="subtitle_area">
      <div class="title">회원사 메뉴</div>
    </div>

    <div class="tree_wrap">
      <Tree
        :nodes="selectMenu"
        :use-icon="false"
        :use-checkbox="true"
        show-child-count
        @update:nodes="onUpdateSelectMenu" />
    </div>
  </div>
</template>

<script setup>
import authMgmtService from "@/api/services/sys/auth-mgmt-service";
import { useAuthMgmtStore } from "@/stores/sys/auth-mgmt-store";
import { getCurrentInstance, onBeforeMount, reactive, ref } from "vue";

// TREE
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";
// import "@/assets/css/grid_custom.css";

const store = useAuthMgmtStore();

// loginStore 전역변수
const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;

//전체 메뉴
const allMenu = ref([]);
// 전체 메뉴의 선택 메뉴
const checkAllMenu = ref([]);
const topLevel = "0";

// 회원사 메뉴
const selectMenu = ref([]);
// 회원사 메뉴의 전체 메뉴
const checkDupMenu = ref([]);
// 회원사 메뉴의 선택 메뉴
const checkSelMenu = ref([]);

// 회원사 리스트
const companyList = ref([]);
const selCompany = ref();

const onUpdateAllMenu = (nodes) => {
  console.log("AuthCompaneyOnUpdateAllMenu nodes:", nodes);
  checkAllMenu.value = setDataObj(nodes);
};

const onUpdateSelectMenu = (nodes) => {
  console.log("onUpdateSelectMenu nodes:", nodes);
  checkSelMenu.value = setDataObj(nodes);
};

//추가 버튼
function addCompanyAuth() {
  if (checkAllMenu.value == "") {
    alert("추가할 메뉴가 없습니다. 전체 메뉴에서 추가할 메뉴를 선택하세요.");
    return false;
  } else {
    if (selectMenu.value == "") {
      alert("회원사를 선택하세요.");
      return false;
    } else {
      if (checkDupMenu.value != "") {
        const checkVal = checkDup(checkAllMenu.value, checkDupMenu.value);
        if (checkVal != null) {
          if (confirm("선택한 메뉴를 추가하시겠습니까?")) {
            addMenu("D", checkVal);
          }
        }
      } else {
        if (confirm("선택한 메뉴를 추가하시겠습니까?")) {
          const cVal = [];

          checkAllMenu.value.forEach((item) => {
            const node = {};

            node.vendrCd = selCompany.value;
            node.menuId = item.menuId;
            node.menuNm = item.menuNm.trim();
            node.menuUpperId = item.menuUpperId;
            node.menuSeq = item.menuSeq;
            node.menuPath = item.menuPath;
            node.menuDc = item.menuNm.trim();
            node.regId = $loginStore.$state.userInfo.userId;
            node.modId = $loginStore.$state.userInfo.userId;

            cVal.push(node);
          });
          addMenu("N", cVal);
        }
      }
    }
  }
}

//삭제버튼
function delCompanyAuth() {
  const checkVal = checkSelMenu.value;
  console.log("checkVal ==", checkVal);
  if (checkVal != "") {
    if (confirm("선택한 메뉴를 삭제하시겠습니까?")) {
      const cVal = [];

      checkVal.forEach((item) => {
        const node = {};

        if (item.vendrUpperId === "0") {
          node.vendrCd = selCompany.value;
          node.menuId = item.menuId;
          node.menuNm = item.menuNm.trim();
          node.menuUpperId = item.menuUpperId;
          node.menuSeq = item.menuSeq;
          node.menuPath = item.menuPath;
          node.menuDc = item.menuNm.trim();
          node.regId = $loginStore.$state.userInfo.userId;
        } else {
          node.vendrCd = selCompany.value;
          node.menuId = item.menuId;
          node.menuNm = item.menuNm.trim();
          node.menuUpperId = item.menuUpperId;
          node.menuSeq = item.menuSeq;
          node.menuPath = item.menuPath;
          node.menuDc = item.menuNm.trim();
          node.regId = $loginStore.$state.userInfo.userId;
        }
        cVal.push(node);
      });
      delMenu(cVal);
    }
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

          selMenu.push(node);
        });
      } else {
        item.nodes.forEach((sItem) => {
          if (sItem.checked) {
            const node = {};
            node.id = sItem.menuId;
            node.label = sItem.menuNm;
            node.menuId = sItem.menuId;
            node.menuNm = sItem.menuNm;
            node.menuUpperId = sItem.menuUpperId;
            node.menuSeq = sItem.menuSeq;
            node.menuPath = sItem.menuPath;

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
  const cVal = [];

  ANode.filter((item) => {
    if (!CNode.some((other) => other.menuId === item.id)) {
      const node = {};
      node.vendrCd = selCompany.value;
      node.menuId = item.id;
      node.menuNm = item.menuNm.trim();
      node.menuUpperId = item.menuUpperId;
      node.menuSeq = item.menuSeq;
      node.menuPath = item.menuPath;
      node.menuDc = item.menuNm.trim();
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
        node.menuId = item.menuId;
        node.menuNm = item.menuNm;
        node.menuUpperId = item.menuUpperId;
        node.menuSeq = item.menuSeq;
        node.menuPath = item.menuPath;
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
          node.menuId = item.menuId;
          node.menuNm = item.menuNm;
          node.menuUpperId = item.menuUpperId;
          node.menuSeq = item.menuSeq;
          node.menuPath = item.menuPath;
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
    const res = await authMgmtService.addMenu(params);
    if (res.data == "OK") {
      alert("정상적으로 처리하였습니다.");
      changeCompany();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 회원사 선택 메뉴 삭제 api
async function delMenu(val) {
  // var cVal = val;

  // selectMenu.value[0].nodes.filter(item => {
  //   if (item.indeterminate && !item.checked && (item.nodes.length < 2)) {
  //     const node = {};
  //     node.vendrCd = selCompany.value;
  //     node.menuId = item.id;
  //     node.menuNm = item.menuNm.trim();
  //     node.menuUpperId = item.menuUpperId;
  //     node.menuSeq = item.menuSeq;
  //     node.menuPath = item.menuPath;
  //     node.menuDc = item.menuNm.trim();
  //     node.regId = $loginStore.$state.userInfo.userId;
  //     node.modId = $loginStore.$state.userInfo.userId;
  //     cVal.push(node);
  //   }
  // })

  const params = JSON.stringify(val);

  try {
    const res = await authMgmtService.delMenu(params);
    if (res.data == "OK") {
      alert("정상적으로 처리하였습니다.");
      changeCompany();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 회원사 selectBox 선택 시 회원사 메뉴 목록
async function changeCompany() {
  var params = selCompany.value;

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
    const menus = await store.selectAllMenuList();

    //서버 데이터 트리 구조로 변경
    menus.forEach((item) => {
      if (item.menuUpperId === topLevel) {
        const node = {};
        node.id = item.menuId;
        node.label = item.menuNm;
        node.menuId = item.menuId;
        node.menuNm = item.menuNm;
        node.menuUpperId = item.menuUpperId;
        node.menuSeq = item.menuSeq;
        node.menuPath = item.menuPath;
        node.nodes = makeNode(menus, 1, item.menuId);

        treeTopAll[0].nodes.push(node);
      }
    });

    allMenu.value = treeTopAll;
    checkAllMenu.value = [];

    if (params != "0") {
      //backend에서 json format 유지를 위해 reactive 사용
      params = reactive({
        vendrCd: params,
      });

      let selMenus = await store.selectComMenuList(params);

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
            node.nodes = makeNode(selMenus, 1, item.menuId);
            treeTopCom[0].nodes.push(node);
          }
        });
      }
      selectMenu.value = treeTopCom;
      checkDupMenu.value = selMenus;
      checkSelMenu.value = [];
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// 서버 데이터 트리 하위 메뉴 구조 설정
function makeNode(array, depthLevel, parentId) {
  const childNodes = [];
  array.forEach((item) => {
    if (item.level === depthLevel && item.menuUpperId === parentId) {
      const node = {};
      node.id = item.menuId;
      node.label = item.menuNm;
      node.menuId = item.menuId;
      node.menuNm = item.menuNm;
      node.menuUpperId = item.menuUpperId;
      node.menuSeq = item.menuSeq;
      node.menuPath = item.menuPath;
      childNodes.push(node);
    }
  });
  return childNodes;
}

// 회원사 리스트
async function getCompanyList() {
  try {
    companyList.value = await store.selectCompanyList();
  } catch (err) {
    console.log("AuthMgmtCompanyPage.vue > getCompanyList() > err : ", err);
    throw err;
  }
}

onBeforeMount(() => {
  changeCompany();
  getCompanyList();
  selCompany.value = "0";
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
  width: 80px;
}
</style>
