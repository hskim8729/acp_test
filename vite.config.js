// import { fileURLToPath, URL } from 'url';

import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import { manualChunksPlugin } from "vite-plugin-webpackchunkname";

// eslint-disable-next-line no-unused-vars
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },

    plugins: [vue(), manualChunksPlugin()],

    resolve: {
      alias: [
        // { '@': fileURLToPath(new URL('./src', import.meta.url)), },
        { find: "@", replacement: "/src" }, // './src'로 바꾸면 에러남
      ],
    },
    server: {
      // host: 'localhost', // default
      port: 4000,
      proxy: {
        "/api-cmm": {
          // target: 'http://10.244.5.69:8080', // taeyeon 서버
          // target: 'http://10.244.5.69:8090', // hyeon 서버
          // target: 'http://localhost:8080', // easyit-cmm app
          target: "http://localhost:8080", // easyit-cmm app
          // target: 'https://cmm.dev.neis.asianaidt.com', // dev server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-cmm/, ""),
        },

        "/api-bsc": {
          // target: 'http://10.244.5.69:18080', // taeyeon server
          target: "http://localhost:18080", // easyit-bsc app
          //target: 'https://bsc.dev.neis.asianaidt.com', // dev server
          // target: env.VITE_APP_EASYIT_API_BSC_URL, // dev server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-bsc/, ""),
        },
        "/api-rpt": {
          target: "http://localhost:28080", // easyit-bsc app
          // target: 'https://rpt.dev.neis.asianaidt.com', // dev server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-rpt/, ""),
        },
        "/api-slm": {
          target: "http://localhost:38080", // easyit-bsc app
          //target: 'http://10.244.6.167:38080', // easyit-bsc app
          //target: 'https://slm.dev.neis.asianaidt.com', // dev server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-slm/, ""),
        },
        "/api-scm": {
          target: "http://localhost:58080", // easyit-bsc app
          //target: 'http://10.244.6.167:38080', // easyit-bsc app
          //target: 'https://slm.dev.neis.asianaidt.com', // dev server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-scm/, ""),
        },
      },
    },

    build: {
      // build 시 모든 console.log 제거
      // production일때만 console.log, debugger 제거
      // terser를 사용하려면 terser 라이브러리를 D옵션으로 설치해야 함
      minify: "terser", // boolean | 'terser' | 'esbuild'
      terserOptions: {
        compress: {
          drop_console: mode === "production" ? true : false,
          drop_debugger: mode === "production" ? true : false,
        },
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          additionalData: (content) => {
            // Use loader context to determine file type and add a timestamp query param
            const timestamp = new Date().getTime();
            return `@import "${content}?v=${timestamp}";`;
          },
        },
      },
    },
  };
});
