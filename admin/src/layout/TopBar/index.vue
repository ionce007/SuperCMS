<template>
  <div class="bg-fff">
    <div class="top-bar flex justify-between pl-5 pr-10 pt-10 pb-10">
      <div class="flex gap-5 items-center">
        <SwitchSide/>
        <Breadcrumb />
      </div>

      <div class="flex-1 flex gap-5 justify-end items-center ">
        <WebSite />
        <LanguageSwitch v-if="setting.languageShow" />
        <LightDarkSwitch v-if="setting.lightShow"/>
        <Notice v-if="setting.noticeShow" />
        <ScreenFull v-if="setting.screenfullShow" />
        <LogOut />
      </div>
    </div>

    <Tagsview v-if="setting.tagsViewShow"/>
  </div>
</template>

<script setup name="TopBar">
import WebSite from './components/WebSite.vue'
import LanguageSwitch from './components/LanguageSwitch.vue'
import LightDarkSwitch from './components/LightDarkSwitch.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import LogOut from './components/LogOut.vue'
import Notice from './components/Notice.vue'
import ScreenFull from './components/ScreenFull.vue'
import Tagsview from './components/Tagsview.vue'
import SwitchSide from './components/SwitchSide.vue'
import settingStore from '@/stores/setting'
const setting = settingStore()

</script>

<style scoped>
</style>
