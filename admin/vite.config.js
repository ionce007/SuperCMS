import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import copy from "rollup-plugin-copy"; 
import legacy from "@vitejs/plugin-legacy"; 
import VueSetupExtend from "vite-plugin-vue-setup-extend"; //支持vue3的name属性
import AutoImport from "unplugin-auto-import/vite"; //按需导入
import Components from "unplugin-vue-components/vite"; //按需组件引入
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; //按需引入
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //vueDevTools(),
    svgLoader(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    copy({
      targets: [
        { src: "src/assets", dest: "dist/assets" },
        { src: "src/favicon.ico", dest: "dist" },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 300,
    cssCodeSplit: true,
    target: ["es2015"],
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: `assets/[ext]/[name].[ext]`,
      }
    },
  },
  base: "./",
  lintOnSave: true,
  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:81/api", // api接口代理,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/public": {
        target: "http://localhost:81/public", // 上传图片代理,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, ""),
      },
    },
    hmr: {
      overlay: false,
    }
  },
});
