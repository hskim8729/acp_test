<template>
  <comp-modal
    style="min-width: 800px"
    class="bg-background"
    :modal-title="modalTitle"
    @close="emit('closeModal')"
    @modal-action="modalAction"
    isActions
    :actionBtnText="actionBtnText"
    maxModalWidth="1000px">
    <v-sheet class="d-flex py-3 px-3 ma-3" rounded>
      <div class="d-flex pa-0 align-center w-100 justify-space-between">
        <div class="search-input d-flex flex-row">
          <formText label="이름" width="32px" class="mr-2 mt-2">
            <div class="d-flex flex-row">
              <comp-input
                v-model="searchParams.userNm"
                @enterFunction="getUserList" />
            </div>
          </formText>

          <form-text label="소속" width="32px" class="mr-2 mt-2">
            <comp-input
              v-model="searchParams.vendrNm"
              @enterFunction="getUserList" />
          </form-text>
        </div>

        <comp-button
          text="조회"
          size="large"
          class="mx-3"
          @click="getUserList"></comp-button>
      </div>
    </v-sheet>

    <v-sheet class="ma-3" style="height: calc(100% - 120px)" rounded>
      <comp-ag-grid
        class="pa-3"
        :rowData="userList"
        :columnDefs="colDefs"
        :rowSelection="rowSelection"
        :gridOptions="gridOptions"
        @getGridApi="onGetGridApi" />
    </v-sheet>
  </comp-modal>
</template>

<script setup>
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// 컴포넌트
import formText from "@/components/form/formText.vue";
import compAgGrid from "@/components/grid/compAgGrid.vue";
import compModal from "@/components/modal/compModal.vue";

// 서비스
import commonService from "@/api/common-service.js";

const loginStore = useLoginAuthStore();
const { vendrInfo, siteInfo, userInfo } = storeToRefs(loginStore);

const props = defineProps({
  type: {
    // 현장 인력 검색, 회사 인력 검색 구분
    type: String,
    default: "SITE",
    validator: (propValue) => {
      // 정의된 값만 넘겨줘야함
      return ["SITE", "VENDR"].includes(propValue);
    },
  },
  menuId: {
    // 해당 페이지에 권한을 가진 현장의 인력을 찾음
    type: String,
    default: "",
  },
  // 이미 선택되어 있는 user목록 (추가 체크되면 안됨)
  selectedUsers: {
    type: Array,
    default: [],
  },
  modalTitle: {
    type: String,
    default: "사용자 검색",
  },
  actionBtnText: {
    type: String,
    default: "등록하기",
  },
  admAcctYn: {
    type: String,
    default: "",
    validator: (propValue) => {
      // 정의된 값만 넘겨줘야함
      return ["", "Y", "N"].includes(propValue);
    },
  },
  rowSelection: {
    // 단일선택, 복수 선택 정의
    type: String,
    default: "multiple",
    validator: (propValue) => {
      // 정의된 값만 넘겨줘야함
      return ["single", "multiple"].includes(propValue);
    },
  },
});

// 행 선택이 가능한지 확인하는 함수
const isRowSelectable = (params) => {
  return !props.selectedUsers.some(
    (item) => item.userId === params.data.userId
  );
};
const gridOptions = {
  isRowSelectable: isRowSelectable,
  getRowStyle: (params) => {
    // if (!isRowSelectable(params)) {
    //   return { backgroundColor: "#f0f0f0" }; // 선택 불가능한 행의 배경색
    // }
    if (isRowSelectable(params)) {
      return { cursor: "pointer" };
    }
  },
  getRowClass: (params) => {
    if (!gridOptions.isRowSelectable(params)) {
      return "bg-gray50 text-gray400";
    }
    return "";
  },
};

const emit = defineEmits(["closeModal", "getSelectedUsers"]);

/**
 * compAgGrid에서 gridApi 불러옴
 */
let gridApi;
const onGetGridApi = (params) => {
  gridApi = params.api;
};

const modalAction = () => {
  const selected = gridApi.getSelectedRows();
  emit("getSelectedUsers", selected);
  emit("closeModal");
};

/**
 * 현장 유저 데이터 불러옴
 */
const userList = ref([]);
const getUserList = async () => {
  const params = {
    vendrCd: siteInfo.value.vendrCd,
    siteCd: props.type === "VENDR" ? "" : siteInfo.value.siteCd,
    menuId: props.type === "VENDR" ? "" : props.menuId,
    admAcctYn: props.admAcctYn,
    ...searchParams.value,
  };
  const res = await commonService.axiosCall(
    "/v1/common/selectUserList",
    params
  );

  userList.value = res.data;
};

// 검색 파람
const searchParams = ref({
  vendrNm: "",
  userId: "",
  userNm: "",
  crryTelNo: "",
});

getUserList();

/**
 * 현장 유저 컬럼 정의
 */
const colDefs = [
  {
    headerName: "소속",
    field: "vendrNm",
    flex: 2,
    minWidth: 200,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerCheckboxSelection: props.rowSelection === "multiple" ? true : false,
  },
  {
    headerName: "역할",
    field: "jbttlNm",
    flex: 1,
    minWidth: 200,
    hide: props.type === "VENDR",
  },
  {
    headerName: "직위명",
    field: "workNm",
    flex: 1,
    minWidth: 200,
    hide: props.type === "SITE",
  },
  {
    headerName: "이름",
    field: "userNm",
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: "핸드폰 번호",
    field: "crryTelNo",
    flex: 1,
    minWidth: 200,
    type: ["phoneNumber"],
  },
];
</script>

<style lang="scss" scoped>
.search-input {
  width: 600px;
  .v-input {
    background-color: white;
  }
}
</style>
