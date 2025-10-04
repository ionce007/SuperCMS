<template>
  <div class="bg-fff pd-10 radius-6">
    <div class="mr-10 ml-10">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first"></el-tab-pane>
        <el-tab-pane label="扩展信息" name="second"></el-tab-pane>
        <el-tab-pane
          label="模型信息"
          name="three"
          v-if="field.length > 0"
        ></el-tab-pane>
      </el-tabs>
    </div>

    <div class="mr-10 ml-10 mb-20">
      <el-form ref="paramsRef" :model="params" label-width="90px">
        <div v-show="activeIndex == 0" v-loading="loading">
          <el-row :gutter="20">
            <el-col :sm="24" :md="12">
              <el-form-item label="文章栏目" >
                <el-cascader
                  :props="categoryProps"
                  :show-all-levels="false"
                  v-model="categorySelected"
                  :options="category"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item
                label="文章标题"
                prop="title"
                :rules="[
                  {
                    required: true,
                    message: '请输入文章标题',
                    trigger: 'blur',
                  },
                  {
                    min: 1,
                    max: 100,
                    message: '标题不能超过100个字',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input v-model="params.title"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="tag标签">
                <el-select-v2
                  v-model="params.tagId"
                  :options="taglist"
                  placeholder="请选择标签"
                  style="width: 240px"
                  multiple
                  filterable
                  remote
                  :remote-method="searchTag"
                />
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="内容属性">
                <el-checkbox-group v-model="params.attr">
                  <el-checkbox label="1" value="1">头条</el-checkbox>
                  <el-checkbox label="2" value="2">推荐</el-checkbox>
                  <el-checkbox label="3" value="3">轮播</el-checkbox>
                  <el-checkbox label="4" value="4">热门</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="params.createdAt"
                  :default-value="new Date()"
                  type="datetime"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item class="flex" label="缩略图">
                <el-upload
                  class="avatar-uploader"
                  :http-request="getupload"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                >
                  <el-popover
                    placement="top-start"
                    title="上传"
                    :width="200"
                    trigger="hover"
                    content="上传图片作为封面图，大小200k内"
                  >
                    <template #reference>
                      <el-icon class="avatar-uploader-icon">
                        <MostlyCloudy />
                      </el-icon>
                    </template>
                  </el-popover>
                </el-upload>

                <el-popover
                  v-if="params.img"
                  placement="right"
                  :width="400"
                  trigger="hover"
                >
                  <template #reference>
                    <el-image
                      class="avatar-uploader-icon pointer ml-10"
                      :src="params.img"
                    />
                  </template>
                  <el-image style="width: 100%" :src="params.img" />
                </el-popover>

                <el-button type="primary" class="ml-10" @click="drawer = true">
                  默认封面图
                </el-button>

                <el-drawer
                  v-model="drawer"
                  title="默认封面图"
                  class="w-300"
                  :with-header="false"
                >
                  <div class="cover row">
                    <el-image
                      v-for="(item, index) of drawerList"
                      :key="index"
                      :src="item"
                      @click="selectCover(item)"
                      fit="cover"
                    />
                  </div>
                </el-drawer>

                <el-input class="ml-10 flex-1" v-model="params.img"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--
          cname   中文名称 varchar 60
          ename   英文名称 varchar 60
          type
          from表单类型
          1单行文本（varchar）
          2.多行文本
          text 3.下拉菜单
          text 4.单选
          text 5.多选
          6.时间和日期
          default  字段配置 男 女
          values   默认值可选 255
          orderBy     字段顺序
          -->
          <el-form-item label="内容摘要">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="params.description"
            ></el-input>
          </el-form-item>

          <el-form-item label="文章内容">
            <vue3-tinymce
              v-model="params.content"
              :setting="setting"
              @init="tinymce"
              script-src="/public/admin/tinymce/tinymce.min.js"
            />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item label="自动封面">
                <el-checkbox v-model="autoImg">
                  文章第
                  <el-input
                    v-model="picNum"
                    class="w-80 mr-8 ml-8"
                    placeholder="请输入内容"
                  ></el-input
                  >张图
                </el-checkbox>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item label="提取描述">
                <el-checkbox v-model="autoDes">提取文章描述</el-checkbox>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12" :lg="8">
              <el-form-item label="是否显示">
                <el-radio v-model="params.status" value="0">发布</el-radio>
                <el-radio v-model="params.status" value="1">不发布</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-show="activeIndex == 1">
          <el-row :gutter="20">
            <el-col :sm="24" :md="12">
              <el-form-item label="短标题" prop="name">
                <el-input v-model="params.shortTitle"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="内容模板">
                <el-select v-model="params.articleView" placeholder="请选择模板">
                    <el-option
                      v-for="item in viewsList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="来源">
                <el-input v-model="params.source"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="作者">
                <el-input v-model="params.author"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="12">
              <el-form-item label="外链跳转">
                <el-input v-model="params.link" max="120"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="浏览数">
                <el-input v-model="params.pv"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-show="(activeIndex == 2) & (field.length > 0)">
          <el-row :gutter="20">
            <!--
            cname   中文名称 varchar 60
            ename   英文名称 varchar 60
            type
            from表单类型 1单行文本（varchar）
            2.多行文本
            text 3.下拉菜单
            text 4.单选
            text 5.多选
            6.时间和日期
            values  默认值可选 255
            default   字段配置 男 女
            orderBy     字段顺序
            -->
            <el-col
              v-for="(item, index) of field"
              :key="index"
              :sm="24"
              :md="24"
              :lg="24"
            >
              <!-- 单行文本 -->
              <el-form-item
                :label="item.cname"
                v-if="['1','7'].includes(item.type)"
              >
                <el-input v-model="item.values" max="120"></el-input>
              </el-form-item>

              <!-- 多行文本 -->
              <el-form-item
                :label="item.cname"
                v-else-if="['2','9'].includes(item.type)"
              >
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="item.values"
                ></el-input>
              </el-form-item>

               <!-- 单选 -->
               <el-form-item
                :label="item.cname"
                v-else-if="['4'].includes(item.type)"
              >
              <el-radio-group v-model="item.values">
                <el-radio
                    v-for="item in item.defaultVal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-radio-group>
            </el-form-item>

            <!-- 下拉菜单 -->
            <el-form-item
                :label="item.cname"
                v-else-if="['3', '5'].includes(item.type)"
              >
                <el-select v-model="item.values" placeholder="请选择">
                  <el-option
                    v-for="item in item.defaultVal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- 时间日期 -->
              <el-form-item   :label="item.cname" v-else-if="item.type === '6'">
                <el-date-picker
                v-model="item.values"
                  :default-value="new Date()"
                  type="datetime"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>

              <!-- 多图上传 -->
              <el-form-item
                :label="item.cname"
                class="flex align-c justify-center"
                v-else-if="item.type === '8'"
              >
                <!-- 图片显示 -->
                <div class="cover flex align-center">
                  <div
                    class="pos-r img-item"
                    v-for="(item, index) of item.values" :key="index"
                  >
                    <el-image :key="index" :src="item.url" fit="cover" />
                    <div class="imgs-btn">
                      <el-icon @click="toPreview(item)"><ZoomIn /></el-icon>
                      <el-icon @click="handleRemove(item)"><Delete /></el-icon>
                    </div>
                  </div>
                </div>
                <!-- 放大 -->
                <el-dialog v-model="dialogVisible">
                  <el-image w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
                <!-- 上传 -->
                <el-upload
                  multiple
                  :http-request="uploadPics"
                  :data="{ ...item, index: index }"
                  :before-upload="beforeUploadPics"
                  :limit="10"
                  :show-file-list="false"
                >
                  <el-icon class="upload-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submit(paramsRef)">保存</el-button>
        </el-form-item>
      </el-form>
    </div>


    <DialogCroper ref="dialogCrop" :img="img" :file="file" @crop="upload"/>
  </div>
</template>

<script  setup>
import { ref, reactive, onMounted} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { find } from "@/api/category.js";
import { create, findField, delfile } from '@/api/article.js';
import { search } from '@/api/tag.js';
import { views } from '@/api/sys_config.js';
import Vue3Tinymce from '@/components/Vue3Tinymce/src/Main.vue';
import DialogCroper from '@/components/ChanDialogCrop/DialogCroper.vue';
import { tinymceSet } from '@/config/tinymce.js';
import { upload, uploadUrl } from '@/api/upload.js';
import {
  addLabelValue,
  getImgUrlFromStr,
  filterHtml,
  tree,
  showErrors
} from '@/utils/tool.js';

const router = useRouter();
// 数据初始化
const setting = reactive({ ...tinymceSet });
const loading = ref(true);
const categorySelected = ref([-1]);
const categoryProps = { checkStrictly: true };
const activeName = ref('first');
const activeIndex = ref('0');
const category = ref([]);
const cateList = ref([]);
const viewsList = ref([]);
const autoImg = ref(false);
const autoDes = ref(false);
const picNum = ref(1);
const taglist = ref([]);
const file = ref();
const dialogCrop = ref();
const paramsRef = ref();
const img = ref('');
const params = reactive({
  cid: 0,
  title: '',
  shortTitle: '',
  tagId: '',
  attr: [],
  articleView: '',
  source: '',
  author: '',
  description: '',
  img: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  content: '欢迎使用SuperCMS系统',
  status: '0',
  pv: 1,
  link: ''
});
const field = ref([]);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const cur = ref(1);

const drawer = ref(false);
const drawerList = ref([
  '/public/cover/01.jpg',
  '/public/cover/02.jpg',
  '/public/cover/03.jpg',
  '/public/cover/04.jpg',
  '/public/cover/05.jpg',
  '/public/cover/06.jpg',
  '/public/cover/07.jpg',
  '/public/cover/08.jpg',
  '/public/cover/09.jpg',
  '/public/cover/10.jpg'
]);

// 方法
const getviews = async () => {
  try {
    const res = await views();
    if (res.code === 200) {
      viewsList.value = res.data
        .filter(item => !['404.html', '500.html'].includes(item))
        .map(item => ({ label: item, value: item }));
        console.log(viewsList.value)
    }
  } catch (error) {
    console.error(error);
  }
};

const searchTag = async (keywords) => {
  try {
    const res = await search(cur.value, keywords);
    if (res.code === 200 && res.data) {
      taglist.value = res.data.list.map(item => ({ label: item.name, value: item.id }));
    }
  } catch (error) {
    console.error(error);
  }
};

const query = async () => {
  try {
    const res = await find();
    if (res.code === 200) {
      const dataTree = addLabelValue(tree(res.data));
      const data = addLabelValue(res.data);
      cateList.value = data;
      category.value = [...dataTree];
    }
  } catch (error) {
    console.error(error);
  }
};

const handleChange = (e) => {
  if (e[0] !== -1) {
    params.cid = e[e.length - 1];
    getfindField(params.cid);
  } else {
    field.value = [];
  }
};

const getfindField = async (cid) => {
  try {
    const res = await findField(cid);
    if (res.code === 200) {
      res.data.fields.forEach(item => {
        if (item.default && item.default.includes('[{') && item.default.includes('options')) {
          const s = JSON.parse(item.default);
          item.default = s.options || [];
        }
        if (item.type === '8') {
          item.values = [];
        }
      });
      field.value = res.data.fields;

    }
  } catch (error) {
    console.error(error);
  }
};

const tinymce = () => {
  loading.value = false;
};

const selectCover = (v) => {
  params.img = v;
};

const handleClick = (tab) => {
  activeIndex.value = tab.index;
};

const beforeUpload = (rawFile) => {
  if (rawFile.type.indexOf('image') === -1) {

	 // eslint-disable-next-line no-undef
	 ElMessage({
        message: '上传文件只能是图片格式',
        type: 'success',
      });
    return false;
  }
  file.value = rawFile;
  const reader = new FileReader();
  reader.onload = async (e) => {
    let data;
    if (typeof e.target.result === 'object') {
      data = window.URL.createObjectURL(new Blob([e.target.result]));
    } else {
      data = e.target.result;
    }
    img.value = data;
    dialogCrop.value.dialogFormVisible = true;
  };
  reader.readAsArrayBuffer(rawFile);
  return true;
};

const getupload = async () => {

  if (file.value.size / 1024 / 1024 > 0.2) {

	 // eslint-disable-next-line no-undef
	 ElMessage({
        message: '上传图片必须小于200k',
        type: 'success',
      });
    return false;
  }
  const fd = new FormData();
  fd.append('file', file.value);
  const res = await upload(fd);
  if (res.code === 200) {
    params.img = res.data.path;
  }
};

const beforeUploadPics = (rawFile) => {
  if (rawFile.type.indexOf('image') === -1) {

	// eslint-disable-next-line no-undef
	ElMessage({
        message: '上传文件只能是图片格式',
        type: 'success',
      });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 0.2) {

	// eslint-disable-next-line no-undef
	ElMessage({
        message: '上传图片必须小于200k',
        type: 'success',
      });
    return false;
  }
};

const uploadPics = async (files) => {
  const { data: { index }, file } = files;
  const fd = new FormData();
  fd.append('file', file);
  const res = await upload(fd);
  if (res.code === 200) {
    const { filename, path } = res.data;
    if (Array.isArray(field.value[index].values)) {
      field.value[index].values.push({ name: filename, url: path });
    } else {
      field.value[index].values = [{ name: filename, url: path }];
    }
  }
};

const toPreview = async (item) => {
  dialogImageUrl.value = item.url;
  dialogVisible.value = true;
};

const handleRemove = async (items) => {
  field.value.forEach((item, index) => {
    if (Array.isArray(item.values)) {
      item.values.forEach((item2, index2) => {
        if (item2.url === items.url) {
          getdelfile(items.url);
          item.values.splice(index2, 1);
        }
      });
    }
  });
};

const getdelfile = async (url) => {
  try {
    await delfile(url);
  } catch (error) {
    console.error(error);
  }
};

const createArticle = async () => {
  try {
    const paramsCopy = { ...params };
    paramsCopy.attr = params.attr.toString();
    paramsCopy.tagId = params.tagId.toString();
    if (!params.img && autoImg.value) {
      params.img = getImgUrlFromStr(params.content)[0];
    }
    if (!params.description && autoDes.value) {
      params.description = filterHtml(params.content).substr(0, 255);
    }
    const fieldParams = field.value.reduce((acc, item) => {
      acc[item.ename] = Array.isArray(item.values) ? JSON.stringify(item.values) : item.values;
      return acc;
    }, {});
    const res = await create({ defaultParams: paramsCopy, fieldParams });
    if (res.code === 200) {

	  // eslint-disable-next-line no-undef
	  ElMessage({
        message: '更新成功^_^',
        type: 'success',
      });
      router.go(-1);
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({ message: res.msg, type: 'error' });
    }
  } catch (error) {
    console.error(error);
  }
};

const submit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, invalidFields) => {
    if (valid) {
      if (params.cid === 0) {

		// eslint-disable-next-line no-undef
		ElMessage({
        message: '请选择栏目^_^',
        type: 'success',
      });
        return;
      }
      createArticle();
    } else {
      showErrors(invalidFields);
    }
  });
};

onMounted(async () => {
  setting.images_upload_url = await uploadUrl();
  await query();
  await searchTag();
  await getviews();
});
</script>
<style lang="less" scoped>
:deep(.tiny-textarea) {
  height: 436px;
}

.cover {
  div {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
}

.w-300 {
  width: 300px !important;
}

:deep(.el-drawer) {
  width: 280px !important;
}
:deep(.el-drawer__body) {
  padding: 0;
}

.imgs-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  gap: 30px;
  display: none;
  transition: all 0.3s;
}

.img-item {
  position: relative;
  margin-right: 10px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
}

.img-item:hover .imgs-btn {
  display: flex;
}

.upload-icon {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
