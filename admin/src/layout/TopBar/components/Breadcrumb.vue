<template>
    <el-breadcrumb class="breadcrumb pr-10" :separator="props.separator">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="item.path">
          <!-- 不可点击项 -->
          <span v-if="index === breadcrumbData.length - 1" class="f-14 no-redirect">
            {{ item.meta.title }}
          </span>
          <!-- 可点击项 -->
          <router-link v-else :to="{ path: item.path }" class="f-14 redirect" exact>
            {{ item.meta.title }}
          </router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup name="BreadCrumb">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { defineProps } from 'vue';
import { useSideStore } from '@/stores/side.js'

const side = useSideStore()
const clientStatus = computed(() => side.clientStatus)

const props = defineProps({
  separator: {
    type: String,
    default: '/'
  }
})
const route = useRoute()
const breadcrumbData = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title)
})
</script>

<style lang="less" scoped>
@keyframes bounceInRight {
  0% {
    opacity: 0;
    transform: translate3d(6px, 0, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0px, 0, 0);
  }
}

.breadcrumb :deep(.el-breadcrumb__item) {
  animation: bounceInRight 0.5s ease-in-out;
}
</style>
