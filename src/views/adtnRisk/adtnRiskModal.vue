<template>
  <comp-modal
    :modalTitle="modalTitle"
    :actionBtnText="props.mode === 'I' ? '등록하기' : '수정하기'"
    :isActions="props.mode !== 'R'"
    :isPersistent="closeImmediately"
    height="auto"
    @close="closeFunction"
    @modal-action="modalAction">
    <v-form class="py-5 px-3" :disabled="props.mode === 'R' ? true : false">
      <form-text label="공종">
        <!-- 공종/작업명은 작성(I)일때만 수정가능 -->
        <selectContyCd
          v-model:data="dataObj.contyCd"
          :readOnly="props.mode !== 'I' ? true : false"
          :data-list="TappMgmtList"
          title-key="contyCdNm"
          data-key="contyCd"></selectContyCd>
      </form-text>
      <form-text label="작업명">
        <selectStdRskFcr
          v-model:data="dataObj"
          :readOnly="props.mode === 'R' ? true : false" />
      </form-text>

      <form-text label="장소">
        <comp-input
          v-model="dataObj.wrkLoc"
          placeholder="장소를 입력해주세요"
          maxlength="200" />
      </form-text>
      <form-text label="위험물">
        <comp-input
          v-model="dataObj.hrmrskMtr"
          placeholder="위험물를 입력해주세요"
          maxlength="200" />
      </form-text>
      <form-text label="사진첨부">
        <div style="max-width: 400px; min-width: 300px">
          <file-handler
            table="ADD_RSK_DSCV"
            :files="existingFiles"
            :readOnly="props.mode === 'R'"
            ref="fileHandlerRef" />
        </div>
      </form-text>
      <form-text :label="rskFctrLabel">
        <v-textarea
          v-model="dataObj.rskFctr"
          placeholder="위험요인을 입력해주세요"
          maxlength="300"
          variant="outlined"
          hide-details="auto"
          auto-grow
          hide-spin-buttons />
      </form-text>
      <form-text label="위험성" v-if="type === 'T1101'">
        <selectRiskValue
          v-model:rst="dataObj.rst"
          v-model:freq="dataObj.freq"
          v-model:strngth="dataObj.strngth"
          :code="siteRuleList.comCd"
          :readOnly="props.mode === 'R' ? true : false"></selectRiskValue>
      </form-text>
      <form-text :label="rskMsrLabel">
        <v-textarea
          v-model="dataObj.rskMsr"
          placeholder="감소대책을 입력해주세요"
          maxlength="2000"
          variant="outlined"
          auto-grow
          hide-details="auto"
          hide-spin-buttons />
      </form-text>
      <v-row v-if="type === 'T1101'">
        <v-col
          ><form-text label="조치예정일">
            <comp-input
              type="date"
              v-model="computedActExptDt"></comp-input> </form-text
        ></v-col>
        <v-col
          ><form-text label="담당자">
            <v-text-field
              v-model="actMgnrText"
              placeholder="담당자를 지정해주세요"
              maxlength="200"
              @click="isAddModalOpen = true"
              density="compact"
              variant="outlined"
              hide-details="auto"
              :append-inner-icon="props.mode === 'R' ? null : 'mdi-magnify'" />
          </form-text>

          <pop-select-user
            v-if="isAddModalOpen"
            rowSelection="single"
            @close-modal="isAddModalOpen = false"
            @get-selected-users="onAddUsers" />
        </v-col>
      </v-row>
    </v-form>
  </comp-modal>
</template>
<script setup>
// node_modules
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
// 외부 변수 및 함수
// 컴포넌트
import fileHandler from "@/components/file/fileHandler.vue";
import formText from "@/components/form/formText.vue";
import compModal from "@/components/modal/compModal.vue";
import popSelectUser from "@/views/common/popSelectUser.vue";
import selectContyCd from "./components/selectContyCd.vue";
import selectRiskValue from "./components/selectRiskValue.vue";
import selectStdRskFcr from "./components/selectStdRskFcr.vue";
// store
import { useAdtnRiskStore } from "@/stores/adtnRisk/adtn-risk-store";
import { useDialogStore } from "@/stores/common/dialog-store";

const dialogStore = useDialogStore();
const adtnStore = useAdtnRiskStore();
const { detailList, detailFiles, TappMgmtList, siteRuleList, commonParam } =
  storeToRefs(adtnStore);

const props = defineProps({
  mode: {
    type: String,
    default: "I",
    validator: (propValue) => {
      return [
        "I", // 신규작성
        "U", // 수정
        "R", // 읽기만 가능
      ].includes(propValue);
    },
  },
  type: {
    type: String,
    default: "T1101",
    validator: (propValue) => {
      return ["T1101", "T1102", "T1103"].includes(propValue);
    },
  },
});

const getDataObj = () => {
  return {
    dscvTypeCd: props.type, //순회점검
    contyCd: "",
    wrkNm: "",
    wrkNmCd: "",
    wrkLoc: "",
    hrmrskMtr: "",
    rskFctr: "",
    rskMsr: "",
    actMngr: "",
    vendrNm: "",
    userNm: "",
    actExptDt: dayjs().format("YYYY-MM-DD").split("-").join(""),
    lgCatCd: "",
    mdCatCd: "",
    wrkNmCd: "",
    lgCatNm: "",
    mdCatNm: "",
    freq: 0,
    strngth: 0,
    rst: 0,
  };
};
const dataObj = ref(getDataObj());

const computedActExptDt = computed({
  get: () =>
    dataObj.value.actExptDt?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
  set: (val) => (dataObj.value.actExptDt = val.split("-").join("")), // 등록일 하이픈 제거,
});

const existingFiles = ref([]);
const fileHandlerRef = ref(null); // 파일 핸들러의 새로 업로드 된 파일들 목록을 가져오기 위한 ref
const getNewUploadFiles = () => {
  if (fileHandlerRef.value) {
    return fileHandlerRef.value.getNewUploadFiles();
  } else {
    return null;
  }
};

const emit = defineEmits(["close"]);
const modalAction = async () => {
  // validation 체크
  const isValid = validCheck();
  if (!isValid) return;
  // asycn await 등으로 모달 액션 로직 후 분기처리 가능
  await save();
  closeFunction();
};
const closeFunction = () => {
  emit("close");
};

// 저장함수
const save = async () => {
  // mode 추가
  const newObj = { ...dataObj.value, ...commonParam.value };
  newObj.mode = props.mode;
  const formData = new FormData();
  formData.append(
    "param",
    new Blob([JSON.stringify(newObj)], { type: "application/json" })
  );

  // 첨부파일 formData 추가
  const upLoadFileList = getNewUploadFiles();
  if (Array.isArray(upLoadFileList) && upLoadFileList.length > 0) {
    upLoadFileList.forEach((file, index) => {
      formData.append(`files`, file);
    });
  }

  const res = await adtnStore.adtnRiskDeleteList(formData);
  return res;
};

/**
 * 담당자 선택
 */
// 담당자 선택 후 변수 할당
const isAddModalOpen = ref(false); // 담당자 선택 팝업 열기
const onAddUsers = (selected) => {
  if (selected.length === 0) {
    return;
  }
  dataObj.value.vendrNm = selected[0].vendrNm;
  dataObj.value.actMngr = selected[0].userId;
  dataObj.value.userNm = selected[0].userNm;
};

const actMgnrText = computed(() => {
  if (dataObj.value.actMngr) {
    const vendrNm = dataObj.value.vendrNm ? dataObj.value.vendrNm : "소속 없음";
    const computedVendrNm = truncateString(vendrNm) + "...";
    return computedVendrNm + " / " + dataObj.value.userNm;
  }
  return "";
});

function truncateString(str) {
  if (str.length > 10) {
    return str.substring(0, 10);
  } else {
    return str;
  }
}

// 추가위험발굴타입 코드에 맞게 텍스트 변경
const modalTitle = ref("추가위험발굴");
const rskFctrLabel = ref("위험요인");
const rskMsrLabel = ref("감소대책");
onBeforeMount(() => {
  if (props.mode !== "I") {
    // 데이터 불러옴
    dataObj.value = { ...detailList.value[0] };
    existingFiles.value = detailFiles.value;
  }

  switch (props.type) {
    case "T1101":
      modalTitle.value = "순회점검";
      rskFctrLabel.value = "위험요인";
      rskMsrLabel.value = "감소대책";
      break;
    case "T1102":
      modalTitle.value = "근로자제보";
      rskFctrLabel.value = "위험요인 제보";
      rskMsrLabel.value = "감소대책 제안";
      break;
    case "T1103":
      modalTitle.value = "아차사고";
      rskFctrLabel.value = "사고내용";
      rskMsrLabel.value = "예방제안";
      break;
    default:
      console.log(
        "adtnRiskModal >> 잘못된 발굴유형 코드가 전달되었습니다",
        T1101
      );
      break;
  }
});

// 1개라도 변경된 값이 있으면(closeImmediately가 true false면) 백그라운드 클릭시 바로 닫지 못함
const closeImmediately = computed(() => {
  let isDifferent = false;
  switch (props.mode) {
    case "R":
      isDifferent = false;
      break;
    case "I":
      isDifferent = shallowEqual(dataObj.value, getDataObj()) ? false : true;
      break;
    case "U":
      isDifferent = shallowEqual(dataObj.value, detailList.value[0])
        ? false
        : true;
      break;
    default:
      console.log("adtnRiskModal >> 잘못된 모드가 전달되었습니다", props.mode);
      break;
  }
  return isDifferent;
});

// 키를통해 객체를 순회하면서 값을 체크(객체의 값들이 모두 primitive인 경우)
function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

// valid 함수
const validCheck = () => {
  if (dataObj.value.contyCd == "") {
    dialogStore.openAlertDialog("공종 값이 비어 있습니다. ");
    return false;
  } else if (dataObj.value.wrkNm == "") {
    dialogStore.openAlertDialog("작업명 값이 비어 있습니다. ");
    return false;
  } else if (dataObj.value.wrkLoc == "") {
    dialogStore.openAlertDialog("장소 값이 비어 있습니다.");
    return false;
  } else if (dataObj.value.hrmrskMtr == "") {
    dialogStore.openAlertDialog("위험물 값이 비어 있습니다.");
    return false;
  } else if (dataObj.value.rskFctr == "") {
    dialogStore.openAlertDialog(`${rskFctrLabel.value} 값이 비어 있습니다.`);
    return false;
  } else if (dataObj.value.rskMsr == "") {
    dialogStore.openAlertDialog(`${rskMsrLabel.value} 값이 비어 있습니다.`);
    return false;
  }
  return true;
};
</script>
