<template>
  <el-menu
    :active-text-color="activeTextColor"
    :background-color="backgroundColor"
    :text-color="textColor"
    class="el-menu-vertical-demo"
    :default-active="activeIndex"
    :router="true"
    :unique-opened="false"
    :collapse-transition="false"
    :collapse="isCollapse"
    popper-effect="light"
    @open="handleOpen"
    @close="handleClose"
  >
    <SidebarItem v-for="item in menuList" :key="item.path" :item="item" />
  </el-menu>
</template>

<script setup name="SideBarMenu">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userStore } from '@/stores/user'
import SidebarItem from './SideBarItem.vue'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
  activeTextColor: {
    type: String,
    default: '#409EFF',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#303133',
  },
})
const route = useRoute()
const user = userStore()
const activeIndex = ref('')
const menuList = ref([])
const initMenu = () => {
  menuList.value = user.menuList || []
  activeIndex.value = filterPath(route.path)
}

const filterPath = (path) => {
  const index = path.indexOf('/', 1);
    const _path = index !== -1 ? path.substring(0, index) : path;
    return _path
}

watch(
  () => route.path,
  newPath => {
    activeIndex.value = filterPath(newPath);
  }, { immediate: true }
)
onMounted(() => {
  initMenu()
})
const handleOpen = (key, keyPath) => {
  console.log('Menu opened:', key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log('Menu closed:', key, keyPath)
}
</script>

<style scoped>
.el-menu {
  border-right: 0px;
}

:deep(.el-sub-menu__icon-arrow) {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
