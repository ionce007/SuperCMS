<template>
  <div class="app-main-wrap pd-10">
    <div class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition" mode="out-in" appear>
          <!-- <keep-alive :include="route.meta.alive"> -->
            <component :is="Component" />
          <!-- </keep-alive> -->
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>
<script setup name="AppMain">
import Footer from './Footer.vue'
</script>
<style lang="less" scoped>
.app-main-wrap {
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.app-main {
  min-height: calc(100vh - 109px);
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
