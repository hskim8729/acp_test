import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useLoginAuthStore } from "../common/login-auth-store";
import commonService from "@/api/common-service.js";
import boardService from "../../api/services/board/board-service";

export const useBbsStore = defineStore("bbsStore", () => {
  // 로그인 스토어에서 자주 사용하는 파람 받아옴
  const loginAuthStore = useLoginAuthStore();
  const { userInfo, siteInfo, authInfo } = storeToRefs(loginAuthStore);
  const defaultParam = computed(() => {
    return {
      vendrCd: userInfo.value.vendrCd,
      siteCd: userInfo.value.vendrCd === "0000" ? "00000" : siteInfo.siteCd,
      authCd: authInfo.value.authCd,
      authClsCd: authInfo.value.authClsCd,
      userId: userInfo.value.userId,
    };
  });
  const initialDetail = {
    rowNum: null,
    bbsSeq: null,
    ttl: "",
    dtl: "",
    cntn: null,
    inqNum: null,
    atchFileKey: null,
    regId: null,
    regDate: null,
    modId: null,
    modDate: null,
    strtStDt: null,
    strtEnDt: null,
    vendrCd: null,
    siteCd: null,
    filePath: null,
    fileNm: null,
    fileSeq: null,
    bbsClsNm: null,
    bbsClsCd: null,
    writeNm: null,
    authCd: null,
    authClsCd: null,
  };
  const bbsDetail = ref({ ...initialDetail });
  function resetDetail() {
    bbsDetail.value = { ...initialDetail };
  }

  const bbsList = ref([]); // state 속성 ref로 작성
  // bbsDetail에 bbsSeq가 있으면 업데이트로 계산
  const mode = computed(() => (bbsDetail.value?.bbsSeq ? "U" : "I"));
  const isModalOpen = ref(false);

  /**
   * 게시판 목록을 조회하는 함수
   * @param {String} bbsClsCd 게시판 구분 코드
   * @param {String} searchCategory
   * @param {String} searchText
   */
  async function boardSelectList(
    bbsClsCd,
    searchCategory = "",
    searchText = ""
  ) {
    // const defaultParam = await getDefaultParam();
    const params = {
      ...defaultParam.value,
      bbsClsCd,
    };
    if (searchCategory) {
      params[searchCategory] = searchText;
    }
    const res = await boardService.getNotifyNewsList(params);
    bbsList.value = res.data;
    return res.data;
  }

  /**
   * 게시판 상세조회
   * @param {} bbsSeq 게시글 순번
   */
  async function boardDetailSearch(bbsSeq) {
    const params = { bbsSeq };
    const res = await boardService.getNotifyNewsInfo(params);
    this.$patch({
      bbsDetail: res.data[0],
    });
    return res.data;
  }

  /**
   * 게시판 저장
   * @param {*} bbsClsCd 게시판 구분 코드
   * @param {*} cntn 콘텐츠
   * @param {*} attFiles 새로 추가되는 파일
   */
  async function saveBoardList(bbsClsCd, cntn, attFiles = []) {
    // const defaultParam = await getDefaultParam();
    const params = {
      ...defaultParam.value,
      mode: mode.value,
      bbsClsCd,
      cntn,
      ttl: bbsDetail.value.ttl,
      strtEnDt: bbsDetail.value.strtEnDt,
      strtStDt: bbsDetail.value.strtStDt,
      bbsSeq: bbsDetail.value?.bbsSeq,
      dtl: bbsDetail.value.dtl,
    };
    let formData = new FormData();
    formData.append(
      "param",
      new Blob([JSON.stringify(params)], { type: "application/json" })
    );
    // 첨부파일 FormData 추가
    attFiles.forEach((file, index) => {
      if (file.status === "I") {
        formData.append("files", file.file);
      }
    });
    const res = await boardService.saveBoardList(formData);
    return res.data;
  }

  // 게시판 게시글 삭제
  async function deleteList(atchFileKey, bbsSeq) {
    // const defaultParam = await getDefaultParam();
    const params = {
      vendrCd: defaultParam.value.vendrCd,
      userId: defaultParam.value.userId,
      atchFileKey,
      bbsSeq,
      mode: "D",
    };
    let formData = new FormData();
    formData.append(
      "param",
      new Blob([JSON.stringify(params)], { type: "application/json" })
    );
    await boardService.deleteList(formData);
  }

  return {
    bbsList,
    bbsDetail,
    resetDetail,
    mode,
    isModalOpen,
    boardSelectList,
    boardDetailSearch,
    saveBoardList,
    deleteList,
  };
});
