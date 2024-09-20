<!-- views/stdRegulation -->
<template>
  <div class="page_title_area">
    <div class="title">실시규정 표준</div>
    <nav>
      <span><router-link to="/">홈</router-link></span> > 표준관리 > 실시규정
      표준
    </nav>
    <div class="top_btn_area">
      <button @click="onSaveCheckedButton">저장</button>
      <!-- <button @click="doSearch">초기화</button> -->
    </div>
  </div>

  <div class="page_content_area">
    <section class="item_section">
      <div class="item_title">
        1. 위험성평가 목적
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <textarea
          v-model="standReglInfo.riskEvalPrps"
          id="riskEvalPrps"></textarea>
      </div>
    </section>

    <section class="item_section">
      <div class="item_title">
        2. 위험성 수준 판단 방법 및 기준
        <select v-model="selected1" @change="changeSelect1($event)">
          <option v-for="(option, index) in options1" :value="option.comCd">
            {{ option.comCdNm }}
          </option>
        </select>
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <div class="grid_item">
          <table>
            <thead>
              <tr>
                <th>위험성</th>
                <th>판단기준</th>
                <th>위험성추정</th>
                <th>허용 가능 여부</th>
                <th>관리 수준</th>
              </tr>
            </thead>
            <tbody class="ta_c">
              <tr
                v-for="(item, i) in riskLvlListInfo"
                :key="item"
                :class="{
                  grid_red: item.riskDcsCls === '3',
                  grid_yellow: item.riskDcsCls === '2',
                  grid_green: item.riskDcsCls === '1',
                }">
                <td>{{ item.risk }}</td>
                <td class="ta_l">
                  <input class="w100p" v-model="item.dcsCrtr" />
                </td>

                <!-- 상중하법 -->
                <td v-show="riskLvlJdgmntCd1">{{ item.riskPrsmpGrd }}</td>

                <!-- 빈도강도(3*3) -->
                <td v-show="riskLvlJdgmntCd2">
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinSt = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinSt =
                        item.riskPrsmpFqinSt === 0 ? 7 : item.riskPrsmpFqinSt)
                    "
                    v-if="item.riskDcsCls === '3'"
                    type="text"
                    disabled /><span v-if="item.riskDcsCls === '3'">~ </span>
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinEn = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinEn =
                        item.riskPrsmpFqinEn === 0 ? 9 : item.riskPrsmpFqinEn)
                    "
                    v-if="item.riskDcsCls === '3'"
                    type="text"
                    disabled />

                  <input
                    class="w30"
                    @input="
                      item.riskPrsmpFqinSt = cUtil.regexTypeNumber($event)
                    "
                    @keyup="
                      item.riskPrsmpFqinSt = onKeyupRiskLvl3($event, 'st')
                    "
                    v-bind:value="
                      (item.riskPrsmpFqinSt =
                        item.riskPrsmpFqinSt === 0 ? 4 : item.riskPrsmpFqinSt)
                    "
                    v-if="item.riskDcsCls === '2'"
                    type="text" />
                  <span v-if="item.riskDcsCls === '2'">~ </span>
                  <input
                    class="w30"
                    @input="
                      item.riskPrsmpFqinEn = cUtil.regexTypeNumber($event)
                    "
                    @keyup="
                      item.riskPrsmpFqinEn = onKeyupRiskLvl3($event, 'en')
                    "
                    v-bind:value="
                      (item.riskPrsmpFqinEn =
                        item.riskPrsmpFqinEn === 0 ? 6 : item.riskPrsmpFqinEn)
                    "
                    v-if="item.riskDcsCls === '2'"
                    type="text" />

                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinSt = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinSt =
                        item.riskPrsmpFqinSt === 0 ? 1 : item.riskPrsmpFqinSt)
                    "
                    v-if="item.riskDcsCls === '1'"
                    type="text"
                    disabled />
                  <span v-if="item.riskDcsCls === '1'">~ </span>
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinEn = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinEn =
                        item.riskPrsmpFqinEn === 0 ? 3 : item.riskPrsmpFqinEn)
                    "
                    v-if="item.riskDcsCls === '1'"
                    type="text"
                    disabled />
                </td>
                <!-- 빈도강도(5*5) -->
                <td v-show="riskLvlJdgmntCd3">
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinSt5 = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinSt5 =
                        item.riskPrsmpFqinSt5 === 0
                          ? 18
                          : item.riskPrsmpFqinSt5)
                    "
                    v-if="item.riskDcsCls === '3'"
                    type="text"
                    disabled /><span v-if="item.riskDcsCls === '3'">~ </span>
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinEn5 = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinEn5 =
                        item.riskPrsmpFqinEn5 === 0
                          ? 25
                          : item.riskPrsmpFqinEn5)
                    "
                    v-if="item.riskDcsCls === '3'"
                    type="text"
                    disabled />

                  <input
                    class="w30"
                    @input="
                      item.riskPrsmpFqinSt5 = cUtil.regexTypeNumber($event)
                    "
                    @keyup="
                      item.riskPrsmpFqinSt5 = onKeyupRiskLvl5($event, 'st')
                    "
                    v-bind:value="
                      (item.riskPrsmpFqinSt5 =
                        item.riskPrsmpFqinSt5 === 0 ? 9 : item.riskPrsmpFqinSt5)
                    "
                    v-if="item.riskDcsCls === '2'"
                    type="text" />
                  <span v-if="item.riskDcsCls === '2'">~ </span>
                  <input
                    class="w30"
                    @input="
                      item.riskPrsmpFqinEn5 = cUtil.regexTypeNumber($event)
                    "
                    @keyup="
                      item.riskPrsmpFqinEn5 = onKeyupRiskLvl5($event, 'en')
                    "
                    v-bind:value="
                      (item.riskPrsmpFqinEn5 =
                        item.riskPrsmpFqinEn5 === 0
                          ? 17
                          : item.riskPrsmpFqinEn5)
                    "
                    v-if="item.riskDcsCls === '2'"
                    type="text" />

                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinSt5 = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinSt5 =
                        item.riskPrsmpFqinSt5 === 0 ? 1 : item.riskPrsmpFqinSt5)
                    "
                    v-if="item.riskDcsCls === '1'"
                    type="text"
                    disabled />
                  <span v-if="item.riskDcsCls === '1'">~ </span>
                  <input
                    class="w30"
                    @input="item.riskPrsmpFqinEn5 = $event.target.value"
                    v-bind:value="
                      (item.riskPrsmpFqinEn5 =
                        item.riskPrsmpFqinEn5 === 0 ? 8 : item.riskPrsmpFqinEn5)
                    "
                    v-if="item.riskDcsCls === '1'"
                    type="text"
                    disabled />
                </td>

                <td class="ta_l" v-if="item.mngLvl == 'T0201'">허용 불가능</td>
                <td class="ta_l" v-if="item.mngLvl == 'T0202'">허용 가능</td>
                <td>
                  <!-- 값이 없는 경우 -->
                  <select
                    v-if="cUtil.nullCheck(item.mngLvl)"
                    v-model="item.mngLvl"
                    :class="{
                      high: item.riskDcsCls === '3',
                      middle: item.riskDcsCls === '2',
                      low: item.riskDcsCls === '1',
                    }"
                    style="margin-top: 5px">
                    <!-- <option v-for="(option, index) in options4" :key="index" v-bind:value="option.comCd" style="text-align: center;">                          
                                             {{ option.comCdNm }} 
                                        </option>    -->

                    <option
                      :data-id="item.mngLvl"
                      value="T0201"
                      style="text-align: center"
                      :selected="item.mngLvl == 'T0201'">
                      중점관리
                    </option>
                    <option
                      :data-id="item.mngLvl"
                      value="T0202"
                      style="text-align: center"
                      :selected="item.mngLvl == 'T0202'">
                      일상관리
                    </option>
                  </select>

                  <!-- 값이 있는 경우 -->
                  <select
                    v-if="
                      !cUtil.nullCheck(item.mngLvl) && item.riskDcsCls === '3'
                    "
                    v-model="selectRiskDcsCls3"
                    :class="{
                      high: item.riskDcsCls === '3',
                      middle: item.riskDcsCls === '2',
                      low: item.riskDcsCls === '1',
                    }"
                    style="margin-top: 5px">
                    <option
                      :data-id="item.mngLvl"
                      value="T0201"
                      style="text-align: center">
                      중점관리
                    </option>
                    <option
                      :data-id="item.mngLvl"
                      value="T0202"
                      style="text-align: center">
                      일상관리
                    </option>
                  </select>

                  <!-- 값이 있는 경우 -->
                  <select
                    v-if="
                      !cUtil.nullCheck(item.mngLvl) && item.riskDcsCls === '2'
                    "
                    v-model="selectRiskDcsCls2"
                    :class="{
                      high: item.riskDcsCls === '3',
                      middle: item.riskDcsCls === '2',
                      low: item.riskDcsCls === '1',
                    }"
                    style="margin-top: 5px">
                    <option
                      :data-id="item.mngLvl"
                      value="T0201"
                      style="text-align: center">
                      중점관리
                    </option>
                    <option
                      :data-id="item.mngLvl"
                      value="T0202"
                      style="text-align: center">
                      일상관리
                    </option>
                  </select>

                  <!-- 값이 있는 경우 -->
                  <select
                    v-if="
                      !cUtil.nullCheck(item.mngLvl) && item.riskDcsCls === '1'
                    "
                    v-model="selectRiskDcsCls1"
                    :class="{
                      high: item.riskDcsCls === '3',
                      middle: item.riskDcsCls === '2',
                      low: item.riskDcsCls === '1',
                    }"
                    style="margin-top: 5px">
                    <option
                      :data-id="item.mngLvl"
                      value="T0201"
                      style="text-align: center">
                      중점관리
                    </option>
                    <option
                      :data-id="item.mngLvl"
                      value="T0202"
                      style="text-align: center">
                      일상관리
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="item_section">
      <div class="item_title">
        3. 위험성평가 방식
        <select v-model="selected2" @change="changeSelect2($event)">
          <option v-for="option in options2" :value="option.comCd">
            {{ option.comCdNm }}
          </option>
        </select>
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <div class="grid_item">
          <table v-show="riskEvalMthdCd1">
            <colgroup>
              <col style="width: 200px" />
              <col style="width: 100px" />
              <col style="width: *" />
            </colgroup>
            <thead>
              <tr>
                <th colspan="2">구분</th>
                <th>평가시기</th>
              </tr>
            </thead>
            <tbody class="ta_c">
              <tr>
                <td colspan="2">최초평가</td>
                <td class="ta_l">
                  <input
                    class="w100p"
                    v-model="standReglInfo.intEval"
                    id="intEval1" />
                </td>
              </tr>
              <tr>
                <td rowspan="2">수시평가</td>
                <td>정기</td>
                <td class="ta_l">
                  <input class="w100p" v-model="standReglInfo.rglr" />
                </td>
              </tr>
              <tr>
                <td>수시</td>
                <td class="ta_l">
                  <input class="w100p" v-model="standReglInfo.occs" />
                </td>
              </tr>
            </tbody>
          </table>
          <table v-show="riskEvalMthdCd2">
            <colgroup>
              <col style="width: 200px" />
              <col style="width: 100px" />
              <col style="width: *" />
            </colgroup>
            <thead>
              <tr>
                <th colspan="2">구분</th>
                <th>평가시기</th>
              </tr>
            </thead>
            <tbody class="ta_c">
              <tr>
                <td colspan="2">최초평가</td>
                <td class="ta_l">
                  <input
                    class="w100p"
                    v-model="standReglInfo.intEval"
                    id="intEval2" />
                </td>
              </tr>
              <tr>
                <td rowspan="2">상시평가</td>
                <td>월</td>
                <td class="ta_l">
                  <input class="w100p" v-model="standReglInfo.mon" />
                </td>
              </tr>
              <tr>
                <td>주</td>
                <td class="ta_l">
                  <input class="w100p" v-model="standReglInfo.week" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="item_section">
      <div class="item_title">
        4. 조직 및 역할
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <div class="grid_item">
          <table>
            <colgroup>
              <col style="width: 230px" />
              <col style="width: *" />
              <col style="width: 250px" />
            </colgroup>
            <thead>
              <tr>
                <th>현장 직무</th>
                <th>역할</th>
                <th>지정 담당자</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in stdOrgRoleInfo" :key="index">
                <td>{{ options5[index].comCdNm }}</td>
                <td>
                  <textarea @input="item.role = $event.target.value">{{
                    item.role
                  }}</textarea>
                </td>
                <td rowspan="4" style="text-align: center" v-if="index == 0">
                  '지정 담당자는 시스템 권한에 따름'
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="item_section">
      <div class="item_title">
        5. 평가절차 및 방법
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <div class="grid_item">
          <table>
            <colgroup>
              <col style="width: 230px" />
              <col style="width: *" />
            </colgroup>
            <thead>
              <tr>
                <th>평가절차</th>
                <th>방법</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in evalMthdInfo" :key="index">
                <td>{{ options3[index].comCdNm }}</td>
                <td>
                  <textarea
                    @input="item.mthd = $event.target.value"
                    class="classMthd"
                    >{{ item.mthd }}</textarea
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="item_section">
      <div class="item_title">
        6. 기록 보존
        <button class="section_close" @click="sectionClose">
          <span class="icon"></span>
        </button>
      </div>
      <div class="item_content">
        <textarea v-model="standReglInfo.rcdKeep" id="rcdKeep"></textarea>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCdMgmtStore } from "@/stores/sys/cd-mgmt-store";
import { useStandReglStore } from "@/stores/stdMgmt/standardslm-regulation-store";
import { onBeforeMount, ref, reactive, getCurrentInstance } from "vue";
import commonUtils from "@/utils/common-utils";
import { useSiteImpRegulationStore } from "@/stores/site/site-imp-regulation-store";
import { onMounted } from "vue";

const cUtil = commonUtils;

const siteStore = useSiteImpRegulationStore();
const store = useStandReglStore();
const cdMgmtStore = useCdMgmtStore();

//초기화
const selected1 = ref("T0501");
const selected2 = ref("T0401");

// db에 저장 된 위험성 수준 판단 방법 및 기준
const riskLvlJdgmntCd = ref("");

// db에 저장 된 낮음에 관리 수준
const lowMngLvl = ref("");

// 높음  관리수준초기값 (일상)
const selectRiskDcsCls3 = ref("T0201");
// 보통 관리수준 초기값 (중점)
const selectRiskDcsCls2 = ref("T0201");
// 낮음 관리수준 초기 값 (중점)
const selectRiskDcsCls1 = ref("T0202");

// 높음 관리수준 저장 된 값 (일상)
const saveRiskDcsCls3 = ref("");
// 보통 관리수준 저장 된 값 (중점)
const saveRiskDcsCls2 = ref("");
// 낮음 관리수준 저장 된 값 (중점)
const saveRiskDcsCls1 = ref("");

let searchInt = ref("");

const options1 = ref([]);
const options2 = ref([]);
const options3 = ref([]);
const options4 = ref([]);
const options5 = ref([]);

const app = getCurrentInstance();
const $loginStore = app.appContext.config.globalProperties.$loginStore.$state;

const vendrCd = $loginStore.vendrInfo.vendrCd;
const userId = $loginStore.userInfo.userId;
const division = "A"; // 전사, 현장 구분 값(A:전사, S:현장)

let standReglInfo = ref({}); //실시규정 표준 map
let evalMthdInfo = ref([]); //평가절차 및 방법 list
let riskLvlListInfo = ref([]); //위험성 수준 판단 방법 및 기준 list
let stdOrgRoleInfo = ref([]); //조직 및 역할 list

// 2.위험성 수준 판단 방법 및 기준
const riskLvlJdgmntCd1 = ref(true);
const riskLvlJdgmntCd2 = ref(false);
const riskLvlJdgmntCd3 = ref(false);

// 3.위험성 평가 방식
const riskEvalMthdCd1 = ref(true);
const riskEvalMthdCd2 = ref(false);

var fchParams = reactive({
  vendrCd: vendrCd,
  division: division, // 전사, 현장 구분 값(A:전사, S:현장)
});

var saveListMap = reactive({});

onBeforeMount(async () => {
  await siteStore.comCodesList();
  options1.value = siteStore.$state.riskLvlJdgMntList; //위험성평가 기준
  options2.value = siteStore.$state.riskEvalMthdList; //위험성 평가 방식
  options3.value = siteStore.$state.evalProcList; //평가절차
  options4.value = siteStore.$state.mngLvlList; //관리수준
  options5.value = [
    { comCd: "1000", comCdNm: "안전보건관리 책임자" },
    { comCd: "2000", comCdNm: "위험성평가 담당자" },
    { comCd: "3000", comCdNm: "관리감독자 / 공종별 협력업체소장" },
    { comCd: "4000", comCdNm: "일반근로자" },
  ];

  // 실시규정 표준관리 조회 (전사)
  await doSearch();
});

// 탭닫기
function sectionClose(event) {
  var sectionStatus = event.target.parentElement.parentElement.classList;

  if (sectionStatus.contains("close")) {
    sectionStatus.remove("close");
  } else {
    sectionStatus.add("close");
  }
}

// 실시규정 표준 조회
async function doSearch() {
  const stdReglObj = await store.standReglSearchList(fchParams);
  const stdReglObjData = stdReglObj;

  //데이터 초기화 및 데이터 바인딩
  if (!cUtil.nullCheck(stdReglObjData)) {
    // 수정

    const evalMthdListData = await store.evalMthdList(fchParams);
    const riskLvlListData = await store.riskLvlList(fchParams);
    const stdOrgRoleListData = await store.stdOrgRoleList(fchParams);

    standReglInfo.value = stdReglObjData;
    evalMthdInfo.value = evalMthdListData;
    riskLvlListInfo.value = riskLvlListData;
    stdOrgRoleInfo.value = stdOrgRoleListData;

    // 조회 된 값에 따라 select 세팅
    selected1.value = stdReglObjData.riskLvlJdgmntCd;
    selected2.value = stdReglObjData.riskEvalMthdCd;

    // 높음 관리수준초기값 (일상)
    selectRiskDcsCls3.value = riskLvlListData[0].mngLvl;
    // 중간 관리수준초기값 (일상)
    selectRiskDcsCls2.value = riskLvlListData[1].mngLvl;
    // 낮음 관리수준초기값 (일상)
    selectRiskDcsCls1.value = riskLvlListData[2].mngLvl;

    // 높음 관리수준 저장 된 값
    saveRiskDcsCls3.value = riskLvlListData[0].mngLvl;
    // 보통 관리수준 저장 된 값
    saveRiskDcsCls2.value = riskLvlListData[1].mngLvl;
    // 낮음 관리수준 저장 된 값
    saveRiskDcsCls1.value = riskLvlListData[2].mngLvl;

    // 조회 된 위험성 수준 판단 방법 및 기준 값
    riskLvlJdgmntCd.value = stdReglObjData.riskLvlJdgmntCd;

    lowMngLvl.value = riskLvlListData[2].mngLvl;

    changeRiskgmntCd(selected1.value);
    changeRiskEvalMthdCd(selected2.value);

    standReglInfo.value.mode = "U";

    // 평가절차
    for (let i = 0; i < evalMthdListData.length; i++) {
      evalMthdInfo.value[i].mode = "U";
      evalMthdInfo.value[i].vendrCd = vendrCd;
      evalMthdInfo.value[i].division = division;
      evalMthdInfo.value[i].userId = userId;
    }

    // 위험성 수준 판단
    for (var i = 0; i < riskLvlListData.length; i++) {
      riskLvlListInfo.value[i].mode = "U";
      riskLvlListInfo.value[i].vendrCd = vendrCd;
      riskLvlListInfo.value[i].division = division;
      riskLvlListInfo.value[i].userId = userId;

      // 3X3 변동시 초기화
      if (stdReglObjData.riskLvlJdgmntCd == "T0502") {
        riskLvlListInfo.value[i].riskPrsmpFqinSt5 = 0;
        riskLvlListInfo.value[i].riskPrsmpFqinEn5 = 0;
        // 5X5인 값 변동시 초기화
      } else if (stdReglObjData.riskLvlJdgmntCd == "T0503") {
        // DB값 세팅
        riskLvlListInfo.value[i].riskPrsmpFqinSt5 =
          riskLvlListInfo.value[i].riskPrsmpFqinSt;
        riskLvlListInfo.value[i].riskPrsmpFqinEn5 =
          riskLvlListInfo.value[i].riskPrsmpFqinEn;
        // 3X3 데이터 초기화 시키기 위함
        riskLvlListInfo.value[i].riskPrsmpFqinSt = 0;
        riskLvlListInfo.value[i].riskPrsmpFqinEn = 0;

        // 상중하법 변동시 초기화
      } else {
        //5X5인 데이터 초기화 시키기 위함
        riskLvlListInfo.value[i].riskPrsmpFqinSt5 = 0;
        riskLvlListInfo.value[i].riskPrsmpFqinEn5 = 0;

        // 3X3 데이터 초기화 시키기 위함
        riskLvlListInfo.value[i].riskPrsmpFqinSt = 0;
        riskLvlListInfo.value[i].riskPrsmpFqinEn = 0;
      }
    }

    // stdOrgRoleInfo
    // 조직 및 역할
    for (let i = 0; i < stdOrgRoleListData.length; i++) {
      stdOrgRoleInfo.value[i].mode = "U";
      stdOrgRoleInfo.value[i].vendrCd = vendrCd;
      stdOrgRoleInfo.value[i].division = division;
      stdOrgRoleInfo.value[i].userId = userId;
    }
  } else {
    //신규

    standReglInfo.value.mode = "I";

    standReglInfo.value.riskEvalPrps =
      "근로자 참여를 통한 실질적인 위험성평가로 사망사고 제로 실현"; // 위험성평가 목적
    standReglInfo.value.intEval = "공사 실 착공 후 1개월 이내 착수"; //최초평가
    // 수시평가
    standReglInfo.value.rglr = "최초평가 후 매년 1회 정기적으로 실시"; //정기
    standReglInfo.value.occs =
      "새로운 기계/기구/설비원재료를 도입하거나 공정의 변경 등이 있어 유해위험요인이 추가되거나 위험성의 수준이 변경되는 경우 실시. 만일, 중대재해가 발생한 경우 실시"; //수시
    // 상시평가
    standReglInfo.value.mon = "매월 O째주 O요일";
    standReglInfo.value.week = "매주 O요일";
    // 기록보존
    standReglInfo.value.rcdKeep =
      "위험성평가 기록은 안전보건관리책임자(현장소장)의 승인을 받는다. \n승인된 위험성평가 기록은 우리 현장의 기록을 관리 규정에 따라 공사 종료 후 3년간 보관된다.";

    // 위험성 수준 판단
    for (let i = 0; i < 3; i++) {
      const node = {};

      node.division = division;
      node.mode = "I";
      node.vendrCd = vendrCd;
      node.userId = userId;

      // 3x3
      node.riskPrsmpFqinSt = 0;
      node.riskPrsmpFqinEn = 0;
      // 5x5
      node.riskPrsmpFqinSt5 = 0;
      node.riskPrsmpFqinEn5 = 0;

      if (i == 0) {
        node.risk = "높음";
        node.riskPrsmpGrd = "상";
        node.riskDcsCls = "3";
        node.dcsCrtr = "사고발생시 사망/장애가 남을 수 있는 위험";
        node.mngLvl = "T0201";
      } else if (i == 1) {
        node.risk = "보통";
        node.riskPrsmpGrd = "중";
        node.riskDcsCls = "2";
        node.dcsCrtr = "사고발생시 요양이 필요한 위험";
        node.mngLvl = "T0201";
      } else if (i == 2) {
        node.risk = "낮음";
        node.riskPrsmpGrd = "하";
        node.riskDcsCls = "1";
        node.dcsCrtr = "작업수행에 영향을 미치지 않는 경미한 부상/질병";
        node.mngLvl = "T0202";
      }

      riskLvlListInfo.value.push(node);
    }

    // 평가절차 및 방법
    for (let i = 0; i < 6; i++) {
      const node = {};
      node.evalProcCd = options3.value[i].comCd;
      node.division = division;
      node.mode = "I";
      node.vendrCd = vendrCd;
      node.userId = userId;

      if (i == 0) {
        node.mthd =
          "예정 공정표(원하청 공사담당자 작성) 확인 및 공종 분류\n동종 유사업종 재해, 아차사고 사례, 안전보건정보 수집 및 분석";
      } else if (i == 1) {
        node.mthd =
          "노사 합동 사업장 순회점검\n근로자 제안제도\n아차사고 제보사례\n안전보건공단 공종별 표준모델 등을 활용하여 예정 공정표에 따른 공종별 유해위험요인을 파악";
      } else if (i == 2) {
        node.mthd =
          "근로자들이 참여하는 전체 위험성평가 회의를 개최하여 관리할 유해위험요인을 선정\n근로자의 경험과 재해사례 등을 반영하여 위험성 결정\n위험성 기준에 따라 중점관리와 일상관리로 구분하여 관리";
      } else if (i == 3) {
        node.mthd =
          "실천가능한 위험 감소대책을 수립하고, 누가 언제까지 실행할지 계획 수립";
      } else if (i == 4) {
        node.mthd =
          "TBM: 일일 작업 전 안전점검회의시 위험성평가 결과와 근로자 준수사항 및 주의해야할 사항을 철저히 공유\n공유 : 현장 출입구에 설치된 안전보건 현황판에 매월 위험성평가 결과 게시\n교육 : 매월 정기안전보건교육, 수시 특별안전보건교육 시 위험성평가 결과 포함";
      } else if (i == 5) {
        node.mthd =
          "공종별 공사담당자는 주기적으로 위험성 감소대책의 실시 결과를 확인하고 공유\n주 단위 원/하청 합동 안전점검을 통해 이행상황을 점검하고 보완";
      }
      evalMthdInfo.value.push(node);
    }

    // 조직 및 역할
    for (let i = 0; i < 4; i++) {
      const node = {};
      node.siteWorkCd = options5.value[i].comCd;
      node.division = division;
      node.mode = "I";
      node.vendrCd = vendrCd;
      node.userId = userId;

      if (i == 0) {
        node.role =
          "위험성평가 총괄\n위험성 감소대책에 대한 인적/물적 지원 및 이행책임";
      } else if (i == 1) {
        node.role =
          "실시규정 작성 등 사전준비 총괄\n회의안건 작성 및 위험성평가표 관리\n위험성평가 관련 회의 소집 및 운영\n위험성평가 결과 교육 및 공유 총괄\nTBM 사항 선정 및 TBM 담당자 전파";
      } else if (i == 2) {
        node.role =
          "노사 합동 순회점검 참여를 통한 유해위험요인 발굴\n유해위험요인 위험성 결정\n위험성 감소대책 마련 및 대책의 적합성 여부 검증\n위험성 감소대책의 이행여부 점검\n위험성평가 내용 공유/TBM 전파";
      } else if (i == 3) {
        node.role =
          "작업관련 위험성평가/TBM 참여\n평시 위험 제안, 아차사고 제보 참여\n안전수칙 및 개선대책 적극 이행";
      }
      stdOrgRoleInfo.value.push(node);
    }
  }

  standReglInfo.value.vendrCd = vendrCd;
  standReglInfo.value.userId = userId;
  standReglInfo.value.division = division; // 전사, 현장 구분 값(A:전사, S:현장)
}

// 위험성 평가 기준 select
async function changeSelect1(event) {
  var value = event.target.value;
  changeRiskgmntCd(value);
}

function changeRiskgmntCd(val) {
  // 위험성 수준 판단 방법 기준
  standReglInfo.value.riskLvlJdgmntCd = val;

  if (val == "T0501") {
    //상중하법
    riskLvlJdgmntCd1.value = true;
    riskLvlJdgmntCd2.value = false;
    riskLvlJdgmntCd3.value = false;
  } else if (val == "T0502") {
    //빈도강도법 3x3
    riskLvlJdgmntCd1.value = false;
    riskLvlJdgmntCd2.value = true;
    riskLvlJdgmntCd3.value = false;
  } else if (val == "T0503") {
    //빈도강도법 5x5
    riskLvlJdgmntCd1.value = false;
    riskLvlJdgmntCd2.value = false;
    riskLvlJdgmntCd3.value = true;
  }

  // 실시규정 표준 값이 저장 된 경우
  if (!cUtil.nullCheck(riskLvlJdgmntCd.value)) {
    // 저장 된 위험성 수준 판단 방법 기준이랑 선택 된 방법 기준이랑 다른 경우 초기 값으로 셋팅
    if (riskLvlJdgmntCd.value != standReglInfo.value.riskLvlJdgmntCd) {
      selectRiskDcsCls3.value = "T0201";
      selectRiskDcsCls2.value = "T0201";
      selectRiskDcsCls1.value = "T0202";
      // 같은 경우
    } else {
      selectRiskDcsCls3.value = saveRiskDcsCls3.value;
      selectRiskDcsCls2.value = saveRiskDcsCls2.value;
      selectRiskDcsCls1.value = saveRiskDcsCls1.value;
    }
  }
}

// 위험성 평가 방식 select
async function changeSelect2(event) {
  var value = event.target.value;
  changeRiskEvalMthdCd(value);
}

function changeRiskEvalMthdCd(val) {
  if (val == "T0401") {
    //수시평가
    standReglInfo.value.riskEvalMthdCd = "T0401";
    riskEvalMthdCd1.value = true;
    riskEvalMthdCd2.value = false;
  } else if (val == "T0402") {
    //상시평가
    standReglInfo.value.riskEvalMthdCd = "T0402";
    riskEvalMthdCd1.value = false;
    riskEvalMthdCd2.value = true;
  }
}

function onKeyupRiskLvl3(event, str) {
  let num = parseInt(event.target.value);
  if (str == "st") {
    if (num > 8 || num < 2) return (event.target.value = "");
    else {
      riskLvlListInfo.value[2].riskPrsmpFqinEn = --num;
      return event.target.value;
    }
  }
  if (str == "en") {
    if (num > 8 || num < 2) return (event.target.value = "");
    else {
      riskLvlListInfo.value[0].riskPrsmpFqinSt = ++num;
      return event.target.value;
    }
  }
}

function onKeyupRiskLvl5(event, str) {
  let num = parseInt(event.target.value);
  if (str == "st") {
    if (num > 24 || num < 2 || num === "") return (event.target.value = "");
    else {
      riskLvlListInfo.value[2].riskPrsmpFqinEn5 = --num;
      return event.target.value;
    }
  }
  if (str == "en") {
    if (num > 24 || num < 2 || num === "") return (event.target.value = "");
    else {
      riskLvlListInfo.value[0].riskPrsmpFqinSt5 = ++num;
      return event.target.value;
    }
  }
}

// 유효성 체크
function validation() {
  try {
    // 위험성평가 목적 체크
    if (!standReglInfo.value.riskEvalPrps) {
      throw {
        field: "riskEvalPrps",
        message: "위험성평가 목적을 입력해 주세요.",
        check: "form",
      };
    }

    // 최초평가 체크
    if (!standReglInfo.value.intEval) {
      throw {
        field: selected2 == "T0401" ? "intEval1" : "intEval2",
        message: "최초평가를 입력해 주세요.",
        check: "form",
      };
    }

    // 기록 보존 체크
    if (!standReglInfo.value.rcdKeep) {
      throw {
        field: "rcdKeep",
        message: "기록 보존을 입력해 주세요.",
        check: "form",
      };
    }

    if (selected1.value == "T0502") {
      if (
        riskLvlListInfo.value[1].riskPrsmpFqinSt == "" ||
        riskLvlListInfo.value[1].riskPrsmpFqinEn == ""
      ) {
        throw {
          message: "위험성 추정 값을 입력해주세요.",
        };
      }
      if (
        parseInt(riskLvlListInfo.value[1].riskPrsmpFqinSt) >
        parseInt(riskLvlListInfo.value[1].riskPrsmpFqinEn)
      ) {
        throw {
          message: "위험성 추정 시작값이 종료값보다 크거나 같을 수 없습니다.",
        };
      }
    } else if (selected1.value == "T0503") {
      if (
        riskLvlListInfo.value[1].riskPrsmpFqinSt5 == "" ||
        riskLvlListInfo.value[1].riskPrsmpFqinEn5 == ""
      ) {
        throw {
          message: "위험성 추정 값을 입력해주세요.",
        };
      }
      if (
        parseInt(riskLvlListInfo.value[1].riskPrsmpFqinSt5) >
        parseInt(riskLvlListInfo.value[1].riskPrsmpFqinEn5)
      ) {
        throw {
          message: "위험성 추정 시작값이 종료값보다 크거나 같을 수  없습니다.",
        };
      }
    }
  } catch (error) {
    if (error.field) {
      if (error.check == "list")
        riskLvlListInfo.value.setFocusedCell(targetIdx, error.field, null);
      if (error.check == "form") document.getElementById(error.field).focus();
    }
    alert(error.message);
    return true;
  }

  return false;
}

//저장 (신규 또는 수정)
async function onSaveCheckedButton() {
  standReglInfo.value.riskEvalMthdCd = selected2.value;
  standReglInfo.value.riskLvlJdgmntCd = selected1.value;

  if (selected1.value == "T0503") {
    for (let i = 0; i < 3; i++) {
      riskLvlListInfo.value[i].riskPrsmpFqinSt =
        riskLvlListInfo.value[i].riskPrsmpFqinSt5;
      riskLvlListInfo.value[i].riskPrsmpFqinEn =
        riskLvlListInfo.value[i].riskPrsmpFqinEn5;
    }
  }

  for (let k = 0; k < 3; k++) {
    if (k === 0) {
      riskLvlListInfo.value[k].mngLvl = selectRiskDcsCls3.value;
    } else if (k === 1) {
      riskLvlListInfo.value[k].mngLvl = selectRiskDcsCls2.value;
    } else {
      riskLvlListInfo.value[k].mngLvl = selectRiskDcsCls1.value;
    }
  }

  if (validation()) return;

  saveListMap = {
    stdMgMtStdImpRgltInfo: standReglInfo.value,
    riskLvlList: riskLvlListInfo.value,
    evalMthdList: evalMthdInfo.value,
    stdOrgRoleList: stdOrgRoleInfo.value,
  };
  if (!confirm("저장하시겠습니까?")) return;

  const res = await siteStore.saveSiteImpRegulation(saveListMap);

  try {
    if (!res.svrStatus && (res.status == 200 || res.data.status == 200)) {
      alert("정상적으로 처리하였습니다.");
      doSearch();
    } else {
      if (!res.svrMessage) alert(res.svrMessage);
      else alert(res.data.message);
    }
  } catch (err) {
    console.error("저장중 오류가 발생했습니다.");
    throw err;
  }
}

// 컴포넌트 생성 전
onMounted(async () => {
  // 관리 수준 기본값 셋팅
});
</script>

<style scoped></style>
