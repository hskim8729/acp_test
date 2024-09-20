<template>
  <div>
    <div
      :class="
        props.params.cellText ? 'flex-container' : 'center-btn-container'
      ">
      <!-- 버튼과 함께 출력될 Text 영역 -->
      <slot v-if="props.params.cellText">{{ params.cellText }}</slot>
      <comp-button
        @click="onClick"
        :variant="compButonVariant"
        v-if="isBtnAuth && buttonVisible && props.params.btnText"
        :text="props.params.btnText"
        :icon="props.params.btnIcon"
        :disabled="props.params.disabled" />
      <v-btn
        size="small"
        variant="plain"
        @click="onClick"
        :class="`${buttonClass} grid_btn`"
        v-if="isBtnAuth && buttonVisible && !props.params.btnText"
        :disabled="props.params.disabled">
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { computed, defineProps, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const loginStore = useLoginAuthStore();
const route = useRoute();

const props = defineProps({
  params: {
    disabled: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    cellText: {
      type: Text,
      default: "",
    },
    isNotRequiredAuth: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: Text,
      default: "",
    },
    btnVariant: {
      type: Text,
      default: "outlined",
    },
    btnIcon: {
      type: Text,
      default: "",
    },
  },
});

const initData = () => {
  // 버튼 권한 체크
  setBtnAuth();
};

const buttonVisible = computed(() => {
  return props.params.visible ?? true;
});

const buttonClass = computed(() => {
  switch (props.params.type) {
    case "add":
      return "grid_btn_add";
    case "edit":
      return "grid_btn_modify";
    case "modify":
      return "grid_btn_modify";
    case "del":
      return "grid_btn_del";
    case "doc":
      return "grid_btn_doc";
    case "file":
      return "grid_btn_file";
    case "search":
      return "grid_btn_search";
    default:
      return "";
  }
});

const compButonVariant = computed(() => {
  return props.params.btnVariant ? props.params.btnVariant : "outlined";
});

const isBtnAuth = ref(true);
const setBtnAuth = () => {
  const type = props.params.type;
  if (props.params.isNotRequiredAuth) {
    return;
  }

  // 권한 체크
  if (["add", "del", "edit"].includes(type)) {
    let isMenuWriteAuth = true;
    let isPayPlcySite = true;
    let isNotAuthAdmin = true;

    const menuInfo = route.matched[0].meta;

    // router에 설정한 메뉴ID가 있으면 시스템 권한관리 -> 쓰기권한 Y인 유저에게만 권한 부여
    const menuId = menuInfo.menuId || 0;
    if (menuId) {
      const menuInfo = loginStore.$state.menuInfo.find((item) => {
        return item.menuId === menuId;
      });
      isMenuWriteAuth = menuInfo.wrtYn === "Y";
    }

    // router에 현장 멤버쉽 메뉴로 등록해둔 메뉴는 현장 멤버쉽 가입 중에만 권한 부여
    const isPayPlcyMenu = menuInfo.isMemberExclusiveMenu || false;
    if (isPayPlcyMenu) {
      const sitePayPlcyYn = loginStore.$state.siteInfo.payPlcyYn || "N";
      isPayPlcySite = sitePayPlcyYn === "Y";
    }

    // 관리자 사용 불가능 메뉴는 관리자 아닌 사람만 권한 부여
    const isDisabledAdminMenu = menuInfo.isDisabledAdminMenu || false;
    if (isDisabledAdminMenu) {
      const authCd = loginStore.$state.authInfo.authCd || "9999";
      isNotAuthAdmin = authCd !== "1000";
    }

    isBtnAuth.value = isPayPlcySite && isMenuWriteAuth && isNotAuthAdmin;
  }
};

const onClick = () => {
  if (props.params.onClick) {
    props.params.onClick(props.params);
  }
};

onMounted(() => {
  initData();
});
</script>
<style></style>
