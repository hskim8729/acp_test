<template>
    <div class="context_menu">
        <div class="menu_list">
            <ul>
                <li v-for="option in options" @click="itemClick(option)">
                <span>{{ option.fileNm }}</span></li>
            </ul>
        </div>
        <div class="btn_close">
            <button @click="close">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";

const emit = defineEmits(['close', 'itemClick'])
const { options } = defineProps([
  "options",
]);

const close = () => {
    emit('close');
}

const itemClick = (itemParam) => {
    emit('itemCliek', itemParam)
}

onMounted(() => {
})

</script>

<style scope>
.context_menu {
    position: fixed;
    width: 300px;
    height: 180px;
    border: outset;
    right: 50px;
    margin-top: 5px;
    border-radius: 8px;
    padding: 10px;
    background: #ffffff;
    z-index: 5;
}
.context_menu button {
    align-self: center;
}
.context_menu li {
    border-bottom: solid 1px #dcdcdc;
    padding: 8px;
}

.menu_list {
    overflow: auto;
    height: calc(100% - 30px);
}
.menu_list span {
    cursor: pointer;
    font-size: 11px;
}
.btn_close {
    position: absolute;
    bottom: 0px;
    right: 15px;
    width: 40px;
    height: 30px;
    border-radius: 20px;
    border: 0px;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.2s, background-color 0.2s;
}
.btn_close button{
    border: none;
    background: none;
    font-weight: bold;
}

</style>
  