import { defineStore } from "pinia";
import fileService from "@/api/common/file-service";

export const useFileStore = defineStore("fileStore", {
  id: "file",

  state: () => ({}),

  getters: {},

  actions: {
    // 파일다운로드
    async fileDownload(params) {
      try {
        const res = await fileService.fileDownload(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log("FileStore > fileDownload > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 파일 삭제
    async removeFile(params) {
      try {
        const res = await fileService.removeFile(params);
        // 결과 리턴
        return res;
      } catch (err) {
        console.log("FileStore > removeFile > error : ", err);
        // 에러 리턴
        throw err;
      }
    },

    // 첨부파일 목록 조회
    async fetchAtchFileList(params) {
      try {
        const res = await fileService.retrieveAtchFileList(params);

        // 결과 리턴
        return res.data;
      } catch (err) {
        console.log("FileStore > fetchAtchFileList > error : ", err);
        // 에러 리턴
        throw err;
      }
    },
  },
  // 해당 스토어에 piniaPluginPersistedstate 기능 활성화
  // persist: true, // localStorage
  // persist: {
  //   storage: sessionStorage,
  // },
});
