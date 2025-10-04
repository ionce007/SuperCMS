<template>
  <div class="mr-10 ml-10">
    <!-- 七牛云配置 -->
    <el-tab-pane label="七牛云配置" class="mt-20" name="qiniu">
      <el-form ref="setFormRef" :model="state.set" label-width="120px">
        <el-form-item prop="accessKey" label="accessKey(AK)">
          <el-input v-model="state.set.accessKey"></el-input>
        </el-form-item>

        <el-form-item prop="secretKey" label="secretKey(SK)">
          <el-input v-model="state.set.secretKey"></el-input>
        </el-form-item>

        <el-form-item prop="domain" label="域名">
          <el-input v-model="state.set.domain"></el-input>
        </el-form-item>

        <el-form-item prop="bucket" label="空间">
          <el-input v-model="state.set.bucket"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { find, update } from '@/api/sys_config.js';

const state = reactive({
  loading: true,
  set: {
    template: 'default',
    appid: '',
    secret: '',
    accessKey: '', // ak
    secretKey: '', // sk
    domain: '', // 域名
    bucket: '', // 空间名称
    uploadWay: '1', // 1->普通 2->七牛云
  },
});

const setFormRef = ref(null);

onMounted(async () => {
  await query();
});

// 查询
async function query() {
  try {
    const res = await find();
    if (res.code === 200) {
      state.loading = false;
      Object.assign(state.set, res.data);
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 更新配置
async function updateConfig() {
  try {
    const res = await update(state.set);
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
        type: 'success',
      });
      await query();
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 提交表单
function handleSubmit() {
  setFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateConfig();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<style scoped></style>