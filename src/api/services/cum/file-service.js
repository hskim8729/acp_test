// eslint-disable-next-line no-unused-vars
import { axiosApiDEV } from '@/api';
import commonUtils from '@/utils/common-utils';

// ---------- 서비스단 개발 규칙 ---------------
// 서비스단은 vue단과 store에 호출되고 외부와 연결하는 인터페이스로서
// 대부분 결과나 에러를 bypass하는 역할을 하므로 return new Promise형태로
// 구현함, 필요 시 결과에 대한 변환 처리를 수행할 수 있음
export default {
  // ---------- 파일 업로드 -----------------------
  uploadFile(files) {
    return new Promise((resolve, reject) => {
      commonUtils
        .$upload(`/v1/cum/files/upload`, files[0])
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 파일 다운로드
  downloadFile(url, fileName) {
    // url은 화면에서 받아서 처리
    // console.log('fileService > downloadFile > url, fileName : ', url, fileName);
    return new Promise((resolve, reject) => {
      commonUtils
        .$download(url, fileName)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 파일 다운로드 Post 방식
  downloadFilePost(fileInfo) {
    // url은 화면에서 받아서 처리
    // console.log('fileService > downloadFile > url, fileName : ', url, fileName);
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .post(`/v1/cum/files/download`, fileInfo)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 업로드 파일 삭제
  deleteFile(serialId) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .delete(`/v1/cum/files/${serialId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // ---------- 이미지 업로드 -------------------
  uploadImage(file) {
    return new Promise((resolve, reject) => {
      commonUtils
        .$upload(`/v1/cum/files/upload`, file)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 이미지 삭제
  deleteImage(fileName) {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .delete(`/v1/cum/files/${fileName}`)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 파일 리스트 조회(샘플용)
  getFileList(queryStr = '') {
    return new Promise((resolve, reject) => {
      axiosApiDEV
        .get(`/v1/cum/files/${queryStr}`)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          // 에러 테스트
          // throw new Error('테스트 목적으로 에러 발생시킴!!!');
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 파일 다운로드(특정 파일명을 지정함)
  // 실제 화면단에서 url과 함계 넘어오므로 필요성이 없어서 추후 삭제 예정
  // getDownloadFile(queryStr = '') {
  //   return new Promise((resolve, reject) => {
  //     axiosApiDEV
  //       // .get(`/users${queryStr}`)
  //       .get(`/v1/cum/files/downloadFile${queryStr}`)
  //       // eslint-disable-next-line no-unused-vars
  //       .then((res) => {
  //         // 에러 테스트
  //         // throw new Error('테스트 목적으로 에러 발생시킴!!!');
  //         resolve(res);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // },
};
