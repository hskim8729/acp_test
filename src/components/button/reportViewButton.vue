<template>
  <comp-button
    type="print"
    text="출력"
    @click="onClick"
    :disabled="disabled && !alertText" />
</template>

<script setup>
// module
import { storeToRefs } from "pinia";
// store
import { useDialogStore } from "@/stores/common/dialog-store";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

const loginStore = useLoginAuthStore();
const dialogStore = useDialogStore();
const { siteInfo } = storeToRefs(loginStore);

const props = defineProps({
  params: {
    // 추가로 필요한 파람 prop으로 넘김
    type: Object,
    default: {
      crfName: "a/b",
      evalType: "type",
      evalSeq: 1,
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  alertText: {
    type: String,
    default: "",
  },
});

const reportUrl = import.meta.env.VITE_APP_REPORT_DEV_URL;
const url = reportUrl + "/view/report1.jsp?";
const fileDiv = import.meta.env.VITE_APP_ENV_FILE_NAME;

const onClick = () => {
  // alertText가 빈값이 아니고 diabled 조건이 true일때
  if (props.disabled && props.alertText) {
    dialogStore.openAlertDialog(props.alertText);
  } else {
    reportView();
  }
};

// 레포트 출력 함수
const reportView = () => {
  const parmaStr = makeParamStr(); // 파람 생성
  let link = document.createElement("a");
  link.href = url + parmaStr;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

// prams >> string으로 만드는 함수
const makeParamStr = () => {
  const paramObj = {
    vendrCd: siteInfo.value.vendrCd,
    siteCd: siteInfo.value.siteCd,
    fileDiv: fileDiv,
    ...props.params,
  };
  const paramStr = Object.entries(paramObj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&"); // vendrCd=1234&stieCd=5678&... 모양으로 변환

  return paramStr;
};
</script>

<style lang="scss" scoped></style>
