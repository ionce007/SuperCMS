<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="paramsForm" :model="params" label-width="84px" class="mt-20">
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '名称长度在 2 到 20 个字符之间', trigger: 'blur' }
        ]"
      >
        <el-input v-model="params.name"></el-input>
      </el-form-item>

      <el-form-item label="角色值">
        <el-input v-model="params.value"></el-input>
      </el-form-item>

      <el-form-item label="是否显示">
        <el-radio v-model="params.status" value="1">启用</el-radio>
        <el-radio v-model="params.status" value="2">关闭</el-radio>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit('paramsForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { create } from '@/api/sys_role.js';
import { ElMessage } from 'element-plus';

const router = useRouter();
const paramsForm = ref(null);
const params = reactive({
  name: '',
  value: '',
  status: '1',
});

// const handleAttr = (e) => {
//   console.log('e-->', e);
// };

// const handleSubCid = (e) => {
//   console.log('e-->', e);
// };

// 新增
const createRole = async () => {
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

const submit = () => {
  paramsForm.value.validate((valid) => {
    if (valid) {
      createRole();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style scoped>
/* 添加样式 */
</style>
