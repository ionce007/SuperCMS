<template>
  <div class="tag-views" ref="tagViewsContainer">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick" @tab-remove="handleTabRemove">
      <el-tab-pane v-for="item in routerCache" :key="item.fullpath" :name="item.fullpath" :closable="!item.fixed">
        <template #label>
          <span ref="tabLabel" @contextmenu.prevent="showContextMenu(item, $event)">
            {{ item.title }}
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div ref="contextMenu" :style="menuPosition" class="menu-wrap">
      <ul class="menu pos-r z-0">
        <li class="menu-item flex items-center" @click="refreshPage">
          <el-icon class="mr-5"><Refresh /></el-icon>刷新页面
        </li>
        <li class="menu-item flex items-center" @click="closeLeft(currentItem)">
          <el-icon class="mr-5"><Back /></el-icon>关闭左侧
        </li>
        <li class="menu-item flex items-center" @click="closeRight(currentItem)">
          <el-icon class="mr-5"><ArrowRight /></el-icon>关闭右侧
        </li>
        <li class="menu-item flex items-center" @click="closeAll()">
          <el-icon class="mr-5"><Close /></el-icon>全部关闭
        </li>
      </ul>
    </div>
  </div>
</template>

<script name="Tagsview" setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const currentRoute = useRoute();

const routerCache = ref([
  {
    fullpath: '/dashboard',
    title: '首页',
    fixed: true,
  },
]);

const activeTab = computed({
  get: () => currentRoute.fullPath,
  set: (newPath) => {
    router.push(newPath);
  },
});

// 添加标签
const addTag = (route) => {
  const existingTag = routerCache.value.find(tag => tag.fullpath === route.fullPath);
  if (!existingTag) {
    routerCache.value.push({
      fullpath: route.fullPath,
      title: route.meta.title || route.name || 'Unnamed',
      fixed: route.meta.fixed || route.fullPath === '/dashboard',
    });
  }
};

// 处理标签点击事件
const handleTabClick = (tabPane) => {
  const path = tabPane.paneName;
  router.push(path);
};

// 处理标签移除事件
const handleTabRemove = (targetName) => {
  let _targetName = targetName?.fullpath || targetName;
  const index = routerCache.value.findIndex(tag => tag.fullpath === _targetName);
  if (index >= 0 && !routerCache.value[index].fixed) {
    routerCache.value.splice(index, 1);

    // 如果移除的是当前活跃标签，跳转到上一个或下一个标签
    if (targetName === currentRoute.fullPath) {
      const nextTag = routerCache.value[index - 1] || routerCache.value[index];
      if (nextTag) {
        router.push(nextTag.fullpath);
      }
    }
  }
};

// 刷新页面
const refreshPage = () => {
  router.go(0);
};

// 关闭左侧
const closeLeft = (tag) => {
  const index = routerCache.value.indexOf(tag);
  if (index > 0) {
    routerCache.value = [
      ...routerCache.value.slice(0, index).filter(t => t.fixed),
      ...routerCache.value.slice(index),
    ];
    if (tag.fullpath === activeTab.value) {
      const nextTag = routerCache.value[index - 1] || routerCache.value[index];
      if (nextTag) {
        router.push(nextTag.fullpath);
      }
    }
  }
};

// 关闭右侧
const closeRight = (tag) => {
  const index = routerCache.value.indexOf(tag);
  if (index >= 0 && index < routerCache.value.length - 1) {
    routerCache.value = [
      ...routerCache.value.slice(0, index + 1),
      ...routerCache.value.slice(index + 1).filter(t => t.fixed),
    ];
    if (tag.fullpath === activeTab.value) {
      const nextTag = routerCache.value[index + 1] || routerCache.value[index];
      if (nextTag) {
        router.push(nextTag.fullpath);
      }
    }
  }
};

// 全部关闭
const closeAll = () => {
  routerCache.value = routerCache.value.filter(tag => tag.fixed);
  if (routerCache.value.length > 0) {
    const nextTag = routerCache.value[0];
    if (nextTag) {
      router.push(nextTag.fullpath);
    }
  }
};

// 当前选中的项
const currentItem = ref(null);

// 获取右键菜单的引用
const contextMenu = ref(null);
const tagViewsContainer = ref(null);
const menuPosition = ref({
  display: 'none',
  left: '0px',
  top: '0px',
});

// 显示右键菜单
const showContextMenu = (item, event) => {
  if (item.fixed) {
    return;
  }
  currentItem.value = item;

  // 获取点击的目标元素
  const targetElement = event.currentTarget.parentElement;

  // 计算目标元素相对于 tag-views 容器的位置
  const containerRect = tagViewsContainer.value.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const left = targetRect.left - containerRect.left;
  const top = targetRect.bottom - containerRect.top + (targetRect.height / 2);

  // 更新菜单位置
  menuPosition.value = {
    display: 'block',
    left: `${left}px`,
    top: `${top}px`,
  };

  // 防止菜单超出窗口边界
  nextTick(() => {
    if (contextMenu.value) {
      const menuRect = contextMenu.value.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 调整 left 位置
      if (left + menuRect.width > viewportWidth) {
        menuPosition.value.left = `${viewportWidth - menuRect.width}px`;
      }

      // 调整 top 位置
      if (top + menuRect.height > viewportHeight) {
        menuPosition.value.top = `${top - menuRect.height}px`;
      }
    }
  });
};

// 隐藏右键菜单
const hideContextMenu = () => {
  menuPosition.value.display = 'none';
};

// 监听路由变化
watch(
  () => currentRoute.fullPath,
  () => {
    addTag(currentRoute);
  },
  { immediate: true },
);

// 监听文档点击事件以隐藏右键菜单
onMounted(() => {
  document.addEventListener('click', hideContextMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu);
});
</script>

<style lang="less" scoped>
@media (max-width: 768px) {
  .tag-views {
    display: none;
  }
}

.tag-views {
  position: relative;
}

.menu-wrap {
  position: absolute;
  width: 120px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 3;

  .menu::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    z-index: -2;
    border-radius: 4px;
  }
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;

  &:nth-child(1) {
    background-color: #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.menu-item:hover {
  background-color: #f9f9f9;
  color: #409eff;
}

:deep(.el-tabs) {
  height: 30px;
  line-height: 30px;

  .el-tabs__nav-wrap {
    padding: 0 !important;
  }

  .el-tabs__header {
    height: 30px;
    margin: 0;
  }

  .el-tabs__nav-scroll {
    padding: 0 !important;
  }

  .el-tabs__item {
    height: 30px;

    .is-icon-close {
      width: 14px;
      opacity: 0;
    }

    &.is-active {
      border-bottom: 2px solid #409eff;
    }

    &.is-closable:hover {
      padding-left: 20px;
      padding-right: 20px;

      .is-icon-close {
        opacity: 1;
      }
    }

    &.is-active.is-closable {
      border-bottom: 2px solid #409eff;

      .is-icon-close {
        opacity: 1;
      }
    }
  }

  .el-tabs__nav-wrap {
    padding: 0 10px;
  }

  .el-tabs__nav-scroll {
    padding: 0 10px;
  }

  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    height: 30px;
    line-height: 30px;
    background: #f2f2f2;
    border: 1px solid #ddd;
    height: 30px;
    z-index: 3;
  }
}
</style>
