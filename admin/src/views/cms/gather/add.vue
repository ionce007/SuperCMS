<template>
  <div class="mb-20 bg-fff pd-20">
    <el-form ref="formRef" :model="params" label-width="84px">
      <el-form-item
        label="任务名称"
        prop="taskName"
        :rules="[
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="params.taskName"
          placeholder="例：前端库-chat问答"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="接口地址"
        prop="targetUrl"
        :rules="[
          {
            required: true,
            message: '请输入匹配网址',
            trigger: 'blur',
          },
        ]"
      >
        <div class="flex w-full">
          <el-input class="flex-1" v-model="params.targetUrl"></el-input>
        </div>
      </el-form-item>

      <el-form-item
        label="处理函数"
        prop="parseData"
        :rules="[
          {
            required: true,
            message: '请输入内容字段',
            trigger: 'blur',
          },
        ]"
      >
        <div class="flex w-full">
          <el-input
            class="flex-1"
            type="textarea"
            :rows="13"
            v-model="params.parseData"
            placeholder="如果不做任何处理，直接返回data。拿到的文本是变量是data,可以直接js函数可以处理成需要的数据，最终需要返回data。例：
            data.title = data.title;
            data.article = data.data.news;
            return data;
            "
          ></el-input>
          <el-button class="ml-5" type="primary" @click="getArticle">
            测试
          </el-button>
        </div>
      </el-form-item>

      <el-form-item
        label="保存栏目"
        prop="cid"
        :rules="[
          {
            required: true,
            message: '请输入保存栏目',
            trigger: 'blur',
          },
        ]"
      >
        <el-cascader
          :props="categoryProps"
          :show-all-levels="false"
          v-model="categorySelected"
          :options="category"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>

      <el-form-item
        label="发布状态"
        prop="status"
        :rules="[
          {
            required: true,
            message: '请选择发布状态',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="params.status" class="ml-4">
          <el-radio value="1" size="large">草稿</el-radio>
          <el-radio value="2" size="large">发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="article.title" label="采集结果">
        <el-card class="w-full" shadow="never">
          <template #header>
            <p class="f-15">
              <span class="c-999">标题：</span>{{ article.title }}
            </p>
          </template>
          <p class="f-15"><span class="c-999">内容：</span></p>
          <div class="f-15 article" v-html="article.content"></div>
        </el-card>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { find as findCategory } from '@/api/category.js';
import { create as createGather, getArticle as getArticleApi } from '@/api/gather.js';
import { addLabelValue, tree } from '@/utils/tool.js';

const route = useRoute();
const router = useRouter();
const formRef = ref(null);

// 数据初始化
const params = reactive({
  taskName: "",
  targetUrl: "",
  parseData: "",
  status: 1, //是否限制
  cid: 1,
});

const categorySelected = ref([]); //-1默认选中顶级栏目
const categoryProps = { checkStrictly: true };
const category = ref([]); //当前所有栏目
const article = reactive({ title: "", article: "" });

// 查询栏目数据
async function query() {
  try {
    let res = await findCategory();
    if (res.code === 200) {
      let dataTree = addLabelValue(tree(res.data));
      category.value = [...dataTree];
    }
  } catch (error) {
    console.log(error);
  }
}

// 选择栏目
function handleChange(e) {
  if (e.length && e[e.length - 1] != -1) {
    params.cid = e[e.length - 1];
  }
}

// 获取文章
async function getArticle() {
  try {
    let { targetUrl, parseData } = params;
    let res = await getArticleApi({ targetUrl, parseData });
    if (res.code == 200) {
      Object.assign(article, res.data);
      ElMessage({
        message: "恭喜你，获取数据成功^_^",
        type: "success",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 新增任务
async function createTask() {
  try {
    let res = await createGather(params);
    if (res.code == 200) {
      ElMessage({
        message: "新增成功^_^",
        type: "success",
      });
      router.go(-1);
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 提交表单
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      createTask();
    } else {
      return false;
    }
  });
}

onMounted(() => {
  query();
});
</script>

<style scoped>
:deep(.show .el-form-item__content) {
  flex-direction: column;
  align-items: start;
}
</style>
