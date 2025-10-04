<template>
   <div class="bg-fff radius-6 pd-20">
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="基本设置" class="mt-20" name="first">
        <el-form ref="infoRef" :model="info" label-width="84px">
          <el-form-item label="网站名称" prop="name" :rules="[
            {
              required: true,
              message: '请输入网站名称',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ]">
            <el-input v-model="info.name"></el-input>
          </el-form-item>
          <el-form-item prop="domain" label="网站域名">
            <el-input v-model="info.domain"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="站长邮箱">
            <el-input v-model="info.email"  :rules="[
              {
                type: 'email',
                message: '请输入正确的邮箱',
                trigger: ['blur', 'change'],
              },
            ]"></el-input>
          </el-form-item>
          <el-form-item prop="icp" label="ICP备案号">
            <el-input v-model="info.icp"></el-input>
          </el-form-item>
          <el-form-item prop="code" label="统计代码">
            <el-input type="textarea" :rows="3" v-model="info.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit(infoRef)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="SEO设置" class="mt-20" name="second">
        <el-form ref="seoRef" :model="seo"  label-width="84px">
          <el-form-item label="标题" prop="title" :rules="[
            {
              required: true,
              message: '请输入网站标题',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ]">
            <el-input v-model="seo.title"></el-input>
          </el-form-item>
          <el-form-item prop="keywords" label="关键词">
            <el-input v-model="seo.keywords"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="描述" :rules="[
            {
              min: 2,
              max: 255,
              message: '字数限制255',
              trigger: 'blur',
            },
          ]">
            <el-input type="textarea" :rows="3" v-model="seo.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit(seoRef)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <ConfigSet />
      <QiNiu />
      <WeChat />
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { siteInfo, update } from "@/api/site.js";
import ConfigSet from "./components/config.vue";
import QiNiu from "./components/qiniu.vue";
import WeChat from "./components/wechat.vue";

const activeName = ref('first');
const infoRef = ref(null);
const seoRef = ref(null);

const info = reactive({
  id: '',
  name: '',
  domain: '',
  email: '',
  icp: '',
  code: ''
});

const seo = reactive({
  id: '',
  title: '',
  keywords: '',
  description: ''
});


async function query() {
  try {
    const res = await siteInfo();
    if (res.code === 200) {
      const { id, name, domain, email, icp, title, keywords, description } = res.data;
      Object.assign(info, { id, name, domain, email, icp });
      Object.assign(seo, { id, title, keywords, description });
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({ message: res.msg, type: 'warning' });
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateData(data) {
  try {
    const res = await update(data);
    if (res.code === 200) {

      // eslint-disable-next-line no-undef
      ElMessage({ message: '更新成功^_^', type: 'success' });
      await query();
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({ message: res.msg, type: 'warning' });
    }
  } catch (error) {
    console.error(error);
  }
}

function handleClick(tab) {
  activeName.value = tab.paneName;
}

function submit(formRef) {
  formRef.validate(async (valid) => {
    if (valid) {
      if (activeName.value === 'first') {
        await updateData(info);
      } else {
        await updateData(seo);
      }
    } else {
      console.log('error submit!!');
    }
  });
}

onMounted(query);
</script>

<style scoped>
/* 添加你的样式 */
</style>
