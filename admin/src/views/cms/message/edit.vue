<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="paramsForm" :model="params" label-width="84px" class="mt-20">
      <el-form-item label="留言类型" :rules="[{
        required: true,
        message: '请选择类型',
        trigger: 'blur',
      }]" prop="type">
        <el-select v-model="params.type" placeholder="请选择类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="留言标题" :rules="[
      {
        required: true,
        message: '请输入标题',
        trigger: 'blur',
      },
    ]" prop="title">
        <el-input v-model="params.title"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[
      {
        required: true,
        message: '请输入内容',
        trigger: 'blur',
      },
    ]">
        <el-input v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="tel" :rules="[
      {
        required: true,
        message: '请输入内容',
        trigger: 'blur',
      },
    ]">
        <el-input v-model="params.tel"></el-input>
      </el-form-item>

      <el-form-item label="公司单位">
        <el-input v-model="params.company"></el-input>
      </el-form-item>

      <el-form-item label="微信">
        <el-input v-model="params.wechat"></el-input>
      </el-form-item>

      <el-form-item label="留言内容" prop="content" :rules="[
      {
        required: true,
        message: '请输入内容',
        trigger: 'blur',
      },
    ]">
        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="params.content"></el-input>
      </el-form-item>

      <el-form-item class="flex">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { update, detail } from "@/api/message.js";


const router = useRouter();
const route = useRoute();

const params = ref({
  id: 0,
  type: '',
  title: '',
  name: '',
  tel: '',
  company: '',
  wechat: '',
  content: ''
});

const paramsForm = ref(null);

const options = [
  { label: "咨询", value: "1" },
  { label: "建议", value: "2" },
  { label: "投诉", value: "3" },
  { label: "其他", value: "4" }
];

onMounted(async () => {
  params.value.id = route.params.id;
  await fetchDetail();
});

const fetchDetail = async () => {
  try {
    const res = await detail(params.value.id);
    if (res.code === 200) {
      delete res.data.updatedAt;
      Object.assign(params.value, res.data);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line no-undef
    ElMessage.error('获取详情失败');
  }
};

const goBack = () => {
  router.go(-1);
};

const submit = () => {
  paramsForm.value.validate((valid) => {
    if (valid) {
      handleUpdate();
    } else {
      console.log("error submit!!");
    }
  });
};

const handleUpdate = async () => {
  try {
    const res = await update(params.value);
    if (res.code == 200) {
      // eslint-disable-next-line no-undef
      ElMessage.success('更新成功^_^');
      router.go(-1);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage.error(res.msg);
    }
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line no-undef
    ElMessage.error('更新失败');
  }
};
</script>

<style scoped>
.w-90 {
  width: 90px;
  display: inline-block;
}
</style>
