<template>
  <el-icon class="ico-collapse f-18" @click="toggleSide">
    <Fold v-if="sideFlag" />
    <Expand v-else />
  </el-icon>
</template>
<script name="SwitchSide" setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
// import { Expand, Fold } from '@element-plus/icons-vue'
import { useSideStore } from '@/stores/side.js'
import { computed } from 'vue'
const side = useSideStore()
const sideFlag = computed(() => side.sideFlag)
const toggleSide = () => {
  side.toggleSide()
}
</script>

<style lang="less" scoped>
.ico-collapse {
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding:6px;
  border-radius: 6px;
  transition: all 0.3s;
  color: #1890ff;
}

.ico-collapse:hover {
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 6px;
  color: #409eff;
}
</style>
