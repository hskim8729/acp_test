import commonService from "@/api/common-service.js";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import toolBoxMeetingRegistService from "../../api/services/safeActvt/tool-box-meeting-Regist-service";

const tbmInfo = {
  mode: "I",
  vendrCd: "",
  siteCd: "",
  userId: "",
  atchFileKey: "",
  attndSeq: "",
  dcrsMsr: "",
  delYn: "",
  fileNm: "",
  filePath: "",
  fileSeq: "",
  inptEqmnt: "",
  inptPsn: "",
  rskFctr: "",
  seq: "",
  sftEdu: "",
  tbmDt: "",
  tbmNm: "",
  tbmOrgnsId: "",
  tbmOrgnsNm: "",
  tbmTime: "",
  vendrNm: "",
  psitnVendrCd: "",
  writeNm: "",
  wrkDtl: "",
  wrkLoc: "",
  wrkNm: "",
  regId: "",
  // tbmAttndList: [],
  // tbmAtchFileList: [],
  // tbmRskDsrsList: [],
};

export const useToolBoxMeetingRegistStore = defineStore(
  "toolBoxMeetingRegistStore",
  {
    id: "toolBoxMeetingRegistStore",
    state: () => ({
      venderList: [],
      RskFctrList: [],
      detailInfo: { ...tbmInfo },
      downloadFile: [],
      translateTbmList: [],
      tbmAttndList: [],
      tbmAtchFileList: [],
      tbmRskDsrsList: [],
    }),
    getters: {
      // 참석자 목록에서 로그인한 사람이 참석했는지 확인해서 버튼 비활성화 처리
      isUserAttending: (state) => {
        const loginStore = useLoginAuthStore();
        if (!state.tbmAttndList) {
          return false; // 참석자 리스트가 없거나 0인 경우 참석 안한것
        }
        return state.tbmAttndList.some(
          (user) => user.attendId === loginStore.userInfo.userId
        );
      },
      // 오늘 날짜와 tbm 작성된 날짜가 같은지 체크
      isTbmToday: (state) => {
        if (!state.detailInfo.tbmDt) {
          return false; // 참석자 리스트가 없거나 0인 경우 참석 안한것
        }
        const todayMD = dayjs().format("YYYYMMDD");
        return state.detailInfo.tbmDt === todayMD;
      },
      computedTbmRskFctr: (state) => {
        if (!state.tbmRskDsrsList) {
          return [];
        }
        const old = [...state.tbmRskDsrsList];
        return old;
      },
    },
    actions: {
      // tbm 위험요인 추가
      async addTbmRskFctr(newObjList) {
        newObjList.forEach((newObj) => {
          // 같은 위험요인, 위험대책이 있는지 검사
          let exist = false;
          if (this.tbmRskDsrsList) {
            exist = this.tbmRskDsrsList.some(
              (rsk) =>
                rsk.rskFctr === newObj.rskFctr && rsk.dcrsMsr === newObj.rskMsr
            );
          }
          // 검사해서 없는 경우만 추가
          console.log("exist>>>>", exist);
          if (!exist) {
            const newRskDcrs = {
              rskFctr: newObj.rskFctr,
              dcrsMsr: newObj.rskMsr,
              mode: "I",
            };
            this.tbmRskDsrsList.push(newRskDcrs);
          }
        });
      },
      // tbm 위험요인 삭제
      async deleteTbmRskFctr(rowIdx) {
        this.tbmRskDsrsList.splice(rowIdx, 1);
      },
      // 번역언어 list 조회
      async transLanguageList() {
        try {
          // 번역언어
          const res = await toolBoxMeetingRegistService.transLanguageList();
          const languageCodeList = res.data;

          this.$patch({
            languageCodeList,
          });

          // 결과 리턴
          return languageCodeList;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > transLanguageList > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      //  소속회사 찾기 함수
      async searchVenderInfo(params) {
        try {
          const res = await toolBoxMeetingRegistService.searchVenderInfo(
            params
          );
          const venderList = res.data;

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            venderList,
          });

          // 결과 리턴
          console.log("venderList : " + venderList);
          return venderList;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > searchVenderInfo > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 위험요인 찾기 함수
      async searchRskFctr(params) {
        try {
          const res = await toolBoxMeetingRegistService.searchRskFctrInfo(
            params
          );
          const RskFctrList = res.data;

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            RskFctrList,
          });

          // 결과 리턴
          console.log("RskFctrList : " + RskFctrList);
          return RskFctrList;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > searchRskFctr > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 저장 함수
      async saveToolBoxRegi(params) {
        try {
          await toolBoxMeetingRegistService.saveToolBoxRegi(params);
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > saveToolBoxRegi > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 상세조회 초기화
      async detailInfoInit() {
        // 일시 기본세팅
        const tomorrow = dayjs().add(1, "day");
        const tomorrow7AM = dayjs().set("hour", 7).set("minute", 0);
        // tbm 명 기본세팅
        const loginStore = useLoginAuthStore();
        const todayMD = dayjs().format("YY.MM.DD");
        const info = {
          ...tbmInfo,
          vendrCd: loginStore.siteInfo.vendrCd,
          siteCd: loginStore.siteInfo.siteCd,
          userId: loginStore.userInfo.userId,
          psitnVendrCd: loginStore.userInfo.vendrCd,
          tbmOrgnsId: loginStore.userInfo.userId,
          tbmOrgnsNm: loginStore.userInfo.userNm,
          tbmDt: tomorrow.format("YYYYMMDD"),
          tbmNm: `${todayMD}_${loginStore.userInfo.userNm}`,
          tbmTime: tomorrow7AM.format("HHmm"),
        };
        this.$patch({
          detailInfo: info,
          tbmAttndList: [],
          tbmAtchFileList: [],
          tbmRskDsrsList: [],
        });
      },
      // 상세조회 함수
      async detailSearchToolBox(params) {
        try {
          const loginStore = useLoginAuthStore();
          const res = await toolBoxMeetingRegistService.detailSearchToolBox(
            params
          );
          const detailInfo = {
            ...res.data,
            userId: res.data.regId, // 관리자도 수정할 수 있어서 userId regId 넣어줘야함
          };

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            detailInfo,
            tbmAttndList: res.data.tbmAttndList ? res.data.tbmAttndList : [],
            tbmAtchFileList: res.data.tbmAtchFileList
              ? res.data.tbmAtchFileList
              : [],
            tbmRskDsrsList: res.data.tbmRskDsrsList
              ? res.data.tbmRskDsrsList
              : [],
          });

          return detailInfo;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > detailSearchToolBox > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 파일 삭제
      async fileDelete(params) {
        try {
          const res = await toolBoxMeetingRegistService.fileDelete(params);
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > fileDelete > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 파일 다운로드 fileDownload
      async fileDownload(params) {
        try {
          console.log("파일 다운로드 스토어 진입");
          const res = await toolBoxMeetingRegistService.fileDownload(params);
          const downloadFile = res.data;

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            downloadFile,
          });

          return downloadFile;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > fileDownload > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // 파일 다운로드 fileDownload (외부용, 권한체크X)
      async fileDownloadForExtern(params) {
        try {
          console.log("파일 다운로드 스토어 진입");
          const res = await toolBoxMeetingRegistService.fileDownloadForExtern(
            params
          );
          const downloadFile = res.data;

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            downloadFile,
          });

          return downloadFile;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > fileDownload > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // TBM 모바일
      // TBM 번역
      async translateTbmList(params) {
        try {
          const res = await toolBoxMeetingRegistService.translateTbmList(
            params
          );
          const translateTbmList = res.data;

          // 스토어에 있는 state값을 넣어준다.
          this.$patch({
            translateTbmList,
          });

          // 결과 리턴
          return translateTbmList;
        } catch (err) {
          console.log(
            "useToolBoxMeetingRegistStore > searchRskFctr > error : ",
            err
          );
          // 에러 리턴
          throw err;
        }
      },
      // TBM 참석자 저장
      async saveTbmAttnd(params) {
        return commonService.axiosCall("/v1/safeActvt/saveTbmAttnd", params);
      },
      async deleteTbmAttnd(params) {
        return commonService.axiosCall("/v1/safeActvt/deleteTbmAttnd", params);
      },
      // TBM 일자 valid
      async tbmValidCheck(params) {
        return commonService.axiosCall("/v1/safeActvt/tbmValidCheck", params);
      },
    },
  }
);
