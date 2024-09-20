<!-- 안전활동/중점점검활동/팝업-중점점검활동 조치 -->

<template>
  <comp-modal
    modalTitle="조치내역 반려"
    @modal-action="emit('rejectCommentsSubmit')"
    actionBtnText="반려의견 등록"
    isActions>
    <div class="content_box">
      <div class="item_wrap w100p">
        <span class="title">부적합사항</span>
        <textarea v-model="rjctDtl"></textarea>
      </div>
      <div class="item_wrap w100p">
        <span class="title">부적합 사항 첨부</span>
        <div class="file">
          <div class="photo" id="inspRjctPhotoPreview">
            <input
              id="fileInput"
              type="file"
              class="w100p"
              @change="handleFileChange"
              accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/x-windows-bmp"
              multiple
              hidden />
            <button type="button" @click="triggerFileInput">파일 선택</button>
          </div>
        </div>
      </div>
      <div class="item_wrap w100p">
        <span class="title">조치요구사항</span>
        <textarea v-model="actReqMsg"></textarea>
      </div>
    </div>
  </comp-modal>
</template>

<script setup>
import { defineExpose, ref } from "vue";

import compModal from "@/components/modal/compModal.vue";

const emit = defineEmits(["rejectCommentsSubmit"]);

const rjctDtl = ref("");
const actReqMsg = ref("");
const uploadFileList = ref([]);

const triggerFileInput = () => {
  document.getElementById("fileInput").click();
};

const handleFileChange = (event) => {
  const files = event.target.files;

  uploadFileList.value = [...uploadFileList.value, ...Array.from(files)];

  drawPreview(uploadFileList.value);
};

// 첨부파일> 파일 등록 화면에서 이미지 삭제시
const saveDeleteFile = (data) => {
  // data에서 삭제정보가 넘어오면 저장해둔 fileList에서 찾아 삭제 후 다시 남은 list로 프리뷰 함수 부르기
  deletePreview();
  const index = uploadFileList.value.findIndex(
    (file) => file.name === data.name
  );
  if (index !== -1) {
    uploadFileList.value.splice(index, 1);
  }
  drawPreview(uploadFileList.value);
};

// 첨부파일> 파일 등록 프리뷰 일괄 삭제
const deletePreview = () => {
  const imgElement = document
    .getElementById("inspRjctPhotoPreview")
    .querySelectorAll('[id*="inspImgFileI"]');

  const btnElement = document
    .getElementById("inspRjctPhotoPreview")
    .querySelectorAll('[id*="inspBtnFileI"]');

  const divElement = document
    .getElementById("inspRjctPhotoPreview")
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

        document.getElementById("inspRjctPhotoPreview").appendChild(div);
        div.appendChild(button);
        div.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
};

const getData = () => {
  const data = {
    rjctDtl: rjctDtl.value,
    actReqMsg: actReqMsg.value,
    uploadFileList: uploadFileList.value,
  };
  return data;
};

defineExpose({
  getData,
});
</script>

<style scoped>
.content_box {
  height: 100%;
  margin: 0px;
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
