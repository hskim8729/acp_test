<template>
    <div class="dash_pop_default dash_pop_user_list">
        <div class="title">현장 사용자</div>
        <div class="content">
            <div class="search_area">
                <input type="text" v-model="userNm" @keyup.enter="userData" placeholder="사용자명을 입력하세요">
                <button  @click="userData"></button>
            </div>
            <div class="user_list">
                <ul>
                        <li v-for="(item, index) in mainPopUserList" :key="index" @click="noticeViewBtn">
                            <span class="icon"></span>
                            <span>{{ item.jbttlNm }}[{{ item.vendrNm }}]</span>
                            <span>|</span>
                            <span class="name">{{ item.userNm }}[{{ item.siteNm }}]</span>
                        </li>
                </ul>
            </div>
        </div>
        <div class="bottom_btn">
            <button class="close" @click="close">닫기</button>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useMainSiteStore } from "../../stores/common/main-site-store";


const loginAuth = useLoginAuthStore();
const SiteStore = useMainSiteStore();
const userNm = ref("");
const mainPopUserList = ref([]);

async function userData() {

    const param = {
        vendrCd: loginAuth.$state.vendrInfo.vendrCd,
        siteCd: loginAuth.$state.siteInfo.siteCd,
        userId: loginAuth.$state.userInfo.userId,
        userNm: userNm.value.replaceAll(" ", ""),
    }
    
    try {
        await SiteStore.selectMainPopUserList(param);
        mainPopUserList.value = SiteStore.$state.mainPopUserList;
    } catch (err) {
        console.log("mainPopUserList.vue > userData() > err : ", err);
        throw err;
    }

}

function close(event) {
    event.target.parentElement.parentElement.classList.remove("show");
}

onMounted(() => {
    userData();
})
</script>


<style scoped>

</style>