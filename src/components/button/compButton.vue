<template>
  <v-btn
    v-if="isBtnAuth"
    :id="props.id"
    :disabled="props.disabled"
    :class="props.class"
    :color="buttonColor"
    :variant="buttonVariant"
    :density="buttonDensity"
    :rounded="props.rounded"
    :size="buttonSize"
    :block="props.block">
    <v-icon v-if="buttonIcon" class="mr-1"> {{ buttonIcon }} </v-icon>
    <span>{{ buttonText }}</span></v-btn
  >
</template>
<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { computed, defineProps, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const loginStore = useLoginAuthStore();
const route = useRoute();

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "flat",
  },
  density: {
    type: String,
    default: "comfortable",
  },
  color: {
    type: String,
    default: "#366587",
  },
  icon: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "default",
  },
  requiredAuth: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const initData = () => {
  // 버튼 권한 체크
  setBtnAuth();
};

const buttonIcon = computed(() => {
  switch (props.type) {
    case "list":
      return "mdi-format-list-bulleted";
    case "excel":
      return "mdi-file-excel";
    case "print":
      return "mdi-printer";
    case "detailView":
      return "mdi-magnify";
    // case "save":
    //   return "mdi-content-save";
    // case "delete":
    //   return "mdi-delete-circle";
    default:
      return props.icon;
  }
});

const buttonSize = computed(() => {
  switch (props.type) {
    case "search":
      return "large";
    default:
      return props.size;
  }
});

const buttonDensity = computed(() => {
  switch (props.type) {
    case "search":
      return "default";
    default:
      return props.density;
  }
});

const buttonColor = computed(() => {
  switch (props.type) {
    case "excel":
      return "#107C41";
    case "delete":
      return "#CB1313";
    case "print":
      return "#6F6B6B";
    case "addfile":
      return "#698EA7";
    default:
      return props.color;
  }
});

const buttonVariant = computed(() => {
  if (
    ["list", "excel", "add", "delete", "print", "detailView"].includes(
      props.type
    )
  ) {
    return "outlined";
  } else {
    return props.variant;
  }
});

const buttonText = computed(() => {
  switch (props.type) {
    case "search":
      return "조회";
    case "list":
      return "목록";
    case "excel":
      return "다운로드";
    case "add":
      return "추가";
    case "new":
      return "신규등록";
    case "save":
      return "저장";
    case "delete":
      return "삭제";
    case "print":
      return "출력";
    case "addfile":
      return "파일첨부";
    default:
      return props.text;
  }
});

const isBtnAuth = ref(true);
const setBtnAuth = () => {
  // 권한 체크
  if (props.requiredAuth) {
    let isMenuWriteAuth = true;
    let isPayPlcySite = true;

    // router에 설정한 메뉴ID가 있으면 시스템 권한관리 -> 쓰기권한 Y인 유저에게만 권한 부여
    const menuId = route.matched[0].meta.menuId || 0;
    const loginMenu = loginStore.$state.menuInfo || {};
    if (menuId && loginMenu.length > 0) {
      const menuInfo = loginMenu.find((item) => {
        return item.menuId === menuId;
      });
      isMenuWriteAuth = menuInfo.wrtYn === "Y";
    }

    // router에 현장 멤버쉽 메뉴로 등록해둔 메뉴는 현장 멤버쉽 가입 중에만 권한 부여
    const isPayPlcyMenu = route.matched[0].meta.isMemberExclusiveMenu || false;
    if (isPayPlcyMenu) {
      const sitePayPlcyYn = loginStore.$state.siteInfo.payPlcyYn || "N";
      isPayPlcySite = sitePayPlcyYn === "Y";
    }

    isBtnAuth.value = isPayPlcySite && isMenuWriteAuth;
  }
};
onMounted(() => {
  initData();
});
</script>
<style scoped>
.v-btn {
  font-family: Pretendard-M;
  padding: 0 10px;
}
</style>
