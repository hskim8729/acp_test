<template>
  <section class="index_section_price">
    <div class="title_text">
      부담없는 가격으로 우리 모두의 안전을 지킬 수 있습니다.
    </div>
    <div class="content_text">
      무료로 가입하여 사용해보세요. 가입 후 위험성평가를 무료로 체험하실 수
      있습니다.
    </div>

    <div class="price_table">
      <div class="price_card">
        <div class="title">FREE TRIAL</div>
        <div class="price">무료<span> 가입 첫 2개월</span></div>
        <div class="spec">
          <ul>
            <li>사용자 수<span>30명</span></li>
            <li class="no_check"></li>
          </ul>
          <div class="sub">
            <div class="alarm"></div>
            런칭 이벤트 마감 임박!<br />
            <div class="line_Height_20">
              <span class="text-body-4 text-error font-weight-bold">
                6개월 무료 체험 혜택이 곧 종료됩니다. </span
              ><br />
              <span class="text-body-4"> 9월부터는 2개월 무료로 변경되니, </span
              ><br />
              <span class="text-body-4 text-black font-weight-bold">
                지금 6개월 무료 혜택을 받으세요!
              </span>
            </div>
          </div>
          <div class="line_Height_20 text-caption-2 text-gray500 pa-2 mt-2">
            * 8/31까지 Trial 적용 시에만 6개월 무료이며,<br />
            9/1 이후 적용 시에는 대상에서 제외됩니다.
          </div>
        </div>
      </div>

      <div class="price_card">
        <div class="title">STANDARD</div>
        <div class="price">30만원<span> / 월 / 현장</span></div>
        <div class="spec">
          <ul>
            <li>사용자 수<span>50명</span></li>
            <li>부가서비스</li>
          </ul>
          <div class="sub">
            다국어 번역 (TBM)<br />
            알림톡/SMS
          </div>
        </div>
      </div>

      <div class="price_card">
        <div class="title">PREMIUM</div>
        <div class="price">40만원<span> / 월 / 현장</span></div>
        <div class="spec">
          <ul>
            <li>사용자 수<span>100명</span></li>
            <li>부가서비스</li>
          </ul>
          <div class="sub">
            다국어 번역 (TBM)<br />
            알림톡/SMS<br />
            AI 위험성평가
          </div>
        </div>
      </div>

      <div class="price_card">
        <div class="title">CUSTOM</div>
        <div class="price">문의<span> 문의하세요</span></div>
        <div class="spec">
          <ul class="text-center">
            <li>요금 관련 자세한 내용은</li>
            <li>Plan2do에 문의해 주세요.</li>
            <comp-button
              text="문의하기"
              bgColor="#1a2e4a"
              @click="emits('openContacUsOpen')"
              class="rounded-xl"></comp-button>
          </ul>
          <div class="sub pay_add_service">
            <v-card-title
              class="add-service-title ma-0 text-center mb-2 text-grey-darken-1">
              추가 연계 서비스
            </v-card-title>
            기업별 맞춤 요금 설계<br />
            초기 안전 진단 컨설팅 연계
          </div>
        </div>
      </div>
    </div>
    <div class="vat_area">
      <span>* VAT 별도</span>
    </div>
    <div class="btn_area">
      <button class="trial" @click="emits('memberRegist')">회원가입</button>
      <button class="login" @click="emits('indexLogin')">로그인</button>
    </div>
  </section>
</template>

<script setup>
import { defineEmits } from "vue";

const emits = defineEmits(["memberRegist", "indexLogin", "openContacUsOpen"]);
</script>
<style scoped>
.no_check::before {
  background-image: none !important;
}

.line_Height_20 {
  line-height: 20px;
}

.flex_container_row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.price .flex_container_column {
  display: flex;
  flex-direction: column;
}
.price_card .small {
  font-size: 16px;
}
.vat_area {
  width: 1200px;
  margin: 0px auto;
}
.vat_area span {
  float: right;
  margin: 0.5rem 0.3rem 0 0;
  color: #ffffff;
  font-family: "Pretendard-B";
  font-size: 1.3rem;
  text-shadow: -1px 0 rgba(0, 0, 0, 0.3), 0 1px rgba(0, 0, 0, 0.3),
    1px 0 rgba(0, 0, 0, 0.3), 0 -1px rgba(0, 0, 0, 0.3);
}
</style>
