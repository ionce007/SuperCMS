<template>
    <Logo :isCollapse="isCollapse" />
     <el-scrollbar>
      <SideBarMenu :isCollapse="isCollapse" />
    </el-scrollbar>
</template>

<script setup name="SideBar">
import { defineProps ,computed} from 'vue';
import Logo from './components/Logo.vue';
import SideBarMenu from './components/SideBarMenu.vue';
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>

.el-scrollbar{
  height: calc(100vh - 62px);
  box-shadow:2px 0px 5px rgba(255,255,255,0.5);
  overflow:auto
}
</style>
