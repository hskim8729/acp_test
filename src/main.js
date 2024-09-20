import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import VueDOMPurifyHTML from "vue-dompurify-html";
import VueApexCharts from "vue3-apexcharts";

// var mitt = require('mitt')

// Main UI framework
// --- Element UI for vue3 ---
import ElementPlus from "element-plus";

import App from "./App.vue";
import router from "./router";

import compButton from "@/components/button/compButton.vue";
import alertDialog from "@/components/dialog/alertDialog.vue";
import confirmDialog from "@/components/dialog/confirmDialog.vue";
import loadingDialog from "@/components/dialog/loadingDialog.vue";
import compInput from "@/components/input/compInput.vue";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader

//Design CSS- rim
import "@/assets/css/style.css";
import "@/assets/scss/dialog.scss";
//import 'element-plus/dist/index.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// const emitter = mitt();//emitte
const app = createApp(App);

// // Vuetify
import { vuetify } from "./plugins/vuetify";

//emitter
// app.config.globalProperties.emitter = emitter;

app
  .use(pinia) // store
  .use(router)
  .use(ElementPlus) // Element UI
  //.use(useMobileDetection); // mobileDetection
  .use(VueApexCharts)
  .use(vuetify)
  .use(VueDOMPurifyHTML) // v-html 사용시 크로스사이트 스크립팅 방지

  .component("compButton", compButton) // button component
  .component("compInput", compInput) // input component
  .component("alertDialog", alertDialog) // alert message component
  .component("confirmDialog", confirmDialog) // confirm message component
  .component("loadingDialog", loadingDialog); // loading progress component

app.mount("#app");
