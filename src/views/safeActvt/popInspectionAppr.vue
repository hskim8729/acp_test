<!-- 안전활동/중점점검활동/팝업-중점점검활동 등록 -->

<template>
  <comp-modal
    :modalTitle="title"
    @close="deleteInput"
    @modal-action="emit('inspectionApprove')"
    actionBtnText="승인"
    :isActions="rowParams.stats === 'T1001' && isApprMode">
    <!--isApprMode : 결재 사용여부-->
    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">공종</span>
        <input type="text" v-model="majorInfo.contyCdNm" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">작업명</span>
        <input type="text" v-model="majorInfo.wrkNm" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위치/장소</span>
        <input type="text" v-model="majorInfo.wrkLoc" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위험물</span>
        <input type="text" v-model="majorInfo.hrmrskMtr" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">위험요인</span>
        <textarea v-model="majorInfo.rskFctr" readonly></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">감소대책</span>
        <textarea v-model="majorInfo.rskMsr" readonly></textarea>
      </div>
    </div>

    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">점검일자</span>
        <input type="date" v-model="majorInfo.inspDt" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">점검의견</span>
        <textarea v-model="majorInfo.inspDtl" readonly></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">점검결과</span>
        <input
          type="radio"
          name="result"
          value="0001"
          v-model="majorInfo.inspRst"
          disabled /><label for="result_01">양호</label>
        <input
          type="radio"
          name="result"
          :checked="parseInt(majorInfo.inspRst) >= 2"
          disabled /><label for="result_02">조치요청</label>
        <!-- 조치요청 이후 단계는 조치요청으로 보여줌 -->
      </div>

      <div class="item_wrap w100p">
        <span class="title">점검결과<br />첨부</span>
        <div class="file">
          <div class="photo" id="inspPhotoPreview"></div>
        </div>
      </div>

      <div class="item_wrap w100p">
        <span class="title">조치예정일</span>
        <input type="date" v-model="majorInfo.actExptDt" disabled />
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치요구</span>
        <textarea v-model="majorInfo.actDemandDtl" disabled></textarea>
      </div>
      <div class="item_wrap w50p">
        <span class="title">담당자</span>
        <input type="text" class="search_input" v-model="actMngr" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치내용</span>
        <textarea v-model="majorInfo.actDtl" readonly> </textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치일자</span>
        <input type="date" v-model="majorInfo.actDt" readonly />
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치결과<br />첨부</span>
        <div class="file">
          <div class="photo" id="actPhotoPreview"></div>
        </div>
      </div>
    </div>
    <template #secondButton v-if="rowParams.stats === 'T1001'">
      <comp-button
        text="반려"
        @click="emit('inspectionReject')"
        density="comfortable">
      </comp-button>
    </template>
  </comp-modal>
</template>

<script setup>
import dayjs from "dayjs";
import { getCurrentInstance, onBeforeMount, ref } from "vue";

import "ag-grid-community/styles//ag-grid.css";

import compModal from "@/components/modal/compModal.vue";

import { useFileStore } from "@/stores/common/file-store";
import { useMajorStore } from "@/stores/safeActvt/major-store";

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore;
const store = useMajorStore();
const fileStore = useFileStore();
const actMngr = ref("");

const emit = defineEmits(["inspectionApprove", "inspectionReject"]);

const majorInfo = ref({
  contyNm: "",
  wrkNm: "",
  wrkLoc: "",
  hrmrskMtr: "",
  rskFctr: "",
  rskMsr: "",
  inspDt: "",
  inspDtl: "",
  inspRst: "",
  actExptDt: "",
  actDemandDtl: "",
  actDtl: "",
  actDt: "",
});

const props = defineProps(["rowParams", "isApprMode", "title"]);

let upLoadFileList = ref([]);
const url = import.meta.env.VITE_APP_API_DEV_URL;
let formData = new FormData();

const searchParam = ref({
  vendrCd: props.rowParams.vendrCd,
  siteCd: props.rowParams.siteCd,
  inspCls: props.rowParams.inspCls,
  inspSeq: props.rowParams.inspSeq,
  inspDt: props.rowParams.inspDt,
  actSeq: props.rowParams.actSeq,
  actAtchFileKey: props.rowParams.actAtchFileKey,
});

onBeforeMount(() => {
  doSearch();
});

async function doSearch() {
  const pntActDsctn = await store.selectPntActDsctn(searchParam.value);

  majorInfo.value = pntActDsctn.data;

  if (majorInfo.value) {
    majorInfo.value.inspDt = dayjs(majorInfo.value.inspDt).format("YYYY-MM-DD");

    majorInfo.value.actExptDt = dayjs(majorInfo.value.actExptDt).format(
      "YYYY-MM-DD"
    );

    majorInfo.value.actDt = dayjs(majorInfo.value.actDt).format("YYYY-MM-DD");

    actMngr.value = majorInfo.value.actMngrNm;

    console.log("doSearch majorInfoi : ", majorInfo.value);
    // 첨부파일이 있을때  -> 상세내역 화면일때
    // 조치결과 첨부 프리뷰
    if (majorInfo.value.actAtchFileKey) {
      detailActPreview(majorInfo.value.actAtchFileList);
    }

    // 점검결과 첨부
    if (majorInfo.value.inspAtchFileKey) {
      detailInspPreview(majorInfo.value.atchFileList);
    }
  }
}

// 상세조회 점검결과 사진 미리보기
const detailInspPreview = (param) => {
  console.log("상세조회 점검결과 사진 미리보기ㅏ param :", param);
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      let div = document.createElement("div");
      div.setAttribute("id", "inspDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "inspImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "inspSpanFileU_" + count.fileNm);
      span.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await fileStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      document.getElementById("inspPhotoPreview").appendChild(div);
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 상세조회 조치결과 사진 미리보기
const detailActPreview = (param) => {
  console.log("상세조회 조치결과 사진 미리보기ㅏ param :", param);
  for (let count of param) {
    if (count.filePath) {
      let img = document.createElement("img");
      let span = document.createElement("span");
      let div = document.createElement("div");
      div.setAttribute("id", "actDivFileU_" + count.fileNm);
      img.setAttribute(
        "src",
        url +
          "/v1/common/getImage?param1=" +
          count.filePath +
          "&param2=" +
          count.fileNm
      );
      img.setAttribute("id", "actImgFileU_" + count.fileNm);
      span.textContent = "다운로드";
      span.setAttribute("id", "actSpanFileU_" + count.fileNm);
      span.addEventListener("click", async function () {
        const param = { fileNm: count.fileNm, filePath: count.filePath };
        const response = await fileStore.fileDownload(param);

        let link = document.createElement("a");
        let url = URL.createObjectURL(response);
        link.href = url;
        link.download = count.fileNm;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      });

      document.getElementById("actPhotoPreview").appendChild(div);
      div.appendChild(span);
      div.appendChild(img);
    }
  }
};

// 첨부파일> 파일 프리뷰 함수
const drawPreview = (files) => {
  deletePreview();
  files.forEach((file) => {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        let img = document.createElement("img");
        let button = document.createElement("button");
        let div = document.createElement("div");
        div.setAttribute("id", "inspDivFileI_" + file.name);
        img.setAttribute("src", e.target.result);
        img.setAttribute("id", "inspImgFileI_" + file.name);
        button.setAttribute("class", "del");
        button.setAttribute("id", "inspBtnFileI_" + file.name);
        button.onclick = function () {
          saveDeleteFile(file);
        };

        document.getElementById("inspPhotoPreview").appendChild(div);
        div.appendChild(button);
        div.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
    // 파일 formData 저장
  });
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = (data) => {
  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  deletePreview();
  const index = upLoadFileList.value.findIndex(
    (file) => file.name == data.name
  );
  if (index != -1) {
    upLoadFileList.value.splice(index, 1);
  }
  drawPreview(upLoadFileList.value);
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview = () => {
  const imgElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspImgFileI"]');

  const btnElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspBtnFileI"]');

  const divElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspDivFileI"]');

  imgElement.forEach((img) => {
    img.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
};

// 데이터 초기화 함수
function deleteInput() {
  formData = new FormData();
  //document.getElementById("inspFile").value = "";
  upLoadFileList.value = "";

  const imgElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("img");

  const spanElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("span");

  const btnElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll('[id*="inspBtnFile"]');

  const divElement = document
    .getElementById("inspPhotoPreview")
    .querySelectorAll("div");

  imgElement.forEach((img) => {
    img.remove();
  });
  spanElement.forEach((span) => {
    span.remove();
  });
  btnElement.forEach((btn) => {
    btn.remove();
  });
  divElement.forEach((div) => {
    div.remove();
  });
}
</script>

<style scoped>
.content_box:nth-child(2) {
  margin: 0px;
}
.popup_content {
  height: 95%;
  overflow: auto;
}
.item_wrap .title {
  width: 80px;
  text-align: right;
}
.item_wrap input[type="text"],
.item_wrap select,
.item_wrap textarea,
.item_wrap .file {
  display: inline-block;
  width: calc(100% - 110px);
  vertical-align: middle;
}
</style>
