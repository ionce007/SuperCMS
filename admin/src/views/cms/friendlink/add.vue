<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="formRef"
      :model="params"
      :rules="paramsRules"
      label-width="84px"
      class="mt-20"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="params.title"></el-input>
      </el-form-item>

      <el-form-item label="链接">
        <el-input v-model="params.link"></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="params.orderBy"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { create } from '@/api/friendlink.js';

const formRef = ref(null);

const params = reactive({
  title: '',
  link: '',
  orderBy: 0,
});

const paramsRules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 20, message: '标题长度在 2 到 20 个字符之间', trigger: 'blur' },
  ],
});

const router = useRouter();

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await handleCreate();
    } else {
      return false;
    }
  });
};

const handleCreate = async () => {
  try {
    const res = await create(params);
    if (res.code === 200) {
      ElMessage({
        message: '新增成功^_^',
        type: 'success',
      });
      router.go(-1);
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>