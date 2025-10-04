import { ElMessage } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default {
  install: (app, options) => {
    console.log("装载插件");
    app.config.globalProperties.$message = ElMessage;
    //注册所有图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    // 定义组件
    // app.component('my-banner', MyBanner);
    //定义插件
    //app.directive("font-size", (el, binding, vnode) => {})
    // 提供全局是方法
    // const clickMe = () => {
    //     console.log("==========clickMe=========")
    // }
    // app.provide('clickMe', clickMe);
    // 使用 import {inject} from "vue";
    // export default {
    //     name: "MyBanner",
    //     mounted() {
    //         const clickMe = inject('clickMe');
    //         clickMe();
    //     }
    // }
  },
};
