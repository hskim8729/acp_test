<template>
  <div class="popup_background" @click="close">
    <div class="popup_area popup" @click.stop>
      <div class="popup_title">
        <button @click="isMenuBtn = !isMenuBtn" v-if="false">메뉴 숨기기 버튼</button>
        <button class="popup_close" @click="close"></button>
      </div>
      <div class="popup_content">
        <div class="left_menu" v-show="isMenuBtn">
          <ul>
            <li
              v-for="item in menuList"
              :key="item.id"
              @click="changeMenu(item.id)"
              :class="item.id === secondaryMenu ? 'select_menu' : ''"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <component
          :is="secondaryView"
          :key="secondaryView"
          :view-id="secondaryMenu"
          class="secondary_view">
        </component>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, shallowRef } from "vue";
import NotifyNewsView from "./notifyNews/notifyNewsView.vue";

let secondaryView = shallowRef();
let secondaryMenu = ref();
const isMenuBtn = ref(true);

const isOpenPopup = defineProps(["isOpenPopup"]);
const emit = defineEmits(['togglePopup'])

const close = () => {
  emit('togglePopup')
}

const menuList = ref([
  { name: '공지사항', id: 'notifyNews' },
  { name: '홍보자료', id: 'promoMeterial' },
]);

// 메뉴 클릭 시 컴포넌트 변경
const changeMenu = (menuId) => {
  secondaryMenu.value = menuId;
  let menu = shallowRef();

  if (menuId === 'notifyNews') {
    menu = shallowRef(NotifyNewsView);
  } else if (menuId === 'promoMeterial') {
    menu = shallowRef(NotifyNewsView);
  }
  
  secondaryView.value = menu.value;
}

onMounted(() => {
  // 첫번째 메뉴는 알림소식
  secondaryView.value = shallowRef(NotifyNewsView).value;
  secondaryMenu.value = 'notifyNews';
})

</script>

<style scoped>
.popup_background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(30, 50, 100, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.2s, height 0.2s 0.2s;
  animation: popupFade 0.1s ease-in-out forwards;
}

@keyframes popupFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.popup_area {
  width: 90%;
  height: 90%;
  display:block;
  opacity:1;
}
.popup_content {
  height: 100%;
}
.popup_title {
  height: 0;
}

.left_menu{
  position:fixed; 
  left:0px; 
  width:20%; 
  height:calc(100% - 85px); 
  margin: 20px;
  overflow: hidden;
  border-right: 1px solid lightgray;
}
.left_menu li {
  font-size: 20px;
  padding: 10px 20px;
  width: calc(100% - 20px);
}
.select_menu {
  background: #ffffff;
}
.secondary_view {
  position:fixed; 
  top:45px; 
  right:0px; 
  width:calc(80% - 60px);
  height:calc(90% - 5px); 
  padding:20px 10px; 
  overflow: hidden;
  margin: 0 20px;
}

</style>

