<template>
  <h1 class="logo overflow-h flex justify-center pt-10 pb-10 mb-10">
    <logo class="icon mr-5" />
    <span class="f-22 nowrap fw-700" v-show="!isCollapse"> SuperCMS </span>
  </h1>
</template>

<script setup name="Logo">
import { defineProps } from 'vue'
import logo from '@/assets/icons/logo.svg?component';
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.logo{
  height:52px;
  box-shadow: 1px 1px 8px rgba(0,0,0,.06);
}
.icon {
  width: 32px;
  height: 32px;
 
}
.nowrap {
  white-space: nowrap;
}
</style>
