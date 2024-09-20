<template>
  <comp-modal
    modalTitle="문의하기"
    @close="$emit('close')"
    actionBtnText="문의메일 보내기"
    @modal-action="submitContactForm"
    isActions
    :isPersistent="!closeImmediately"
    :fullscreen="fullscreen"
    height="500px">
    <div class="pa-3">
      <div class="item_wrap w100p">
        <span class="title">받는 사람</span>
        <span>plan2do@asianaidt.com</span>
      </div>
      <div class="item_wrap w100p">
        <span class="title">보낸 사람</span>
        <input
          type="text"
          v-model="email"
          @input="cUtil.checkEmail($event)"
          :class="{ 'input-error': isSubmitAttempted && !isEmailValid }"
          placeholder="회신받을 이메일 주소를 입력해주세요" />
        <div id="msgId"></div>
      </div>
      <div class="item_wrap w100p">
        <span class="title">제 목</span>
        <input
          type="text"
          v-model="title"
          :class="{ 'input-error': isSubmitAttempted && !title }"
          @input="nullNotice($event)"
          placeholder="제목을 입력하세요" />
        <div id="mailTitle"></div>
      </div>
      <div class="item_wrap w100p">
        <textarea
          rows="11"
          v-model="content"
          @input="nullNotice($event)"
          :class="{ 'input-error': isSubmitAttempted && !content }"
          placeholder="문의하실 내용을 입력하세요"></textarea>
        <div id="mailContent"></div>
      </div>

      <div class="item_wrap w100p">
        <span class="title"
          >휴대전화 <span class="optional_text">(선택)</span></span
        >
        <input
          type="text"
          v-model="phone"
          @input="cUtil.regexType($event, 'crryTelNo')"
          @blur="removeInvalidLastChar(phone)"
          maxlength="13"
          id="crryTelNo"
          placeholder="회신을 원하시면 전화번호를 남겨주세요" />
      </div>
      <div class="item_wrap w100p">
        <div class="info">
          *입력하신 개인정보는 회신 이외의 용도로 이용되지 않습니다.
        </div>
      </div>
    </div>
  </comp-modal>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import compModal from "@/components/modal/compModal.vue";
import commonUtil from "@/utils/common-utils";

import { useDialogStore } from "@/stores/common/dialog-store";
import contactUsService from "../../api/services/sys/contact-us-service";

const dialogStore = useDialogStore();

const props = defineProps({
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

const title = ref("");
const content = ref("");
const isEmailValid = ref(false);
const email = ref("");
const phone = ref("");
const files = ref(null);

// 팝업 열고 닫기
const emit = defineEmits(["close"]);

// title, content, email 중 1개라도 값이 있으면 백그라운드 클릭시 바로 닫지 못함
const closeImmediately = computed(() => {
  return !title.value && !content.value && !email.value;
});

const isSubmitAttempted = ref(false);
// valid check에 사용
const cUtil = commonUtil;

// 공백 체크validate
function nullNotice(e) {
  const title = ref("");
  const style = ref("");
  if (cUtil.nullCheck(e.target.value)) {
    title.value = e.target.placeholder;
    e.target.nextElementSibling.classList.add("notice");
    e.target.nextElementSibling.style.display = "block";
    e.target.nextElementSibling.style.right = style.value;
    e.target.nextElementSibling.innerHTML = title.value;
  } else {
    e.target.nextElementSibling.classList.remove("notice");
    e.target.nextElementSibling.style.display = "none";
    e.target.nextElementSibling.innerHTML = "";
  }
}

// 핸드폰 validation check
// cUtil.regexType의 문제로 마지막에 문자가 들어갈 수 있어 제거
function removeInvalidLastChar(str) {
  // 문자열의 마지막 문자가 숫자나 "-"가 아니라면
  if (!str[str.length - 1].match(/[0-9]|-/)) {
    // 문자열의 마지막 문자를 제거
    phone.value = str.slice(0, -1);
  }
}

const submitContactForm = async () => {
  // 제출 시도를 표시하는 ref를 추가
  isSubmitAttempted.value = true;

  // 유효성 검사
  if (!isEmailValid.value || !title.value || !content.value) {
    return;
  }

  const params = {
    title: title.value,
    content: content.value,
    email: email.value,
    phone: phone.value,
    files: files.value,
  };

  try {
    await contactUsService.sendContactUsMail(params).then(() => {
      title.value = "";
      content.value = "";
      email.value = "";
      phone.value = "";
      files.value = null;
      isSubmitAttempted.value = false;
      dialogStore.openToastDialog("메일 전송이 성공했습니다");
      emit("close");
    });
  } catch (error) {
    console.error(error);
  }
};

// onMounted 훅 내에서 MutationObserver를 설정
onMounted(() => {
  // #msgId 요소의 class 속성 변화를 감시하고, 변화가 감지되면 isEmailValid를 업데이트
  const targetNode = document.getElementById("msgId");

  const observerOptions = {
    attributes: true, // 속성 변화를 감시
    attributeFilter: ["class"], // 'class' 속성만 감시
  };

  // notice 클래스가 있으면 isEmailValid는 false가 되고, 없으면 true
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "attributes") {
        isEmailValid.value = !targetNode.classList.contains("notice");
      }
    }
  });

  observer.observe(targetNode, observerOptions);

  // 컴포넌트가 사라질 때 observer를 해제
  // MutationObserver는 리소스를 사용하므로 더 이상 필요하지 않을 때 해제
  onBeforeUnmount(() => {
    observer.disconnect();
  });
});
</script>

<style scoped>
.item_wrap {
  display: flex;
  align-items: center;
}

.item_wrap .title {
  width: 100px;
  text-align: center;
}

.item_wrap input {
  width: calc(100% - 90px);
}

.item_wrap .btn_input.cert_num::placeholder {
  font-size: 0px;
}

.item_wrap button {
  width: 120px;
  margin-left: 10px;
}

.optional_text {
  color: #777;
  font-size: 80%;
}

button {
  width: fit-content;
  height: 40px;
  padding: 0px 20px;
  margin-left: 5px;
  border: 0px;
  border-radius: 6px;
  background-color: #366587;
  font-family: "Pretendard-B";
  font-size: 1rem;
  color: #ffffff;
}

.info {
  color: gray;
}

/* 입력 필드에 오류가 있을 때 테두리를 주황색으로 표시하는 CSS 클래스를 추가 */
.input-error {
  border: 1px solid red !important;
}
</style>
