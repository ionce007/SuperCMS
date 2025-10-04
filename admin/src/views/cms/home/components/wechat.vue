<template>
  <div class="mr-10 ml-10">
    <!-- 微信配置 -->
    <el-tab-pane label="微信配置" class="mt-20" name="wechat">
      <el-form ref="setFormRef" :model="state.set" label-width="80px">
        <el-form-item
          label="appid"
          prop="appid"
          :rules="[
            {
              required: true,
              message: '请输入appid',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="state.set.appid"></el-input>
        </el-form-item>

        <el-form-item prop="secret" label="secret">
          <el-input v-model="state.set.secret"></el-input>
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
async function updateWechat() {
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
      await updateWechat();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<style scoped></style>