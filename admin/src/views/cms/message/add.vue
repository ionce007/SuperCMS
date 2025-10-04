<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="formRef"
      :model="params"
      label-width="84px"
      class="mt-20"
      :rules="paramsRules"
    >
      <el-form-item
        label="留言类型"
        prop="type"
        :rules="[
          {
            required: true,
            message: '请选择类型',
            trigger: 'blur',
          },
        ]"
      >
        <el-select v-model="params.type" placeholder="请选择类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="留言标题"
        prop="title"
        :rules="[
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="params.title"></el-input>
      </el-form-item>

      <el-form-item
        label="姓名"
        prop="name"
        :rules="[
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="params.name"></el-input>
      </el-form-item>

      <el-form-item
        label="手机号"
        prop="tel"
        :rules="[
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="params.tel"></el-input>
      </el-form-item>

      <el-form-item label="公司单位">
        <el-input v-model="params.company"></el-input>
      </el-form-item>

      <el-form-item label="微信">
        <el-input v-model="params.wechat"></el-input>
      </el-form-item>

      <el-form-item
        label="留言内容"
        prop="content"
        :rules="[
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="params.content"
        ></el-input>
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
import { create } from '@/api/message.js';

const formRef = ref(null);

const options = reactive([
  { label: '咨询', value: '1' },
  { label: '建议', value: '2' },
  { label: '投诉', value: '3' },
  { label: '其他', value: '4' },
]);

const params = reactive({
  type: '',
  title: '',
  name: '',
  tel: '',
  company: '',
  wechat: '',
  content: '',
});

const paramsRules = reactive({
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度在 2 到 20 个字符之间', trigger: 'blur' },
  ],
});

const router = useRouter();

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await handleCreate();
    } else {
      console.log('error submit!!');
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