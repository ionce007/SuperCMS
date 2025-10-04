<template>
  <div class="mr-10 ml-10">
    <el-tab-pane label="应用配置" class="mt-20" name="config">
      <el-form ref="setFormRef" :model="state.set" label-width="120px">
        <el-form-item prop="template" label="模板">
          <el-select v-model="state.set.template" placeholder="请选择模板">
            <el-option
              v-for="(item, index) in state.folderList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传方式">
          <el-radio-group v-model="state.set.uploadWay" class="ml-4">
            <el-radio value="1">普通</el-radio>
            <el-radio value="2">七牛云</el-radio>
          </el-radio-group>
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
import { folder } from '@/api/sys_app.js';

const state = reactive({
  loading: true,
  folderList: [],
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
  await getFolder();
});

async function getFolder() {
  try {
    const res = await folder();
    if (res.code === 200) {
      res.data.forEach((item) => {
        state.folderList.push({ label: item, value: item });
      });
    }
  } catch (error) {
    console.log(error);
  }
}

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

// 更新SEO信息
async function updateSeo() {
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

function handleSubmit() {
  setFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateSeo();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<style scoped></style>
