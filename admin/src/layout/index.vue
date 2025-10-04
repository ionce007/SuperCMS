<template>
  <div
    class="w-vfull h-vfull flex overflow-h"
    :class="{ 'w-65': !sideFlag, 'w-200': sideFlag }"
  >
    <div class="sidebar h-vfull bg-fff">
      <SideBar :isCollapse="!sideFlag" />
    </div>
    <div class="app-content h-vfull flex-1 bg-f6f6f6">
      <TopBar />
      <AppMain />
    </div>
  </div>

  <el-drawer 
    v-model="drawer" modal-class="drawer-modal"
    :before-close="close"
    direction="ltr"
    :with-header="false"
    size="200px"
  >
    <SideBar />
  </el-drawer>
</template>

<script setup name="LayOut">
import SideBar from './SideBar/index.vue'
import TopBar from './TopBar/index.vue'
import AppMain from './Main.vue'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

import { useSideStore } from '@/stores/side.js'
const side = useSideStore()
const sideFlag = computed(() => side.sideFlag)
const drawer = ref(false)
const close = () => {
  drawer.value = false
  side.toggleSide()
}

watch(sideFlag, newVal => {
  if (document.body.clientWidth < 768 && newVal) {
    drawer.value = true
  }
})

const handleResize = () => {
  let w = document.body.clientWidth
  if (w < 1024) {
    if (sideFlag.value) {
      side.setSide(false)
    }
  } else if (w > 1025) {
    side.setSide(true)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="less" scoped>
.sidebar {
  width: 200px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.app-content {
  min-height: (100vh - 115px);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .app-content {
    width: 100vw;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 65px;
  }
  .app-content {
    width: calc(100vw - 65px);
  }
}

.w-65 .sidebar {
  width: 65px;
}

.w-65 .app-content {
  width: calc(100vw - 65px);
}

.w-200 .sidebar {
  width: 200px;
}

.w-200 .app-content {
  width: calc(100vw - 200px);
}

</style>
