import axios from "axios";
import { setApiInterceptors } from "./common/api-interceptors";

// ======= tapp api start =======

// tapp main local 모듈 API
function createAxiosApiDev() {
  const axiosApiDev = axios.create({
    baseURL: import.meta.env.VITE_APP_API_DEV_URL,
  });

  return setApiInterceptors(axiosApiDev);
}
const axiosApiDEV = createAxiosApiDev();

// tapp main server 모듈 API
function createAxiosApiTapp() {
  const axiosApiTapp = axios.create({
    baseURL: import.meta.env.VITE_APP_API_TAPP_URL,
  });

  return setApiInterceptors(axiosApiTapp);
}
const axiosApiTAPP = createAxiosApiTapp();

// AI 위험성평가 모듈 API
function createAxiosApiAI() {
  const axiosApiAI = axios.create({
    baseURL: import.meta.env.VITE_APP_API_DEV_URL,
  });

  return setApiInterceptors(axiosApiAI);
}
const axiosApiAI = createAxiosApiAI();

const axiosApi = axiosApiDEV;

// api export
export { axiosApi, axiosApiAI, axiosApiDEV, axiosApiTAPP };
