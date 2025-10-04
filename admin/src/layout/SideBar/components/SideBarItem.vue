<template>
  <el-sub-menu
    v-if="item?.children?.length > 0 && item.meta.isShow"
    :index="item.path"
  >
    <template #title>
      <el-icon v-if="item?.meta?.icon">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item?.meta?.title }}</span>
    </template>
    <SidebarItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <el-menu-item
    v-else-if="item?.meta?.isShow"
    :index="item.path"
    @click="navigateTo(item)"
  >
    <el-icon v-if="item?.meta?.icon">
      <component :is="item.meta.icon"></component>
    </el-icon>
    <template #title><span>{{ item?.meta?.title }}</span></template>
  </el-menu-item>
</template>

<script setup name="SidebarItem">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const router = useRouter()
const navigateTo = item => {
  if (!item?.children?.length) {
    router.push({
      path: item.path,
      query: item.query,
    })
  }
}
</script>

<style scoped lang="less">
.ico-nav {
  width: 40px;
  height: 40px;
  border-radius: 15px;
  box-shadow: inset 0px 0px 5px #f2f2f2;
  padding: 4px;
  display: inline-block;
  margin-right: 5px;
  img {
    width: 100%;
  }
}

.el-menu-item:hover {
  background-color: #f2f2f2;
}


:deep(.el-sub-menu__title:hover) {
  background-color: #f2f2f2;
}

:deep(.el-menu-item.is-active) {
  background-color: #f2f2f2;
}

:deep(.el-sub-menu__title.is-active) {
  background-color: #f2f2f2;
}
</style>
