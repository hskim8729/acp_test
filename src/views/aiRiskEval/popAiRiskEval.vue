<template>
  <v-dialog persistent min-width="400px" fullscreen>
    <v-card class="h-90vh ai-main">
      <v-app-bar
        scroll-behavior="elevate"
        app
        dark
        density="compact"
        rounded="lg"
        class="ai-toolbar">
        <v-app-bar-title class="title">
          AI 위험성평가
          <comp-button
            class="provision-btn"
            text="유의사항"
            @click="isPopAiProvision = true"></comp-button>
        </v-app-bar-title>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-app-bar>
      <pop-ai-risk-eval-chat
        :ai-chat-params="aiChatParams"
        @close="close"
        @getAiRecList="getAiRecList"
        ref="aiRiskEvalChatRef">
      </pop-ai-risk-eval-chat>
    </v-card>
    <pop-ai-risk-eval-provision
      v-if="isPopAiProvision"
      v-model="isPopAiProvision"
      @close="isPopAiProvision = false">
    </pop-ai-risk-eval-provision>
  </v-dialog>
</template>
<script setup>
import { defineEmits, defineProps, onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import popAiRiskEvalChat from "@/views/aiRiskEval/popAiRiskEvalChat.vue";
import popAiRiskEvalProvision from "@/views/aiRiskEval/popAiRiskEvalProvision.vue";

import aiRiskEvalService from "@/api/services/aiRiskEval/ai-risk-eval-service.js";

import { aiUserStore } from "@/stores/aiRiskEval/ai-risk-eval-store";
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
//Design CSS- rim
import "@/assets/scss/page.scss";

const route = useRoute();
const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();
const aiUserInfo = aiUserStore();

const emits = defineEmits(["close", "getAiRecList"]);
const props = defineProps({
  aiParams: {
    type: Object,
    default: {},
  },
});

const isRag = ref(false);

const userInput = ref("");
const message = ref([]);
const loadingComment = "답변 생성중입니다...";
const lastUserInput = ref("");
const recommendData = ref({});
const aiChatParams = ref({});

const aiRiskEvalChatRef = ref(null);
const isPopAiProvision = ref(false);

// sse 객체
let sse = null;

const init = () => {
  // 기본 메세지 세팅
  if (props.aiParams.isSendMessage) {
    userInput.value = props.aiParams.aiMessage;
  }

  sendLoginInfo();
};

/** AI 서버 로그인 */
const sendLoginInfo = async () => {
  const params = getAiSessionParam();

  await aiRiskEvalService
    .axiosCallAI("/v1/chat/loginAiRisk", params)
    .then((res) => {
      const { data } = res;
      const conversationIdVal = data.dta.conversation_id;

      if (data.access_token) {
        userLogin(data);
      } else {
        alert("세션 생성 실패");
        return;
      }

      if (conversationIdVal) {
        dialogStore.openToastDialog(
          `새로운 conversation이 생성되었습니다. (세션: ${conversationIdVal})`
        );

        isRag.value = false;
        const conversationId = parseInt(conversationIdVal);

        // popAiRiskEvalChat 컴포넌트에 conversationId 전달
        aiRiskEvalChatRef.value.afterCreateConversation(conversationId);
      } else {
        alert("conversation Id 생성 실패");
        return;
      }
    });
};

/** 로그인 파라미터 */
const getAiSessionParam = () => {
  const userInfo = loginStore.$state.userInfo;
  const apiParam = {
    username: import.meta.env.VITE_APP_API_AI_ID,
    password: import.meta.env.VITE_APP_API_AI_PW,
    client_id:
      import.meta.env.VITE_APP_ENV_FILE_NAME === "prod"
        ? userInfo.userId
        : "plan2do@asianaidt.com",
  };

  return apiParam;
};

/** 생성된 로그인 Token sessionStorage, store에 저장 */
const userLogin = (data) => {
  sessionStorage.setItem("aiToken", data.access_token);
  sessionStorage.setItem("aiIsLogin", true);
  sessionStorage.setItem("aiUserId", data.userid);

  aiUserInfo.userToken = data.access_token;
};

const searchHistory = async () => {
  //이력조회
};

const close = () => {
  if (sse) {
    sse.close();
  }

  emits("close");
};

const getAiRecList = (selected) => {
  emits("getAiRecList", selected);
};

onBeforeMount(() => {
  aiChatParams.value = props.aiParams;
});

onMounted(() => {
  init();
});
</script>
<style scoped></style>
