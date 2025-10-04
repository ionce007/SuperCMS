<template>
  <div class="app-main-wrap bg-f2f2f2 pd-10">
    <div class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition name="router-anim" mode="out-in" appear>
          <keep-alive :include="route.meta.alive">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>
<script setup name="AppMain">
import Footer from '../Footer/index.vue'
</script>
<style lang="less" scoped>

/* 进入过渡的开始状态 */
.router-anim-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

/* 进入过渡的激活状态 */
.router-anim-enter-active {
  transition: all 0.5s ease-out;
}

/* 进入过渡的结束状态 */
.router-anim-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 离开过渡的开始状态 */
.router-anim-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* 离开过渡的激活状态 */
.router-anim-leave-active {
  transition: all 0.5s ease-in;
}

/* 离开过渡的结束状态 */
.router-anim-leave-to {
  opacity: 0;
  transform: translateX(30px);
}


.app-main-wrap {
  height: calc(100vh - 86px);
  overflow-y: auto;
}

.app-main {
  min-height: calc(100vh - 145px);
  border-radius: 10px;
}

@media screen and (max-width: 768px) {
  .app-main-wrap {
    height: calc(100vh - 56px);
  }

  .app-main {
    min-height: calc(100vh - 115px);
  }
}
</style>
