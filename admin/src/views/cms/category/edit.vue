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
      <el-form ref="paramsRef" :model="params" label-width="84px" class="w640">
        <div v-show="activeIndex == 0">
          <el-form-item label="上级栏目" v-if="params.pid != 0">
            <el-cascader :props="categoryProps" :show-all-levels="false" v-model="categorySelected" :options="category"
              @change="handleChange" placeholder="不选择为顶级栏目">
            </el-cascader>
          </el-form-item>

          <el-form-item label="栏目名称" prop="name" :rules="[
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
          ]">
            <el-input v-model="params.name" @change="createPinyin"></el-input>
          </el-form-item>

          <el-form-item label="栏目标识">
            <el-input v-model="params.pinyin" @change="changePath" placeholder="注：首页请填写home"></el-input>
          </el-form-item>

          <el-form-item label="栏目路径">
            <el-input v-model="params.path"></el-input>
          </el-form-item>

          <el-form-item label="列表模板">
            <el-select v-model="params.listView" placeholder="Select">
              <el-option v-for="item in viewsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="内容模板">
            <el-select v-model="params.articleView" placeholder="Select">
              <el-option v-for="item in viewsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="栏目类型">
            <el-radio v-model="params.type" value="0">栏目</el-radio>
            <el-radio v-model="params.type" value="1">单页</el-radio>
          </el-form-item>

          <el-form-item label="是否显示">
            <el-radio v-model="params.status" value="0">显示</el-radio>
            <el-radio v-model="params.status" value="1">隐藏</el-radio>
          </el-form-item>
        </div>

        <div v-show="activeIndex == 1">
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

        <div v-show="activeIndex == 2">
          <el-form-item label="栏目链接">
            <el-input v-model="params.url"></el-input>
          </el-form-item>

          <el-form-item label="扩展模型">
            <el-radio-group v-model="params.mid">
              <el-radio value="0">基本模型</el-radio>
              <template v-if="modList.length > 0">

                <el-radio :disabled="modelFlag" v-for="(item, index) of modList" :key="index" :value="item.id">
                  {{ item.model }}模型
                </el-radio>
              </template>
            </el-radio-group>
            <el-tooltip content="如果栏目已经存在文章，则不能更换模型" effect="light" placement="top-start">
              <el-icon class="ml-20 pointer">
                <QuestionFilled class="c-165dff" />
              </el-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="打开方式">
            <el-radio v-model="params.target" value="0">当前页面</el-radio>
            <el-radio v-model="params.target" value="1">新页面</el-radio>
          </el-form-item>

          <el-form-item label="栏目排序">
            <el-input v-model="params.orderBy"></el-input>
          </el-form-item>

          <el-form-item label="栏目描述">
            <el-input type="textarea" prop="textarea" :rows="2" v-model="params.description"></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submit('params')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { find, findId, update } from '@/api/category.js';
import { search } from '@/api/article.js';
import { addLabelValue, treeById, tree, } from '@/utils/tool.js';
import { list } from '@/api/model.js';
import { views } from '@/api/sys_config.js';
import { pinyin } from 'pinyin-pro';

const route = useRoute();
const router = useRouter();

const id = ref(route.params.id);
const categorySelected = ref([]); // -1默认选中顶级栏目
const categorySelectedPath = ref('');
const categoryProps = { checkStrictly: true };

const activeName = ref('first'); // tab 默认显示第一个
const activeIndex = ref('0'); // tab 内容默认显示第一个

const paramsRef = ref(null);
const cate = ref([]);
const category = ref([]); // 当前所有栏目
const modList = ref([]); // 模型列表
const modelFlag = ref(false);
const viewsList = ref([]); // 模板
const oldPath = ref(''); // 修改前的path
const params = reactive({
  // 接口入参
  pid: 0,
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  name: '',
  path: '',
  pinyin: '',
  mid: '0',
  description: '',
  url: '',
  orderBy: 0,
  type: '0',
  target: '0',
  status: '0',
  articleView: '',
  listView: '',
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
  activeIndex.value = tab.index;
};

const hasArticle = async () => {
  try {
    let res = await search(1, '', id.value);
    if (res.code == 200) {
      modelFlag.value = res.data.count > 0 ? true : false;
    }
  } catch (error) {
    console.log(error);
  }
};

// 查询
const query = async () => {
  try {
    let res = await find();
    if (res.code === 200) {
      let data = res.data;
      cate.value = data;
      let ids = treeById(id.value, data);
      if (ids.length > 1) {
        ids.length = ids.length - 1;
      }

      categorySelected.value = ids;
      let end = addLabelValue(tree(data));
      category.value = [...end];
    }
  } catch (error) {
    console.log(error);
  }
};

// 查询模板
const getviews = async () => {
  try {
    let res = await views();
    if (res.code === 200) {
      viewsList.value = res.data
        .filter((item) => {
          if (item !== '404.html' && item !== '500.html') {
            return true;
          }
        })
        .map((item) => {
          return {
            label: item,
            value: item,
          };
        });
    }
  } catch (error) {
    console.log(error);
  }
};

// 模型列表
const modelList = async () => {
  try {
    let res = await list();
    if (res.code === 200) {
      modList.value = res.data.list.map((item) => {
        item.id = item.id.toString();
        return item;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// 查
const findById = async () => {
  try {
    let res = await findId(id.value);
    if (res.code === 200) {
      oldPath.value = res.data.path;
      Object.assign(params, res.data);
      let path = [];
      cate.value.forEach((sub) => {
        if (sub.id == res.data.pid) {
          path.push('/' + sub.pinyin);
        }
      });

      categorySelectedPath.value = path.join('') + '/';
    }
  } catch (error) {
    console.error(error);
  }
};

const handleChange = (e) => {
  // 获取路径
  let path = [];
  let ids = Object.values(e);
  ids.forEach((item) => {
    cate.value.forEach((sub) => {
      if (sub.id == item) {
        path.push('/' + sub.pinyin);
      }
    });
  });

  categorySelectedPath.value = path.join('') + '/';
  params.path = categorySelectedPath.value + params.pinyin;
  if (e[0] != -1) {
    params.pid = e[e.length - 1];
  }
};

const checkStrictly = async () => {
  if (params.pinyin == 'article') {
    // eslint-disable-next-line no-undef
    ElMessage({
      message: '不能使用article作为路径',
      type: 'success',
    });
    return false;
  }

  // 正则表达式：首字符必须是字母，后续可以是字母或数字
  const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
  // 检查是否符合正则表达式
  if (!regex.test(params.pinyin)) {
    // eslint-disable-next-line no-undef
    ElMessage({
      message: '拼音只能包含26个字母和数字，且首字母不能是数字',
      type: 'success',
    });
    return false;
  }
  return true;
};

// 更新基本信息
const updateCategory = async () => {
  try {

    let res = await update(params);
    if (res.code) {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: '更新成功^_^',
        type: 'success',
      });
      router.go(-1);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'success',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submit = () => {
  if (oldPath.value != params.path) {
    // eslint-disable-next-line no-undef
    ElMessageBox.confirm(
      '栏目路径已修改，若有子栏目请同步修改！！！',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        checkStrictly() && updateCategory();
      })
      .catch(() => {
        // eslint-disable-next-line no-undef
        ElMessage({
          type: 'info',
          message: '操作取消成功！',
        })
      });
  }else{
    updateCategory();
  }
};

onMounted(() => {
  modelList();
  query();
  findById();
  hasArticle();
  getviews();
});
</script>

<style scoped></style>
