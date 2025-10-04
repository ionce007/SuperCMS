<template>
  <div class="bg-fff radius-6 pd-20">
    <el-form
      ref="formRef"
      :model="params"
      :rules="paramsRules"
      label-width="84px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="params.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="params.password"></el-input>
      </el-form-item>

      <el-form-item label="角色">
        <el-radio-group v-model="params.role_id">
          <el-radio :value="item.id" v-for="item in roleList" :key="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否显示">
        <el-radio v-model="params.status" value="1">启用</el-radio>
        <el-radio v-model="params.status" value="2">关闭</el-radio>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { create, list as listRoles } from '@/api/sys_user.js';

import { useRouter } from 'vue-router';

const formRef = ref(null);
const params = ref({
  username: '',
  password: '',
  status: '1',
  role_id: 0,
});

const roleList = ref([]);
const curPage = ref(1);

const paramsRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '2到20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '6到20个字符', trigger: 'blur' },
  ],
};

const router = useRouter();

// 查询角色列表
const fetchRoles = async () => {
  try {
    const res = await listRoles(curPage.value);
    if (res.code === 200) {
      roleList.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  }
};

// 新增用户
const createUser = async () => {
  try {
    const res = await create(params.value);
    if (res.code === 200) {
      // eslint-disable-next-line no-undef
      ElMessage.success('更新成功^_^');
      router.go(-1);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.log(error);
  }
};

// 提交表单
const submitForm = (formRef) => {

  if (formRef) {
    formRef.validate((valid) => {
      if (valid) {
        createUser();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
};

onMounted(() => {
  fetchRoles();
});
</script>

<style scoped></style>
