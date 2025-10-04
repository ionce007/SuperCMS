
//根据角色过滤路由
export function filterRoutes(routes, role) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterRoutes(tmp.children, role)
    }
    if (hasPermission(tmp, role)) {
      res.push(tmp)
    }
  })
  return res
}

//返回是角色
export function hasPermission(route, role) {
  if (route?.meta?.role) {
    return route.meta.role.includes(role)
  } else {
    return true
  }
}

//生成完整路径 讲path路径改成绝对路径
export function getFullPathRoutes(routes, parentPath) {
  const res = []
  routes.forEach(route => {
    const temp = { ...route }
    temp.path = parentPath + temp.path
    res.push(temp)
    if (temp.children) {
      temp.children = getFullPathRoutes(
        temp.children,
        temp.path + (temp.path === '/' ? '' : '/'),
      )
    }
  })
  return res
}

//讲完整路由重定向改为children第一项
export function updateRoutesRedirect(routes) {
  routes.forEach(route => {
    if (route.children) {
      route.redirect = route.children[0].path
      updateRoutesRedirect(route.children)
    }
  })
}

//更具接口返回的路由，动态加载组件
export function dealRoute(routes,modules) {
  let res = [] //递归的适合函数内部形成作用域，不影响这个
  routes.forEach(item => {
    if (item.component) {
      item.component = item.component.replace('@/', '/src/')
      item.component = modules[`${item.component}`]
    }
    res.push(item)
    if (item.children) {
      dealRoute(item.children,modules)
    }
  })
  return res
}