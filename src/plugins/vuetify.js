import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// scss 적용
import "@/assets/scss/main.scss";

const grayScale = {
  // 그레이스케일
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7380",
  gray600: "#4C5663",
  gray700: "#384251",
  gray800: "#1F2937",
  gray900: "#111827",
  gray950: "#030711",
  black: "#000000",
  White: "#FFFFFF",
};

const payInfoColors = {
  // 구독 컬러
  "pay-info-trial": "#1f9699",
  "pay-info-standard": "#194f80",
  "pay-info-premium": "#671f82",
  "pay-info-custom": "#1a2e4a",
};

const lightTheme = {
  dark: false,
  colors: {
    "on-surface": "#030711",
    // class="text-error, bg-info_bg" 등으로 사용
    background: "#F1F6F8",
    "background-bl": "#bfd0db",
    error: "#FF3B30",
    error_bg: "#FFF2F2",
    warning: "#FF9500",
    warning_bg: "#FFF6EB",
    success: "#19A63C",
    success_bg: "#EDF9EF",
    info: "#0074F2",
    info_bg: "#EBF4FF",
    ...grayScale,
    ...payInfoColors,
  },
  variables: {
    "disabled-opacity": 0.5,
  },
};

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "lightTheme",
    variations: {
      colors: [],
      lighten: 5,
      darken: 5,
    },
    themes: {
      lightTheme,
    },
  },
});

export { vuetify };
