<template>
  <div class="page">
    <!-- 메인 채팅 화면 -->
    <v-container class="h-100 pa-0">
      <div
        ref="scrollMove"
        class="chat_page"
        :class="{ open_left_drawer_chat_page: leftDrawerOpen }">
        <!-- res 채팅 -->
        <div class="chat_res_area">
          <div class="chat_profile">
            <img src="@/assets/img/aiRisk/chat_profile.svg" />
          </div>

          <div class="chat_res_content">
            <div class="chat_title">AI 안전담당자</div>
            <!-- <div class="chat_title">AI 위험성평가 도우미(Beta)</div> -->
            <!-- guide message -->
            <div class="chat_res_message_area">
              <div class="chat_res_message">
                안녕하세요. AI 안전담당자입니다.<br />
                도움이 필요하신 작업 공종 및 내용을 말하듯이 입력하시고,<br />
                추천드리는 항목 중 원하시는 것을 선택하세요.<br />
                예시) OO공종(작업)할 때 위험 요인과 대책을 알려줘.
              </div>
            </div>
            <!-- <div class="icon_set" v-show="false">
              <v-btn flat padding="none" @click="showComment('g')">
                <img src="@/assets/img/aiRisk/thumb-up-line.svg" />
              </v-btn>
              <v-btn flat padding="none">
                <img
                  src="@/assets/img/aiRisk/thumb-down-line.svg"
                  @click="showComment('b')" />
              </v-btn>
              <v-btn flat padding="none" @click="copyToClipboard()">
                <img src="@/assets/img/aiRisk/file-copy-fill.svg" />
              </v-btn>
              <v-btn flat padding="none">
                <img src="@/assets/img/aiRisk/Group.svg" />
              </v-btn>
            </div> -->
          </div>
        </div>

        <template v-for="(item, index) in message" :key="index">
          <!-- request Message -->
          <div
            class="chat_req_area"
            v-if="message.length > 0"
            :class="{ is_rag: isRag }">
            <div class="chat_req_content">
              <div class="chat_req_message_area">
                <div class="chat_req_message" v-if="item.flag == false">
                  {{ revertEscapeSpecialChars(item.req) }}
                </div>
                <!-- flag는 rag 문서 여부 -->
                <div class="pdf_img" v-if="item.flag == true">
                  <img src="@/assets/img/aiRisk/Page facing up.svg" />
                </div>
                <div class="chat_req_message_pdf" v-if="item.flag == true">
                  {{ revertEscapeSpecialChars(item.req) }}
                </div>
              </div>
            </div>
          </div>

          <!-- response Message -->
          <div class="chat_res_area" v-if="message.length > 0">
            <div class="chat_profile">
              <img src="@/assets/img/aiRisk/chat_profile.svg" />
            </div>
            <div class="chat_res_content">
              <div class="chat_title">AI 안전담당자</div>
              <!-- <div class="chat_title">AI 위험성평가 도우미(Beta)</div> -->
              <div
                class="chat_res_message_area"
                style="align-items: flex-start">
                <!-- <v-progress-linear
                  v-if="message.length - 1 === index"
                  color="blue-lighten-3"
                  :active="loading"
                  :indeterminate="loading">
                </v-progress-linear> -->
                <div class="chat_res_message">
                  <div
                    :class="`table_area ${
                      isTable(item.res) ? 'res_table' : ''
                    }`"
                    v-dompurify-html="item.res"></div>
                </div>
                <!-- 채팅 내용 -->
                <!-- <pop-ai-risk-eval-content
                  :message_content="item.res"
                  :loading_comment="loadingComment"
                  :now_idx="index"
                  :res_complete="item.resComplete">
                </pop-ai-risk-eval-content> -->
              </div>
              <v-btn
                v-if="item.resComplete && isTable(item.res)"
                color="#2E6BE6"
                variant="flat"
                class="my-2 py-3 align-content-center"
                density="comfortable"
                @click="selectAiRecList()">
                <!-- <template v-slot:prepend>
                  <v-icon color="success"></v-icon>
                </template> -->
                추가
              </v-btn>
              <!-- <div class="icon_set" v-show="message.length == index + 1">
                <v-btn flat padding="none" @click="showComment('g', item)">
                  <img src="@/assets/img/aiRisk/thumb-up-line.svg" />
                </v-btn>
                <v-btn flat padding="none">
                  <img
                    src="@/assets/img/aiRisk/thumb-down-line.svg"
                    @click="showComment('b', item)" />
                </v-btn>
                <v-btn flat padding="none" @click="copyToClipboard(index)">
                  <img src="@/assets/img/aiRisk/file-copy-fill.svg" />
                </v-btn>
                <v-btn flat padding="none" @click="checkIsRag(true)">
                  <img src="@/assets/img/aiRisk/Group.svg" />
                </v-btn>
              </div> -->
            </div>
          </div>
        </template>
      </div>

      <!-- 인풋 박스 -->
      <div :class="{ input_box1: isFocus, input_box2: !isFocus }">
        <v-text-field
          variant="plain"
          class="text_area"
          v-model="userInput"
          placeholder="질문을 입력해 주세요."
          :maxlength="maxInputLegnth"
          @blur="isFocus = true"
          @focus="isFocus = false"
          @keypress.enter="sendMessage" />
        <span @click="sendMessage">
          <div class="send_btn" :hidden="!isFocus">
            <img src="@/assets/img/aiRisk/sending_gray.svg" />
          </div>
          <div class="send_btn" :hidden="isFocus">
            <img src="@/assets/img/aiRisk/sending.svg" />
          </div>
        </span>
      </div>
      <div class="inform_message">
        {{ "세션아이디:" + conversationId }}
      </div>
    </v-container>
  </div>
</template>
<script setup>
import MarkdownIt from "markdown-it";
import { defineEmits, defineExpose, defineProps, nextTick, ref } from "vue";
import { useRoute } from "vue-router";

import commonService from "@/api/common-service.js";

import {
  escapeSpecialChars,
  preventInjection,
  revertEscapeSpecialChars,
} from "@/utils/secure-utils";

import aiRiskEvalService from "@/api/services/aiRiskEval/ai-risk-eval-service.js";

import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

//Design CSS- rim
import "@/assets/scss/page.scss";

const emit = defineEmits(["getAiRecList"]);
const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();
const route = useRoute();

const props = defineProps({
  aiChatParams: {
    type: Object,
    default: {},
  },
});

const scrollMove = ref(null);

const isRag = ref(false);

const conversationId = ref();

const alert = ref();

const comment = ref("");

//어드민 파일 모달 접근 객체
const fileManage = ref("");

//pdfViewModal 컴포넌트 접근 객체
const pdfViewer = ref("");

//pdfUploader 컴포넌트 접근 객체
const pdfUploader = ref("");

//inpot box 포커싱 객체
const isFocus = ref(true);

//pdf url
const url = ref("");

// 질문
const userInput = ref("");

// 마지막 질문
const lastUserInput = ref("");

// 왼쪽 drawer
const leftDrawerOpen = ref(false);

//통합 message
const message = ref([]);

// 추천문서
const recommendData = ref({});

// 대기시 문구
const loadingComment = "답변 생성중입니다...";

// 히스토리 컴포넌트
const historyComponent = ref();

// 최대 입력 글자 수
const maxInputLegnth = 150;

const loading = ref(false);

// sse 객체
let sse = null;
let isSseIng = false;

// 메시지 전송
const sendMessage = async () => {
  if (isSseIng) {
    return false;
  }

  isSseIng = true;

  //validation
  if (userInput.value.trim() === "") {
    dialogStore.openAlertDialog("질문을 입력하세요.");
    return;
  }

  if (userInput.value.trim().length > maxInputLegnth) {
    dialogStore.openAlertDialog(
      "최대 입력 글자수(${maxInputLegnth})를 초과했습니다."
    );
    return;
  }

  // injection 방지 로직
  if (!preventInjection(userInput.value.trim())) {
    return;
  }

  message.value.push({
    req: userInput.value,
    res: loadingComment,
    flag: false,
    answerId: "",
    resComplete: false,
  });

  //스크롤 다운
  nextTick(() => {
    scrollToBottom();
  });

  await checkIsRag();
};

/** rag 데이터 확인 */
const checkIsRag = async (isResend = false) => {
  isRag.value = false;

  const params = {
    conversation_id: conversationId.value,
    query: escapeSpecialChars(userInput.value),
    access_token: sessionStorage.getItem("aiToken"),
  };

  if (isResend) {
    message.value[message.value.length - 1].res = loadingComment;
    params.query = escapeSpecialChars(lastUserInput.value);
  }

  // 기존에 실행중인 sse 종료
  if (sse) {
    sse.close();
  }

  await aiRiskEvalService
    .axiosCallAI("/v1/chat/reqQuestion", params)
    .then((res) => {
      let responseData = res.data.values;
      const proposal = responseData["proposal"]?.[0] || [];
      const questionId = responseData["question_id"];
      const lastInputValue = revertEscapeSpecialChars(responseData["query"]);
      lastUserInput.value = lastInputValue;

      getRagMessage(proposal, questionId, lastInputValue);

      lastUserInput.value = userInput.value;
      userInput.value = "";
    });
};

/** 답변 스트리밍 처리하여 결과 업데이트 */
const getRagMessage = async (proposal = [], questionId, lastInputValue) => {
  let url = "/chat/noRag";
  const params = {
    conversation_id: conversationId.value,
    question_id: questionId,
    query: escapeSpecialChars(lastInputValue),
  };

  // 추천문서가 있으면 첫번째 추천문서 자동선택
  if (proposal.length > 0) {
    url = "/chat/Rag";
    params.document_id = proposal[0].document_id;
    params.page = proposal[0].page;
    params.similarity = proposal[0].similarity;
  }

  params.aiToken = sessionStorage.getItem("aiToken");
  params.url = url;

  // 기존에 실행중인 sse 종료
  if (sse) {
    sse.close();
  }

  loading.value = true;
  const lastIdx = message.value.length - 1;
  let isStartTable = false;

  sse = commonService.createEventSorce("/v1/chat/emitter", params);

  /** sse 스트리밍 이벤트 처리 */
  sse.onmessage = (e) => {
    if (message.value[lastIdx].res === loadingComment) {
      message.value[lastIdx].res = "";
    }

    if (!isStartTable && e.data.indexOf("table") > 0) {
      isStartTable = true;
    }

    let resultStr = e.data;
    resultStr = resultStr
      .replace("###", "")
      .replace("html", "")
      .replace("```", "");

    if (isStartTable) {
      resultStr = resultStr.replace("<br>", "");
    }

    message.value[lastIdx].res += resultStr;

    //스크롤 다운
    nextTick(() => {
      scrollToBottom();
    });
  };

  /** 에러발생 or sse이벤트 종료 */
  sse.onerror = (e) => {
    console.log("sseError", e);

    sse.close();
    isSseIng = false;

    loading.value = false;
    message.value[lastIdx].resComplete = true;

    let resMessage = message.value[lastIdx].res;

    if (isTable(message.value[lastIdx].res)) {
      // 테이블이면 스타일 설정
      setTableStyle(lastIdx);
    } else {
      // 텍스트이면 마크다운 언어 -> HTML로 변환
      message.value[lastIdx].res = renderMarkdown(resMessage);
    }

    getUpdateAnswer(questionId, message.value[lastIdx].res);
  };
};

/** 마크다운 언어를 HTML 태그로 변환 */
const renderMarkdown = (message) => {
  const md = new MarkdownIt();

  // 특정 패턴 ###을 h3 태그로 변환하는 커스텀 렌더링 규칙 설정
  md.renderer.rules.text = (tokens, idx) => {
    let content = tokens[idx].content;
    return content;
  };

  return md.render(message);
};

/**
 * HTML 스타일 적용
 */
const setTableStyle = (idx) => {
  const tableRef = document.querySelectorAll(".table_area")[idx];
  const thRef = tableRef.querySelectorAll("th");
  const trRef = tableRef.querySelectorAll("tr");

  const columnStyles = {
    선택: { width: "40px", textAlign: "center" },
    위험요인: { width: "200px", textAlign: "left" },
    "예상 위험수준": { width: "90px", textAlign: "center" },
    감소대책: { width: "300px", textAlign: "left" },
  };

  const alignIndexes = [];

  const applyStyle = (element, styles) => {
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value;
    }
  };

  // th 스타일 적용 및 인덱스 수집
  thRef.forEach((th, index) => {
    const headerText = th.textContent.trim();
    if (columnStyles[headerText]) {
      th.style.width = columnStyles[headerText].width;
      th.style.textAlign = "center";
      alignIndexes.push(index);
    }
  });

  // td style 설정
  trRef.forEach((row) => {
    const cells = row.querySelectorAll("td");
    alignIndexes.forEach((idx) => {
      const headerText = thRef[idx].textContent.trim();
      if (cells[idx] && columnStyles[headerText]) {
        applyStyle(cells[idx], {
          textAlign: columnStyles[headerText].textAlign,
        });
      }
    });
  });
};

/** 답변 update API 호출 */
const getUpdateAnswer = async (questionId, answerContent) => {
  const params = {
    question_id: questionId,
    answer_content: answerContent,
    access_token: sessionStorage.getItem("aiToken"),
  };

  await aiRiskEvalService
    .axiosCallAI("/v1/chat/updateAnswer", params)
    .then((res) => {
      // 평점용 변수 업데이트
      message.value[message.value.length - 1].answerId = res.data.dta[0];
    });
};

const afterCreateConversation = (conversation_id) => {
  conversationId.value = conversation_id;

  //선택한 공종으로 추천 메세지 전송
  if (props.aiChatParams.isSendMessage) {
    userInput.value = props.aiChatParams.aiMessage;
    sendMessage();
  }
};

/** 스크롤 가장 아래로 설정 */
const scrollToBottom = () => {
  scrollMove.value.scrollTop = scrollMove.value.scrollHeight;
};

defineExpose({
  afterCreateConversation,
  // sendMessage,
});

const selectedData = ref([]);

const selectAiRecList = () => {
  // 테이블 행들을 가져오기
  const rows = document.querySelectorAll(".chat_res_area table tr");

  rows.forEach((row) => {
    // 체크박스가 체크되었는지 확인
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      // 체크된 행의 데이터를 추출
      const cells = row.querySelectorAll("td");
      const rowData = Array.from(cells).map((cell) => cell.textContent);

      selectedData.value.push({ rskFctr: rowData[1], rskMsr: rowData[3] });
    }
  });

  if (selectedData.value.length < 1) {
    dialogStore.openAlertDialog("추가할 위험요인과 감소대책을 선택하세요.");
    return;
  }

  emit("getAiRecList", selectedData.value);
};

// 결과값이 테이블형식일 때만 "추가"버튼 출력
const isTable = (result) => {
  return result.indexOf("table") > 0;
};
</script>
<style scoped>
.page div {
  user-select: text !important;
}
</style>
