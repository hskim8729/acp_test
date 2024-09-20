import { axiosApiDEV } from "@/api";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import commonService from "@/api/common-service.js";
import aiRiskEvalService from "@/api/services/aiRiskEval/ai-risk-eval-service.js";
import { useLoginAuthStore } from "@/stores/common/login-auth-store";

export default {
  /**
   * url호출 시 파라미터 정보를 가진 객체를 쿼리 스트링으로 변환하는 함수
   * @param {*} obj 객체
   * @returns
   */
  makeQueryString(obj = {}) {
    // queryString 생성
    const str = Object.keys(obj)
      // value가 존재 or 0인 경우도 qstr에 포함
      .filter((key) => !!obj[key] || obj[key] === 0)
      .map((key) => {
        return `${key}=${encodeURIComponent(obj[key])}`;
      })
      .join("&");

    const queryStr = str.length > 0 ? "?" + str : str;
    // console.log('=== common-utils.makeQueryString => ' + queryStr);

    return queryStr;
  },
  // ------- row 관련 이벤트 -------
  // 배열에서 특정 key값을 가지는 row의 index 찾기
  findRowIndex(arr, key, val) {
    return arr.findIndex((item) => item[key] === val);
  },
  // 페이지내 몇번째 row에 대한 row index를 취득
  getRowIndexInPage(rowNum, pageNo = 1, pageSize = 10) {
    console.log("rowNum, pageNo, pageSize : ", rowNum, pageNo, pageSize);
    // num : 1 ~ pageSize
    if (rowNum < 1) rowNum = 1;
    if (rowNum > pageSize) rowNum = pageSize;

    const rowIndex = pageNo * pageSize - pageSize + (rowNum - 1);
    return rowIndex;
  },

  // ------- file upload/download 처리 ------
  // 파일 업로드는 한 개의 파일만 업로드 가능,
  //   n개의 파일을 업로드 하기 위해서는 이 함수를 n번 호출
  //   한번에 처리하려면 아래의 FormData에 file을 n개 추가하고
  //   서버쪽에서도 n개를 처리하도록 수정해야 함.
  // 엑셀업로드도 파일업로드로 처리
  async $upload(url, file) {
    // console.log('=======>>>> common-utils.js > $upload : ', url, file);
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosApiDEV
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        // console.error(e);
        return Promise.reject(e);
      });
    // console.log('=======>>>> common-utils.js > res : ', res);

    return res;
  },

  async $download(url, filename) {
    // console.log('=======>>>> common-utils.js > $download : ', url, filename);
    const f = await axiosApiDEV.get(url, {
      responseType: "blob",
    });
    saveAs(new Blob([f.data]), `${filename}`);
  },

  // 단순 테이블 형태의 테이블에 대한 엑셀 출력
  // 대량의 데이터를 처리할때는 xlsx보다 낫다는 평이 있음
  // 실제 적용시 commonUtils로 이동 예정
  async $excelFromTableData(header = [], rows = [], fileName, option = {}) {
    // console.log(
    //   '=======>>>> common-utils.js > $ExcelFromTable : ',
    //   header,
    //   rows,
    //   fileName,
    //   option,
    // );
    header = header.filter((h) => h.title && h.key);
    // https://github.com/exceljs/exceljs#tables
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(); // name,{pageSetup:https://github.com/exceljs/exceljs#page-setup}
    ws.addTable({
      name: "tableName",
      ref: "A1",
      headerRow: true,
      // style: { theme: 'TableStyleDark3', showRowStripes: true },
      columns: header.map((h) => ({
        name: h.title,
      })), // width 설정가능, total함수 가능
      rows: rows.map((r) => header.map((h) => r[h.key])),
      ...option,
    });

    saveAs(new Blob([await wb.xlsx.writeBuffer()]), `${fileName}.xlsx`);
  },

  checkFileInfo(files) {
    const canFileTypeArray = [
      "GIF",
      "JPEG",
      "JPG",
      "PNG",
      "PDF",
      "DOC",
      "DOCX",
      "XLS",
      "XLSX",
      "TXT",
      "PPT",
      "PPTX",
      "HWP",
      // 'BLOB',
      "ZIP",
      "EML",
    ];
    // 파일 확장자 체크 처리
    const fileName = files[0].name;
    // const fileLen = fileName.length;
    const DotIdx = fileName.lastIndexOf(".");
    const fileExt = fileName.substring(DotIdx + 1);

    // console.log('=====>>> fileExts : ', fileExt);
    if (!fileExt || fileExt.toUpperCase() === "EXE") {
      alert("파일확장자가 없거나 exe인 파일은 업로드할 수 없습니다.");
      return false;
    }

    const findIdx = canFileTypeArray.findIndex(
      (item) => item === fileExt.toUpperCase()
    );

    if (findIdx === -1) {
      alert("허용된 확장자 타입이 아닙니다.");
      return false;
    }

    // 파일 사이즈 체크 처리
    const fileSize = files[0].size; // byte 단위
    console.log("upload File size : ", fileSize);
    // 20MB : 20971520
    const fileSizeLimit = import.meta.env.VITE_APP_FILE_SIZE_LIMIT || 20971520;

    if (fileSize >= fileSizeLimit) {
      alert("파일용량은 20MB를 초과할 수 없습니다.");
      return false;
    }

    return true;
  },

  // convert list to Tree structure
  mapList2Tree(dataList, key, parentKey, startLevel = 1) {
    // 3레벨로 고정된 트리 구조를 전제
    // 자신의 key와 부모키의 연결고리가 정확해야 함
    // 자식이 존재하면 자신의 children으로 재배치 처리
    if (startLevel > 1) {
      // 2레벨부터 시작인 경우 해당 건의 임시 부모키를 생성하고 '' 처리
      dataList = dataList.map((item) => {
        return {
          [parentKey + "Temp"]: item.categoryPhase === 2 ? "" : item[parentKey],
          ...item,
        };
      });
    }

    let hashTable = Object.create(null);

    dataList.forEach(
      (item) => (hashTable[item[key]] = { ...item, children: [] })
    );

    let treeData = [];
    // 시작레벨이 1이면 기존 부모키, 아니면 임시 부모키를 사용
    parentKey = startLevel === 1 ? parentKey : parentKey + "Temp";
    dataList.forEach((item) => {
      if (item[parentKey]) {
        // 부모 키 값이 존재하면
        hashTable[item[parentKey]]?.children.push(hashTable[item[key]]);
      } else {
        treeData.push(hashTable[item[key]]);
      }
    });

    // console.log('@@@@@@@@@==> treeData : ', treeData);
    return treeData;
  },

  // 동적 rowspan을 처리하기 위한 배열 변환
  map2RowSpanData(arrObjOrg, objKey) {
    // objKey 기준 중복 제거
    const arrObj = arrObjOrg.reduce(function (acc, cur) {
      if (acc.findIndex((item) => item[objKey] === cur[objKey]) === -1) {
        acc.push(cur);
      }
      return acc;
    }, []);

    // 중복제거 배열을 기준, rowSpan 수치를 갖는 새로운 배열 생성
    let arrObjResult = [];
    arrObj.forEach((item) => {
      const arrObjByKey = arrObjOrg.filter((e) => e[objKey] === item[objKey]);
      const rowCount = arrObjByKey.length;

      arrObjByKey.forEach((item2) => {
        if (JSON.stringify(item2) === JSON.stringify(item)) {
          item2._rSpanCnt = rowCount;
        } else {
          item2._rSpanCnt = 0;
        }
      });
      arrObjResult.push(...arrObjByKey);
    });
    // console.log('arrObjResult : ', arrObjResult);
    return arrObjResult;
  },

  getCodeName(codeList, codeVal, codeKey = "value") {
    if (!codeList.length) return codeVal;
    if (!codeVal) return codeVal;

    // 코드리스트의 해당 코드에 대한 코드명 리턴
    const codeItem = codeList.find((item) => item[codeKey] === codeVal);

    // 코드명이 없다면 코드를 리턴
    return codeItem ? codeItem.label : codeVal;
  },

  /**
   * url 검증 함수
   * @param {*} url String
   * @returns
   */
  checkUrl(strUrl) {
    // 웹사이트 체크 검증 함수
    const expUrl = /^http[s]?:\/\//i;
    // const expUrl = /(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi;
    return expUrl.test(strUrl);
  },

  // 이메일 주소 한글 입력 방지
  async validEmail(e) {
    const regExp = /[ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g;

    if (regExp.test(e.target.value)) {
      e.target.value = e.target.value.replace(regExp, "");
    }
    return e.target.value;
  },

  /**
   * email 주소 체크 함수
   * @param {*} email 주소 String
   * @returns
   */
  checkEmail(e) {
    // 이메일 주소 검증
    const re =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,63}$/;

    if (!re.test(String(e.target.value).toLowerCase())) {
      e.target.nextElementSibling.classList.add("notice");
      e.target.nextElementSibling.style.display = "block";
      if (e.target.classList.contains("btn_input")) {
        e.target.nextElementSibling.style.right = "130px";
      }
      e.target.nextElementSibling.innerHTML = "이메일 형식에 맞게 입력하세요.";
    } else {
      e.target.nextElementSibling.classList.remove("notice");
      e.target.nextElementSibling.style.display = "none";
      e.target.nextElementSibling.innerHTML = "";
    }
    return e.target.value;
  },

  /**
   * 숫자 체크 함수
   * @param {*} text 숫자
   * @returns
   */

  // checkNumber(num) {
  //   // 숫자 검증
  //   const re = /^[0-9]+$/;

  //   return re.test(num);
  // },

  /**
   * 사업자 번호, 휴대폰 번호 정규식 함수
   * @param {*} text 숫자
   * @returns
   */
  async regexType(e, type) {
    const regex = /[^0-9]/g;

    if (regex.test(e.target.value)) {
      e.target.value = e.target.value.replace(regex, "");
    }
    if (type === "busNo") {
      e.target.value = e.target.value
        .replace(/^(\d{0,3})(\d{0,2})(\d{0,5})$/g, "$1-$2-$3")
        .replace(/(\-{1,2})$/g, "");
    } else if (type === "localTelNo") {
      if (
        e.target.value.length > 10 &&
        e.target.value.substring(0, 2) === "02"
      ) {
        alert("유효하지 않은 전화번호 입니다.");
        e.target.value = "";
      } else if (
        e.target.value.length > 10 &&
        e.target.value.substring(0, 3) !== "010" &&
        e.target.value.substring(0, 4) !== "0504" &&
        e.target.value.substring(0, 4) !== "0505" &&
        e.target.value.substring(0, 1) !== "0"
      ) {
        alert("유효하지 않은 전화번호 입니다.");
        e.target.value = "";
      } else {
        e.target.value = e.target.value
          .replace(/(^02|^0504|^0505|^0\d{2})(\d+)?(\d{4})$/, "$1-$2-$3")
          .replace(/(\-{1,2})$/g, "");
      }
    } else {
      e.target.value = e.target.value
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
        .replace(/(\-{1,2})$/g, "");
    }

    return e.target.value;
  },

  /**
   * 숫자만 입력
   * @param {*} text 숫자
   * @returns
   */
  regexTypeNumber(e) {
    const regex = /[^0-9]/g;

    if (regex.test(e.target.value)) {
      e.target.value = e.target.value.replace(regex, "");
    }

    return e.target.value;
  },

  /**
   * 사업자 번호 입력 시 10자리까지 다 입력하면 자동 검수
   * @param {*} text 숫자
   * @returns
   */
  async $chkBusNo(e) {
    let isValidBusNo = false;
    var menuUrl = "/v1/common/isValidBusNo";
    //const handleBlur = (e) => e.preventDefault() // 이벤트 전파 막음
    const busNo = e.target.value.replaceAll("-", "");
    const params = {
      busNo: busNo,
    };
    if (e.target.value.length != e.target.maxLength) {
      e.target.nextElementSibling.classList.add("notice");
      e.target.nextElementSibling.style.display = "block";
      e.target.nextElementSibling.innerHTML =
        "사업자 번호를 정확히 입력하세요.";
    } else {
      const f = await axiosApiDEV
        .post(menuUrl, JSON.stringify(params))
        .catch((e) => {
          return Promise.reject(e);
        });

      if (f.data) isValidBusNo = true;
      if (!isValidBusNo) {
        e.target.nextElementSibling.classList.add("notice");
        e.target.nextElementSibling.style.display = "block";
        e.target.nextElementSibling.innerHTML =
          "이미 등록된 사업자 번호입니다.";
      } else {
        e.target.nextElementSibling.classList.remove("notice");
        e.target.nextElementSibling.style.display = "none";
        e.target.nextElementSibling.innerHTML = "";
      }

      var valueMap = e.target.value
        .replace(/-/gi, "")
        .split("")
        .map(function (item) {
          return parseInt(item, 10);
        });

      if (valueMap.length == 10) {
        var keyArr = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
        var chkSum = 0;

        for (var i = 0; i < keyArr.length; ++i) {
          chkSum += keyArr[i] * valueMap[i];
        }

        chkSum += parseInt((keyArr[8] * valueMap[8]) / 10, 10);
        if (Math.floor(valueMap[9]) === (10 - (chkSum % 10)) % 10) {
        } else {
          e.target.nextElementSibling.classList.add("notice");
          e.target.nextElementSibling.style.display = "block";
          e.target.nextElementSibling.innerHTML =
            "유효하지 않은 사업자 번호입니다.";
        }
      }
    }
  },
  /**
   * 이미 등록된 사업자번호 체크
   * @param {*} busno
   * @returns
   */
  async chkDuplicatedBusNo(busno) {
    let isUnique = false;

    const params = {
      busNo: busno,
    };

    const res = await commonService.axiosCall(
      "/v1/common/isValidBusNo",
      params
    );

    if (res.data) isUnique = true;

    return isUnique;
  },
  /**
   * 휴대전화 번호 11자리까지 다 입력하면 자동 검수
   * @param {*} text 숫자
   * @returns
   */
  async chkCrryTelNo(e) {
    if (e.target.value.length != e.target.maxLength) {
      e.target.nextElementSibling.classList.add("notice");
      e.target.nextElementSibling.style.display = "block";
      e.target.nextElementSibling.style.right = "130px";
      e.target.nextElementSibling.innerHTML =
        "휴대전화 번호를 정확히 입력하세요.";
      //e.target.focus();
    }
  },

  // --- 숫자 입력 및 콤마 처리 ---
  /**
   * 숫자에 콤마 추가
   * @param {*} 숫자 String
   * @returns
   */
  comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  },

  /**
   * 숫자에서 콤마 제거
   * @param {*} 숫자 String
   * @returns
   */
  unComma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  },

  // 콤마, 숫자 입력
  async onInputCommaNum(event) {
    const regex = /[^0-9]/g;

    if (regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(regex, "");
    }

    event.target.value = event.target.value.replace(
      /(\d)(?=(?:\d{3})+(?!\d))/g,
      "$1,"
    );

    // if(event.target.value < 1) {
    //     alert("최소 입력해 주십시오.");
    //     event.target.value = "";
    // }else{
    //   event.target.value = event.target.value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    // }

    return event.target.value;
  },

  /**
   * 금액 포맷 처리 함수
   * @param {*} amount 금액
   * @param {*} format 적용 포맷
   * @returns
   */
  convertNumberFormat(amount, format) {
    let currencyUnit = "";
    let lastUnit = "";

    if (format.substring(0, 1) !== "#") {
      currencyUnit = format.substring(0, 1);
    }

    if (format.slice(-1) !== "#" && format.slice(-1) !== "0") {
      lastUnit = format.slice(-1);
    }

    let groupingSeparator = "";
    let maxFractionDigits = 0;
    let decimalSeparator = "";

    if (format.indexOf(".") === -1) {
      groupingSeparator = ",";
    } else if (format.indexOf(",") === -1) {
      groupingSeparator = ".";
    } else if (format.indexOf(",") < format.indexOf(".")) {
      groupingSeparator = ",";
      decimalSeparator = ".";
      maxFractionDigits = format.length - format.indexOf(".") - 1;
    } else {
      groupingSeparator = ".";
      decimalSeparator = ",";
      maxFractionDigits = format.length - format.indexOf(",") - 1;
    }

    let sign = "";
    let dec = 1;
    for (let i = 0; i < maxFractionDigits; i++) {
      dec = dec * 10;
    }

    let v = String(Math.round(parseFloat(amount) * dec) / dec);

    if (v.startsWith("-")) {
      sign = "-";
      v = v.substring(1);
    }

    if (maxFractionDigits > 0 && format.substring(format.length - 1) === "0") {
      v = String(parseFloat(v).toFixed(maxFractionDigits));
    }

    let d = "";

    if (maxFractionDigits > 0 && v.indexOf(".") > -1) {
      d = v.substring(v.indexOf("."));
      d = d.replace(".", decimalSeparator);
      v = v.substring(0, v.indexOf("."));
    }

    const r = /(\d+)(\d{3})/;

    while (r.test(v)) {
      v = v.replace(r, "$1" + groupingSeparator + "$2");
    }
    return sign + currencyUnit + String(v) + String(d) + lastUnit;
  },

  error(message = "메세지를 입력해주세요", type = "error", title = "") {
    ElMessageBox.alert(message, title, {
      type: type,
      confirmButtonText: "확인",
    }).catch(() => {});
  },

  alert(
    message = "메세지를 입력해주세요",
    type = "info",
    duration = 3000,
    offset = 20
  ) {
    ElMessage({
      message: message,
      type: type,
      center: true,
      duration: duration,
      offset: offset,
    });
  },

  async confirm(
    message = "메세지를 입력해주세요",
    type = "warning",
    title = "",
    options = {}
  ) {
    return new Promise((resolve, reject) => {
      ElMessageBox.confirm(message, title, {
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        showCancelButton: true,
        type: type,
        ...options,
      })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  },

  // 빈값, 빈객체, 빈리스트 값 체크
  nullCheck(value) {
    let isNull = false;
    if (
      value == "" ||
      value == null ||
      value == undefined ||
      (value != null && typeof value == "object" && !Object.keys(value).length)
    ) {
      isNull = true;
    } else {
      isNull = false;
    }
    return isNull;
  },

  // datetype으로 변환
  formatDate(date) {
    if (dayjs(date).isValid()) {
      return this.stringToPicker(dayjs(date).format("YYYYMMDD"));
    } else {
      return null;
    }
  },

  // string 타입으로 변환
  convertDate(date) {
    if (dayjs(date).isValid()) {
      return dayjs(date).format("YYYYMMDD");
    } else {
      return "";
    }
  },

  // 문자열을 datapicker 형식으로 변환
  stringToPicker(value) {
    if (value.length == 8) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6) - 1;
      const day = value.substring(6, 8);

      return new Date(year, month, day);
    }
  },

  // datapicker를 string 형식으로 변환
  pickerToString(value) {
    if (value instanceof Date) {
      let fyear = value.getFullYear();
      let fmonth = (value.getMonth() + 1).toString().padStart(2, "0");
      let fday = value.getDate().toString().padStart(2, "0");

      return fyear + fmonth + fday;
    }
  },

  // datapicker를 월 string 형식으로 변환
  pickerToStringMonth(value) {
    if (value instanceof Date) {
      let fyear = value.getFullYear();
      let fmonth = (value.getMonth() + 1).toString().padStart(2, "0");

      return fyear + fmonth;
    }
  },

  // 현재 메뉴의 쓰기 권한 확인
  $hasWritePermission(currentMenuId, menuInfo) {
    const getCurrentMenu = menuInfo.find(
      (item) => item.menuId === currentMenuId && item.wrtYn === "Y"
    );

    return !!getCurrentMenu;
  },

  // 사업자번호 유효성 체크
  isCheckBusNo(busNo) {
    const regex = /[^0-9]/g;

    if (busNo.replaceAll("-", "").length != 10 || regex.test(Number(busNo))) {
      alert(`사업자번호 [${busNo}]를 정확히 입력하세요.`);
      return false;
    }

    // 사업자번호 : 청,서코드(3) + 개인/법인 구분코드(2) + 일련번호(4) + 검증번호 (1)
    var valueMap = busNo
      .replace(/-/gi, "")
      .split("")
      .map(function (item) {
        return parseInt(item, 10);
      });

    var keyArr = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
    var chkSum = 0;

    for (var i = 0; i < keyArr.length; ++i) {
      chkSum += keyArr[i] * valueMap[i];
    }

    chkSum += parseInt((keyArr[8] * valueMap[8]) / 10, 10);

    if (!(Math.floor(valueMap[9]) === (10 - (chkSum % 10)) % 10)) {
      alert(`[${busNo}]는 유효하지 않은 사업자 번호입니다.`);
      return false;
    }

    return true;
  },

  // 숫자를 입력받아 만단위로 표시
  // ex) numberToKorean(12345000) => 1234만5000
  numberToKorean(number) {
    var inputNumber = number < 0 ? false : number;
    var unitWords = ["", "만", "억", "조", "경"];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = "";

    for (var i = 0; i < splitCount; i++) {
      var unitResult =
        (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }

    for (var i = 0; i < resultArray.length; i++) {
      if (!resultArray[i]) continue;
      resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }

    return resultString || "0";
  },
  // 금액을 입력받아 부가세, 부가세 포함한 총금액을 리턴
  // ex) getAmt(1000, "vat") => 100 / getAmt(1000, "total") => 1100
  getAmt(amt, type) {
    if (type === "vat") {
      amt = amt * 0.1;
    } else if (type === "total") {
      amt = amt + amt * 0.1;
    }

    return this.comma(amt);
  },
  // 멤버쉽을 텍스트로 출력
  getPayInfoNmKor(payInfoDc) {
    switch (payInfoDc) {
      case "TRIAL":
        return "트라이얼";
      case "STANDARD":
        return "스탠다드";
      case "PREMIUM":
        return "프리미엄";
      case "CUSTOM":
        return "커스텀";
      default:
        return "";
    }
  },
  // 오늘 날짜와 받은 날짜의 차이 리턴
  // type = "second", "minute", "hour", "day", "week", "month", "quarter", "year"
  getDateDiff(paramDate, type = "day") {
    let today = dayjs();
    let diffDay = 0;

    // 날짜 계산은 오늘날짜 00시로 계산
    if (!["second", "minute", "hour"].includes(type)) {
      today = today.startOf("day");
    }

    if (paramDate) {
      let date = dayjs(paramDate);
      diffDay = date.diff(today, type);
    }

    return diffDay;
  },

  removeNumbering(str = "") {
    const match = str.match(/^\d+(\.\d+)?\./);
    if (match) {
      return str.slice(match[0].length).trim();
    }
    return str;
  },

  /**
   * 특정 데이터 타입에 대한 패턴, 유효성 검사기, 포맷터를 반환하는 함수
   * @param {string} type - 검사하려는 데이터의 유형 (예: "email", "telno", "busno").
   * @returns {Object} 패턴, 유효성 검사기, 포맷터가 포함된 객체를 반환합니다.
   *                   - pattern: 해당 데이터 유형에 대한 정규식 패턴.
   *                   - validator: 입력 값을 검사하는 함수. 유효하면 true, 유효하지 않으면 오류 메시지 반환.
   *                   - formatter: 입력 값을 특정 형식으로 변환하는 함수.
   */
  getPatterns(type = "") {
    switch (type) {
      // 이메일 형식 체크
      case "email":
        return {
          // 이메일에 대한 정규식 패턴
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          // 이메일 유효성 검사 함수. 유효하지 않으면 오류 메시지 반환.
          validator: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
            "이메일 형식을 확인하세요.",
          // 이메일 포맷터. 이메일은 특별한 포맷팅이 필요 없으므로 그대로 반환.
          formatter: (value) => value,
        };

      // 전화번호 형식 체크
      case "telno":
        return {
          // 한국 전화번호에 대한 정규식 패턴 (010, 02, 031 등 포함)
          pattern:
            /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/,
          // 전화번호 유효성 검사 함수. 유효하지 않으면 오류 메시지 반환.
          validator: (value) =>
            /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/.test(
              value
            ) || "전화번호 형식을 확인하세요.",
          // 전화번호 포맷터. 입력된 전화번호에서 하이픈(-)을 제거하고 다시 올바른 형식으로 삽입.
          formatter: (value) => {
            if (!value) return ""; // 값이 없을 경우 빈 문자열 반환
            // 모든 하이픈(-) 제거
            value = value.replace(/-/g, "");
            // 서울 지역번호(02)로 시작하는 경우와 그 외의 경우로 나누어 포맷팅
            if (value.startsWith("02")) {
              // 서울 번호는 9자리 또는 10자리 가능
              return value.length === 9
                ? value.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3")
                : value.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
            } else {
              // 그 외 번호는 10자리 또는 11자리 가능
              return value.length === 11
                ? value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
                : value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            }
          },
        };

      // 사업자 번호 형식 체크
      case "busno":
        return {
          // 한국 사업자 등록번호에 대한 정규식 패턴
          pattern: /^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$/,
          // 사업자 번호 유효성 검사 함수. 사업자 번호가 유효하지 않으면 오류 메시지 반환.
          validator: (value) => {
            // 모든 하이픈(-) 제거
            const replaceValue = value.replace(/-/gi, "");
            // 사업자 번호는 10자리여야 함
            if (replaceValue.length !== 10) {
              return "사업자 번호는 10자리여야 합니다.";
            }
            // 사업자 번호의 각 자리수를 배열로 변환
            const valueMap = replaceValue
              .split("")
              .map((item) => parseInt(item, 10));
            // 사업자 번호 유효성 검증을 위한 가중치 배열
            const keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
            let chkSum = 0;
            // 가중치와 각 자리수를 곱한 값을 합산
            for (let i = 0; i < keyArr.length; ++i) {
              chkSum += keyArr[i] * valueMap[i];
            }
            // 마지막 자리 숫자에 대한 특별 계산
            chkSum += parseInt((keyArr[8] * valueMap[8]) / 10, 10);
            // 최종 계산 후, 유효한 사업자 번호인지 확인
            return (
              Math.floor(valueMap[9]) === (10 - (chkSum % 10)) % 10 ||
              "유효하지 않은 사업자 번호입니다."
            );
          },

          // 사업자 번호 포맷터. 입력된 번호에서 하이픈(-)을 제거하고 다시 올바른 형식으로 삽입.
          formatter: (value) => {
            if (!value) return ""; // 값이 없을 경우 빈 문자열 반환
            // 모든 하이픈(-) 제거
            value = value.replace(/-/g, "");
            // 사업자 번호 포맷팅 (###-##-#####)
            return value.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
          },
        };

      // 날짜 형식 체크 및 포맷팅
      case "date":
        return {
          // YYYYMMDD 형태의 날짜만 허용하는 정규식 패턴
          pattern: /^\d{4}\d{2}\d{2}$/,
          // 날짜 유효성 검사 함수. 날짜가 올바른 형식이면 true 반환, 아니면 오류 메시지 반환.
          validator: (value) =>
            /^\d{4}\d{2}\d{2}$/.test(value) ||
            "날짜 형식이 잘못되었습니다. YYYYMMDD 형식을 사용하세요.",
          // 날짜 포맷터. YYYYMMDD 형식의 날짜를 YYYY-MM-DD 형식으로 변환.
          formatter: (value) => {
            const result = dayjs(value).format("YYYY-MM-DD");
            return result;
          },
          parser: (value) => {
            const result = dayjs(value).format("YYYYMMDD");
            return result;
          },
        };

      // 기본 형식 체크 (특정 타입이 지정되지 않은 경우)
      default:
        return {
          // 모든 값 허용 (기본 패턴)
          pattern: /.*/,
          // 항상 유효한 값으로 간주
          validator: () => true,
          // 특별한 포맷팅 없이 입력 값을 그대로 반환
          formatter: (value) => value,
        };
    }
  },
};

// ------- AI 로그인 관련 -------
export function useAiLogin() {
  const loginStore = useLoginAuthStore();
  const aiUserInfo = { userToken: null };

  /** 로그인 정보 전송 */
  const sendLoginInfo = async () => {
    const params = getAiSessionParam();

    await aiRiskEvalService
      .axiosCallAI("/v1/chat/loginAiRisk", params)
      .then((res) => {
        const { data } = res;
        const conversationIdVal = data.dta.conversation_id;

        if (data.access_token) {
          userLogin(data);
        } else {
          alert("세션 생성 실패");
          return;
        }
      });
  };

  /** 로그인 파라미터 생성 */
  const getAiSessionParam = () => {
    const userInfo = loginStore.$state.userInfo;
    const apiParam = {
      username: import.meta.env.VITE_APP_API_AI_ID,
      password: import.meta.env.VITE_APP_API_AI_PW,
      client_id:
        import.meta.env.VITE_APP_ENV_FILE_NAME === "prod"
          ? userInfo.userId
          : "plan2do@asianaidt.com", // 서버 옮긴 후 userId로 변경
    };

    return apiParam;
  };

  /** 생성된 로그인 Token sessionStorage, store에 저장 */
  const userLogin = (data) => {
    sessionStorage.setItem("aiToken", data.access_token);
    sessionStorage.setItem("aiIsLogin", true);
    sessionStorage.setItem("aiConversationId", data.dta.conversation_id);
    //aiUserInfo.userToken = data.access_token;
  };

  return {
    sendLoginInfo,
  };
}
