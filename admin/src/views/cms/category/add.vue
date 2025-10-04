<template>
  <div class="bg-fff radius-6 pd-20">
    <div class="mr-10 ml-10">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first"></el-tab-pane>
        <el-tab-pane label="SEO设置" name="second"></el-tab-pane>
        <el-tab-pane label="扩展信息" name="third"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="mr-10 ml-10 mb-20">
      <el-form ref="paramsRef" :model="params" label-width="84px">
        <div v-show="activeIndex === 0">
          <el-form-item label="上级栏目">
            <el-cascader
              :props="categoryProps"
              :show-all-levels="false"
              v-model="categorySelected"
              :options="category"
              @change="handleChange"
              placeholder="不选择为顶级栏目"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item
            label="栏目名称"
            prop="name"
            :rules="[
              {
                required: true,
                message: '请输入栏目名称',
                trigger: 'blur',
              },
              {
                min: 1,
                max: 50,
                message: '栏目不能超过50个字',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="params.name" @change="createPinyin"></el-input>
          </el-form-item>

          <el-form-item label="栏目标识">
            <el-input v-model="params.pinyin" @change="changePath" placeholder="注：首页请填写home"></el-input>
          </el-form-item>

          <el-form-item label="栏目路径">
            <el-input v-model="params.path" disabled></el-input>
          </el-form-item>

          <el-form-item label="列表模板">
            <el-select v-model="params.listView" placeholder="Select">
              <el-option
                v-for="item in viewsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="内容模板">
            <el-select v-model="params.articleView" placeholder="Select">
              <el-option
                v-for="item in viewsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="栏目类型">
            <el-radio v-model="params.type" :label="0">栏目</el-radio>
            <el-radio v-model="params.type" :label="1">单页</el-radio>
          </el-form-item>

          <el-form-item label="是否显示">
            <el-radio v-model="params.status" :label="0">显示</el-radio>
            <el-radio v-model="params.status" :label="1">隐藏</el-radio>
          </el-form-item>
        </div>

        <div v-show="activeIndex === 1">
          <el-form-item label="seo标题">
            <el-input v-model="params.seoTitle"></el-input>
          </el-form-item>

          <el-form-item label="seo关键词">
            <el-input v-model="params.seoKeywords"></el-input>
          </el-form-item>

          <el-form-item label="seo描述">
            <el-input type="textarea" prop="textarea" :rows="2" v-model="params.seoDescription"></el-input>
          </el-form-item>
        </div>

        <div v-show="activeIndex === 2">
          <el-form-item label="栏目链接">
            <el-input v-model="params.url"></el-input>
          </el-form-item>

          <el-form-item label="扩展模型">
            <el-radio-group v-model="params.mid">
              <el-radio :label="0">基本模型</el-radio>
              <el-radio
                v-for="(item, index) in modList"
                :key="index"
                :label="item.id"
                >{{ item.model }}</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="打开方式">
            <el-radio v-model="params.target" :label="0">当前页面</el-radio>
            <el-radio v-model="params.target" :label="1">新页面</el-radio>
          </el-form-item>

          <el-form-item label="栏目排序">
            <el-input v-model="params.orderBy"></el-input>
          </el-form-item>

          <el-form-item label="栏目描述">
            <el-input type="textarea" prop="textarea" :rows="2" v-model="params.description"></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submit(paramsRef)">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {  useRouter } from 'vue-router';
import { views } from '@/api/sys_config.js';
import { find, create } from '@/api/category.js';
import { addLabelValue, tree, showErrors } from '@/utils/tool.js';
import { list } from '@/api/model.js';
import { pinyin } from 'pinyin-pro';

const router = useRouter();
const paramsRef = ref(null);
const categorySelected = ref([]); // -1默认选中顶级栏目
const categorySelectedPath = ref('');
const categoryProps = { checkStrictly: true };
const activeName = ref('first'); // tab 默认显示第一个
const activeIndex = ref(0); // tab 内容默认显示第一个
const category = ref([]); // 当前所有栏目
const modList = ref([]); // 模型列表
const viewsList = ref([]); // 模板
const params = reactive({
  pid: 0,
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  name: '',
  path: '',
  pinyin: '',
  mid: 0,
  description: '',
  url: '',
  orderBy: 0,
  type: 0,
  target: 0,
  status: 0,
  articleView: 'article.html',
  listView: 'list.html',
});

const createPinyin = (v) => {
  params.pinyin = pinyin(v, { toneType: 'none' }).replace(/\s+/g, '');
  params.path = categorySelectedPath.value
    ? categorySelectedPath.value + params.pinyin
    : '/' + categorySelectedPath.value + params.pinyin;
};

const changePath = (v) => {
  params.path = categorySelectedPath.value
    ? categorySelectedPath.value + v
    : '/' + categorySelectedPath.value + v;
};

const handleClick = (tab) => {
  activeIndex.value = parseInt(tab.index);
};

// 查询
const query = async () => {
  try {
    const res = await find();
    if (res.code === 200) {
      const data = addLabelValue(tree(res.data));
      category.value = data;
    }
  } catch (error) {
    console.log(error);
  }
};

// 查询模板
const getviews = async () => {
  try {
    const res = await views();
    if (res.code === 200) {
      viewsList.value = res.data
        .filter((item) => !['404.html', '500.html'].includes(item))
        .map((item) => ({ label: item, value: item }));
    }
  } catch (error) {
    console.log(error);
  }
};

const handleChange = (e) => {
  // 获取路径
  let path = [];
  let ids = Object.values(e);
  ids.forEach((item) => {
    category.value.forEach((sub) => {
      if (sub.id === item) {
        path.push('/' + sub.pinyin);
      }
    });
  });

  categorySelectedPath.value = path.join('') + '/';
  params.path = categorySelectedPath.value + params.pinyin;

  if (e[0] !== -1) {
    params.pid = e[e.length - 1];
  }
};

// 模型列表
const modelList = async () => {
  try {
    const res = await list();
    if (res.code === 200) {
      modList.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  }
};

// 更新基本信息
const categoryAdd = async () => {
  try {
    const res = await create(params);
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
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

const checkStrictly = () => {
  if (params.pinyin === 'article') {
    ElMessage({
      message: '不能使用article作为拼音',
      type: 'error',
    });
    return false;
  }

  // 正则表达式：首字符必须是字母，后续可以是字母或数字
  const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
  // 检查是否符合正则表达式
  if (!regex.test(params.pinyin)) {
    ElMessage({
      message: '拼音只能包含26个字母和数字，且首字母不能是数字',
      type: 'error',
    });
    return false;
  }
  return true;
};

const submit = (paramsRef) => {
  paramsRef.validate((valid, invalidFields) => {
    if (valid) {
      if (checkStrictly()) {
        categoryAdd();
      }
    } else {
      showErrors(invalidFields);
    }
  });
};

onMounted(() => {
  query();
  getviews();
  modelList();
});
</script>

<style scoped></style>
