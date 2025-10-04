import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
// 你可以根据需要自定义 NProgress 的样式和行为
NProgress.configure({ showSpinner: false }); // 关闭右上角的旋转效果
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/base/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/base/404.vue'),
    meta: {
      title: '404',
    },
  },
]

//导出最终路由
export const routes = constantRoutes

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
})
/**
 * 路由拦截
 * 1.用户登录之后，通过pinia在存储用户角色和token
 * 2.通过路由和角色过滤出对应角色的路由，然后动态添加到路由上面
 * router.beforeEach(async (to, from, next)
 */
const whiteList = ['/login', '/404'] // 白名单
import { userStore } from "@/stores/user";
router.beforeEach(async (to, from) => {
   // 开始进度条
   NProgress.start();
  const user = userStore();

  if (user.token) {
    //已登录
    if (to.path === "/login") {
      //已登录直接进入首页
      return { path: "/dashboard" };
    } else {
      //获取所有路由
      const allRoutes = router.getRoutes();
      //判断是否已经添加了路由
      if (allRoutes.length > 3) {
        return true;
      } else {
        //根据获取菜单
        await user.getMenuList();
        //添加路由
        user.menuList.forEach((route) => {
          router.addRoute("Layout", route);
        });
        //触发重定向
        return to.fullPath;
      }
    }
  } else {

    if(!whiteList.includes(to.path)){
      return { path: "/login", query: { redirect: to.fullPath } };
    }
      return true;
  }
});


router.afterEach(() => {
  // 结束进度条
  NProgress.done();
});

router.onError((error) => {
  console.error('Routing error:', error);
  NProgress.done(); // 确保进度条停止
});
export default router;
