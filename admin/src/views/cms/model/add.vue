<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form :model="formParams" :rules="rules" ref="formRef" label-width="100px" class="mt-20">
      <el-form-item label="模型名称" prop="model">
        <el-input v-model="formParams.model" placeholder="请输入模型名称"></el-input>
      </el-form-item>
      <el-form-item label="新增表名" prop="tableName">
        <el-input v-model="formParams.tableName" placeholder="表名称必须ext_开头"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio v-model="formParams.status" :label="1">开启</el-radio>
        <el-radio v-model="formParams.status" :label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formParams.remark" placeholder="请输入备注"></el-input>
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
import { create } from '@/api/model.js';

const formRef = ref(null);
const formParams = reactive({
  model: '',
  tableName: '',
  status: 1,
  remark: ''
});

const rules = reactive({
  model: [
    { required: true, message: '请输入模型名称', trigger: 'blur' }
  ],
  tableName: [
    { required: true, message: '请输入表名', trigger: 'blur' },
    { validator: validateTableName, trigger: 'blur' }
  ],
  remark: [
    { required: true, message: '请输入备注', trigger: 'blur' }
  ]
});

function validateTableName(rule, value, callback) {
  if (!value.startsWith('ext_')) {
    callback(new Error('表名必须以 ext_ 开头'));
  } else {
    callback();
  }
}

async function handleSubmit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await create({ ...formParams });
        if (res.code === 200) {
          ElMessage.success('创建表成功^_^');
          useRouter().go(-1);
        } else {
          ElMessage.error(res.msg);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<style scoped></style>