/*
  COPYRIGHT© ASIANA IDT INC. ALL RIGHTS RESERVED
*/
import { useDialogStore } from "@/stores/common/dialog-store";
const dialogStore = useDialogStore();

/** 특수문자 이스케이프 */
const escapeSpecialChars = (userInput) => {
  const escapeSpecialCharsDic = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    "=": "&#x3D;",
    "/": "&#x2F;",
  };

  Object.keys(escapeSpecialCharsDic).forEach((key) => {
    userInput = userInput.replaceAll(key, escapeSpecialCharsDic[key]);
  });

  return userInput;
};

/** 특수문자 이스케이프 원복 */
const revertEscapeSpecialChars = (userInput) => {
  const escapeSpecialCharsDic = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    "=": "&#x3D;",
    "/": "&#x2F;",
    "&": "&amp;",
  };

  Object.keys(escapeSpecialCharsDic).forEach((key) => {
    userInput = userInput.replaceAll(escapeSpecialCharsDic[key], key);
  });

  return userInput;
};

/* injection 방지 */
const preventInjection = (userInput) => {
  // script injection 방지
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (scriptRegex.test(userInput.trim())) {
    dialogStore.openAlertDialog(`script는 입력할 수 없습니다.`, {
      type: "error",
    });
    return false;
  }

  // HTML injection 방지
  const htmlRegex = /<[^>]*>/g;
  if (htmlRegex.test(userInput.trim())) {
    dialogStore.openAlertDialog(`HTML은 입력할 수 없습니다.`, {
      type: "error",
    });
    return false;
  }

  // SQL injection 방지
  const sqlRegex =
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|TRUNCATE|EXEC|UNION|OR)\b/i;
  if (sqlRegex.test(userInput.trim())) {
    dialogStore.openAlertDialog(`SQL은 입력할 수 없습니다.`, {
      type: "error",
    });
    return false;
  }

  return true;
};

export { escapeSpecialChars, preventInjection, revertEscapeSpecialChars };
