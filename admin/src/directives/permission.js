
/**
 * @description: 权限指令
 * @param {Object} el 指令所绑定的元素
 * @param {Object} binding 指令所绑定的值
 * @param {Object} vnode 指令所绑定的虚拟节点
 * @returns {void}
 * @usage: <div v-permission="['admin', 'editor']">管理员和编辑可以看</div>
 */
export default {
    mounted(el, binding, vnode) {
       // 获取用户角色
       const {userInfo: { role }} = userStore();
      // 获取指令的参数，即需要的权限
      const permission = binding.value;
      // 判断用户是否拥有该权限
      if (role !== permission) {
        // 如果用户没有该权限，从 DOM 中移除该元素
        el.parentNode.removeChild(el);
      }
    }
  }