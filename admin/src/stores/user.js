import { defineStore } from 'pinia'
import { find } from "@/api/menu.js";
const modules = import.meta.glob("@/views/**/*.vue");
import { setCookie, removeCookie } from "@/utils/tool.js";
export const userStore = defineStore('user', {
  state: () => ({
    token: "",
    role: '',
    userInfo: null,
    menuList: [], //左侧菜单
  }),
  actions: {

    setToken(token) {
      setCookie("token", token);
      this.token = token;
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      setCookie("username", userInfo.username);
    },

    setRole(role) {
      this.role = role
    },

    async getMenuList() {
      try {
        let res = await find();
        if (res.code == 200) {
          let menu = res.data.content;
          let router = dealRoute(JSON.parse(menu).route);
          this.menuList = filterRoutes(router, this.role);
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 退出登录
    logout() {
      this.userInfo = null;
      this.token = '';
      this.menuList = [];
      this.role = '';
      removeCookie('token');
      removeCookie('username');
    },

  },
  persist: {
    enabled: true, //开启
    strategies: [
      {
        key: 'user',
        storage: sessionStorage,
      },
    ],
  },
})



function filterRoutes(routes, role) {
  const res = [];

  routes.forEach((route) => {
    //解构出来，防止修改源
    const tmp = { ...route };
    if (tmp?.children?.length > 0) {
      tmp.children = filterRoutes(tmp.children, role);
    }
    //判断是否有权限，有权限则push
    if (hasPermission(tmp, role)) {
      res.push(tmp);
    }
  });

  return res;
}

function hasPermission(route, role) {
  if (route?.meta?.role) {
    return route.meta.role.includes(role);
  } else {
    return true;
  }
}


//更具接口返回的路由，动态加载组件
function dealRoute(routes) {
  let res = []; //递归的适合函数内部形成作用域，不影响这个
  routes.forEach((item) => {
    if (item.component) {
      item.component = item.component.replace("@/", "/src/");
      item.component = modules[`${item.component}`];
    }
    res.push(item);
    if (item.children) {
      dealRoute(item.children);
    }
  });
  return res;
}
