<template>
  <compPage title="신규 현장 등록">
    <v-row dense>
      <v-col xxl="3" xl="4" lg="5" md="12" sm="12" xs="12">
        <compPageCard subTitle="현장 개요" :isFillPage="lgAndUp">
          <v-form>
            <v-sheet height="50" class="d-flex align-center mr-3 mt-3">
              <v-text-field
                v-if="isNmActive"
                v-model="form.siteNm"
                class="w-auto title pa-0"
                variant="solo"
                flat
                autofocus
                placeholder="현장명을 입력해주세요"
                hide-details="auto">
              </v-text-field>
              <div
                v-else
                @click="isNmActive = true"
                class="d-flex w-100 ms-4 text-h5">
                <p>
                  {{
                    form.siteNm == "" ? "현장명을 입력해주세요" : form.siteNm
                  }}
                </p>
                <v-icon icon="mdi-pencil" size="small"></v-icon>
              </div>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="text-body">#121234</div>
                </template>
                현장코드
              </v-tooltip>
            </v-sheet>

            <v-divider class="mt-1 mb-3" />

            <compFormInput label="구 독 멤 버 쉽">
              <v-row>
                <v-col cols="9"></v-col>
                <v-col cols="3"></v-col>
              </v-row>
            </compFormInput>

            <v-divider class="mt-3 mb-4" />

            <compFormRadios label="산 업 구 분" />
            <compFormInput
              label="전 화 번 호"
              placeholder="현장 대표 전화번호를 입력하세요" />
            <compFormInput label="공 사 기 간">
              <input type="date" id="fromTbmDt" />
              <span> ~ </span>
              <input type="date" id="toTbmDt" />
            </compFormInput>
            <compFormSelect
              label="지 역"
              placeholder="지역을 선택해주세요"
              :dataList="areaList"
              :data="form.area"
              @update-data="
                (selected) => {
                  console.log(selected);
                  form.area = selected;
                }
              "
              title="comCdNm" />
            <compFormInput label="현 장 개 요" />
            <compFormInput label="파 일 첨 부" />
          </v-form>
        </compPageCard>
      </v-col>

      <v-divider v-if="!lgAndUp" class="mt-5 mb-3" />

      <v-col>
        <compPageCard subTitle="현장 인력 정보" isFillPage>
          <girdSiteManPower></girdSiteManPower>
        </compPageCard>
        <!-- <v-row no-gutters>
            <div class="text-h6 ms-3 mt-1">현장 인력 정보</div>
          </v-row> -->
        <!-- <v-row no-gutters>
            <v-card
              class="ps-3 pr-1 pb-3 mt-1 overflow-y-auto w-100"
              :height="lgAndUp ? 'calc(100vh - 165px)' : 'calc(100vh - 150px)'"
              elevation="1"
              rounded="lg">
              <girdSiteManPower></girdSiteManPower>
            </v-card>
          </v-row> -->
      </v-col>
    </v-row>
  </compPage>
</template>

<script setup>
import { ref, reactive, toRefs, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import router from "@/router";
import commonUtil from "@/utils/common-utils";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import { useSiteRegStore } from "@/stores/site/site-reg-store";
import { useSiteRegDetailStore } from "@/stores/site/site-reg-detail-store";
import siteRegDetailService from "@/api/services/site/site-reg-detail-service";
import { useToolBoxMeetingRegistStore } from "@/stores/safeActvt/tool-box-meeting-Regist-store";
import { usePayPlanStore } from "@/stores/payPlan/pay-plan-store";

import compPage from "@/components/layout/compPage.vue";
import compPageCard from "@/components/layout/compPageCard.vue";
import compFormInput from "@/views/component/compFormInput.vue";
import compFormSelect from "@/views/component/compFormSelect.vue";
import compFormRadios from "@/views/component/compFormRadios.vue";

import girdSiteManPower from "@/views/site/component/girdSiteManPower.vue";
import popPayPlan from "@/views/payPlan/popPayPlan.vue";

const route = useRoute();

// 현장 목록에서 받아온 회사코드, 현장코드
const loginStore = useLoginAuthStore();
const { vendrInfo, userInfo, siteInfo } = storeToRefs(loginStore);
const { userId } = userInfo.value;
const { vendrCd, siteCd } = siteInfo.value;
const { dataObj } = history.state;

let fchParams = {
  vendrCd,
  siteCd,
  userId,
};

if (dataObj && dataObj.vendrCd) {
  // 현장 목록에서 선택 > 현장 편집 클릭한 경우 fetchParams 업데이트
  fchParams.vendrCd = dataObj.vendrCd;
  fchParams.siteCd = dataObj.siteCd;
  loginStore.$patch({ selectSiteInfo: { ...fchParams } });
}

// 공통코드 불러오기
const siteRegStore = useSiteRegStore();
siteRegStore.comCodesList();
// 공사유형, 공사구분, 지역
const { constTypeList, constclsList, areaList } = storeToRefs(siteRegStore);

// 직책, 권한코드 불러오기
// 권한,직책코드 => 역할로 변경하면서 권한코드 설정하면 자동으로 직책코드 설정
const siteRegDetailStore = useSiteRegDetailStore();
siteRegDetailStore.selectJbttlCdList(); // 직책
siteRegDetailStore.selectAuthList({ vendrCd: fchParams.vendrCd }); //권한
const { lowerAuthList, upperAuthList, matchedJbttlCd } =
  storeToRefs(siteRegDetailStore);
// lowerAuth : 협력사직원 권한 코드 리스트
// upperAuthList : 본사직원 권한 코드 리스트
// matchedJbttlCd: 권한에 맞는 직책 코드 반환함수

// 피니아 스토어
const toolBoxRegiStore = useToolBoxMeetingRegistStore();
const payPlanStore = usePayPlanStore();

onBeforeMount(async () => {
  // // 직책코드
  // await siteRegDetailStore.selectJbttlCdList();
  // const getJbttlCdList = siteRegDetailStore.getJbttlCdList;
  // getJbttlCdList.forEach((item) => {
  //   if (lowerJbttlCd.includes(item.comCd)) {
  //     // 협력사 직원 작책 코드 리스트
  //     lowerjbttlCdList.value[item.comCd] = item.comCdNm;
  //   }
  //   // 모회사 직원 직책 코드 리스트
  //   jbttlCdList.value[item.comCd] = item.comCdNm;
  // });
  // // 권한코드
  // await siteRegDetailStore.selectAuthList({ vendrCd: fchParams.vendrCd });
  // const getAuthSeqList = siteRegDetailStore.getAuthList;
  // getAuthSeqList.forEach((item) => {
  //   if (lowerAuthSeq.includes(item.authId)) {
  //     // 협력사 직원 권한 코드 리스트
  //     lowerAuthSeqList.value[item.authId] = item.authNm;
  //   }
  //   // 모회사 직원 권한 코드 리스트
  //   authSeqList.value[item.authId] = item.authNm;
  // });
});

// 브레이크 포인트에 따라 동적으로 class 변경
const { lgAndUp } = useDisplay();

const isNmActive = ref(false);

const form = reactive({
  mode: "",
  userId: vendrInfo.value.vendrCd,
  vendrCd: vendrInfo.value.vendrCd,
  psitnVendrCd: userInfo.vendrCd,
  siteNm: "",
  siteDsc: "",
  constStDt: "",
  constEnDt: "",
  constType: "",
  constCls: "",
  area: "",
  odr: "",
  constAmt: "",
  siteZip: "",
  siteRoadNm: "",
  siteLnm: "",
  siteDaddr: "",
  crryTelNo: "",
  siteMngr: "",
  useYn: "Y",
  siteMngrNm: "",
});

// toRefs를 사용하여 form라는 reactive 객체를 구조 분해하고 반응성을 유지
const { siteDsc } = toRefs(form);
</script>

<style lang="scss" scoped>
.card_body_lg {
  height: calc(100vh - 180px);
}
.card_body_sm {
  height: 100%;
}
</style>
