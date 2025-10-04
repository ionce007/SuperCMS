<template>
  <div class="flex  justify-center items-center w-vfull h-vfull">
    <div class="not-found text-c">
      <h1 class="mb-20">找不到了页面或者权限不足😭</h1>
      <div>
        <el-button @click="goHome" type="primary">去首页</el-button>
        <el-button @click="logout" type="primary">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { userStore } from '@/stores/user';

const router = useRouter();
const user = userStore();

const logout = () => {
  user.logout();
  // location.reload();
  router.replace({ path: '/login' });
};

const goHome = () => {
  router.replace({ path: '/dashboard' });
};
</script>

<style lang="less" scoped>
.not-found {
  width: 420px;
  height: 120px;
}
</style>
