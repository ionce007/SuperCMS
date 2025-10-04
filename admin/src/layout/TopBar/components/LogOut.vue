<template>
    <el-dropdown trigger="click">
      <el-button icon="Avatar" circle />
      <template #dropdown>
        <el-dropdown-menu>
          <a href="https://cms.foryet.com" target="_blank">
            <el-dropdown-item>官网首页</el-dropdown-item>
          </a>
          <el-dropdown-item v-if="setting.persionCenter">个人中心</el-dropdown-item>
          <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>
<script setup name="LogOut">
import { userStore } from '@/stores/user'
const user = userStore()
const username = user?.userInfo?.username || 'SuperCMS'

import settingStore from '@/stores/setting'
const setting = settingStore()
const logout = () => {
  user.logout()
  location.reload()
}
</script>
