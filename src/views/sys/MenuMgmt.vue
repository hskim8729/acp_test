<!-- 시스템/메뉴관리 -->

<template>
  <div class="page_title_area">
      <div class="title">메뉴관리</div>
      <nav><span><router-link to="/">홈</router-link></span> > 시스템 > 메뉴관리</nav>
  </div>

  <div class="page_content_area">
      <div class="left_side">
          <div class="subtitle_area">
              <div class="title">전체 메뉴 목록</div>
              <button @click="onAddMenu">추가</button>
          </div>
          <div class="tree_wrap">
            <Tree
              :nodes="allMenu"
              :use-icon="false"
              :use-checkbox="false"
              show-child-count
              @nodeExpanded="onNodeExpanded"
              @update:nodes="onUpdate"
              @nodeClick="onNodeClick"
            />
          </div>
      </div>

      <div class="right_side">
          <div class="subtitle_area">
              <div class="title">메뉴 정보</div>
              <button @click="onDeleteCurMenu">삭제</button>
              <button @click="onSaveCurMenu">저장</button>
          </div>
          
          <div class="content_box">
            <div class="item_wrap w100p">
              <span class="title">메뉴명</span>
              <input type="text" v-model="clickMenu.menuNm" id="menuNm">
            </div>
            <div class="item_wrap w100p">
              <span class="title">메뉴경로</span>
              <input type="text" v-model="clickMenu.menuPath" id="menuPath">
            </div>
            <div class="item_wrap w100p">
              <span class="title">상위메뉴 코드</span>
              <input type="text" v-model="clickMenu.menuUpperId" id="menuUpperId">
            </div>
            <div class="item_wrap w100p">
              <span class="title">메뉴코드</span>
              <input type="text" v-model="clickMenu.menuId" id="menuId" maxlength="20">
            </div>
            <div class="item_wrap w100p">
              <span class="title">메뉴설명</span>
              <input type="text" v-model="clickMenu.menuDc">
            </div>
            <div class="item_wrap w100p">
              <span class="title">메뉴순번</span>
              <input type="number" v-model="clickMenu.menuSeq" id="menuSeq">
            </div>
            <div class="item_wrap w100p">
              <span class="title">사용유무</span>
              <div :class="clickMenu.useYn=='N'?'switch off':'switch on'">
                <div class="click_area" @click="switchItem"></div>
                <div class="dot"></div>
                <span></span>
              </div>
            </div>
          </div>
      </div>

  </div>
</template>

<script>
  export default {
    name: 'MenuMgmtPage',

  }
</script>

<script setup>
  import { useMenuMgmtStore } from '@/stores/sys/menu-mgmt-store';
  import menuMgmtService from '@/api/services/sys/menu-mgmt-service';

  // TREE
  import Tree from "vue3-tree";
  import "vue3-tree/dist/style.css";

  import {reactive, ref, onBeforeMount, getCurrentInstance} from 'vue';

  const store = useMenuMgmtStore();

  // loginStore 전역변수
  const app = getCurrentInstance();
  const $loginStore = app.appContext.config.globalProperties.$loginStore;

  const userInfo = $loginStore.$state.userInfo;

  const allMenu = ref([]);
  var clickMenu = ref({});
  var useYn = "Y";

  const onNodeExpanded = (node, state) => {
    // console.log("state: ", state);
    // console.log("node: ", node);
  };

  const onUpdate = (nodes) => {
    // console.log("nodes:", nodes);
  };

  const onNodeClick = (node) => {
    // console.log(node);
    node.mode = "U";
    node.menuNm = node.menuNm.trim();
    clickMenu.value = node;
  };

  const switchItem = (event) => {
    if(event.target.parentElement.classList.contains("on")) {
      event.target.parentElement.classList.replace("on", "off");
      useYn = "N";
    } else {
      event.target.parentElement.classList.replace("off", "on");
      useYn = "Y";
    }
  };

  async function onDeleteCurMenu(){
    if(clickMenu.value.menuId === undefined){
      alert("삭제할 메뉴를 선택해 주세요.");
      return;
    }
    if (!confirm('삭제 시 하위 메뉴까지 삭제됩니다.\n정말로 삭제하시겠습니까?')) return;

    try {
      const params = clickMenu.value;
      params.mode = "D";
      
      var res = await menuMgmtService.saveCurMenu([params]);

      if( !res.svrStatus && (res.status == 200 || res.data.status == 200) ){
        alert("정상적으로 처리하였습니다.");
        onReload();
      }else{
        if(!res.svrMessage) alert(res.svrMessage);
        else alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function onSaveCurMenu(){
    if(!clickMenu.value.menuNm){
      alert("메뉴명을 입력해 주세요.");
      document.getElementById("menuNm").focus();
      return;
    }
    
    if(!clickMenu.value.menuUpperId){
      alert("상위메뉴 코드를 입력해 주세요.");
      document.getElementById("menuUpperId").focus();
      return;
    }
    
    if(!clickMenu.value.menuId){
      alert("메뉴 코드를 입력해 주세요.");
      document.getElementById("menuId").focus();
      return;
    }

    if(!clickMenu.value.menuSeq){
      alert("메뉴 순번을 입력해 주세요.");
      document.getElementById("menuSeq").focus();
      return;
    }

    clickMenu.value.useYn = useYn;
    clickMenu.value.userId = userInfo.userId;
    
    try {
      var res = await menuMgmtService.saveCurMenu([clickMenu.value]);

      if( !res.svrStatus && (res.status == 200 || res.data.status == 200) ){
        alert("정상적으로 처리하였습니다.");
        onReload();
      }else{
        if(!res.svrMessage) alert(res.svrMessage);
        else alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function onAddMenu(){
    if(clickMenu.value.level == "3"){
      alert("메뉴는 3depth까지 생성 가능합니다.");
      return;
    }
    if(clickMenu.value.menuId === undefined){
      alert("추가할 상위 메뉴를 선택해 주세요.");
      return;
    }
    
    var menuId = clickMenu.value.menuId;
    clickMenu.value = {};
    clickMenu.value.mode = "I";
    clickMenu.value.menuUpperId = menuId;
    useYn = "Y";
    clickMenu.value.useYn = useYn;
  }

  // 서버 데이터 트리 하위 메뉴 구조 설정
  function makeNode(array, depthLevel, parentId){
    const childNodes = [];
    array.forEach(item => {
      if(item.level === depthLevel && item.menuUpperId === parentId){
        const node = item;
        node.id = item.menuId;
        node.label = item.menuNm + "(" +item.menuId + ")";
        node.level = item.level;
        node.nodes = makeNode(store.getMenus, "3", item.menuId);
        childNodes.push(node);
      }
    });
    return childNodes;
  }

  async function onReload(){
    const fchParams = {
      "menuId": "",
      "menuNm": "",
      "menuUpperId": ""
    };
    var menus = await store.fetchMenus(fchParams);

    //서버 데이터 트리 구조로 변경
    const topLevel = "0";
    var treeTop = ref([
      {
        "id":"0000000",
        "label":"MENU",
        "expanded":true,
        "nodes":[]
      }
    ]);
    menus.forEach(item => {
      if(item.menuId != "1000000" && item.menuUpperId === topLevel){ //대시보드 빼기
        const node = item;  
        node.id = item.menuId;
        node.label = item.menuNm + "(" +item.menuId + ")";
        node.level = item.level;
        node.nodes = makeNode(menus, "2", item.menuId);
        treeTop.value[0].nodes.push(node);
      }
    });
    
    allMenu.value = [];
    clickMenu.value = {};
    useYn = "Y";
    allMenu.value = treeTop.value;
  }

  onBeforeMount(async () => {
    onReload();
  });
</script>

<style scoped>
.left_side {
  float:left;
  width:calc(50% - 20px);
  height:100%;
  margin-right:40px;
}
.right_side {
  float:left;
  width:calc(50% - 20px);
  height:100%;
}
.tree_wrap {
  height:calc(100% - 40px);
}
.item_wrap .title {
display:inline-block;
width:110px;
}
</style>