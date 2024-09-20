import { defineStore } from "pinia";
import riskFactorStandardService from "@/api/services/stdMgmt/risk-factor-standard-service.js";
import { ref } from "vue";
import { useLoginAuthStore } from "../common/login-auth-store";

// 개발서버 테스트용
export const useRiskFactorStandardStore = defineStore(
  "riskFactorStandardStore",
  {
    id: "riskFactorStandard",

    state: () => {
      const loginAuthStore = useLoginAuthStore();
      return {
        // 템플릿 목록 관리
        // template 데이터 수정하고 vendrCd도 수정
        vendrCd: loginAuthStore.userInfo.vendrCd,
        userId: loginAuthStore.userInfo.userId,
        selectedVenderCd: ref(""),
        selectedHrmrskFctrMstSeq: ref(0),
        selectedLgCatCd: ref(""),
        selectedLgCatNm: ref(""),
        selectedMdCatCd: ref(""),
        selectedMdCatNm: ref(""),
        selectedWrkNmCd: ref(""),
        selectedWrkNm: ref(""),

        templateList: ref([]),
        lgCatList: ref([]),
        mdCatList: ref([]),
        wrkList: ref([]),
        rskFctrList: ref([]),

        isSearchPopupOpen: ref(false),
      };
    },
    getters: {},
    actions: {
      // 1. 템플릿
      // 1-1. 목록 조회
      async fetchTemplateList(params) {
        try {
          const res = await riskFactorStandardService.getTemplateList(params);
          const templateList = res.data;

          this.$patch({
            templateList,
            // selectedHrmrskFctrMstSeq: params.hrmrskFctrMstSeq,
          });

          return templateList;
        } catch (err) {
          console.log(
            "riskFactorStandardStore > fetchTemplateList > error : ",
            err
          );

          throw err;
        }
      },
      // 1-2. 추가, 수정, 삭제, 복사
      async fetchTemplate(params, isRefresh = true) {
        const info = {
          vendrCd: this.vendrCd,
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          await riskFactorStandardService.saveTemplate(mergedParams);

          if (isRefresh === true) {
            const templateList = await this.fetchTemplateList(info);
            return templateList;
          }
        } catch (err) {
          console.log("riskFactorStandardStore > fetchLgCat > error : ", err);
          throw err;
        }
      },
      // 2. 대분류
      // 2-1. 조회
      async fetchLgCatList(params, initLgCd = "", initLgCatNm = "") {
        try {
          const res = await riskFactorStandardService.getLgCatList(params);
          const lgCatList = res.data;

          this.$patch({
            lgCatList,
          });

          return lgCatList;
        } catch (err) {
          console.log(
            "riskFactorStandardStore > fetchLgCatList > error : ",
            err
          );
          throw err;
        }
      },
      // 2-2. 추가, 수정, 삭제
      async fetchLgCat(params, isRefresh = true) {
        const info = {
          vendrCd: this.vendrCd,
          hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          lgCatCd: params.lgCatCd ? params.lgCatCd : "",
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          // 
          await riskFactorStandardService.saveLgCat(mergedParams);
          if (isRefresh === true) {
            const lgCatList = this.fetchLgCatList(
              info,
              info.lgCatCd,
              params.lgCatNm
            );
            
            return lgCatList;
          }
        } catch (err) {
          console.log("riskFactorStandardStore > fetchLgCat > error : ", err);
          throw err;
        }
      },
      // 3. 중분류
      // 3-1. 조회
      async fetchMdCatList(params, lgCatNm = "", initMdCatNm = "") {
        try {
          let res = await riskFactorStandardService.getMdCatList(params);
          let mdCatList = res.data;

          this.$patch({
            mdCatList,
            // selectedLgCatCd: params.lgCatCd,
            // selectedLgCatNm: lgCatNm,
          });

          // let initParam = {
          //   vendrCd: this.selectedVenderCd,
          //   hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          //   lgCatCd: this.selectedLgCatCd,
          //   mdCatCd:
          //     this.mdCatList.length != 0 ? this.mdCatList[0].mdCatCd : "",
          // };

          // let mdCatNm =
          //   this.mdCatList.length != 0 ? this.mdCatList[0].mdCatNm : "";

          // if (initMdCatNm != "") {
          //   initParam.mdCatCd = mdCatList.find(
          //     (md) => md.mdCatNm === initMdCatNm
          //   ).mdCatCd;
          //   mdCatNm = initMdCatNm;
          // }

          // await this.fetchWrkList(initParam, mdCatNm);

          return mdCatList;
        } catch (err) {
          console.log(
            "riskFactorStandardStore > fetchMdCatList > error : ",
            err
          );
          throw err;
        }
      },
      // 3-2. 추가, 수정, 삭제
      async fetchMdCat(params, isRefresh = true) {
        //   params => mode: "I", mdCatNm: mdInput.value.value
        const info = {
          vendrCd: this.vendrCd,
          hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          lgCatCd: this.selectedLgCatCd,
          mdCatCd: params.mdCatCd ? params.mdCatCd : "",
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          await riskFactorStandardService.saveMdCat(mergedParams);

          // 추가, 삭제의 경우 lgCatList의 cnt 변경
          if (params.mode !== "U") {
            // 추가(I)는 +1 삭제(D)는 -1
            const num = params.mode == "I" ? 1 : -1;
            this.$patch((state) => {
              const itemIndex = state.lgCatList.findIndex(
                (item) => item.lgCatCd === state.selectedLgCatCd
              );
              if (itemIndex !== -1) {
                const updatedItem = {
                  ...state.lgCatList[itemIndex],
                  cnt: state.lgCatList[itemIndex].cnt + num,
                };
                state.lgCatList = [
                  ...state.lgCatList.slice(0, itemIndex),
                  updatedItem,
                  ...state.lgCatList.slice(itemIndex + 1),
                ];
              }
            });
          }
          // mdCatList 조회시 추가수정삭제한 중분류 기준으로 선택되도록
          const mdCatList = this.fetchMdCatList(
            info,
            this.selectedLgCatNm,
            params.mdCatNm
          );
          return mdCatList;
        } catch (err) {
          console.log("riskFactorStandardStore > fetchMdCat > error : ", err);
          throw err;
        }
      },
      // 4. 작업목록
      // 4-1. 조회
      async fetchWrkList(params) {
        try {
          let res = await riskFactorStandardService.getWrkList(params);
          let wrkList = res.data;

          this.$patch({
            // selectedLgCatCd: params.lgCatCd,
            // selectedMdCatCd: params.mdCatCd,
            // selectedMdCatNm: mdCatNm,
            wrkList,
          });

          return wrkList;
        } catch (err) {
          console.log("riskFactorStandardStore > fetchWrkList > error : ", err);
          throw err;
        }
      },
      // 4-2. 추가, 수정, 삭제
      async fetchWrk(params) {
        const info = {
          vendrCd: this.vendrCd,
          hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          lgCatCd: this.selectedLgCatCd,
          mdCatCd: this.selectedMdCatCd,
          wrkNmCd: params.wrkNmCd ? params.wrkNmCd : "",
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          await riskFactorStandardService.saveWrk(mergedParams);

          // 추가, 삭제의 경우 mdCatList의 cnt 변경
          if (params.mode !== "U") {
            // 추가(I)는 +1 삭제(D)는 -1
            const num = params.mode == "I" ? 1 : -1;
            this.$patch((state) => {
              const itemIndex = state.mdCatList.findIndex(
                (item) => item.mdCatCd === state.selectedMdCatCd
              );
              if (itemIndex !== -1) {
                const updatedItem = {
                  ...state.mdCatList[itemIndex],
                  cnt: state.mdCatList[itemIndex].cnt + num,
                };
                state.mdCatList = [
                  ...state.mdCatList.slice(0, itemIndex),
                  updatedItem,
                  ...state.mdCatList.slice(itemIndex + 1),
                ];
              }
            });
          }

          // WrkList 조회시 추가한 일 기준으로 선택되도록
          const wrkList = await this.fetchWrkList(info);
          return wrkList;
        } catch (err) {
          console.log("riskFactorStandardStore > fetchMdCat > error : ", err);
          throw err;
        }
      },
      // 5. 작업명 위험요인 및 대책
      // 5-1. 목록 조회
      async fetchRskFctrMsrList(params, wrkNm) {
        try {
          const res = await riskFactorStandardService.getRskFctrMsrList(params);
          if (res.data.length === 0) {
            this.$patch({
              selectedWrkNmCd: params.wrkNmCd,
              selectedWrkNm: wrkNm,
              rskFctrList: [],
            });

            return [];
          }

          let rskFctrList = [];
          let prevSeq = -1;
          let tempList = [];
          const addAndPush = (rskFctrList, tempList) => {
            // 위험요인 보여주는 UI 위해 자르면서 맨 앞에 rskMsrSeq = -1인 object를 붙여줌
            let firstItem = { ...tempList[0] };
            firstItem.rskMsrSeq = -1;
            firstItem.isRskFctr = true;

            // 대책 추가 UI를 위해 자르면서 맨 뒤에 rskMsrSeq = 0인 object를 붙여줌
            let lastItem = { ...tempList[0] };
            lastItem.rskMsrSeq = 0;
            lastItem.rskMsr = "";
            lastItem.isTextarea = true;

            // 이미 rskMsrSeq = 0인 것이 있는 경우 맨 뒤에 object 붙이지 X (요인만 있고 대책 없는 경우)
            if (tempList[0].rskMsrSeq == 0) {
              tempList[tempList.length - 1].isTextarea = true;
              rskFctrList.push([firstItem, ...tempList]);
            } else {
              rskFctrList.push([firstItem, ...tempList, lastItem]);
            }

            return rskFctrList;
          };

          for (let item of res.data) {
            // rowSpan 적용을 위해 rskFctrSeq 단위로 자름
            if (
              prevSeq !== -1 &&
              prevSeq !== item.rskFctrSeq &&
              tempList.length !== 0
            ) {
              rskFctrList = addAndPush(rskFctrList, tempList);
              tempList = [];
            }
            item.isTextarea = false;
            item.isRskFctr = false;
            tempList.push(item);
            prevSeq = item.rskFctrSeq;
          }

          rskFctrList = addAndPush(rskFctrList, tempList);

          this.$patch({
            // selectedWrkNmCd: params.wrkNmCd,
            // selectedWrkNm: wrkNm,
            rskFctrList,
          });

          return rskFctrList;
        } catch (err) {
          console.log(
            "riskFactorStandardStore > fetchRskFctrMsrList > error : ",
            err
          );
          throw err;
        }
      },

      // 5-2. 위험요인
      async fetchRskFctr(params) {
        const info = {
          vendrCd: this.vendrCd,
          hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          lgCatCd: this.selectedLgCatCd,
          mdCatCd: this.selectedMdCatCd,
          wrkNmCd: this.selectedWrkNmCd,
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          await riskFactorStandardService.saveRskFctr(mergedParams);

          // 추가, 삭제의 경우 mdCatList의 cnt 변경
          if (params.mode !== "U") {
            // 추가(I)는 +1 삭제(D)는 -1
            const num = params.mode == "I" ? 1 : -1;
            this.$patch((state) => {
              const itemIndex = state.wrkList.findIndex(
                (item) => item.wrkNmCd === state.selectedWrkNmCd
              );
              if (itemIndex !== -1) {
                const updatedItem = {
                  ...state.wrkList[itemIndex],
                  cnt: state.wrkList[itemIndex].cnt + num,
                };
                state.wrkList = [
                  ...state.wrkList.slice(0, itemIndex),
                  updatedItem,
                  ...state.wrkList.slice(itemIndex + 1),
                ];
              }
            });
          }
          this.fetchRskFctrMsrList(info, this.selectedWrkNm);
        } catch (err) {
          console.log("riskFactorStandardStore > fetchRskFctr > error : ", err);

          throw err;
        }
      },
      // 5-3. 대책
      async fetchRskFctrMsr(params) {
        const info = {
          vendrCd: this.vendrCd,
          hrmrskFctrMstSeq: this.selectedHrmrskFctrMstSeq,
          lgCatCd: this.selectedLgCatCd,
          mdCatCd: this.selectedMdCatCd,
          wrkNmCd: this.selectedWrkNmCd,
        };
        const mergedParams = {
          ...info,
          ...params,
          userId: this.userId,
        };
        try {
          await riskFactorStandardService.saveRskFctrMsr(mergedParams);
          this.fetchRskFctrMsrList(info, this.selectedWrkNm);
        } catch (err) {
          console.log(
            "riskFactorStandardStore > fetchRskFctrMsr > error : ",
            err
          );

          throw err;
        }
      },
    },
  }
);
