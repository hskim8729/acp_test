<!-- 현장등록/현장등록/팝업-현장등록 -->

<template>
  <div class="content_box">
    <div class="item_wrap w66p">
      <span class="title">현장명</span>
      <input type="text">
    </div>
    <div class="item_wrap w33p">
      <span class="title">현장코드</span>
      <input type="text">
    </div>

    <div class="item_wrap w100p">
      <span class="title">공사기간</span>
      <input type="date">
      <span> ~ </span>
      <input type="date">
    </div>

    <div class="item_wrap w33p">
      <span class="title">공사유형</span>
      <select>
        <option>== 선택하세요 ==</option>
      </select>
    </div>
    <div class="item_wrap w33p">
      <span class="title">공사구분</span>
      <select>
        <option>== 선택하세요 ==</option>
      </select>
    </div>
    <div class="item_wrap w33p">
      <span class="title">지역</span>
      <select>
        <option>== 선택하세요 ==</option>
      </select>
    </div>

    <div class="item_wrap w40p">
      <span class="title">현장담당자</span>
      <input type="text" class="search_input">
      <button class="search_btn"></button>
    </div>

    <div class="item_wrap w66p">
      <span class="title">발주처</span>
      <input type="text">
    </div>
    <div class="item_wrap w33p">
      <span class="title">공사금액</span>
      <input type="text">
    </div>

    <div class="item_wrap w66p">
      <span class="title">현장주소</span>
      <input type="text" class="search_input">
      <button class="search_btn"></button>
    </div>
    <div class="item_wrap w33p">
      <span class="title">전화번호</span>
      <input type="text">
    </div>

    <div class="item_wrap w100p">
      <span class="title">현장개요</span>
      <textarea></textarea>
    </div>

    <div class="item_wrap w100p">
      <span class="title">현장사진</span>
      <input type="file">
    </div>

    <div class="item_wrap w100p">
      <span class="title">사용유무</span>
      <div class="switch on">
        <div class="click_area" @click = "switchItem"></div>
        <div class="dot"></div>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    switchItem:function(event){
      if(event.target.parentElement.classList.contains("on")) {
        event.target.parentElement.classList.replace("on", "off");
      } else {
        event.target.parentElement.classList.replace("off", "on");
      }
    },

  },
}
</script>


<style scoped>
.content_box {
  height:100%;
}
.item_wrap .title {
  width:80px;
  text-align: right;
}
.item_wrap input[type="date"] {
  width:150px;
}
.item_wrap input,
.item_wrap select,
.item_wrap textarea {
  width:calc(100% - 110px);
}
.switch {
  margin:4px 0px;
}
</style>