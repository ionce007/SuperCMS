<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="formRef" :model="params" label-width="100px" class="mt-20">
      <el-form-item label="模型名称" prop="model" :rules="rules.model">
        <el-input v-model="params.model" placeholder="请输入模型名称"></el-input>
      </el-form-item>
      <el-form-item label="新增表名" prop="tableName" :rules="rules.tableName">
        <el-input v-model="params.tableName" placeholder="表名称必须ext_开头"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="params.status">
        <el-radio  :value="1">开启</el-radio>
        <el-radio  :disabled="disable" :value="0">禁用</el-radio>
      </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark" :rules="rules.remark">
        <el-input v-model="params.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { update, hasUse, detail } from '@/api/model.js';

const router = useRouter();
const route = useRoute();
const formRef = ref(null);

const params = reactive({
  id: 0,
  old_tableName: '', // 未修改之前的表名称
  model: '',
  tableName: '',
  remark: '',
  status: 1,
});

const disable = ref(false);

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

const fetchDetail = async () => {
  try {
    const res = await detail(params.id);
    if (res.code === 200) {
      const data = res.data;
      data.status = +data.status;
      Object.assign(params, { ...data, old_tableName: data.tableName });
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const checkUsage = async (id) => {
  try {
    const res = await hasUse(id);
    if (res.code === 200) {
      disable.value = res.data.count > 0;
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const saveChanges = async () => {
  try {
    const res = await update(params);
    if (res.code === 200) {
      ElMessage.success('更新成功^_^');
      router.go(-1);
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      saveChanges();
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};

onMounted(async () => {
  const id = route.params.id;
  params.id = id;
  await fetchDetail();
  await checkUsage(id);
});
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
