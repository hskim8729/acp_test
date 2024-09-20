import { defineStore } from "pinia";
import siteRiskFactorRegulationService from "@/api/services/site/site-risk-factor-regulation-service";
import riskFactorStandardService from "@/api/services/stdMgmt/risk-factor-standard-service";
import { ref } from "vue";
import { useLoginAuthStore } from "../common/login-auth-store";



export const useSiteRiskFactorRegulationStore = defineStore(
  "sitesiteRiskFactorRegulationStore",
  {
    id: "siteRiskFactorRegulation",

    state: () => ({
      // 1. 표준 위험요인 조회
      templateList: ref([]),
      siteHrmrskFctrMstSeq: ref(0),

      // 2. 표준공종 / 위험요인 (대분류, 중분류, 작업명)
      selectedLgCatCd: ref(""),
      selectedMdCatCd: ref(""),
      selectedWrkCd: "",

      // 2.컴포넌트->3.컴포넌트에 넘기기 위함
      selectCodeObj: ref({}),

    }),
    getters: {},
    actions: {
      // 전사 표준위험요인 > 현장 표준위험요인 등록 
      async fetchsaveSiteHrmrskFctr(params) {
          try {
              const res = await siteRiskFactorRegulationService.saveSiteStdMgmtRiskFactorStandardList(params);

          this.$patch({
          });

          return res;

          } catch (err) {
          console.log(
              "siteRiskFactorRegulationStore > saveSiteStdMgmtRiskFactorStandardList > error : ",
              err
          );

          throw err;
          }
      },
      // 1. 템플릿 조회
      // 1-1. 템플릿 목록 조회 (전사) -> 등록할때 사용할 전사템플릿
      async fetchVendrTemplateList(params) {
          try {
              const res = await riskFactorStandardService.getTemplateList(params);
              const vnedrTemplateList = res.data;

          this.$patch({
              vnedrTemplateList,
          });

          return vnedrTemplateList;
          } catch (err) {
          console.log(
              "siteRiskFactorRegulationStore > fetchVendrTemplateList > error : ",
              err
          );

          throw err;
          }
      },
      // 1-2. 템플릿 목록 조회 (현장)
      async fetchTemplateList(params) {
        try {
          const res = await siteRiskFactorRegulationService.getTemplateList(params);
          const templateList = res.data;
         
          const siteHrmrskFctrMstSeq = ref(0);

          if(templateList.length>0) siteHrmrskFctrMstSeq.value = templateList[0].siteHrmrskFctrMstSeq;

          this.$patch({
            templateList,
            siteHrmrskFctrMstSeq,
          });

          return {
            templateList,
          };
        } catch (err) {
          console.log(
            "siteRiskFactorRegulationStore > fetchTemplateList > error : ",
            err
          );

          throw err;
        }
      },
      // 2. 대분류
      // 2-2. 팝업 - 대분류 조회
      async selectLgCatList(params) {
        try {
          
          const res = await siteRiskFactorRegulationService.getLgCatList(params);
          const selectedLgCatList = res.data;
          
          this.$patch({
            selectedLgCatList,
          });

          return selectedLgCatList;
        } catch (err) {
          console.log(
            "siteRiskFactorRegulationStore > fetchLgCatList > error : ",
            err
          );
          throw err;
        }
      },
      // 3. 중분류
      // 3-2. 팝업 - 중분류 조회
      async selectMdCatList(params) {
        try {
          
          const res = await siteRiskFactorRegulationService.getMdCatList(params);
          const selectedMdCatList = res.data;
           
          this.$patch({
            selectedMdCatList,
          });

          return selectedMdCatList;
        } catch (err) {
          console.log(
            "siteRiskFactorRegulationStore > fetchLgCatList > error : ",
            err
          );
          throw err;
        }
      },
      // 4. 작업명
      // 4-2. 팝업 - 작업명 조회
      async selectWrkCatList(params) {
        try {
          const res = await siteRiskFactorRegulationService.getWrkList(params);
          const selectedWrkList = res.data;

          this.$patch({
            selectedWrkList,
          });

          return selectedWrkList;
        } catch (err) {
          console.log(
            "siteRiskFactorRegulationStore > selectWrkCatList > error : ",
            err
          );
          throw err;
        }
      },

      // 대분류, 중분류, 작업명 코드 저장
      // 다른 컴포넌트에 바뀐값을 적용하기 위함
      setCodeSelect(params) {
        try {
          const selectCodeObj = {
            lgCatCd: params.lgCatCd,
            mdCatCd: params.mdCatCd,
            wrkCd: params.wrkNmCd,
          }
  
          this.$patch({
            selectCodeObj,
          });
          
          return selectCodeObj;
        } catch (err) {
          console.log(
            "siteRiskFactorRegulationStore > selectWrkCatList > error : ",
            err
          );
          throw err;
        }
      },
      // 5. 위험요인 조회(팝업)
      async fetchRskFctrList(params) {
        try {
          
          const res = await siteRiskFactorRegulationService.getRskFctrList(params);
          const rskFctrList = res.data;
          // const selectedWrkCd = params.wrkNmCd;

          // 여기 리스트에서 rskFctrSeq 위험요인 순번을 받아야 감소대책 조회가능
          this.$patch({
            rskFctrList,
            // selectedWrkCd,
          });

          return rskFctrList;
        } catch (err) {
          console.log("siteRiskFactorRegulationStore > fetchRskFctrList > error : ", err);
          throw err;
        }
      },

    // 5. 감소대책 조회(팝업)
    async fetchRskMsrList(params) {
      try {
        let res = await siteRiskFactorRegulationService.getRskMsrList(params);
        let rskWrkList = res.data;

        this.$patch({
          rskWrkList,
        });

        return rskWrkList;
      } catch (err) {
        console.log("siteRiskFactorRegulationStore > fetchWrkList > error : ", err);
        throw err;
      }
    },

     // 5. 위험요인, 감소대책 조회 (묶어서 조회)
     async fetchRskFctrMsrList(params) {
      try {
        
        let res = await siteRiskFactorRegulationService.getRskFctrMsrList(params);
        
        let rskFctrMsrList = res.data;

        this.$patch({
          rskFctrMsrList,
        });

        return rskFctrMsrList;
      } catch (err) {
        console.log("siteRiskFactorRegulationStore > fetchRskFctrMsrList > error : ", err);
        throw err;
      }
    },

    // 4. 작업명 위험요인 및 대책 조회
    async fetchRskFctrMsrList(params, index) {
      try {
          const res = await siteRiskFactorRegulationService.getRskFctrMsrList(params);
          if (res.data.length === 0) {
              this.$patch({
                  wrkNmCd: params.wrkNmCd,
                  wrkNm: params.wrkNm,
                  rskFctrList: [],
              });
              return [];
          }

          let rskFctrList = [];
          let prevSeq = -1;
          let tempList = [];

          const addAndPush = (rskFctrList, tempList) => {
              let firstItem = { ...tempList[0] };
              rskFctrList.push([firstItem, ...tempList]);

              return rskFctrList;
          };

          for (let item of res.data) {
              // rowSpan 적용을 위해 rskFctrSeq 단위로 자름
              if (prevSeq !== -1 && prevSeq !== item.rskFctrSeq && tempList.length !== 0) {
                  rskFctrList = addAndPush(rskFctrList, tempList);
                  tempList = [];
              }
              tempList.push(item);
              prevSeq = item.rskFctrSeq;
          }

          rskFctrList = addAndPush(rskFctrList, tempList);

          this.$patch({
              lgCatCd: params.lgCatCd,
              lgCatNm: params.lgCatNm,
              mdCatCd: params.mdCatCd,
              mdCatNm: params.mdCatNm,
              wrkNmCd: params.wrkNmCd,
              wrkNm: params.wrkNm,
              rskFctrSeq: params.rskFctrSeq,
              rskFctr: params.rskFctr,
              rskMsrSeq: params.rskMsrSeq,
              rskMsr: params.rskMsr,
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

    // 7. 현장 대분류 표시여부 저장
    async fetchSaveSiteLgMarkYn(params) {
      try {
          const res = await siteRiskFactorRegulationService.saveSiteRiskLgCatCdList(params);

      this.$patch({
      });

      return res;

      } catch (err) {
      console.log(
          "siteRiskFactorRegulationStore > fetchSaveSiteLgMarkYn > error : ",
          err
      );

      throw err;
      } 
    },
    // 8. 현장 중분류 표시여부 저장
    async fetchSaveSiteMdMarkYn(params) {
      try {
          const res = await siteRiskFactorRegulationService.saveSiteRiskMdCatCdList(params);

      this.$patch({
      });

      return res;

      } catch (err) {
      console.log(
          "siteRiskFactorRegulationStore > fetchSaveSiteMdMarkYn > error : ",
          err
      );

      throw err;
      }
    },
    // 9. 현장 작업명 표시여부 저장
    async fetchSaveSiteRiskWrkNmList(params) {
      try {
          const res = await siteRiskFactorRegulationService.saveSiteRiskWrkNmList(params);

      this.$patch({
      });

      return res;

      } catch (err) {
      console.log(
          "siteRiskFactorRegulationStore > fetchSaveSiteRiskWrkNmList > error : ",
          err
      );

      throw err;
      }
    },
    // 10. 현장 위험요인 표시여부 저장
    async fetchSaveSiteRiskFctrList(params) {
      try {
          const res = await siteRiskFactorRegulationService.saveSiteRiskFctrList(params);

      this.$patch({
      });

      return res;

      } catch (err) {
      console.log(
          "siteRiskFactorRegulationStore > fetchSaveSiteRiskFctrList > error : ",
          err
      );

      throw err;
      }
    },

    // 10. 현장 감소대책 표시여부 저장
    async fetchSaveSiteRiskMsrList(params) {
      try {
          const res = await siteRiskFactorRegulationService.saveSiteRiskMsrList(params);

      this.$patch({
      });

      return res;

      } catch (err) {
      console.log(
          "siteRiskFactorRegulationStore > fetchSaveSiteRiskMsrList > error : ",
          err
      );

      throw err;
      }
    },


    },
  }
);
